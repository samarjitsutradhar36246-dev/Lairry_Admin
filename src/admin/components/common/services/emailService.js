import emailjs from "@emailjs/browser";
import NotificationService from "../services/NotificationService";

// Aapki EmailJS Keys directly yahan daal di hain
const EMAILJS_SERVICE = "service_hzdvu8e";
const WELCOME_TEMPLATE_ID = "template_nu3fk3u"; // Filhal wahi Contact Us wala template use kar rahe hain
const GENERIC_TEMPLATE_ID = "template_nu3fk3u"; // Bulk emails ke liye bhi same template
const EMAILJS_USER_ID = "jXZpEYlzVAdJbACvd";    // Aapki Public Key

/**
 * Sends a welcome email to a new institute.
 */
export const sendWelcomeEmail = async (toEmail, toName, tempPassword) => {
  if (!toEmail) return;

  try {
    await emailjs.send(
      EMAILJS_SERVICE,
      WELCOME_TEMPLATE_ID,
      {
        name: "Lairry",
        message: `Welcome to our platform! Your registration is successful. Your temporary login password is: ${tempPassword}. Please login and change it.`, // Password message mein add kar diya
        to_email: toEmail,
      },
      EMAILJS_USER_ID
    );
    console.log("Welcome email sent to", toEmail);
  } catch (err) {
    console.error("Failed to send welcome email:", err);
    NotificationService.error("Failed to send welcome email");
  }
};

/**
 * Sends bulk emails to multiple recipients.
 */
export const sendBulkEmails = async (recipients, subject, body) => {
  if (!recipients?.length) return;

  try {
    await Promise.all(
      recipients.map((recipient) =>
        emailjs.send(
          EMAILJS_SERVICE,
          GENERIC_TEMPLATE_ID,
          {
            name: "Larry", 
            subject: subject,                    // Subject
            message: body,                       // Template ka {{message}}
            to_email: recipient.email,
          },
          EMAILJS_USER_ID
        )
      )
    );
  } catch (err) {
    console.error("EmailJS send error:", err);
    NotificationService.error("Error sending emails: " + err.message);
  }
};