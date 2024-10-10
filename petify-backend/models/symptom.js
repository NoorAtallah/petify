const mongoose = require('mongoose');

const diagnosisSchema = new mongoose.Schema({
  severity: { type: String, required: true }, // "mild", "moderate", "severe"
  result: { type: String, required: true },   // Diagnosis text for this severity
});

const symptomCheckerSchema = new mongoose.Schema({
  petType: { type: String, required: true },  // "dog" or "cat"
  symptom: { type: String, required: true },  // Symptom name
  questions: { type: [String], required: true }, // Array of questions
  diagnoses: [diagnosisSchema],  // Array of potential diagnoses based on answers
});

module.exports = mongoose.model('SymptomChecker', symptomCheckerSchema);
