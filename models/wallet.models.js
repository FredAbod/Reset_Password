const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
          },
        wallet: {
            type: Number,  
            required: true, 
            
        }
},
{
    collection: "user_wallet",
    timestamps: true,
    versionKey: false,
}
);

module.exports = mongoose.model('Wallet', walletSchema);