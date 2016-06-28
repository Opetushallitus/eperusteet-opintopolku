namespace TermistoData {
  let i, _termisto, ktId;

  const termistoAPI = () => {
    return i.Api.one("koulutustoimijat", ktId).all('termisto');
  };

  export const init = ($injector) => {
    i = inject($injector, ["Api", "$stateParams", "$q"]);
  };

  const getTermisto = () => {
    let deferred = i.$q.defer();
    if (_termisto) {
      deferred.resolve(_termisto);
    }
    else {
      _termisto = termistoAPI().getList();
      deferred.resolve(_termisto);
    }
    return deferred.promise;
  };

  export const getAll = () => {
    return getTermisto();
  };

  const filterByKey = (kasitteet, key) => {
    return _.filter(kasitteet, (kasite:any) => kasite.avain === key)[0];
  };

  const getByKey = (key, termisto = _termisto) => {
    return termisto.then((kasitteet) => {
      return filterByKey(kasitteet, key);
    })
  };

  export const refresh = () => {
    _termisto = null;
    return getTermisto();
  };

  export const getByAvain = (avain, id) => {
    ktId = id;
    if (_termisto && getByKey(avain)) {
      return getByKey(avain);
    }

    return refresh().then((res) => getByKey(avain));
  };
}

angular.module("app")
.run(($injector) => $injector.invoke(TermistoData.init));
