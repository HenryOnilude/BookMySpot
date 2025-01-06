import nodemailer from 'nodemailer';

if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
  throw new Error('Missing email configuration environment variables');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (template: EmailTemplate) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_SERVER_USER,
      ...template,
    });
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const createBookingConfirmationEmail = (
  userEmail: string,
  spotName: string,
  startTime: Date,
  endTime: Date,
  totalPrice: number
): EmailTemplate => ({
  to: userEmail,
  subject: 'Booking Confirmation - BookMySpot',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Booking Confirmation</h1>
      <p>Thank you for booking with BookMySpot!</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #1f2937; margin-top: 0;">Booking Details</h2>
        <p><strong>Spot:</strong> ${spotName}</p>
        <p><strong>Start Time:</strong> ${startTime.toLocaleString()}</p>
        <p><strong>End Time:</strong> ${endTime.toLocaleString()}</p>
        <p><strong>Total Price:</strong> $${totalPrice.toFixed(2)}</p>
      </div>
      <p>If you need to make any changes to your booking, please visit our website.</p>
      <p>Thank you for choosing BookMySpot!</p>
    </div>
  `,
});

export const createOwnerNotificationEmail = (
  ownerEmail: string,
  spotName: string,
  startTime: Date,
  endTime: Date,
  userEmail: string
): EmailTemplate => ({
  to: ownerEmail,
  subject: 'New Booking Notification - BookMySpot',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">New Booking Notification</h1>
      <p>You have received a new booking for your parking spot!</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #1f2937; margin-top: 0;">Booking Details</h2>
        <p><strong>Spot:</strong> ${spotName}</p>
        <p><strong>Start Time:</strong> ${startTime.toLocaleString()}</p>
        <p><strong>End Time:</strong> ${endTime.toLocaleString()}</p>
        <p><strong>Booked by:</strong> ${userEmail}</p>
      </div>
      <p>You can manage your bookings through our website.</p>
    </div>
  `,
});
