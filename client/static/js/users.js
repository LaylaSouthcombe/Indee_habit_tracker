const baseUrl = "http://localhost:3000/"
const baseClientUrl = "http://localhost:8080/"
const habitsWrapper = document.querySelector(".habitsWrapper")

const logo = document.getElementById("logo")
logo.addEventListener("click", () => {
    window.location.href = baseClientUrl
})

const habitTodaySection = document.createElement("div")
const habitWeekSection = document.createElement("div")
const habitMonthSection = document.createElement("div")
habitTodaySection.style.display = "none"
habitWeekSection.style.display = "none"
habitMonthSection.style.display = "none"
const habitDayTitle = document.createElement("h2")
const habitWeekTitle = document.createElement("h2")
const habitMonthTitle = document.createElement("h2")
habitDayTitle.textContent = "Today"
habitWeekTitle.textContent = "This week"
habitMonthTitle.textContent = "This month"
habitTodaySection.appendChild(habitDayTitle)
habitWeekSection.appendChild(habitWeekTitle)
habitMonthSection.appendChild(habitMonthTitle)

const navSection = document.getElementById("navSection")
const navBtn = document.querySelector(".navBtn")

navBtn.addEventListener("click", () => {
    const navLinksDiv = document.querySelector(".navLinksDiv")
    if(navLinksDiv.style.display === "block"){
        navLinksDiv.style.display = "none"
    } else {
        navLinksDiv.style.display = "block"
    }
})

const navLinksList = document.querySelector(".navLinks")

const connectionsNavLink = document.createElement("li")
connectionsNavLink.className = "linkColor"
const connectionsLink = document.createElement("a")
connectionsLink.textContent = "Connections"
connectionsNavLink.append(connectionsLink)

const logoutNavLink = document.createElement("li")
logoutNavLink.textContent = "Logout"
logoutNavLink.className = "linkColor"
const logUserOut = () => {
    localStorage.clear()
    window.location.href = baseClientUrl
}
logoutNavLink.addEventListener("click", logUserOut)
navLinksList.append(connectionsNavLink, logoutNavLink)
connectionsNavLink.addEventListener("click", () => {
    window.location.href = `${baseClientUrl}requests`
})
const loggedIn = localStorage.getItem("loggedIn")
const role = localStorage.getItem("role")
if(loggedIn === "loggedIn" && role === "user"){
async function decreaseCounter(e) {
    const habitId = parseInt(e.target.parentElement.id)
    const habitValue = e.target.nextElementSibling.textContent - 1
    try {
        const options = {
            method: 'PATCH',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id: habitId, habit_int_entry: habitValue})
        }
        const response = await fetch(`${baseUrl}ints`, options);
        const data = await response.json()
        e.target.nextElementSibling.textContent = data.entry.habit_int_entry

        const percentComplete = data.entry.habit_int_entry / data.goal
        const currentHabitBox = document.getElementById(`habitInt${habitId}`)
        
        if(percentComplete <= 0.5){
            currentHabitBox.style.backgroundColor = "rgba(247, 52, 35, 0.8)"
        } else if(percentComplete > 0.5 && percentComplete <= 0.75){
            currentHabitBox.style.backgroundColor = "rgba(247, 130, 35, 0.8)"
        } else if(percentComplete > 0.75){
            currentHabitBox.style.backgroundColor = "rgba(152, 247, 114, 0.8)"
        }
    } catch (err) {
        console.warn(err);
    }
}

async function increaseCounter(e) {
    const habitId = parseInt(e.target.parentElement.id)
    const habitValue = parseInt(e.target.previousElementSibling.textContent) + 1
    try {
        const options = {
            method: 'PATCH',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id: habitId, habit_int_entry: habitValue})
        }
        const response = await fetch(`${baseUrl}ints`, options);
        const data = await response.json()
        e.target.previousElementSibling.textContent = data.entry.habit_int_entry

        const percentComplete = data.entry.habit_int_entry / data.goal
        const currentHabitBox = document.getElementById(`habitInt${habitId}`)
        
        if(percentComplete <= 0.5){
            currentHabitBox.style.backgroundColor = "rgba(247, 52, 35, 0.8)"
        } else if(percentComplete > 0.5 && percentComplete <= 0.75){
            currentHabitBox.style.backgroundColor = "rgba(247, 130, 35, 0.8)"
        } else if(percentComplete > 0.75){
            currentHabitBox.style.backgroundColor = "rgba(152, 247, 114, 0.8)"
        }
    } catch (err) {
        console.warn(err);
    }
}

async function changeBlnValue (e) {
    const habitId = parseInt(e.target.id)
    let habitValue
    if(e.target.className === "fa-solid fa-x"){
        habitValue = true
    } else if(e.target.className === "fa-solid fa-check"){
        habitValue = false
    }
    try {
        const options = {
            method: 'PATCH',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id: habitId, habit_bln_entry: habitValue})
        }
        const response = await fetch(`${baseUrl}blns`, options);
        const data = await response.json()
        const currentHabitBox = document.getElementById(`habitBln${habitId}`)
        if(data.habit_bln_entry === true){
            e.target.className = "fa-solid fa-check"
            currentHabitBox.style.backgroundColor = "rgba(152, 247, 114, 0.8)"
        } else if(data.habit_bln_entry === false){
            e.target.className = "fa-solid fa-x"
            currentHabitBox.style.backgroundColor = "rgba(247, 52, 35, 0.8)"
        }
    } catch (err) {
        console.warn(err);
    }
}

