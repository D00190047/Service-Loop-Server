let accept_agreement = async function accept_agreement(database_connection, post_id, student_signature) {
    const Digital_Signature = require('./Digital_Signature');
    const fs = require('fs');
    const path = require('path');
    const base_path = path.join(__dirname, '../');
    const functions = require('./functions');

    const signature_controller = new Digital_Signature();

    //Get student details this way
    let update_post_agreement_status_response = await database_connection.update_post_agreement_status(post_id, { post_agreement_signed: true, post_status: "Ongoing" }, true);
    update_post_agreement_status_response = update_post_agreement_status_response.response;

    let tutor_digital_certificate = await database_connection.get_digital_certificate_details(update_post_agreement_status_response.post_tutor_email);
    let student_digital_certificate = await database_connection.get_digital_certificate_details(update_post_agreement_status_response.std_email);

    let pdf_path_and_name = await functions.create_agreement_pdf({ tutorial_date: update_post_agreement_status_response.tutorial_date, tutorial_time: update_post_agreement_status_response.tutorial_time, tutorial_room: update_post_agreement_status_response.tutorial_room }, { tutor_signature: update_post_agreement_status_response.tutor_signature, student_signature: student_signature }, update_post_agreement_status_response, true);

    //Delete previously generated (signed) PDF  
    let signed_pdf_path = await signature_controller.digitally_sign_pdf(pdf_path_and_name.pdf_path, { student: student_digital_certificate, tutor: tutor_digital_certificate }, true);
    let update_post_agremeent_url_response = await database_connection.update_post_agreement_url(post_id, signed_pdf_path.response, update_post_agreement_status_response.tutor_signature);

    console.log("New PDF path")
    console.log(signed_pdf_path);

    //Send 2 emails
    functions.send_email_with_agreement({ student: { student_name: update_post_agreement_status_response.std_name, student_email: update_post_agreement_status_response.std_email, student_email_subject: 'NOREPLY - Agreement accepted successfully', student_email_body: "You have successfully accepted the agreement for the '" + update_post_agreement_status_response.post_title + "' tutorial. Your tutorial is scheduled for " + update_post_agreement_status_response.tutorial_date + " at " + update_post_agreement_status_response.tutorial_time + " in room " + update_post_agreement_status_response.tutorial_room + "." }, tutor: { tutor_name: update_post_agreement_status_response.post_tutor_name, tutor_email: update_post_agreement_status_response.post_tutor_email, tutor_email_subject: 'NOREPLY - Agreement accepted successfully', tutor_email_body: "The student " + update_post_agreement_status_response.std_name + " has accepted your offered agreement for the '" + update_post_agreement_status_response.post_title + "' tutorial. The tutorial is scheduled for " + update_post_agreement_status_response.tutorial_date + " at " + update_post_agreement_status_response.tutorial_time + " in room " + update_post_agreement_status_response.tutorial_room + "." }, agreement_url: signed_pdf_path.response, agreement_name: signed_pdf_path.response.substring(15) });

    //Create 2 notifications
    //SEND VIA WEBSOCKET!!!!!!
    let notification_response_tutor = await database_connection.create_notification("Agreement accepted", "The student '" + update_post_agremeent_url_response.std_name + "' has accepted your agreement for the '" + update_post_agremeent_url_response.post_title + "' tutorial. You can view the agreement by clicking the button below. Your tutorial is scheduled for " + update_post_agreement_status_response.tutorial_date + " at " + update_post_agreement_status_response.tutorial_time + " in room " + update_post_agreement_status_response.tutorial_room + ".", update_post_agreement_status_response.post_tutor_email, ["Tutorial agreement accepted"], { post_id: post_id });
    let notification_response_student = await database_connection.create_notification("Agreement accepted", "You have accepted the agreement offered by your tutor '" + update_post_agremeent_url_response.post_tutor_name + "'. Please note that the tutorial is scheduled for " + update_post_agreement_status_response.tutorial_date + " at " + update_post_agreement_status_response.tutorial_time + " in room " + update_post_agreement_status_response.tutorial_room + ". You can view the agreement by clicking the button below.", update_post_agreement_status_response.std_email, ["Tutorial agreement accepted"], { post_id: post_id });
    database_connection.disconnect();

    return { error: false, response: "Agreement sent successfully", updated_tutorial: update_post_agremeent_url_response, tutor_notification: notification_response_tutor, student_notification: notification_response_student };
}

exports.accept_agreement = accept_agreement;




