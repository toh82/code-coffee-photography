requirejs(['modules/domReady', 'modules/message', 'modules/stripe'], function (ready, Message, Stripe) {
  ready(function () {
    var items = document.querySelectorAll('.js-buy')
    var stripe = new Stripe()
    stripe.init(items)
  })
})
