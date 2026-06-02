import cron from "node-cron";
import Invoice from "../models/InvoiceModel.js";

cron.schedule("0 0 * * *", async () => {
  try {
    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(
      thirtyDaysAgo.getDate() - 30
    );

    const result = await Invoice.deleteMany({
      isDeleted: true,
      deletedAt: {
        $lt: thirtyDaysAgo,
      },
    });

    console.log(
      `Trash cleanup completed. Removed ${result.deletedCount} invoices.`
    );
  } catch (error) {
    console.error(
      "Trash cleanup failed:",
      error
    );
  }
});