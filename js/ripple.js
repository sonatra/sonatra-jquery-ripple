/*
 * This file is part of the Sonatra package.
 *
 * (c) François Pluchino <francois.pluchino@sonatra.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global define*/
/*global jQuery*/
/*global window*/

/**
 * @param {jQuery} $
 */
(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    /**
     * Display the ripple effect on click event.
     *
     * @param {jQuery.Event|Event} event
     *
     * @private
     */
    function onClick(event) {
        var self = event.data,
            $target = $(event.currentTarget),
            $ripple = $('> .ripple', $target),
            size;

        if (0 === $ripple.length) {
            $ripple = $('<span class="ripple"></span>');
            $ripple.addClass('ripple-' + self.options.rippleTheme);

            $target.prepend($ripple);
        } else {
            $target.removeClass("ripple-action");
        }

        if(!$ripple.width() && !$ripple.height()) {
            size = Math.max($target.outerWidth(), $target.outerHeight());
            $ripple.css({
                height: size,
                width: size
            });
        }

        $ripple.css({
            left: event.pageX - $target.offset().left - $ripple.width() / 2 + 'px',
            top: event.pageY - $target.offset().top - $ripple.height() / 2
        });
        $target.addClass("ripple-action");
    }

    // RIPPLE CLASS DEFINITION
    // =======================

    /**
     * @constructor
     *
     * @param {string|elements|object|jQuery} element
     * @param {object}                        options
     *
     * @this Ripple
     */
    var Ripple = function (element, options) {
        this.guid     = $.guid;
        this.options  = $.extend(true, {}, Ripple.DEFAULTS, options);
        this.$element = $(element);

        if ('' === this.options.rippleSelector) {
            this.options.rippleSelector = null;
        }

        this.$element.on('click.st.ripple' + this.guid, this.options.rippleSelector, this, onClick);
    },
        old;

    /**
     * Defaults options.
     *
     * @type Array
     */
    Ripple.DEFAULTS = {
        rippleSelector: null,
        rippleTheme: 'light'
    };

    /**
     * Destroy instance.
     *
     * @this Ripple
     */
    Ripple.prototype.destroy = function () {
        var $targets = null !== this.options.rippleSelector ?
            $(this.options.rippleSelector, this.$element)
            : this.$element;

        this.$element.off('click.st.ripple' + this.guid, this.options.rippleSelector, onClick);

        $targets.each(function(index, target) {
            $('> .ripple', target).remove();
            $(target).removeClass('ripple-action');
        });
    };


    // RIPPLE PLUGIN DEFINITION
    // ========================

    function Plugin(option, value) {
        return this.each(function () {
            var $this   = $(this),
                data    = $this.data('st.ripple'),
                options = typeof option === 'object' && option;

            if (!data && option === 'destroy') {
                return;
            }

            if (!data) {
                data = new Ripple(this, options);
                $this.data('st.ripple', data);
            }

            if (typeof option === 'string') {
                data[option](value);
            }
        });
    }

    old = $.fn.ripple;

    $.fn.ripple             = Plugin;
    $.fn.ripple.Constructor = Ripple;


    // RIPPLE NO CONFLICT
    // ==================

    $.fn.ripple.noConflict = function () {
        $.fn.ripple = old;

        return this;
    };


    // RIPPLE DATA-API
    // ===============

    $(window).on('load', function () {
        $('[data-ripple]').each(function () {
            var $this = $(this);
            Plugin.call($this, $this.data());
        });
    });

}));