$(function () {
  chrome.storage.sync.get('api_key', function (settings) {
    $.ajax('https://www.pivotaltracker.com/services/v5/projects',{
      headers: {
        'X-TrackerToken': settings.api_key
      }
    }).done( function (project_resources) {
      loadProjectsIntoField(project_resources).change(loadProjectSubResources)

            // $.each(response, function(index, project){
            //  var $option = $('<option></option>').attr('value', project.id).text(project.name);
            //  $projects.append($option);
            // });
  });

    function loadProjectsIntoField(projects){
      var $projects = $('[name=project]');
      $projects.select2({
        data:{results: projects, text: 'name'},
        placeholder: 'Select Project'
      });
      return $projects;
    }

    function loadProjectSubResources() {
      var project_id = $(this).val();
      $.ajax('https://www.pivotaltracker.com/services/v5/projects/'+project_id+'/memberships',{
        headers: {
          'X-TrackerToken': settings.api_key
        }
      }).done( function (response) {
       var $owners = $('[name=owners]');
       var people = $.map(response, function(membership, id){
        return membership.person;
      });
       $owners.prop('disabled', false).select2({
        data:{results: people, text: 'name'},
        multiple: true,
        maximumSelectionSize: 3
      });
     });
    }

    function createReview(e){
      e.preventDefault();

      var data = $('#create_review').serializeObject()
      var project_id = data.project;
      delete data.project;
      if (data.owners !== '') data.owner_ids = data.owners.split(',');
      delete data.owners;
      data.story_type = 'chore';

      $.ajax('https://www.pivotaltracker.com/services/v5/projects/'+project_id+'/stories',
          {
            data: data,
            type: 'POST',
            headers: {
          'X-TrackerToken': settings.api_key
        }
          }
        ).done(function (result) {
          console.log(result);
          alert('Success!');
        })
    }

    $('#create_review').submit(createReview);

    chrome.runtime.onMessage.addListener(
      function(message, sender, sendResponse) {
        $('[name=name]').val('commit '+message.commit_title+' '+message.commit_sha.slice(0,6));
        $('[name=description]').val('commit '+message.commit_sha+'\n'+message.url+'\n\nAuthor(s): '+message.author)
      }
    );

    chrome.tabs.executeScript(null, {file: "jquery-2.1.1.min.js"});
    chrome.tabs.executeScript(null, {file: "extract_commit_data.js"});
  });
});

