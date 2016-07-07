$(function () {
  //We'll use message to tell the user what's happening
  var $message = $('#message');


  // Get handle to the object creation buttons
  var $syncField = $('#syncField');

  // Manages the state of our access token we got from the server
  var accessManager;

  // Our interface to the Sync service
  var syncClient;

  //We're going to use a single Sync document, our simplest synchronisation primitive, for this demo
  var syncDoc;

  // The server will assign the client a random username - store that value
  // here
  var username;

  // Alert the user they have been assigned a random username

  // Get an access token for the current user, passing a username (identity)
  // and a device ID - for browser-based apps, we'll always just use the
  // value "browser"
  $.getJSON('/token', {
    device: 'browser'
  }, function (data) {
    // Alert the user they have been assigned a random username
    // username = data.identity;


    // Initialize the IP messaging client
    accessManager = new Twilio.AccessManager(data.token);
    syncClient = new Twilio.Sync.Client(accessManager);

    console.log(syncClient);

    //Let's pop a message on the screen to show that Sync is ready
    $message.html("Sync initialized!");

    //Now that Sync is active, lets enable our text field
    $syncField.attr("disabled", false);

    //This code will create and/or open a Sync document
    //Note the use of promises
    syncClient.document("sync.field").then(doc => {
      //Lets store it in our global variable
      syncDoc = doc;

      console.log("SYNCDOC", syncDoc);

      //Let's subscribe to changes on this document, so when something
      //changes on this document, we can trigger our UI to update
      syncDoc.on("updated", function (data) {

        console.log(data);
        $syncField.val(data.fieldValue);

      });

    });


  });

  //Whenever the input field changes, we want send the value to Sync
  $syncField.on("keyup", function (e) {

    //Lets grab the actual form field value
    var inputValue = $(this).val();

    //and do some super simple validation
    if ((inputValue === 0) && (inputValue > 500)) {
      return false;
    }

    //Lets send the field value to Sync!
    syncDoc.set({ fieldValue: inputValue });

    //Bonus: Since keyup is so quick to generate traffic,
    //introducing a slight delay can make it appear less 'jumpy'
    // delay(function(){
    //     syncDoc.set({fieldValue:inputValue})
    //   }, 100 );

    // syncDoc.set({fieldValue:inputValue});

    // syncDoc.set({fieldValue:inputValue}).then(val => {
    //   //$message.html("Synced!").fadeIn(50);
    // });

  });

});

var delay = (function () {
  var timer = 0;
  return function (callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();