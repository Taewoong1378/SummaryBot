/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

const nextConfig = {
  swcMinify: true,
  compress: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  i18n: {
    locales: ['ko'],
    defaultLocale: 'ko',
  },
  transpilePackages: ['shared-utils', 'design-system'],
};

module.exports = {
  webpack(config, { webpack, isServer }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: false,
            svgoConfig: {
              plugins: [
                {
                  name: 'removeViewBox',
                  active: false,
                },
                {
                  name: 'convertStyleToAttrs',
                  active: true,
                },
              ],
            },
          },
        },
      ],
    });

    const prod = process.env.NEXT_PUBLIC_PLATFORM_ENV === 'production';

    if (prod) {
      config.plugins.push(new CompressionPlugin());
    } else {
      config.watchOptions = {
        ignored: [
          path.posix.resolve(
            __dirname,
            '../../packages/design-system/src/assets/icon',
          ),
        ],
      };
    }

    if (!isServer && !prod) {
      config.plugins.push(
        new WebpackShellPluginNext({
          onBeforeBuild: {
            scripts: [
              'ts-node ../../packages/design-system/src/scripts/create-icon-mapping.ts',
            ],
            blocking: false,
            parallel: false,
          },
          dev: prod,
        }),
      );
    }

    return config;
  },
  ...nextConfig,
};
