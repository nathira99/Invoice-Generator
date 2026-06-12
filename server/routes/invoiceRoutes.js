import express from 'express';
import {
  createInvoice,
  generateInvoicesByCourse,
  deleteInvoice,
  getInvoiceById,
  getInvoices,
  updateInvoice,
  getTrashedInvoices,
  restoreInvoice,
  permanentlyDeleteInvoice,
} from '../controllers/invoiceController.js';

const router = express.Router();

router.route('/').post(createInvoice).get(getInvoices);
router.post(
  "/generate-by-course",
  generateInvoicesByCourse
);
router.get(
  "/trash",
  getTrashedInvoices
);
router.put(
  "/restore/:id",
  restoreInvoice
);

router.delete(
  "/permanent/:id",
  permanentlyDeleteInvoice
);
router.route('/:id').get(getInvoiceById).put(updateInvoice).delete(deleteInvoice);


export default router;
