$(document).ready(() => {
  const $examples = $('.doc-example');

  // hilight
  const $codes = $('.code');
  hljs.configure({ useBR: true, tabReplace: '  ' });

  $codes.each(function (e) {
    const $code = $(this);
    const code = $code.data('code');
    let language = $code.attr('lang');
    language = language ? [language] : ['xml', 'css', 'javascript', 'json'];

    const highlighted = hljs.highlightAuto(code, language);
    $code.addClass('hljs');
    $code.html(hljs.fixMarkup(highlighted.value));
    $code.wrap('<pre></pre>');
  });

  // copy to clipboard
  const clipboard = new ClipboardJS('.btn-clipboard', {
    target: function target(trigger) {
      return trigger.parentNode.nextElementSibling;
    },
  });

  clipboard.on('success', (e) => {
    $(e.trigger).attr('title', 'Copied!').tooltip('_fixTitle').tooltip('show')
      .attr('title', 'Copy to clipboard')
      .tooltip('_fixTitle');

    e.clearSelection();
  });

  clipboard.on('error', (e) => {});

  loadHeader();
  loadSidebar();
});
