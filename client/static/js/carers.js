const baseUrl = "http://localhost:3000/"
const usersWrapper = document.querySelector(".usersWrapper")
const userSummaryModal = document.getElementById("userSummaryModal")
const seeMoreUserInfo = (e) => {
    console.log("user id", e.target.parentElement.id)
}

const closeSummaryModal = () => {
    userSummaryModal.style.display = "none"
    while (userSummaryModal.lastElementChild) {
        userSummaryModal.removeChild(userSummaryModal.lastElementChild);
    }
}

async function getUserSummary(e) {
    console.log("summary")
    // console.log(e.target.parentElement.id)
    // console.log(e.target.id)
    let userId
    if(e.target.parentElement.id){
        userId = e.target.parentElement.id
    }
    if(e.target.id){
        userId = e.target.id
    }
    console.log(userId)
    try {
        const options = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({user_id: userId})
        }
        const response = await fetch(`${baseUrl}users/summary`, options);
        console.log(response)
        const data = await response.json()
        console.log(data)
        const text = [{summaryUsersName: `${data.userFirstName} ${data.userSecondName}`}, {completedText: "Habits completed today"}, {completedHabits: `${data.numOfHabitsCompleted}/${data.numOfHabits}`}, {lastLoginText: "Last login"}, {lastLoginValue: data.lastLogin}, {weekReviewTitle: "This week in review"}]
        const graphValues = [data.daySevenPercent, data.daySixPercent, data.dayFivePercent, data.dayFourPercent, data.dayThreePercent, data.dayTwoPercent, data.dayOnePercent]
        console.log(graphValues)
        const modalCloseX = document.createElement("span")
        modalCloseX.textContent = "X"
        modalCloseX.addEventListener("click", closeSummaryModal)
        userSummaryModal.append(modalCloseX)
        console.log(text)
        text.forEach(function(el) {
            let para = document.createElement("p")
            para.className = Object.keys(el)[0]
            para.textContent = Object.values(el)[0]
            userSummaryModal.append(para)
        })

        const seeMoreDetails = document.createElement("p")

        userSummaryModal.style.display = "block"
    } catch (err) {
        console.warn(err);
    }
    
}

const renderUsers = (user) => {
    console.log(user)
    const userBox = document.createElement("div")
    userBox.id = user.user_id

    const usersName = document.createElement("p")
    usersName.textContent = `${user.userFirstName} ${user.userSecondName}`

    const userCompletedPercent = document.createElement("p")
    userCompletedPercent.textContent = Math.floor(user.percentCompleted)

    if(user.percentCompleted < 50){
        userBox.style.backgroundColor = "red"
    } else if (user.percentCompleted >= 50 && user.percentCompleted < 75){
        userBox.style.backgroundColor = "orange"
    } else if (user.percentCompleted >= 100){
        userBox.style.backgroundColor = "green"
    }

    const moreUserInfoBtn = document.createElement("button")
    moreUserInfoBtn.addEventListener("click", seeMoreUserInfo)

    userBox.append(usersName, userCompletedPercent, moreUserInfoBtn)
    usersWrapper.append(userBox)

    userBox.addEventListener("click", getUserSummary)
}

async function getAssociatedUsers() {
    const userId = localStorage.getItem('userId')
    console.log(userId)
    try {
        const options = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({user_id: userId})
        }
        const response = await fetch(`${baseUrl}carers`, options);
        console.log(response)
        const data = await response.json()
        console.log(data)
        data.forEach(renderUsers)
        // habitsWrapper.append(habitTodaySection, habitWeekSection, habitMonthSection)
    } catch (err) {
        console.warn(err);
    }
}
getAssociatedUsers()