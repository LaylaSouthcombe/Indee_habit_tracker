const baseUrl = "http://localhost:3000/"

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

const sendLogin = async (e) => {
    e.preventDefault()
    const url = `${baseUrl}auth/login`
    const email = loginEmail.value
    const password = loginPassword.value
   console.log(JSON.stringify({ email, password }))
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
        //   login(data.token)
        }
      } catch (err) {
        console.log(err)
      }
}

async function sendRegister(e) {
    e.preventDefault()
    //add in role
    const url = `${baseUrl}auth/user/register`
  
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
    //   login(data.token)
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

const atRender = () => {
    switchToRegister.addEventListener("click", hideLoginForm)
    switchToLogin.addEventListener("click", hideRegisterForm)
    loginBtn.addEventListener("click", sendLogin)
    registerBtn.addEventListener("click", sendRegister)
}
atRender()


