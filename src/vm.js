//实例方法
Vue.fn.extend({
    set: function(obj, propName, value) {
        var self = this;
        if(obj!==undefined && propName!==undefined){
            try {
                Object.defineProperty(obj, propName, {
                    get: function() {
                        return value;
                    },
                    set: function(newValue) {
                        value = newValue;
                        Vue.parseTpl.call(self);
                    },
                    enumerable: true,
                    configurable: true
                });
            } catch (error) {
                console.log(error,self,arguments,"browser not supported.");
            }
        }
    },
});
