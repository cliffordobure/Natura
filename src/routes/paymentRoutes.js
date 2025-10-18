const express = require('express');
const router = express.Router();
const {
  processPayment,
  getPayments,
  getPaymentById,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, processPayment);
router.get('/', protect, getPayments);
router.get('/:paymentId', protect, getPaymentById);

module.exports = router;

