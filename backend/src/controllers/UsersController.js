const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

class UsersController {
  static async register(req, res) {
    const { name, email, password, bankDetails } = req.body;
    if (!name || !email || !password) return res.status(400).send('Missing fields');

    const existing = await UserModel.findByEmail(email);
    if (existing) return res.status(400).send('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.createUser({name, email, hashedPassword, bankDetails: bankDetails || ''});
    res.send({id: user.id, name: user.name, email: user.email});
  }

  static async login(req, res) {
    const { email, password } = req.body;
    const user = await UserModel.findByEmail(email);
    if (!user) return res.status(401).send('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).send('Invalid credentials');

    const token = jwt.sign({userId: user.id}, config.get('jwtSecret'));
    res.send({token, user: {id: user.id, name: user.name, email: user.email}});
  }

  static async profile(req, res) {
    const user = await UserModel.findById(req.userId);
    if (!user) return res.status(404).send('Not found');
    res.send({id: user.id, name: user.name, email: user.email, bankDetails: user.bank_details});
  }
}

module.exports = UsersController;