angular.module('authService',[])



.factory('Auth',function ($http,$q,AuthToken) {

    let authFactory = {};


    authFactory.login = function(username,password){
      return $http.post('/api/login',{
         username : username,
         password : password
      })
          .success(function(data){
              AuthToken.setToken(data.token);
              return data;
          })
    }

    authFactory.logout = function(user){
        return $http.post('/api/logoutDate',user);
        AuthToken.setToken();
    }

    authFactory.isLoggedIn = function(){
            if(AuthToken.getToken()){
                return true;
            }else{
                return false;
            }
    }

    authFactory.userSendModifyPass = function(data){
        return $http.post('/api/userSendModifyPassToken',data);
    }


    authFactory.getUser = function(){

        if(AuthToken.getToken())
            return $http.get('/api/me');
        else
            return $q.reject({message : "User has no token"});
    }

    return authFactory;
})


.factory('AuthToken',function($window , $routeParams){
    let authTokenFactory = {};

    authTokenFactory.getToken = function(){
        if($routeParams.token) {
            $window.localStorage.setItem('token', $routeParams.token);
            $routeParams.token='';
            $routeParams.code='';
        }
        return $window.localStorage.getItem('token') ;
    }

    authTokenFactory.setToken = function(token){
        if(token)
            $window.localStorage.setItem('token',token);
        else
            $window.localStorage.removeItem('token');
    }
    return authTokenFactory;
})

.factory('AuthInterceptor', function($q,$location,$window,AuthToken){
   let interceptorFactory = {};

   interceptorFactory.request = function(config){
       let token = AuthToken.getToken();
       if(token){
           config.headers['x-access-token'] = token;
       }
       return config;
   };

   interceptorFactory.responseError = function(response){
     if(response.status == 403){
         $window.localStorage.setItem('token','');
         $location.path('/login');
     }
     return $q.reject(response);
   }

   return interceptorFactory;

});