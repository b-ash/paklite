View = require './view'

class IndexView extends View
    el: '.main-page'
    template: require './templates/index'

    initialize: =>

module.exports = IndexView
