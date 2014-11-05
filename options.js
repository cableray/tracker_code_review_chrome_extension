$(function(){
	chrome.storage.sync.get('api_key', function (values) {
		$('[name=api_key]').val(values.api_key);
	})
	$('#save_settings').click(function (e) {
		var api_key = $('[name=api_key]').val();
		chrome.storage.sync.set({api_key: api_key}, function () {
			$('#status').html('Settings Saved');
		});
	});
});