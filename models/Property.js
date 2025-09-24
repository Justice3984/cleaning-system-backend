const mongoose = require("mongoose");
const User = require("./User");

const propertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: async function (userId) {
          const user = await User.findById(userId);
          return user && user.role === "host"; // only hosts can own properties
        },
        message: "Assigned user must have role 'host'"
      }
    }
  },
  { timestamps: true }
);

// ✅ Auto-populate host details whenever we query Property
propertySchema.pre(/^find/, function (next) {
  this.populate("host", "name email role");
  next();
});

module.exports = mongoose.model("Property", propertySchema);
