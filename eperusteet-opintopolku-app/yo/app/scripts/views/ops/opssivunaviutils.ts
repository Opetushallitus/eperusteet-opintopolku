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


/* Sets sivunavi items active based on current state */
angular
    .module("app")
    .service("opsStateService", function($state, $stateParams, epSivunaviUtils, $rootScope, epEsitysSettings) {
        var state = {};
        var section = null;

        function processSection(navi, index, cb) {
            section = navi.sections[index];
            /*if (index === 1) {
        state.vlk = true;
      }*/
            section.$open = true;
            _.each(section.items, function(item, index) {
                (cb || angular.noop)(item, index);
                item.$hidden = item.depth > 0;
            });
        }

        this.setState = function(navi) {
            this.state = {};
            _.each(navi.sections, function(section) {
                section.$open = false;
                _.each(section.items, function(item) {
                    item.$selected = false;
                    item.$header = false;
                    if (item.depth > 0) {
                        item.$hidden = true;
                    }
                });
            });
            section = null;
            var selected = null;
            var items = null;

            function setParentOppiaineHeader() {
                if (selected && selected.$oppiaine) {
                    var found = _.find(items, function(item: any) {
                        return item.$vuosi === "" + selected.$parent_vuosi;
                    });
                    if (found) {
                        found.$header = true;
                    }
                }
            }

            const goToFirstChild = (selected, items) => {
                let nextIndex = _.indexOf(items, selected) + 1;
                if (items[nextIndex].$tyyppi === "yhteinen") {
                    $state.go(".oppiaine", { oppiaineId: items[nextIndex].$oppiaine.id }, { location: "replace" });
                } else if (nextIndex) {
                    $state.go(
                        ".valinainenoppiaine",
                        { oppiaineId: items[nextIndex].$oppiaine.id },
                        { location: "replace" }
                    );
                }
            };

            function textCallback(item) {
                if (item.$osa) {
                    item.$selected = "" + $stateParams.tekstikappaleId === "" + item.$osa.id;
                    item.$hidden = item.depth > 0;
                } else if (item.id === "laajaalaiset") {
                    item.$selected = $state.is(epEsitysSettings.perusopetusState + ".laajaalaiset");
                }
                if (item.$selected) {
                    selected = item;
                }
            }

            function setParent() {
                if (selected && selected.$oppiaine) {
                    var found = _.find(items, function(item: any) {
                        return item.$vuosi === "" + selected.$parent_vuosi;
                    });
                    if (found) {
                        found.$header = true;
                    }
                }
            }

            var states = {
                tekstikappale: {
                    index: 0,
                    callback: textCallback
                },
                tiedot: {
                    index: 0,
                    callback: function(item) {
                        item.$selected =
                            _.isArray(item.link) &&
                            item.link.length > 0 &&
                            _.last(item.link[0].split(".")) === "tiedot";
                    }
                },
                laajaalaiset: {
                    index: 0,
                    callback: function(item) {
                        item.$selected =
                            _.isArray(item.link) &&
                            item.link.length > 0 &&
                            _.last(item.link[0].split(".")) === "laajaalaiset";
                    }
                },
                vuosiluokkakokonaisuus: {
                    index: 1,
                    callback: function(item) {
                        if (item.$vkl) {
                            item.$selected = "" + $stateParams.vlkId === "" + item.$vkl.id;
                        }
                        if (item.$selected) {
                            selected = item;
                        }
                    }
                },
                vuosiluokka: {
                    index: 1,
                    callback: function(item) {
                        if (item.$vuosi) {
                            item.$selected = "" + $stateParams.vuosi === "" + item.$vuosi_num;
                        }
                        if (item.$selected) {
                            selected = item;
                        }
                    },
                    actions: function() {
                        items = section.items;
                        goToFirstChild(selected, items);
                    }
                },
                vlkoppiaine: {
                    index: 1,
                    callback: function(item) {
                        if (item.$vkl) {
                            item.$header = "" + $stateParams.vlkId === "" + item.$vkl.id;
                            parentVlkId = item.$vkl.id;
                        }
                        if (item.$vuosi) {
                            item.$header = "" + $stateParams.vuosi === "" + item.$vuosi_num;
                        }
                        if (item.$oppiaine) {
                            item.$selected =
                                "" + $stateParams.oppiaineId === "" + item.$oppiaine.id &&
                                $stateParams.vlkId === "" + parentVlkId;
                        }
                        if (item.$selected) {
                            selected = item;
                        }
                    },
                    actions: function() {
                        items = section.items;
                        setParentOppiaineHeader();
                    }
                },
                oppiaine: {
                    index: 1,
                    callback: function(item) {
                        if (item.$oppiaine) {
                            item.$selected =
                                "" + $stateParams.oppiaineId === "" + item.$oppiaine.id &&
                                _.endsWith(item.$parent_vuosi, $stateParams.vuosi);
                        }
                        if (item.$vaihe) {
                            item.$selected = "" + $stateParams.vaiheId === "" + item.$vaihe.id;
                        }
                        if (item.$selected) {
                            selected = item;
                        }
                    },
                    actions: function() {
                        items = section.items;
                        setParent();
                    }
                },
                valinainenoppiaine: {
                    index: 1,
                    callback: function(item) {
                        if (item.$oppiaine) {
                            item.$selected =
                                "" + $stateParams.oppiaineId === "" + item.$oppiaine.id &&
                                _.endsWith(item.$parent_vuosi, $stateParams.vuosi);
                        }
                        if (item.$vaihe) {
                            item.$selected = "" + $stateParams.vaiheId === "" + item.$vaihe.id;
                        }
                        if (item.$selected) {
                            selected = item;
                        }
                    },
                    actions: function() {
                        items = section.items;
                        setParent();
                    }
                },
                vaihe: {
                    index: 1,
                    callback: function(item) {
                        if (item.$vaihe != null) {
                            item.$selected = "" + $stateParams.vaiheId === "" + item.$vaihe.id;
                        }
                        if (item.$selected) {
                            selected = item;
                        }
                    },
                    actions: function() {
                        items = section.items;
                        setParent();
                    }
                },
                kurssi: {
                    index: 1,
                    callback: function(item) {
                        if (item.$vaihe != null) {
                            item.$selected = "" + $stateParams.vaiheId === "" + item.$vaihe.id;
                        }
                        if (item.$selected) {
                            selected = item;
                        }
                    },
                    actions: function() {
                        items = section.items;
                        setParent();
                    }
                },
                oppiaineet: {
                    index: 2,
                    callback: function(item) {
                        if (item.$oppiaine) {
                            item.$selected = "" + $stateParams.oppiaineId === "" + item.$oppiaine.id;
                        }
                        if (item.$selected) {
                            selected = item;
                        }
                    },
                    actions: function() {
                        items = section.items;
                        setParentOppiaineHeader();
                    }
                },
                vuosiluokat: {
                    index: 2,
                    callback: function(item) {
                        if (item.$oppiaine) {
                            item.$selected = "" + $stateParams.oppiaineId === "" + item.$oppiaine.id;
                        }
                        if (item.$selected) {
                            selected = item;
                        }
                    },
                    actions: function() {
                        items = section.items;
                    }
                },
                valinnaisetoppiaineet: {
                    index: 3,
                    callback: function(item) {
                        if (item.$oppiaine) {
                            item.$selected = "" + $stateParams.oppiaineId === "" + item.$oppiaine.id;
                        }
                        if (item.$selected) {
                            selected = item;
                        }
                    },
                    actions: function() {
                        items = section.items;
                        setParentOppiaineHeader();
                    }
                },
                vlk: {
                    index: 2,
                    callback: function(item) {
                        if (item.$oppiaine) {
                            item.$selected = "" + $stateParams.oppiaineId === "" + item.$oppiaine.id;
                        }
                        if (item.$selected) {
                            selected = item;
                        }
                    },
                    actions: function() {
                        items = section.items;
                        setParentOppiaineHeader();
                    }
                },
                vuosi: {
                    index: 2,
                    callback: function(item) {
                        if (item.$oppiaine) {
                            item.$selected = "" + $stateParams.oppiaineId === "" + item.$oppiaine.id;
                        }
                        if (item.$selected) {
                            selected = item;
                        }
                    },
                    actions: function() {
                        items = section.items;
                        setParentOppiaineHeader();
                    }
                }
            };

            var parentVlkId = null;
            _.each(states, function(value: any, key) {
                if (_.last($state.current.name.split(".")) == key) {
                    processSection(navi, value.index, value.callback || angular.noop);
                    (value.actions || angular.noop)();
                }
            });

            if (selected && section) {
                var menuItems = items || section.items;
                var parent = selected.$parent;
                while (_.isNumber(parent)) {
                    menuItems[parent].$header = true;
                    parent = menuItems[parent].$parent;
                }
                epSivunaviUtils.unCollapse(menuItems, selected);
                epSivunaviUtils.traverse(menuItems, 0);
                $rootScope.$broadcast("ops:stateSet");
            }
        };
        this.getState = function() {
            return state;
        };
    });
