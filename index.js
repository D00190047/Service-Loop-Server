const express = require('express');
const cors = require('cors');
const Live_Updates = require('./services/Live_Updates');
const app = express();
const path = require('path');

const Push_Notifications = require('./services/Push_Notifications');
const push_controller = new Push_Notifications("c08fd8bd-bfbf-4dd3-bc07-61d214842ccd", "MGMxYzc3NjEtZjFkOC00MmIwLTkyYmMtMzVmMjgzZDg4MzM2");

var server;

global.blockchain_api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBcGlLZXkiOiJBMjBNM1haLTRDSzRNTjUtSkNRMDJNQi00WkFFSFAzIiwiQXBpU2VjcmV0IjoianUyUjRTbHNpMzVPakdjIiwiUGFzc3BocmFzZSI6IjIyNDBjNmEzMjJjMjRlNzgyMmM1YmM3ZTM1Y2RkNWI0IiwiaWF0IjoxNTgyNjM1Mjc2fQ.Hi92qvQhQW4R2Sh2OuUMTNyx4dY69wnyJq6Z49maOsE";
global.sms_app_key = "3i1ivu6elylunazito7y";
global.sms_api_key = "112a600ad7ce7b679505469dd5079444cbdc1344";
global.sms_secret_key = "3i5u7ezara9o5yhy6u8a";

global.localhost = false;

var Live_Updates_Controller;

//const xssFilters = require('xss-filters');

app.use(cors());
app.use(express.json({ limit: '5mb' }));

function back_to_main_thread(res, pdf_path) {
  res.json(pdf_path);
}


//MOVE TO functions.js
function arrayContainsSameValues(arr, arr2) {
  return arr.every(i => arr2.includes(i));
}

