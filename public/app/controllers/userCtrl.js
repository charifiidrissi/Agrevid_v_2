angular.module('userCtrl',['userService'])

.controller('UserController',function(User){
    let vm = this;


    User.all()
        .success(function (data) {
            vm.users = data;
        })


    vm.deleteUser = function(){
        User.delete(vm.userData).success(function () {
            console.log('User deleted !');
        });

    };

})


.controller('UserCreateController',function(User,$location,$window){
    let vm = this;

    vm.signupUser = function(){
        vm.message = '';

        User.create(vm.userData)
            .then(function(response){
                vm.userData = {};
                vm.message = response.data.message;

                $window.localStorage.setItem('token',response.data.token);
                $location.path('/');
            })
    }
})