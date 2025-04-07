const firebase = require("firebase-admin");
const config = require("../config");

// process.env.GOGGLE_APPLICAITON_CREDENTIALS;

firebase.initializeApp({
    credential: firebase.credential.cert(config.firebaseServiceACKey)

})

module.exports = {
    firebase
}