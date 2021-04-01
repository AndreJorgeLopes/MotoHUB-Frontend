const postsBackupJob = require('../src/jobs/postsBackup');
const couponsBackupJob = require('../src/jobs/couponsBackup');
const Sequelize = require('sequelize');
let dbConfig = require('../config/database');

var models = [];
const normalizedPath = require('path').join(__dirname, '/../src/models');

require('fs').readdirSync(normalizedPath).forEach(file => {
    const tempVariable = require(normalizedPath + '/' + file);
    models.push(tempVariable);
});

if (process.env.DATABASE_URL) {
    dbConfig = process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        logging: false,
        define: {
            underscored: true
        },
        dialectOptions: {
            ssl: true
        }
    }
}

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