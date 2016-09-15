define([
    'jquery',
    'underscore',
    'utility',
    'jquery/ui'
], function($, _, utility) {
    'use strict';

    /* A popup like a tooltip, not a modal. */

    $.widget('drgz.simplePopup', {
        options: {
            contentSelector: '.popup-content',
            positionContent: false,
            leftOffset: 0,
            topOffset: 0
        },

        _create: function () {
            var self = this;

            self.popupContent = self._findContent();

            self._bindEvents();
            self.element.trigger('popupInitialized', [self.popupContent]);
        },

        _findContent: function () {
            var self = this;
            return self.element.find(self.options.contentSelector).length ?
                self.element.find(self.options.contentSelector) :
                self.element.siblings(self.options.contentSelector).length ?
                    self.element.siblings(self.options.contentSelector) :
                    self.element.siblings().find(self.options.contentSelector).length ?
                        self.element.siblings().find(self.options.contentSelector) :
                        $(self.options.contentSelector);
        },

        _bindEvents: function () {
            var self = this;
            self.element.on('click', function (event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                if (!self.element.hasClass('popup-visible')) {
                    self.showPopup();
                } else {
                    self.hidePopup();
                }
            });

            self.popupContent.find('.close-popup').on('click', function (event) {
                event.preventDefault();
                self.hidePopup();
            });
        },

        showPopup: function () {
            var self = this;

            self.popupContent.show();
            self.element.addClass('popup-visible');
            self.popupContent.addClass('popup-visible');

            $('body').on('click.simplePopup', function (event) {
                if (!utility.contains(self.popupContent, event.target, true)) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    self.hidePopup();
                }
            });
            self.element.trigger('popupOpen', [self.popupContent]);

            if (self.options.positionContent) {
                self._setContentPosition();
                $(window).on('resize.simplePopup orientationchange.simplePopup', function() {
                    self._setContentPosition();
                });
            }
        },

        hidePopup: function () {
            var self = this;

            self.element.removeClass('popup-visible');
            self.popupContent.removeClass('popup-visible');
            self.popupContent.hide();
            $('body').off('click.simplePopup');
            $(window).off('resize.simplePopup orientationchange.simplePopup');

            self.element.trigger('popupClose', [self.popupContent]);
        },

        _setContentPosition: function () {
            var self = this;
            var top = self.element.offset().top + self.element.outerHeight();
            var left = self.element.offset().left - self.popupContent.outerWidth()/2 + self.element.outerWidth()/2;

            top = top + self.options.topOffset;
            left = left + self.options.leftOffset;

            self.popupContent
                .css('position', 'absolute')
                .css('top', top)
                .css('left', left);
        }
    });
    
    return $.drgz.simplePopup;
});
