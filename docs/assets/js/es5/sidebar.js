"use strict";

function loadSidebar() {
  var sidebarHTML = "<ul class=\"sidebar__list\">\n<li>\n  <a href=\"index.html\"></a>\n  <ul>\n\n    <li>\n      <a href=\"index.html\" >Serve & Build</a>\n    </li>\n    <li>\n      <a href=\"layout.html\" >Layout</a>\n    </li>\n    <li>\n      <a href=\"routing.html\" >Routing</a>\n    </li>\n    <li>\n      <a href=\"navigation.html\" >Navigation</a>\n    </li>\n    <li>\n      <a href=\"breadcrumb.html\" >Breadcrumb</a>\n    </li>\n    <li>\n      <a href=\"authentication.html\" >authentication</a>\n    </li>\n    \n    <li>\n      <a href=\"dependencies.html\" >dependencies</a>\n    </li>\n  </ul>\n</li>\n\n\n</ul>\n";
  var $sidebar = $(".doc-content__sidebar").html(sidebarHTML);
  var path = window.location.pathname;
  var page = path.split("/").pop();

  $sidebar.find('.sidebar__list [href="' + path + '"]').addClass("active");
}