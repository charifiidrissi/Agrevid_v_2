angular.module('userCtrl',['userService'])

.controller('UserController',function(User,Auth,AuthToken,$location,$window,$scope,$routeParams,$timeout) {
    let vm = this;
    vm.isUpdate = false;
    vm.historys = [];
    vm.loggs = [];
    vm.userSuccessfllyAdded = false;
    vm.successDelete = false;
    vm.HistorySearch = [];
    vm.OldPass = false;
    vm.msg;
    vm.throws = false;
    vm.updateTrue = false;
    vm.newInfo;
    //get token in order to change user pass
    $scope.tokenUser = $routeParams.token;
    //get access security
    $scope.hasSecurity = $routeParams.code;


    $scope.is_Admin = false;
    //pagination
    $scope.dataHistoriqueParam = [];
    $scope.dataHistoriqueUser = [];
    $scope.dataLogss = [];
    $scope.currentPage = 1;
    $scope.currentPageHistoriqueParam = 1;
    $scope.currentPageLoggs = 1;
    $scope.itemsPerPage = 5;
    $scope.maxSize = 5; //Number of pager buttons to show


    vm.hasSecurity = function () {
        if ($scope.hasSecurity == 1) return true;
        else return false;
    }

    User.all()
        .success(function (data) {
            vm.users = data;
        })

    Auth.getUser()
        .then(function (data) {
            vm.newInfo = data.data;
        });



       vm.getUser = function() {
           let Error=false;
            vm.userSearched ={};
           User.user(vm.userData).success(function (data) {

               Error = data.resp;
               if(!Error){
                   vm.msg = "Utilisateur introuvable";
                   vm.throws = true;
                }else {

                    vm.userSearched = data.user2; 
                    $scope.is_Admin = vm.userSearched.admin;
                    vm.successDelete = false;                 


               }


           })

        User.getHistorySearchParam(vm.userData)
            .success(function (data) {
                vm.historys = data;
                $scope.dataHistoriqueParam = data;
                $scope.totalItemsHistoriqueParam = vm.historys.length;
            })


        User.getLoggsParam(vm.userData)
            .success(function (data) {
                vm.loggs = data;
                $scope.dataLogss =data;
                $scope.totalItemsDataLogss = vm.loggs.length;

            })

    }

    vm.ifAdmin = function () {

        if($scope.is_Admin ==true) return true;
        else return false ;

    }

    vm.isUserSuccessfullyDeleted = function () {

        if(vm.successDelete) return true;
        else return false;
    }

    vm.okdelete = function(){
        vm.successDelete = false;
    }
    vm.hasHistorys = function () {

        if(vm.historys.length==0) return false;
        else if((vm.historys.length>=1)) return true;
        return false;
    }

    vm.hasLoggs = function () {

        if(vm.loggs.length==0) return false;
        else if((vm.loggs.length>=1)) return true;
        return false;
    }


    User.getHistorySearch()
        .success(function (data) {
            vm.HistorySearch =data;
            $scope.dataHistoriqueUser = data;
            $scope.totalItemsHistoriqueUser = vm.HistorySearch.length;
        });

    vm.deleteUser = function(){
        User.delete(vm.userData).success(function (resp) {
              vm.successDelete = resp.success;
        });

    };
//pour gerer la fichage des notifications
    vm.showMessage = function(){

        return  vm.throws;
    }

    vm.stopMessage= function(){
        vm.throws = false;
    }

    //time
    $scope.time = 0;
    $scope.timeSeconde = 0;

    //timer callback
    var timer = function() {
        if( $scope.time < 5000 ) {
            $scope.time += 1000;
            $scope.timeSeconde+= 1;
            $timeout(timer, 1000);
        }
    }




    vm.updateUser = function () {
        $timeout( function(){
            $window.localStorage.setItem('token','');
            $location.path('/lgin');
        }, 5000 );

        User.update(vm.userData).success(function (message) {

            vm.updateTrue = message.success;
            vm.msg = message.message;
            vm.throws = true;

              //run!!
            $timeout(timer, 1000);

        })



    }

        vm.updateUserSucced = function () {
            return vm.updateTrue;
        }


        vm.updateUserPass = function () {
            User.updateUserPass(vm.userData).success(function (message) {

                vm.oldPass = message.success;
                vm.msg = message.message;
                vm.throws = true;
                //   $window.localStorage.setItem('token', '');
                //  $location.path('/login');
                // $window.alert("votre compte a bien été modifier clicker ok pour se connecter");


            });


        }

        vm.isOldPassTrue = function () {
            return vm.oldPass;
        }

        vm.updateUserPassToken = function () {


            User.updateUserPassToken(vm.userData).success(function () {

                $window.localStorage.setItem('token', '');

                $location.path('/login');
                $window.alert("votre compte a bien été modifier clicker ok pour se connecter");


            });


        };




})


