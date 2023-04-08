const { result, rest } = require("lodash");
const Wallet = require("../models/wallet.models");
const User = require('../models/user.models');


exports.deposit = async (req, res, next) => {
    try {
        const { wallet } = req.body;
        if (req.user) {
           
        } else{
            next();
        }
        const newWallet = new Wallet({
            wallet
        })
        const saveNewWallet = await newWallet.save();
        return res.status(200).json(saveNewWallet)
    } catch (error) {
        return res.status(500).json({ error: error.message, message: "Amount not added"})
    }
};