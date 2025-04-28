import emailjs from 'emailjs-com';

export const sendOtpEmail = async (email, otp) => {
  const templateParams = {
    to_email: email,
    otp: otp,
  };

  try {
    const response = await emailjs.send(
      'service_069il53', // จาก EmailJS
      'template_wt38dgh', // จาก EmailJS
      templateParams,
      'gJcGImTsa_eeQTGtV' // public key
    );
    console.log('Email successfully sent!', response.status, response.text);
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
};
