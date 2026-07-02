const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// API endpoint for waitlist
app.post('/api/waitlist', (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    console.log(`[WAITLIST] New signup: ${email}`);

    // Local storage in waitlist.json
    const waitlistPath = path.join(__dirname, 'waitlist.json');
    let waitlist = [];

    if (fs.existsSync(waitlistPath)) {
        const data = fs.readFileSync(waitlistPath);
        waitlist = JSON.parse(data);
    }

    waitlist.push({ email, timestamp: new Date().toISOString() });
    fs.writeFileSync(waitlistPath, JSON.stringify(waitlist, null, 2));

    // To connect a real email service, you could add Nodemailer logic here:
    /*
    const nodemailer = require('nodemailer');
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-app-password'
        }
    });

    let mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Welcome to the JARVIS Waitlist!',
        text: 'You have been added to the neural link queue.'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error);
        else console.log('Email sent: ' + info.response);
    });
    */

    res.json({ message: 'Sync Request Received. You are in the queue.' });
});

app.listen(PORT, () => {
    console.log(`⚡ JARVIS CORE ONLINE`);
    console.log(`🚀 Access Interface at http://localhost:${PORT}`);
});
