import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import InvoiceHistory from "./pages/InvoiceHistory";
import Settings from "./pages/Settings";
import Teachers from "./pages/Teachers";
import Staff from "./pages/Staff";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/students" element={<Students />} />

        <Route path="/courses" element={<Courses />} />

        <Route path="/invoice-history" element={<InvoiceHistory />} />

        <Route path="/settings" element={<Settings />} />

        <Route path="/teachers" element={<Teachers />} />

        <Route path="/staff" element={<Staff />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
