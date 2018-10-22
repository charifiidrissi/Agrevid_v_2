angular.module('storyService',[])

.factory('Story',function($http){
    let storyFactory = {};

    storyFactory.create = function(storyData){
        return $http.post('/api',storyData);
    }

    storyFactory.allStory = function(){
        return $http.get('/api');
    }

    storyFactory.delete = function (storyData) {
        return $http.post('/api/deleteStory',storyData);
    }

    return storyFactory;
})


.factory('socketio',function ($rootScope) {
    let socket = io.connect('https://agrevid.com:3000', {secure: true});
    return{
        on : function(eventName,callback) {
            socket.on(eventName,function () {
                let args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket,args);
                });
            });
        },

        emit : function(eventName,data,callback){
            socket.emit(eventName,data,function(){
                let args = arguments;
                $rootScope.apply(function(){
                    if(callback){
                        callback.apply(socket,args);
                    }
                });
            });
        }
    };
});