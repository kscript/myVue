//实例方法
Vue.extend({
    each: function(source,fn){
        if(source instanceof Array || Vue.isArray(source)){
            for(var i = 0,len = source.length;i < len;i++){
                fn.call(source,i,source[i]);
            }
        }else if(source instanceof Object){
            //var num = 0;
            for(var k in source){
                fn.call(source,k,source[k]);
            }
        }
    },
    isArray: function(o){
        if(o && typeof o==="object"&& isFinite(o.length)){
            if(o.length>=0 && o.length===Math.floor(o.length)&& o.length<4294967296){
                return true;
            }
        }
        return false;
    }
});
