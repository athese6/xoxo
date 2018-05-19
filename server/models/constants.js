const KB = 1024;
const MB = 1048576; //KB * 1024
const GB = 1073741824; //MB * 1024
module.exports = {
    DBActionStatus: {
        new: "new",
        delete: "delete",
        update: "update"
    },
    MailType: {
        welcome: 0,
        confirmation: 1,
        confirm_change_password: 2,
        forgot_your_password: 3,
        invited_people: 4,
        invited_team: 5,
        shared_files: 6,
    },
    Prefix: {
        Browser: "brw-",
        Device: "dvc-",
        User: "usr-",
        Price: "prc-",
        RequestFormAnswers: "rfa-",
        Asset: "ast-",
        Survey: "svy-",
    },
    UserRole: {
        admin: "admin",
        guest: "guest",
        member: "member",
        manager: "manager",
        bot: "bot"
    },
    Gender: {
        male: "male",
        female: "female"
    },
    Subscription: {
        all: "all",
        house: "house",
        cafe: "cafe"
    }

};
