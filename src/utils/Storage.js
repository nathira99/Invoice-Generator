import api from "./api";

/* ---------------- INVOICE ---------------- */

const normalizeInvoice = (invoice) => ({
  invoiceNumber: invoice.invoiceNumber || "",

  studentName: invoice.studentName || "",

  contactNumber: invoice.contactNumber || "",

  courseName: invoice.courseName || "",

  paidMonth: invoice.paidMonth || "",

  invoiceDate: invoice.invoiceDate || "",

  courseFee: Number(invoice.courseFee) || 0,

  discount: Number(invoice.discount) || 0,

  paidAmount: Number(invoice.paidAmount) || 0,

  status: invoice.status || "Pending",
});

export const saveInvoice = async (invoice) => {
  const res = await api.post("/invoices", normalizeInvoice(invoice));

  return res.data;
};

export const getInvoices = async () => {
  const res = await api.get("/invoices");

  return res.data;
};

export const updateInvoice = async (id, updatedInvoice) => {
  const res = await api.put(
    `/invoices/${id}`,
    normalizeInvoice(updatedInvoice),
  );

  return res.data;
};

export const deleteInvoice = async (id) => {
  const res = await api.delete(`/invoices/${id}`);

  return res.data;
};

export const generateInvoiceNumber = async () => {
  const invoices = await getInvoices();

  if (!Array.isArray(invoices) || invoices.length === 0) {
    return "INV-001";
  }

  const numbers = invoices.map((invoice) => {
    const match = invoice.invoiceNumber?.match(/INV-(\d+)/);

    return match ? parseInt(match[1]) : 0;
  });

  const highestNumber = Math.max(...numbers);

  const nextNumber = highestNumber + 1;

  return `INV-${String(nextNumber).padStart(3, "0")}`;
};

/* ---------------- STUDENTS ---------------- */

export const getStudents = async () => {
  const res = await api.get("/students");

  return res.data;
};

export const saveStudent = async (student) => {
  const res = await api.post("/students", student);

  return res.data;
};

export const updateStudent = async (id, updatedStudent) => {
  const res = await api.put(`/students/${id}`, updatedStudent);

  return res.data;
};

export const deleteStudent = async (id) => {
  const res = await api.delete(`/students/${id}`);

  return res.data;
};

/* ---------------- COURSES ---------------- */

export const getCourses = async () => {
  const res = await api.get("/courses");

  return res.data;
};

export const saveCourse = async (course) => {
  const res = await api.post("/courses", course);

  return res.data;
};

export const updateCourse = async (id, updatedCourse) => {
  const res = await api.put(`/courses/${id}`, updatedCourse);

  return res.data;
};

export const duplicateCourse = async (id, duplicatedCourse) => {
  const res = await api.put(`/duplicate-courses/${id}`, duplicatedCourse);

  return res.data;
};

export const deleteCourse = async (id) => {
  const res = await api.delete(`/courses/${id}`);

  return res.data;
};

/* ---------------- TEACHERS ---------------- */

export const getTeachers = async () => {
  const res = await api.get("/teachers");

  return res.data;
};

export const saveTeacher = async (teacher) => {
  const res = await api.post("/teachers", teacher);

  return res.data;
};

export const updateTeacher = async (id, updatedTeacher) => {
  const res = await api.put(`/teachers/${id}`, updatedTeacher);

  return res.data;
};

export const deleteTeacher = async (id) => {
  const res = await api.delete(`/teachers/${id}`);

  return res.data;
};

/* ---------------- STAFF ---------------- */

export const getStaffs = async () => {
  const res = await api.get("/staffs");

  return res.data;
};

export const saveStaff = async (staff) => {
  const res = await api.post("/staffs", staff);

  return res.data;
};

export const updateStaff = async (id, updatedStaff) => {
  const res = await api.put(`/staffs/${id}`, updatedStaff);

  return res.data;
};

export const deleteStaff = async (id) => {
  const res = await api.delete(`/staffs/${id}`);

  return res.data;
};
