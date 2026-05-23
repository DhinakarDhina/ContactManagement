const express = require('express');
const router = express.Router();
const { body, validationResult, param } = require('express-validator');
const Contact = require('../models/Contact');

// Validation middleware
const contactValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required').isLength({ max: 50 }),
  body('lastName').trim().notEmpty().withMessage('Last name is required').isLength({ max: 50 }),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[\d\s\-\+\(\)]{7,15}$/)
    .withMessage('Invalid phone number'),
  body('company').trim().notEmpty().withMessage('Company name is required').isLength({ max: 100 }),
  body('status').optional().isIn(['Active', 'Inactive']).withMessage('Status must be Active or Inactive'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// GET /api/contacts — list with search, filter, pagination
router.get('/', async (req, res) => {
  try {
    const { search = '', status = 'All', page = 1, limit = 10 } = req.query;

    const query = {};

    if (status !== 'All') {
      query.status = status;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { company: regex },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: contacts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// GET /api/contacts/:id
router.get('/:id', param('id').isMongoId().withMessage('Invalid contact ID'), handleValidationErrors, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, data: contact });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// POST /api/contacts
router.post('/', contactValidation, handleValidationErrors, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, company, status } = req.body;

    const existing = await Contact.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'A contact with this email already exists' });
    }

    const contact = await Contact.create({ firstName, lastName, email, phone, company, status });
    res.status(201).json({ success: true, data: contact, message: 'Contact created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// PUT /api/contacts/:id
router.put('/:id', param('id').isMongoId(), contactValidation, handleValidationErrors, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, company, status } = req.body;

    const existing = await Contact.findOne({ email: email.toLowerCase(), _id: { $ne: req.params.id } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Another contact with this email already exists' });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, phone, company, status },
      { new: true, runValidators: true }
    );

    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, data: contact, message: 'Contact updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// DELETE /api/contacts/:id
router.delete('/:id', param('id').isMongoId().withMessage('Invalid contact ID'), handleValidationErrors, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// DELETE /api/contacts — bulk delete
router.delete('/', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No IDs provided' });
    }
    await Contact.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, message: `${ids.length} contact(s) deleted` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
