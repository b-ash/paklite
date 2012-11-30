class Email extends Backbone.Model
    url: 'api/v1/create/'

    defaults: ->
        email: ''


module.exports = Email
