 
// ==========================================
// ClinicCare - Clinic Management System
// ==========================================

// Get saved data or create sample data
function loadData(key, defaultData) {
    const savedData = localStorage.getItem(key);

    if (savedData) {
        return JSON.parse(savedData);
    }

    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
}

let patients = loadData("clinic_patients", [
    {
        id: 1,
        name: "Ahmed Mohamed",
        age: 30,
        phone: "01012345678",
        gender: "Male"
    },
    {
        id: 2,
        name: "Sara Ali",
        age: 25,
        phone: "01123456789",
        gender: "Female"
    },
    {
        id: 3,
        name: "Omar Hassan",
        age: 40,
        phone: "01234567890",
        gender: "Male"
    }
]);

let doctors = loadData("clinic_doctors", [
    {
        id: 1,
        name: "Dr. Mohamed Adel",
        specialty: "Cardiology",
        phone: "01011112222"
    },
    {
        id: 2,
        name: "Dr. Sara Ahmed",
        specialty: "Dermatology",
        phone: "01111112222"
    },
    {
        id: 3,
        name: "Dr. Ali Hassan",
        specialty: "Dentistry",
        phone: "01211112222"
    }
]);

let appointments = loadData("clinic_appointments", [
    {
        id: 1,
        patientId: 1,
        doctorId: 1,
        date: "2026-11-01",
        time: "10:00",
        status: "Scheduled"
    },
    {
        id: 2,
        patientId: 2,
        doctorId: 2,
        date: "2026-11-02",
        time: "12:00",
        status: "Completed"
    }
]);

let bills = loadData("clinic_bills", [
    {
        id: 1,
        patientId: 1,
        description: "Consultation",
        amount: 300,
        status: "Paid"
    },
    {
        id: 2,
        patientId: 2,
        description: "Medical examination",
        amount: 200,
        status: "Unpaid"
    }
]);

// Save all data in the browser
function saveData() {
    localStorage.setItem("clinic_patients", JSON.stringify(patients));
    localStorage.setItem("clinic_doctors", JSON.stringify(doctors));
    localStorage.setItem("clinic_appointments", JSON.stringify(appointments));
    localStorage.setItem("clinic_bills", JSON.stringify(bills));
}

// Generate unique IDs
function generateId(items) {
    if (items.length === 0) {
        return 1;
    }

    return Math.max(...items.map(item => Number(item.id))) + 1;
}

// Find patient name
function getPatientName(id) {
    const patient = patients.find(item => item.id === Number(id));
    return patient ? patient.name : "Unknown Patient";
}

// Find doctor name
function getDoctorName(id) {
    const doctor = doctors.find(item => item.id === Number(id));
    return doctor ? doctor.name : "Unknown Doctor";
}

// ==========================================
// Page Navigation
// ==========================================

const navigationLinks = document.querySelectorAll(".nav-link");
const pages = document.querySelectorAll(".page");
const pageTitle = document.getElementById("page-title");

navigationLinks.forEach(link => {
    link.addEventListener("click", function (event) {
        event.preventDefault();

        const pageName = this.dataset.page;

        showPage(pageName);
    });
});

function showPage(pageName) {
    pages.forEach(page => {
        page.classList.remove("active");
    });

    navigationLinks.forEach(link => {
        link.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageName);
    const selectedLink = document.querySelector(
        `.nav-link[data-page="${pageName}"]`
    );

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    if (selectedLink) {
        selectedLink.classList.add("active");
    }

    pageTitle.textContent =
        pageName.charAt(0).toUpperCase() + pageName.slice(1);

    renderAll();
}

// Buttons that navigate to another page
document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", function () {
        showPage(this.dataset.go);
    });
});

// ==========================================
// Dashboard Statistics
// ==========================================

