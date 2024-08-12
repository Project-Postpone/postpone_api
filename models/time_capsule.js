import {model, Schema, Types} from "mongoose";
import {toJSON} from "@reis/mongoose-to-json";


const timeCapsuleSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'User', required: true   
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    content: [
        {
            type: Types.ObjectId,
            ref: 'Content' // Reference to a Content model (to be created)
        }
    ],
    scheduledDeliveryTime: {
        type: Date,
        required: true
    },
    recipients: [
        {
            type: String // Could be email or user ID or phone number
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});


timeCapsuleSchema.plugin(toJSON);

export const TimeCapsule = model('TimeCapsule', timeCapsuleSchema);
