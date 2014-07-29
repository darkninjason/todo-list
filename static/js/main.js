require(['./config'], function(){
	require(['app/app', 'app/controllers', 'app/routers'], function( app, controllers, routers ){
		app.appRouter = new routers.AppRouter({
            controller: new controllers.AppController()
        });
        app.start();
	});
});