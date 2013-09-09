'use strict';

describe('Service: halclient', function () {

  function clone(jsonObject){
    return JSON.parse(JSON.stringify(jsonObject));
  }

  // load the service's module
  beforeEach(module('angularhalApp'));

  // instantiate service
  var halclient;
  beforeEach(inject(function (_halclient_) {
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

    it('should be decoupled from the model data object received', function() {
      modelData._links.self.href = "new value";
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

        links1.eg.href = "new value";

        expect(links1.eg.href).toNotEqual(links2.eg.href);
      })
    })

    //¿COMO EXPONER LOS EMBEDDED?
    describe('embedded', function (){

    })


    //para seguir un link del recurso
    //por defecto, peticion get ¿tiene sentido enviar con datos?
    //genera un wrapper con los verbos http. 
    //el primer parámetro será lo usado en el template si es un templated, si no es el payload
    //el segundo parámetro  serán los datos que se enviarán por payload si no es template
    describe('link', function (){

    })
    //
  });
});

