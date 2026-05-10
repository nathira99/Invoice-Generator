export const saveInvoice = (invoice) => {

  const existingInvoices =
    JSON.parse(localStorage.getItem("invoices")) || [];

  existingInvoices.unshift(invoice);

  localStorage.setItem(
    "invoices",
    JSON.stringify(existingInvoices)
  );

};

export const getInvoices = () => {

  return JSON.parse(
    localStorage.getItem("invoices")
  ) || [];

};

export const saveStudent = (student) => {

  const existingStudents =
    JSON.parse(localStorage.getItem("students")) || [];

  existingStudents.push(student);

  localStorage.setItem(
    "students",
    JSON.stringify(existingStudents)
  );

};

export const getStudents = () => {

  return JSON.parse(
    localStorage.getItem("students")
  ) || [];

};

export const saveCourse = (course) => {

  const existingCourses =
    JSON.parse(localStorage.getItem("courses")) || [];

  existingCourses.push(course);

  localStorage.setItem(
    "courses",
    JSON.stringify(existingCourses)
  );

};

export const getCourses = () => {

  return JSON.parse(
    localStorage.getItem("courses")
  ) || [];

};

export const deleteStudent = (index) => {

  const students =
    JSON.parse(localStorage.getItem("students")) || [];

  students.splice(index, 1);

  localStorage.setItem(
    "students",
    JSON.stringify(students)
  );

};

export const updateStudent = (
  index,
  updatedStudent
) => {

  const students =
    JSON.parse(localStorage.getItem("students")) || [];

  students[index] = updatedStudent;

  localStorage.setItem(
    "students",
    JSON.stringify(students)
  );

};

export const deleteCourse = (index) => {

  const courses =
    JSON.parse(localStorage.getItem("courses")) || [];

  courses.splice(index, 1);

  localStorage.setItem(
    "courses",
    JSON.stringify(courses)
  );

};

export const updateCourse = (
  index,
  updatedCourse
) => {

  const courses =
    JSON.parse(localStorage.getItem("courses")) || [];

  courses[index] = updatedCourse;

  localStorage.setItem(
    "courses",
    JSON.stringify(courses)
  );

};
export const deleteInvoice = (index) => {

  const invoices =
    JSON.parse(localStorage.getItem("invoices")) || [];

  invoices.splice(index, 1);

  localStorage.setItem(
    "invoices",
    JSON.stringify(invoices)
  );

};

export const generateInvoiceNumber = () => {

  const invoices =
    JSON.parse(localStorage.getItem("invoices")) || [];

  if (invoices.length === 0) {

    return "INV-001";

  }

  const lastInvoice =
    invoices[0];

  const lastNumber =
    parseInt(
      lastInvoice.invoiceNumber
        .split("-")[1]
    );

  const nextNumber =
    lastNumber + 1;

  return `INV-${String(nextNumber)
    .padStart(3, "0")}`;

};

export const updateInvoice = (
  invoiceNumber,
  updatedInvoice
) => {

  const invoices =
    JSON.parse(localStorage.getItem("invoices")) || [];

  const updatedInvoices =
    invoices.map((invoice) => {

      if (
        invoice.invoiceNumber ===
        invoiceNumber
      ) {

        return updatedInvoice;

      }

      return invoice;

    });

  localStorage.setItem(
    "invoices",
    JSON.stringify(updatedInvoices)
  );

};