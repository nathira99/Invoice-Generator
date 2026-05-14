const API_URL = "https://invoice-generator-qg7s.onrender.com/api/invoices";

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
  status: invoice.status || "draft",
});

const readResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.errors?.join(", ") ||
        data.message ||
        "Invoice request failed"
    );
  }

  return data;
};

export const saveInvoice = async (invoice) => {

  const response = await fetch(
    API_URL,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(normalizeInvoice(invoice)),
    }
  );

  return readResponse(response);

};

export const getInvoices = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch invoices");
    }

    return await response.json();
  } catch (error) {
    console.error("Get Invoices Error:", error);
    return [];
  }
};

export const deleteInvoice = async (id) => {
  try {
    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: "DELETE",
      }
    );

    await readResponse(response);
    return true;
  } catch (error) {
    console.error("Delete Invoice Error:", error);
    return false;
  }
};

export const updateInvoice = async (
  id,
  updatedInvoice
) => {
  try {
    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(normalizeInvoice(updatedInvoice)),
      }
    );

    return readResponse(response);
  } catch (error) {
    console.error("Update Invoice Error:", error);
    throw error;
  }
};

export const generateInvoiceNumber = async () => {
  const invoices = await getInvoices();

  if (!invoices.length) {
    return "INV-001";
  }

  const lastInvoice = invoices[0];

  if (!lastInvoice?.invoiceNumber) {
    return "INV-001";
  }

  const lastNumber = parseInt(
    lastInvoice.invoiceNumber.split("-")[1]
  );

  const nextNumber = lastNumber + 1;

  return `INV-${String(nextNumber).padStart(3, "0")}`;
};

export const getStudents =
  async () => {

    const response =
      await fetch(
        "https://invoice-generator-qg7s.onrender.com/api/students"
      );

    return response.json();

  };

export const saveStudent =
  async (student) => {

    const response =
      await fetch(
        "https://invoice-generator-qg7s.onrender.com/api/students",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            student
          ),
        }
      );

    return response.json();

  };

export const updateStudent =
  async (
    id,
    updatedStudent
  ) => {

    const response =
      await fetch(
        `https://invoice-generator-qg7s.onrender.com/api/students/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            updatedStudent
          ),
        }
      );

    return response.json();

  };

export const deleteStudent =
  async (id) => {

    await fetch(
      `https://invoice-generator-qg7s.onrender.com/api/students/${id}`,
      {
        method: "DELETE",
      }
    );

  };

export const getCourses =
  async () => {

    const response =
      await fetch(
        "https://invoice-generator-qg7s.onrender.com/api/courses"
      );

    return response.json();

  };

export const saveCourse =
  async (course) => {

    const response =
      await fetch(
        "https://invoice-generator-qg7s.onrender.com/api/courses",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            course
          ),
        }
      );

    return response.json();

  };

export const updateCourse =
  async (
    id,
    updatedCourse
  ) => {

    const response =
      await fetch(
        `https://invoice-generator-qg7s.onrender.com/api/courses/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            updatedCourse
          ),
        }
      );

    return response.json();

  };

export const deleteCourse =
  async (id) => {

    await fetch(
      `https://invoice-generator-qg7s.onrender.com/api/courses/${id}`,
      {
        method: "DELETE",
      }
    );

  };


export const getStaffs =
  async () => {

    const response =
      await fetch(
        "https://invoice-generator-qg7s.onrender.com/api/staffs"
      );

    return response.json();

  };

export const saveStaff =
  async (staff) => {

    const response =
      await fetch(
        "https://invoice-generator-qg7s.onrender.com/api/staffs",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            staff
          ),
        }
      );

    return response.json();

  };

export const updateStaff =
  async (
    id,
    updatedStaff
  ) => {

    const response =
      await fetch(
        `https://invoice-generator-qg7s.onrender.com/api/staffs/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            updatedStaff
          ),
        }
      );

    return response.json();

  };

export const deleteStaff =
  async (id) => {

    await fetch(
      `https://invoice-generator-qg7s.onrender.com/api/staffs/${id}`,
      {
        method: "DELETE",
      }
    );

  };

  export const getTeachers =
  async () => {

    const response =
      await fetch(
        "https://invoice-generator-qg7s.onrender.com/api/teachers"
      );

    return response.json();

  };

export const saveTeacher =
  async (teacher) => {

    const response =
      await fetch(
        "https://invoice-generator-qg7s.onrender.com/api/teachers",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            teacher
          ),
        }
      );

    return response.json();

  };

export const updateTeacher =
  async (
    id,
    updatedTeacher
  ) => {

    const response =
      await fetch(
        `https://invoice-generator-qg7s.onrender.com/api/teachers/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            updatedTeacher
          ),
        }
      );

    return response.json();

  };

export const deleteTeacher =
  async (id) => {

    await fetch(
      `https://invoice-generator-qg7s.onrender.com/api/teachers/${id}`,
      {
        method: "DELETE",
      }
    );

  };