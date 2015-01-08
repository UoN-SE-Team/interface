/* 
	@author Andy palmer
	I've come up with a thrown together pseudo templating framework which emulates the functionality of a full Java
	framework (like Spring).
*/

var loadCatalogue = true;
var pages = [[]];
var currentCatPage = 1;


// Loads page content, sets the title and changes the active navbar button
function loadPage(id, title, file, callback) {
	// In the final implementation, we'll be using a full templating framework so SEO won't be a problem
	if (title != document.title) {
		if (title == "Catalogue" && !loadCatalogue) {
			loadCatPage(1, true);
		} else {
			$(id).load(file, function() {
				if (callback != undefined) {
					callback();
				}
				reloadMasonry();
				if (title == "Search") {
					formatCurrencyInput();
				}
			});
		}
		document.title = title + " - " + document.title.split(" - ")[1];
		switchHeader(title);

		if (title == "Catalogue") {
			$(".copyright").css("display", "none");
			$("#arrow-container").css("display", "block");
		}
		else {
			$(".copyright").css("display", "block");
			$("#arrow-container").css("display", "none");
		}
	}
}

// Loads the navbar and sets the active button
function loadHeader(pageName) {
	$("#header").load("header.html", function() {
		switchHeader(pageName);
		var advancedSearch = $("#btn-advanced-search");
		var search = $("#search-box");
		search.focusin(function() {
			advancedSearch.css("visibility", "visible");
		});
		search.focusout(function() {
			window.setTimeout(function() { advancedSearch.css("visibility", "hidden"); }, 300);
		});
		advancedSearch.click(function() {
			loadPage("#content", "Search", "pages/search.html");
		});
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

function showOverlay(title, actions /* [title, url ...] */, images /* [path ...] */, contentHeader, mainContent, contentAltHeader, contentAlt) {
	// title: 			 Overlay title
	// actions: 		 Quick links on the right of the title (array: [title, url ...]
	// images: 		 	 Gallery images (array: [path ...])
	// contentHeader: 	 Title of left content section
	// mainContent: 		 HTML string of left content section
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
		content.find("#panel-1").find(".content-title").html(contentHeader);
		// content
		content.find("#panel-1").find(".content").html(jQuery.parseHTML(mainContent));
		// content Alt header
		content.find("#panel-2").find(".content-title").html(contentAltHeader);
		// content Alt
		content.find("#panel-2").find(".content").html(jQuery.parseHTML(contentAlt));
		
	});
}

function hideOverlay() {
	var container = $("#overlay-container");
	container.width("0");
	container.height("0");
	container.empty();
}

function arrangeCatalogue() {
	var container = $("#content-container");
	var content = $("#content");
	content.masonry("off", "layoutComplete", arrangeCatalogue);
	content.masonry({ transitionDuration: 0 });
	container.css("overflow", "auto");
	if (document.title.contains("Catalogue")) {
		var page = 2;
		var pageNumbers = $("#arrow-content").find("#page-numbers");
		container.css("overflow", "hidden");
		if (pageNumbers.children().length == 0 || loadCatalogue) {
			if (pageNumbers.children().length == 0) pageNumbers.append('<a href="javascript:void(0);" onclick="loadCatPage(1);">1</a>');
			var newPage = true;
			while (newPage) {
				newPage = false;
				content.children().each(function () {
					if ((parseFloat($(this).css("top")) + $(this).outerHeight(true)) > container.innerHeight()) {
						newPage = true;
						if (pages[page-1] == undefined) {
							pages[page-1] = [];
							pageNumbers.append('<a href="javascript:void(0);" onclick="loadCatPage(' + page + ');">' + page + '</a>');
						}
						pages[page-1].push($(this));
						$(this).remove();
						if (page-2 > 0) {
							pages[page-2].splice(pages[page-2].indexOf($(this)), 1);
						}
					} else if (page-1 == 1) {
						if (pages[0] == undefined) pages[0] = [];
						pages[0].push($(this));
					}
				});
				if (newPage) {
					loadCatPage(page, true);
					page++;
				}
			}
			loadCatalogue = false;
			loadCatPage(1, true);
		}
	}
	initMasonry();
}

function loadCatPage(page, force, pageChange) {
	if (currentCatPage != page || force) {
		currentCatPage = page;
		var content = $("#content");
		var arrowContent = $("#arrow-container").find("#arrow-content");
		content.empty();
		for (var i = 0; i < pages[page-1].length; i++) {
			content.append(pages[page-1][i]);
		}
		arrowContent.find("#cat-left").css("visibility", "visible");
		arrowContent.find("#cat-left").attr("onclick", "loadCatPage("+(page-1)+")");
		arrowContent.find("#cat-right").css("visibility", "visible");
		arrowContent.find("#cat-right").attr("onclick", "loadCatPage("+(page+1)+")");
		if (page == 1) {
			arrowContent.find("#cat-left").css("visibility", "hidden");
		}
		if (page == pages.length) {
			arrowContent.find("#cat-right").css("visibility", "hidden");
		}
		reloadMasonry();
	}
}

function formatCurrencyInput() {
	$(".currency").each(function() {
		$(this).before("<span class='currency-symbol'>&#163;</span>");
		$(this).change(function() {
			var min = parseFloat($(this).attr("min"));
			var max = parseFloat($(this).attr("max"));
			var value = $(this).val();
			if(value < min)
				value = min;
			else if(value > max)
				value = max;
			$(this).val(value.toFixed(2));
		});
	});
}

function initMasonry() {
	var content = $("#content");
	content.masonry({
		columnWidth: 20,
		transitionDuration: '0.5s'
	});
	content.masonry("on", "layoutComplete", arrangeCatalogue);
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
});

$(window).resize(function() {
	wrapContent();
});

