define(function(require, exports, module) {
var Marionette = require('marionette');

var AppRouter = Marionette.AppRouter.extend({
   appRoutes: {
       "": "index"
   }
});

exports.AppRouter = AppRouter;

});
