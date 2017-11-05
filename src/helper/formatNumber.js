module.exports = formatNumber

function formatNumber (value) {
    let options = {
        style: 'currency',
        currency: 'EUR'
    }

    let formatter = new Intl.NumberFormat('de-DE', options)
    let commaValue = value.substr(-2)

  return formatter.format(
      value.substr(0, value.length - 2) + '.' + commaValue
  )
}
