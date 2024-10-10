const SymptomChecker = require('../models/symptom');

exports.checkSymptoms = async (req, res) => {
    const { petType, symptoms } = req.body;
  
    try {
      // Fetch symptom-related data from the database
      const symptomDetails = await SymptomChecker.find({ petType, symptom: symptoms });
  
      if (!symptomDetails.length) {
        return res.status(404).json({ message: 'No data found for this symptom' });
      }
  
      const severeCondition = symptomDetails.find((detail) => detail.severity === 'severe');
  
      // Return the data including the questions, diagnosis, and severity advice
      return res.json({
        diagnosis: severeCondition ? severeCondition.diagnosis : symptomDetails[0].diagnosis,
        questions: symptomDetails[0].questions,
        advice: severeCondition ? 'Please visit a vet immediately.' : 'Monitor the symptoms closely.',
      });
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  exports.getDiagnosis = async (req, res) => {
    const { petType, symptom, answers } = req.body;

    try {
        // Find the relevant symptom in the database
        const symptomData = await SymptomChecker.findOne({ petType, symptom });

        if (!symptomData) {
            return res.status(404).json({ message: 'Symptom not found' });
        }

        // Count the number of "Yes" answers
        const yesCount = Object.values(answers).filter((answer) => answer === 'yes').length;

        // Log for debugging
        console.log(`Yes Count: ${yesCount}`);
        console.log(`Questions Length: ${symptomData.questions.length}`);
        console.log(`Answers:`, answers);

        // Determine severity based on the number of "Yes" answers
        let severity;
        
        // Add logic to check for critical severity
        if (yesCount >= symptomData.questions.length - 1 && answers[symptomData.questions.length - 1] === 'yes') {
            severity = 'critical'; // Conditions for critical severity
        } else if (yesCount === symptomData.questions.length) {
            severity = 'severe'; // All answers are "Yes"
        } else if (yesCount > 0) {
            severity = 'moderate'; // Some answers are "Yes"
        } else {
            severity = 'mild'; // No "Yes" answers
        }

        // Log the determined severity for debugging
        console.log(`Severity: ${severity}`);

        // Find the corresponding diagnosis based on severity
        const diagnosisData = symptomData.diagnoses.find((diag) => diag.severity === severity);

        if (!diagnosisData) {
            return res.status(404).json({ message: 'Diagnosis not found for the given severity' });
        }

        // Send the diagnosis and advice to the client
        res.json({ diagnosis: diagnosisData.result, advice: 'Consult a vet if symptoms persist.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
