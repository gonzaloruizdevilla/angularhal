/*jslint indent: 2, regexp: true */
/*global angular*/
(function (angular) {

  'use strict';

  angular.module('angularhalApp')
    .provider('halclient', function () {
      var $http, $q;

      function clone(jsonObject) {
        return JSON.parse(JSON.stringify(jsonObject));
      }

      function isReserved(prop) {
        return prop === "_links" || prop === "_embedded";
      }

      function applyTemplateParams(link, templateParams) {
        var href;
        if (link.templated) {
          href = link.href.replace(/\{(.+?)\}/g, function(match, paramId) {
            return templateParams[paramId];
          });
        } else {
          href = link.href;
        }
        return href;
      }

      function addPayload(linkUrl, payload) {
        var queryString = '';
        if (payload) {
          payload.forEach(function(entry) {
            queryString += entry.name + '=' + entry.value + '&';
          });
          queryString = '?' + queryString.substring(0, queryString.length - 1);
        }
        return linkUrl + queryString;
      }

      function get(link) {
        return function (params) {
          var defer = $q.defer(), linkUrl = link.href;
          if (params) {
            linkUrl = applyTemplateParams(link, params.templateParams);
            linkUrl = addPayload(linkUrl, params.payload);
          }
          $http.get(linkUrl).success(function (json) {
            defer.resolve(new ModelWrapper(json));
          });
          return defer.promise;
        };
      }

      function ModelWrapper(data) {
        var model = clone(data);
        this.url = function () {
          return model._links.self.href;
        };

        this.get = function (prop) {
          return isReserved(prop) ? undefined : model[prop];
        };

        this.links = function () {
          return clone(model._links);
        };

        this.link = function (rel) {
          var link = clone(model._links[rel]);
          link.get = get(link);
          return link;
        };

        this.embedded = function () {
          return clone(model._embedded);
        };
      }

      function Client() {
        this.model = function (modelData) {
          return new ModelWrapper(modelData);
        };
      }

      // Method for instantiating
      this.$get = ['$http', '$q', function (_$http_, _$q_) {
        $http = _$http_;
        $q = _$q_;
        return new Client();
      }];
    });

}(angular));
