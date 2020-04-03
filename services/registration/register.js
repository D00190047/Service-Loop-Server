"use strict";

/**
 * This is the function that will be called to create a new user and generate a Digital Certificates
 * for the user. It takes 5 parameters and creates a user first with basic information such as the users
 * full name, email and phone number and only after we create the Digital Certificate and a hashed password
 * do we update the user.
 * 
 * @param {String} users_full_name - This is the users full name e.g. "John Wick"
 * @param {String} users_password - This is the users password e.g. "12345aA@"
 * @param {String} users_password_confirm - This is the users password confirmation, it must match to the users_password e.g. "12345aA@"
 * @param {String} users_email - This is the users email address, it must be a valid email format e.g. "JohnWick@gmail.com"
 * @param {String} users_phone_number - This is the phone number of the user, it must be a valid Irish phone number e.g. "08436752562"
 * 
 * @returns {Promise} This Promise will contain an object that contains 2 keys: error and response, the "error" key will be a boolean 
 * that specifies wether the registration was successful or not and the "response" key will be a String that contains the response from the function
 */
let create_new_user = async function create_new_user(users_full_name, users_password, users_password_confirm, users_email, users_phone_number, database_connection) {
    /**
     * This is the function that will hash the users plaintext password
     *  
     * @param {String} users_password - This is the users password e.g. "12345aA@" 
     * 
     * @returns {Promise} This Promise will contain an object that contains 2 keys: error and response, the "error" key will be a boolean 
     * that specifies wether the registration was successful or not and the "response" key will be a String that contains the hashed password from the function
     */
    const users_password_hash = (users_password) => {
        return new Promise((resolve, reject) => {
            // resolve({ error: false, response: "12345", type: "password_hash" });
            // return;
            const bcrypt = require('bcrypt');
            const saltRounds = 10;

            bcrypt.hash(users_password, saltRounds, function (err, hash) {
                // Store hash in your password DB.
                console.log("gg")
                resolve({ error: false, response: hash, type: "password_hash" });
            });
        });
    }

    /**
     * This is the function that will insert the user into the MongoDB database, we call this function to create the initial user after wich we update it with the
     * Digital Certificate path, password and hashed user password
     *  
     * @param {Database} database_connection - This is the database class that we will use to register the user as it contains all the database related functions
     * @param {String} users_full_name - This is the users full name e.g. "John Wick"
     * @param {String} users_email - This is the email of the user e.g. "JohnWick@gmail.com" 
     * @param {String} users_phone_number - This is the users phone number e.g. "0363792371" 
     * 
     * @returns {Promise} This Promise will contain an object that contains 2 keys: error and response, the "error" key will be a boolean 
     * that specifies wether the registration was successful or not and the "response" key will be a String that contains the response from the function
     */
    const insert_user_into_db = (database_connection, users_full_name, users_email, users_phone_number) => {
        return new Promise(async (resolve, reject) => {
            //resolve({ error: false, response: "New user registered successfully." });
            //return;
            let response = await database_connection.register_new_user(users_full_name, users_email, users_phone_number);

            if (response.error) {
                console.log(err);
                resolve({ error: true, response: err });
            } else {
                console.log("Success")
                resolve({ error: false, response: "New user registered successfully." });
            }
        });
    }

    /**
     * This is the function that will create the users Digital Certificate
     *  
     * @param {Database} database_connection - This is the database class that we will use to register the user as it contains all the database related functions
     * @param {String} users_full_name - This is the users full name e.g. "John Wick"
     * @param {String} users_email - This is the email of the user e.g. "JohnWick@gmail.com"  
     * 
     * @returns {Promise} This Promise will contain an object that contains 2 keys: error and response, the "error" key will be a boolean 
     * that specifies wether the registration was successful or not and the "response" key will be a String that contains the response from the function
     */
    const p12_certificate_response = (database_connection, users_full_name, users_email) => {
        return new Promise(async (resolve, reject) => {
            const create_p12_certificate = require('./create_p12_certificate');
            const generator = require('generate-password');

            //Generate a random password for the users Digital Certificate
            let users_certificate_password = generator.generate({
                length: 10,
                numbers: true
            });

            try {
                //Find the user that we need to update
                let find_user_id_results = await database_connection.find_id_by_email(users_email);

                //If an error happens when we try to get the user from the database, we close the connection and return an error
                if (find_user_id_results.error) {
                    resolve({ error: true, response: find_user_id_results.response });
                } else {
                    //If the function could not find a user, we again, disconnect and return an error
                    if (find_user_id_results.response === "No user found!") {
                        resolve({ error: true, response: find_user_id_results.response });
                    } else {
                        //We get the users ID from the returned User
                        let user_id = find_user_id_results.response._id;
                        //Consider looking into wtf is a serial number
                        //We then create a digital certificate using the user id as the identifier, the randomly generate password as the cert password
                        let response = await create_p12_certificate.create_user_certificate(user_id, users_certificate_password, users_email, users_full_name);

                        //let response = "IDK";
                        if (response !== "Digital Certificate creation failed.") {
                            resolve({ error: false, certificate_location: response, certificate_password: users_certificate_password, type: "digital_certificate" });
                        } else {
                            resolve({ error: true, response: response });
                        }
                    }
                }
            } catch (err) {
                console.log(err)
                resolve({ error: true, response: err });
            }
        });
    }


    //Setup the user data validation
                                                                                                                                                                                                                                                                                                                                                                                                                   
    const validator = require('validator');
    const filter_registration_input = require('./filter_registration_input');

    const fs = require('fs');
    fs.copyFile('/home/d00192082/ServiceLoopServer/resources/images/base_user.jpg', '/home/d00192082/ServiceLoopServer/resources/images/' + users_email + '.jpg', (err) => {
        if (err) throw err;
    });

    //Valiate user data
    let filtering_response = await filter_registration_input.validate_registration_input(users_full_name, users_password, users_password_confirm, users_email, users_phone_number, database_connection);

    //If there is an error in validating the users data, we exit.
    if (filtering_response.error) {
        console.log("Exit")
        console.log(filtering_response)
        database_connection.disconnect();
        return filtering_response;
    }

    try {

        //Insert the user into the database
        let user_insert_response = await insert_user_into_db(database_connection, users_full_name, users_email, users_phone_number);

        //If insertion is successfull, we proceed to finalize the registration by creating a Digital Certificate, a hash of the users password and a random password
        //to be used by the Digital Certificate
        if (!user_insert_response.error) {
            let promise_array = [users_password_hash(users_password), p12_certificate_response(database_connection, users_full_name, users_email)];

            //Wait for all the Promises to execute after wich we update the user
            return Promise.all(promise_array)
                .then(async result => {

                    let password_hash;
                    let digital_certificate_path;
                    let digital_certificate_password;

                    for (let i = 0; i < result.length; i++) {
                        if (result[i].type === "digital_certificate") {
                            digital_certificate_path = result[i].certificate_location;
                            digital_certificate_password = result[i].certificate_password;
                        } else if (result[i].type === "password_hash") {
                            password_hash = result[i].response;
                        }
                    }

                    //Update the user with the new details 
                    let update_response = await database_connection.update_new_users_details(users_email, password_hash, digital_certificate_path, digital_certificate_password);
                    const Blockchain = require('../Blockchain');
                    const blockchain_connection = new Blockchain(global.blockchain_api_key);

                    let blockchain_user_added = await blockchain_connection.add_new_identity_to_blockchain(users_full_name + " User", users_full_name, "Student");
                    console.log(blockchain_user_added);

                    if (!blockchain_user_added.error) {
                        console.log("User updayted")

                        await database_connection.update_user(users_email, { user_avatar: "https://d00192082.alwaysdata.net/ServiceLoopServer/resources/images/" + users_email + ".jpg", user_blockchain_api_token: blockchain_user_added.response.ApiToken, user_blockchain_id: blockchain_user_added.response.Id, user_blockchain_identity_name: blockchain_user_added.response.IdentityName });
                    }

                    database_connection.disconnect();
                    return update_response;
                })
                .catch((error) => {
                    database_connection.disconnect();
                    console.log("Promises rejected")
                    console.log(error)
                    return { error: true, response: "error" };
                });
        } else {
            database_connection.disconnect();
            console.log(user_insert_response.response);
            return;
        }

    } catch (ex) {
        //Maybe this line is redundant
        database_connection.disconnect();
        console.log(ex);
        return;
    }
}

exports.create_new_user = create_new_user;