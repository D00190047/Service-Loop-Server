class Live_Updates {
    constructor(server, app) {
        //For debugging purposes, if on localhost, we use a different way of initializing the websockets
        if (global.localhost) {
            server = require('http').Server(app);
            this.socket = require('socket.io')(server);
            server.listen(80);
        } else {
            this.socket = require('socket.io').listen(server);
            this.socket.set("origins", "*:*");
        }

        this.users_connected = [];
    }

    connect() {
        this.socket.on('connection', (socket) => {
            if (!this.users_connected.filter((e) => { return e.email === socket.handshake.query.email; }).length > 0) {
                this.users_connected.push({ socket_id: socket.id, email: socket.handshake.query.email, modules: JSON.parse(socket.handshake.query.modules) });
            } else {

                for (let i = 0; i < this.users_connected.length; i++) {
                    if (socket.handshake.query.email === this.users_connected[i].email) {
                        this.users_connected[i].email = socket.handshake.query.email;
                        this.users_connected[i].socket_id = socket.id;
                        this.users_connected[i].modules = JSON.parse(socket.handshake.query.modules);
                    }
                }
            }
            socket.emit('news', { hello: 'connected', users: this.users_connected });

            socket.on('send_notification', (data) => {
                this.send_notification(socket, data)
            });

            socket.on('new_tutorial', (data) => {
                this.send_tutorial(socket, data)
            });

            socket.on('tutorial_request_accepted', (data) => {
                this.sendTutorialAcceptedNotification(socket, data);
            });

            socket.on('agreement_generated', (data) => {
                this.sendAgreementGeneratedNotification(socket, data);
            });

            socket.on('agreement_rejected', (data) => {
                this.sendAgreementRejectedNotification(socket, data);
            });

            socket.on('agreement_accepted', (data) => {
                this.sendAgreementAcceptedNotification(socket, data);
            });

            socket.on('begin_tutorial', (data) => {
                this.sendBeginTutorialNotification(socket, data);
            });

            socket.on('finish_tutorial', (data) => {
                this.sendFinishTutorialNotification(socket, data);
            });

            socket.on('send_rate_tutor', (data) => {
                this.sendRateTutor(socket, data);
            });

            //Update the socket once a user becomes a tutor (add modules)
            socket.on('update_socket', (data) => {
                for (let i = 0; i < this.users_connected.length; i++) {
                    if (this.users_connected[i].email === data.user_email) {
                        this.users_connected[i].modules = data.user_modules;
                    }
                }
            });

            // socket.on('disconnect', (reason) => {
            //   socket.emit('news', { hello: reason});

            //   for(let i = 0; i < users_connected.length; i++) {
            //     if(users_connected[i])
            //   }
            //   if (users_connected.filter(function (e) { return e.email === socket.handshake.query.email; }).length > 0) {
            //     users_connected.remove('seven');
            //   } 
            // });
        });
    }

    sendRateTutor(socket, data) {
        console.log("Rate tutor")
        console.log(data)
        for (let i = 0; i < this.users_connected.length; i++) {
            if (this.users_connected[i].email === data.the_post.post_tutor_email) {
                console.log("Being sent!")
                socket.to(this.users_connected[i].socket_id).emit("tutor_update_rating", { rating: data.the_rating, post: data.the_post });
            }
        }
    }

    sendBeginTutorialNotification(socket, data) {
        for (let i = 0; i < this.users_connected.length; i++) {
            if (this.users_connected[i].email === data.the_notification.std_email) {
                socket.to(this.users_connected[i].socket_id).emit("tutorial_has_begun", { response: data.the_notification, post: data.the_post });
            }
        }
    }

    sendFinishTutorialNotification(socket, data) {
        for (let i = 0; i < this.users_connected.length; i++) {
            if (this.users_connected[i].email === data.the_notification.std_email) {
                socket.to(this.users_connected[i].socket_id).emit("tutorial_has_finished", { response: data.the_notification, post: data.the_post });
            }
        }
    }

    send_notification(socket, data) {
        let elegible_users = [];
        console.log(data);
        for (let i = 0; i < this.users_connected.length; i++) {
            //some(..) checks each element of the array against a test function and returns true if any element of the array passes the test function, otherwise, it returns false. 
            //indexOf(..) >= 0 and includes(..) both return true if the given argument is present in the array.
            console.log(this.users_connected[i].modules);

            for (let j = 0; j < this.users_connected[i].modules.length; j++) {
                if (this.users_connected[i].modules[j] === data.the_notification.notification_modules[0]) {
                    elegible_users.push(this.users_connected[i]);
                }
            }
        }

        console.log("Elegible users");
        console.log(elegible_users);

        for (let i = 0; i < elegible_users.length; i++) {
            //socket.emit('news', { hello: elegible_users, socket_id: elegible_users[i].socket_id });
            socket.to(elegible_users[i].socket_id).emit("new_notification", { response: data.the_notification, post: data.the_post });
        }

        //socket.emit('news', { hello: elegible_users });
    }

    send_tutorial(socket, data) {
        const Push_Notifications = require('./Push_Notifications');
        const push_controller = new Push_Notifications("c08fd8bd-bfbf-4dd3-bc07-61d214842ccd", "MGMxYzc3NjEtZjFkOC00MmIwLTkyYmMtMzVmMjgzZDg4MzM2");

        let elegible_users = [];
        console.log("Push data")
        console.log(data);
        for (let i = 0; i < this.users_connected.length; i++) {
            for (let j = 0; j < this.users_connected[i].modules.length; j++) {
                if (this.users_connected[i].modules[j] === data.response[0].post_modules[0] && this.users_connected[i].email !== data.response[0].std_email) {
                    elegible_users.push(this.users_connected[i]);
                }
            }
        }

        for (let i = 0; i < elegible_users.length; i++) {
            console.log(elegible_users[i].email)
            //socket.emit('news', { hello: elegible_users, socket_id: elegible_users[i].socket_id });
            push_controller.push("New " + data.response[0].post_modules[0] + " tutorial", "A new " + data.response[0].post_modules[0] + " tutorial has been created. Please check the forum.", elegible_users[i].email, "New tutorial request", data.response[2], data.response[0]);
            socket.to(elegible_users[i].socket_id).emit("new_tutorial_request", { response: data.response[0] });
        }
    }

    sendTutorialAcceptedNotification(socket, data) {
        console.log("Test acceptedd")
        console.log(data);

        for (let i = 0; i < this.users_connected.length; i++) {
            if (this.users_connected[i].email === data.the_notification.response.std_email) {
                socket.to(this.users_connected[i].socket_id).emit("add_tutorial_request_accepted_notification", { response: data.the_notification.response, post: data.the_post });
            }
        }
    }

    sendAgreementGeneratedNotification(socket, data) {
        console.log("Agreement generated!")
        console.log(data);

        for (let i = 0; i < this.users_connected.length; i++) {
            if (this.users_connected[i].email === data.the_notification.response.std_email) {
                console.log("work")
                socket.to(this.users_connected[i].socket_id).emit("add_agreement_created_notification", { response: data.the_notification.response, post: data.the_post });
            }
        }
    }

    sendAgreementRejectedNotification(socket, data) {
        console.log("Rejected")
        console.log(this.users_connected)
        console.log(data);

        for (let i = 0; i < this.users_connected.length; i++) {
            if (this.users_connected[i].email === data.the_post.post_tutor_email) {
                console.log("Send rejected")
                socket.to(this.users_connected[i].socket_id).emit("agreement_rejected_tutor", { response: data.the_notification.response, post: data.the_post });
            }
        }
    }

    sendAgreementAcceptedNotification(socket, data) {
        console.log("Accepted!!!")
        console.log(this.users_connected)
        console.log(data);

        for (let i = 0; i < this.users_connected.length; i++) {
            if (this.users_connected[i].email === data.the_post.post_tutor_email) {
                console.log("Send acceoted")
                socket.to(this.users_connected[i].socket_id).emit("agreement_accepted_tutor", { response: data.the_notification.response, post: data.the_post });
            }
        }
    }
}

module.exports = Live_Updates;