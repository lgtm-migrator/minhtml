(function() {
    'use strict';
    
    var minify = HTMLMinifier.minify;
    addEventListener('message', async function(event) {
        try {
            var options = event.data.options;
            options.log = function(message) {
                console.log(message);
            };
            postMessage(await minify(event.data.value, options));
        }
        catch (err) {
            postMessage({
                error: err + ''
            });
        }
    });
    postMessage(null);
})();
