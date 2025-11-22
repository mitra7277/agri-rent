// utils/sendNotification.js (SAFE MODE)
// Twilio completely disabled so backend never crashes.

async function sendSMS(phone, message) {
  console.log("📩 SMS (disabled):", phone, message);
}

async function sendWhatsApp(phone, message) {
  console.log("📲 WhatsApp (disabled):", phone, message);
}

module.exports = { sendSMS, sendWhatsApp };
