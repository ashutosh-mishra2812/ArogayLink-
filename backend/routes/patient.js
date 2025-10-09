const express = require("express");
// FIX 1: Import 'body' from express-validator for validation
const { body } = require('express-validator'); 
const Patient = require("../modal/Patient");
const { authenticate, requireRole } = require("../middleware/auth");
// FIX 2: Import the 'validate' middleware
const validate = require("../middleware/validate");

const router = express.Router();

// Helper function to calculate age from DOB
// FIX 3: Define computeAgeFromDob, as it was referenced but not defined.
function computeAgeFromDob(dobString) {
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    // If month difference is negative or if months are same but day is less
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}


// Get the profile of patient
// FIX 4: Corrected the parenthesis nesting to avoid TypeError
router.get('/me', authenticate, requireRole('patient'), async (req, res) => {
    try {
        // Use req.user.id for consistency and robustness
        const doc = await Patient.findById(req.user.id || req.user._id).select('-password -googleId');
        if (!doc) {
            return res.notFound('Patient profile not found.');
        }
        res.ok(doc, 'Profile fetched')
    } catch (error) {
        console.error('Profile fetch failed', error);
        res.serverError('Failed to fetch profile', [error.message]);
    }
})

// update patient profile
router.put(
    '/onboarding/update',
    authenticate,
    requireRole('patient'),
    [
        body('name').optional().notEmpty().withMessage("Name cannot be empty."),
        body("phone").optional().isString().withMessage("Phone must be a string."),
        body("dob").optional().isISO8601().toDate().withMessage("Date of birth must be a valid date (YYYY-MM-DD)."),
        body("gender").optional().isIn(["male", "female", "other"]).withMessage("Invalid gender value."),
        body("bloodGroup")
            .optional()
            .isIn(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])
            .withMessage("Invalid blood group."),

        body("emergencyContact").optional().isObject().withMessage("Emergency contact must be an object."),
        body("emergencyContact.name").optional().isString().notEmpty().withMessage("Emergency contact name cannot be empty."),
        body("emergencyContact.phone").optional().isString().notEmpty().withMessage("Emergency contact phone cannot be empty."),
        body("emergencyContact.relationship").optional().isString().notEmpty().withMessage("Emergency contact relationship cannot be empty."),

        body("medicalHistory").optional().isObject().withMessage("Medical history must be an object."),
        body("medicalHistory.allergies").optional().isString().notEmpty().withMessage("Allergies cannot be empty."),
        // FIX 5: Added closing parenthesis to notEmpty()
        body("medicalHistory.currentMedications").optional().isString().notEmpty().withMessage("Current medications cannot be empty."), 
        body("medicalHistory.chronicConditions").optional().isString().notEmpty().withMessage("Chronic conditions cannot be empty."),

    ],
    validate, // Now imported and defined
    async (req, res) => {
        try {
            const updates = { ...req.body };
            
            // Calculate age if DOB is updated
            if (updates.dob) {
                updates.age = computeAgeFromDob(updates.dob);
            }
            
            // Security: Prevent unauthorized updates
            delete updates.password;
            delete updates.email;
            delete updates.googleId;
            
            // Assuming this endpoint completes the patient onboarding process
            updates.isVerified = true; 
            
            // FIX 6: Changed incorrect variable name 'updated' to 'updates'
            const doc = await Patient.findByIdAndUpdate(
                req.user.id || req.user._id, // Use ID from authentication
                updates, 
                { 
                    new: true,
                    runValidators: true // Enforce Mongoose validation
                }
            ).select('-password -googleId');
            
            if (!doc) {
                return res.notFound('Patient profile not found.');
            }

            res.ok(doc, 'Profile updated successfully')
        } catch (error) {
            // Handle Mongoose validation errors
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map(val => val.message);
                return res.badRequest('Validation failed during update', messages);
            }
            console.error('Update failed', error);
            res.serverError("Update failed", [error.message])
        }
    }
);


module.exports = router;
