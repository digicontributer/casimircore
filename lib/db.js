'use strict'

var fs = require('fs')
var _ = require('lodash')
var sequelize;

function load_models (model_path) {
  fs.readdirSync(model_path).forEach(function (file) {
    if (file.split('.')[1] === 'js') {
      require(model_path + file)
    }
  })
  console.log('Done loading db schemas: ')
}

module.exports = {
  init: function (settings, sequelizeInstance, cb) {
    var username = settings.user
    var password = settings.pass
    var host = settings.host
    var port = settings.port
    var database = settings.name
    var uri = settings.uri
    var options = settings.options
    sequelize = sequelizeInstance || require('sequelize')

    if (!uri && (!database || !host || !port)) {
      if (cb) return cb('Can\'t connect to Database')
      throw new Error('Can\'t connect to Database')
    }

    var sequelizeDB = new Sequelize(database, username, password, {
      host: host,
      dialect: 'postgres',
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      operatorsAliases: false
    });


    settings.dir && load_models(settings.dir)
    console.log('Connecting to Database...')
    sequelize.sync(function(err, done) {
      if(err) cb(err);
      return cb(null);
    })
  },

  get_model: function (name) {
    var to_lower_case_name = name.toLowerCase()
    //return mongoose.models[name] || mongoose.models[to_lower_case_name]
  }
}
