commit_data = {
	commit_title: $('.commit-title').text().trim(),
	commit_sha: $('.sha-block:contains(commit) .sha').text().trim(),
	url: window.location.toString(),
	author: $('.author-name').text().trim()
};

chrome.runtime.sendMessage(commit_data);