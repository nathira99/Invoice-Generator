import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import studentRoutes from "./routes/studentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://invoice-generator-pi-sandy.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use('/api/invoices', invoiceRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/teachers", teacherRoutes);

app.use("/api/staffs", staffRoutes);

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
