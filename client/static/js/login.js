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


function login(person) {
    // const user = jwt_decode(person.token)
    // localStorage.setItem('token', person.token)
    localStorage.setItem('fname', person.first_name)
    localStorage.setItem('sname', person.second_name)
    localStorage.setItem('userEmail', person.email)
    localStorage.setItem('role', person.role)
    localStorage.setItem('userId', person.id)
  
    // if (btn2.classList.contains('disabled')) {
    //   btn2.classList.remove('disabled')
    //   btn3.classList.remove('disabled')
    //   loginBtn.classList.add('disabled')
    //   logoutBtn.classList.remove('disabled')
    // }
  //render page
}

const sendLogin = async (e) => {
    e.preventDefault()
    const url = `${baseUrl}auth/login`
    const email = loginEmail.value
    const password = loginPassword.value
//    console.log(JSON.stringify({ email, password }))
    try {
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({ email, password }),
          headers: {
            'Content-Type': 'application/json',
            // Authorization: token,
          },
        })
    
        const data = await response.json()
        console.log(data)
        if (data.err) {
          throw new Error(data.err)
        } else {
          console.log('app.js - data received from server after logging in: ', data)
          loginEmail.value = ''
          loginPassword.value = ''
    
          console.log('saving token to localStorage: ', { data })
          login(data.person)
          window.location.href = `${baseClientUrl}${data.person.role}`
        }
      } catch (err) {
        console.log(err)
      }
}

async function sendRegister(e) {
    e.preventDefault()
    let role
    if(userRole.checked){
        role = "user"
    }
    if(carerRole.checked){
        role = "carer"
    }
    const url = `${baseUrl}auth/${role}/register`
  
    const fname = registerFname.value
    const sname = registerSname.value
    const email = registerEmail.value
    const password = registerPassword.value

  console.log(JSON.stringify({ fname, sname, email, password }))
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ fname, sname, email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  
    const data = await response.json()
  
    if (data.err) {
      console.log('Error registering: add a pop up somewhere: ', data.err)
    } else {
      console.log(
        'app.js - data received from server after registering in: ',
        data
      )
      registerFname.value = ''
      registerSname.value = ''
      registerEmail.value = ''
      registerPassword.value = ''
  
      console.log('saving token to localStorage: ', { data })
      login(data.person)
      window.location.href = `${baseClientUrl}${data.person.role}`
    }
    // modal.classList.add('disabled')
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