.controller('UserCreateController',function(User,$location,$window){
    let vm = this;

    vm.isUserSuccessfullyAdded = function () {

        if (vm.userSuccessfllyAdded) return true;
        else return false;
    }
    vm.okAdd = function () {
        vm.userSuccessfllyAdded = false;
    }

    vm.signupUser = function(){
        vm.message = '';

        User.checkEmail(vm.userData).success(function (res) {
            let response = res;
            let charInterdits = ["\""," "];
            let majuscules = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
            let majCheck = false;
            let regExLettres = new RegExp('^[a-zA-Z]*$');

            if(!regExLettres.test(vm.userData.name)){
                $window.alert("le nom ne peut contenir que des lettres !");
                return;
            }

            if(!response.checked){
                $window.alert("Email invalide !");
                return;
            }

            if(vm.userData.password.length < 8){
                $window.alert("Le mot de passe doit contenir au moins 8 charactères");
                return;
            }

            for(let i=0; i<charInterdits.length; i++){
                if(vm.userData.password.includes(charInterdits[i])){
                    if(charInterdits[i] == " "){
                        $window.alert("Le mot de passe ne doit pas contenir des espaces");
                        return;
                    }

                    $window.alert("Le mot de passe ne doit pas contenir des "+charInterdits[i]);
                    return;
                }
            }

            for(let j=0; j<majuscules.length; j++){
                if(vm.userData.password.includes(majuscules[j])) {
                    majCheck = true;
                }
            }

            if(majCheck == false){
                $window.alert("Le mot de passe doit contenir au moins une majuscule !");
                return;
            }

            if(vm.userData.password != vm.userData.passConfirm){
                $window.alert("Les mots de passes ne sont pas identiques !");
                return;
            }

                User.create(vm.userData)
                    .then(function(response){
                        vm.userData = {};
                        vm.message = response.data.message;

                        $window.localStorage.setItem('token',response.data.token);
                        $location.path('/');
                    })
        })

    }

    vm.addUser = function(){
        vm.message = '';

        User.checkEmail(vm.userNew).success(function (res) {
            let response = res;
            let charInterdits = ["\""," "];
            let majuscules = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
            let majCheck = false;
            let regExLettres = new RegExp('^[a-zA-Z]*$');

            if(!regExLettres.test(vm.userNew.name)){
                $window.alert("le nom ne peut contenir que des lettres !");
                return;
            }

            if(!response.checked){
                $window.alert("Email invalide !");
                return;
            }

            if(vm.userNew.password.length < 8){
                $window.alert("Le mot de passe doit contenir au moins 8 charactères");
                return;
            }

            for(let i=0; i<charInterdits.length; i++){
                if(vm.userNew.password.includes(charInterdits[i])){
                    if(charInterdits[i] == " "){
                        $window.alert("Le mot de passe ne doit pas contenir des espaces");
                        return;
                    }

                    $window.alert("Le mot de passe ne doit pas contenir des "+charInterdits[i]);
                    return;
                }
            }

            for(let j=0; j<majuscules.length; j++){
                if(vm.userNew.password.includes(majuscules[j])) {
                    majCheck = true;
                }
            }

            if(majCheck == false){
                $window.alert("Le mot de passe doit contenir au moins une majuscule !");
                return;
            }

            if(vm.userNew.password != vm.userNew.passConfirm){
                $window.alert("Les mots de passes ne sont pas identiques !" + vm.userNew.admin);
                return;
            }


            User.create(vm.userNew)
                .then(function(response){
                    vm.userNew = {};
                    vm.userSuccessfllyAdded= true;



                })
        })

    }
})



