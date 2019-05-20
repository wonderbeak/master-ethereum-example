var Migrations = artifacts.require("Migrations");

module.exports = function(worker) {
  worker.deploy(Migrations);
};
