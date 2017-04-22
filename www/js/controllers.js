angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('HomeCtrl', function($scope, $window, $stateParams, RSSStream, DataRefresher, XMLParser, uRSSStorage, $ionicModal, DateShow, Favorite) {
    var rssStream = RSSStream.getDefault();
    var loading = true;

    $scope.data = [];

    function readRss(){
        $scope.data = [];
        for(var i =0;i<rssStream.length;i++){
            loading = true;
            RSSStream.read(rssStream[i])
                .success(function(data){
                    var d = XMLParser.toJSON(data);
                    if(angular.isDefined(d.rss) && angular.isDefined(d.rss.channel) && angular.isDefined(d.rss.channel.item)){
                        if(angular.isDefined(d.rss.channel.item.length) && d.rss.channel.item.length > 0) {
                            d.rss.channel.item.forEach(function (item, i) {
                                item.titleSite = d.rss.channel.title;
                                $scope.data.push(item);
                            });
                        }else{
                            if(angular.isDefined(d.rss.channel.item.title) && angular.isDefined(d.rss.channel.item.description) && angular.isDefined(d.rss.channel.item.link)){
                                $scope.data.push(d.rss.channel.item);
                            }
                        }
                    }
                    loading = false;
                    $scope.$broadcast('scroll.refreshComplete');
                })
                .error(function(data,code,config,headers){
                    console.log(data);
                    loading = false;
                    $scope.$broadcast('scroll.refreshComplete');
                })
        }
    }

    readRss();

    $scope.doRefresh = function(){
        readRss();
    };

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/modalArticle.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.openModal = function(rss) {
        $scope.currentRss = rss;
        $scope.modal.show();
    };

    $scope.getDate = function(d){
        return DateShow.getDateDiffString(d);
    };

    $scope.sortByDate = function(v1) {
        if(angular.isDefined(v1.pubDate)) {
            return new Date(v1.pubDate);
        }else {
            return 1;
        }
    };

    $scope.isLoading = function(){
        return loading;
    };

    $scope.openInBrowser = function(rss){
        cordova.InAppBrowser.open(rss.link, '_system');
    };

    $scope.isAlreadyLoved = function(){
        return Favorite.alreadyFav($scope.currentRss);
    };

    $scope.favorite = function(){
        if(Favorite.alreadyFav($scope.currentRss)){
            Favorite.remove($scope.currentRss);
        }else{
            Favorite.add($scope.currentRss);
        }
    };

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

})

.controller('FavoritesCtrl', function($scope, $ionicModal, Favorite, DateShow) {
    $scope.data = Favorite.get();

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/modalArticle.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.openModal = function(rss) {
        $scope.currentRss = rss;
        $scope.modal.show();
    };

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    $scope.getDate = function(d){
        return DateShow.getDateDiffString(d);
    };

    $scope.sortByDate = function(v1) {
        if(angular.isDefined(v1.pubDate)) {
            return new Date(v1.pubDate);
        }else {
            return 1;
        }
    };

    $scope.remove = function(rss){
        Favorite.remove(rss);
    };

    $scope.openInBrowser = function(rss){
        cordova.InAppBrowser.open(rss.link, '_system');
    };

    $scope.isAlreadyLoved = function(){
        return Favorite.alreadyFav($scope.currentRss);
    };

    $scope.favorite = function(){
        if(Favorite.alreadyFav($scope.currentRss)){
            Favorite.remove($scope.currentRss);
        }else{
            Favorite.add($scope.currentRss);
        }
    };
})

.controller('ParametersCtrl', function($scope, $stateParams) {

});
