ngapp.service('errorService', function($exceptionHandler) {
    this.try = function(callback) {
        try {
            callback();
            return true;
        } catch(x) {
            $exceptionHandler(x)
        }
    };
});