/*
  Add a new function called "remove" to the Array prototype
  that removes a value from an array without needing to loop
  each time.
*/
Array.prototype.remove = function () {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

app.post('/create_and_sign_pdf', async (req, res) => {
  const Digital_Signature = require('./services/Digital_Signature');
  const signature_pdf = new Digital_Signature();

  try {
    // let pdf_path = await signature_pdf.create_digitally_signed_pdf("John_Doe_and_Jane_Doe_contract",
    //   "John Doe (\"Lender\") is lending 100 euro (the \"principal\") to hhdhdhd(\"Borrower\").The yearly interest rate of this loan is 0%. This is simple interest, with partialyears prorated on the basis of a 365-day year. If this rate exceeds the legal limit,then the interest rate shall equal the legal limit, and all related figures in thisagreement shall be adjusted accordingly.The loan begins on 2018-12-12.The following term applies:Lump-sum payment: Borrower must pay Lender the principal plus anyaccumulated interest in a lump sum on or before 2018-12-12.If Borrower fails to make any payment on time, the loan will be in default. Upondefault, the total outstanding balance will accrue interest at the annualized rateplus 10 percentage points over the annualized rate, or the legal limit if lower, untilit is paid.If any overdue amount is not paid within 30 days, Lender will have the option todemand from Borrower, for immediate payment, the total outstanding loanbalance (principal plus any accrued interest).This agreement is between Borrower and Lender, and neither is allowed todelegate, transfer or assign it to a third party without the written consent of theother.This is the parties' entire agreement on this matter, superseding all previousnegotiations or agreements. It can only be changed by mutual written consent.Failure to enforce any provision within this agreement does not waive thatprovision.The laws of the state of Louth govern this agreement and any disputes arising fromit will be handled exclusively in courts in that state. The prevailing party in anydispute will be entitled to recover reasonable costs and attorneys' fees.If a court invalidates any part of this agreement, the rest remains in effect.Signing a copy of this agreement, physical or electronic, will have the same effectas signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.",
    //   "s", "d");

    //let verified_results = await signature_pdf.verify_all_digital_signatures("tt");

    //back_to_main_thread(res, pdf_path);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

app.post('/check_user_details_correct', async (req, res) => {
  const login = require('./services/login');
  const database = require('./services/database');

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  res.json(await login.check_user_credentials(req.body.users_email, req.body.users_password, database_connection));
  return;
});

app.post('/verify_code', async (req, res) => {
  const validator = require('validator');
  const SMS = require('./services/SMS');
  const sms_controller = new SMS(global.sms_app_key, global.sms_api_key, global.sms_secret_key);

  const token = req.body.verification_token;
  const code = req.body.verification_code;
  const verification_phone_number = validator.escape(req.body.verification_phone_number).replace(/\s/g, '');


  let data = { mobile: verification_phone_number, country_code: '+353', token: token, code: code };
  let response = await sms_controller.verify_pin(data);
  res.json(response);

  return;
});


app.post('/verify_register_input', async (req, res) => {
  const validator = require('validator');
  const database = require('./services/database');
  const filter_registration_input = require('./services/registration/filter_registration_input');
  //validator.escape(req.body.users_first_name + " " + req.body.users_last_name)
  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  let filtering_response = await filter_registration_input.validate_registration_input(validator.escape(req.body.users_full_name), req.body.users_password, req.body.users_password_confirm, validator.escape(req.body.users_email), validator.escape(req.body.users_phone_number), database_connection);

  res.json(JSON.stringify(filtering_response));
  return;
});


app.post('/resend_sms_verification', async (req, res) => {
  const validator = require('validator');
  const SMS = require('./services/SMS');
  const sms_controller = new SMS(global.sms_app_key, global.sms_api_key, global.sms_secret_key);

  const verification_phone_number = validator.escape(req.body.verification_phone_number).replace(/\s/g, '');


  let data = { mobile: verification_phone_number, country_code: '+353', service: 'SMS' }
  let response = await sms_controller.resend_sms(data);
  res.json(response);

  return;
});

app.post('/send_sms_verification', async (req, res) => {
  const validator = require('validator');
  const SMS = require('./services/SMS');
  const sms_controller = new SMS(global.sms_app_key, global.sms_api_key, global.sms_secret_key);

  const verification_phone_number = validator.escape(req.body.verification_phone_number).replace(/\s/g, '');

  let data = { mobile: verification_phone_number, country_code: '+353', service: 'SMS' }
  let response = await sms_controller.send_sms(data);
  res.json(response);

  return;
});

app.post('/login_user', async (req, res) => {
  const login = require('./services/login');
  const database = require('./services/database');

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  res.json(await login.login_user(req.body.users_email, req.body.users_password, database_connection));
  return;
});

app.post('/verify_token', async (req, res) => {
  const jwt = require('jsonwebtoken');
  let token = req.body.token;
  let email = req.body.email;

  try {
    //process.env.JWT_SECRET
    let JWT_SECRET = 'addjsonwebtokensecretherelikeQuiscustodietipsoscustodes';

    const database = require('./services/database');

    const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
    let db_con_response = await database_connection.connect();
    let user_response = await database_connection.find_user_by_email(email);
    let tutorials_count = await database_connection.find_tutored_tutorials(email);
    database_connection.disconnect();

    let decoded = jwt.verify(token, JWT_SECRET);

    res.json({ session_response: "Session valid", user: user_response, tutorials_count: tutorials_count });
    return;
  } catch (err) {
    if (err.message === "jwt expired") {
      res.json({ session_response: "Session valid" });
      return;
    } else if (err.message === "jwt malformed") {
      res.json({ session_response: "Session corrupted" });
      return;
    } else {
      res.json(err);
      return;
    }
  }
});

app.post('/localhost', async (req, res) => {
  let email = req.body.email;

  const database = require('./services/database');

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();
  let user_response = await database_connection.find_user_by_email(email);

  let tutorials_count = await database_connection.find_tutored_tutorials(email);
  database_connection.disconnect();

  res.json({ session_response: "Session valid", user: user_response, tutorials_count: tutorials_count });
  return;
});

app.post('/register', async (req, res) => {
  const register_new_user = require('./services/registration/register');
  const validator = require('validator');
  const database = require('./services/database');

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  let result = await register_new_user.create_new_user(validator.escape(req.body.users_full_name), req.body.users_password, req.body.users_password_confirm, validator.escape(req.body.users_email), validator.escape(req.body.users_phone_number), database_connection);
  res.json(JSON.stringify(result));
  return;
});

//Need the forward slash...
//"java -jar /home/d00192082/ServiceLoopServer/resources/java/JSignPdf.jar /home/d00192082/ServiceLoopServer/resources/pdfs/agreement_5e428eff1700d139c09167d2.pdf -v --visible-signature -d /home/d00192082/ServiceLoopServer/resources/pdfs -a --bg-path /home/d00192082/ServiceLoopServer/resources/images/adobe_watersign.png -page 1000 -kst PKCS12 -ksf /home/d00192082/ServiceLoopServer/ssl/client_5e41bc1b78c9ad2fa0dadac7.p12 -ksp pycnaMLBLp 2>&1"
app.post('/appply_to_be_tutor', async (req, res) => {
  try {
    let database = require('./services/database')
    const validator = require('validator');

    if (req.body.users_email === "" || req.body.users_email && req.body.users_skills.length !== 0 && req.body.users_skills) {
      let tutor_email = req.body.users_email;
      let tutor_skills = req.body.users_skills;

      const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
      let db_con_response = await database_connection.connect();

      res.json(await database_connection.elevate_user_to_tutor(tutor_email, tutor_skills));
      return;
    } else {
      res.json({ error: true, response: "Please fill out all fields before applying." });
      return;
    }
  } catch (ex) {
    //????? maybe delete
    database_connection.disconnect();
    res.json(ex);
    return;
  }

});

app.post('/request_tutorial', async (req, res) => {
  let database = require('./services/database')
  const validator = require('validator');

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  if (req.body.request_title.length == 0 || req.body.request_description.length == 0 || typeof req.body.request_modules[0] == "undefined" || req.body.request_modules == null || req.body.request_modules.length == null || req.body.users_email.length == 0) {
    res.json({ error: true, response: "Please fill in all fields before proceeding." });
    return;
  }

  res.json(await database_connection.add_tutorial(req.body.request_title, req.body.request_description, req.body.request_modules, req.body.users_email, req.body.user_avatar));
  return;
});

app.post('/get_all_notifications', async (req, res) => {
  const validator = require('validator');
  const database = require('./services/database');

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  for (var key in req.body) {
    if (req.body[key] === "") {
      res.json({ error: true, response: "Please fill in all fields before proceeding." });
      return;
    }
  }

  res.json(await database_connection.get_all_users_notifications(validator.escape(req.body.users_email), req.body.user_tutor));
  return;
});

app.post('/set_notification_to_read', async (req, res) => {
  let database = require('./services/database')

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  res.json(await database_connection.set_notification_to_read(req.body.notification_id));
  return;
});

app.post('/get_all_posts', async (req, res) => {
  let database = require('./services/database')

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  //DELETE EVERYTHING
  //await database_connection.reset();

  res.json(await database_connection.get_all_elegible_posts(req.body.email, req.body.user_modules));
  return;
});

app.post('/post_accepted', async (req, res) => {
  let database = require('./services/database')

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  res.json(await database_connection.accept_post(req.body.tutor_email, req.body.tutor_name, req.body.post_id, req.body.user_avatar));
  return;
});

app.post('/get_notification_posts', async (req, res) => {
  let database = require('./services/database')

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  res.json(await database_connection.get_notification_posts(req.body.notification_posts_id));
  return;
});

//TEST THIS
app.post('/get_my_requested_posts', async (req, res) => {
  let database = require('./services/database')

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  res.json(await database_connection.get_all_users_tutorials(req.body.users_email));
  return;
});

//TEST THIS
app.post('/get_all_tutor_tutorials', async (req, res) => {
  let database = require('./services/database')

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  res.json(await database_connection.get_all_tutor_tutorials(req.body.users_email));
  return;
});

//TEST THIS
app.post('/offer_agreement', async (req, res) => {
  if (req.body.tutor_signature == "") {
    res.json({ error: true, response: "Please fill in all fields before proceeding." });
  }

  const database = require('./services/database');
  const offer_agreement = require('./services/offer_agreement');

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  res.json(await offer_agreement.offer_agreement(database_connection, req.body.tutorial_id, req.body.tutorial_date.substring(0, 10), req.body.tutorial_time, req.body.tutorial_end_time, req.body.tutor_signature, req.body.tutor_avatar));
  return;
});

//TEST THIS
app.post('/accept_agreement', async (req, res) => {
  const database = require('./services/database');
  const accept_agreement = require('./services/accept_agreement');

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  res.json(await accept_agreement.accept_agreement(database_connection, req.body.tutorial_id, req.body.student_signature));
  return;
});

//TEST THIS
app.post('/reject_agreement', async (req, res) => {
  const database = require('./services/database');
  const accept_agreement = require('./services/accept_agreement');

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  res.json(await database_connection.reject_agreement(req.body.tutorial_id));
  return;
});

//TEST THIS
app.post('/validate_digital_signatures', async (req, res) => {
  const database = require('./services/database');
  const verify_digital_signatures_handler = require('./services/verify_digital_signatures.js');

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  res.json(await verify_digital_signatures_handler.verify_digital_signatures(database_connection, req.body));
  return;
});

app.post('/load_blockchain_content', async (req, res) => {
  const Blockchain = require('./services/Blockchain');
  const blockchain_controller = new Blockchain(global.blockchain_api_key);

  let response = await blockchain_controller.get_transactions_by_key(req.body.key);
  console.log(response);

  res.json(response);
  return;
});

//TEST THIS
app.post('/update_avatar', async (req, res) => {
  const database = require('./services/database');
  const avatar = require('./services/update_avatar');

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  let response = await avatar.update_avatar(database_connection, req.body.email, req.body.image);

  res.json(response);
  return;
});

//TEST THIS
app.post('/edit_skills', async (req, res) => {
  const database = require('./services/database');

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  let response = await database_connection.update_user(req.body.users_email, { user_modules: req.body.skills });

  res.json(response);
  return;
});

app.post('/push_notification', async (req, res) => {
  let response;

  try {
    response = await push_controller.push(req.body.title, req.body.body, req.body.to, req.body.key, req.body.notification, req.body.post);
  } catch (ex) {
    response = ex;
  }

  res.json(response);
  return;
});


//------------- New Forgot Password & change Details ---------
app.post('/send_forgot_password', async (req, res) => {

  let database = require('./services/database');
  // const change_password = require('./services/change_password');
  const SMS = require('./services/SMS');
  const sms_controller = new SMS(global.sms_app_key, global.sms_api_key, global.sms_secret_key);

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  database_connection.connect();

  //get user
  let user = await database_connection.find_user_by_email(req.body.users_email);

  new Promise((resolve, reject) => {
    //get phone number 
    let phone_number = user.response.user_phone_number;
    console.log("\n" + phone_number);

    //send code
    let data = { mobile: phone_number, country_code: '+353', service: 'SMS' }
    response = sms_controller.send_sms(data);
    res.json(response);

    resolve({ error: false, response: "Pin has been sent via SMS!" });
  }).catch((exception) => {
    database_connection.disconnect();
    resolve({ error: true, response: exception });
  });


});

app.post('/change_password', async (req, res) => {

  let database = require('./services/database');

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  database_connection.connect();

  if (req.body.new_password === req.body.password_confirm) {

    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    let user = await database_connection.find_user_by_email(req.body.users_email);

    let pword = user.response.user_password;
    // check if confirm & new password  match
    let match = bcrypt.compare(req.body.users_email, pword, function (err, result) {
      result == true
    });

    if (match = true) {
      console.log("Confirm & new Match");
      //const validator = require('validator');
      const password_input = require('./services/registration/filter_registration_input');

      //Valiate user data
      let valid = password_input.validate_password_input(req.body.users_email, req.body.new_password, req.body.password_confirm);
      if (!valid.error) {

        //hash password       
        let hash = await bcrypt.hash(req.body.new_password, saltRounds);
        // update doc with new hashed  password
        response = database_connection.change_user_password(req.body.users_email, hash);
        res.json(response);
        return;

      }
    }
    else {
      response = "Password Incorrect";
      res.json(response);
      return;
    }
  }
  else {
    response = "Password & confirm password did not match"
    res.json(response);
    return;
  }


});

app.post('/change_phone', async (req, res) => {

  let database = require('./services/database');

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  database_connection.connect();

  response = database_connection.change_user_phone(req.body.users_email, req.body.user_phone_number);

  res.json(response);

});

app.post('/cancel_tutorial', async (req, res) => {
  const database = require('./services/database');
  const Blockchain = require('./services/Blockchain');
  const blockchain_controller = new Blockchain(global.blockchain_api_key);

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();
  let tutorial = req.body.tutorial;

  //Remove tutorial
  let response = await database_connection.delete_tutorial(req.body.tutorial_id);

  let student_notification = await database_connection.create_notification("Tutorial canceled", "The tutorial '" + tutorial.post_title + "' has been cancelled.", tutorial.std_email, ["Tutorial cancelled"], { post_id: req.body.tutorial_id }, req.body.avatar);
  let tutor_notification;
  let tutor_exists = false;

  if (typeof tutorial.post_tutor_email !== "undefined") {
    tutor_exists = true;

    let tutor_avatar = await database_connection.find_id_by_email(tutorial.post_tutor_email);
    tutor_notification = await database_connection.create_notification("Tutorial canceled", "The tutorial '" + tutorial.post_title + "' has been cancelled.", tutorial.post_tutor_email, ["Tutorial cancelled"], { post_id: req.body.tutorial_id }, tutor_avatar.response.user_avatar);
  }

  //get_avatar(email, is_tutor);

  //let new_tutorial = await database_connection.add_tutorial(req.body.tutorial.post_title, req.body.tutorial.post_desc, req.body.tutorial.post_modules, req.body.tutorial.std_email, req.body.tutorial.std_avatar);

  blockchain_controller.add_transaction_to_blockchain(req.body.tutorial_id, { title: "Tutorial canceled", content: "The tutorial '" + tutorial.post_title + "' has been canceled." });

  res.json({ student_notification: student_notification, tutor_notification: tutor_notification, tutor_exists: tutor_exists });
  return;
});

app.post('/begin_tutorial', async (req, res) => {
  const database = require('./services/database');
  const Blockchain = require('./services/Blockchain');
  const blockchain_controller = new Blockchain(global.blockchain_api_key);

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  //Begin tutorial
  let tutorial = await database_connection.begin_tutorial(req.body.tutorial_id);

  //CHECK DKIT LDAP SERVERS!!!!
  let student_number = req.body.student_number;

  let student_notification = await database_connection.create_notification("Tutorial started", "The tutorial '" + tutorial.post_title + "' has been started! Goodluck!", tutorial.std_email, ["Tutorial started"], { post_id: req.body.tutorial_id }, req.body.avatar);

  //Get tutors avatar
  let tutor_avatar = await database_connection.find_id_by_email(tutorial.post_tutor_email);
  let tutor_notification = await database_connection.create_notification("Tutorial started", "The tutorial '" + tutorial.post_title + "' has been started! Goodluck!", tutorial.post_tutor_email, ["Tutorial started"], { post_id: req.body.tutorial_id }, tutor_avatar.response.user_avatar);

  blockchain_controller.add_transaction_to_blockchain(req.body.tutorial_id, { title: "Tutorial started", content: "The tutorial '" + tutorial.post_title + "' has just been started by the tutor." });

  res.json({ updated_tutorial: tutorial, student_notification: student_notification, tutor_notification: tutor_notification });
  return;
});

app.post('/finish_tutorial', async (req, res) => {
  const database = require('./services/database');
  const Blockchain = require('./services/Blockchain');
  const blockchain_controller = new Blockchain(global.blockchain_api_key);

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  //Begin tutorial
  let tutorial = await database_connection.finish_tutorial(req.body.tutorial_id);

  let student_notification = await database_connection.create_notification("Tutorial finished", "The tutorial '" + tutorial.post_title + "' has been completed!<br><br>Thank you for using Student Loop!", tutorial.std_email, ["Tutorial finished"], { post_id: req.body.tutorial_id }, req.body.avatar);

  //Get tutors avatar
  let tutor_avatar = await database_connection.find_id_by_email(tutorial.post_tutor_email);
  let tutor_notification = await database_connection.create_notification("Tutorial finished", "The tutorial '" + tutorial.post_title + "' has been completed!<br><br>Thank you for using Student Loop!", tutorial.post_tutor_email, ["Tutorial finished"], { post_id: req.body.tutorial_id }, tutor_avatar.response.user_avatar);

  blockchain_controller.add_transaction_to_blockchain(req.body.tutorial_id, { title: "Tutorial finished", content: "The tutorial '" + tutorial.post_title + "' has just been finished by the tutor." });

  res.json({ updated_tutorial: tutorial, student_notification: student_notification, tutor_notification: tutor_notification });
  return;
});

app.post('/rate_tutor', async (req, res) => {
  const database = require('./services/database');
  const Blockchain = require('./services/Blockchain');
  const blockchain_controller = new Blockchain(global.blockchain_api_key);

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  //Rate tutor
  let tutor = await database_connection.find_id_by_email(req.body.tutorial.post_tutor_email);
  let previous_ratings = tutor.response.past_ratings;
  let total_ratings = tutor.response.total_ratings;
  let rating = tutor.response.tutor_rating;

  previous_ratings.push(req.body.rating);
  total_ratings++;

  rating = (previous_ratings.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / total_ratings);
  rating = Math.round(rating);

  let rating_update_response = await database_connection.rate_tutor(req.body.tutorial.post_tutor_email, rating, previous_ratings, total_ratings);
  let new_tutorial = await database_connection.update_post(req.body.tutorial_id, { tutor_rated: true, comment: req.body.comment });

  blockchain_controller.add_transaction_to_blockchain(req.body.tutorial_id, { title: "Tutor has been rated", content: "The student has give you a rating of " + req.body.rating + "/5 for the tutorial '" + req.body.tutorial.post_title + "'." });

  res.json({ updated_tutorial: new_tutorial, rating: rating });
  return;
});

if (global.localhost) {
  server = app.listen(3001, async function () {
    console.log('App started on Localhost!');
    
    // let database = require('./services/database')

    // const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
    // let db_con_response = await database_connection.connect();

    // //DELETE EVERYTHING
    // await database_connection.reset();

    Live_Updates_Controller = new Live_Updates(server, app);
    Live_Updates_Controller.connect();
  });
} else {
  server = app.listen(process.env.ALWAYSDATA_HTTPD_PORT, process.env.ALWAYSDATA_HTTPD_IP, async function () {
    console.log('App started on Alwaysdata!');

    // let database = require('./services/database')

    // const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
    // let db_con_response = await database_connection.connect();

    // //DELETE EVERYTHING
    // await database_connection.reset();

    Live_Updates_Controller = new Live_Updates(server, app);
    Live_Updates_Controller.connect();
  });
}
