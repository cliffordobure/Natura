const Invoice = require('../models/Invoice');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const { INVOICE_STATUS, NOTIFICATION_TYPES } = require('../config/constants');

// @desc    Get invoices
// @route   GET /api/v1/invoices
// @access  Private
const getInvoices = asyncHandler(async (req, res) => {
  const { parentId, childId, status } = req.query;

  // Build filter
  const filter = {};
  if (parentId) filter.parentId = parentId;
  if (childId) filter.childId = childId;
  if (status) filter.status = status;

  const invoices = await Invoice.find(filter)
    .populate('parentId')
    .populate('childId')
    .populate('schoolId')
    .sort({ invoiceDate: -1 });

  res.status(200).json({
    invoices,
  });
});

// @desc    Get invoice by ID
// @route   GET /api/v1/invoices/:invoiceId
// @access  Private
const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.invoiceId)
    .populate('parentId')
    .populate('childId')
    .populate('schoolId');

  if (!invoice) {
    res.status(404);
    throw new Error('Invoice not found');
  }

  res.status(200).json(invoice);
});

// @desc    Create invoice
// @route   POST /api/v1/invoices
// @access  Private (Admin only)
const createInvoice = asyncHandler(async (req, res) => {
  const {
    parentId,
    childId,
    schoolId,
    invoiceDate,
    dueDate,
    amount,
    items,
    notes,
  } = req.body;

  // Validate required fields
  if (!parentId || !childId || !schoolId || !dueDate || !amount || !items || items.length === 0) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const invoice = await Invoice.create({
    parentId,
    childId,
    schoolId,
    invoiceDate: invoiceDate || new Date(),
    dueDate,
    amount,
    items,
    notes,
    status: INVOICE_STATUS.PENDING,
  });

  // Create notification for parent
  await Notification.create({
    userId: parentId,
    type: NOTIFICATION_TYPES.PAYMENT,
    title: 'New Invoice',
    body: `You have a new invoice of $${amount.toFixed(2)} due on ${new Date(dueDate).toLocaleDateString()}`,
    data: {
      invoiceId: invoice._id,
    },
  });

  res.status(201).json(invoice);
});

// @desc    Update invoice
// @route   PUT /api/v1/invoices/:invoiceId
// @access  Private (Admin only)
const updateInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.invoiceId);

  if (!invoice) {
    res.status(404);
    throw new Error('Invoice not found');
  }

  const {
    invoiceDate,
    dueDate,
    amount,
    paidAmount,
    status,
    items,
    notes,
  } = req.body;

  // Update fields
  if (invoiceDate) invoice.invoiceDate = invoiceDate;
  if (dueDate) invoice.dueDate = dueDate;
  if (amount !== undefined) invoice.amount = amount;
  if (paidAmount !== undefined) invoice.paidAmount = paidAmount;
  if (status) invoice.status = status;
  if (items) invoice.items = items;
  if (notes !== undefined) invoice.notes = notes;

  // Auto-update status based on payment
  if (paidAmount !== undefined && paidAmount >= invoice.amount) {
    invoice.status = INVOICE_STATUS.PAID;
    invoice.paidAt = new Date();
  }

  await invoice.save();

  res.status(200).json(invoice);
});

// @desc    Delete invoice
// @route   DELETE /api/v1/invoices/:invoiceId
// @access  Private (Admin only)
const deleteInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.invoiceId);

  if (!invoice) {
    res.status(404);
    throw new Error('Invoice not found');
  }

  await invoice.deleteOne();

  res.status(200).json({
    message: 'Invoice deleted successfully',
  });
});

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};

