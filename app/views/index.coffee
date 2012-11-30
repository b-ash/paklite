View = require './view'
Email = require '../models/email'

class IndexView extends View
    el: '.main-page'
    template: require './templates/index'
    events:
        'keypress #email-form' : 'inputChange'
    dom: {}

    afterRender: =>
        @dom.emailForm = $('#email-form')
        @dom.overlay = $('#overlay')

    inputChange: (event) =>
        if event.keyCode is 13
            @submitEmail()

    submitEmail: =>
        @$('#success').remove()

        email = new Email()
        email.save 'email', @dom.emailForm.val(),
            success: =>
                @dom.emailForm.val('')
                @dom.overlay.height(315)
                @dom.emailForm.after require('./templates/success')()


module.exports = IndexView
