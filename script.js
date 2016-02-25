/* global $ */

// $(document).ready(function () {

var selectedUrl = '';
var randomUrl = '';

$(function () {

  function log(message) {
    $('<div>').text(message).prependTo('#log');
    $('#log').scrollTop(0);
  }

  //*** Populate input with autocomplete search of articles
  $('#query').autocomplete({
    source: function (request, response) {
      $.ajax({
        url: 'http://en.wikipedia.org/w/api.php',
        dataType: 'jsonp',
        data: {
          'action': 'opensearch',
          'format': 'json',
          'search': request.term
        },
        success: function (data) {

          console.log(data);
          data[1].unshift('***Random Search***');
          response(data[1]);

        },

      });
    },
    minLength: 3,
    select: function (event, ui) {

      getSelected(ui);

      log(ui.item ?
        'Selected: ' + ui.item.label :
        'Nothing selected, input was ' + this.value);
    },
    open: function () {
      // $(this).removeClass('ui-corner-all').addClass('ui-corner-top');
    },
    close: function () {
      // $(this).removeClass('ui-corner-top').addClass('ui-corner-all');
    }
  });

  //*** Retrieve article list from Wikipedia
  function getSelected(autoSelect) {
    console.log(autoSelect.item.label);

    if (autoSelect.item.label === '***Random Search***') {

      randomUrl = 'http://en.wikipedia.org/w/api.php?action=query&formatversion=2&list=random&format=json&rnnamespace=0&rnlimit=1&callback=?';

      console.log('random:' + autoSelect.item.label);
      getRequestRandom(randomUrl);

    } else {

      selectedUrl = 'http://en.wikipedia.org/w/api.php?action=parse&format=json&formatversion=2&prop=text&callback=?&page=' + autoSelect.item.label;
      getRequest(selectedUrl);
    }

  }

  function getRequestRandom(randomUrl) {

    $.ajax({

      type: 'GET',
      url: randomUrl,
      contentType: 'application/json; charset=utf-8',
      async: false,
      dataType: 'json',
      success: function (data) {

        console.log(data);
        console.log(data.query.random[0].title);

        selectedUrl = 'http://en.wikipedia.org/w/api.php?action=parse&format=json&formatversion=2&prop=text&callback=?&page=' + data.query.random[0].title;

        getRequest(selectedUrl);

      },
      error: function (errorMessage) {
      }

    });

  }

  function getRequest(selectedUrl) {

    $.ajax({

      type: 'GET',
      url: selectedUrl,
      contentType: 'application/json; charset=utf-8',
      async: false,
      dataType: 'json',
      success: function (data, textStatus, jqXHR) {

        $('#result').empty();
        $(data.parse.text).appendTo('#result');

        $('#result a').attr('href', function () {

          if (
            this.href.search('/wiki/') > -1 ||
            this.href.search('/w/') > -1
            ) {

            $(this).attr('target', '_newtab'); // opens a new tab on click

            if (this.href.search('codepen') > -1) {

              return this.href.replace('http://s.codepen.io/', 'http://en.wikipedia.org/');

            } else {

              return this.href.replace(location,
                'http://en.wikipedia.org/');
              // replaces the domain name with wikipedia in your link
            }
          }

        });

      },
      error: function (errorMessage) {
      }

    });

  }

});

// });
