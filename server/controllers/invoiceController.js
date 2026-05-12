import mongoose from 'mongoose';
import Invoice from '../models/Invoice.js';

const handleInvoiceError = (error, res) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Invoice validation failed',
      errors: Object.values(error.errors).map((err) => err.message),
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      message: 'Invoice number already exists',
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid invoice id',
    });
  }

  console.error(error);
  return res.status(500).json({
    message: 'Server error',
  });
};

export const createInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.create(req.body);
    return res.status(201).json(invoice);
  } catch (error) {
    return handleInvoiceError(error, res);
  }
};

export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    return res.status(200).json(invoices);
  } catch (error) {
    return handleInvoiceError(error, res);
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid invoice id' });
    }

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    return res.status(200).json(invoice);
  } catch (error) {
    return handleInvoiceError(error, res);
  }
};

export const updateInvoice = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid invoice id' });
    }

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    invoice.set(req.body);
    const updatedInvoice = await invoice.save();

    return res.status(200).json(updatedInvoice);
  } catch (error) {
    return handleInvoiceError(error, res);
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid invoice id' });
    }

    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    return res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    return handleInvoiceError(error, res);
  }
};
