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
    proxy: function(key) {
        var self = this;
        var newKey = '_'+key;
        var value = self[key];

        if(!self[key]){
            self.set(self,key,{});
        }
        try {
            Object.defineProperty(self, newKey , {
                get: function() {
                    console.log(arguments,1);
                    return value;
                },
                set: function(newValue) {
                    console.log(arguments,1);
                    value = newValue;
                },
                enumerable: true,
                configurable: true
            });
        } catch (error) {
            console.log(error,self,arguments,"browser not supported.");
        }
            //console.log(arguments);
            //return this.set.apply(this,arguments);

    },
});
