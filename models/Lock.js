// models/Lock.js
const mongoose = require("mongoose");

const lockSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  code: { type: String, required: true , unique:true}, 
  status: { type: String, enum: ["locked", "unlocked"], default: "locked" },
  validFrom: { type: Date },   
  validto: { type: Date }   
}, { timestamps: true });

module.exports = mongoose.model("Lock", lockSchema);
