import express from 'express';
import {
  createInvoice,
  deleteInvoice,
  getInvoiceById,
  getInvoices,
  updateInvoice,
} from '../controllers/invoiceController.js';

const router = express.Router();

router.route('/').post(createInvoice).get(getInvoices);
router.route('/:id').get(getInvoiceById).put(updateInvoice).delete(deleteInvoice);

export default router;
