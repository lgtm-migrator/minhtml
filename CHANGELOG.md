## v0.1.0
* BREAKING: Dropped support for Node.JS version 6.x
* Updated dependencies with security vulnerabilities
* Updated most other dependencies
* Updated package.json 
* Updated README

## v0.2.0
* BREAKING: Dropped support for Node.JS version 8.x
* Updated dependencies that have been waiting on dropping support for Node.JS version 8.x
* Added support for Node.JS version 16.x
* Created this changelog
* Updated README and examples which were saying ``html-minifier-terser`` to reflect package rename.

## v0.3.0
* HOTFIX: Fixed the CLI which got broken due to updating the ``commander`` package in v0.1.0
* Dev: Migrated ESLint and Terser-related things away from Grunt
* Dev: Dropped the ``isNodejsVersionSupported`` function defined in Grunt configuration

## v0.4.0
* BREAKING: Updated the clean-css package to latest - From now on, quotes inside CSS ``url()`` will not be stripped. 


## v0.5.0
* BREAKING: Updated the terser package - From now on, minify() will be async.
* The license is now shipped with this package.
* The CLI now outputs a help message if no argument has been specified.
* `meter` and `output` tags are now treated as inline tags.
* Mustache templates are now officially supported.
* Updated the clean-css package

## v0.5.1
* Just updated this changelog which I forgot about when releasing v0.5.0.
