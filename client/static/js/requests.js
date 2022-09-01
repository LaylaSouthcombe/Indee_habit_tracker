const baseUrl = "http://localhost:3000/"
const baseClientUrl = "http://localhost:8080/"

const requestsArea = document.getElementById("requestsArea")
const requestsTitle = document.createElement("h2")
requestsTitle.textContent = "Connections"

const pendingArea = document.createElement("div")
const pendingTitle = document.createElement("h3")
pendingTitle.textContent = "Pending"
const acceptedArea = document.createElement("div")
const acceptedTitle = document.createElement("h3")
acceptedTitle.textContent = "Accepted"
const pendingRequestsEmptyPara = document.createElement("p")
pendingRequestsEmptyPara.textContent = "You have no pending requests"
const acceptedRequestsEmptyPara = document.createElement("p")
acceptedRequestsEmptyPara.textContent = "You have no accepted requests"

const requestsHeadingsArea = document.createElement("div")
const acceptedHeadingsArea = document.createElement("div")
const nameHeading = document.createElement("p")
nameHeading.textContent = "Name"
const dateSent = document.createElement("p")
dateSent.textContent = "Date sent"
const dateAccepted = document.createElement("p")
dateAccepted.textContent = "Date accepted"
requestsHeadingsArea.append(nameHeading, dateSent)
requestsHeadingsArea.style.display = "none"
acceptedHeadingsArea.append(nameHeading, dateAccepted)
acceptedHeadingsArea.style.display = "none"
pendingArea.append(pendingTitle, pendingRequestsEmptyPara, requestsHeadingsArea)
acceptedArea.append(acceptedTitle, acceptedRequestsEmptyPara, acceptedHeadingsArea)
requestsArea.append(requestsTitle, pendingArea, acceptedArea)

console.log(requestsArea)
const role = localStorage.getItem('role')
// const role = "user"
const userId = localStorage.getItem('userId')
console.log(role)
console.log(userId)
//if role == carer, get carer requests
//if role user, get user requests, render accept buttons
async function deleteRequest(request) {
    console.log(request)
}
async function answerRequest(request, response) {
    console.log(request)
    console.log(response)
}
const renderRequests = (request) => {
    const requestBox = document.createElement("div")
    const namePara = document.createElement("p")
    namePara.textContent = `${request.first_name} ${request.second_name}`
    const datePara = document.createElement("p")
    datePara.textContent = `${request.date.slice(8,10)}-${request.date.slice(5,7)}-${request.date.slice(0,4)}`
    
    requestBox.append(namePara, datePara)
    if(role === "carer"){
        const deleteConnectionBtn = document.createElement("button")
        deleteConnectionBtn.textContent = "Delete"
        deleteConnectionBtn.addEventListener("click", () => {
            deleteRequest(request)
        })
        requestBox.append(deleteConnectionBtn)
    }
    if(role === "user"){
        const declineConnectionBtn = document.createElement("button")
        declineConnectionBtn.textContent = "Decline"
        declineConnectionBtn.addEventListener("click", () => {
            answerRequest(request, "decline")
        })
        const acceptConnectionBtn = document.createElement("button")
        acceptConnectionBtn.textContent = "Accept"
        acceptConnectionBtn.addEventListener("click", () => {
            answerRequest(request, "accept")
        })
        requestBox.append(declineConnectionBtn, acceptConnectionBtn)
    }
    if(request.status === "pending"){
        pendingArea.append(requestBox)
        pendingRequestsEmptyPara.style.display = "none"
        requestsHeadingsArea.style.display = "block"
    }
    if(request.status === "accepted"){
        acceptedArea.append(requestBox)
        acceptedRequestsEmptyPara.style.display = "none"
        acceptedHeadingsArea.style.display = "block"
    }
    

}

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
    data.forEach(renderRequests)
}
getRequestsData()