if (typeof(Endeca) == "undefined") Endeca = {};  
if (typeof(Endeca.Site) == "undefined") Endeca.Site = {};  

Endeca.Site.Iframe = {
    pendingRequests : {},
    
    /**
     * Submit a request to the other iframe. Each request contains a method name and options.
     * 
     * Known requests sent from the site iframe to the preview iframe:
     * 
     * method: 'site.dom.ready'
     * opts: {location : "site's url", title : "site's title"} 
     * comment: Tell the controls the site's dom has is ready, and sends the controls the site's location and title
     * response: none
     * 
     * method: 'controls.showAuditRules', 
     * opts: {zone : "the zone to show", auditRuleList : "the audit rules data"}
     * comment: Tell the controls to show (render) the audit rules table, giving the controls the data to render
     * response: none
     * _______________________________________
     * Known methods sent from the preview iframe to the site iframe:
     * 
     * method: 'app.body.innerWidth' 
     * opts: none
     * comment: Query for the site's inner width
     * response: integer 
     * 
     * method: 'app.loadAudit' 
     * opts: none
     * comment: Tell the site to load the audit controls that live on the site
     * response: none 
     *
     * method: 'app.ajax' 
     * opts: {url : "the link url"}
     * comment: Query the site to via Endeca.jQuery.ajax
     * response: data from Endeca.jQuery.ajax
     *
     * @param method - a string identifying the request
     * @opts opts - an object with two purposes:
     * 1. send data to the other iframe associated with this method by adding properties to the object
     * 2. register a success and error callback for this method
     * {
     *   success : function(data) { // A function called if the method expects data to be returned by the other iframe },
     *   error : function(error) { // A function called if the other iframe returns an error }
     * }
     * 
     * @see handleMessage
     */
     submitRequest: function(method, opts) {
        if (Endeca.Site.Iframe.pendingRequests[method]) {
            // We'll have to queue up and wait somehow
        }
        Endeca.Site.Iframe.pendingRequests[method] = opts;
        
        var messageOpts = {};
        for (var opt in opts) {
            if (typeof opts[opt] !== 'function') {
                messageOpts[opt] = opts[opt];
            }
        }
        
        Endeca.Site.Iframe._postMessage({method: method, opts: messageOpts});    
    },
    
    /**
     * Handle a message from the other iframe
     * Here are the conventions:
     * 
     * 1. Messages (event.data) are always JSON objects of the following two formats:
     * 
     * i. If we are receiving a request from the other iframe:
     * { 
     *   method: "some string", 
     *   opts : { ... } 
     * }
     * 
     * ii. If we are receiving a response from the other iframe to a request that we originated
     * in this iframe:
     * { 
     *   request : { method : "some string", opts : { ...} },
     *   error : "error message if there was an error",
     *   data : "the data we requested when we submitted the request, as a string, integer, or object"
     * }
     */
    handleMessage: function(jEvent) {
        var event = jEvent.originalEvent;
        try {
            var data = Endeca.JSON.parse(event.data);
            if (data.method) {
                // i. Handle requests we receive from the other iframe
                var request = data;
                
                if (request.method === 'app.body.innerWidth') {
                    Endeca.Site.Iframe._sendResponse(event, request, Endeca.jQuery('body').innerWidth());
                } else if (request.method === 'app.loadAudit') {
                    Endeca.Site.Audit.load();
                } else if (request.method === 'app.unloadAudit') {
                    Endeca.Site.Audit.unload();
                } else if (request.method === 'app.ajax') {
                    Endeca.jQuery.ajax({
                        url: request.opts.url,
                        success: function(data, textStatus, jqXHR) {
                            Endeca.Site.Iframe._sendResponse(event, request, data);
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                        }
                    });
                    
                }
            } else {
                // ii. Handle responses we receive from the other iframe
                var response = data;
                var method = response.request.method;
                var opts = Endeca.Site.Iframe.pendingRequests[method];
                if (opts) {
                    if (response.error && opts.error) {
                        opts.error(response.error);
                    } else if (response.data && opts.success) {
                        opts.success(response.data);
                    }
                    Endeca.Site.Iframe.pendingRequests[method] = null;
                }
            }
            
            
        } catch (e) {
            // Fail silently
            alert(e);
        }
    },
    
    _sendResponse: function(event, request, data) {
        Endeca.Site.Iframe._postMessage({request: request, data : data});
    },
        
    _postMessage : function(data) {
        // We know the preview application is sitting in an iframe inside the IFCR application
        if (window.parent && window.parent != window) {    
            window.parent.postMessage(Endeca.JSON.stringify(data), '*');
        }
    },

    setCookie : function(name, urlgen) {
        var value = urlgen.getParam(name);
        // Only set the cookie value if a URL parameter exists.
        if (value !== null) {
            Endeca.Util.setCookie(name, value);
        }
    }
};

// For unit tests, protect against jQuery being undefined.
if (typeof(Endeca.jQuery) !== "undefined") {
    Endeca.jQuery(window).bind('message', Endeca.Site.Iframe.handleMessage);

    Endeca.jQuery(document).ready(function() {
        var urlgen = new Endeca.UrlGen();
        Endeca.Site.Iframe.setCookie(Endeca.Util.DEVICE_PARAM, urlgen);
        Endeca.Site.Iframe.setCookie(Endeca.Util.TIME_PARAM, urlgen);
        Endeca.Site.Iframe.setCookie(Endeca.Util.PROFILES_PARAM, urlgen);

        Endeca.Site.Iframe.submitRequest('site.dom.ready', {location: location.toString(), title: document.title});
    });
}