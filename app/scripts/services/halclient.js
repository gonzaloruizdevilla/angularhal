'use strict';

angular.module('angularhalApp')
  .provider('halclient', function () {
    var $http, $q;

    function isReserved(prop){
      return prop === "_links" || prop === "_embedded";
    }

    function get(link){
      return function (){
        var defer = $q.defer();
        $http.get(link.href).success(function (json){
          defer.resolve(new ModelWrapper(json));
        })
        return defer.promise;
      }
    }

    function ModelWrapper(data) {
      var model = angular.copy(data);
      this.url = function (){
        return model._links.self.href;
      }

      this.get = function (prop){
        return isReserved(prop) ? undefined : model[prop];
      }

      this.links = function () {
        return angular.copy(model._links);
      }

      this.link = function (rel){
        var link = angular.copy(model._links[rel]);
        link.get = get(link);
        return link;
      }

      this.embedded = function () {
        return angular.copy(model._embedded);
      }
    }

    function Client() {
      this.model = function (modelData) {
        return new ModelWrapper(modelData);
      }
    }

    // Method for instantiating
    this.$get = ['$http', '$q', function (_$http_, _$q_) {
      $http = _$http_;
      $q = _$q_;
      return new Client();
    }];
  });
