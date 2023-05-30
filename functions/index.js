/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https") // in the video he did not destructure to create the onRequest variable and instead called the variable 'functions' then accessed onRequest() from it like so: functions.onRequest()
const logger = require("firebase-functions/logger")
const express = require('express')
const app = express()
const fetch = require('node-fetch')
//const { functions } = require("firebase-functions/lib/common/options") //cant remember what this was originally

const baseUrl = 'https://api.webflow.com'
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    authorization: 'Bearer 31aae81a425cb8490ce3d43412a1878a09906201a098749eccbf967601c373a6' //in the video this was stored in the env file and was taken from site settings under "integrations", howver that failed, and the final token that worked was taken from the sidebar on the https://developers.webflow.com/reference/list-sites page after authenticating to populate the 'bearer' field.
  }
}

//get all sites (should only access one because the access token is specific to one site in this example)
// !!! ALWAYS INCLUDE THE PRECEDING FORWARD SLASH ON THE ROUTE PATH, OTHERWISE THE ROUTE WILL NOT WORK. DO NOT INCLUDE A TRAILING FORWARD SLASH EITHER. THIS WILL ALSO CAUSE EXPRESS TO FAIL TO RECOGNIZE THE ROUTE.
app.get('/sites', async (req, res) => {
    try {
        const sites = await fetch(baseUrl + '/sites', options)
        const siteData = await sites.json()
        res.send(siteData)
        res.end(); // end the response

    } catch (err){
        res.send(err)
        res.end(); // end the response

    }
})

//Get all collections for a  site. POSTMAN URL: sites/639b25b7b391f464a0f95b64/collections/6474c0ed3c2fe1ae9a242f69
app.get('/sites/:siteId/collections/:collectionId', async (req, res) => {

    console.log('ROUTE IS ACTIVE');

    const {siteId, collectionId} = req.params;
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: 'Bearer 31aae81a425cb8490ce3d43412a1878a09906201a098749eccbf967601c373a6'
        }
    };

    try {

        //contact the webflow API URL for all collections belonging to a site
        const collections = await fetch(baseUrl + `/sites/${siteId}/collections`, options)

        //When the collections constant is finally populated, run the json method on it
        const data = await collections.json()

        //Return the data to the origin of the request for display
        res.send(data)

        // end the response
        res.end(); 

    } catch (err) {

        res.send(err)

        res.end(); // end the response

    }
})

//Get all items in a collection. POSTMAN URL: sites/639b25b7b391f464a0f95b64/collections/6474c0ed3c2fe1ae9a242f69/items
app.get('/sites/:siteId/collections/:collectionId/items', async (req, res) => { // ALWAYS PLACE REQ AS THE FIRST PARAMENTER AND RES AS THE SECOND PARAMETER
    
    const {siteId, collectionId, itemId} = req.params;
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: 'Bearer 31aae81a425cb8490ce3d43412a1878a09906201a098749eccbf967601c373a6'
        }
      };

    try {
        const collections = await fetch(baseUrl + `/collections/${collectionId}/items`, options)
        const collectionData = await collections.json()
        res.send(collectionData)
        res.end(); // end the response

    } catch (err){
        res.send(err)
        res.end(); // end the response

    }
})

//Add an item to the collection. POSTMAN URL: sites/639b25b7b391f464a0f95b64/collections/6474c0ed3c2fe1ae9a242f69/items/add
app.post('/sites/:siteId/collections/:collectionId/items/add', async (req, res) => {

    const collectionId = '6474c0ed3c2fe1ae9a242f69'
    const {name} = req.body

    const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: 'Bearer 31aae81a425cb8490ce3d43412a1878a09906201a098749eccbf967601c373a6'
        },
        body: JSON.stringify({
          fields: {slug: name.toLowerCase().split(' ').join('-'), name, _archived: false, _draft: false}
        })
    };

    //contact the webflow api and feed it the options we've provided for the new collection item in the specific collection
    try {

        const collections = await fetch(`https://api.webflow.com/collections/${collectionId}/items`, options)

        const collectionData = await collections.json()

        //Returns the response to the requesting origin(in the case of testing, returns it for viewing in postman) https://www.geeksforgeeks.org/express-js-res-send-function/ ALSO SEE https://www.digitalocean.com/community/tutorials/nodejs-res-object-in-expressjs
        //the send method belong to the res object, which is provided by express
        res.send(collectionData)
        res.end(); // end the response

    }
    catch (err) {

        res.send(err)
        res.end(); // end the response

    }

})

//Delete an item from the collection POSTMAN URL: sites/639b25b7b391f464a0f95b64/collections/6474c0ed3c2fe1ae9a242f69/items/647531f2d0a4ed417cc7c2cb/delete 
app.delete('/sites/:siteId/collections/:collectionId/items/:itemId/delete', async (req, res) => {

    const {siteId, collectionId, itemId} = req.params;

    const options = {
        method: 'DELETE',
        headers: {
          accept: 'application/json',
          authorization: 'Bearer 31aae81a425cb8490ce3d43412a1878a09906201a098749eccbf967601c373a6'
        }
      };

    //contact the webflow api and feed it the options we've provided for the new collection item in the specific collection
    try {

        const collections = await fetch(`https://api.webflow.com/collections/${collectionId}/items/${itemId}`, options)

        const collectionData = await collections.json()

        //Returns the response to the requesting origin(in the case of testing, returns it for viewing in postman) https://www.geeksforgeeks.org/express-js-res-send-function/ ALSO SEE https://www.digitalocean.com/community/tutorials/nodejs-res-object-in-expressjs
        //the send method belong to the res object, which is provided by express
        res.send(collectionData)
        res.end(); // end the response

    }
    catch (err) {

        res.send(err)
        res.end(); // end the response

    }

})


exports.v1 = onRequest(app);
