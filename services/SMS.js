class SMS {
    constructor(sms_app_key, sms_api_key, sms_secret_key) {
        this.sms = require('ringcaptcha-nodejs');

        this.sms.app_key = sms_app_key;//Add Your App Key
        this.sms.api_key = sms_api_key; //Add Your API Key
        this.sms.secret_key = sms_secret_key; //Add Your Secret Key  
    }

    async send_sms(data) {
        return new Promise((resolve, reject) => {
            this.sms.sendingPINCode(data, function (response) { 
                resolve(response);
                return;
            });
        }); 
    }

    async resend_sms(data) {
        return new Promise((resolve, reject) => {
            this.sms.reSendPINCode(data, function (response) { 
                resolve(response);
                return;
            });
        }); 
    }

    async verify_pin(data) {
        return new Promise((resolve, reject) => {
            this.sms.verifyingPin(data, function (response) {
                resolve(response);
                return;
            });
        });
    }


}

module.exports = SMS;