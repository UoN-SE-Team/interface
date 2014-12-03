
// Loads page content, sets the title and changes the active navbar button
function loadPage(id, title, file, callback) {
	// In the final implementation, we'll be using a full templating framework so SEO won't be a problem
	if (title != document.title) {
		$(id).load(file, function() {
			if (callback != undefined) {
				callback();
			}
			reloadMasonry();
		});
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

function showOverlay() {
	$("#overlay-container").width("100%");
	$("#overlay-container").height("100%");
	$("#overlay-container").load("overlay.html", function() {
		
	});
}

function hideOverlay() {
	$("#overlay-container").width("0");
	$("#overlay-container").height("0");
	$("#overlay-container").empty();
}

function initMasonry() {
	$('#content').masonry({
		columnWidth: 20
	});
}

function reloadMasonry() {
	$('#content').masonry('reloadItems');
	$('#content').masonry();
}

function wrapContent() {
	// Fit the whole content container on the screen
	$("#content-container").height($("#container").height() - 250);
}

// Event Handlers
$(document).ready(function() {
	loadHeader("Home");
	loadPage('#content', 'Home', 'pages/home.html', initMasonry);
	wrapContent();
});

$(window).resize(function() {
	wrapContent();
});

