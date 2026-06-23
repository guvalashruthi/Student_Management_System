const API_URL = "http://localhost:7006";



function validateUsername(username) {
    return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(username);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
    return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%&]).{8,}$/.test(password);
}

function validateStudentName(name) {
    return /^[A-Za-z ]+$/.test(name);
}

function validateCGPA(cgpa) {
    return !Number.isNaN(cgpa) && cgpa >= 0 && cgpa <= 10;
}

function validateStudentBranch(branch) {
    return /^[A-Za-z ]+$/.test(branch);
}

/* ---------------- LOGIN SESSION ---------------- */

function getLoggedUser() {
    const value = localStorage.getItem("loggedUser");
    return value ? JSON.parse(value) : null;
}

function setLoggedUser(user) {
    localStorage.setItem("loggedUser", JSON.stringify(user));
}

function clearLoggedUser() {
    localStorage.removeItem("loggedUser");
}

async function ensureLoggedIn() {
    const user = getLoggedUser();

    if (!user) {
        window.location.href = "Login.html";
        return null;
    }

    return user;
}

/* ---------------- REGISTER ---------------- */

const registerForm = document.getElementById("reg-form");

if (registerForm && document.getElementById("email")) {
    registerForm.addEventListener("submit", registerUser);
}

async function registerUser(e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirm = document.getElementById("confirm_password").value.trim();

    if (!validateUsername(username)) {
        alert("Username must contain uppercase, lowercase, number and minimum 8 chars");
        return;
    }

    if (!validateEmail(email)) {
        alert("Invalid Email");
        return;
    }

    if (!validatePassword(password)) {
        alert("Weak Password");
        return;
    }

    if (password !== confirm) {
        alert("Passwords do not match");
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/appuser/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            }
        );

        if (!response.ok) {
            throw new Error();
        }

        alert("Registration Successful");
        window.location.href = "Login.html";

    } catch (error) {
        alert("Registration Failed");
    }
}

/* ---------------- LOGIN ---------------- */

const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", loginUser);
}

async function loginUser(e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    try {

        const response = await fetch(
            `${API_URL}/appuser/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            }
        );

        if (!response.ok) {
            alert("Invalid Credentials");
            return;
        }

        setLoggedUser({
            username
        });

        alert("Login Successful");
        window.location.href = "dashboard.html";

    } catch (error) {
        alert("Login Failed");
    }
}

/* ---------------- STUDENT FORM ---------------- */

const studentForm = document.getElementById("student-form");

if (studentForm) {
    studentForm.addEventListener(
        "submit",
        handleStudentFormSubmit
    );
}

async function handleStudentFormSubmit(e) {

    e.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    const cgpa =
        Number(
            document.getElementById("cgpa").value.trim()
        );

    const branch =
        document.getElementById("branch").value.trim();

    if (!validateStudentName(name)) {
        alert("Only letters allowed in Name");
        return;
    }

    if (!validateCGPA(cgpa)) {
        alert("CGPA should be between 0 and 10");
        return;
    }

    if (!validateStudentBranch(branch)) {
        alert("Branch should contain only letters");
        return;
    }

    const params =
        new URLSearchParams(window.location.search);

    const id = params.get("id");

    if (id) {
        await updateStudent(
            id,
            {
                name,
                cgpa,
                branch
            }
        );
    }
    else {
        await createStudent(
            {
                name,
                cgpa,
                branch
            }
        );
    }
}

/* ---------------- CREATE STUDENT ---------------- */

async function createStudent(studentData) {

    try {

        const response =
            await fetch(
                `${API_URL}/appstudent`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(studentData)
                }
            );

        if (!response.ok) {
            throw new Error();
        }

        alert("Student Added");

        window.location.href =
            "viewstudents.html";

    } catch (error) {

        alert("Failed To Add Student");
    }
}

/* ---------------- UPDATE STUDENT ---------------- */

async function updateStudent(id, studentData) {

    try {

        const response =
            await fetch(
                `${API_URL}/appstudent/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(studentData)
                }
            );

        if (!response.ok) {
            throw new Error();
        }

        alert("Student Updated");

        window.location.href =
            "viewstudents.html";

    } catch (error) {

        alert("Update Failed");
    }
}

/* ---------------- VIEW STUDENTS ---------------- */

async function loadStudents() {

    const table =
        document.getElementById("student-table");

    if (!table) return;

    try {

        const response =
            await fetch(
                `${API_URL}/appstudent`
            );

        const students =
            await response.json();

        table.innerHTML = "";

        if (students.length === 0) {

            table.innerHTML =
                `<tr>
                    <td colspan="5">
                        No Students Found
                    </td>
                </tr>`;

            return;
        }

        students.forEach(student => {

            table.innerHTML += `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.cgpa}</td>
                    <td>${student.branch}</td>
                    <td>
                        <button onclick="editStudent(${student.id})">
                            Edit
                        </button>

                        <button onclick="deleteStudent(${student.id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {

        console.error(error);
    }
}

/* ---------------- DELETE STUDENT ---------------- */

async function deleteStudent(id) {

    const confirmed =
        confirm("Delete Student?");

    if (!confirmed) return;

    await fetch(
        `${API_URL}/appstudent/${id}`,
        {
            method: "DELETE"
        }
    );

    await loadStudents();
}

/* ---------------- EDIT STUDENT ---------------- */

function editStudent(id) {

    window.location.href =
        `editstudents.html?id=${id}`;
}

async function loadStudentData() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const id = params.get("id");

    if (!id) return;

    const response =
        await fetch(
            `${API_URL}/appstudent/${id}`
        );

    const student =
        await response.json();

    document.getElementById("name").value =
        student.name;

    document.getElementById("cgpa").value =
        student.cgpa;

    document.getElementById("branch").value =
        student.branch;
}

/* ---------------- DASHBOARD ---------------- */

async function loadDashboard() {

    if (
        !window.location.pathname
            .toLowerCase()
            .includes("dashboard")
    ) return;

    const greeting =
        document.getElementById("reg");

    if (!greeting) return;

    const user =
        await ensureLoggedIn();

    if (!user) return;

    greeting.textContent =
        `Welcome to the Dashboard, ${user.username}`;
}

/* ---------------- LOGOUT ---------------- */

function handleLogoutPage() {

    if (
        !window.location.pathname
            .toLowerCase()
            .includes("logout")
    ) return;

    clearLoggedUser();
}

/* ---------------- INIT ---------------- */

async function initPage() {

    const pathname =
        window.location.pathname.toLowerCase();

    if (
        pathname.includes("dashboard") ||
        pathname.includes("addstudents") ||
        pathname.includes("viewstudents") ||
        pathname.includes("editstudents")
    ) {
        await ensureLoggedIn();
    }

    await loadStudents();
    await loadStudentData();
    await loadDashboard();
    handleLogoutPage();
}

initPage();