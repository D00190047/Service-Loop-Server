let update_avatar = async function update_avatar(database_connection, user_email, base64_image) {

    return new Promise((resolve, reject) => {
        const path = require('path');
        let base_path;

        if (global.localhost) {
            base_path = '';
        } else {
            base_path = path.join(__dirname, '../');
        }

        require("fs").writeFile(base_path + "resources/images/" + user_email + ".jpg", base64_image, 'base64', async function (err) {
            let response = await database_connection.update_user(user_email, { user_avatar: "https://d00192082.alwaysdata.net/ServiceLoopServer/resources/images/" + user_email + ".jpg" });
            database_connection.disconnect();
            resolve("https://d00192082.alwaysdata.net/ServiceLoopServer/resources/images/" + user_email + ".jpg");
        });
    });


}

exports.update_avatar = update_avatar;