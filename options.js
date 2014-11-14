$(function(){
	chrome.storage.sync.get(null, function (values) {
		setFormValues($('#settings'), values)
	})
	$('#settings').submit(function (e) {
		e.preventDefault();
		var form = $(this).serializeObject();

		chrome.storage.sync.set(form, function () {
			$('#status').html('Settings Saved');
		});
	});
});

function setFormValues($form, values) {
	$.each(values, function(key, value){
		if (value) $('[name='+key+']', $form).val(value);
	});
}