define(function(require){

    var Marionette = require('marionette'),
        _ = require('underscore'),
        logging = require('auf/utils/logging'),
        log = logging.getLogger('auf.injector');

    var Component = Marionette.Controller.extend({
        cls: null,
        kwargs:null,
        key:null,
        container: null,
        dependencies: null,

        initialize: function(options){
            this.dependencies = [];
            _.extend(this, options);
        },

        depends: function(key, cls, kwargs){
            this.dependencies.push(new Component({cls:cls, kwargs:kwargs, key:key}));
            return this;
        },

        call: function(kwargs){
            var args = {};
            kwargs = kwargs || {};

            _.map(this.dependencies, function(x){
                var data = {};
                var obj = x.call(x.kwargs);
                data[x.key] = obj;
                _.extend(args, data);
            });

            target = this.cls;
            obj = new target(_.extend(args, kwargs));
            return obj;
        }
    });

    var Container = Marionette.Controller.extend({
        registry: {},

        register: function(name, cls, kwargs){
            var component = new Component({cls:cls});
            component.container = this;
            log.debug('Registering ' + name);
            this.registry[name.toLowerCase()] = component;
            return component;
        },

        resolve: function(name){
            name = name.toLowerCase();
            var component = this.registry[name];
            return component.call();
        }
    });

    return Container;
});

