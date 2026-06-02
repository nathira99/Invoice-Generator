import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import InvoiceHistory from "./pages/InvoiceHistory";
import Settings from "./pages/Settings";
import Trash from "./pages/Trash";
import Teachers from "./pages/Teachers";
import Staff from "./pages/Staff";


import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* PROTECTED ROUTES */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <Students />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teachers"
          element={
            <ProtectedRoute>
              <Teachers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <Staff />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/invoice-history"
          element={
            <ProtectedRoute>
              <InvoiceHistory />
            </ProtectedRoute>
          }
        />

        <Route
  path="/trash"
  element={
  <ProtectedRoute>
  <Trash />
  </ProtectedRoute>
  }
/>

      </Routes>

    </BrowserRouter>

  );

}

export default App;