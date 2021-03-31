const postsBackupJob = require('../src/jobs/postsBackup');
const couponsBackupJob = require('../src/jobs/couponsBackup');
const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

var models = [];
const normalizedPath = require('path').join(__dirname, '/../src/models');

require('fs').readdirSync(normalizedPath).forEach(file => {
    const tempVariable = require(normalizedPath + '/' + file);
    models.push(tempVariable);
});

const connection = new Sequelize(dbConfig);

models.forEach(model => {
    model.init(connection);
});

models.forEach(model => {
    model.associate(connection.models);
});

postsBackupJob().then(async () => {
    await couponsBackupJob();

});

module.exports = connection;