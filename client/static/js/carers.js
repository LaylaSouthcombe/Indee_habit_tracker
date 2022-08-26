const baseUrl = "http://localhost:3000/"
const usersWrapper = document.querySelector(".usersWrapper")

const seeMoreUserInfo = (e) => {
    console.log("user id", e.target.parentElement.id)
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