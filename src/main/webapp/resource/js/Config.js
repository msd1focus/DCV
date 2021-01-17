'use strict';

App.factory('Config', [function(){
    var baseurl = window.location.origin;
    var cp = window.location.pathname.split('/');
    return {
            host                    : baseurl,
            contextPath     : "/" + cp[1]
    };
}]);

