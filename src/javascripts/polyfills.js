String.prototype.uncapitalize = function() {
    return this.charAt(0).toLowerCase() + this.slice(1);
};

String.prototype.toCamelCase = function() {
    return this.uncapitalize().replace(/(\s|\-|\_|\.)+(.)/g, function(match) {
        return match.slice(-1).toUpperCase();
    });
};

String.prototype.underscore = function(separator) {
    if (separator === undefined) separator = '_';
    return this.toCamelCase().replace(/[A-Z]/g, function(match) {
        return separator + match.toLowerCase();
    })
};

String.prototype.wordCount = function() {
    if (this.length) {
        var match = this.match(/(\S+)/g);
        return (match && match.length) || 0;
    } else {
        return 0;
    }
};

String.prototype.wordwrap = function(width = 60, brk = '\n', cut = false) {
    if (this.length === 0) return this;
    var cutExpr = cut ? '|.' + width + '}|.+$' : '|\\S+?(\\s|$)',
        expr = '.{1,' + width + '}(\\s|$)' + cutExpr + '}';
    return this.match(new RegExp(expr, 'g')).map(function(str) {
        return str.trim()
    }).join(brk);
};

Array.prototype.findByKey = function(key, value) {
    return this.find(function(item) {
        return item[key] === value
    });
};