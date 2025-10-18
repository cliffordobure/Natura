const express = require('express');
const router = express.Router();
const {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} = require('../controllers/invoiceController');
const { protect, isAdminOrDirector } = require('../middleware/authMiddleware');

router.get('/', protect, getInvoices);
router.post('/', protect, isAdminOrDirector, createInvoice);
router.get('/:invoiceId', protect, getInvoiceById);
router.put('/:invoiceId', protect, isAdminOrDirector, updateInvoice);
router.delete('/:invoiceId', protect, isAdminOrDirector, deleteInvoice);

module.exports = router;

