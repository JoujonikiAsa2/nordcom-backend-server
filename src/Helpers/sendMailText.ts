import config from "../config";

export const paymentVerificationEmailText = ({
  name,
  subject,
  transactionId,
  totalAmount,
  totalProducts,
  orderId,
  paidAt,
}: {
  name: string;
  subject: string;
  transactionId: string;
  totalAmount: number;
  totalProducts: number;
  orderId: string;
  paidAt: string;
}) => {
  return `
  <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title> 
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            border: 1px solid green
        }
        .container {
            max-width: 600px;
            background-color: #ffffff;
            margin: 20px auto;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4CAF50;
            color: white;
            text-align: center;
            padding: 15px;
            font-size: 22px;
            font-weight: bold;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content h2 {
            color: #333;
        }
        .content p {
            color: #666;
            font-size: 16px;
        }
        .details {
            background-color: #f9f9f9;
            padding: 15px;
            margin-top: 15px;
            border-radius: 5px;
            text-align: left;
        }
        .details p {
            margin: 5px 0;
        }
        .footer {
            text-align: center;
            color: #777;
            font-size: 14px;
            margin-top: 20px;
        }
        .button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            font-size: 16px;
            border-radius: 5px;
            margin-top: 15px;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="header">
            🎉 Payment Successful!
        </div>
        <div class="content">
            <h2>Dear ${name},</h2>
            <p>We are delighted to inform you that your payment has been successfully processed.</p>
            <div class="details">
                <p><strong>Transaction ID:</strong> ${transactionId}</p>
                <p><strong>totalAmount Paid:</strong> &#x09F3;${totalAmount}</p>
                <p><strong>totalAmount Paid:</strong> &#x09F3;${totalProducts}</p>
                <p><strong>Date:</strong> ${new Date(paidAt)}</p>
                <p><strong>Review Name:</strong> ${orderId}</p>
            </div>
            <p>Thank you for your payment. We are excited to have you in our portal!</p>
        </div>
        <div class="footer">
            If you have any questions, feel free to <a href="mail to: support@pulsedu.com">contact us</a>. <br>
            &copy; 2025 NordCom. All Rights Reserved.
        </div>
    </div>

</body>
</html>

    
  
  `;
};

export const forgotPasswordEmailText = ({
  name,
  email,
  token,
  expiresIn,
}: {
  name: string;
  email: string;
  token: string;
  expiresIn: number;
}) => {
  const resetLink = `${config.client_url}/reset-password?token=${token}&email=${email}`;

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f4f4f4; border-radius: 10px;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333;">Hello ${name},</h2>
        <p style="color: #555; font-size: 16px;">
          We received a request to reset the password for your account <strong>${email}</strong>.
        </p>
        <p style="color: #555; font-size: 16px;">
          Click the button below to set a new password. This link will expire in ${expiresIn} minutes.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">
            Reset Password
          </a>
        </div>
        <p style="color: #999; font-size: 14px;">
          If you didn’t request a password reset, you can safely ignore this email.
        </p>
        <hr style="margin-top: 40px; border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 12px; color: #aaa; text-align: center;">
          &copy; ${new Date().getFullYear()} NordCom. All rights reserved.
        </p>
      </div>
    </div>
  `;
};
