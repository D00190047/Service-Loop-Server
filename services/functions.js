/**
 * A function that sends an email containing the Digitally and Electronically signed agreement
 * to both student and tutor using the information supplied in the email_object
 * 
 * @param {Object} email_object - TBA
 * 
 * @returns {Null} - This function does not return anything
 */
let send_email_with_agreement = function send_email_with_agreement(email_object) {
    const nodemailer = require('nodemailer');
    const path = require('path');
    let base_path;

    //For debugging purposes, if on localhost, we use a different path
    if (global.localhost) {
        base_path = '';
    } else {
        base_path = path.join(__dirname, '../');
    }

    const client = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 465,
        secure: true,
        auth: {
            user: '',
            pass: ''
        }
    });

    let date = new Date();
    let today = date.getDate() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getFullYear();

    let email = {
        from: 'D00192082@student.dkit.ie',
        to: email_object.student.student_email,
        subject: email_object.tutor.tutor_email_subject,
        //text: 'Hello world',
        html: '<table style="font-family: Open Sans, sans-serif;font-size:100%;font-weight:400;line-height:1.4;max-width:670px;margin:50px auto 10px;background-color:#fff;padding:50px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px; border-bottom: solid 1px #d9d9d9;border-right: solid 1px #d9d9d9;border-left: solid 1px #d9d9d9;border-top: solid 10px #4756c6;"> <thead> <tr> <th style="text-align:left;"><a href="#"><img style="max-width: 100px;" src="https://d00192082.alwaysdata.net/ServiceLoopServer/resources/images/email_logo.png" alt="Service Loop"></a></th> <th style="text-align:right;font-weight:400;">' + today + '</th> </tr></thead> <tbody> <tr> <td style="height:35px;"></td></tr><tr> <td style="width:50%;padding:20px;vertical-align:top"> <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Email</span> ' + email_object.student.student_email + '</p></td><td style="width:50%;padding:20px;vertical-align:top"> <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Name</span> ' + email_object.student.student_name + '</p></td></tr><tr> <td colspan="2" style="font-size:20px;padding:30px 15px 0 15px;">Message</td></tr><tr> <td colspan="2" style="padding:15px"> <p style="font-size:14px;margin:0;padding:10px;border:solid 1px #ddd;font-weight:bold"> <span style="display:block;font-size:13px;font-weight:normal"><b>Registration complete! </b><br><span style="display:block;font-size:13px;font-weight:normal">' + email_object.student.student_email_body + '</span> <br> </p></td></tr></tbody> <tfooter> <tr> <td colspan="5" style="text-align: center;"> <a href="#"><img style="max-width: 350px;" src="https://d00192082.alwaysdata.net/ServiceLoopServer/resources/images/email_footer.png" alt="Service Loop Logo"></a> </td></tr></tfooter> </table>',
        attachments: [
            {
                filename: email_object.agreement_name,
                path: base_path + email_object.agreement_url,
                contentType: 'application/pdf'
            }]
    };

    client.sendMail(email, function (err, info) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Message sent: ' + info.response);
        }
    });

    email = {
        from: 'D00192082@student.dkit.ie',
        to: email_object.tutor.tutor_email,
        subject: email_object.student.student_email_subject,
        //text: 'Hello world',
        html: '<table style="font-family: Open Sans, sans-serif;font-size:100%;font-weight:400;line-height:1.4;max-width:670px;margin:50px auto 10px;background-color:#fff;padding:50px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px; border-bottom: solid 1px #d9d9d9;border-right: solid 1px #d9d9d9;border-left: solid 1px #d9d9d9;border-top: solid 10px #4756c6;"> <thead> <tr> <th style="text-align:left;"><a href="#"><img style="max-width: 100px;" src="https://d00192082.alwaysdata.net/ServiceLoopServer/resources/images/email_logo.png" alt="Service Loop"></a></th> <th style="text-align:right;font-weight:400;">' + today + '</th> </tr></thead> <tbody> <tr> <td style="height:35px;"></td></tr><tr> <td style="width:50%;padding:20px;vertical-align:top"> <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Email</span> ' + email_object.tutor.tutor_email + '</p></td><td style="width:50%;padding:20px;vertical-align:top"> <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Name</span> ' + email_object.tutor.tutor_name + '</p></td></tr><tr> <td colspan="2" style="font-size:20px;padding:30px 15px 0 15px;">Message</td></tr><tr> <td colspan="2" style="padding:15px"> <p style="font-size:14px;margin:0;padding:10px;border:solid 1px #ddd;font-weight:bold"> <span style="display:block;font-size:13px;font-weight:normal"><b>Registration complete! </b><br><span style="display:block;font-size:13px;font-weight:normal">' + email_object.tutor.tutor_email_body + '</span> <br> </p></td></tr></tbody> <tfooter> <tr> <td colspan="5" style="text-align: center;"> <a href="#"><img style="max-width: 350px;" src="https://d00192082.alwaysdata.net/ServiceLoopServer/resources/images/email_footer.png" alt="Service Loop Logo"></a> </td></tr></tfooter> </table>',
        attachments: [
            {
                filename: email_object.agreement_name,
                path: base_path + email_object.agreement_url,
                contentType: 'application/pdf'
            }]
    };

    client.sendMail(email, function (err, info) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Message sent: ' + info.response);
        }
    });
}

