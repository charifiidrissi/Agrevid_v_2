angular.module('videoService',[])

.factory('Video',function($http) {
    let videoFactory = {};

    videoFactory.url = '';

    videoFactory.search = function (search) {
        return $http.post('api/videoSearch',search);
    }

    return videoFactory;
});