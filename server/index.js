const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors'); // Import the cors middleware
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Route to handle form submission
app.post('/submit-form', async (req, res) => {
    try {
        const recaptchaToken = req.body.recaptchaToken;
        if (!recaptchaToken) {
            return res.status(400).json({ error: 'reCAPTCHA token is missing' });
        }

        // Verify reCAPTCHA token
        const isHuman = await verifyRecaptchaToken(recaptchaToken);
        if (!isHuman) {
            return res.status(400).json({ error: 'reCAPTCHA verification failed' });
        }

        // Send confirmation email to user
        await sendConfirmationEmail(req.body);

        // Send form data to company email
        await sendFormDataToCompany(req.body);

        return res.status(200).json({ message: 'Form submitted successfully' });
    } catch (error) {
        console.error('Error submitting form:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Function to send confirmation email to user
async function sendConfirmationEmail(formData) {
    const { name, email, message } = formData;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome! Thank you for your submission',
        text: `Dear ${name},\n\nThank you for submitting the form. We have received your message:\n\n${message}\n\nBest regards,\nThe Team`
    });
}

// Function to send form data to company email
async function sendFormDataToCompany(formData) {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'aryan@technomine.biz',
        subject: 'New Form Submission',
        text: `New form submission:\n\n${JSON.stringify(formData, null, 2)}`
    });
}

// Dummy function to verify reCAPTCHA token
async function verifyRecaptchaToken(token) {
    // Implement reCAPTCHA verification logic using Google reCAPTCHA API
    // Return true if token is verified, false otherwise
    return true; // For demonstration purposes
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
