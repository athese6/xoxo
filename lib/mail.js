const path = require('path');
const Promise = require('bluebird');
const config = require('./config');
const sendgrid = require('sendgrid')(config.sendgrid.key);
const ejs = require('ejs');
const MailType = require("../server/models/constants").MailType;

module.exports = {
    add_unsubscribe: (email, isEssential = false) => {
        const options = {
            "method": "POST",
            "hostname": sendgrid.endpoint,
            "port": null,
            "path": `/v3/asm/groups/${isEssential ? sendgrid.group.essential_id : sendgrid.group.letter_id}/suppressions`,
            "headers": {
                "authorization": `Bearer ${sendgrid.key}`,
                "content-type": "application/json"
            }
        };
        const req = http.request(options, function (res) {
            const chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                const body = Buffer.concat(chunks);
                console.log(body.toString());
            });
        });
        req.write(JSON.stringify({recipient_emails: [email]}));
        req.end();
    },
    remove_unsubscribe: (email, isEssential = false) => {
        // after deleteAccount
        const options = {
            "method": "DELETE",
            "hostname": sendgrid.endpoint,
            "port": null,
            "path": `/v3/asm/groups/${isEssential ? sendgrid.group.essential_id : sendgrid.group.letter_id}/suppressions/${email}`,
            "headers": {
                "authorization": `Bearer ${sendgrid.key}`
            }
        };
        const req = http.request(options, function (res) {
            const chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                const body = Buffer.concat(chunks);
                console.log(body.toString());
            });
        });
        req.write("null");
        req.end();
    },
    get_unsubscribe: (email, isEssential = false) => {
        // after login
        const options = {
            "method": "POST",
            "hostname": sendgrid.endpoint,
            "port": null,
            "path": `/v3/asm/groups/${isEssential ? sendgrid.group.essential_id : sendgrid.group.letter_id}/suppressions/search`,
            "headers": {
                "authorization": `Bearer ${sendgrid.key}`,
                "content-type": "application/json"
            }
        };
        const req = http.request(options, function (res) {
            const chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                const body = Buffer.concat(chunks);
                console.log(body.toString());
            });
        });
        req.write(JSON.stringify({recipient_emails: [email]}));
        req.end();
    },
    send: (to, from, subject, templateName, data) => {
        const template = path.join(config.getRoot(), config.mail.templates, templateName + ".ejs");
        const email = new sendgrid.Email();
        let tos = [];
        if (typeof to === "string") {
            tos.push(to);
        } else {
            tos = to;
        }

        email.setTos(tos);
        email.setFrom(from);
        email.setFromName("Sunshine Studio");
        if (data.content === "shared-files" || data.content === "invited-team") {
            email.setASMGroupID(config.sendgrid.group.letter_id);
        } else {
            email.addFilter('subscriptiontrack', 'enable', 0);
        }
        email.setSubject(subject);
        return new Promise((resolve, reject) => {
            ejs.renderFile(template, data, (err, str) => {
                if (err) {
                    return reject(err);
                }
                email.setHtml(str);
                sendgrid.send(email, (err, json) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve({
                        tos: tos,
                        from: from,
                        subject: subject,
                        template: template,
                        data: data
                    });
                });
            });
        });
    },
    getLang: (res, type) => {
        let lang = {};
        if (!res)
            return lang;
        // if (type == MailType.welcome) {
        //     lang["[Sunshine Studio] Welcome! Start by downloading Studio app!"] = res.__("[Sunshine Studio] Welcome! Start by downloading Studio app!");
        //     lang["Invite your team, clients, and freelancers to start your studio!"] = res.__("Invite your team, clients, and freelancers to start your studio!");
        //     lang["Freely share multi-GB files and efficiently communicate with collaborators."] = res.__("Freely share multi-GB files and efficiently communicate with collaborators.");
        //     lang["Download Desktop App"] = res.__("Download Desktop App");
        //     lang["You can enjoy the full features of Sunshine Studio within the computer app."] = res.__("You can enjoy the full features of Sunshine Studio within the computer app.");
        //     lang["Sunshine Studio"] = res.__("Sunshine Studio");
        //     lang["Messenger for Creators. Share big files and big ideas!"] = res.__("Messenger for Creators. Share big files and big ideas!");
        //     lang["Please, open in desktop."] = res.__("Please, open in desktop.");
        //     lang["Watch Intro Video"] = res.__("Watch Intro Video");
        //     lang["Visit Our Website"] = res.__("Visit Our Website");
        // } else if (type == MailType.confirm_change_password) {
        //     lang["[Sunshine Studio]Confirm Change Password"] = res.__("[Sunshine Studio]Confirm Change Password");
        //     lang["Hi"] = res.__("Hi");
        //     lang["Your Sunshine Studio account password was recently changed through a reset link."] = res.__("Your Sunshine Studio account password was recently changed through a reset link.");
        //     lang["See this Help Center article for more information."] = res.__("See this Help Center article for more information.");
        //     lang["If you didn't make this change, please contact us. studio@sunshineapp.com"] = res.__("If you didn't make this change, please contact us. studio@sunshineapp.com");
        //     lang["Sunshine Studio!"] = res.__("Sunshine Studio!");
        // } else if (type == MailType.confirmation) {
        //     lang["[Sunshine Studio] Email Confirmation for Sign Up :)"] = res.__("[Sunshine Studio] Email Confirmation for Sign Up :)");
        //     lang["Welcome to Sunshine Studio!"] = res.__("Welcome to Sunshine Studio!");
        //     lang["Hi"] = res.__("Hi");
        //     lang["Since the privacy and the security of your files are the utmost important priority, we need to confirm your email address. Simply click the button below :)"] = res.__("Since the privacy and the security of your files are the utmost important priority, we need to confirm your email address. Simply click the button below :)");
        //     lang["Confirm Email"] = res.__("Confirm Email");
        //     lang["Sunshine Studio"] = res.__("Sunshine Studio");
        //     lang["Messenger for Creators. Share big files and big ideas!"] = res.__("Messenger for Creators. Share big files and big ideas!");
        //     lang["Please, open in desktop."] = res.__("Please, open in desktop.");
        //     lang["Watch Intro Video"] = res.__("Watch Intro Video");
        //     lang["Visit Our Website"] = res.__("Visit Our Website");
        // } else if (type == MailType.forgot_your_password) {
        //     lang["[Sunshine Studio]Reset your Sunshine Studio password"] = res.__("[Sunshine Studio]Reset your Sunshine Studio password");
        //     lang["Hi"] = res.__("Hi");
        //     lang["Someone recently requested a password change for your Sunshine Studio account. If this was you, you can set a new password by clicking the button below."] = res.__("Someone recently requested a password change for your Sunshine Studio account. If this was you, you can set a new password by clicking the button below.");
        //     lang["Reset Password"] = res.__("Reset Password");
        //     lang["If you don't want to change your password or didn't request this, just ignore and delete this message."] = res.__("If you don't want to change your password or didn't request this, just ignore and delete this message.");
        //     lang["To keep your account secure, please don't forward this email to anyone. See our Help Center for more information."] = res.__("To keep your account secure, please don't forward this email to anyone. See our Help Center for more information.");
        //     lang["Sunshine Studio - No more wasting time. No more size limit."] = res.__("Sunshine Studio - No more wasting time. No more size limit.");
        //     lang["Sunshine Studio"] = res.__("Sunshine Studio");
        //     lang["Messenger for Creators. Share big files and big ideas!"] = res.__("Messenger for Creators. Share big files and big ideas!");
        //     lang["Please, open in desktop."] = res.__("Please, open in desktop.");
        //     lang["Watch Intro Video"] = res.__("Watch Intro Video");
        //     lang["Visit Our Website"] = res.__("Visit Our Website");
        // } else if (type == MailType.invited_people) {
        //     lang["[Sunshine Studio]invited you!"] = res.__("[Sunshine Studio]invited you!");
        //     lang["invited you to Sunshine Studio!"] = res.__("invited you to Sunshine Studio!");
        //     lang["We wanted to change the frustrating way studios work on big files."] = res.__("We wanted to change the frustrating way studios work on big files.");
        //     lang["Optimize the way you share big files and communicate with your studio and clients."] = res.__("Optimize the way you share big files and communicate with your studio and clients.");
        //     lang["Try Sunshine Studio"] = res.__("Try Sunshine Studio");
        //     lang["Sunshine Studio is a Messenger for Big Files. Securely and quickly share without limit! Learn more."] = res.__("Sunshine Studio is a Messenger for Big Files. Securely and quickly share without limit! Learn more.");
        // } else if (type == MailType.invited_team) {
        //     lang["[Sunshine Studio]invited you to studio!"] = res.__("[Sunshine Studio]invited you to studio!");
        //     lang["You have been invited to join Sunshine Studio."] = res.__("You have been invited to join Sunshine Studio.");
        //     lang["invited you to join Sunshine Studio studio"] = res.__("invited you to join Sunshine Studio studio");
        //     lang["Sunshine Studio gives creators an easy way to share multi-GB files and efficiently communicate with collaborators."] = res.__("Sunshine Studio gives creators an easy way to share multi-GB files and efficiently communicate with collaborators.");
        //     lang["Location : "] = res.__("Location : ");
        //     lang["Inviter : "] = res.__("Inviter : ");
        //     lang["Today’s creative professionals need an easy way to collaborate with team, clients, and freelancers."] = res.__("Today’s creative professionals need an easy way to collaborate with team, clients, and freelancers.");
        //     lang["Share multi-GB uncompressed media files on a daily basis."] = res.__("Share multi-GB uncompressed media files on a daily basis.");
        //     lang["Smoothly communicate rather than having to constantly switch from app, to app, to app."] = res.__("Smoothly communicate rather than having to constantly switch from app, to app, to app.");
        //     lang["Create your own studio to freely invite members and manage projects."] = res.__("Create your own studio to freely invite members and manage projects.");
        //     lang["Join Studio"] = res.__("Join Studio");
        //     lang["invited studio name"] = res.__("invited studio name");
        //     lang["Transfer files over 100GB, communicate and get work done, all at the speed of Sunshine!"] = res.__("Transfer files over 100GB, communicate and get work done, all at the speed of Sunshine!");
        //     lang["Sunshine Studio!"] = res.__("Sunshine Studio!");
        //     lang["1. Most efficiently communicate with your studio!"] = res.__("1. Most efficiently communicate with your studio!");
        //     lang["2. Securely and quickly share any necessary files without limit!"] = res.__("2. Securely and quickly share any necessary files without limit!");
        //     lang["Sunshine Studio - Group Chat for Big FIles. Securely and quickly share without limit! Learn more."] = res.__("Sunshine Studio - Group Chat for Big FIles. Securely and quickly share without limit! Learn more.");
        //     lang["Sunshine Studio"] = res.__("Sunshine Studio");
        //     lang["Messenger for Creators. Share big files and big ideas!"] = res.__("Messenger for Creators. Share big files and big ideas!");
        //     lang["Please, open in desktop."] = res.__("Please, open in desktop.");
        //     lang["Watch Intro Video"] = res.__("Watch Intro Video");
        //     lang["Visit Our Website"] = res.__("Visit Our Website");
        // } else if (type == MailType.shared_files) {
        //     lang["[Sunshine Studio] sent file to you"] = res.__("[Sunshine Studio] sent file to you");
        //     lang["[Sunshine Studio] sent files to you"] = res.__("[Sunshine Studio] sent files to you");
        //     lang["sent files to you on Sunshine Studio."] = res.__("sent files to you on Sunshine Studio.");
        //     lang["Studio : "] = res.__("Studio : ");
        //     lang["Sent Files : "] = res.__("Sent Files : ");
        //     lang["Join Studio"] = res.__("Join Studio");
        //     lang["Please, open in desktop."] = res.__("Please, open in desktop.");
        //     lang["Click the button on your desktop to install Sunshine Studio and download the files."] = res.__("Click the button on your desktop to install Sunshine Studio and download the files.");
        //     lang["Sunshine Studio"] = res.__("Sunshine Studio");
        //     lang["Messenger for Creators. Share big files and big ideas!"] = res.__("Messenger for Creators. Share big files and big ideas!");
        //     lang["Watch Intro Video"] = res.__("Watch Intro Video");
        //     lang["Visit Our Website"] = res.__("Visit Our Website");
        //     lang["How to Download"] = res.__("How to Download");
        //     lang["1. Using this email, sign-up and sign-in to Sunshine Studio."] = res.__("1. Using this email, sign-up and sign-in to Sunshine Studio.");
        //     lang["2. Join 's studio."] = res.__("2. Join 's studio.");
        //     lang["3. Click the conversation with a notification and download the files to your desktop."] = res.__("3. Click the conversation with a notification and download the files to your desktop.");
        //     lang["Blocked"] = res.__("Blocked");
        // }
        return lang;
    },
    validateEmail: email => !!email ? email.toLowerCase() : ""
};