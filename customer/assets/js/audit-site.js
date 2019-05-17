if (typeof(Endeca) == "undefined") Endeca = {};
if (typeof(Endeca.Site) == "undefined") Endeca.Site = {};

Endeca.Site.Audit = {
    contents: {},

    load: function() {
        var slots = Endeca.jQuery('div.endeca-slot');
        for (var i = 0; i < slots.length; i++) {
            var slot = Endeca.jQuery(slots[i]);
            this._makeHighlightBorders(slot);

            slot.hover(
                function() {
                    Endeca.jQuery(this).addClass('endeca-slot-hover');
                },
                function() {
                    Endeca.jQuery(this).removeClass('endeca-slot-hover');
                }
            );
            var audit = Endeca.Locale.localizedString('Audit');
            var button = Endeca.jQuery('<span class="endeca-audit-button flex-button" title="' + audit + '"><ul></ul><span>' + audit + '</span><ol></ol></span>');
            button.mouseover(function() {
                Endeca.jQuery(this).addClass('hover');
            });
            button.mousedown(function() {
                Endeca.jQuery(this).removeClass('hover').addClass('down');
            });
            button.mouseup(function() {
                Endeca.jQuery(this).removeClass('down').addClass('hover');
            });
            button.mouseout(function() {
                Endeca.jQuery(this).removeClass('hover').removeClass('down');
            });

            button.click(
                function() {
                    var zone = Endeca.jQuery(this).parent()[0].getAttribute('zone');
                    Endeca.Site.Iframe.submitRequest('controls.showAuditRules', {zone: zone, auditRuleList: Endeca.Site.Audit.contents[zone]});

                }
            );

            button.appendTo(slot);
        }
    },

    unload: function() {
        var slots = Endeca.jQuery('div.endeca-slot');
        for (var i = 0; i < slots.length; i++) {
            var slot = Endeca.jQuery(slots[i]);
            Endeca.jQuery(slot).removeClass('endeca-slot-hover');
            slot.unbind('mouseenter mouseleave');
        }

        var buttons = Endeca.jQuery('span.endeca-audit-button');
        for (var j = 0; j < buttons.length; j++) {
            var button = Endeca.jQuery(buttons[j]);
            button.remove();
        }

    },

    _makeHighlightBorders: function(slot) {
        var top = Endeca.jQuery('<div class="endeca-slot-highlight-border"></div>');
        top.height(10);
        top.width('100%');
        top.css('top', '-5px');
        top.css('left', '-5px');
        top.appendTo(slot);

        var bottom = Endeca.jQuery('<div class="endeca-slot-highlight-border"></div>');
        bottom.height(10);
        bottom.width('100%');
        bottom.css("bottom", '-5px');
        bottom.css('left', '5px');
        bottom.appendTo(slot);

        var left = Endeca.jQuery('<div class="endeca-slot-highlight-border"></div>');
        left.height('100%');
        left.width(10);
        left.css("top", "5px");
        left.css("left", "-5px");
        left.appendTo(slot);

        var right = Endeca.jQuery('<div class="endeca-slot-highlight-border"></div>');
        right.height('100%');
        right.width(10);
        right.css('top', '-5px');
        right.css('right', '-5px');
        right.appendTo(slot);
    }
};