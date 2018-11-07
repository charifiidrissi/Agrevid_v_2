angular.module('videoCtrl', ['videoService'])


    .controller('VideoController', function (Video, AuthToken, $window, $sce, $location, $route, $scope) {
        let vm = this;
        vm.url = '';
        vm.title = '';
        // vm.url = "https://r4---sn-n4g-hgnz.googlevideo.com/videoplayback?source=youtube&id=o-AGvY0HursJvaMI26QXpYkeAVD-bDkuc3E5jk7OvhJyEy&requiressl=yes&dur=225.047&pl=23&ip=34.211.145.200&txp=2211222&signature=74D2A92DB76667859A0B0D2E195362DE2B4E33E2.73CEDD01F5C2B33BE3779449A3AF9AC8B6065BD3&ratebypass=yes&fvip=4&ei=EzPQW5nbG5L-kgbQo6GAAw&c=WEB&mime=video%2Fmp4&itag=18&key=cms1&gir=yes&clen=9024154&sparams=clen,dur,ei,expire,gir,id,ip,ipbits,ipbypass,itag,lmt,mime,mip,mm,mn,ms,mv,pcm2cms,pl,ratebypass,requiressl,source&ipbits=0&expire=1540392819&lmt=1535622348334163&redirect_counter=1&rm=sn-nx5ld7z&fexp=23763603&req_id=73294e971bc5a3ee&cms_redirect=yes&ipbypass=yes&mip=78.113.113.141&mm=31&mn=sn-n4g-hgnz&ms=au&mt=1540371087&mv=m&pcm2cms=yes";

        vm.searchTitle = Video.getSearchTitle();
        vm.token = AuthToken.getToken();
        vm.youtubeVideos = [];

        //trustSrc pour qu'Angular ne bloque pas les sources non fiables (externes)
        vm.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }


        //méthode déclanchée lors de la recherche de video
        vm.doSearch = function () {


            Video.searchYoutubeVideo(vm.search.title).then(function (res) {

                $location.path('/search');

                vm.youtubeVideos = res.data.results;
                console.log(vm.youtubeVideos);

                let regExLettres = new RegExp('^[a-zA-Z0-9-()/:?.= ]*$');

                if (!regExLettres.test(vm.search.title)) {
                    $window.alert("erreur !");
                    return;
                }
                // $localStorage.put('search',"https://agrevid.com:3000/api/streamVideo/"+vm.search.title);
                Video.search(vm.search.title);
                Video.setSearchTitle(vm.search.title);

                $route.reload();


            });


        }
        
        vm.streamYoutubeVideo = function (video) {
            vm.url = video.id;
            vm.title = video.title;
            $location.path('/video');
            $route.reload();
        }


    })