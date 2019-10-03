#!/bin/bash
# Generoi SDK:n apikuvauksen perusteella.

if [[ -z $YLOPS_SERVICE_DIR ]]
then
  printf "\x1b[1mYLOPS_SERVICE_DIR\x1b[0m is not set.\n"
  printf "For example, call export \x1b[1mYLOPS_SERVICE_DIR="
  printf "%s" "$HOME"
  printf "/eperusteet-ylops/eperusteet-ylops-service\x1b[0m\n"
  exit 1
fi

if [[ -z $EPERUSTEET_SERVICE_DIR ]]
then
  printf "\x1b[1mEPERUSTEET_SERVICE_DIR\x1b[0m is not set.\n"
  printf "For example, call export \x1b[1mEPERUSTEET_SERVICE_DIR="
  printf "%s" "$HOME"
  printf "/eperusteet/eperusteet-ylops-service\x1b[0m\n"
  exit 1
fi

rootdir=$(pwd)
genconfig="${rootdir}/generator.config.json"

eperusteetgen="${rootdir}/src/generated/eperusteet"
ylopsgen="${rootdir}/src/generated/ylops"

mkdir -p "${ylopsgen}"
cd "${ylopsgen}" || exit 1

specfile="$YLOPS_SERVICE_DIR/target/openapi/ylops.spec.json"
cd "$YLOPS_SERVICE_DIR" \
  && mvn clean compile -Pgenerate-openapi \
  && cd "${ylopsgen}" \
  && npx openapi-generator generate -c "${genconfig}" -i "$specfile" -g typescript-axios

mkdir -p ${eperusteetgen}
cd ${eperusteetgen} || exit 1

specfile="$EPERUSTEET_SERVICE_DIR/target/openapi/eperusteet.spec.json"
cd "$EPERUSTEET_SERVICE_DIR" \
  && mvn clean compile -Pgenerate-openapi \
  && cd "${eperusteetgen}" \
  && npx openapi-generator generate -c "${genconfig}" -i "$specfile" -g typescript-axios

