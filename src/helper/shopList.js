module.exports = shopList

var Glob = require('glob')
var Fs = require('fs')
var _ = require('underscore')

/**
 * @private
 * @param {object} items
 * @param {object} options
 * @returns {string}
 */
function renderArticleList (items, options) {
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
function shopList (srcProducts, options) {
    let files = Glob.sync(srcProducts + '/*.json')
    let items = []

    files.forEach(file => {
        let content = Fs.readFileSync(file)
        items.push(JSON.parse(content.toString()))
    })

    return renderArticleList(items, options)
}