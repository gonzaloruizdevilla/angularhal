'use strict';

angular.module('angularhalApp')
  .provider('halclient', function () {

    function isReserved(prop){
      return prop === "_links" || prop === "_embedded";
    }

    function ModelWrapper(data) {
      var model = angular.copy(data);
      this.url = function (){
        return model._links.self.href;
      }

      this.get = function (prop){
        return isReserved(prop) ? undefined : model[prop];
      }

      this.links = function (links) {
        return angular.copy(model._links);
      }
    }

    function Client() {
      this.model = function (modelData) {
        return new ModelWrapper(modelData);
      }
    }

    // Method for instantiating
    this.$get = function () {
      return new Client();
    };
  });
