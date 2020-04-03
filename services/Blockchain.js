class Blockchain {
    constructor(api_key) {
        const XooaClient = require("xooa-sdk");
        this.blockchain = new XooaClient();
        this.blockchain.setApiToken(api_key);
    }

    async add_new_identity_to_blockchain(identity_name, name, value) { 
        let newIdentity = {
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

        let [error, pendingResponse, data] = await this.blockchain.enrollIdentity({}, newIdentity);
        console.log(error, pendingResponse, data);

        if (error == null && typeof pendingResponse == 'undefined') {
            return { error: false, response: data };
        } else {
            return { error: true, response: error };
        }
    }

    //Set a value in blockchain
    async add_transaction_to_blockchain(key, data) {
        var [error, pendingResponse, data] = await this.blockchain.invoke("add_transaction", {}, { args: [key, data] })
        console.log(error, pendingResponse, data);
    }

    async get_transactions_by_key(key) { 
        let [error, pendingResponse, data] = await this.blockchain.invoke("get_by_key", {}, { args: [key] });
        console.log(error, pendingResponse, data);

        if (error == null && typeof pendingResponse == 'undefined') {
            return { error: false, response: data };
        } else {
            return { error: true, response: error };
        }
    } 
}

module.exports = Blockchain;