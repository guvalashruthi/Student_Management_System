/*const form=document.getElementById("reg-form");
if (form) {
    form.addEventListener("submit",function(event){
        event.preventDefault();
        let isValid=true;
        const username=document.getElementById("username").value;
        const usernameError=document.getElementById("username-error");
if(username.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#&@_])[A-Za-z\d@#&_]{8,}$/)){
    usernameError.textContent="Username is valid";
    usernameError.style.color="green";
}else{
    usernameError.textContent="Username is not Valid";
    usernameError.style.color="red";
    isValid=false;
}
const email=document.getElementById("email").value;
const emailError=document.getElementById("email-error");
if(email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
    emailError.textContent="Email is valid";
    emailError.style.color="green";
}else{
    emailError.textContent="Email is not valid";
    emailError.style.color="red";
    isValid=false;
}
const password=document.getElementById("password").value;
const passwordError=document.getElementById("password-error");
if(password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%^&*_])[A-Za-z\d@#$%^&*!_]{8,}$/)){
    passwordError.textContent="Password is Valid";
    passwordError.style.color="green";
}else{
    passwordError.textContent="Passord is not valid give strong password";
    passwordError.style.color="red";
    isValid=false;
}
const confirmpassword=document.getElementById("confirm_password").value;
const confirmpasswordError=document.getElementById("confirm-password-error");
if(password==confirmpassword){
    confirmpasswordError.textContent="Password is same";
    confirmpasswordError.style.color="green";
}else{
    confirmpasswordError.textContent="Password is not same try again";
    confirmpasswordError.style.color="red";
    isValid=false;
}
const user={
    username,
    email,
    password
}
if(isValid){
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href="login.html";
}

    });
}

const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const logUsername = document.getElementById("username").value;
        const logpassword = document.getElementById("password").value;

        const loginUsernameError = document.getElementById("login-username-error");
        const loginPasswordError = document.getElementById("login-password-error");

    const storedUser = JSON.parse(localStorage.getItem("user"));

    let isValid = true;

    if (!storedUser) {
        alert("No registered user found. Please register first.");
        return;
    }

    if (logUsername === storedUser.username) {
        loginUsernameError.textContent = "Username matched";
        loginUsernameError.style.color = "green";
    } else {
        loginUsernameError.textContent = "Invalid username";
        loginUsernameError.style.color = "red";
        isValid = false;
    }

    if (logpassword === storedUser.password) {
        loginPasswordError.textContent = "Password matched";
        loginPasswordError.style.color = "green";
    } else {
        loginPasswordError.textContent = "Invalid password";
        loginPasswordError.style.color = "red";
        isValid = false;
    }

    if (isValid) {
        alert("Login Successful");
        window.location.href = "dashboard.html";
    }
    });
}*/