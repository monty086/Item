
//public公用的方法
var public=(function () {
    var browser = 'getComputedStyle' in window
    function toArray(likeArray) {
        if(browser){
            return [].slice.call(likeArray)
        }else{
            var ary = [];
            for(var i=0;i<likeArray.length;i++){
                ary.push(likeArray[i])
            }
            return ary
        }
    }
    function toJsonObj(jsonStr) {
        if(browser){
            return  JSON.parse(jsonStr);
        }else{
            return  eval('('+jsonStr+')')
        }
    }
    return {
        toArray:toArray,
        toJsonObj:toJsonObj
    }
})();