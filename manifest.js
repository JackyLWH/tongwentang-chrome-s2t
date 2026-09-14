// @ts-check
const { writeFileSync } = require('fs');
const { resolve } = require('path');
const pkg = require('./package.json');

const createManifest = () => {
  return {
    manifest_version: 3,
    minimum_chrome_version: '116',
    name: '__MSG_MSG_EXT_NAME__',
    version: pkg.version,
    description: '__MSG_MSG_EXT_DESC__',
    author: 't7yang',
    homepage_url: 'https://github.com/tongwentang/tongwentang-extension',
    default_locale: 'en',
    icons: {
      16: 'icons/tongwen-icon-16.png',
      32: 'icons/tongwen-icon-32.png',
      48: 'icons/tongwen-icon-48.png',
      128: 'icons/tongwen-icon-128.png',
    },
    permissions: ['downloads', 'notifications', 'storage', 'unlimitedStorage'],
    background: { service_worker: 'background.js' },
    content_scripts: [
      {
        matches: ['<all_urls>'],
        js: ['content.js'],
        all_frames: true,
        run_at: 'document_start',
      },
    ],
    web_accessible_resources: [
      {
        resources: ['dictionaries/s2t-char.min.json', 'dictionaries/s2t-phrase.min.json'],
        matches: ['<all_urls>'],
      },
    ],
    action: {
      default_icon: {
        16: 'icons/tongwen-icon-16.png',
        32: 'icons/tongwen-icon-32.png',
        48: 'icons/tongwen-icon-48.png',
        128: 'icons/tongwen-icon-128.png',
      },
    },
    options_ui: {
      open_in_tab: true,
      page: 'options.html',
    },
  };
};

/**
 * @param {string} path
 * @returns {void}
 */
const writeManifest = path => {
  const manifest = createManifest();
  writeFileSync(resolve(path, 'manifest.json'), JSON.stringify(manifest, null, 2));
};

module.exports = { writeManifest };

if (require.main === module) {
  writeManifest(process.env.distPath || '');
}
