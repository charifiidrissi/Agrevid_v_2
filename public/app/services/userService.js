angular.module('userService',[])

.factory('User',function($http){
    let userFactory = {};

    userFactory.create = function(userData){
        return $http.post('/api/signup',userData);
    }



    userFactory.all = function(){
        return $http.get('/api/users');
    }


    userFactory.delete = function(userData){
        return $http.post('/api/deleteUser',userData);
    }


    userFactory.checkEmail = function(userData){
        return $http.post('/api/checkEmail',userData);
    }

    return userFactory;
});