function renderDashboard() {
    document.getElementById("total-patients").textContent =
        patients.length;

    document.getElementById("total-appointments").textContent =
        appointments.length;

    document.getElementById("total-doctors").textContent =
        doctors.length;

    const revenue = bills
        .filter(bill => bill.status === "Paid")
        .reduce((total, bill) => total + Number(bill.amount), 0);

    document.getElementById("total-revenue").textContent =
        revenue.toLocaleString() + " EGP";

    const recentAppointments = [...appointments]
        .sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);

            return dateA - dateB;
        })
        .slice(0, 5);

    const table = document.getElementById("recent-appointments");

    if (recentAppointments.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    No appointments available.
                </td>
            </tr>
        `;
        return;
    }

    table.innerHTML = recentAppointments.map(appointment => `
        <tr>
            <td>${escapeHTML(getPatientName(appointment.patientId))}</td>
            <td>${escapeHTML(getDoctorName(appointment.doctorId))}</td>
            <td>${escapeHTML(appointment.date)}</td>
            <td>${escapeHTML(appointment.time)}</td>
            <td>${createStatus(appointment.status)}</td>
        </tr>
    `).join("");
}

// ==========================================
// Patients
// ==========================================

function renderPatients(searchTerm = "") {
    const table = document.getElementById("patients-table");

    const filteredPatients = patients.filter(patient => {
        const name = patient.name.toLowerCase();
        const phone = patient.phone.toLowerCase();
        const search = searchTerm.toLowerCase();

        return name.includes(search) || phone.includes(search);
    });

    if (filteredPatients.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    No patients found.
                </td>
            </tr>
        `;
        return;
    }

    table.innerHTML = filteredPatients.map(patient => `
        <tr>
            <td>#${patient.id}</td>
            <td>${escapeHTML(patient.name)}</td>
            <td>${escapeHTML(patient.age)}</td>
            <td>${escapeHTML(patient.phone)}</td>
            <td>${escapeHTML(patient.gender)}</td>
            <td>
                <button
                    class="action-button"
                    data-action="edit-patient"
                    data-id="${patient.id}">
                    Edit
                </button>

                <button
                    class="action-button delete"
                    data-action="delete-patient"
                    data-id="${patient.id}">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}

document.getElementById("patient-search").addEventListener(
    "input",
    function () {
        renderPatients(this.value);
    }
);

document.getElementById("add-patient-button").addEventListener(
    "click",
    () => openPatientForm()
);

document.getElementById("add-patient-shortcut").addEventListener(
    "click",
    () => {
        showPage("patients");
        openPatientForm();
    }
);

// ==========================================
// Appointments
// ==========================================

function renderAppointments(searchTerm = "") {
    const table = document.getElementById("appointments-table");

    const filteredAppointments = appointments.filter(appointment => {
        const patientName = getPatientName(
            appointment.patientId
        ).toLowerCase();

        const doctorName = getDoctorName(
            appointment.doctorId
        ).toLowerCase();

        const search = searchTerm.toLowerCase();

        return patientName.includes(search) ||
               doctorName.includes(search);
    });

    if (filteredAppointments.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    No appointments found.
                </td>
            </tr>
        `;
        return;
    }

    table.innerHTML = filteredAppointments.map(appointment => `
        <tr>
            <td>#${appointment.id}</td>
            <td>${escapeHTML(getPatientName(appointment.patientId))}</td>
            <td>${escapeHTML(getDoctorName(appointment.doctorId))}</td>
            <td>${escapeHTML(appointment.date)}</td>
            <td>${escapeHTML(appointment.time)}</td>
            <td>${createStatus(appointment.status)}</td>
            <td>
                <button
                    class="action-button"
                    data-action="edit-appointment"
                    data-id="${appointment.id}">
                    Edit
                </button>

                <button
                    class="action-button delete"
                    data-action="delete-appointment"
                    data-id="${appointment.id}">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}

document.getElementById("appointment-search").addEventListener(
    "input",
    function () {
        renderAppointments(this.value);
    }
);

document.getElementById("add-appointment-button").addEventListener(
    "click",
    () => openAppointmentForm()
);

// ==========================================
// Doctors
// ==========================================

function renderDoctors() {
    const container = document.getElementById("doctors-list");

    if (doctors.length === 0) {
        container.innerHTML = `
            <div class="content-card empty-state">
                No doctors available.
            </div>
        `;
        return;
    }

    container.innerHTML = doctors.map(doctor => `
        <div class="doctor-card">
            <div class="doctor-avatar">⚕</div>

            <h3>${escapeHTML(doctor.name)}</h3>

            <p>${escapeHTML(doctor.specialty)}</p>

            <p>${escapeHTML(doctor.phone)}</p>

            <span class="status completed">Available</span>
        </div>
    `).join("");
}

// ==========================================
// Billing
// ==========================================

function renderBilling() {
    const table = document.getElementById("billing-table");

    if (bills.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    No payments recorded.
                </td>
            </tr>
        `;
        return;
    }

    table.innerHTML = bills.map(bill => `
        <tr>
            <td>#${bill.id}</td>
            <td>${escapeHTML(getPatientName(bill.patientId))}</td>
            <td>${escapeHTML(bill.description)}</td>
            <td>${Number(bill.amount).toLocaleString()} EGP</td>
            <td>${createStatus(bill.status)}</td>
            <td>
                <button
                    class="action-button"
                    data-action="toggle-bill"
                    data-id="${bill.id}">
                    ${bill.status === "Paid" ? "Mark Unpaid" : "Mark Paid"}
                </button>

                <button
                    class="action-button delete"
                    data-action="delete-bill"
                    data-id="${bill.id}">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}

// ==========================================
// Modal Helpers
// ==========================================

const modalOverlay = document.getElementById("modal-overlay");
const modalTitle = document.getElementById("modal-title");
const modalFields = document.getElementById("modal-fields");
const modalForm = document.getElementById("modal-form");

let formSubmitHandler = null;

function openModal(title, fields, submitHandler) {
    modalTitle.textContent = title;
    modalFields.innerHTML = fields;
    formSubmitHandler = submitHandler;

    modalOverlay.classList.add("show");
}

function closeModal() {
    modalOverlay.classList.remove("show");
    modalForm.reset();
    formSubmitHandler = null;
}

document.getElementById("close-modal").addEventListener(
    "click",
    closeModal
);

document.getElementById("cancel-modal").addEventListener(
    "click",
    closeModal
);

modalOverlay.addEventListener("click", function (event) {
    if (event.target === modalOverlay) {
        closeModal();
    }
});

modalForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (formSubmitHandler) {
        formSubmitHandler(new FormData(modalForm));
    }
});

// Create a form field
function inputField(label, name, value = "", type = "text", required = true) {
    return `
        <div class="form-group">
            <label for="${name}">${label}</label>

            <input
                class="form-control"
                id="${name}"
                name="${name}"
                type="${type}"
                value="${escapeHTML(value)}"
                ${required ? "required" : ""}
            >
        </div>
    `;
}

// Create a dropdown field
function selectField(label, name, options, selectedValue = "") {
    return `
        <div class="form-group">
            <label for="${name}">${label}</label>

            <select
                class="form-control"
                id="${name}"
                name="${name}"
                required
            >
                ${options.map(option => `
                    <option
                        value="${option.value}"
                        ${String(option.value) === String(selectedValue) ? "selected" : ""}
                    >
                        ${escapeHTML(option.label)}
                    </option>
                `).join("")}
            </select>
        </div>
    `;
}

// ==========================================
// Add / Edit Patient
// ==========================================

function openPatientForm(patientId = null) {
    const patient = patientId
        ? patients.find(item => item.id === Number(patientId))
        : null;

    if (patientId && !patient) {
        showToast("Patient not found.");
        return;
    }

    const fields = `
        ${inputField("Full Name", "name", patient?.name || "")}

        ${inputField("Age", "age", patient?.age || "", "number")}

        ${inputField("Phone Number", "phone", patient?.phone || "", "tel")}

        ${selectField(
            "Gender",
            "gender",
            [
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" }
            ],
            patient?.gender || "Male"
        )}
    `;

    openModal(
        patient ? "Edit Patient" : "Add New Patient",
        fields,
        function (formData) {
            const name = formData.get("name").trim();
            const age = Number(formData.get("age"));
            const phone = formData.get("phone").trim();
            const gender = formData.get("gender");

            if (!name || !phone || !Number.isInteger(age) ||
                age < 0 || age > 120) {
                showToast("Please enter valid patient details.");
                return;
            }

            if (patient) {
                Object.assign(patient, {
                    name,
                    age,
                    phone,
                    gender
                });

                showToast("Patient updated successfully.");
            } else {
                patients.push({
                    id: generateId(patients),
                    name,
                    age,
                    phone,
                    gender
                });

                showToast("Patient added successfully.");
            }

            saveData();
            closeModal();
            renderAll();
        }
    );
}

// ==========================================
// Add / Edit Appointment
// ==========================================

function openAppointmentForm(appointmentId = null) {
    if (patients.length === 0 || doctors.length === 0) {
        showToast("Add a patient and a doctor first.");
        return;
    }

    const appointment = appointmentId
        ? appointments.find(item => item.id === Number(appointmentId))
        : null;

    if (appointmentId && !appointment) {
        showToast("Appointment not found.");
        return;
    }

    const patientOptions = patients.map(patient => ({
        value: patient.id,
        label: patient.name
    }));

    const doctorOptions = doctors.map(doctor => ({
        value: doctor.id,
        label: `${doctor.name} - ${doctor.specialty}`
    }));

    const statusOptions = [
        { value: "Scheduled", label: "Scheduled" },
        { value: "Completed", label: "Completed" },
        { value: "Cancelled", label: "Cancelled" }
    ];

    const fields = `
        ${selectField(
            "Patient",
            "patientId",
            patientOptions,
            appointment?.patientId || patients[0].id
        )}

        ${selectField(
            "Doctor",
            "doctorId",
            doctorOptions,
            appointment?.doctorId || doctors[0].id
        )}

        ${inputField(
            "Appointment Date",
            "date",
            appointment?.date || "",
            "date"
        )}

        ${inputField(
            "Appointment Time",
            "time",
            appointment?.time || "",
            "time"
        )}

        ${selectField(
            "Status",
            "status",
            statusOptions,
            appointment?.status || "Scheduled"
        )}
    `;

    openModal(
        appointment ? "Edit Appointment" : "Add Appointment",
        fields,
        function (formData) {
            const patientId = Number(formData.get("patientId"));
            const doctorId = Number(formData.get("doctorId"));
            const date = formData.get("date");
            const time = formData.get("time");
            const status = formData.get("status");

            if (!date || !time) {
                showToast("Please select a date and time.");
                return;
            }

            // Prevent overlapping appointments for the same doctor.
            const conflict = appointments.some(item => {
                return item.id !== appointment?.id &&
                    item.doctorId === doctorId &&
                    item.date === date &&
                    item.time === time &&
                    item.status === "Scheduled" &&
                    status === "Scheduled";
            });

            if (conflict) {
                showToast("This doctor already has an appointment at that time.");
                return;
            }

            if (appointment) {
                Object.assign(appointment, {
                    patientId,
                    doctorId,
                    date,
                    time,
                    status
                });

                showToast("Appointment updated successfully.");
            } else {
                appointments.push({
                    id: generateId(appointments),
                    patientId,
                    doctorId,
                    date,
                    time,
                    status
                });

                showToast("Appointment added successfully.");
            }

            saveData();
            closeModal();
            renderAll();
        }
    );
}

// ==========================================
// Add Bill
// ==========================================

function openBillForm() {
    if (patients.length === 0) {
        showToast("Add a patient first.");
        return;
    }

    const patientOptions = patients.map(patient => ({
        value: patient.id,
        label: patient.name
    }));

    const fields = `
        ${selectField(
            "Patient",
            "patientId",
            patientOptions,
            patients[0].id
        )}

        ${inputField(
            "Description",
            "description",
            "",
            "text"
        )}

        ${inputField(
            "Amount (EGP)",
            "amount",
            "",
            "number"
        )}

        ${selectField(
            "Payment Status",
            "status",
            [
                { value: "Paid", label: "Paid" },
                { value: "Unpaid", label: "Unpaid" }
            ],
            "Unpaid"
        )}
    `;

    openModal("Add New Payment", fields, function (formData) {
        const patientId = Number(formData.get("patientId"));
        const description = formData.get("description").trim();
        const amount = Number(formData.get("amount"));
        const status = formData.get("status");

        if (!description || !Number.isFinite(amount) || amount <= 0) {
            showToast("Enter a valid description and amount.");
            return;
        }

        bills.push({
            id: generateId(bills),
            patientId,
            description,
            amount,
            status
        });

        saveData();
        closeModal();
        renderAll();

        showToast("Payment added successfully.");
    });
}

document.getElementById("add-bill-button").addEventListener(
    "click",
    openBillForm
);

// ==========================================
// Table Actions
// ==========================================

document.addEventListener("click", function (event) {
    const button = event.target.closest("[data-action]");

    if (!button) {
        return;
    }

    const action = button.dataset.action;
    const id = Number(button.dataset.id);

    if (action === "edit-patient") {
        openPatientForm(id);
    }

    if (action === "delete-patient") {
        deletePatient(id);
    }

    if (action === "edit-appointment") {
        openAppointmentForm(id);
    }

    if (action === "delete-appointment") {
        deleteAppointment(id);
    }

    if (action === "toggle-bill") {
        toggleBillStatus(id);
    }

    if (action === "delete-bill") {
        deleteBill(id);
    }
});

// Delete patient
function deletePatient(id) {
    const hasAppointments = appointments.some(
        appointment => appointment.patientId === id
    );

    const hasBills = bills.some(
        bill => bill.patientId === id
    );

    if (hasAppointments || hasBills) {
        showToast("Remove this patient's appointments and bills first.");
        return;
    }

    if (!confirm("Are you sure you want to delete this patient?")) {
        return;
    }

    patients = patients.filter(patient => patient.id !== id);

    saveData();
    renderAll();

    showToast("Patient deleted successfully.");
}

// Delete appointment
function deleteAppointment(id) {
    if (!confirm("Delete this appointment?")) {
        return;
    }

    appointments = appointments.filter(
        appointment => appointment.id !== id
    );

    saveData();
    renderAll();

    showToast("Appointment deleted successfully.");
}

// Toggle bill payment status
function toggleBillStatus(id) {
    const bill = bills.find(item => item.id === id);

    if (!bill) {
        return;
    }

    bill.status = bill.status === "Paid" ? "Unpaid" : "Paid";

    saveData();
    renderAll();

    showToast("Payment status updated.");
}

// Delete bill
function deleteBill(id) {
    if (!confirm("Delete this payment record?")) {
        return;
    }

    bills = bills.filter(bill => bill.id !== id);

    saveData();
    renderAll();

    showToast("Payment deleted successfully.");
}

// ==========================================
// Helper Functions
// ==========================================

function createStatus(status) {
    const normalizedStatus = String(status).toLowerCase();

    return `
        <span class="status ${normalizedStatus}">
            ${escapeHTML(status)}
        </span>
    `;
}

// Escape user-entered text before placing it in HTML.
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => {
        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return characters[character];
    });
}

// Toast message
let toastTimer;

function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// ==========================================
// Dark Mode
// ==========================================

const themeToggle = document.getElementById("theme-toggle");

if (localStorage.getItem("clinic_theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    localStorage.setItem(
        "clinic_theme",
        isDark ? "dark" : "light"
    );

    themeToggle.textContent = isDark ? "☀️" : "🌙";
});

// ==========================================
// Render Everything
// ==========================================

function renderAll() {
    renderDashboard();
    renderPatients(document.getElementById("patient-search").value);
    renderAppointments(
        document.getElementById("appointment-search").value
    );
    renderDoctors();
    renderBilling();
}

// Start the application
renderAll();

