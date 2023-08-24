#!/usr/bin/with-contenv bashio

API_BASE_URL_IN=$(bashio::config 'api_base_url')


if [[ -z "${API_BASE_URL-}" ]]
then
    export NEXT_PUBLIC_API_BASE_URL=${API_BASE_URL_IN}
fi

npm run start
