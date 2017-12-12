module.exports = list

var Glob = require('glob')
var Fs = require('fs')
var _ = require('underscore')

/**
 * @private
 * @param {object} items
 * @param {object} options
 * @returns {string}
 */
function renderList (items, options) {
    if (items.length === 0) {
        return ''
    }

    var itemsHtml = ''
    items.forEach(function (item) {
        itemsHtml = itemsHtml + options.fn(item)
    })

    return itemsHtml
}

/**
 * @param {string} srcProducts
 * @param {object} options
 * @returns {string}
 * @public
 */
function list (srcProducts, options) {
    let content = Fs.readFileSync(srcProducts)
    let items = JSON.parse(content.toString())

    return renderList(items, options)
}