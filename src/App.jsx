import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import InvoiceHistory from "./pages/InvoiceHistory";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route path="/students" element={<Students />} />

        <Route path="/courses" element={<Courses />} />

        <Route path="/invoice-history" element={<InvoiceHistory />} />

      </Routes>

    </BrowserRouter>

  );

}

export default App;