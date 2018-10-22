angular.module('storyCtrl',['storyService'])

.controller('StoryController',function(Story,socketio){
    let vm = this;

    Story.allStory().success(function(data){
       vm.stories = data;
    });

    vm.refreshStory = function(){
        Story.allStory().success(function(data){
            vm.stories = data;
        });
    };

    vm.createStory = function () {
        vm.processing = true;

        vm.message ='';
        Story.create(vm.storyData).success(function (data) {
            vm.processing = false;
            //clear up the form
            vm.storyData = '';

            vm.message = data.message;


        });
    };

    vm.deleteStory = function (story){
        vm.processing = true;

        Story.delete(story).success(function () {
            vm.processing = false;
            vm.refreshStory();
        });
    };

    socketio.on('story',function (data) {
        vm.stories.push(data);
    })



});