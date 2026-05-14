import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import studentRoutes from "./routes/studentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin:
      "https://invoice-generator-pi-sandy.vercel.app",
  })
);
app.use(express.json());

app.use('/api/invoices', invoiceRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/teachers", teacherRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Invoice Generator API is running' });
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
