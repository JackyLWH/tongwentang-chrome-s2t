// @ts-check
const path = require('path');
const { watch, readFileSync } = require('fs');
const rspack = require('@rspack/core');

const dictionaryFiles = ['s2t-char.min.json', 's2t-phrase.min.json'];

function validateDictionaries(distPath) {
  for (const file of dictionaryFiles) {
    const filename = path.join(distPath, 'dictionaries', file);
    let dictionary;
    try {
      dictionary = JSON.parse(readFileSync(filename, 'utf8'));
    } catch {
      throw new Error(`Missing or invalid dictionary JSON: ${filename}`);
    }
    if (
      dictionary === null ||
      typeof dictionary !== 'object' ||
      Array.isArray(dictionary) ||
      Object.entries(dictionary).some(([key, value]) => !key || typeof value !== 'string')
    ) {
      throw new Error(`Dictionary must contain non-empty keys and string values: ${filename}`);
    }
  }
}

/**
 * @type {(_env: Record<string, string>, argv: Record<string, string>) => import('@rspack/cli').Configuration}
 */
module.exports = (_env, argv) => {
  const isProd = argv.mode === 'production';
  const distPath = path.resolve(__dirname, 'dist', 'chromium');

  return {
    context: __dirname,
    devtool: isProd ? false : 'source-map',
    watch: !isProd,
    entry: {
      background: './src/background/main.ts',
      content: './src/content/main.ts',
      options: './src/options/index.tsx',
    },
    output: {
      path: distPath,
      filename: '[name].js',
      clean: { keep: 'dictionaries' },
    },
    resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: [/node_modules/],
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: { syntax: 'typescript' },
            },
          },
          type: 'javascript/auto',
        },
        {
          test: /\.[jt]sx$/,
          use: {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: { syntax: 'typescript', jsx: true },
                transform: {
                  react: {
                    runtime: 'automatic',
                    throwIfNamespace: true,
                    development: false,
                    useBuiltins: false,
                  },
                },
              },
            },
          },
          type: 'javascript/auto',
        },
      ],
    },
    plugins: [
      compiler => {
        compiler.hooks.beforeRun.tap('validate dictionaries', () => validateDictionaries(distPath));
        compiler.hooks.watchRun.tap('validate dictionaries', () => validateDictionaries(distPath));
      },
      new rspack.HtmlRspackPlugin({
        filename: 'options.html',
        template: './src/options/index.html',
        chunks: ['options'],
      }),
      new rspack.CopyRspackPlugin({
        patterns: [
          { from: './src/_locales/', to: '_locales/', toType: 'dir' },
          { from: './node_modules/spectre.css/dist/spectre.min.css' },
          { from: './node_modules/spectre.css/dist/spectre-icons.min.css' },
          { from: './src/icons', to: 'icons' },
        ],
      }),
      compiler => {
        const state = { manifest: false };

        function writeManifest() {
          delete require.cache[require.resolve('./manifest.js')];
          require('./manifest.js').writeManifest(distPath);
        }

        compiler.hooks.done.tap('generate manifest.json', () => {
          if (state.manifest) return;
          state.manifest = true;

          writeManifest();

          if (isProd) return;

          watch(path.resolve(__dirname, 'manifest.js'), event => {
            if (event !== 'change') return;
            writeManifest();
          });
        });
      },
    ],
  };
};
