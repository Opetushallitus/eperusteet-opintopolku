/*
 * Copyright (c) 2013 The Finnish Board of Education - Opetushallitus
 *
 * This program is free software: Licensed under the EUPL, Version 1.1 or - as
 * soon as they will be approved by the European Commission - subsequent versions
 * of the EUPL (the "Licence");
 *
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at: http://ec.europa.eu/idabc/eupl
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * European Union Public Licence for more details.
 */

namespace Controllers {
    export const epLukioSivuNaviController = ($rootScope, $scope, $location, $state, Algoritmit, Utils, epSivunaviUtils, epEsitysSettings) => {
        $scope.menuCollapsed = true;
        $scope.onSectionChange = _.isFunction($scope.onSectionChange) ? $scope.onSectionChange : angular.noop;

        $scope.scrollToHash = function(id, isAmops){
            var amops = isAmops || null;
            if(id) {
                amops ? $state.go('root.amops.tekstikappale') : $state.go('root.lukio.tekstikappale');
                $location.hash(id + '');
                $rootScope.$broadcast('$locationChangeSuccess');
            }
        };

        $scope.addIconClass = function(item){
            var convertToClassName = function(item){
                return ['kurssi-' + item.toLowerCase().replace('_', '-')];
            };
            var kurssiWithTyyppi = !!item.$kurssi && !!item.$kurssi.tyyppi;
            return kurssiWithTyyppi ? convertToClassName(item.$kurssi.tyyppi) : null;
        };

        $scope.search = {
            term: '',
            update: function () {
                let matchCount = 0;
                let items = $scope.items;
                if (_.isUndefined(items)) {
                    let section: any = _.find($scope.sections, '$open');
                    if (section) {
                        items = section.items;
                    }
                }
                _.each(items, function (item) {
                    item.$matched = _.isEmpty($scope.search.term) || _.isEmpty(item.label) ? true :
                        Algoritmit.match($scope.search.term, item.label);
                    if (item.$matched) {
                        matchCount++;
                        let parent = items[item.$parent];
                        while (parent) {
                            parent.$matched = true;
                            parent = items[parent.$parent];
                        }
                    }
                });
                $scope.hasResults = matchCount > 1; // root matches always
                updateModel(items);
            }
        };

        $scope.$watch('search.term', _.debounce(function () {
            $scope.$apply(function () {
                $scope.search.update();
            });
        }, 100));


        $scope.itemClasses = function (item) {
            var classes = ['level' + item.depth];
            if (item.$matched && $scope.search.term) {
                classes.push('matched');
            }
            if (item.$active) {
                classes.push('active');
            }
            if (item.$header) {
                classes.push('tekstisisalto-active-header');
            }
            return classes;
        };

        var doRefresh = function (items) {
            var levels = {};
            if (items.length && !items[0].root) {
                items.unshift({root: true, depth: -1});
            }
            _.each(items, function (item, index) {
                item.depth = item.depth || 0;
                levels[item.depth] = index;
                if (_.isArray(item.link)) {
                    item.href = $state.href.apply($state, item.link);
                    if (item.link.length > 1) {
                        // State is matched with string parameters
                        _.each(item.link[1], function (value, key) {
                            item.link[1][key] = value === null ? '' : ('' + value);
                        });
                    }
                }

                item.$parent = levels[item.depth - 1] || null;
                item.$hidden = item.depth > 0;
                item.$matched = true;
            });
            updateModel(items);
        };

        $scope.refresh = function () {
            if (_.isArray($scope.items)) {
                doRefresh($scope.items);
            } else {
                _.each($scope.sections, function (section) {
                    if (section.items) {
                        doRefresh(section.items);
                    }
                });
            }
        };

        function hideNodeOrphans(items, index) {
            // If the parent is hidden, then the child is implicitly hidden
            var item = items[index];
            for (index++; index < items.length &&
                 items[index].depth > item.depth; ++index) {
                if (!items[index].$hidden) {
                    items[index].$impHidden = true;
                }
            }
        }

        function hideOrphans(items) {
            for (var i = 0; i < items.length; ++i) {
                if (items[i].$collapsed) {
                    hideNodeOrphans(items, i);
                }
            }
        }

        function updateModel(items, doUncollapse = undefined) {
            if (!items) {
                return;
            }
            _.each(items, function (item) {
                if (item.depth > 0) {
                    item.$hidden = true;
                }
                item.$collapsed = true;
                item.$header = false;
            });
            doUncollapse = _.isUndefined(doUncollapse) ? true : doUncollapse;
            if (doUncollapse) {
                var active = _.find(items, function (item) {
                    return epSivunaviUtils.isActive(item);
                });
                if (active) {
                    epSivunaviUtils.unCollapse(items, active);
                }
            }
            epSivunaviUtils.traverse(items, 0);
            hideOrphans(items);
        }

        $scope.toggle = function (items, item, $event, state) {
            if ($event) {
                $event.preventDefault();
            }
            var index = _.indexOf(items, item);
            state = _.isUndefined(state) ? !item.$collapsed : state;
            if (index >= 0 && index < (items.length - 1)) {
                index = index + 1;
                while (index < items.length &&
                       items[index].depth > item.depth) {
                    if (items[index].depth === item.depth + 1) {
                        items[index].$hidden = state;
                    }
                    index++;
                }
            }
            updateModel(items, false);
        };

        $scope.toggleSideMenu = function () {
            $scope.menuCollapsed = !$scope.menuCollapsed;
        };

        $scope.orderFn = function (item) {
            return _.isNumber(item.order) ? item.order : Utils.nameSort(item, 'label');
        };

        $scope.$on('$stateChangeStart', function () {
            $scope.menuCollapsed = true;
        });

        $scope.$on('$stateChangeSuccess', function (event, toState) {
            if (toState.name !== epEsitysSettings.lukioState) {
                // Utils.scrollTo('#ylasivuankkuri');
            }
            updateModel($scope.items);
        });

        $scope.$watch('items', function () {
            $scope.refresh();
        }, true);
        $scope.$watch('sections', function () {
            $scope.refresh();
        }, true);
    };
}
