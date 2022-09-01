const baseUrl = "http://localhost:3000/"
const baseClientUrl = "http://localhost:8080/"

const requestsArea = document.getElementById("requestsArea")

console.log(requestsArea)
const role = localStorage.getItem('role')
const userId = localStorage.getItem('userId')
console.log(role)
console.log(userId)
//if role == carer, get carer requests
//if role user, get user requests, render accept buttons

async function getRequestsData() {
    // post to requests/ userId, role
    const options = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({userId: userId, role: role})
    }
    const response = await fetch(`${baseUrl}requests`, options);
    const data = await response.json()
    console.log(data)
}
getRequestsData()