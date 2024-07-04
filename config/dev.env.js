"use strict";
const merge = require("webpack-merge");
const prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  web: '"https://dev-mobilserv.mobil.com.cn/api"',
  api: '"/api"'
});
