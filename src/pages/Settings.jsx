import { useEffect, useState } from "react";
import axios from "axios";
import {
  Building2,
  Receipt,
  BadgeDollarSign,
  Save,
  Laptop,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Admin() {
  const [devices, setDevices] = useState([]);

  const API = import.meta.env.VITE_API_URL;

  const loadDevices = async () => {
    try {
      const { data } = await axios.get(`${API}/devices`, {
        withCredentials: true,
      });

      setDevices(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const getDeviceIcon = (deviceName) => {
  const name = deviceName?.toLowerCase() || "";

  if (
    name.includes("android") ||
    name.includes("iphone")
  ) {
    return <Smartphone size={18} />;
  }

  return <Laptop size={18} />;
};

  const handleRemoveDevice = async (id) => {
    const result = await Swal.fire({
      title: "Remove Device?",
      text: "This device will need to login again.",
      icon: "warning",
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API}/devices/${id}`, {
        withCredentials: true,
      });

      loadDevices();

      toast.success("Device removed");
    } catch (error) {
      toast.error("Failed to remove device");
    }
  };

  const [adminData, setAdminData] = useState({
    instituteName: localStorage.getItem("instituteName") || "Ilmul Jannah",

    institutePhone: localStorage.getItem("institutePhone") || "",

    instituteEmail: localStorage.getItem("instituteEmail") || "",

    instituteAddress: localStorage.getItem("instituteAddress") || "",

    invoicePrefix: localStorage.getItem("invoicePrefix") || "INV",

    currency: localStorage.getItem("currency") || "Rs.",

    footerText:
      localStorage.getItem("footerText") || "Thank you for your payment.",
  });

  const handleChange = (e) => {
    setAdminData({
      ...adminData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveSettings = () => {
    Object.entries(adminData).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });

    toast.success("Settings saved successfully.");
  };

  const inputStyle =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-auto lg:ml-64">
        <Header />

        <div className="pt-28 p-4 lg:p-8 lg:pt-8">
          {/* PAGE HEADER */}

          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                Admin Settings
              </h1>

              <p className="mt-1 text-sm font-medium text-slate-500">
                Manage institute preferences and invoice configuration
              </p>
            </div>

            {/* STATUS CARD */}

            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <BadgeDollarSign size={24} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  System Status
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Active & Running
                </h2>
              </div>
            </div>
          </div>

          {/* GRID */}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* LEFT SIDE */}

            <div className="space-y-6 xl:col-span-2">
              {/* INSTITUTE */}

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <Building2 size={22} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Institute Information
                    </h2>

                    <p className="text-sm text-slate-500">
                      Basic institute details and contact information
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Institute Name
                    </label>

                    <input
                      type="text"
                      name="instituteName"
                      value={adminData.instituteName}
                      onChange={handleChange}
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Phone Number
                    </label>

                    <input
                      type="text"
                      name="institutePhone"
                      value={adminData.institutePhone}
                      onChange={handleChange}
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="instituteEmail"
                      value={adminData.instituteEmail}
                      onChange={handleChange}
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Address
                    </label>

                    <input
                      type="text"
                      name="instituteAddress"
                      value={adminData.instituteAddress}
                      onChange={handleChange}
                      className={inputStyle}
                    />
                  </div>
                </div>
              </div>

              {/* INVOICE SETTINGS */}

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                    <Receipt size={22} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Invoice Settings
                    </h2>

                    <p className="text-sm text-slate-500">
                      Configure invoice appearance and defaults
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Invoice Prefix
                    </label>

                    <input
                      type="text"
                      name="invoicePrefix"
                      value={adminData.invoicePrefix}
                      onChange={handleChange}
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Currency
                    </label>

                    <input
                      type="text"
                      name="currency"
                      value={adminData.currency}
                      onChange={handleChange}
                      className={inputStyle}
                    />
                  </div>
                </div>
              </div>
              
{/* SAVE */}

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <button
                  onClick={
                    handleSaveSettings
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg"
                >

                  <Save
                    size={18}
                  />

                  Save Settings

                </button>

                <p className="mt-4 text-center text-xs font-medium text-slate-400">
                  Changes are stored locally in browser storage
                </p>

              </div>
            </div>

            


            {/* RIGHT SIDE */}

<div className="space-y-6">

  {/* DEVICE SECURITY */}

  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Device Security
        </h2>

        <p className="text-sm text-slate-500">
          Manage authorized devices
        </p>
      </div>

      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
        {devices.length}/10 Devices
      </span>
    </div>

    <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
      <div className="flex items-center gap-3">
        <ShieldCheck className="text-emerald-600" />

        <div>
          <p className="font-semibold text-emerald-800">
            Account Protected
          </p>

          <p className="text-sm text-emerald-600">
            Device limit enabled
          </p>
        </div>
      </div>
    </div>

    <div className="mt-5 space-y-3">
      {devices.length === 0 ? (
        <p className="text-sm text-slate-500">
          No devices found
        </p>
      ) : (
        devices.map((device) => (
          <div
            key={device._id}
            className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
          >
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                {getDeviceIcon(device.deviceName)}
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  {device.deviceName}
                </p>

                <p className="text-xs text-slate-500">
                  Last Login:{" "}
                  {new Date(device.lastLogin).toLocaleString()}
                </p>
              </div>

            </div>

            <button
              onClick={() =>
                handleRemoveDevice(device._id)
              }
              className="rounded-xl bg-red-100 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-200"
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>

  </div>

</div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Admin;


// {  "instituteName": "Ilmul Jannah",

//   "institutePhone": "03000000000",  

//   "instituteAddress": "Address",
  
//   "invoicePrefix": "INV",

//   "currency": "Rs.",  }