$(function () {
  //We'll use message to tell the user what's happening
  var $message = $('#message');

  //Get handle to the game board buttons
  var $buttons = $('#board .board-row button');

  //Manages the state of our access token we got from the server
  var accessManager;

  //Our interface to the Sync service
  var syncClient;

  //We're going to use a single Sync document, our simplest
  //synchronisation primitive, for this demo
  var syncDoc;

  //Get an access token for the current user, passing a device ID
  //For browser-based apps, we'll always just use the
  //value "browser"
  $.getJSON('/token', {
    device: 'browser'
  }, function (tokenResponse) {
    //Initialize the Sync client
    accessManager = new Twilio.AccessManager(tokenResponse.token);
    syncClient = new Twilio.Sync.Client(accessManager);

    //Let's pop a message on the screen to show that Sync is ready
    $message.html("Sync initialized!");

    //Now that Sync is active, lets enable our game board
    $buttons.attr("disabled", false);

    //This code will create and/or open a Sync document
    //Note the use of promises
    syncClient.document("sync.game").then(function(doc) {
      //Lets store it in our global variable
      syncDoc = doc;

      //Initialize game board UI to current state
      writeGameBoard(syncDoc.get());

      //Let's subscribe to changes on this document, so when something
      //changes on this document, we can trigger our UI to update
      syncDoc.on("updated", writeGameBoard);

    });

  });

  //Update the buttons on the board to match our document
  function writeGameBoard(data) {
    for (var row = 0; row < 3; row++) {
      for (var col = 0; col < 3; col++) {
        var selector = '[data-row="' + row + '"]' +
          '[data-col="' + col + '"]';
        var cellValue = data.board[row][col];
        $(selector).html(cellValue === '' ? '&nbsp;' : cellValue);
      }
    }
  }

  //Whenever a board button is clicked:
  $buttons.on("click", function (e) {
    //Toggle the value: X, O, or empty
    toggleCellValue($(e.target));

    //Update the document and send to Sync
    var data = readGameBoard();
    syncDoc.set(data);

  });

  //Toggle the value: X, O, or empty (&nbsp; for UI)
  function toggleCellValue($cell) {
    var cellValue = $cell.html();

    if (cellValue === 'X') {
      $cell.html('O');
    } else if (cellValue === 'O') {
      $cell.html('&nbsp;');
    } else {
      $cell.html('X');
    }
  }

  //Read the state of the UI and create a new document
  function readGameBoard() {
    var board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];

    for (var row = 0; row < 3; row++) {
      for (var col = 0; col < 3; col++) {
        var selector = '[data-row="' + row + '"]' +
          '[data-col="' + col + '"]';
        board[row][col] = $(selector).html().replace('&nbsp;', '');
      }
    }

    return {board: board};
  }

});
