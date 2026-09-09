import dotenv from 'dotenv';
import express from 'express';
import "./cron/trashCleanup.js";
import cors from 'cors';
import connectDB from './config/db.js';
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import invoiceRoutes from './routes/invoiceRoutes.js';
import studentRoutes from "./routes/studentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import googleSheetsRoutes from "./routes/googleSheetsRoutes.js";

dotenv.config();

console.log("Google credentials loaded:", {
  sheetId: !!process.env.GOOGLE_SHEET_ID,
  clientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
  privateKey: !!process.env.GOOGLE_PRIVATE_KEY,
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use('/api/invoices', invoiceRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/google-sheets", googleSheetsRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/teachers", teacherRoutes);

app.use("/api/staffs", staffRoutes);

app.use("/api/devices", deviceRoutes);

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
