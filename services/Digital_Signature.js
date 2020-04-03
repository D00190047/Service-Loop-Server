"use strict";
const fs = require('fs');
var exec = require('child_process').exec, child;

class Digitally_Sign {
    constructor() {
    }

    //"java -jar /home/d00192082/ServiceLoopServer/resources/java/JSignPdf.jar /home/d00192082/ServiceLoopServer/resources/pdfs/agreement_5e428eff1700d139c09167d2.pdf -v --visible-signature -d /home/d00192082/ServiceLoopServer/resources/pdfs -a --bg-path /home/d00192082/ServiceLoopServer/resources/images/adobe_watersign.png -page 1000 -kst PKCS12 -ksf /home/d00192082/ServiceLoopServer/ssl/client_5e41bc1b78c9ad2fa0dadac7.p12 -ksp pycnaMLBLp"
    async digitally_sign_pdf(pdf_path, digital_certificate, append_signature = false) {
        const path = require('path');
        let base_path;

        //For debugging purposes, if on localhost, we use a different path
        if (global.localhost) {
            base_path = '';
        } else {
            base_path = path.join(__dirname, '../');
        }

        let digitally_sign_pdf_once_command = `java -jar ${base_path}resources/java/JSignPdf.jar ${base_path + pdf_path} -v --visible-signature -d ${base_path}resources/pdfs -a --bg-path ${base_path}resources/images/adobe_watersign.png -page 1000 -kst PKCS12 -ksf ${base_path + digital_certificate.tutor.certificate_path} -ksp ${digital_certificate.tutor.certificate_password} 2>&1`;
        let digitally_sign_pdf_twice_command;

        if (append_signature) {
            digitally_sign_pdf_twice_command = `java -jar ${base_path}resources/java/JSignPdf.jar ${base_path + pdf_path.substring(0, pdf_path.length - 4) + '_signed.pdf'} -v --visible-signature -d ${base_path}resources/pdfs -llx 612 -lly 0 -urx 500 -ury 100 -a --append --bg-path ${base_path}resources/images/adobe_watersign.png -page 1000 -kst PKCS12 -ksf ${base_path + digital_certificate.student.certificate_path} -ksp ${digital_certificate.student.certificate_password} 2>&1`;
        }

        //return base_path;
        return new Promise((resolve, reject) => {
            //works
            //`java -jar /home/d00192082/ServiceLoopServer/resources/java/JSignPdf.jar /home/d00192082/ServiceLoopServer/resources/pdfs/agreement_5e428eff1700d139c09167d2.pdf -v --visible-signature -d /home/d00192082/ServiceLoopServer/resources/pdfs -a --bg-path /home/d00192082/ServiceLoopServer/resources/images/adobe_watersign.png -page 1000 -kst PKCS12 -ksf /home/d00192082/ServiceLoopServer/ssl/client_5e41bc1b78c9ad2fa0dadac7.p12 -ksp pycnaMLBLp 2>&1`


            //resolve(`java -jar ${base_path}resources/java/JSignPdf.jar ${base_path + pdf_path} -v --visible-signature -d ${base_path}resources/pdfs -a --bg-path ${base_path}resources/images/adobe_watersign.png -page 1000 -kst PKCS12 -ksf ${base_path + digital_certificate.tutor.certificate_path} -ksp ${digital_certificate.tutor.certificate_password}`);
            if (!append_signature) {
                exec(digitally_sign_pdf_once_command,
                    (error, stdout, stderr) => {
                        //On error, delete the PDFs, on success, sign second user
                        if (error !== null) {
                            console.groupCollapsed("Error handling 1st signing");
                            console.log('stdout: ' + stdout);
                            console.log('stderr: ' + stderr);
                            console.log('exec error: ' + error);
                            console.groupEnd();

                            //Delete PDF
                            //fs.unlinkSync(base_path + pdf_path.substring(0, pdf_path.length - 4) + '_signed.pdf');

                            //Return error
                            resolve({ error: true, response: stdout });
                        } else {
                            //fs.unlinkSync(pdf_path);
                            resolve({ error: false, response: pdf_path.replace(/(\.[\w\d_-]+)$/i, '_signed$1') });
                        }
                    });
            } else {
                exec(digitally_sign_pdf_once_command,
                    (error, stdout, stderr) => {
                        //On error, delete the PDFs, on success, sign second user
                        if (error !== null) {
                            console.groupCollapsed("Error handling 1st signing");
                            console.log('stdout: ' + stdout);
                            console.log('stderr: ' + stderr);
                            console.log('exec error: ' + error);
                            console.groupEnd();

                            //Delete PDF
                            fs.unlinkSync(base_path + pdf_path.substring(0, pdf_path.length - 4) + '_signed.pdf');

                            //Return error
                            resolve({ error: true, position: "First", response: stdout })
                        } else {
                            //Delete the original PDF 
                            fs.unlinkSync(base_path + pdf_path);

                            //Digitally Sign for second user
                            exec(digitally_sign_pdf_twice_command,
                                (error, stdout, stderr) => {
                                    //On error, delete the PDFs, on success, delete the old PDF
                                    if (error !== null) {
                                        console.groupCollapsed("Error handling 2nd signing");
                                        console.log('stdout: ' + stdout);
                                        console.log('stderr: ' + stderr);
                                        console.log('exec error: ' + error);
                                        console.groupEnd();

                                        //Delete PDF
                                        fs.unlinkSync(base_path + pdf_path.substring(0, pdf_path.length - 4) + '_signed.pdf');
                                        fs.unlinkSync(base_path + pdf_path.substring(0, pdf_path.length - 4) + '_signed_signed.pdf');

                                        //Return error
                                        resolve({ error: "true", position: "Second", response: stdout })
                                    } else {
                                        fs.unlinkSync(base_path + pdf_path.substring(0, pdf_path.length - 4) + "_signed.pdf");

                                        //Rename the file from John_Doe_and_Jane_Doe_contract_signed_signed.pdf to just
                                        //John_Doe_and_Jane_Doe_contract_signed_final.pdf
                                        console.log(pdf_path.substring(0, pdf_path.length - 4))
                                        fs.rename(base_path + pdf_path.substring(0, pdf_path.length - 4) + "_signed_signed.pdf", base_path + pdf_path.substring(0, pdf_path.length - 4) + "_signed_final.pdf", (err) => {
                                            if (err) {
                                                resolve({ error: true, response: err })
                                            } else {
                                                resolve({ error: false, response: pdf_path.substring(0, pdf_path.length - 4) + "_signed_final.pdf" });
                                            }
                                        });
                                    }
                                });
                        }
                    });
            }
        });
    }

