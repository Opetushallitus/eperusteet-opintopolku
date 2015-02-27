describe('Service: kieli', function () {
  var mySvc;

  // Use to provide any mocks needed
  function _provide(callback) {
    // Execute callback with $provide
    module(function ($provide) {
      callback($provide);
    });
  }

  // Use to inject the code under test
  function _inject() {
    inject(function (_Kieli_) {
      mySvc = _Kieli_;
    });
  }

  // Call this before each test, except where you are testing for errors
  function _setup() {
    // Mock any expected data
    _provide(function (/*provide*/) {
      //provide.value('myVal', {});
    });

    // Inject the code under test
    _inject();
  }

  beforeEach(function () {
    // Load the service's module
    module('eperusteOpintopolkuApp');
  });

  describe('the service api', function () {
    beforeEach(function () {
      // Inject with expected values
      _setup();
    });

    it('should exist', function () {
      expect(!!mySvc).toBe(true);
    });

    // Add specs
    it('should change sisaltokieli only to allowed language', function () {
      mySvc.setSisaltokieli('sv');
      expect(mySvc.getSisaltokieli()).toBe('sv');
      mySvc.setSisaltokieli('notvalid');
      expect(mySvc.getSisaltokieli()).toBe('sv');
    });
  });

});
