const baseUrl = "http://localhost:3000/"
const baseClientUrl = "http://localhost:8080/"

//if logged in and role === carer || role === user
//else render you are not logged in message
const logo = document.getElementById("logo")
logo.addEventListener("click", () => {
    window.location.href = baseClientUrl
})
const role = localStorage.getItem('role')
// const role = "user"
const userId = localStorage.getItem('userId')
// const userId = "4"
console.log(role)
console.log(userId)
//if role == carer, get carer requests
//if role user, get user requests, render accept buttons
const closeSection = (sectionName) => {
    while (sectionName.lastElementChild) {
        sectionName.removeChild(sectionName.lastElementChild);
    }
}

const navSection = document.getElementById("navSection")
const navBtn = document.querySelector(".navBtn")

navBtn.addEventListener("click", () => {
    const navLinksDiv = document.querySelector(".navLinksDiv")
    if(navLinksDiv.style.display === "block"){
        navLinksDiv.style.display = "none"
    }else {
        navLinksDiv.style.display = "block"
    }
})

const navLinksList = document.querySelector(".navLinks")
const usersNavLink = document.createElement("li")
const usersLink = document.createElement("a")
if(role === "carer"){
    usersLink.textContent = "Indees"
}
if(role === "user"){
    usersLink.textContent = "Habits"
}
// usersLink.href = "./carer"
usersNavLink.className = "linkColor"
usersNavLink.append(usersLink)
usersNavLink.addEventListener("click", () => {
    if(role === "carer"){
        window.location.href = `${baseClientUrl}carer`
    }
    if(role === "user"){
        window.location.href = `${baseClientUrl}user`
    }
    
})

const logoutNavLink = document.createElement("li")
logoutNavLink.textContent = "Logout"
logoutNavLink.className = "linkColor"
const logUserOut = () => {
    localStorage.clear()
    window.location.href = baseClientUrl
}
logoutNavLink.addEventListener("click", logUserOut)
navLinksList.append(usersNavLink, logoutNavLink)

const requestsArea = document.getElementById("requestsArea")
const addDependentBtn = document.createElement("button")
if(role === "carer"){
    addDependentBtn.textContent = "+"
    requestsArea.append(addDependentBtn)
}

const pendingArea = document.createElement("div")
pendingArea.className = "pendingArea"
const pendingTitle = document.createElement("h3")
pendingTitle.textContent = "Pending"
const acceptedArea = document.createElement("div")
acceptedArea.className = "acceptedArea"
const acceptedTitle = document.createElement("h3")
acceptedTitle.textContent = "Accepted"
const pendingRequestsEmptyPara = document.createElement("p")
pendingRequestsEmptyPara.textContent = "You have no pending requests"
const acceptedRequestsEmptyPara = document.createElement("p")
acceptedRequestsEmptyPara.textContent = "You have no accepted requests"

const pendingRequestsDiv = document.createElement("div")
const acceptedRequestsDiv = document.createElement("div")
const requestsHeadingsArea = document.createElement("div")
const acceptedHeadingsArea = document.createElement("div")
requestsHeadingsArea.className = "requestsHeadingsArea"
acceptedHeadingsArea.className = "acceptedHeadingsArea"
const nameHeading1 = document.createElement("p")
nameHeading1.textContent = "Name"
const nameHeading2 = document.createElement("p")
nameHeading2.textContent = "Name"
const dateSent = document.createElement("p")
dateSent.textContent = "Date sent"
const dateAccepted = document.createElement("p")
dateAccepted.textContent = "Date accepted"
requestsHeadingsArea.append(nameHeading1, dateSent)
requestsHeadingsArea.style.display = "none"
acceptedHeadingsArea.append(nameHeading2, dateAccepted)
acceptedHeadingsArea.style.display = "none"
pendingArea.append(pendingTitle, pendingRequestsEmptyPara, requestsHeadingsArea, pendingRequestsDiv)
acceptedArea.append(acceptedTitle, acceptedRequestsEmptyPara, acceptedHeadingsArea, acceptedRequestsDiv)
requestsArea.append(pendingArea, acceptedArea)
const deleteConnectionModal = document.createElement("div")
deleteConnectionModal.className = "deleteConnectionModal"
console.log(requestsArea)

