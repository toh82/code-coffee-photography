Zepto(function ($) {
  'use strict'

  var hashFilterItems = $('.js-hash-filter')
  if (hashFilterItems.length === 0) {
    return
  }

  hashFilterItems.addClass('hash-filter')

  /**
   * @public
   * @returns {void}
   */
  function highlightHashItems () {
    var hash = location.hash.replace('#', '')

    if (hash === '') {
      hashFilterItems.removeClass('hash-filter--no')
      return
    }

    hashFilterItems.addClass('hash-filter--no')

    $.each(hashFilterItems, function () {
      var item = $(this)
      var hasTag = item.data('tags').indexOf(hash) !== -1

      if (hasTag) {
        item.removeClass('hash-filter--no')
      }
    })
  }

  highlightHashItems()
  window.onhashchange = highlightHashItems
})
