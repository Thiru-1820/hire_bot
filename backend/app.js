const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer")

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// **User Schema (Admin & Normal Users)**
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }, // Flag for admin users
});
const User = mongoose.model("User", UserSchema);

// **Interview Credentials Schema (For Assigned Credentials)**
const InterviewCredentialSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  company: { type: String, required: true },
});
const InterviewCredential = mongoose.model(
  "InterviewCredential",
  InterviewCredentialSchema
);

// **Middleware to Verify JWT Token**
const verifyUser = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(403).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], "abc123");
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(401).json({ message: "Invalid token" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// **Middleware to Verify Admin Access**
const verifyAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// **User Signup (Admin & Normal)**
app.post("/api/signup", async (req, res) => {
  const { email, password, isAdmin } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await User.create({ email, password: hashedPassword, isAdmin: !!isAdmin });
    res.status(201).json({ message: "Account created successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error signing up. Try again." });
  }
});

// **User Login (Admin & Normal)**
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { userId: user._id, isAdmin: user.isAdmin },
    "abc123",
    { expiresIn: "2h" }
  );

  // Redirect based on user type
  const redirectPath = user.isAdmin ? "/college-admin" : "/home";

  res.json({ token, redirect: redirectPath });
});

// **Protected Route: Get User Profile**
app.get("/api/user/profile", verifyUser, (req, res) => {
  res.json({ email: req.user.email, isAdmin: req.user.isAdmin });
});

// Send Email Function
const sendEmail = async (email, password, company) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "therealbugbountyhunter@gmail.com",
      pass: "tgwg jqzd bpdq vomk",
    },
  });

  let mailOptions = {
    from: "hirepro@gmail.com",
    to: email,
    subject: `Your Exam Credentials for ${company}`,
    text: `Your credentials for ${company}:
Username: ${email}
Password: ${password}`,
  };

  await transporter.sendMail(mailOptions);
};

// **Admin Only: Assign Interview Credentials**
app.post(
  "/api/admin/assign-credentials",
  verifyUser,
  verifyAdmin,
  async (req, res) => {
    const { emails, company } = req.body;
    let credentials = [];
    let existingEmails = [];

    for (let email of emails) {
      const existingUser = await InterviewCredential.findOne({
        email,
        company,
      });
      if (existingUser) {
        existingEmails.push(email);
        continue;
      }

      const password = Math.random().toString(36).slice(-8); // Generate a random password
      const hashedPassword = await bcrypt.hash(password, 10);

      await InterviewCredential.create({
        email,
        password: hashedPassword,
        company,
      });

      credentials.push({ email, password, company });
    }

    res.json({
      message: "Credentials assigned successfully",
      credentials,
      skippedEmails: existingEmails,
    });
  }
);

app.post("/api/verify-credentials", async (req, res) => {
  const { email, password, company } = req.body;
  const user = await InterviewCredential.findOne({ email, company });
  return res.status(200).json({ message: "Successfully logged in" });
})

// **Admin Only: View All Assigned Credentials**
app.get("/api/admin/credentials", verifyUser, verifyAdmin, async (req, res) => {
  const credentials = await InterviewCredential.find();
  res.json(credentials);
});

// **Start Server**
app.listen(5000, () => console.log("✅ Server running on port 5000"));