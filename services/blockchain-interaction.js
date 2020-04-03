console.log('Example app started!')
var XooaClient = require("xooa-sdk");
var xooaClient = new XooaClient();
xooaClient.setApiToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBcGlLZXkiOiJBMjBNM1haLTRDSzRNTjUtSkNRMDJNQi00WkFFSFAzIiwiQXBpU2VjcmV0IjoianUyUjRTbHNpMzVPakdjIiwiUGFzc3BocmFzZSI6IjIyNDBjNmEzMjJjMjRlNzgyMmM1YmM3ZTM1Y2RkNWI0IiwiaWF0IjoxNTgyNjM1Mjc2fQ.Hi92qvQhQW4R2Sh2OuUMTNyx4dY69wnyJq6Z49maOsE");

 async function add_new_identity_to_blockchain(identity_name, name, value) {
 	var newIdentity = {
     "IdentityName": identity_name,
     "Access": "r",
     "Attrs": [
         {
             "name": name,
             "ecert": true,
             "value": value
         }
     ],
     "canManageIdentities": false
 }

 var [error, pendingResponse, data] = await xooaClient.enrollIdentity({}, newIdentity)
 console.log(error, pendingResponse, data);
 }


//Set a value in blockchain
async function add_transaction_to_blockchain(key, data) {
  var [error, pendingResponse, data] = await xooaClient.invoke("add_transaction", {}, { args: [key, data]})
  console.log(error, pendingResponse, data);
}

//Get a value FROM blockchain
async function get_from_blockchain_by_tx_id(tx_id) {
  var [error, pendingResponse, data] = await xooaClient.getTransactionByTransactionId(tx_id, {});
  console.log(data);
}

async function get_from_blockchain_by_block_number(block_number) {
  var [error, pendingResponse, data] = await xooaClient.getBlockByNumber(block_number, {});
  console.log(error, pendingResponse, data);
}

async function get_by_key(key) {
  var [error, pendingResponse, data] = await xooaClient.invoke("get_by_key", {}, { args: [key] });
  console.log(error, pendingResponse, data);
  console.log(data.payload[0].Timestamp)
  let date_created = new Date(data.payload[0].Timestamp.seconds.low * 1000);
  console.log(date_created)
}

//add_new_identity_to_blockchain("Frank Keenan User", "Frank Keenan", "");
//get_from_blockchain_by_block_number("66");
//get_from_blockchain_by_tx_id('562a08e7c3c50a92ad2794ef4cd48300aec534a46a54a2ff10dc2f021e30871f');
add_transaction_to_blockchain("5e53c193c2bff749d0cca111", {title: "Agreement generated", content: "ANOTHER ONEEEEEEEEEEEEEEEEEEEEEEEEEEEEE!!!"});
//get_by_key("5e53c193c2bff749d0cca109");