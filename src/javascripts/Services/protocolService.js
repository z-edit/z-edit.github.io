ngapp.service('protocolService', function($document) {
    this.init = function(scope) {
        var handleDocsLink = function(href) {
            scope.$broadcast('helpNavigateTo', href.substr(7));
        };

        var protocolHandlers = {
            docs: handleDocsLink
        };

        var handleLink = function(href) {
            var protocol = href.match(/([^:]+)/)[1],
                handler = protocolHandlers[protocol];
            handler && handler(href);
            return !!handler;
        };

        // handle link protocols properly
        $document.bind('click', function(event) {
            if (event.target.tagName !== 'A') return;
            if (!event.target.href) return;
            if (handleLink(event.target.href)) event.preventDefault();
        });
    };
});
