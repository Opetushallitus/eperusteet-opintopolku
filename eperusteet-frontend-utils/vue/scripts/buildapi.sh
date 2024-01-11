#!/bin/bash

usage="$(basename "$0") [-g] [-h] [-s n] -- program to generate backend API

where:
    -s  set service: eperusteet, ylops, amosaa or all (default)
    -g  generate spec file
    -h  show this help text"

service=all
generateSpecFile=no
while getopts ':ghs:' option; do
  case "$option" in
    s) service=$OPTARG
      ;;
    g) generateSpecFile=yes
      ;;
    h) echo "$usage"
       exit
       ;;
    :) printf "missing argument for -%s\n" "$OPTARG" >&2
       echo "$usage" >&2
       exit 1
       ;;
   \?) printf "illegal option: -%s\n" "$OPTARG" >&2
       echo "$usage" >&2
       exit 1
       ;;
  esac
done
shift $((OPTIND - 1))

show_eperusteet_missing_env_warn() {
  if [[ -z $EPERUSTEET_SERVICE_DIR ]]
  then
    printf "\x1b[1mEPERUSTEET_SERVICE_DIR\x1b[0m is not set.\n"
    printf "For example, call export \x1b[1mEPERUSTEET_SERVICE_DIR="
    printf "%s" "$HOME"
    printf "/eperusteet/eperusteet-ylops-service\x1b[0m\n"
    exit 1
  fi
}

show_ylops_missing_env_warn() {
  if [[ -z $YLOPS_SERVICE_DIR ]]
  then
    printf "\x1b[1mYLOPS_SERVICE_DIR\x1b[0m is not set.\n"
    printf "For example, call export \x1b[1mYLOPS_SERVICE_DIR="
    printf "%s" "$HOME"
    printf "/eperusteet-ylops/eperusteet-ylops-service\x1b[0m\n"
    exit 1
  fi
}

show_amosaa_missing_env_warn() {
  if [[ -z $AMOSAA_SERVICE_DIR ]]
  then
    printf "\x1b[1mAMOSAA_SERVICE_DIR\x1b[0m is not set.\n"
    printf "For example, call export \x1b[1mAMOSAA_SERVICE_DIR="
    printf "%s" "$HOME"
    printf "/eperusteet-amosaa/eperusteet-amosaa-service\x1b[0m\n"
    exit 1
  fi
}

generate_eperusteet() {
	
  eperusteetgen="${rootdir}/src/generated/eperusteet"

  mkdir -p "${eperusteetgen}"
  cd "${eperusteetgen}" || exit 1
	
  if [[ $generateSpecFile = "yes" ]]
  then
    show_eperusteet_missing_env_warn
		
    cd "$EPERUSTEET_SERVICE_DIR" \
      && mvn clean compile --batch-mode -B -Pgenerate-openapi \
	  && cd "${eperusteetgen}"
  fi

  EPERUSTEET_SPECFILE=${EPERUSTEET_SPECFILE:-"https://raw.githubusercontent.com/Opetushallitus/eperusteet/master/generated/eperusteet.spec.json"}
  echo "Using EPERUSTEET_SPECFILE=${EPERUSTEET_SPECFILE}"
  npx @openapitools/openapi-generator-cli@1.0.18-4.2.3 generate -c "${genconfig}" -i "${EPERUSTEET_SPECFILE}" -g typescript-axios
}

generate_ylops() {

  ylopsgen="${rootdir}/src/generated/ylops"

  mkdir -p "${ylopsgen}"
  cd "${ylopsgen}" || exit 1

  if [[ $generateSpecFile = "yes" ]]
  then
	show_ylops_missing_env_warn
		
	cd "$YLOPS_SERVICE_DIR" \
      && mvn clean compile --batch-mode -B -Pgenerate-openapi \
	  && cd "${ylopsgen}"
  fi

  EPERUSTEET_YLOPS_SPECFILE=${EPERUSTEET_YLOPS_SPECFILE:-"https://raw.githubusercontent.com/Opetushallitus/eperusteet-ylops/master/generated/ylops.spec.json"}
  echo "Using EPERUSTEET_YLOPS_SPECFILE=${EPERUSTEET_YLOPS_SPECFILE}"
  npx @openapitools/openapi-generator-cli@1.0.18-4.2.3 generate -c "${genconfig}" -i "${EPERUSTEET_YLOPS_SPECFILE}" -g typescript-axios
}

generate_amosaa() {

  amosaagen="${rootdir}/src/generated/amosaa"

  mkdir -p "${amosaagen}"
  cd "${amosaagen}" || exit 1

  if [[ $generateSpecFile = "yes" ]]
  then
	show_amosaa_missing_env_warn
		
	cd "$AMOSAA_SERVICE_DIR" \
      && mvn clean compile --batch-mode -B -Pgenerate-openapi \
	  && cd "${amosaagen}"
  fi

  EPERUSTEET_AMOSAA_SPECFILE=${EPERUSTEET_AMOSAA_SPECFILE:-"https://raw.githubusercontent.com/Opetushallitus/eperusteet-amosaa/master/generated/amosaa.spec.json"}
  echo "Using EPERUSTEET_AMOSAA_SPECFILE=${EPERUSTEET_AMOSAA_SPECFILE}"
  npx @openapitools/openapi-generator-cli@1.0.18-4.2.3 generate -c "${genconfig}" -i "${EPERUSTEET_AMOSAA_SPECFILE}" -g typescript-axios
}

generate() {
  rootdir=$(pwd)
  genconfig="${rootdir}/generator.config.json"
  if [[ $service = "all" ]]
  then
    generate_eperusteet
    generate_ylops
    generate_amosaa
  elif [[ $service = "eperusteet" ]]
  then
    generate_eperusteet
  elif [[ $service = "ylops" ]]
  then
    generate_ylops
  elif [[ $service = "amosaa" ]]
  then
    generate_amosaa
  else
    echo invalid service: $service
    exit 1
  fi
}

generate
