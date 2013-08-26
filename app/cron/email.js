var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "mue@kologlobal.com",
        pass: "n86y11w13!"
    }
});

var mailOptions = {
    from: "Fred Foo ✔ <foo@blurdybloop.com>", // sender address
    to: "mue@kologlobal.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world ✔", // plaintext body
    html: "<b>Hello world ✔</b>" // html body
}

smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
    }

    // if you don't want to use this transport object anymore, uncomment following line
    smtpTransport.close(); // shut down the connection pool, no more messages
});