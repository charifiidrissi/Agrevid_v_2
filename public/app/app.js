angular.module('MyApp',['appRoutes','mainCtrl','authService','userCtrl','userService','videoCtrl','videoService'])

.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptor');
});
