import * as nodemailer from 'nodemailer';
import loadconfig from './loadconfig';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP,  // Utilisation du serveur SMTP fourni dans les variables d'environnement
    port: 587,  // Port SMTP standard
    secure: false,  // Utilisation de TLS
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });





export async function sendActivationMail(activationcode, mail, name) {
    return new Promise((resolve, reject) => {
      const activationLink = loadconfig.WEBSITEURL + '/activate/' + activationcode; // Replace with your actual activation URL
      const mailOptions = {
        from: 'finaltraining@remi-weil.fr',
        to: mail,
        subject: 'Your activation link',
        text: `Welcome ${name} to OpenDisk. Please click the following link to activate your account: ${activationLink}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error); // Reject with the error
        } else {
          resolve(info); // Resolve with the success info
        }
      });
    });
  }

  export async function sendRecoveryMail(recovery, mail, name) {
    return new Promise((resolve, reject) => {
      const activationLink = loadconfig.WEBSITEURL + '/recovery/' + recovery; // Replace with your actual activation URL
      const mailOptions = {
        from: 'finaltraining@remi-weil.fr',
        to: mail,
        subject: 'Your recovery link',
        text: `Welcome ${name} to OpenDisk. You ask to receive a link to recover your password : ${activationLink}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error); // Reject with the error
        } else {
          resolve(info); // Resolve with the success info
        }
      });
    });
  }

  export async function sendMailError(error,activityID) {
    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: 'finaltraining@remi-weil.fr',
        to: 'remi@remi-weil.fr',
        subject: "/!\ ERROR ",
        text: `Welcome admin to OpenDisk. A new error : ${error}. Lors de l'activité ${activityID}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error); // Reject with the error
        } else {
          resolve(info); // Resolve with the success info
        }
      });
    });
  }