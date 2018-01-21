module.exports = getVersion

var Glob = require('glob')
var Fs = require('fs')

/**
 * @param {string} pathToPackage
 * @returns {string}
 */
function getVersionFromPackageFile (pathToPackage)
{
    let packageFileContent = Fs.readFileSync(pathToPackage)
    let packageFileJson = JSON.parse(packageFileContent.toString())

    return packageFileJson.version
}

/**
 * @param {string} pathToPackage
 * @returns {string}
 * @public
 */
function getVersion (pathToPackage) {
    if (typeof pathToPackage === 'string') {
        return getVersionFromPackageFile(pathToPackage)
    }
    
    return (new Date()).getTime()
}