
import React from 'react';
import emailjs from '@emailjs/browser';

const SendConfirmationEmail = ({ visitorEmail, qrCodeImageURL }) => {
  const sendEmail = () => {
    // Vérifiez que l'adresse email du destinataire n'est pas vide
    if (!visitorEmail) {
      console.error('Adresse e-mail du destinataire vide.');
      return;
    }

    const templateParams = {
      to_email: visitorEmail, // Spécifiez l'adresse email du destinataire
      qrCodeImageURL: qrCodeImageURL, // Utilisez l'URL réelle du code QR
    };
    console.log("qr code ", qrCodeImageURL)

    emailjs.send('service_7lrsvgj', 'template_gyghzfa', templateParams, 'aJoYDi0Gsn4m3LYHL')
      .then((response) => {
        console.log('E-mail envoyé avec succès', response);
      })
      .catch((error) => {
        console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
      });
  };

  return (
    <div>
      <button onClick={sendEmail}>Envoyer l'e-mail de confirmation</button>
    </div>
  );
};

export default SendConfirmationEmail;
