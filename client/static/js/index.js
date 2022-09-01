const baseUrl = "http://localhost:3000/"
const baseClientUrl = "http://localhost:8080/"

const loginSection = document.getElementById("login")
loginSection.addEventListener("click", () => {
    window.location.href = `${baseClientUrl}login`
})