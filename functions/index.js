const functions = require('firebase-functions');


// internal app deps
const config = require('./SmartHome/config-provider');
const smartHomeApp = require('./SmartHome/smart-home-provider')

// Check that the API key was changed from the default
if (config.smartHomeProviderApiKey === '<API_KEY>') {
  console.warn('You need to set the API key in config-provider.\n' +
    'Visit the Google Cloud Console to generate a key for your project.\n' +
    'https://console.cloud.google.com\n' +
    'Exiting...');
  process.exit();
}


// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

functions.firestore.document('deviceState').onWrite((change,context) =>{
    /* Call SmartHome */
    console.log("deviceState changed:",change,context)
    smartHomeApp.ReportState();
})




exports.helloWorld = helloWorld
exports.SmartHome = functions.https.onRequest(smartHomeApp.ActionsOnGoogle)