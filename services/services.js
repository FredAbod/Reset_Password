const User = require('../models/user.models');

exports.Services = {
    find: () => User.find({}),

    findUserByEmail: (id) => User.findOne(id),

    findUserById: async (id) => {
        const user = await User.findById(id);

        if (!user) throw new Error('User Not Found');
        return user;
    },

    signUp: async (data) => {
        const user = new User({ ...data});
        await user.save();
        if (!user) throw new Error('User Not Found');
        return user;
    },
    };