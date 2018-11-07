angular.module('videoService',[])

.factory('Video',function($http,$window) {
    let videoFactory = {};

    videoFactory.url = '';

    /*videoFactory.search = function (search) {
        return $http.get('/api/streamYoutube/'+search.title);
    }*/

    videoFactory.setSearchTitle = function (searchTitle){
        if(searchTitle)
            $window.localStorage.setItem('search',searchTitle);
        else
            $window.localStorage.removeItem('search');
    }

    videoFactory.getSearchTitle = function (){
          return  $window.localStorage.getItem('search');

    }


    videoFactory.search = function (title) {
        return $http.get('/apiVideo/search/'+$window.localStorage.token+'/'+title);
    }

    videoFactory.searchYoutubeVideo = function(title){
        return $http.get('/apiVideo/searchYoutubeVideos/'+title);
    }

    videoFactory.searchVimeoVideo = function(title){
        return $http.get('/apiVideo/searchVimeoVideos/'+title);
    }

    return videoFactory;
});