const appid = process.env.NODE_ENV === 'production' ? 'wx227c5bbf660e1cc8' : 'wx227c5bbf660e1cc8';

export default {
  description: '项目配置文件',
  packOptions: {
    ignore: [],
  },
  setting: {
    urlCheck: true,
    es6: false,
    enhance: false,
    postcss: true,
    preloadBackgroundData: false,
    minified: true,
    newFeature: false,
    coverView: true,
    nodeModules: false,
    autoAudits: false,
    showShadowRootInWxmlPanel: true,
    scopeDataCheck: false,
    uglifyFileName: false,
    checkInvalidKey: true,
    checkSiteMap: true,
    uploadWithSourceMap: true,
    compileHotReLoad: false,
    babelSetting: {
      ignore: [],
      disablePlugins: [],
      outputPath: '',
    },
    useIsolateContext: true,
    useCompilerModule: true,
    userConfirmedUseCompilerModuleSswitch: false,
  },
  compileType: 'miniprogram',
  libVersion: '2.13.1',
  appid,
  projectname: 'miniprogram-webpack-plugin',
  cloudfunctionTemplateRoot: '',
  watchOptions: {
    ignore: [],
  },
  debugOptions: {
    hidedInDevtools: [],
  },
  scripts: {},
  condition: {
    search: {
      current: -1,
      list: [],
    },
    conversation: {
      current: -1,
      list: [],
    },
    plugin: {
      current: -1,
      list: [],
    },
    game: {
      current: -1,
      list: [],
    },
    gamePlugin: {
      current: -1,
      list: [],
    },
    miniprogram: {
      current: -1,
      list: [],
    },
  },
};
