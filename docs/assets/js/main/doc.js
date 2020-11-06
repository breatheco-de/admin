$(document).ready(function() {
  var $examples = $(".doc-example");

  // hilight
  var $codes = $(".code");
  hljs.configure({ useBR: true, tabReplace: "  " });

  $codes.each(function(e) {
    var $code = $(this);
    var code = $code.data("code");
    var language = $code.attr('lang');
    language = language ? [language] : ["xml", "css", "javascript", "json"]
    
    var highlighted = hljs.highlightAuto(code, language);
    $code.addClass("hljs");
    $code.html(hljs.fixMarkup(highlighted.value));
    $code.wrap("<pre></pre>");
  });

  // copy to clipboard
  var clipboard = new ClipboardJS(".btn-clipboard", {
    target: function(trigger) {
      return trigger.parentNode.nextElementSibling;
    }
  });

  clipboard.on("success", function(e) {
    $(e.trigger)
      .attr("title", "Copied!")
      .tooltip("_fixTitle")
      .tooltip("show")
      .attr("title", "Copy to clipboard")
      .tooltip("_fixTitle");

    e.clearSelection();
  });

  clipboard.on("error", function(e) {});

  
  loadHeader();
  loadSidebar();


});