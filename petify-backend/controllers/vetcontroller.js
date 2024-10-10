const VetApplication = require('../models/vet'); // Adjust the path as needed
const User = require('../models/user'); // Adjust the path as needed
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

// Create a new transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or another email service provider
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Controller to handle vet job form submissions
exports.submitApplication = async (req, res) => {
  try {
    const { fullName, email, coverLetter, phone } = req.body;

    // Create a new vet application
    const newApplication = new VetApplication({
      fullName,
      email,
      coverLetter,
      phone,
    });

    // Save the application to the database
    await newApplication.save();

    // Send confirmation email
    const mailOptions = {
      from: 'your-email@example.com',
      to: email,
      subject: 'Vet Job Application Received',
      text: `Dear ${fullName},\n\nThank you for applying for the vet job position. We have received your application and will review it shortly. We will contact you if you are shortlisted.\n\nBest regards,\nPetify Team`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Application submitted and confirmation email sent!' });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to approve a vet and create a user account

exports.approveVet = async (req, res) => {
  try {
    const vetId = req.params.vetId;

    // Find the vet by ID
    const vet = await VetApplication.findById(vetId);
    if (!vet) {
      return res.status(404).json({ message: 'Vet not found' });
    }

    // Check if the vet is already approved
    if (vet.approved) {
      return res.status(400).json({ message: 'Vet is already approved' });
    }

    // Approve the vet
    vet.approved = true;
    await vet.save();

    // Generate a temporary password
    const tempPassword = generatePassword();

    // Hash the password before saving the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    // Create a new user account for the vet
    const newUser = new User({
      fullName: vet.fullName,
      email: vet.email,
      password: hashedPassword, // Save the hashed password
      role: 'vet', // Vet role
    });

    await newUser.save();

    // Send email with login credentials
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: vet.email,
      subject: 'Vet Application Approved - Login Details',
      text: `Dear ${vet.fullName},\n\nYour vet application has been approved! You can now log in to your account using the following credentials:\n\nEmail: ${vet.email}\nPassword: ${tempPassword}\n\nPlease change your password after logging in.\n\nBest regards,\nPetify Team`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Vet approved and email sent with login credentials!' });
  } catch (error) {
    console.error('Error approving vet:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
