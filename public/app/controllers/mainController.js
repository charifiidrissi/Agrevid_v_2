angular.module('mainCtrl',[])

.controller('MainController',function($rootScope,$location,$window,Auth){

  let vm = this;

  vm.loggedIn = Auth.isLoggedIn;
  vm.isAdmin = false;

    $rootScope.$on('$routeChangeStart',function(){
      vm.loggedIn = Auth.isLoggedIn();
      Auth.getUser()
          .then(function(data){
              vm.user = data.data;
              //here the prob
              vm.isAdmin = data.data.admin;
          });
  });




    vm.doLogin = function(){
        vm.processing = true;
        vm.error = '';
        Auth.login(vm.loginData.username,vm.loginData.password)
            .success(function(data){
                vm.processing = false;

                Auth.getUser()
                    .then(function(data){
                        vm.user = data.data;
                    });

                if(data.success)
                    $location.path('/');
                else
                    vm.error = data.message;
            });
    }

    vm.doLogout = function(){
        Auth.logout();
        vm.isAdmin = false;
        $window.localStorage.setItem('token','');
        $location.path('/logout');
    }

});


