angular.module("app")
    .directive('termistoteksti', function() {
        return {
            restrict: 'EA',
            scope: { teksti: '=' },
            transclude: true,
            template: '<div termisto-viitteet="teksti" ng-bind-html="teksti | kaanna | kuvalinkit | unsafe"></div>'
        };
    })
    .directive('termistoViitteet', function ($stateParams, $document, $timeout) {
        var TERMI_MATCHER = 'abbr[data-viite]';
        return {
            restrict: 'A',
            scope: {
                model: '=termistoViitteet'
            },
            link: function (scope: any, element) {
                scope.popovers = [];

                function destroy() {
                    element.find(TERMI_MATCHER).each(function () {
                        var jqEl: any = angular.element(this);
                        if (jqEl.popover) {
                            jqEl.popover('destroy');
                        }
                    });
                    scope.popovers = [];
                }

                function setup() {
                    element.find(TERMI_MATCHER).each(function () {
                        var jqEl: any = angular.element(this);
                        var viiteId: any = jqEl.attr('data-viite');
                        TermistoData.getByAvain(viiteId, $stateParams.ktId).then(function(res) {
                            var popover = jqEl.popover({
                                    placement: 'auto',
                                    html: true,
                                    title: KaannaService.kaanna('termin-selitys'),
                                    trigger: 'click'
                                })
                                .on('show.bs.popover', function() {
                                    var content = res ? KaannaService.kaanna(res.selitys) : KaannaService.kaanna('termia-ei-loytynyt');
                                    popover.attr('data-content', content);
                                    if (res) {
                                        popover.attr('data-original-title', KaannaService.kaanna(res.termi));
                                    }
                                    _.each(scope.popovers, function (po) {
                                        if (po !== popover) {
                                            po.popover('hide');
                                        }
                                    });
                                    var thisPopover = popover.next('.popover');
                                    var title = thisPopover.find('.popover-title');
                                    var closer = angular.element(
                                        '<span class="closer pull-right">&#x2715;</span>');
                                    title.append(closer);
                                    closer.on('click', function () {
                                        popover.popover('hide');
                                    });
                                    scope.popovers.push(popover);
                                });
                        });
                    });
                }

                // Click anywhere to close
                $document.on('click', function (event) {
                    if (element.find(event.target).length > 0) {
                        return;
                    }
                    _.each(scope.popovers, function (popover) {
                        popover.popover('hide');
                    });
                });

                function refresh() {
                    $timeout(function () {
                        destroy();
                        setup();
                    }, 500);
                }

                scope.$watch('model', refresh);
                scope.$on('termisto:update', refresh);
                scope.$on('$destroy', function () {
                    $document.off('click');
                    destroy();
                });
            },
        };
    });
