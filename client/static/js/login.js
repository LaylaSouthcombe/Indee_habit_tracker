//generate a login form
//button to register
//generates a register form
//button click and renders login form
//post info to db
//navigate to user or carer depending on local storage
const loginFormSection = document.querySelector('.loginFormSection');
const registerFormSection = document.querySelector('.registerFormSection');
const switchToRegister = document.querySelector(".switchToRegister");
const switchToLogin = document.querySelector(".switchToLogin");


const hideLoginForm = (e) => {
    e.preventDefault()
    loginFormSection.style.display = "none"
    registerFormSection.style.display = "block"
}

const hideRegisterForm = (e) => {
    e.preventDefault()
    registerFormSection.style.display = "none"
    loginFormSection.style.display = "block"
}

const atRender = () => {
    switchToRegister.addEventListener("click", hideLoginForm)
    switchToLogin.addEventListener("click", hideRegisterForm)
}
atRender()
// // hideLoginForm()
// hideRegisterForm()
// // showLoginForm()
// // showRegisterForm()
