/*
 * /lib/controller.js
 */
var view = require('./view'),
    mongojs = require('mongojs'),
    uri = 'mongodb://hourglass:admin@ds031691.mongolab.com:31691/hourglass',
    db = mongojs.connect(uri, ['hours']),
    _ = require('underscore'),
    moment = require('moment');

var controller = function() {};

controller.prototype = {

  view : function(user, callback) {
    var callback = (typeof callback === 'function') ? callback : function() {};

    var data = {
     'user' : user ? user : 'nobody'
    };

    view.renderView('view', data, function(data) {
      callback(data);
    });
  },
  home : function(arg, callback) {
    var callback = (typeof callback === 'function') ? callback : function() {},
        collection = db.hours,
        data = {},
        storesOpen = [],
        curRecord = {};

    data.currentDay = moment().format('dddd');
    data.currentTime = moment().format('h:mm A');

    collection.find({}, {}, function(err, records) {
      // for (var i = 0; i < records.length; i++) {
      //   if ( openNow(records[i]) ) {
      //     curRecord = {};
      //     curRecord.hours = getHoursToday(records[i]);
      //     curRecord.name = records[i].name;

      //     storesOpen.push(curRecord);
      //   }
      // }

      // data.storesOpen = storesOpen;
      data = JSON.stringify(records);
      console.log('data', data);
      view.renderView('home', data, function(data) {
        callback(data);
      });

    });

  }
};

module.exports = new controller();

