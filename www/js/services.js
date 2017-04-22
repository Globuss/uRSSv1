/**
 * Created by Theo on 11/04/2017.
 */
angular.module('starter.services', [])

    .factory('Error',function($ionicPopup){
        return {
            show:function(data,status){
                var data = angular.fromJson(data);
                var status = angular.fromJson(status);
                var message = "Erreur";
                console.log(data);
                if(angular.isDefined(data) && angular.isDefined(data.message)){
                    message = data.message;
                }
                if(angular.isDefined(status)){
                    switch(status.toString()){
                        case '400':
                            message = 'Bad Request \n' + message;
                            break;
                        case '401':
                            message = 'Unauthorized \n' + message;
                            break;
                        case '403':
                            message = 'Unauthorized \n' + message;
                            break;
                    }
                }
                $ionicPopup.alert({
                    title:'Oops',
                    template:message
                });
            }
        }
    })

    .factory('uRSSStorage',function($window){

        return {
            set:function(key,value){
                $window.localStorage.setItem(key,value);
            },
            get:function(key){
                return $window.localStorage.getItem(key);
            },
            setObject:function(key,value){
                $window.localStorage.setItem(key,angular.toJson(value));
            },
            getObject:function(key){
                return angular.fromJson($window.localStorage.getItem(key) || '{}');
            },
            setRssStream: function (rss) {
                this.setObject("rss",rss);
            },
            getRssStream: function () {
                return this.getObject("rss") || [];
            },
            setFavorites: function (fav) {
                this.setObject("fav",fav);
            },
            getFavorites: function () {
                return this.getObject("fav") || [];
            },
            setParametres:function(param){
                this.setObject("param",param);
            },
            getParametres:function(){
                return this.getObject("param") || {"refresh":120};
            }
        };
    })

    .factory('RSSStream',function(uRSSStorage,$http){
        var DefaultRssStrem = [
            {
                "name":"HackerNews",
                "link":"https://news.ycombinator.com/rss",
                "catg":""
            }
            ,{
                "name":"La Ferme du Web",
                "link":"http://feeds.lafermeduweb.net/LaFermeDuWeb-Veille",
                "catg":""
            }
            ,{
                "name":"Silicon",
                "link":"http://www.silicon.fr/feed",
                "catg":""
            }
            ,{
                "name":"01net Actu",
                "link":"http://www.01net.com/rss/info/flux-rss/flux-toutes-les-actualites/",
                "catg":""
            }
            ,{
                "name":"01net Sécurité",
                "link":"http://www.01net.com/rss/actualites/securite/",
                "catg":""
            }
            ,{
                "name":"InfoQ",
                "link":"https://www.infoq.com/fr/feed",
                "catg":""
            }
            ,{
                "name":"Trend Hunter",
                "link":"https://feeds.feedburner.com/TrendHuntercom",
                "catg":""
            }
            ,{
                "name":"Journal du Hacker",
                "link":"https://www.journalduhacker.net/rss",
                "catg":""
            },{
                "name":"Numerama",
                "link":"http://www.numerama.com/feed/",
                "catg":""
            },{
                "name":"DZone",
                "link":"http://feeds.dzone.com/home",
                "catg":""
            },{
                "name":"RaspberryPi",
                "link":"https://www.raspberrypi.org/feed/",
                "catg":""
            },,{
                "name":"RaspiFeed",
                "link":"https://raspifeed.com/feed/en",
                "catg":""
            },,{
                "name":"RaspberryPi",
                "link":"https://www.raspberrypi.org/feed/",
                "catg":""
            },{
                "name":"ZDnet",
                "link":"http://www.zdnet.fr/feeds/rss/actualites/",
                "catg":""
            }
        ]; // List of Rss Stream

        var rssStream = [];

        return {
            getDefault:function(){
                return DefaultRssStrem;
            },
            add:function(rss){
                rssStream.push(rss);
            },
            remove:function(rss){
                rssStream.splice(rssStream.indexOf(rss), 1);
                this.set(rssStream);
            },
            get:function(){
                return rssStream;
            },
            set:function(rss){
                rssStream = rss;
            },
            isExist:function(rss){
                return rssStream.indexOf(rss)>=0;
            },
            read:function(rss){
                return $http({
                    method:"GET",
                    url:rss.link,
                    headers: {
                        'Content-Type' : "application/rss+xml; charset=utf-8"
                    }
                });
            }
        };
    })

    .factory('Favorite',function(uRSSStorage){

        var fav = [];

        return {
            get:function(){
                fav = uRSSStorage.getFavorites();
                console.log(fav);
                if(typeof fav === {}){
                    fav = [];
                }
                return fav;
            }
            ,set:function(rss){
                fav = rss;
                uRSSStorage.setFavorites(fav);
            }
            ,add:function(rss){
                fav = this.get();
                fav.push(rss);
                this.set(fav);
            }
            ,remove:function(rss){
                fav.splice(fav.indexOf(rss), 1);
                this.set(fav);
            }
            ,alreadyFav:function(rss){
                return fav.length > 0 && fav.indexOf(rss)>=0;
            }
        };
    })

    .factory('XMLParser',function(){
        return {
            toJSON:function(data){
                var x2js = new X2JS();
                return x2js.xml_str2json(data);
            }
        };
    })

    .factory('DataRefresher', function($window){

        var refresher = [];
        return {
            get:function(name){
                for (var i = 0; i < refresher.length; i++) {
                    if (refresher[i].name === name) {
                        return refresher[i];
                    }
                }
                return null;
            },
            getAll:function(){
                return refresher;
            },
            add:function(name, id){
                var data = {"name":name,"id":id};
                refresher.push(data);
            },
            remove:function(name){
                var r = this.get(name);
                if(r!=null){

                    $window.clearInterval(r.id);
                    refresher.splice(refresher.indexOf(r), 1);
                }
            },
            clearAll:function(){
                for (var i = 0; i < refresher.length; i++) {
                    $window.clearInterval(refresher[i].id);
                }
                refresher = [];
            },
            alreadyExist : function(name){
                return this.get(name)!=null;
            }
        }
    })

    .factory('DateShow', function(){


        return {
            getDateDiffString:function(d){
                var dNow = new Date();
                var d1 = new Date(d);

                var res = "";

                var mois = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];

                var dDiff = Math.ceil((Math.floor(dNow/1000) - Math.floor(d1/1000))/60);

                if(dDiff < 5){
                    res = " Maintenant";
                }else if(dDiff < 60){
                    res = dDiff-1;
                    res = res + ((res > 1)? " minutes":" minute");
                    res = "Il y a " + res;
                }else if(dDiff < 60*24){
                    res = Math.ceil(dDiff/60)-1;
                    res = (res==0)?1:res;
                    res = res + ((res > 1)? " heures":" heure");
                    res = "Il y a " + res;
                }else if(dDiff < 7*60*24){
                    if(dDiff < 2*60*24){
                        res = " Hier";
                    }else{
                        res = Math.ceil(dDiff/(60*24))-1;
                        res = res + ((res > 1) ? " jours":" jour");
                        res = "Il y a " + res;
                    }
                }else if(dDiff < 5*7*60*24){
                    res = Math.ceil(dDiff/(60*24*7))-1;
                    res = res + ((res > 1)? " semaines":" semaine");
                    res = "Il y a " + res;
                }else{
                    res = d1.getDate() + " " + mois[d1.getMonth()];
                    if(dNow.getFullYear() != d1.getFullYear()){
                        res += " " + d1.getFullYear().toString();
                    }
                }
                return res;
            },
            beautifulDate:function(d){
                var res = "";
                var t = new Date(d);
                res = (t.getDate()<10?"0"+t.getDate():t.getDate())+"/"+(t.getMonth()<10?"0"+t.getMonth():t.getMonth())+"/"+t.getFullYear()+ " " +(t.getHours()<10?"0"+t.getHours():t.getHours())+":"+(t.getMinutes()<10?"0"+t.getMinutes():t.getMinutes());
                return res;
            }
        }
    })

;