    async verify_digital_signature(pdf, data) {

        //2>&1 <--- Add to command MAYBE
        const path = require('path');
        //let base_path = path.join(__dirname, '../');
        let base_path;

        //For debugging purposes, if on localhost, we use a different path
        if (global.localhost) {
            base_path = '';
        } else {
            base_path = path.join(__dirname, '../');
        }
 
        let check_one_digital_signature_command = [`java -jar ${base_path}resources/java/Verifier.jar ${base_path + pdf} -kf ${base_path + data.party_1_digital_certificate.digital_certificate} -kp ${data.party_1_digital_certificate.digital_certificate_password} -kt PKCS12`];

        if (typeof data.party_2_digital_certificate !== 'undefined') {
            check_one_digital_signature_command.push(`java -jar ${base_path}resources/java/Verifier.jar ${base_path + pdf} -kf ${base_path + data.party_2_digital_certificate.digital_certificate} -kp ${data.party_2_digital_certificate.digital_certificate_password} -kt PKCS12`);
        }

        return new Promise((resolve, reject) => {
            for (let i = 0; i < check_one_digital_signature_command.length; i++) {
                exec(check_one_digital_signature_command[i],
                    (error, stdout, stderr) => {
                        if (error !== null) {
                            //60 error code means certificate cannot be verified (because it was created by us) and 61 means it is expired??? IDK how that is possible -_-
                            if (error.code !== 60 && error.code !== 61) {
                                //console.log('stdout: ' + stdout);
                                //console.log('stderr: ' + stderr);
                                //console.log('exec error: ' + error);
                                let error_response = this.check_digital_signature_error_code(error.code) 
                                resolve({ error: true, response: { message: error_response, pdf: pdf, error_code: error.code } });
                            }
                        }

                        if (i === check_one_digital_signature_command.length - 1) {
                            resolve({ error: false, response: "Digital signatures are valid." });
                        }
                    });
            }

        });


    }