async function renderHabits(habit) {
    const habitBox = document.createElement("div")
    habitBox.classList.add("habitBox")
    const habitDesc = document.createElement("p")
    habitDesc.textContent = habit.description
    const habitRepeat = document.createElement("p")
    habitRepeat.textContent = `${habit.freq_value} times a ${habit.freq_unit}`

    habitBox.appendChild(habitDesc)
    habitBox.appendChild(habitRepeat)
    
    
    if(habit.type === "int") {
        habitBox.id = `habitInt${habit.id}`
        const habitGoal = document.createElement("p")
        const habitGoalValue = document.createElement("p")
        habitGoal.textContent = "Goal"
        habitGoalValue.textContent = habit.goal
        const goalSection = document.createElement("div")
        goalSection.className = "goalSection"
        goalSection.appendChild(habitGoal)
        goalSection.appendChild(habitGoalValue)
        habitBox.appendChild(goalSection)
        
        const percentComplete = habit.habit_int_entry / habit.goal
        if(percentComplete <= 0.5){
            habitBox.style.backgroundColor = "rgba(247, 52, 35, 0.8)"
        } else if(percentComplete > 0.5 && percentComplete <= 0.75){
            habitBox.style.backgroundColor = "rgba(247, 130, 35, 0.8)"
        } else if(percentComplete > 0.75){
            habitBox.style.backgroundColor = "rgba(152, 247, 114, 0.8)"
        }

        const counterSection = document.createElement("div")
        counterSection.id = habit.id
        const counterTitle = document.createElement("p")
        counterTitle.textContent = "Current"
        const minusCounterBtn = document.createElement("i")
        minusCounterBtn.className = "fa-solid fa-minus"
        minusCounterBtn.style.backgroundColor = "rgba(169, 169, 217, 0.9)"
        minusCounterBtn.addEventListener("click", decreaseCounter)
        const plusCounterBtn = document.createElement("i")
        plusCounterBtn.className = "fa-solid fa-plus"
        plusCounterBtn.style.backgroundColor = "rgba(87, 84, 236, 0.9)"
        plusCounterBtn.addEventListener("click", increaseCounter)
        const currentValue = document.createElement("p")
        currentValue.textContent = habit.habit_int_entry

        counterSection.append(minusCounterBtn, currentValue, plusCounterBtn)
        counterSection.className = "counterSection"
        habitBox.appendChild(counterSection)
    }

    if(habit.type === "boolean") {
        habitBox.id = `habitBln${habit.id}`
        const blnIcon = document.createElement("i")
        blnIcon.id = habit.id
        blnIcon.addEventListener("click", changeBlnValue)
        if(habit.habit_bln_entry === true){
            blnIcon.className = "fa-solid fa-check"
            habitBox.style.backgroundColor = "rgba(152, 247, 114, 0.8)"
        }
        if(habit.habit_bln_entry === false){
            blnIcon.className = "fa-solid fa-x"
            habitBox.style.backgroundColor = "rgba(247, 52, 35, 0.8)"
        }
        habitBox.append(blnIcon)
    }

    if(habit.freq_unit === "day"){
        habitTodaySection.appendChild(habitBox)
        habitTodaySection.style.display = "block"
    } else if(habit.freq_unit === "week"){
        habitWeekSection.appendChild(habitBox)
        habitWeekSection.style.display = "block"
    } else if(habit.freq_unit === "month"){
        habitMonthSection.appendChild(habitBox)
        habitMonthSection.style.display = "block"
    }
}

const noHabitsDiv = document.createElement("div")
noHabitsDiv.className = "noHabitsMessage"
const renderNoHabitsMessage = () => {
    const noHabitsPara1 = document.createElement("p")
    noHabitsPara1.textContent = "You have no habits set!"
    const noHabitsPara2 = document.createElement("p")
    noHabitsPara2.textContent = "Contact your carer to set up some new habits for you"
    noHabitsDiv.append(noHabitsPara1, noHabitsPara2)
}

async function getUsersHabits() {
    const userId = localStorage.getItem('userId')
    try {
        const options = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({user_id: userId})
        }
        const response = await fetch(`${baseUrl}habits/users`, options);
        const data = await response.json()
        if(data.length){
            data.forEach(renderHabits)
            habitsWrapper.append(habitTodaySection, habitWeekSection, habitMonthSection) 
        }else {
            renderNoHabitsMessage()
            habitsWrapper.append(noHabitsDiv)
        }
    } catch (err) {
        console.warn(err);
    }
}
getUsersHabits()


} else {
    const pleaseLoginModal = document.createElement("div")
    const pleaseLoginModalText = document.createElement("p")
    pleaseLoginModalText.textContent = "Please login as an Indee to view this page"
    pleaseLoginModal.className = "pleaseLoginModal"
    const redirectLink = document.createElement("a")
    redirectLink.href = "./login"
    redirectLink.className = "btn"
    redirectLink.textContent = "Take me there!"
    pleaseLoginModal.append(pleaseLoginModalText, redirectLink)
    const userPageH2 = document.getElementById("userPageH2")
    userPageH2.append(pleaseLoginModal)
}