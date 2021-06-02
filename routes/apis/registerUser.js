const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../../model/registerUser');
const router = express();
const bcrypt = require('bcrypt');
const config = require('config');
const jsontoken = require('jsonwebtoken');
router.post(
  '/',
  check('name', 'Name is Required').not().isEmpty(),
  check('email', 'Enter a valid email').isEmail(),
  check('password', 'Password is too short').isLength({ min: 8 }),
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(500).json({ error: error.array() });
    }
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        console.log('Already Register');

        return res.status(401).json({ error: ['user already exit'] });
      }
      const newUser = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);
      console.log(newUser, 'USERRRRRRRRR');
      await newUser.save();
      const paylaod = {
        user: {
          id: newUser.id,
        },
      };
      jsontoken.sign(
        paylaod,
        config.get('token'),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          console.log(token);
          res.status(200).json(token);
        }
      );
    } catch (error) {
      res.status(401).json('Server Error');
      console.log(error.message);
    }
  }
);

module.exports = router;
