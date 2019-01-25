"use strict";

const log = require("libnpm/log");
const childProcess = require("@lerna/child-process");
const pMapSeries = require("p-map-series");

module.exports = gitPush;

function gitPush(remote, branch, tags = [], opts) {
  log.silly("gitPush", remote, branch);

  return childProcess.exec("git", ["push", "--no-verify", remote, branch], opts).then(() =>
    pMapSeries(tags, tag => {
      log.silly("gitPushTagSeriesTag", remote, tag);
      return childProcess.exec("git", ["push", remote, tag], opts);
    })
  );
}
