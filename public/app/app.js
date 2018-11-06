angular.module('MyApp',['appRoutes','mainCtrl','authService','userCtrl','userService','videoCtrl','videoService','ui.bootstrap'])

.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptor');
});
