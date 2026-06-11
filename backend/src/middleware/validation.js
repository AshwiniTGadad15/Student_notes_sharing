import { body, validationResult, param, query } from 'express-validator';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Auth validations
export const validateRegister = [
  body('firstName').trim().notEmpty().withMessage('First name is required').isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').trim().notEmpty().withMessage('Last name is required').isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters').matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter').matches(/[0-9]/).withMessage('Password must contain at least one number'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
];

export const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// Note validations
export const validateCreateNote = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('university').trim().notEmpty().withMessage('University is required'),
  body('branch').isIn(['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER']).withMessage('Invalid branch'),
  body('semester').isInt({ min: 1, max: 8 }).withMessage('Semester must be between 1 and 8'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
];

// Rating validations
export const validateRating = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comment must not exceed 500 characters'),
];

// ID parameter validations
export const validateObjectId = [
  param('id').matches(/^[0-9a-fA-F]{24}$/).withMessage('Invalid ID format'),
];

// Search validations
export const validateSearch = [
  query('q').trim().notEmpty().withMessage('Search query is required').isLength({ min: 2 }).withMessage('Search query must be at least 2 characters'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
];
