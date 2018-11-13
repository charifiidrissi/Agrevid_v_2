angular.module('mainCtrl', [])

    .controller('MainController', function ($rootScope, $location, $window, Auth, User) {

        let vm = this;
        let falseSubmitNb = 0;

        vm.loggedIn = Auth.isLoggedIn;
        vm.isAdmin = false;
        vm.message;
        vm.succed;
        vm.submitSendPass= false;

        $rootScope.$on('$routeChangeStart', function () {
            vm.loggedIn = Auth.isLoggedIn();
            Auth.getUser()
                .then(function (data) {
                    vm.user = data.data;
                    //here the prob
                    vm.isAdmin = data.data.admin;
                });
        });


        vm.doLogin = function () {
            vm.processing = true;
            vm.error = '';

            if (falseSubmitNb < 3) {
                User.checkEmail(vm.loginData).success(function (res) {
                    let response = res;
                    let charInterdits = ["\"", " "];
                    let majuscules = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                    let majCheck = false;

                    if (vm.loginData.username != "Admin") {
                        if (!response.checked) {
                            $window.alert("Email invalide !");
                            falseSubmitNb++;
                            return;
                        }


                        if (vm.loginData.password.length < 8) {
                            $window.alert("Mot de passe incorrecte !");
                            falseSubmitNb++;
                            return;
                        }
                    }

                    for (let i = 0; i < charInterdits.length; i++) {
                        if (vm.loginData.password.includes(charInterdits[i])) {
                            if (charInterdits[i] == " ") {
                                $window.alert("Mot de passe incorrecte !");
                                falseSubmitNb++;
                                return;
                            }

                            $window.alert("Mot de passe incorrecte !");
                            falseSubmitNb++;
                            return;
                        }
                    }
                    if (vm.loginData.username != "Admin") {
                        for (let j = 0; j < majuscules.length; j++) {
                            if (vm.loginData.password.includes(majuscules[j])) {
                                majCheck = true;
                            }
                        }
                    } else {
                        majCheck = true;
                    }

                    if (majCheck == false) {
                        $window.alert("Mot de passe incorrecte !");
                        falseSubmitNb++;
                        return;
                    }


                    Auth.login(vm.loginData.username, vm.loginData.password)
                        .success(function (data) {
                            vm.processing = false;

                            Auth.getUser()
                                .then(function (data) {
                                    vm.user = data.data;
                                });

                            if (data.success)
                                $location.path('/');
                            else {
                                vm.error = data.message;
                                $window.alert(vm.error);
                            }
                        });

                });
            }else{
                $window.alert('Vous avez atteint le nombre maximum de tentatives.');
            }
        }


        vm.doLogout = function () {
            Auth.logout().success(function (res) {
                let response = res;

                console.log(response.message);

            });
            vm.isAdmin = false;
            $window.localStorage.setItem('token', '');
            $location.path('/logout');
        }


        vm.userSendModifyPass = function () {



            Auth.userSendModifyPass(vm.data).success(function (res) {
                vm.message = res.message;
                vm.succed=res.succed;
                vm.submitSendPass=true;
            })
        }

        vm.succedSendEmail= function () {

            return vm.succed;
        }

        vm.submitOk = function () {
            return vm.submitSendPass;
        }


    });