    check_digital_signature_error_code(error_code) { 
        let error_message;

        switch (error_code) {
            case 10:
                //SIG_STAT_CODE_WARNING_NO_SIGNATURE 
                error_message = "Warning! The PDF has no signatures. Warning code 10.";
                break;
            case 15:
                //SIG_STAT_CODE_WARNING_ANY_WARNING
                error_message = "Warning! Something went wrong. Warning code 15.";
                break;
            case 20:
                //SIG_STAT_CODE_WARNING_NO_REVOCATION_INFO 
                error_message = "Warning! There is no revocation info. Warning code 20.";
                break;
            case 30:
                //SIG_STAT_CODE_WARNING_TIMESTAMP_INVALID 
                error_message = "Warning! The timestamp is invalid. Warning code 30.";
                break;
            case 40:
                //SIG_STAT_CODE_WARNING_NO_TIMESTAMP_TOKEN 
                error_message = "Warning! There is no timestamp token. Warning code 40.";
                break;
            case 50:
                //SIG_STAT_CODE_WARNING_SIGNATURE_OCSP_INVALID
                error_message = "Warning! The Signature OCSP is invalid. Warning code 50.";
                break;
            case 60:
                //SIG_STAT_CODE_WARNING_CERTIFICATE_CANT_BE_VERIFIED
                error_message = "Warning! Your certificate can't be verified. Warning code 60.";
                break;
            case 61:
                //SIG_STAT_CODE_WARNING_CERTIFICATE_EXPIRED
                error_message = "Warning! Your certificate has expired. Warning code 61.";
                break;
            case 62:
                //SIG_STAT_CODE_WARNING_CERTIFICATE_NOT_YET_VALID
                error_message = "Warning! Your certificate is not yet valid. Warning code 62.";
                break;
            case 63:
                //SIG_STAT_CODE_WARNING_CERTIFICATE_REVOKED
                error_message = "Warning! Your certificate has been revoked. Warning code 63.";
                break;
            case 64:
                //SIG_STAT_CODE_WARNING_CERTIFICATE_UNSUPPORTED_CRITICAL_EXTENSION
                error_message = "Warning! Your certificate is not supported. Warning code 64.";
                break;
            case 65:
                //SIG_STAT_CODE_WARNING_CERTIFICATE_INVALID_STATE
                error_message = "Warning! Your certificate has an invalid state. Warning code 65.";
                break;
            case 66:
                //SIG_STAT_CODE_WARNING_CERTIFICATE_PROBLEM
                error_message = "Warning! There is a porblem with your certificate. Warning code 66.";
                break;
            case 70:
                //SIG_STAT_CODE_WARNING_UNSIGNED_CONTENT
                error_message = "Warning! Unsigned content was detected. Warning code 70.";
                break;
            case 101:
                //SIG_STAT_CODE_ERROR_FILE_NOT_READABLE
                error_message = "Error! The PDF is not readable. Error code 101.";
                break;
            case 102:
                //SIG_STAT_CODE_ERROR_UNEXPECTED_PROBLEM
                error_message = "Error! An unexpected error has occured, please try again. Error code 102.";
                break;
            case 105:
                //SIG_STAT_CODE_ERROR_ANY_ERROR
                error_message = "Error! An error has occured, please try again. Error code 105.";
                break;
            case 110:
                //SIG_STAT_CODE_ERROR_CERTIFICATION_BROKEN 
                error_message = "Error! Your certificate is broken. Error code 110.";
                break;
            case 120:
                //SIG_STAT_CODE_ERROR_REVISION_MODIFIED
                error_message = "Error! There has been a modification. Error code 120.";
        }

        return error_message;
    }

