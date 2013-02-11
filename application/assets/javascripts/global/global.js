/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var URIHelper = function() {
    var URIQueries = function(input) {

        var result = {}, queryString = input.substr(input.indexOf('?')+1),
        re = /([^&=]+)=([^&]*)/g, m;
//        console.log(queryString);
        while (m = re.exec(queryString)) {
            result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }

        return result;
    };
    var getQueryResult = function(input, key) {
        return URIQueries(input)[key];
    }
    return {
        lookupQuery: getQueryResult
    }
}();