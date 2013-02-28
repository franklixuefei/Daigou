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

function cutstring (string, max_length, suffix) {
    var length = 0;
    var ret = '';
    var suffixFlag = false;
    for (var i=0; i<string.length; i++) {
        length += string.charCodeAt(i) < 0 || string.charCodeAt(i) > 255 ? 2 : 1;
        if (length > max_length) {
            suffixFlag = true;
            break;
        }
            
        ret += string.substr(i, 1);
    }
    return suffixFlag?ret+suffix:ret;
}