async function deleteRequest(request) {
    console.log(request)
    const options = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({request_id: request.id, user_id: request.user_id})
    }
    const response = await fetch(`${baseUrl}requests/delete`, options);
    const data = await response.json()
    console.log(data)
    closeSection(acceptedRequestsDiv)
    closeSection(pendingRequestsDiv)
    closeSection(deleteConnectionModal)
    getRequestsData()
}

const openDeleteWarning = (request) => {
    const deleteConnectionPara1 = document.createElement("p")
    deleteConnectionPara1.textContent = "Warning!"
    const deleteConnectionPara2 = document.createElement("p")
    let roleTerm
    if(role === "carer"){
        roleTerm = "dependent"
    }
    if(role === "user"){
        roleTerm = "carer"
    }
    deleteConnectionPara2.textContent = `Deleting this connection will remove the user as your ${roleTerm}`
    const continueBtn = document.createElement("button")
    continueBtn.textContent = "Continue"
    continueBtn.className = "continueBtn"
    continueBtn.addEventListener("click", () => {
        deleteRequest(request)
    })
    const cancelBtn = document.createElement("button")
    cancelBtn.textContent = "Cancel"
    cancelBtn.className = "cancelBtn"
    cancelBtn.addEventListener("click", (e) => {
        e.preventDefault()
        closeSection(deleteConnectionModal)
        deleteConnectionModal.remove()
    })
    deleteConnectionModal.append(deleteConnectionPara1, deleteConnectionPara2, continueBtn, cancelBtn)
    requestsArea.append(deleteConnectionModal)
}


async function answerRequest(request, responseType) {
    console.log(request)
    console.log(responseType)
    // responseType, request_id
    const options = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({request_id: request.id, responseType: responseType})
    }
    const response = await fetch(`${baseUrl}requests/respond`, options);
    const data = await response.json()
    console.log(data)
    // request_id
    closeSection(acceptedRequestsDiv)
    acceptedHeadingsArea.style.display = "none"
    closeSection(pendingRequestsDiv)
    requestsHeadingsArea.style.display = "none"
    getRequestsData()
}
const renderRequests = (request) => {
    const requestBox = document.createElement("div")
    const namePara = document.createElement("p")
    namePara.textContent = `${request.first_name} ${request.second_name}`
    const datePara = document.createElement("p")
    datePara.textContent = `${request.date.slice(8,10)}-${request.date.slice(5,7)}-${request.date.slice(0,4)}`
    requestBox.className = "requestBox"
    requestBox.append(namePara, datePara)
    if(role === "carer" || (role === "user" && request.status === "accepted")){
        const deleteConnectionBtn = document.createElement("button")
        deleteConnectionBtn.textContent = "Delete"
        deleteConnectionBtn.addEventListener("click", () => {
            openDeleteWarning(request)
        })
        requestBox.append(deleteConnectionBtn)
        // requestsHeadingsArea.style.display = "flex"
    }
    if(role === "user" && request.status === "pending"){
        const responseBtns = document.createElement("div")
        responseBtns.className = "responseBtns"
        const declineConnectionBtn = document.createElement("button")
        declineConnectionBtn.textContent = "Decline"
        declineConnectionBtn.className = "declineConnectionBtn"
        declineConnectionBtn.addEventListener("click", () => {
            answerRequest(request, "decline")
        })
        const acceptConnectionBtn = document.createElement("button")
        acceptConnectionBtn.textContent = "Accept"
        acceptConnectionBtn.className = "acceptConnectionBtn"
        acceptConnectionBtn.addEventListener("click", () => {
            answerRequest(request, "accept")
        })
        responseBtns.append(acceptConnectionBtn, declineConnectionBtn)
        requestBox.append(responseBtns)
        // acceptedHeadingsArea.style.display = "flex"
    }
    if(request.status === "pending"){
        pendingRequestsDiv.append(requestBox)
        pendingRequestsEmptyPara.style.display = "none"
        requestsHeadingsArea.style.display = "flex"
    }
    if(request.status === "accepted"){
        acceptedRequestsDiv.append(requestBox)
        acceptedRequestsEmptyPara.style.display = "none"
        acceptedHeadingsArea.style.display = "flex"
    }
}
const resultUsers = document.createElement("div")
async function addRequest(userId, resultId, addDependentModal) {
    console.log(userId, resultId)
    const options = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({carerId: userId, userId: resultId})
    }
    const response = await fetch(`${baseUrl}carers/adduser`, options);
    const data = await response.json()
    console.log(data)
    closeSection(acceptedRequestsDiv)
    closeSection(pendingRequestsDiv)
    addDependentModal.remove()
    closeSection(resultUsers)
    getRequestsData()
}

