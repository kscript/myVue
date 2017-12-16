(function(window){

    var count = 0;
    var Cache = {
        setOption: function(uid,key,val){
            Cache.uid[uid][key] = val;
        },
        getOption: function(uid,key){
            return Cache.uid[uid][key];
        },
        uid: []
    };
    var todo = document.createComment("");

    function Vue(option){
        return new Vue.fn.init(option);
    }

    Vue.fn = Vue.prototype = {
        constructor: Vue,
        init: function(option){
            //初始化option之前
            option.beforeCreated && option.beforeCreated();
            Vue.createUid.call(this);

            if(option && option instanceof Object){
                Cache.setOption(this.uid, 'option', option);
                Vue.initOption.call(this,option);
            }
            option.created && option.created.call(this);
            return this;
        }
    }

    //使this继承source的属性
    //source[Object]: 来源
    //deep[Boolean]: 是否深拷贝

    Vue.extend = Vue.fn.extend = function (source,deep){
        var self = this;
        for(var key in source){
            if(deep && source[key] instanceof Object){
                self[key] = Vue.extend.call({},source[key],deep);
            }else{
                self[key] = source[key];
            }
        }
        return self;
    }

    //静态方法
    Vue.extend({
        initOption: function(option){
            if(option.el){
                this.el = document.querySelector(option.el);
            }
            this.set(this,'data',{});
            Vue.bindData.call(this,this,'data',option.data||{});
            Vue.bindMethod.call(this,'methods',option.methods);
            Vue.bindMethod.call(this,'filters',option.filters);
            Vue.bindMethod.call(this,'computed',option.computed);
            this.directives = Vue.extend.call(this.directives || {},Vue.directives);

            Vue.parseTpl.call(this);
        },

        bindData: function (obj,k,propertys){
            var self = this;
            var target = obj[k];
            Vue.each(propertys,function(key,item){
                self.set(target, key, item);
                //如果值为对象,继续绑定
                if(item instanceof Object){
                    Vue.bindData.call(self, target, key, item);
                }
            });
            return this;
        },
        //非function将被舍弃
        bindMethod: function(k,methods){
            var self = this;
            self[k] = {};
            Vue.each(methods,function(index,item){
                if(item instanceof Function){
                    self.methods[index] = item;
                }
            })
            // for(var k in methods){
            //     if(methods[k] instanceof Function){
            //         self.method[k] = methods[k];
            //     }
            // }
            return this;
        },

        parseTpl: function(){
            var self = this;
            var data = self.data;
            var dom = Cache.getOption(this.uid,'dom');
            if(!dom){
                dom = self.el.cloneNode(true);
                Cache.setOption(this.uid, 'dom', dom);
            }
            var vnode = dom.cloneNode(true);
            Vue.parseDirective.call(self,vnode,dom);
            Vue.replaceNode(self.el.parentNode,self.el,vnode);
            self.el = vnode;
        },

        withOption: function(str,opt){
            opt = Vue.extend.call({
                _e: Vue.each
            },opt || {});
            var code = 'var methods = this.methods,data = this.data;with(window){with(methods){with(data){with(opt){'+str+'}}}}';
            //console.log(code);
            return new Function('opt',code).bind(this)(opt);
        },

        //设置双向绑定
        //obj[Object]: 要绑定的对象
        //propName[String]: 要绑定的属性
        //value[Every]: 值
        set: function(obj, propName, value) {
            try {
                Object.defineProperty(obj, propName, {
                    get: function() {
                        return value;
                    },
                    set: function(newValue) {
                        //value = newValue;
                    },
                    enumerable: true,
                    configurable: true
                });
            } catch (error) {
                //console.log(error,"browser not supported.");
            }
        },

        createUid: function(){
            count = count || 1;
            Cache.uid[count] = {};
            this.uid = count++;
            return this;
        }
    });


    window.Vue = Vue;
    Vue.fn.init.prototype = Vue.prototype;

})(window);
