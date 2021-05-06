/* eslint-disable */
const path = require('path');
const { RawSource } = require('webpack').sources;
const loaderUtils = require('loader-utils');
const cssReplace = require('./css-replace');

const isCSS = name => /\.(css|wxss|less|scss|sass)$/.test(name);
// const strip = (str) => str.replace(/\/$/, '')

class CssUrlRelativePlugin {
  constructor(options) {
    this.options = options || {};
  }

  fixCssUrl(compilation, assets, done) {
    const { root } = this.options;
    const publicPath = compilation.options.output.publicPath || '';

    Object.keys(assets).forEach(assetPath => {
      if (!isCSS(assetPath)) {
        return;
      }

      const asset = assets[assetPath];
      const dirname = path.dirname(assetPath);
      let source = asset.source();

      // replace url to relative
      source = cssReplace(source.toString(), refer => {
        // handle url(...)
        if (refer.type === 'url' && loaderUtils.isUrlRequest(refer.path, root)) {
          // remove publicPath parts
          let pathname = refer.path;
          if (publicPath && pathname.startsWith(publicPath)) {
            pathname = pathname.substring(publicPath.length);
          }

          // get relative path
          pathname = path.relative(dirname, pathname).replace(/\\/g, '/');

          return `url(${pathname})`;
        }

        // return original rule
        return refer.rule;
      });

      assets[assetPath] = new RawSource(source);
    });

    done();
  }

  apply(compiler) {
    const plugin = {
      name: 'CssUrlRelativePlugin',
    };

    // use compilation instead of this-compilation, just like other plugins do
    compiler.hooks.compilation.tap(plugin, compilation => {
      compilation.hooks.processAssets.tapAsync(plugin, (chunks, done) => {
        this.fixCssUrl(compilation, chunks, done);
      });
    });
  }
}

module.exports = CssUrlRelativePlugin;
