Vue.extend({
    directives:{
        "v-if": {
            bind: function(vm,root,node){
                this.vm = vm;
                this.root = root;
                this.node = node;
            },
            get: function(){
                this.sent = this.node.getAttribute("v-if");
                this.node.removeAttribute("v-if");
                return this.sent !== null;
            },
            parse: function(){
                var self = this;
                self.vif = Vue.withOption.call(self.vm,"return "+self.sent);
            },
            insert: function(){
                !this.vif && Vue.replaceNode(this.root,this.node,document.createComment(""));
            },
            unbind: function(){
                delete this.vm;
                delete this.root;
                delete this.node;
            }
        },
        "v-model": {
            bind: function(vm,root,node){
                this.vm = vm;
                this.root = root;
                this.node = node;
            },
            get: function(){
                this.sent = this.node.getAttribute("v-model");
                this.node.removeAttribute("v-model");
                return this.sent !== '';
            },
            parse: function(){
                var self = this;
                self.vmodel = Vue.withOption.call(self.vm,"return "+self.sent);
            },
            insert: function(){
                var self = this;
                this.node.value = self.vmodel;
            },
            unbind: function(){
                delete this.vm;
                delete this.root;
                delete this.node;
            }
        },
        "v-for": {
            bind: function(vm,root,node){
                this.vm = vm;
                this.root = root;
                this.node = node;
            },
            get: function(){
                this.sent = this.node.getAttribute("v-for");
                this.node.removeAttribute("v-for");
                this.text = this.node.innerHTML;
                return this.sent !== null;
            },
            parse: function(){
                var self = this;
                var sents = this.sent.replace(/\s+/g," ").split(" in ");
                var left = sents[0].match(/[a-zA-z$_][a-zA-z$_0-9]+/g);//按变量规则取
                var right = sents[1].match(/[a-zA-z$_][a-zA-z$_0-9]+/g);
                self.vfor = Vue.withOption.call(self.vm,'with(obj){Vue.each('+right+',function('+left+'){obj.each.apply(obj,arguments)});}',true,self);
            },
            insert: function(){
                var self = this;
                var node;
                self.each = function(index,vo){
                    node = self.node.cloneNode(true);
                    node.innerHTML = index;
                    Vue.insertNode(self.node.parentNode,self.node, node);
                }
                new Function('obj',self.vfor).bind(self.vm)(self);
                Vue.removeNode(self.node.parentNode,self.node);
            },
            unbind: function(){
                delete this.vm;
                delete this.root;
                delete this.node;
            }
        }
    },
    //以dom为索引以vnode为模板
    parseDirective: function(vnode,dom){
        var self = this;
        var list = [];
        var dirs = this.directives;
        var node,tpl;
        Vue.each(dirs,function(key,dir){
            for(var index=0,len = dom.childNodes.length;index<len;index++){
                node = vnode.childNodes[index];
                if(node && node.nodeType==1){
                    dir.bind(self,vnode,node);
                    if(dir.get()){
                        dir.parse();
                        dir.insert();
                    }
                    dir.unbind();
                }
            };
        });
        return this;
    },
    //注册指令
    directive: function(dir,option){
        var self = this;
        var defaults = {
            bind: function(){
            },
            get: function(){
            },
            parse: function(){
            },
            insert: function(){
            },
            unbind: function(){
            }
        };
        option = Vue.extend.call(option,defaults);
        this.directives = this.directives || {};
        this.directives[dir] = option;
    },
});
