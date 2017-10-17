angular.module("app").service("VirheService", function($state) {
    let data = {};
    this.setData = function(value) {
        data = value;
    };
    this.getData = function() {
        return data;
    };
    this.virhe = function(virhe) {
        data = _.isObject(virhe) ? virhe : { muu: virhe };
        $state.go("root.virhe", {
            location: "replace"
        });
    };
});
