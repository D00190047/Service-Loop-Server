"use strict";

/**
 * This is the function that will verify the users input and make sure it matches our criteria for password strength, phone number and email format
 * 
 * @param {String} users_full_name - This is the name of the user
 * @param {String} users_password - This is the password of the user
 * @param {String} users_password_confirm - This is the password of the user
 * @param {String} users_email - This is the email of the user
 * @param {String} users_phone_number - This is the users phone number
 * 
 * @returns {Promise} This Promise will contain an object that contains 2 keys: error and response, the "error" key will be a boolean 
 * that specifies wether the registration was successful or not and the "response" key will be a String that contains the response from the function 
 */
let filter_registration_input = function validate_registration_input(users_full_name, users_password, users_password_confirm, users_email, users_phone_number, database_connection) {
    const validator = require('validator');
    let validation_successful = false;
    let data_all_present = false;
    
    //Here we check to see if the username, password, confirm password, email and phone number are not empty, if they are, we return an error
    if (users_full_name.length === 0 || users_password.length === 0 || users_password_confirm.length === 0 || users_email.length === 0 || users_phone_number.length === 0) {
        return { error: true, response: "Please fill in all required fields before proceeding." };
    }


    //Check that the entered email is a valid email
    if (validator.isEmail(users_email)) {
        if (validator.equals(users_password, users_password_confirm)) {
            if (users_password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/)) {
                //Check to see that the phone number is a valid Irish phone number
                if (validator.isMobilePhone('' + users_phone_number.replace(/\s/g, ''), ['en-IE'])) {
                    validation_successful = true;
                } else {
                    return {error: true, response: "'" + validator.escape(users_phone_number) + "' is not a valid phone number."};
                }
            } else {
                return { error: true, response: "Password must contain a minimum of eight and maximum of 128 characters, at least one uppercase letter, one lowercase letter, one number and one special character." };
            }
        } else {
            return { error: true, response: "'Password' and 'Confirm Password' do not match." };
        }
    } else {
        return { error: true, response: "'" + validator.escape(users_email) + "' is not a valid email." };
    }

    if (validation_successful) { 
        //return {error: true, response: "pre_db"}
        //Setup database connection and model for registrating new user 
        
        try {
            return new Promise(async (resolve, reject) => { 
                let email_unique = true;
                let find_if_email_unique_results = await database_connection.find_id_by_email(users_email);

                if (find_if_email_unique_results.error) { 
                    resolve({ error: true, response: find_if_email_unique_results.response });
                } else { 
                    if(find_if_email_unique_results.response == "No user found!") { 
                        resolve({error: false, response: "Proceed."});
                    } else { 
                        resolve({error: true, response: "The email '" + users_email + "' is already taken. Please use a different email and try again."});
                    } 
                } 
            }); 
        } catch (ex) {
            return {error: true, response: ex};
        }
    }
}

//---------------- Forgot Password ----------------------
let validate_password_input = function validate_password_input(users_email, users_password, users_password_confirm)
{
    const validator = require('validator');


    if ( users_password.length === 0 || users_password_confirm.length === 0) {
        return { error: true, response: "Field is empty" };
        
    }

    if (validator.isEmail(users_email)) {
        if (validator.equals(users_password, users_password_confirm)) {
            if (users_password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/)) 
            {
                console.log("password is valid");
                return { error: false, response: "valid" };
               
            }
            else {
                return { error: true, response: "Password must contain a minimum of eight and maximum of 128 characters, at least one uppercase letter, one lowercase letter, one number and one special character." };
            }
        } else {
            return { error: true, response: "'Password' and 'Confirm Password' do not match." };
        }
    } else {
        return { error: true, response: "'" + validator.escape(users_email) + "' is not a valid email." };

    }
}

let validate_user_phone = function validate_user_details(users_phone_number)
{
    const validator = require('validator');
    if (users_phone_number.length === 0) {
      
        return { error: true, response: "Phone number must no be left empty" };
    }
    if (validator.isMobilePhone('' + users_phone_number.replace(/\s/g, ''), ['en-IE'])) {
    
        return { error: false, response: "valid" };
    } else {
      
        return {error: true, response: "'" + validator.escape(users_phone_number) + "' is not a valid phone number."};
    }


}

exports.validate_registration_input = filter_registration_input;
exports.validate_user_phone = validate_user_phone;
exports.validate_password_input = validate_password_input;