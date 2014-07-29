define(function( require, exports, module ){

var backbone = require('backbone');
var InputResult = require('./models').InputResult;

var InputResults =  backbone.Collection.extend({

    model: InputResult,

    updateForSearch: function(value){
        if(value === this.search)return;
        this.search = value;
        this.fetch();
    },

    url: function(){
         return 'https://api.github.com/search/code?q={}+in:file+language:python+repo:django/django'.replace('{}',this.search);
    },

    sync: function(method, model, options) {
        var params = _.extend({
            type: 'GET',
            dataType: 'jsonp',
            url: this.url(),
            processData: false
        }, options);
        return $.ajax(params);
    },

    parse: function(response) {
        return response.data.items;
    },

});

exports.InputResults = InputResults;

});