    verify_all_digital_signatures(user_name) {
        let all_user_pdfs = ["resources/pdfs/testPDF_signed.pdf", "resources/pdfs/John_Doe_and_Jane_Doe_contract_signed.pdf"];
        let compromised_pdfs = [];
        let error_message = '';

        //Get this from DB, same thing will be done for all other people that are in a contract with this user
        let user_identity = { name: "John Doe", identity_info: { keystore_file_location: "resources/keystore_files/johnnie.jks", keystore_password: "johnniestoresecret" } };

        //2 parts to this function, test all users Digital signatures, then test all other parties which are
        //involved with the user digital signatures.

        //console.log('java -jar "resources/java/Verifier.jar" ' + pdfs_to_check + '-kf "' + user_identity.identity_info.keystore_file_location + '" -kp ' + user_identity.identity_info.keystore_password + ' -kt JKS 2>&1');

        //Loop through each contract to see if it has been tampered with.
        //NOTE - We could have checked all PDFS in one query but we wouldn't
        //       know which particular PDF failed as I can't get the stdout as
        //       an array to then check. This way we will know which one failed.
        //
        //CONSIDER REFACTORING USING FOREACH https://stackoverflow.com/questions/13343340/calling-an-asynchronous-function-within-a-for-loop-in-javascript


        return new Promise((resolve, reject) => {
            for (let i = 0; i < all_user_pdfs.length; i++) {
                child = exec('java -jar "resources/java/Verifier.jar" "' + all_user_pdfs[i] + '" -kf "' + user_identity.identity_info.keystore_file_location + '" -kp ' + user_identity.identity_info.keystore_password + ' -kt JKS 2>&1',
                    (error, stdout, stderr) => {
                        if (error !== null) {
                            if (error.code !== 60) {
                                switch (error.code) {
                                    case 10:
                                        //SIG_STAT_CODE_WARNING_NO_SIGNATURE 
                                        error_message = "Warning! The PDF has no signatures. Warning code 10.";
                                        break;
                                    case 15:
                                        //SIG_STAT_CODE_WARNING_ANY_WARNING
                                        error_message = "Warning! Something went wrong. Warning code 15.";
                                        break;
                                    case 20:
                                        //SIG_STAT_CODE_WARNING_NO_REVOCATION_INFO 
                                        error_message = "Warning! There is no revocation info. Warning code 20.";
                                        break;
                                    case 30:
                                        //SIG_STAT_CODE_WARNING_TIMESTAMP_INVALID 
                                        error_message = "Warning! The timestamp is invalid. Warning code 30.";
                                        break;
                                    case 40:
                                        //SIG_STAT_CODE_WARNING_NO_TIMESTAMP_TOKEN 
                                        error_message = "Warning! There is no timestamp token. Warning code 40.";
                                        break;
                                    case 50:
                                        //SIG_STAT_CODE_WARNING_SIGNATURE_OCSP_INVALID
                                        error_message = "Warning! The Signature OCSP is invalid. Warning code 50.";
                                        break;
                                    case 60:
                                        //SIG_STAT_CODE_WARNING_CERTIFICATE_CANT_BE_VERIFIED
                                        error_message = "Warning! Your certificate can't be verified. Warning code 60.";
                                        break;
                                    case 61:
                                        //SIG_STAT_CODE_WARNING_CERTIFICATE_EXPIRED
                                        error_message = "Warning! Your certificate has expired. Warning code 61.";
                                        break;
                                    case 62:
                                        //SIG_STAT_CODE_WARNING_CERTIFICATE_NOT_YET_VALID
                                        error_message = "Warning! Your certificate is not yet valid. Warning code 62.";
                                        break;
                                    case 63:
                                        //SIG_STAT_CODE_WARNING_CERTIFICATE_REVOKED
                                        error_message = "Warning! Your certificate has been revoked. Warning code 63.";
                                        break;
                                    case 64:
                                        //SIG_STAT_CODE_WARNING_CERTIFICATE_UNSUPPORTED_CRITICAL_EXTENSION
                                        error_message = "Warning! Your certificate is not supported. Warning code 64.";
                                        break;
                                    case 65:
                                        //SIG_STAT_CODE_WARNING_CERTIFICATE_INVALID_STATE
                                        error_message = "Warning! Your certificate has an invalid state. Warning code 65.";
                                        break;
                                    case 66:
                                        //SIG_STAT_CODE_WARNING_CERTIFICATE_PROBLEM
                                        error_message = "Warning! There is a porblem with your certificate. Warning code 66.";
                                        break;
                                    case 70:
                                        //SIG_STAT_CODE_WARNING_UNSIGNED_CONTENT
                                        error_message = "Warning! Unsigned content was detected. Warning code 70.";
                                        break;
                                    case 101:
                                        //SIG_STAT_CODE_ERROR_FILE_NOT_READABLE
                                        error_message = "Error! The PDF is not readable. Error code 101.";
                                        break;
                                    case 102:
                                        //SIG_STAT_CODE_ERROR_UNEXPECTED_PROBLEM
                                        error_message = "Error! An unexpected error has occured, please try again. Error code 102.";
                                        break;
                                    case 105:
                                        //SIG_STAT_CODE_ERROR_ANY_ERROR
                                        error_message = "Error! An error has occured, please try again. Error code 105.";
                                        break;
                                    case 110:
                                        //SIG_STAT_CODE_ERROR_CERTIFICATION_BROKEN 
                                        error_message = "Error! Your certificate is broken. Error code 110.";
                                        break;
                                    case 120:
                                        //SIG_STAT_CODE_ERROR_REVISION_MODIFIED
                                        error_message = "Error! There has been a modification. Error code 120.";
                                }

                                //console.log('stdout: ' + stdout);
                                //console.log('stderr: ' + stderr);
                                //console.log('exec error: ' + error);
                                compromised_pdfs.push(all_user_pdfs[i]);
                            }
                        }

                        if (i == all_user_pdfs.length - 1) {

                            if (compromised_pdfs.length === 0) {
                                resolve('Success');
                            } else {
                                //DELETE COMPROMISED PDFS
                                console.log(error_message);
                                //console.log(compromised_pdfs);
                                reject(error_message);
                            }

                        }
                    });
            }
        });
    }
}

module.exports = Digitally_Sign;