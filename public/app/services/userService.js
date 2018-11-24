angular.module('userService',[])

.factory('User',function($http){
    let userFactory = {};

    userFactory.create = function(userData){
        return $http.post('/api/signup',userData);
    }



    userFactory.all = function(){
        return $http.get('/api/users');
    }

    userFactory.user = function(userData){
        return $http.post('/api/user',userData);
    }

    userFactory.getUser = function(userData){
        return $http.post('/api/user',userData);
    }

    userFactory.getHistorySearch = function () {
        return $http.get('/api/userhistorys');
    }

    userFactory.getHistorySearchParam = function (userData) {
        return $http.post('/api/userhistorysParam',userData);
    }

    userFactory.getLoggsParam = function (userData) {
        return $http.post('/api/searchUserLoggs',userData);
    }

    userFactory.delete = function(userData){
        return $http.post('/api/deleteUser',userData);
    }

    userFactory.update = function(userData){
        return $http.post('/api/updateUser',userData);
    }

    userFactory.updateUserPass = function(userData){
        return $http.post('/api/updateUserPass',userData);
    }

    userFactory.updateUserPassToken = function(userData){
        return $http.post('/api/updateUserPassToken',userData);
    }



    userFactory.checkEmail = function(userData){
        return $http.post('/api/checkEmail',userData);
    }

    return userFactory;
});