'use strict'

var FtpDeploy = require("ftp-deploy")
var ftpDeploy = new FtpDeploy()

var config = {
  user: "pool",
  password: "",
  host: "pool.fritz.box",
  port: 21,
  localRoot: __dirname + "/build",
  remoteRoot: "/react/",
  include: ["*", "**/*", ".*"],
  exclude: ["dist/**/*.map", "node_modules/**", "node_modules/**/.*", ".git/**"],
  deleteRemote: false,
  forcePasv: true,
  sftp: false
}

ftpDeploy
  .deploy(config)
  .then(res => console.log("finished:", res))
  .catch(err => console.log(err))