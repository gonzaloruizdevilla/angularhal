'use strict';

describe('Service: halclient', function () {

  function clone(jsonObject){
    return JSON.parse(JSON.stringify(jsonObject));
  }

  // load the service's module
  beforeEach(module('angularhalApp'));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // instantiate service
  var halclient, $httpBackend;
  beforeEach(inject(function (_$httpBackend_, _halclient_) {
    $httpBackend = _$httpBackend_;
    halclient = _halclient_;
  }));

  it('should create the service', function () {
    expect(!!halclient).toBe(true);
  });

  describe('model', function () {
    var model, modelData = clone(HalModels.simple_model);

    beforeEach(inject(function (_halclient_) {
      model = halclient.model(modelData);
    }));

    it('should create a model for the data', function () {
      expect(!!model).toBe(true);
    });

    it('should return the correct URI from url()', function() {
      expect(model.url()).toEqual(modelData._links.self.href);
    });

    xit('should be decoupled from the model data object received', function() {
      modelData._links.self.href = "new value - 1";
      expect(model.url()).toNotEqual(modelData._links.self.href);
    });

    describe('get', function () {
      it('should return resource properties', function () {
        expect([model.get('prop'), model.get('other_prop')]).toEqual([modelData.prop, modelData.other_prop]);
      })

      it('should not return _links nor _embedded reserved properties', function () {
        expect(model.get('_links') || model.get('_embedded')).toBeUndefined();
      })
    });

    describe('links', function () {
      it('should return a hash map of links', function () {
        var links = model.links();
        expect([links.self.href, links.eg.href]).toEqual([modelData._links.self.href, modelData._links.eg.href]);
      })

      it('should return a copy of original links', function () {
        var links1 = model.links(),
          links2 = model.links();

        links1.eg.href = 'new value';

        expect(links1.eg.href).toNotEqual(links2.eg.href);
      })
    })

    describe('embedded', function (){
      it('should return a copy of embedded resources', function () {
        var embedded = model.embedded();
        expect(embedded.foo.foo_prop).toEqual(modelData._embedded.foo.foo_prop);
        embedded.foo.foo_prop = 'new value';
        expect(embedded.foo.foo_prop).toNotEqual(modelData._embedded.foo.foo_prop);
      })
    })


    //para seguir un link del recurso
    //por defecto, peticion get ¿tiene sentido enviar con datos?
    //genera un wrapper con los verbos http.
    //el primer parámetro será lo usado en el template si es un templated, si no es el payload
    //el segundo parámetro  serán los datos que se enviarán por payload si no es template
    describe('link', function (){

      it('should get a link of the model', function (rel) {
        var link = model.link("self");
        expect(link.href).toEqual(modelData._links.self.href);
      });

      function testGetQuery(rel, expectedUrl, params) {
        var link = model.link(rel), updatedModel;
        $httpBackend.expectGET(expectedUrl)
          .respond(HalModels.updated_simple_model);

        link.get(params).then(function (model){
          updatedModel = model;
        });

        $httpBackend.flush();

        expect(updatedModel.get('prop')).toEqual('val2');
      }

      describe('get method', function (){
        it('should query the link href and return a new model', function (){
          testGetQuery('self', '/example');
        });

        it('should ignore get\'s params.templateParams when the link is not templated', function (){
          var params = { templateParams : { id : '1' } };
          testGetQuery('self', '/example', params);
        });

        it('should use get\'s params.templateParams when the link is templated', function (){
          var params = { templateParams : { id : '1' } };
          testGetQuery('order', '/orders/1', params);
        });

        it('should use get\'s params.templateParams when the link is templated with multiple variables', function (){
          var params = { templateParams : { id : '1' , rowId : '2' } };
          testGetQuery('orderRow', '/orders/1/rows/2', params);
        });

        it('should use get\'s params.payload as query string', function (){
          var params = { payload : [{ name : 'pageSize', value : '100' }, { name : 'orderBy', value : 'name' }] };
          testGetQuery('orders', '/orders?pageSize=100&orderBy=name', params);
        });

      });
    })
    //
  });
});

