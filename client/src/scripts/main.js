/* 
	@author Andy palmer
	I've come up with a thrown together pseudo templating framework which emulates the functionality of a full Java
	framework (like Spring).
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
		if ($(this).text().trim() == pageName) {
			$(this).addClass("on");
		} else {
			$(this).removeClass("on");
		}
	});
	if (pageName == "Home") {
		$("#page-title").text("Welcome to Fotheby's");
	} else {
		$("#page-title").text(pageName);
	}
}

function showOverlay(title, actions /* [title, url ...] */, images /* [path ...] */, contentHeader, content, contentAltHeader, contentAlt) {
	// title: 			 Overlay title
	// actions: 		 Quick links on the right of the title (array: [title, url ...]
	// images: 		 	 Gallery images (array: [path ...])
	// contentHeader: 	 Title of left content section
	// content: 		 HTML string of left content section
	// contentAltHeader: Title of right content section
	// contentAlt:		 HTML string of right content section
	var overlayContainer = $("#overlay-container");
	overlayContainer.width("100%");
	overlayContainer.height("100%");
	overlayContainer.load("overlay.html", function() {
		var overlay = $("#overlay");
		// title
		overlay.find("#overlay-title").html(title);
		// actions
		if (actions != null && actions != undefined) {
			for (var i=0; i < actions.length; i+=2) {
				overlay.find("#overlay-actions").append(
					"<a class='overlay-action' href='"+actions[i+1]+"'>"+actions[i]+"</a>"
				);
			}
		}
		// images
		if (images != null && images != undefined) {
			for (var j=0; j < images.length; j++) {
				overlay.find("#overlay-gallery").find("#gallery-images-container").append(
					"<img src='"+images[j]+"'/>"
				);
			}
		} else {
			var gallery = overlay.find("#overlay-gallery");
			gallery.width("0");
			gallery.height("0");
			gallery.css("display", "none");
		}
		// content header
		var content = overlay.find("#overlay-content");
		content.find("#panel-1 .content-title").html(contentHeader);
		// content
		content.find("#panel-1 .content").html(jQuery.parseHTML(content));
		// content Alt header
		content.find("#panel-2 .content-title").html(contentAltHeader);
		// content Alt
		content.find("#panel-2 .content").html(jQuery.parseHTML(contentAlt));
		
	});
}

function hideOverlay() {
	var container = $("#overlay-container");
	container.width("0");
	container.height("0");
	container.empty();
}

function initMasonry() {
	$('#content').masonry({
		columnWidth: 20
	});
}

function reloadMasonry() {
	var content = $("#content");
	content.masonry('reloadItems');
	content.masonry();
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
	/*showOverlay('Example Title',
				['an action', 'http://google.com', 'an action 2', 'http://google.com'],
				['pages/assets/example_gallery/image1.png',
				 'pages/assets/example_gallery/image2.png',
				 'pages/assets/example_gallery/image3.png'],
				'test content head',
				'test content <a>with link</a>',
				'test alt content head',
				'test alt content <a>with link</a>'
			   );*/
});

$(window).resize(function() {
	wrapContent();
});

