/* 
	@author Andy palmer
	I've come up with a thrown together pseudo templating framework whcih emulates the functionality of a full Java 	framework (like Spring) which we'll use for the actual implementation.
*/


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

function showOverlay(title, actions /* [title, url ...] */, images /* [path ...] */, contentHeader, content, contentAltHeader, contentAlt) {
	// title: 			 Overlay title
	// actions: 		 Quick links on the right of the title (array: [title, url ...]
	// images: 		 	 Gallery images (array: [path ...])
	// contentHeader: 	 Title of left content section
	// content: 		 HTML string of left content section
	// contentAltHeader: Title of right content section
	// contentAlt:		 HTML string of right content section 
	$("#overlay-container").width("100%");
	$("#overlay-container").height("100%");
	$("#overlay-container").load("overlay.html", function() {
		// title
		$("#overlay #overlay-title").html(title);
		// actions
		if (actions != null && actions != undefined) {
			for (var i=0; i < actions.length; i+=2) {
				$("#overlay #overlay-actions").append(
					"<a class='overlay-action' href='"+actions[i+1]+"'>"+actions[i]+"</a>"
				);
			}
		}
		// images
		if (images != null && images != undefined) {
			for (var i=0; i < images.length; i++) {
				$("#overlay #overlay-gallery #gallery-images-container").append(
					"<img src='"+images[i]+"'/>"
				);
			}
		} else {
			$("#overlay #overlay-gallery").width("0");
			$("#overlay #overlay-gallery").height("0");
			$("#overlay #overlay-gallery").css("display", "none");
		}
		// content header
		$("#overlay #overlay-content #panel-1 .content-title").html(contentHeader);
		// content
		$("#overlay #overlay-content #panel-1 .content").html(jQuery.parseHTML(content));
		// content Alt header
		$("#overlay #overlay-content #panel-2 .content-title").html(contentAltHeader);
		// content Alt
		$("#overlay #overlay-content #panel-2 .content").html(jQuery.parseHTML(contentAlt));
		
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
	showOverlay('Example Title', 
	                                                ['an action', 'http://google.com', 'an action 2', 'http://google.com'], 
	                                                ['pages/assets/example_gallery/image1.png', 
	                                                 'pages/assets/example_gallery/image2.png', 
	                                                 'pages/assets/example_gallery/image3.png'], 
	                                                'test content head', 
	                                                'test content <a>with link</a>', 
	                                                'test alt content head', 
	                                                'test alt content <a>with link</a>'
	                                               );
});

$(window).resize(function() {
	wrapContent();
});

