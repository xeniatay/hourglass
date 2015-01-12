$(document).ready(function() {
  setTimeIsNow();
  getStoresOpen(getRequestedTime());

  $('.current-day').on('change', function() {
    getStoresOpen(getRequestedTime());
  });


  $('#datetimepicker').datetimepicker({
    pickDate: false,
    useCurrent: true
  });

  $('.timepicker').on('click', function(e) {
    console.log('wassup');
    getStoresOpen(getRequestedTime());
  });
});

var setTimeIsNow = function() {
  var day = $('.current-day'),
      time = $('.current-time'),
      now = moment();

  time.find('input').val(moment().format('h:mm A'));
  day.find('.' + moment().isoWeekday()).prop('selected', 'selected');
}

var getRequestedTime = function() {
  var day = $('.current-day').val(),
      time = $('.current-time input').val();

  var req = moment(time + day, 'h:mm AE');
  return req;
}

var getStoresOpen = function(time) {
  console.log(time);
  var records = JSON.parse($('#data').html()),
      openAt = time || moment(),
      storesElem = $('.stores-open');

  storesElem.empty();

  for (var i = 0; i < records.length; i++) {
    if ( isOpen(openAt, records[i]) ) {
      var hoursToday = getHoursToday(records[i]),
          skel;

      skel = "<div class='store-info clearfix'><div class='store-name'><li class='stores'>"
        + records[i].name
        + "</li></div><div class='business-hours'>Hours today: <span class='time time-open'>"
        + hoursToday[0].open
        + "</span> - <span class='time time-close'>"
        + hoursToday[0].close
        + "</span></div></div>";


        storesElem.append(skel);
    }
  }
}

var getHoursToday = function(records) {
  var now = moment(),
      curDay = now.isoWeekday(),
      hoursToday = records['hours'][now.isoWeekday()];

  return hoursToday;
}

var displayHours = function(hours) {
  var html = '';

  for (var j = 0; j < hours.length; j++) {
    html += '<li>' + hours[j]['open'] + ' - ' + hours[j]['close'] + '</li>';
  }

  return html;
}

var displayDays = function(storeRecords) {
  var hours = storeRecords['hours'],
      html = '<h2>' + storeRecords['name'] + '</h2>';

  // for (var i = 1; i < 8; i++) {
  //   var day = moment().isoWeekday(i).format('dddd');
  //   html += '<h3>' + day + '</h3>'
  //     + '<ul>'
  //     + displayHours(hours[i])
  //     + '</ul>';
  // }

  return html;
}

var isOpen = function(openAt, storeRecords) {
  var curDay = openAt.isoWeekday(),
      hoursToday = storeRecords['hours'][openAt.isoWeekday()];

    for (var i = 0; i < hoursToday.length; i++) {

      // TODO: this is fucking nasty
      var open = moment({
          'hours': hoursToday[i]['open'].substr(0, 2),
          'minutes': hoursToday[i]['open'].substr(2, 2)
        }),
        closed = moment({
          'hours': hoursToday[i]['close'].substr(0, 2),
          'minutes': hoursToday[i]['close'].substr(2, 2)
        });

      if ( ( openAt.diff(open, 'minutes') > 0 )
        && ( openAt.diff(closed, 'minutes') < 0 ) ) {
        // store is open!
        return true;
      }
    }

  return false;
}