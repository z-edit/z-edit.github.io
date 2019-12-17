ngapp.service('protocolService', function($document) {
    this.init = function() {
        var handleDocsLink = function(href, target) {
            target.href = '#/docs?t=' + href.substr(7);
        };

        var protocolHandlers = { docs: handleDocsLink };

        var handleLink = function(href, target) {
            var protocol = href.match(/([^:]+)/)[1],
                handler = protocolHandlers[protocol];
            handler && handler(href, target);
        };

        // handle link protocols properly
        $document.bind('mousedown', function(event) {
            if (event.target.tagName !== 'A') return;
            if (!event.target.href) return;
            handleLink(event.target.href, event.target)
        });
    };
});
