"use strict";

function loadHeader() {
  var headerHTML = "<div class=\"brand mr-md\">\n  <a href=\"#\">Matx React</a>\n  <small>v1.0.0</small>\n</div>\n<button type=\"button\" class=\"sidebar-toggle btn rounded-circle btn-raised btn-raised-default btn-icon\" aria-label=\"Close\">\n  <i class=\"ti-menu\"></i>\n  <i class=\"ti-close\"></i>\n</button>\n<span class=\"flex-grow-1\"></span>\n<a href=\"http://matx-react-pro.ui-lib.com/\" class=\"btn btn-link btn-link-secondary mr-md d-none d-sm-block\">Live Preview</a>\n\n<a href=\"https://ui-lib.com/downloads/matx-pro-react-material-design-admin-template\" class=\"btn btn-raised btn-raised-success\">Buy</a>";

  $(".doc-header").html(headerHTML);

  // Collapsible sidebar
  $(".sidebar-toggle").on("click", function () {
    $(".wrapper").toggleClass("sidebar-open");
  });
}