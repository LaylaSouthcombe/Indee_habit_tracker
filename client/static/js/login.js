const baseUrl = "http://localhost:3000/"
const baseClientUrl = "http://localhost:8080/"


const homeSection = document.getElementById("home")
homeSection.addEventListener("click", () => {
    window.location.href = baseClientUrl
})
const logo = document.getElementById("logo")
logo.addEventListener("click", () => {
    window.location.href = baseClientUrl
})

const loginFormSection = document.querySelector('.loginFormSection');
const registerFormSection = document.querySelector('.registerFormSection');
const switchToRegister = document.querySelector(".switchToRegister");
const switchToLogin = document.querySelector(".switchToLogin");
const loginBtn = document.querySelector("#loginBtn");
const registerBtn = document.querySelector("#registerBtn");

const loginEmail = document.querySelector("#loginEmail");
const loginPassword = document.querySelector("#loginPassword");

const registerEmail = document.querySelector("#registerEmail");
const registerPassword = document.querySelector("#registerPassword");
const registerFname = document.querySelector("#registerFname");
const registerSname = document.querySelector("#registerSname");

const userRole = document.querySelector("#userRole");
const carerRole = document.querySelector("#carerRole");
const errorPopUp = document.createElement("div")
const errorPopUpIcon = document.createElement("i")
const errorPopUpText = document.createElement("p")
errorPopUpIcon.className = ""
errorPopUp.className = ""
errorPopUpText.textContent = ""
const errorTriangle = document.createElement("div")
errorTriangle.clasName = "triangle-after"
errorPopUp.append(errorPopUpIcon, errorPopUpText, errorTriangle)
const mainSection = document.querySelector("main")
mainSection.append(errorPopUp)

function login(person) {
  localStorage.setItem('fname', person.first_name)
  localStorage.setItem('sname', person.second_name)
  localStorage.setItem('userEmail', person.email)
  localStorage.setItem('role', person.role)
  localStorage.setItem('userId', person.id)
  localStorage.setItem('loggedIn', "loggedIn")
}
const removeErrorMsg = () => {
  setTimeout(function(){
    errorPopUp.className = ""
    errorPopUpIcon.className = ""
    errorPopUpText.textContent = ""
  }, 3000)
}
const sendLogin = async (e) => {
    e.preventDefault()
    const email = loginEmail.value
    const password = loginPassword.value
    if(!email.includes("@")){
        errorPopUp.className = "loginEmailError errorMsg"
        errorPopUpIcon.className = "fa-solid fa-triangle-exclamation"
        errorPopUpText.textContent = "Please enter a valid email address"
        removeErrorMsg()
    } else if(password === "") {
      errorPopUp.className = "loginPasswordError errorMsg"
      errorPopUpText.textContent = "Please enter a password"
      errorPopUpIcon.className = "fa-solid fa-triangle-exclamation"
      removeErrorMsg()
    } else {
      try {
          const response = await fetch(`${baseUrl}auth/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
              'Content-Type': 'application/json',
            },
          })
          const data = await response.json()
          if (data.err) {
            throw new Error(data.err)
          } else {
            loginEmail.value = ''
            loginPassword.value = ''
            login(data.person)
            window.location.href = `${baseClientUrl}${data.person.role}`
          }
        } catch (err) {
          console.log(err)
          errorPopUp.className = "loginEmailError errorMsg"
        }
    }
}

async function sendRegister(e) {
  e.preventDefault()
  const fname = registerFname.value
  const sname = registerSname.value
  const email = registerEmail.value
  const password = registerPassword.value

  if(!email.includes("@")){
    errorPopUp.className = "regEmailError errorMsg"
    errorPopUpText.textContent = "Please enter a valid email address"
    errorPopUpIcon.className = "fa-solid fa-triangle-exclamation"
    removeErrorMsg()
  } else if (password === "") {
    errorPopUp.className = "regPasswordError errorMsg"
    errorPopUpText.textContent = "Please enter a password"
    errorPopUpIcon.className = "fa-solid fa-triangle-exclamation"
    removeErrorMsg()
  } else if (fname === "") {
    errorPopUp.className = "regFNameError errorMsg"
    errorPopUpText.textContent = "Please enter your first name"
    errorPopUpIcon.className = "fa-solid fa-triangle-exclamation"
    removeErrorMsg()
  } else if (sname === "") {
    errorPopUp.className = "regSNameError errorMsg"
    errorPopUpText.textContent = "Please enter your second name"
    errorPopUpIcon.className = "fa-solid fa-triangle-exclamation"
    removeErrorMsg()
  } else {
    try {
      let role
      if(userRole.checked){
          role = "user"
      }
      if(carerRole.checked){
          role = "carer"
      }
      const response = await fetch(`${baseUrl}auth/${role}/register`, {
        method: 'POST',
        body: JSON.stringify({ fname, sname, email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
    
      if (data.err) {
        errorPopUp.className = "regEmailError errorMsg"
        errorPopUpIcon.className = "fa-solid fa-triangle-exclamation"
      } else {
        registerFname.value = ''
        registerSname.value = ''
        registerEmail.value = ''
        registerPassword.value = ''
        login(data.person)
        window.location.href = `${baseClientUrl}${data.person.role}`
      }
    } catch(err){
      console.log(err)
        errorPopUp.className = "loginEmailError"
    }
  }
}

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

switchToRegister.addEventListener("click", hideLoginForm)
switchToLogin.addEventListener("click", hideRegisterForm)
loginBtn.addEventListener("click", sendLogin)
registerBtn.addEventListener("click", sendRegister)