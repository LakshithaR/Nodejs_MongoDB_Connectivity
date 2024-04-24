const nodemailer= require('nodemailer');

const sendmail = async ({email,subject,html}) =>{
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: "crl.lakshi@gmail.com",
              pass: "ovbs teqf rljn ewnd",
            },
          });
          await transporter.sendMail({
            from:"crl.lakshi@gmail.com",
            to:email,
            subject:subject,
            html:html
          })
    } catch (error) {
        console.log(error);
    }
}

module.exports=sendmail;