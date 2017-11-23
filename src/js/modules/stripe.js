define(['modules/message'], function (Message) {
  'use strict'

  return function () {
    var checkoutHandler = null
    var loadingAnimation = $('.js-loading-animation')

    /**
     * @private
     */
    var toggleLoading = function () {
      loadingAnimation.toggleClass('hide')
    }

    /**
     * @private
     * @param {object} token
     */
    var sendCharge = function (token) {
      if (typeof window.StripeItem === 'object') {
        var data = {
          token: token.id,
          item: window.StripeItem
        }

        toggleLoading()

        $.post('/stripe/charge.php', data)
          .done(postSuccessHandler)
          .fail(postFailHandler)
          .always(toggleLoading)
      }
    }

    var postFailHandler = function (response) {
      var message = new Message()
      message.init('#shop-message', '.js-message-list')
      message.setMessage('error', 'Post request failed: ' + response.status + ' ' + response.statusText)
      message.render()
    }

    /**
     * @param {object} response
     * @private
     */
    var postSuccessHandler = function (response) {
      var message = new Message()
      message.init('#shop-message', '.js-message-list')
      message.setMessage(response.status, response.message)
      message.render()
    }

    /**
     * @param {object} event
     * @private
     */
    var buyHandler = function (event) {
      if (typeof window.StripeItem === 'object') {
        window.StripeItem.id = event.target.dataset.id
      } else {
        Object.assign(
          window,
          {
            StripeItem: {
              id: event.target.dataset.id
            }
          }
        )
      }

      checkoutHandler.open({
        description: event.target.dataset.name,
        amount: Number(event.target.dataset.amount)
      })

      event.preventDefault()
    }

    /**
     * @param {object} items
     * @public
     */
    var init = function (items) {
      items.forEach(function (element) {
        element.addEventListener('click', buyHandler)
      })

      checkoutHandler = StripeCheckout.configure({
        key: 'pk_live_K1wvvzuIoSC8QLlqwC0vmDxy',
        image: 'assets/ccp-shop-icon.png',
        currency: 'eur',
        billingAddress: false,
        name: 'Code Coffee & Photography',
        token: sendCharge
      })

      window.addEventListener('popstate', function () {
        checkoutHandler.close()
      })
    }

    return {
      init: init
    }
  }
})

