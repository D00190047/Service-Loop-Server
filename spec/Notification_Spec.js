let database = require('../services/database')

describe('Get all users notifications', function () {
    beforeEach(function() { 
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    afterEach(function() {
        const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        database_connection.disconnect();
    });

    it('should return an object with all the users notifications', async function (done) {
        const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        let db_con_response = await database_connection.connect();

        let modules_array = ["PHP, JavaScript"];
        await database_connection.create_notification("Tutorial request sent", "You have requested tutorial for " + modules_array.join(', ') + ". A tutor will be in contact via email", "D00192082@student.dkit.ie", ["Tutorial request sent"], { post_id: "post._id", modules: ["PHP, JavaScript"] });
        let test_1_result = await database_connection.get_all_users_notifications("D00192082@student.dkit.ie", {is_tutor: false, user_modules: []});
        expect(test_1_result.error).toBe(false);
        done();
    });

    it('should set the status of a notification as opened', async function (done) { 
        const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        let db_con_response = await database_connection.connect();

        let test_2_result = await database_connection.set_notification_to_read("5e04f1381c9d4400004e9e75");
        
        expect(test_2_result).toBe("Notification updated successfully!");
        done();
    });
});

describe('Get all users notifications', function () {
    beforeEach(function() { 
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    afterEach(function() {
        const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        database_connection.disconnect();
    });

    it('should return a message when there are no notifications to display', async function (done) {
        
        const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        let db_con_response = await database_connection.connect();
        
        await database_connection.delete_notifications_by_email("D00192082@student.dkit.ie");
        let test_3_result = await database_connection.get_all_users_notifications("D00192082@student.dkit.ie", {is_tutor: false, user_modules: []});

        expect(test_3_result.response).toBe("There are no notifications to display!");
        done();
    });

    it('should return a message when there are notifications to display for a student user', async function (done) {
        
        const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        let db_con_response = await database_connection.connect();
        
        let modules_array = ["PHP, JavaScript"];
        await database_connection.create_notification("Tutorial request sent", "You have requested tutorial for " + modules_array.join(', ') + ". A tutor will be in contact via email", "D00192082@student.dkit.ie", ["Tutorial request sent"], { post_id: "post._id", modules: ["PHP, JavaScript"] });
        //await database_connection.create_notification_for_tutors("New tutorial request", "D00192082@student.dkit.ie" + " requested a tutorial for the " + modules_array.join(', ') + "modules. Please see the post in context.", ["Tutorial requested"], ["PHP, JavaScript"], "post._id");
        let test_3_result = await database_connection.get_all_users_notifications("D00192082@student.dkit.ie", {is_tutor: false, user_modules: []});

        await database_connection.delete_notifications_by_email("D00192082@student.dkit.ie");
        //await database_connection.delete_notifications_by_modules(["JavaScript", "PHP"]);

        expect(test_3_result.error).toBe(false);
        done();
    });

    it('should return a message when there are no notifications to display for a tutor user', async function (done) {
        
        const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        let db_con_response = await database_connection.connect();
        
        let modules_array = ["PHP, JavaScript"];
        //await database_connection.create_notification("Tutorial request sent", "You have successfully requested a tutorial to cover " + modules_array.join(', ') + ". A tutor will be in contact with you as soon as possible.", "D00192082@student.dkit.ie", ["Tutorial request sent"], { post_id: "post._id", modules: ["PHP, JavaScript"] });
        //await database_connection.create_notification_for_tutors("New tutorial request", "D00192082@student.dkit.ie" + " requested a tutorial for the " + modules_array.join(', ') + "modules. Please see the post in context.", ["Tutorial requested"], ["PHP, JavaScript"], "post._id");
        
        await database_connection.delete_notifications_by_email("D00192082@student.dkit.ie");
        let test_4_result = await database_connection.get_all_users_notifications("D00192082@student.dkit.ie", {is_tutor: true, user_modules: []});

        await database_connection.delete_notifications_by_email("D00192082@student.dkit.ie");
        //await database_connection.delete_notifications_by_modules(["JavaScript", "PHP"]);

        expect(test_4_result.response).toBe("There are no notifications to display!");
        done();
    });

    it('should return no error when there are "Tutorial Request Sent" notifications to display for a tutor user', async function (done) {
        
        const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        let db_con_response = await database_connection.connect();
        
        let modules_array = ["PHP, JavaScript"];
        await database_connection.create_notification("Tutorial request sent", "Tutorial request sent", "You have requested tutorial for " + modules_array.join(', ') + ". A tutor will be in contact via email", ["Tutorial request sent"], { post_id: "post._id", modules: ["PHP, JavaScript"] });
        await database_connection.create_notification_for_tutors("New tutorial request", "D00192082@student.dkit.ie", "D00192082@student.dkit.ie" + " requested a tutorial for the " + modules_array.join(', ') + "modules. Please see the post in context.", ["Tutorial requested"], ["PHP, JavaScript"], "post._id");
        
        //await database_connection.delete_notifications_by_email("D00192082@student.dkit.ie");
        let test_4_result = await database_connection.get_all_users_notifications("D00192082@student.dkit.ie", {is_tutor: true, user_modules: ["PHP, JavaScript"]});

        await database_connection.delete_notifications_by_email("D00192082@student.dkit.ie");
        //await database_connection.delete_notifications_by_modules(["JavaScript", "PHP"]);

        expect(test_4_result.error).toBe(false);
        done();
    });

    it('should return no error when there are NO "Tutorial requested" notifications to display for a tutor user', async function (done) {
        
        const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        let db_con_response = await database_connection.connect();
        
        let modules_array = ["PHP, JavaScript"];
        await database_connection.create_notification("Tutorial request sent", "Tutorial request sent", "You have requested tutorial for " + modules_array.join(', ') + ". A tutor will be in contact via email", "D00192082@student.dkit.ie", ["Tutorial request sent"], { post_id: "post._id", modules: ["PHP, JavaScript"] });
        await database_connection.create_notification_for_tutors("New tutorial request", "D00192082@student.dkit.ie", "D00192082@student.dkit.ie" + " requested a tutorial for the " + modules_array.join(', ') + "modules. Please see the post in context.", ["Tutorial requested"], ["PHP, JavaScript"], "post._id");
        
        //await database_connection.delete_notifications_by_email("D00192082@student.dkit.ie");
        let test_4_result = await database_connection.get_all_users_notifications("D00192082@student.dkit.ie", {is_tutor: true, user_modules: ["PHP, JavaScript"]});

        await database_connection.delete_notifications_by_email("D00192082@student.dkit.ie");
        //await database_connection.delete_notifications_by_modules(["JavaScript", "PHP"]);

        expect(test_4_result.error).toBe(false);
        done();
    });

    it('should return no error when there are "Tutorial requested" notifications to display for a tutor user', async function (done) {
        
        const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        let db_con_response = await database_connection.connect();
        
        let modules_array = ["PHP, JavaScript"];
        await database_connection.create_notification("Tutorial request sent", "Tutorial request sent", "You have requested tutorial for " + modules_array.join(', ') + ". A tutor will be in contact via email", ["Tutorial request sent"], { post_id: "post._id", modules: ["PHP, JavaScript"] });
        await database_connection.create_notification_for_tutors("New tutorial request", "D00192082@student.dkit.ie", "D00192082@student.dkit.ie" + " requested a tutorial for the " + modules_array.join(', ') + "modules. Please see the post in context.", ["Tutorial requested"], ["PHP, JavaScript"], "post._id");
        
        //await database_connection.delete_notifications_by_email("D00192082@student.dkit.ie");
        let test_4_result = await database_connection.get_all_users_notifications("D00192082@student.dkit.ie", {is_tutor: true, user_modules: ["PHP, JavaScript"]});

        //await database_connection.delete_notifications_by_email("D00192082@student.dkit.ie");
        await database_connection.delete_notifications_by_modules(["JavaScript", "PHP"]);

        expect(test_4_result.error).toBe(false);
        done();
    });
}); 

describe('Get all notifications that a user is elegible for', function () {
    beforeEach(function() { 
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    afterEach(function() {
        const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        database_connection.disconnect();
    });

    it('should return no error', async function (done) {
        
        const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        let db_con_response = await database_connection.connect();
        
        let modules_array = ["PHP, JavaScript"];
        
        await database_connection.create_notification("Tutorial request sent", "Tutorial request sent", "You have requested tutorial for " + modules_array.join(', ') + ". A tutor will be in contact via email", "D00192082@student.dkit.ie", ["Tutorial request sent"], { post_id: "post._id", modules: ["PHP, JavaScript"] });
        await database_connection.create_notification_for_tutors("New tutorial request", "D00192082@student.dkit.ie", "D00192082@student.dkit.ie" + " requested a tutorial for the " + modules_array.join(', ') + "modules. Please see the post in context.", ["Tutorial requested"], ["PHP, JavaScript"], "post._id");
        
        let test_1_result = await database_connection.get_all_elegible_posts("D00192082@student.dkit.ie", ["PHP", "Maths"]); 
console.log(test_1_result);
        await database_connection.delete_notifications_by_email("D00192082@student.dkit.ie");
        await database_connection.delete_notifications_by_modules(["JavaScript", "PHP"]);

        expect(test_1_result.error).toBe(false);
        done();
    });
});