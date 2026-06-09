const regForm = document.getElementById("reg-form");

function setError(id, message, color) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.style.color = color;
}

function validateUsername(username) {
  if (!username || username.length < 8) return "Username must be at least 8 characters";
  if (/\s/.test(username)) return "Username must not contain spaces";
  return null;
}

function validateEmail(email) {
  if (!email) return "Email is required";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return "Wrong email id please check again";
  return null;
}

function validatePassword(password) {
  if (!password) return "Password is required";
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[@#$%!&*]/.test(password);
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!hasLower || !hasUpper || !hasNumber || !hasSpecial) return "Password must include upper, lower, number and special character (@ # $ % ! & *)";
  return null;
}

function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return "Confirm password is required";
  if (password !== confirmPassword) return "Password is not same";
  return null;
}

if (regForm) {
  regForm.addEventListener("submit", function (event) {
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmInput = document.getElementById("confirm_password");

    const isRegisterPage = !!emailInput && !!confirmInput;

    event.preventDefault();

    const username = usernameInput ? usernameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";
    const confirmPassword = confirmInput ? confirmInput.value : "";

    let isValid = true;

    if (isRegisterPage) {
      const usernameError = validateUsername(username);
      if (usernameError) {
        setError("username-error", usernameError, "red");
        isValid = false;
      } else {
        setError("username-error", "Username is valid", "green");
      }

      const emailError = validateEmail(email);
      if (emailError) {
        setError("email-error", emailError, "red");
        isValid = false;
      } else {
        setError("email-error", "Valid Email id", "green");
      }

      const passwordErrorMsg = validatePassword(password);
      if (passwordErrorMsg) {
        setError("password-error", passwordErrorMsg, "red");
        isValid = false;
      } else {
        setError("password-error", "Password is strong", "green");
      }

      const confirmErrorMsg = validateConfirmPassword(password, confirmPassword);
      if (confirmErrorMsg) {
        setError("confirm-password-error", confirmErrorMsg, "red");
        isValid = false;
      } else {
        setError("confirm-password-error", "Password is same", "green");
      }

      if (!isValid) return;

      const user = {
        username,
        email,
        password
      };

      localStorage.setItem("user", JSON.stringify(user));
      const confirmRegister = confirm("Are you sure you want to register?");
      if (confirmRegister) {
        window.location.href = "Login.html";
      }

      return;
    }

    const loginUsernameErrorEl = document.getElementById("login-username-error");
    const loginPasswordErrorEl = document.getElementById("login-password-error");

    if (!username) {
      if (loginUsernameErrorEl) {
        loginUsernameErrorEl.textContent = "Username is required";
        loginUsernameErrorEl.style.color = "red";
      }
      isValid = false;
    } else {
      if (loginUsernameErrorEl) {
        loginUsernameErrorEl.textContent = "";
        loginUsernameErrorEl.style.color = "green";
      }
    }

    if (!password) {
      if (loginPasswordErrorEl) {
        loginPasswordErrorEl.textContent = "Password is required";
        loginPasswordErrorEl.style.color = "red";
      }
      isValid = false;
    } else {
      if (loginPasswordErrorEl) {
        loginPasswordErrorEl.textContent = "";
        loginPasswordErrorEl.style.color = "green";
      }
    }

    if (!isValid) return;

    const stored = localStorage.getItem("user");
    if (!stored) {
      alert("No registered user found. Please register first.");
      return;
    }

    const user = JSON.parse(stored);
    if (user.username !== username || user.password !== password) {
     
      if (loginUsernameErrorEl) {
        loginUsernameErrorEl.textContent = "Invalid username or password";
        loginUsernameErrorEl.style.color = "red";
      }
      if (loginPasswordErrorEl) {
        loginPasswordErrorEl.textContent = "Invalid username or password";
        loginPasswordErrorEl.style.color = "red";
      }
      return;
    }

    const confirmLogin = confirm("Are you sure you want to login?");
    if (confirmLogin) {
      window.location.href = "dashboard.html";
    }
  });
}

