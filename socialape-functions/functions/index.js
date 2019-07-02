const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// after npm i --save express
const express = require('express');
const app = express();



// Get screams
app.get("/screams", (req, res) => {
  admin
    .firestore()
    .collection("screams")
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(screams);
    })
    .catch(err => console.error(err));
})







// Create Scream
app.post('/scream', (req, res) => {
  
  // create new scream
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };

  admin
    .firestore()
    .collection("screams")
    .add(newScream)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created successfuly` });
    })
    .catch((err) => {
      res.status(500).json({ error: "something went teribly wrong" });
      console.error(err);
    });
});


// https://baseurl/api/screams is the get route now 
// https://baseurl/api/scream is the post route now 

exports.api = functions.region('europe-west1').https.onRequest(app)