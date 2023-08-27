#!/usr/bin/with-contenv bashio

# If API_BASE_URL is set, use that. Otherwise, use the one from bashio config.
if [[ -n "${API_BASE_URL-}" ]]; then
    NEXT_PUBLIC_API_BASE_URL=${API_BASE_URL}
else
    NEXT_PUBLIC_API_BASE_URL=$(bashio::config 'api_base_url')
fi

# If NEXT_PUBLIC_API_BASE_URL is "null", then don't export it.
if [[ "${NEXT_PUBLIC_API_BASE_URL}" == "null" ]]; then
    unset NEXT_PUBLIC_API_BASE_URL
    echo "NEXT_PUBLIC_API_BASE_URL is not set."
    exit 1
else
    export NEXT_PUBLIC_API_BASE_URL
    echo "NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}"
fi

npm run build

npm run start
