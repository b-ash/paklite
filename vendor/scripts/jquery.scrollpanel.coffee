(($) ->
    pluginName = 'scrollPanel'

    defaults =

        buffer: if $.browser.webkit then 0 else 50
        topPadding: 20
        animate: undefined
        scrollContainer: $(window)
        heightOffset: 100 + ($('footer').outerHeight() or 0)
        minWidth: 950

        top: ($el, options) ->
            $el.offset().top - (options.threshold $el, options)

        threshold: ($el, options) ->
            $el.offset().top -
                parseFloat($el.css('marginTop').replace('auto', 0)) -
                (parseFloat($('#hsnavigation, #nav.failure').outerHeight()) or 0) -
                options.topPadding

        thresholdCheck: ($el, options) ->
            scrollTop = options.scrollContainer.scrollTop()

            if scrollTop >= options.cached.threshold and options.scrollContainer.height() > ($el.outerHeight() + options.heightOffset) and Math.max(options.scrollContainer.width(), options.scrollContainer.outerWidth()) > options.minWidth
                options.setFixed $el, options
            else
                options.setStatic $el, options

        setFixed: ($el, options) ->
            $el.css 'position', 'fixed'
            options.change 'fixed', $el, options

        setStatic: ($el, options) ->
            $el.css 'position', 'static'
            options.change 'static', $el, options

        change: ->

    methods =

        init: (opts) ->
            @each ->
                $el = $ @
                options = $.extend(true, {}, defaults, opts)
                $el.data pluginName, options

                options.cached = {}
                options.cached.top = if typeof options.top == 'number' then options.top else options.top $el, options
                options.cached.threshold = if typeof options.threshold == 'number' then options.threshold else options.threshold $el, options

                $el[pluginName] 'setupEvents'

        setupEvents: ->
            $el = $ @
            options = $el.data(pluginName)

            lastScroll = null

            $el.css 'top', options.cached.top

            @onScroll = (e) =>
                if lastScroll and (+new Date()) - lastScroll < options.buffer
                    unless @scrollTimeout
                        @scrollTimeout = setTimeout @onScroll, options.buffer
                    return

                clearTimeout @scrollTimeout
                @scrollTimeout = null

                lastScroll = +new Date()

                options.thresholdCheck $el, options

                if options.animate then options.animate(e, $el, options)

            options.scrollContainer.bind 'scroll resize', @onScroll

            $el

    $.fn[pluginName] = (options) ->
        if methods[options]
            methods[options].apply @, Array::slice.call(arguments, 1)
        else if typeof options is 'object' or not options
            methods.init.apply @, arguments
        else
            $.error "jQuery.#{pluginName}: Method #{options} does not exist"

) jQuery