import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    deviceId: {
      type: String,
      required: true,
      
    },
    

    deviceName: {
      type: String,
      default: "unknown device",
    },

    lastLogin: {
      type: Date,
      default: Date.now,
    },

  },
  {
    timestamps: true,
  }
);
deviceSchema.index(
  {
    userId: 1,
    deviceId: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "Device",
  deviceSchema,
  "devices"
);

