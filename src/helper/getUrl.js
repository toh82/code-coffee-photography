module.exports = getUrl

/**
 * This method accepts a relative file path with file name,
 * manipulates it and prepends the base url
 *
 * @public
 *
 * @param {string} path
 * @param {object} options
 *
 * @returns {string}
 */
function getUrl (path, options) {
  if (typeof options.data.root.site.url.base === 'undefined') {
    throw new Handlebars.Exception('site.url.base is not defined');
  }
  var baseUrl = options.data.root.site.url.base;

  return baseUrl + path.replace('\\','/')
}
