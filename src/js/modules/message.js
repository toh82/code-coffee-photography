define(function () {
  'use strict'

  return function () {
    var messageList = null
    var messageTemplate = null
    var messageStatus = null
    var messageText = null

    /**
     * @public
     * @param {string} templateId
     * @param {string} messageListClass
     */
    var init = function (templateId, messageListClass) {
      messageTemplate = document.querySelector(templateId).content
      messageList = $(messageListClass)
    }

    /**
     * @private
     * @param status
     */
    var setStatus = function (status) {
      messageStatus = status
    }

    /**
     * @private
     * @param text
     */
    var setText = function (text) {
      messageText = text
    }

    /**
     * @public
     */
    var render = function () {
      var node = $(document.importNode(messageTemplate, true))
      node.find('.text').text(messageText)
      node.find('.message').addClass('message--' + messageStatus)
      node.find('.button').on('click', function () {
        $(this).parents('.js-closeable').remove()
      })

      messageList.append(node)
    }

    return {
      init: init,
      setMessage: function (status, text) {
        setText(text)
        setStatus(status)
      },
      render: render
    }
  }
})
