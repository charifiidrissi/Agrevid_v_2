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
})



