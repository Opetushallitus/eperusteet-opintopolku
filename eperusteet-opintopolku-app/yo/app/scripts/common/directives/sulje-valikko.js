'use strict';

epOpintopolkuApp
  .directive('offClick', ['$document', '$timeout', function ($document, $timeout) {

  function targetInFilter(target, filter) {
    if (!target || !filter) {
      return false;
    }
    var elms = angular.element(document.querySelectorAll(filter));
    var elmsLen = elms.length;
    for (var i = 0; i < elmsLen; ++i) {
      if (elms[i].contains(target)) {
        return true;
      }
    }
    return false;
  }

  return {
    restrict: 'A',
    scope: {
      offClick: '&',
      offClickIf: '&'
    },
    link: function (scope, elm, attr) {
      function handler(event) {
        if (event.pageX === 0 && event.pageY === 0) {
          return;
        }

        var target = event.target || event.srcElement;
        if (!(elm[0].contains(target) || targetInFilter(target, attr.offClickFilter))) {
          scope.$apply(scope.offClick());
        }
      }
      
      if (attr.offClickIf) {
        scope.$watch(scope.offClickIf, function (newVal, oldVal) {
            if (newVal && !oldVal) {
              $timeout(function () {
                $document.on('click', handler);
              });
            } else if (!newVal) {
              $document.off('click', handler);
            }
          }
        );
      } else {
        $document.on('click', handler);
      }

      scope.$on('$destroy', function () {
        $document.off('click', handler);
      });
    }
  };
}]);
