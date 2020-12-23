/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
const path = require('path');
const defaults = require('lodash/defaults');
const EntryDependency = require('webpack/lib/dependencies/EntryDependency');
const {
  NODE_MODULES_REG,
  fsExists,
  readConfig,
  readConfigSync,
  isEmptyObject,
  addChunksToAsset,
} = require('./utils');

const PLUGIN_NAME = 'MiniprogramWebpackPlugin';

module.exports = class MiniprogramWebpackPlugin {
  appEntry = '';

  appConfig = {};

  projectConfigPath = '';

  projectConfig = {};

  /**
   * interface Page {
   *   name: string;
   *   path: string;
   *   scriptExt: '.js' | '.ts',
   * }
   */
  pages = new Map();

  /**
   * interface Component {
   *   name: string;
   *   path: string;
   *   scriptExt: '.js' | '.ts',
   * }
   */
  components = new Map();

  tabBarIcons = new Set();

  constructor(options = {}) {
    this.options = defaults(options || {}, {
      sourceDir: '',
      outputDir: '',
      entryFileName: 'app',
    });
  }

  tryAsync = fn => async (arg, callback) => {
    try {
      await fn(arg);
      callback();
    } catch (err) {
      callback(err);
    }
  };

  apply(compiler) {
    this.appEntry = this.getAppEntry(compiler);
    this.projectConfigPath = path.join(compiler.context, 'project.config.json');
    this.compiler = compiler;
    compiler.hooks.entryOption.tap(PLUGIN_NAME, () => {
      this.startup();
      this.applyOption();
    });
    compiler.hooks.run.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async () => {
        await this.run();
      }),
    );
    compiler.hooks.watchRun.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async () => {
        await this.run();
      }),
    );
    compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
      compilation.hooks.additionalAssets.tapAsync(PLUGIN_NAME, callback => {
        this.generateConfigFile(compilation);
        callback();
      });
      compilation.hooks.afterOptimizeAssets.tap(PLUGIN_NAME, assets => {
        Object.keys(assets).forEach(assetPath => {
          const styleExt = '.wxss';
          const templateExt = '.wxml';
          if (new RegExp(`(\\${styleExt}|\\${templateExt})\\.js(\\.map)?$`).test(assetPath)) {
            delete assets[assetPath];
          }
          if (/project\.config\.json\.js(\.map)?$/.test(assetPath)) {
            delete assets[assetPath];
          }
          // TODO
          if (assetPath === 'app.js') {
            assets[assetPath] = addChunksToAsset(assets[assetPath], [
              'runtime',
              'common',
              'vendors',
            ]);
          }
        });
      });
    });
    compiler.hooks.make.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async compilation => {
        const promises = [];
        promises.push(this.addEntry(compilation, this.getStylePath(this.appEntry)));
        [...this.pages, ...this.components].forEach(([, component]) =>
          promises.push(this.addComponentEntry(compilation, component)),
        );
        await Promise.all(promises);
      }),
    );
  }

  applyOption() {
    const { options } = this.compiler;
    this.tabBarIcons.forEach(icon => {
      options.entry.app.import.push(`./${icon}`);
    });
  }

  startup() {
    this.getAppConfig();
    this.getProjectConfig();
    this.getTabBarIcons();
  }

  async run() {
    await this.getPages();
    this.getSubPackages();
    await this.getComponents();
  }

  getAppEntry(compiler) {
    const { entry } = compiler.options;
    const { entryFileName } = this.options;
    function getEntryPath(e) {
      const app = e[entryFileName];
      if (Array.isArray(app)) {
        return app.filter(item => path.basename(item, path.extname(item)) === entryFileName)[0];
      }
      return app.import[0];
    }
    const appEntryPath = path.join(compiler.context, getEntryPath(entry));
    return appEntryPath;
  }

  getAppConfig() {
    const configPath = this.getConfigPath(this.appEntry);
    const config = readConfigSync(configPath);
    if (isEmptyObject(config)) {
      throw new Error('缺少 app 全局配置，请检查！');
    }
    this.appConfig = config;
  }

  getProjectConfig() {
    const config = readConfigSync(this.projectConfigPath);
    if (isEmptyObject(config)) {
      throw new Error('缺少 project 全局配置，请检查！');
    }
    this.projectConfig = config;
  }

  getTabBarIcons() {
    const { tabBar = {} } = this.appConfig;
    const tabBarList = tabBar.list || [];
    for (const tabBarItem of tabBarList) {
      if (tabBarItem.iconPath) {
        this.tabBarIcons.add(tabBarItem.iconPath);
      }
      if (tabBarItem.selectedIconPath) {
        this.tabBarIcons.add(tabBarItem.selectedIconPath);
      }
    }
  }

  getTabBarIconsReg(withJS = false) {
    const tabBarIconsPattern = [];
    this.tabBarIcons.forEach(icon => {
      tabBarIconsPattern.push(icon.replace(/(\/|\.)/g, `\\$1`));
    });
    let pattern = tabBarIconsPattern.join('|');
    if (withJS) {
      pattern = `(${pattern})\\.js(\\.map)?$`;
    }
    return new RegExp(pattern);
  }

  async getPages() {
    const appPages = this.appConfig.pages;
    if (!appPages || !appPages.length) {
      throw new Error('全局配置缺少 pages 字段，请检查！');
    }

    await Promise.all(
      appPages.map(async item => {
        const pagePath = path.join(this.compiler.context, item);
        const configPath = this.getConfigPath(pagePath);
        const config = await readConfig(configPath);
        return [
          pagePath,
          {
            name: item,
            path: pagePath,
            config,
          },
        ];
      }),
    ).then(pages => {
      this.pages = new Map(pages);
    });
  }

  getConfigPath(filepath) {
    const parsedPath = path.parse(filepath);
    parsedPath.ext = '.json';
    parsedPath.base = parsedPath.name + parsedPath.ext;
    return path.format(parsedPath);
  }

  getTemplatePath(filepath) {
    const parsedPath = path.parse(filepath);
    parsedPath.ext = '.wxml';
    parsedPath.base = parsedPath.name + parsedPath.ext;
    return path.format(parsedPath);
  }

  getStylePath(filepath) {
    const parsedPath = path.parse(filepath);
    parsedPath.ext = '.wxss';
    parsedPath.base = parsedPath.name + parsedPath.ext;
    return path.format(parsedPath);
  }

  getSubPackages() {
    const subPackages = this.appConfig.subPackages || this.appConfig.subpackages;
    if (subPackages && subPackages.length) {
      subPackages.forEach(item => {
        if (item.pages && item.pages.length) {
          const { root } = item;
          item.pages.forEach(page => {
            const pagePath = path.join(this.compiler.context, root, page);
            if (!this.pages.has(pagePath)) {
              this.pages.set(pagePath, {
                name: path.join(root, page),
                path: pagePath,
                scriptExt: '.js',
              });
            }
          });
        }
      });
    }
  }

  getComponentName(componentPath) {
    let componentName = '';
    if (NODE_MODULES_REG.test(componentPath)) {
      componentName = componentPath
        .replace(this.compiler.context, '')
        .replace(/\\/g, '/')
        .replace(path.extname(componentPath), '');
      componentName = componentName.replace(/node_modules/gi, 'npm');
    } else {
      componentName = componentPath
        .replace(this.compiler.context, '')
        .replace(/\\/g, '/')
        .replace(path.extname(componentPath), '');
    }

    return componentName.replace(/^(\/|\\)/, '');
  }

  async getComponents() {
    const { usingComponents = {} } = this.appConfig;
    let task = Promise.resolve();
    // eslint-disable-next-line guard-for-in
    for (const component in usingComponents) {
      task = task.then(() =>
        this.addComponent(path.join(this.compiler.context, usingComponents[component])),
      );
    }
    this.pages.forEach(page => {
      task = task.then(() => this.addComponent(page.path, true));
    });
    return task;
  }

  async addComponent(componentPath, isPage = false) {
    let task = Promise.resolve();
    if (!this.components.has(componentPath) || isPage) {
      if (!isPage) {
        this.components.set(componentPath, {
          name: this.getComponentName(componentPath),
          path: componentPath,
          scriptExt: '.js',
        });
      }

      const component = isPage ? this.pages.get(componentPath) : this.components.get(componentPath);
      const configPath = this.getConfigPath(componentPath);
      const config = await readConfig(configPath);
      component.config = config;
      const { usingComponents = {} } = config;
      // eslint-disable-next-line guard-for-in
      for (const componentName in usingComponents) {
        task = task.then(() =>
          this.addComponent(path.join(componentPath, '../', usingComponents[componentName])),
        );
      }
    }
    return task;
  }

  addEntry(compilation, entryPath) {
    const entry = new EntryDependency(entryPath);
    const name = entryPath.replace(`${this.compiler.context}/`, '');
    entry.loc = { name };
    return new Promise((resolve, reject) => {
      compilation.addEntry(this.compiler.context, entry, name, err =>
        err ? reject(err) : resolve(),
      );
    });
  }

  addComponentEntry(compilation, component) {
    const templatePath = this.getTemplatePath(component.path);
    const stylePath = this.getStylePath(component.path);
    const promises = [];
    promises.push(this.addEntry(compilation, component.path));
    promises.push(this.addEntry(compilation, templatePath));
    fsExists(stylePath)
      .then(() => {
        promises.push(this.addEntry(compilation, stylePath));
      })
      .catch(() => {});
    return Promise.all(promises);
  }

  generateConfigFile(compilation) {
    [
      [
        this.appEntry,
        {
          path: this.appEntry,
          config: this.appConfig,
        },
      ],
      ...this.pages,
      ...this.components,
    ].forEach(([, component]) => {
      const stringifiedConfig = JSON.stringify(component.config, null, 2);
      const name = this.getConfigPath(this.getComponentName(component.path));
      compilation.assets[name] = {
        source: () => stringifiedConfig,
        size: () => stringifiedConfig.length,
      };
    });
    const stringifiedConfig = JSON.stringify(this.projectConfig, null, 2);
    compilation.assets['project.config.json'] = {
      source: () => stringifiedConfig,
      size: () => stringifiedConfig.length,
    };
  }
};
