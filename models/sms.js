import { Schema, model, Types } from "mongoose";

const smsContentSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'User', required: true   
    },
    sender: { type: String, required: true },
    recipient: { type: String, required: true, match: /^\+\d{10,15}$/ }, // Adjust phone number pattern as needed
    message: { type: String, required: true, maxlength: 160 },
    status: { type: String, enum: ['sent', 'delivered', 'failed'] }
  },{
    timestamps: true
  });
  
  export const SMSContent = model('SMSContent', smsContentSchema);
  