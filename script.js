/* global $ */

// $(document).ready(function () {

var searchUrl = '';

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
          response(data[1]);

        }
      });
    },
    minLength: 3,
    select: function (event, ui) {

      getArticleList(ui);

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
  function getArticleList(autoSelect) {
    console.log(autoSelect.item.label);

    if (autoSelect.item.label === '') {

      searchUrl = 'http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&formatversion=2&callback=?&page=' + this.value;

      console.log('random:' + autoSelect.item.label);

    } else {

      //var searchUrl = 'http://en.wikipedia.org/w/api.php?action=parse&format=json&formatversion=2&prop=text&section=0&section=0&callback=?&page=' + autoSelect.item.label;

      searchUrl = 'http://en.wikipedia.org/w/api.php?action=parse&format=json&formatversion=2&prop=text&callback=?&page=' + autoSelect.item.label;

      console.log('opensearch: ' + autoSelect.item.label);
    }

    $.ajax({

      type: 'GET',
      url: searchUrl,
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

            console.log(this.href);
            console.log(location.href);

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