resultUsers.className = "resultUsers"
const renderResults = (result, addDependentModal) => {
    const resultDiv = document.createElement("div")
    resultDiv.className = "resultDiv"
    const resultsName = document.createElement("p")
    resultsName.textContent = `${result.first_name} ${result.second_name}`
    const addUserBtn = document.createElement("button")
    addUserBtn.textContent = "+"
    addUserBtn.addEventListener("click", () => {
        addRequest(userId, result.id, addDependentModal)
    })
    resultDiv.append(resultsName, addUserBtn)
    resultUsers.append(resultDiv)
}

async function findUser(e, addDependentModal) {
    console.log(e.target.value)
    //append results
    closeSection(resultUsers)
    if(e.target.value !== ""){
        const options = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({searchTerm: e.target.value, carerId: userId})
        }
        const response = await fetch(`${baseUrl}users`, options);
        const data = await response.json()
        console.log(data)
        if(data.length){
            data.forEach((data)=> {
                renderResults(data, addDependentModal)
            })
        }else {
            const noUsersFoundMessage = document.createElement("p")
            noUsersFoundMessage.textContent = "No users found"
            resultUsers.append(noUsersFoundMessage)
        }
    }
}

const renderAddDependentModal = () => {
    const potentialDiv = document.querySelector(".addDependentModal")
    if(!potentialDiv){
        const addDependentModal = document.createElement("div")
        addDependentModal.className = "addDependentModal"
        const closeAddDependentModal = document.createElement("span")
        closeAddDependentModal.textContent = "X"
        closeAddDependentModal.addEventListener("click", () => {
            addDependentModal.remove()
        })
        const addDependentModalTitle = document.createElement("h3")
        addDependentModalTitle.textContent = "Add a new Indee"
        const addDependentModalPara = document.createElement("p")
        addDependentModalPara.textContent = "Search by name or email"
        const userSearchBar = document.createElement("input")
        userSearchBar.type = "search"
        userSearchBar.id = "userSearch"
        userSearchBar.name = "userSearch"
        userSearchBar.addEventListener("input", (e)=>{
           findUser(e, addDependentModal)
        })
        addDependentModal.append(addDependentModalTitle, closeAddDependentModal,addDependentModalPara, userSearchBar, resultUsers)
        requestsArea.append(addDependentModal)
    }
}

if(role === "carer"){
    addDependentBtn.addEventListener("click", renderAddDependentModal )
}

async function getRequestsData() {
    // post to requests/ userId, role
    pendingRequestsEmptyPara.style.display = "block"
    acceptedRequestsEmptyPara.style.display = "block"
    requestsHeadingsArea.style.display = "none"
    acceptedHeadingsArea.style.display = "none"

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