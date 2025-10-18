const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const { INVOICE_STATUS, NOTIFICATION_TYPES } = require('../config/constants');

// @desc    Process payment
// @route   POST /api/v1/payments
// @access  Private
const processPayment = asyncHandler(async (req, res) => {
  const { invoiceId, amount, method, transactionId, notes } = req.body;

  // Validate required fields
  if (!invoiceId || !amount || !method || !transactionId) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Find invoice
  const invoice = await Invoice.findById(invoiceId);

  if (!invoice) {
    res.status(404);
    throw new Error('Invoice not found');
  }

  // Check if invoice is already paid
  if (invoice.status === INVOICE_STATUS.PAID) {
    res.status(400);
    throw new Error('Invoice is already paid');
  }

  // Create payment record
  const payment = await Payment.create({
    invoiceId,
    parentId: invoice.parentId,
    amount,
    method,
    transactionId,
    notes,
  });

  // Update invoice
  invoice.paidAmount = (invoice.paidAmount || 0) + amount;
  
  if (invoice.paidAmount >= invoice.amount) {
    invoice.status = INVOICE_STATUS.PAID;
    invoice.paidAt = new Date();
  }

  await invoice.save();

  // Create notification for parent
  await Notification.create({
    userId: invoice.parentId,
    type: NOTIFICATION_TYPES.PAYMENT,
    title: 'Payment Received',
    body: `Your payment of $${amount.toFixed(2)} has been received`,
    data: {
      invoiceId: invoice._id,
      paymentId: payment._id,
    },
  });

  res.status(201).json({
    payment,
  });
});

// @desc    Get payment history
// @route   GET /api/v1/payments
// @access  Private
const getPayments = asyncHandler(async (req, res) => {
  const { parentId, invoiceId } = req.query;

  // Build filter
  const filter = {};
  if (parentId) filter.parentId = parentId;
  if (invoiceId) filter.invoiceId = invoiceId;

  const payments = await Payment.find(filter)
    .populate('invoiceId')
    .populate('parentId')
    .sort({ paymentDate: -1 });

  res.status(200).json({
    payments,
  });
});

// @desc    Get payment by ID
// @route   GET /api/v1/payments/:paymentId
// @access  Private
const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.paymentId)
    .populate('invoiceId')
    .populate('parentId');

  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  res.status(200).json(payment);
});

module.exports = {
  processPayment,
  getPayments,
  getPaymentById,
};

