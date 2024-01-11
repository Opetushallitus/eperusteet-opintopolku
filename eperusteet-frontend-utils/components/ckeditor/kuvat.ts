angular.module("app")
.controller("EpImagePluginController", function ($scope, Api, $timeout, $stateParams, FileUploader, $q, $cookies, Palvelu) {
    $scope.filtered = [];
    $scope.images = [];
    $scope.showPreview = true;
    $scope.model = {
        files: [],
        rejected: [],
        chosen: null
    };
    $scope.scaleError = false;
    $scope.liitteet = Api.one("koulutustoimijat", $stateParams.ktId).one("opetussuunnitelmat", $stateParams.opsId);
    let setDeferred = null;
    let callback = angular.noop;

    // Uploader kuvan lisäämistä varten
    $scope.uploader = new FileUploader({
        url: $scope.liitteet.getRestangularUrl() + "/kuvat",
        headers: {
            CSRF: $cookies.get("CSRF"),
            'Caller-Id': '1.2.246.562.10.00000000001.eperusteet',
        },
        queueLimit: "1"
    });

    // Lisätään esikatselussa olevaan kuvaan nimi, leveys ja korkeus
    $scope.uploader.onAfterAddingFile = (item) => {
        let reader = new FileReader();
        reader.onload = () => {
            let img: any = new Image();
            img.src = reader.result;
            img.onload = function () {
                // Tiedot backendiä varten
                item.formData.push({
                    nimi: item.file.name,
                    width: img.width,
                    height: img.height,
                });
            };
        };

        reader.readAsDataURL(item._file);
    };

    // Lisätään uploaderiin kuva suodatin
    $scope.uploader.filters.push({
        name: "imageFilter",
        fn: (item) => {
            const type = "|" + item.type.slice(item.type.lastIndexOf("/") + 1) + "|";
            return "|jpg|jpeg|png|".indexOf(type) !== -1;
        }
    });

    // Kuva lähetetty palvelimelle onnistuneesti
    $scope.uploader.onSuccessItem = () => {
        $scope.uploader.queue = [];
        getKuvat();
    };

    $scope.clear = () => {
        $scope.model.chosen = null;
    };

    $scope.init = () => {
        return getKuvat();
    };

    const getMeta = (url, obj) => {
        let img: any = new Image();
        img.src = url;
        img.onload = function() {
            obj.width = this.width;
            obj.height = this.height;
            obj.originalWidth = this.width;
            obj.originalHeight = this.height;
            obj.src = url;
        };
    };

    const getKuvat = async () => {
        const images = await $scope.liitteet.getList("kuvat");
        _.each(images, (img) => {
            getMeta($scope.liitteet.getRestangularUrl() + "/kuvat/" + img.id, img);
        });
        $scope.images = images;
        $scope.filtered = Algoritmit.doSortByNimi(images);
    };

    const setChosenValue = (element) => {
        // Etsitään muokattava kuva kaikista kuvista
        const found = _.find($scope.images, (image: any) => {
            return image.id === element.getAttribute("data-uid");
        });

        // Jos ei löydy, ei aseteta kuvaa valituksi
        if (found == null) {
            return;
        }

        $scope.model.chosen = found;

        // Haetaan muokattavalle kuvalle muut attribuutit
        getMeta($scope.liitteet.getRestangularUrl() + "/kuvat/" + found.id, $scope.model.chosen);

        if (element.hasAttribute("alt")) {
            found.alt = element.getAttribute("alt");
        }

    };

    // Rekisteröidään callback
    $scope.registerListener = (cb) => {
        callback = cb;
    };

    // Jos valittu kuva muuttuu lähetetään ckeditor pluginille tieto
    $scope.$watch("model.chosen", (value) => {
        callback(value);
    });

    // Asetetaan muokattavana oleva kuva valituksi
    $scope.setValue = (element) => {
        getKuvat().then(() => setChosenValue(element));
    };

    $scope.getChosen = () => {
        return $scope.model.chosen;
    };

    $scope.widthChange = (img) => {
        $scope.scaleError = false;
        const tmp = img.width / img.originalWidth;
        img.height = Math.round(tmp * img.originalHeight);
    };

    $scope.heightChange = (img) => {
        $scope.scaleError = false;
        const tmp = img.height / img.originalHeight;
        img.width = Math.round(tmp * img.originalWidth);
    };

    $scope.filterImages = (value) => {
        $scope.filtered = _.filter(Algoritmit.doSortByNimi($scope.images), (item) => {
            return Algoritmit.match(value, item.nimi);
        });
    };


})
.directive("ngThumb", ["$window", function($window) {
    const helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function(item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function(file) {
            const ftype =  "|" + file.type.slice(file.type.lastIndexOf("/") + 1) + "|";
            return "|jpg|png|jpeg|bmp|gif|".indexOf(ftype) !== -1;
        }
    };

    return {
        restrict: "A",
        template: "<canvas/>",
        link: function(scope, element, attributes) {
            if (!helper.support) return;

            const params = scope.$eval(attributes.ngThumb);

            if (!helper.isFile(params.file)) return;
            if (!helper.isImage(params.file)) return;

            const canvas: any = element.find("canvas");
            const reader = new FileReader();

            reader.onload = onLoadFile;
            reader.readAsDataURL(params.file);

            function onLoadFile(event) {
                const img = new Image();
                img.onload = onLoadImage;
                img.src = event.target.result;
            }

            function onLoadImage() {
                const width = params.width || this.width / this.height * params.height;
                const height = params.height || this.height / this.width * params.width;
                canvas.attr({ width, height });
                canvas[0].getContext("2d").drawImage(this, 0, 0, width, height);
            }
        }
    };
}])
.filter("kuvalinkit", (Api, $stateParams) => {
    return (text) => {
        const koulutustoimija = Api.one("koulutustoimijat", $stateParams.ktId);
        const ops = koulutustoimija.one("opetussuunnitelmat", $stateParams.opsId);
        let modified = false;
        let tmp = angular.element("<div>" + text + "</div>");
        tmp.find("img[data-uid]").each(function () {
            let el = angular.element(this);
            el.wrap("<figure></figure>");
            if (el.attr("alt") !== "undefined") {
                el.parent().append("<figcaption>" + el.attr("alt") + "</figcaption>");
                el.parent().wrap("<div style=\"text-align: center;\"></div>");
            }

            let url = ops.getRestangularUrl() + "/kuvat/" + el.attr("data-uid");

            if (el.attr("src") !== url) {
                modified = true;
                el.attr("src", url);
            }
        });

        if (modified) {
            return tmp.html();
        }

        return text;
    };
});
