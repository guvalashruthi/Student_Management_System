// =======================
// VALIDATIONS
// =======================

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

// =======================
// STORAGE HELPERS
// =======================

async function readStorage(key) {
    return new Promise(resolve => {
        const value = localStorage.getItem(key);
        resolve(value ? JSON.parse(value) : []);
    });
}

async function writeStorage(key, value) {
    return new Promise(resolve => {
        localStorage.setItem(key, JSON.stringify(value));
        resolve();
    });
}

async function getUsers() {
    return await readStorage('users');
}

async function createUser(user) {
    const users = await getUsers();
    users.push(user);
    await writeStorage('users', users);
    return user;
}

async function getStudents() {
    return await readStorage('students');
}

async function createStudentRecord(student) {
    const students = await getStudents();
    students.push(student);
    await writeStorage('students', students);
    return student;
}

async function updateStudentRecord(recordId, student) {
    const students = await getStudents();
    const index = students.findIndex(s => s.recordId === recordId);
    if (index === -1) {
        throw new Error('Student not found');
    }
    students[index] = { recordId, ...student };
    await writeStorage('students', students);
    return students[index];
}

async function deleteStudentRecord(recordId) {
    const students = await getStudents();
    const updated = students.filter(s => s.recordId !== recordId);
    await writeStorage('students', updated);
    return updated;
}

function getLoggedUser() {
    const value = localStorage.getItem('loggedUser');
    return value ? JSON.parse(value) : null;
}

function setLoggedUser(user) {
    localStorage.setItem('loggedUser', JSON.stringify(user));
}

function clearLoggedUser() {
    localStorage.removeItem('loggedUser');
}

async function ensureLoggedIn() {
    const user = getLoggedUser();
    if (!user) {
        window.location.href = 'Login.html';
        return null;
    }
    return user;
}


// =======================
// REGISTER
// =======================

const registerForm = document.getElementById('reg-form');

if (registerForm && document.getElementById('email')) {
    registerForm.addEventListener('submit', registerUser);
}

async function registerUser(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirm = document.getElementById('confirm_password').value.trim();

    if (!validateUsername(username)) {
        alert('Username must contain uppercase, lowercase, number and minimum 8 chars');
        return;
    }

    if (!validateEmail(email)) {
        alert('Invalid Email');
        return;
    }

    if (!validatePassword(password)) {
        alert('Weak Password');
        return;
    }

    if (password !== confirm) {
        alert('Passwords do not match');
        return;
    }

    const users = await getUsers();
    const exists = users.find(user => user.email === email || user.username === username);

    if (exists) {
        alert('Username or email already exists');
        return;
    }

    await createUser({
        id: Date.now().toString(),
        username,
        email,
        password
    });

    alert('Registration Successful');
    window.location.href = 'Login.html';
}


// =======================
// LOGIN
// =======================

const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', loginUser);
}

async function loginUser(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    const users = await getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        alert('Invalid Credentials');
        return;
    }

    setLoggedUser(user);
    alert('Login Successful');
    window.location.href = 'dashboard.html';
}


// =======================
// STUDENT FORM
// =======================

const studentForm = document.getElementById('student-form');

if (studentForm) {
    studentForm.addEventListener('submit', handleStudentFormSubmit);
}

async function handleStudentFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const sid = document.getElementById('id').value.trim();
    const cgpaValue = document.getElementById('cgpa').value.trim();
    const branch = document.getElementById('branch').value.trim();
    const cgpa = Number(cgpaValue);

    if (!validateStudentName(name)) {
        alert('Only letters and spaces are allowed for Name');
        return;
    }

    if (!sid) {
        alert('Student ID is required');
        return;
    }

    if (!validateCGPA(cgpa)) {
        alert('CGPA should be a number between 0 and 10');
        return;
    }

    if (!validateStudentBranch(branch)) {
        alert('Branch should contain only letters and spaces');
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const recordId = params.get('id');

    if (recordId) {
        return await updateStudent(recordId, { name, sid, cgpa, branch });
    }

    return await createStudent({ name, sid, cgpa, branch });
}

async function createStudent(studentData) {
    const students = await getStudents();
    const exists = students.find(s => s.sid === studentData.sid);

    if (exists) {
        alert('Student ID already exists');
        return;
    }

    await createStudentRecord({
        recordId: Date.now().toString(),
        ...studentData
    });

    alert('Student Added');
    window.location.href = 'viewstudents.html';
}

async function updateStudent(recordId, studentData) {
    const students = await getStudents();
    const index = students.findIndex(s => s.recordId === recordId);

    if (index === -1) {
        alert('Student not found');
        return;
    }

    const duplicate = students.find(s => s.sid === studentData.sid && s.recordId !== recordId);
    if (duplicate) {
        alert('Another student already uses this ID');
        return;
    }

    await updateStudentRecord(recordId, studentData);

    alert('Student Updated');
    window.location.href = 'viewstudents.html';
}


// =======================
// VIEW STUDENTS
// =======================

async function loadStudents() {
    const table = document.getElementById('student-table');
    if (!table) return;

    const students = await getStudents();
    table.innerHTML = '';

    if (students.length === 0) {
        table.innerHTML = '<tr><td colspan="5">No students found.</td></tr>';
        return;
    }

    students.forEach(student => {
        table.innerHTML += `
            <tr>
                <td>${student.sid}</td>
                <td>${student.name}</td>
                <td>${student.cgpa}</td>
                <td>${student.branch}</td>
                <td>
                    <button type="button" onclick="editStudent('${student.recordId}')">Edit</button>
                    <button type="button" onclick="deleteStudent('${student.recordId}')">Delete</button>
                </td>
            </tr>
        `;
    });
}


// =======================
// DELETE STUDENT
// =======================

async function deleteStudent(recordId) {
    const confirmed = confirm('Delete Student?');
    if (!confirmed) return;

    await deleteStudentRecord(recordId);
    await loadStudents();
}


// =======================
// EDIT STUDENT
// =======================

function editStudent(recordId) {
    window.location.href = `editstudents.html?id=${recordId}`;
}

async function loadStudentData() {
    const params = new URLSearchParams(window.location.search);
    const recordId = params.get('id');
    if (!recordId) return;

    const students = await getStudents();
    const student = students.find(s => s.recordId === recordId);
    if (!student) return;

    document.getElementById('name').value = student.name;
    document.getElementById('id').value = student.sid;
    document.getElementById('cgpa').value = student.cgpa;
    document.getElementById('branch').value = student.branch;
}


// =======================
// DASHBOARD
// =======================

async function loadDashboard() {
    if (!window.location.pathname.toLowerCase().includes('dashboard')) return;

    const greeting = document.getElementById('reg');
    if (!greeting) return;

    const user = await ensureLoggedIn();
    if (!user) return;

    greeting.textContent = `Welcome to the Dashboard, ${user.username}`;
}


// =======================
// LOGOUT
// =======================

function handleLogoutPage() {
    if (!window.location.pathname.toLowerCase().includes('logout')) return;
    clearLoggedUser();
}


// =======================
// PAGE INITIALIZATION
// =======================

async function initPage() {
    const pathname = window.location.pathname.toLowerCase();

    if (
        pathname.includes('dashboard') ||
        pathname.includes('addstudents') ||
        pathname.includes('viewstudents') ||
        pathname.includes('editstudents')
    ) {
        await ensureLoggedIn();
    }

    await loadStudents();
    await loadStudentData();
    await loadDashboard();
    handleLogoutPage();
}

initPage();