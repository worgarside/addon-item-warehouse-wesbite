/** @type {import('next').NextConfig} */


let nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
};

let hassioRefererPath = process.env.HASSIO_REFERER_PATH || "";

if (hassioRefererPath) {
    hassioRefererPath = '/' + hassioRefererPath.trimStart('/').trimEnd('/');

    nextConfig = {
        ...nextConfig,
        assetPrefix: hassioRefererPath,
    }
}

const redirectPath = process.env.REDIRECT_PATH;

if (redirectPath) {
    nextConfig = {
        ...nextConfig,
        async rewrites() {
            return [
                {
                    source: '/:path*',
                    destination: `${redirectPath}/:path*`,
                },
            ];
        }
    }
}


console.log('nextConfig', nextConfig);

module.exports = nextConfig;
