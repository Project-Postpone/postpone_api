
import {model, Schema, Types} from "mongoose";
import {toJSON} from "@reis/mongoose-to-json";


// create a profile model
const profileSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'User', required: true   
    },
       displayName: { type: String, required: true },
       bio: { type: String },
       email: { type: String },
       phone: { type: String },
       sentMessages: [{
           type: String
       }],
       deliveredMessages: {type: String},
       privacySettings: {
           profileVisibility: { type: String}, // public, private, friends-only
           postVisibility: { type: String} // public, friends-only
       },
       verified: { type: Boolean, default: false}, // Whether the profile is verified
}, {
    timestamps: true
});


//  use plugins for the ids
profileSchema.plugin(toJSON);


// export the model
export const Profile = model("Profile", profileSchema);