const form=document.getElementById("reg-form");
form.addEventListener("submit",function(event){
    let isValid=true;
    event.preventDefault(); 
    const username=document.getElementById("username").value;
    console.log(username);
    const usernameError=document.getElementById("username-error");
    if(username.length<8){
        usernameError.textContent="Username must be of 8 characters";
        usernameError.style.color="red";
        isValid=false;
    }else{
        usernameError.textContent="Username is valid";
        usernameError.style.color="green";
        
    }
    const email=document.getElementById("email").value;
    console.log(email);
    const emailError=document.getElementById("email-error");
    const atPosition=email.indexOf("@");
    const dotposition=email.lastIndexOf(".");
    if(email.includes("@") && dotposition>atPosition){
        emailError.textContent="Valid Email id";
        emailError.style.color="green";
        
        
    }else{
        emailError.textContent="Wrong email id please chack again";
        emailError.style.color="red";
        isValid=false;
    }
    const password=document.getElementById("password").value;
    const passwordError=document.getElementById("password-error");
    const passwordHasUpperCase=password.match(/[A-Z]/);
    const passwordHasLowerCase=password.match(/[a-z]/);
    const passwordHasNumbers=password.match(/[0-9]/);
   const passwordHasSpecialCharecter=password.match(/[@#$%!&*]/);
    if(password.length>=8 && passwordHasLowerCase && passwordHasUpperCase && passwordHasNumbers && passwordHasSpecialCharecter){
        passwordError.textContent="Password is strong";
        passwordError.style.color="green";
      
    }else{
        passwordError.textContent="Password is weak give strong password";
        passwordError.style.color="red"; 
        isValid=false;  
    }
    const confirmpassword=document.getElementById('confirm_password').value;
    const confirmpasswordError=document.getElementById('confirm-password-error');
    if(password==confirmpassword){
        confirmpasswordError.textContent="Password is same";
        confirmpasswordError.style.color="green";
       
    }else{
        confirmpasswordError.textContent="Password is not same";
        confirmpasswordError.style.color="red";
        isValid=false;
    }
    const user = {
    username: username,
    email: email,
    password: password
    };
    
    if(isValid){

    localStorage.setItem("user", JSON.stringify(user));

    const confirmRegister = confirm("Are you sure you want to register?");

            if(confirmRegister){
            window.location.href = "Login.html";
            }

        }
    


    
});