/**
 * A function that create a binding agreement between two parties (Student and Tutor)
 * 
 * @param {Object} tutorial_information - TBA
 * @param {Object} signatures - TBA
 * @param {Object} post - TBA
 * @param {Boolean} student_signed - TBA
 * 
 * @returns {Promise} - TBA
 */
let create_agreement_pdf = function create_agreement_pdf(tutorial_information, signatures, post, student_signed = false) {
    const fs = require('fs');
    const path = require('path');
    let base_path;

    //For debugging purposes, if on localhost, we use a different path
    if (global.localhost) {
        base_path = '.'; 
    } else {
        base_path = path.join(__dirname, '../');
    }

    let today = new Date();
    let signed_on = today.getDate() + "/" + parseInt(today.getMonth() + 1) + "/" + today.getFullYear();

    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();

    return new Promise((resolve, reject) => {
        doc.fontSize(26);
        doc.font('Times-Roman');
        //add title 
        doc.image(base_path + "/resources/images/agreement_logo.png", 10, 15,
            {
                scale: 0.4
            }) + doc.text(" Tutorial Agreement Contract", {
                width: 450,
                align: 'center'

            }
            );

        doc.fontSize(11);
        //add destription
        doc.moveDown();
        doc.text("This contract is to completed and signed by Tutor and Student, to indicate that an agreement has been made to facilitate student-tutoring service in accordance with Dundalk Institute of Technology guidelines.", {
            width: 450,
            align: 'left'
        }
        );

        doc.moveDown();
        doc.fontSize(11);
        // std_table
        // .setColumnsDefaults({
        //     headerBorder: 'B',
        //     align: 'centre'   
        // })
        // // add table columns
        // .addColumns([
        //     {
        //         id: 'tutorial_title',
        //         header: 'Tutorial title',
        //         width: 100,
        //         height: 20

        //     },
        //     {
        //         id: 'tutorial_desc',
        //         header: 'Tutorial Description',
        //         width: 250,
        //         height: 20
        //     },
        //     {
        //         id: 'tutorial_module',
        //         header: 'Tutorial module',
        //         width: 90,
        //         height: 20

        //     }
        // ]);

        // std_table.addBody([
        //     {tutorial_title: "Java Script",tutorial_desc: " Help need with For Loops and if statements",tutorial_module:"Object Orientated Programming"}
        // ]);
        doc.fontSize(16);
        doc.font('Times-Bold');
        doc.text(" Tutorial Details", {
            width: 450,
            align: 'left'
        });
        doc.font('Times-Roman');
        doc.fontSize(11);
        doc.moveDown();

        doc.text(" Tuturoial Title: " + post.post_title + "\n\n Tutorial Description: " + post.post_desc + "\n\n Tutorial Module: " + post.post_modules[0], {
            width: 450,
            align: 'left'
        });
        doc.moveDown();
        doc.text(" Tuturoial will take place in P1204 of Carrols Building on the " + tutorial_information.tutorial_date + " at " + tutorial_information.tutorial_time + " (24hr)", {
            width: 450,
            align: 'left'
        });
        //Write Table
        //doc.pipe(writeStream);
        //line to the middle
        doc.moveDown();

        doc.fontSize(16);
        doc.font('Times-Bold');
        doc.text(" Student Details", {
            width: 450,
            align: 'left'
        });
        doc.font('Times-Roman');
        doc.fontSize(11);

        doc.moveDown();
        doc.text(" Student Name: " + post.std_name, {
            width: 450,
            align: 'left'
        });
        doc.text(" Student Email: " + post.std_email, {
            width: 450,
            align: 'left'
        });
        doc.moveDown();

        if (student_signed) {
            doc.text(" Signed: " + "\n ") + doc.image(signatures.student_signature, {
                scale: 0.30,
                align: 'left'
            }
            );
        }

        doc.rect(doc.x, 160, 500, doc.y).stroke();
        doc.moveDown();

        doc.fontSize(16);
        doc.font('Times-Bold');
        doc.text(" Tutor Details", {
            width: 450,
            align: 'left'
        });
        doc.moveDown();

        doc.font('Times-Roman');
        doc.fontSize(11);
        doc.text(" Tutor Name: " + post.post_tutor_name, {
            width: 450,
            align: 'left'
        });
        doc.text(" Tutor Email: " + post.post_tutor_email, {
            width: 450,
            align: 'left'
        });
        doc.moveDown();
        //add the image
        doc.text(" Signed: " + "\n ") + doc.image(signatures.tutor_signature, {
            scale: 0.30,
            align: 'left'
        }
        );
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();
        doc.fontSize(10);
        doc.text("Date Signed: " + signed_on, {
            width: 500,
            align: 'left'

        }
        );
        doc.moveDown();
        doc.fontSize(10);
        doc.text("Please be aware by signing this document you are confirming the details of this agrangement is correct and constenting to Service Loops Terms & Conditions.", {
            width: 500,
            align: 'centre'

        }
        );
        doc.end();

        let writeStream = doc.pipe(fs.createWriteStream(base_path + '/resources/pdfs/agreement_' + post._id + '.pdf'));

        writeStream.on('error', function (err) {
            if (err.code === 'ENOENT') {
                resolve(err);
            } else {
                resolve(err);
                console.log(err);
            }
        });

        writeStream.on('finish', function () {

            resolve({ pdf_name: "agreement_" + post._id + ".pdf", pdf_path: "resources/pdfs/agreement_" + post._id + ".pdf" });
        });
    });
}


module.exports = {
    send_email_with_agreement,
    create_agreement_pdf
}