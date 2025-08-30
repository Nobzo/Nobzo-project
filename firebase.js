const admin = require("firebase-admin");

const serviceAccount = require("./nobzo-ad542-firebase-adminsdk-fbsvc-c72dc97211.json"); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
