
// Loads page content, sets the title and changes the active navbar button
function loadPage(id, title, file) {
	// In the final implementation, we'll be using a full templating framework so SEO won't be a problem
	if (title != document.title) {
		$(id).load(file);
		document.title = title + " - " + document.title.split(" - ")[1];
		switchHeader(title);
	}
}

// Loads the navbar and sets the active button
function loadHeader(pageName) {
	$("#header").load("header.html", function() {
		switchHeader(pageName);
	});
}

// Changes the active navbar button
function switchHeader(pageName) {
	$(".nav-button").each(function() {
		if ($(this).text() == pageName) {
			$(this).attr("class", "nav-button-on");
		}
	});
}

$(document).ready(function() {
	loadHeader("Home");
	loadPage('#content', 'Home', 'pages/home.html');
});
