let verify_digital_signatures = async function verify_digital_signatures(database_connection, data) {
    //Declare all libraries we need
    const Digital_Signature = require('./Digital_Signature');
    const signature_controller = new Digital_Signature();

    let student_digital_certificate;
    let tutor_digital_certificate;

    //Object containing all needed resources for digital signing such as tutor and student digital certificates
    let data_verify;

    if (data.verify_single) {
        tutor_digital_certificate = await database_connection.get_digital_certificate_details(data.tutor_email);

        data_verify = {party_1_digital_certificate: {digital_certificate: tutor_digital_certificate.certificate_path, digital_certificate_password: tutor_digital_certificate.certificate_password}};
    } else {
        tutor_digital_certificate = await database_connection.get_digital_certificate_details(data.tutor_email);
        student_digital_certificate = await database_connection.get_digital_certificate_details(data.student_email);

        data_verify = {party_1_digital_certificate: {digital_certificate: tutor_digital_certificate.certificate_path, digital_certificate_password: tutor_digital_certificate.certificate_password}, party_2_digital_certificate: {digital_certificate: student_digital_certificate.certificate_path, digital_certificate_password: student_digital_certificate.certificate_password}};
    }

    console.log(data_verify)

   let response = await signature_controller.verify_digital_signature(data.pdf, data_verify);
   return response;
}

exports.verify_digital_signatures = verify_digital_signatures;





