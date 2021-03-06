const fs = require('fs-extra');
const { ConcatSource } = require('webpack').sources;
const { transformFileSync } = require('@babel/core');

exports.NODE_MODULES_REG = /(.*)node_modules/;

function fsExists(filepath) {
  return new Promise((resolve, reject) => {
    fs.access(filepath, fs.constants.F_OK, async err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

exports.fsExists = fsExists;

function fsExistsSync(filepath) {
  try {
    fs.accessSync(filepath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

exports.fsExistsSync = fsExistsSync;

function readConfig(configPath) {
  return new Promise((resolve, reject) => {
    fs.access(configPath, fs.constants.F_OK, async err => {
      if (err) {
        reject(err);
      }
      resolve(fs.readJson(configPath));
    });
  });
}

exports.readConfig = readConfig;

function readConfigSync(configPath) {
  let result = {};
  if (fs.existsSync(configPath)) {
    if (/\.(j|t)s$/.test(configPath)) {
      const { code } = transformFileSync(configPath, {
        presets: ['@babel/preset-env', '@babel/preset-typescript'],
      });
      const config = new module.constructor();
      config._compile(code, 'ahaha');
      result = config.exports.default ? config.exports.default : config.exports;
    } else {
      result = fs.readJsonSync(configPath);
    }
  }
  return result;
}

exports.readConfigSync = readConfigSync;

function isEmptyObject(obj) {
  if (obj == null) {
    return true;
  }
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

exports.isEmptyObject = isEmptyObject;

function stripExt(path) {
  const { dir, name } = path.parse(path);
  return path.join(dir, name);
}

exports.stripExt = stripExt;

function addChunksToAsset(asset, chunks) {
  if (!chunks.length) {
    return asset;
  }

  const source = new ConcatSource();
  chunks.forEach(chunk => {
    source.add(`require('./${chunk}');\n`);
  });
  source.add('\n');
  source.add(asset);
  source.add(';');
  return source;
}

exports.addChunksToAsset = addChunksToAsset;
