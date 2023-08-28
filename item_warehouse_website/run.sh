#!/usr/bin/with-contenv bashio

if [[ -z "${NEXT_PUBLIC_API_BASE_URL-}" ]]; then
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

if [[ -z "${hassio_referer_path-}" ]]; then
    HASSIO_REFERER_PATH=$(bashio::config 'hassio_referer_path')
fi

if [[ "${HASSIO_REFERER_PATH}" == "null" ]]; then
    unset HASSIO_REFERER_PATH
    echo "HASSIO_REFERER_PATH is not set."
else
    # Remove all leading slashes
    while [[ ${HASSIO_REFERER_PATH} == /* ]]; do
        HASSIO_REFERER_PATH="${HASSIO_REFERER_PATH#/}"
    done

    # Remove all trailing slashes
    while [[ ${HASSIO_REFERER_PATH} == */ ]]; do
        HASSIO_REFERER_PATH="${HASSIO_REFERER_PATH%/}"
    done

    # Add exactly one leading slash
    HASSIO_REFERER_PATH="/${HASSIO_REFERER_PATH}"

    NEXT_PUBLIC_HASSIO_REFERER_PATH="${HASSIO_REFERER_PATH}/"

    export HASSIO_REFERER_PATH
    export NEXT_PUBLIC_HASSIO_REFERER_PATH
    echo "HASSIO_REFERER_PATH=${HASSIO_REFERER_PATH}"
    echo "NEXT_PUBLIC_HASSIO_REFERER_PATH=${NEXT_PUBLIC_HASSIO_REFERER_PATH}"
fi

if [[ -z "${REDIRECT_PATH-}" ]]; then
    REDIRECT_PATH=$(bashio::config 'redirect_path')
fi

if [[ "${REDIRECT_PATH}" == "null" ]]; then
    unset REDIRECT_PATH
    echo "REDIRECT_PATH is not set."
else
    # Remove all leading slashes
    while [[ ${REDIRECT_PATH} == /* ]]; do
        REDIRECT_PATH="${REDIRECT_PATH#/}"
    done

    # Remove all trailing slashes
    while [[ ${REDIRECT_PATH} == */ ]]; do
        REDIRECT_PATH="${REDIRECT_PATH%/}"
    done

    # Add exactly one leading slash
    REDIRECT_PATH="/${REDIRECT_PATH}"

    export REDIRECT_PATH
    echo "REDIRECT_PATH=${REDIRECT_PATH}"
fi

npm run build

npm run start
