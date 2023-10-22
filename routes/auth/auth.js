const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// VALIDATION OF USER INPUTS PRE-REQ
const joi = require("@hapi/joi");
const registerSchema = joi.object({
  firstName: joi.string().min(6).required(),
  lastName: joi.string().min(6).required(),
  email: joi.string().min(6).required().email(),
  password: joi.string().min(8).required(),
});

// SIGNUP USER
router.post("/signup", async (req, res) => {
  // IF req body is empty
  if (!req.body) return res.status(400).send("Request body is empty");
  // Check for required fields
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.firstName ||
    !req.body.lastName
  ) {
    return res.status(400).send("Required fields are missing");
  }
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");
  // HASHING THE PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // CREATE A NEW USER
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword,
  });

  // VALIDATE USER INPUTS
  try {
    const { error } = await registerSchema.validateAsync(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    } else {
      await user.save();
      res.send({ user: user._id, message: "User created successfully" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// VALIDATION OF USER INPUTS PRE-REQ
const loginSchema = joi.object({
  email: joi.string().min(6).required().email(),
  password: joi.string().min(8).required(),
});

// LOGIN USER
router.post("/login", async (req, res) => {
  // IF req body is empty
  if (!req.body) return res.status(400).send("Request body is empty");
  // Check for required fields
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("Required fields are missing");
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email does not exist");
  // CHECK IF PASSWORD IS CORRECT
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid password");

  try {
    const { error } = await loginSchema.validateAsync(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    } else {
      // CREATE AND ASSIGN A TOKEN
      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
      res.header("auth-token", token).send({ token: token,"message":"Successfully loggedIn! " });
    }
  }catch(error){
    return res.status(500).send(error);
  }
 
});
  

module.exports = router;
