const baseUrl = "http://localhost:3000/"
const baseClientUrl = "http://localhost:8080/"
const habitsWrapper = document.querySelector(".habitsWrapper")

//if logged in and role === user
//else render you are not logged in message


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
const navLinksDiv = document.createElement("ul")
const connectionsNavLink = document.createElement("li")
const connectionsLink = document.createElement("a")
connectionsLink.textContent = "Connections"
connectionsLink.href = "./requests"
connectionsNavLink.append(connectionsLink)
const logoutNavLink = document.createElement("li")
logoutNavLink.textContent = "Logout"
const logUserOut = () => {
    console.log("log me out pls")
    localStorage.clear()
    window.location.href = baseClientUrl
}
logoutNavLink.addEventListener("click", logUserOut)
navLinksDiv.append(connectionsNavLink, logoutNavLink)
navSection.append(navLinksDiv)

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
        const currentHabitBox = document.getElementById(`habit${habitId}`)
        
        if(percentComplete <= 0.5){
            currentHabitBox.style.backgroundColor = "red"
        } else if(percentComplete > 0.5 && percentComplete <= 0.75){
            currentHabitBox.style.backgroundColor = "orange"
        } else if(percentComplete > 0.75){
            currentHabitBox.style.backgroundColor = "green"
        }
        console.log(percentComplete)
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
        const currentHabitBox = document.getElementById(`habit${habitId}`)
        
        if(percentComplete <= 0.5){
            currentHabitBox.style.backgroundColor = "red"
        } else if(percentComplete > 0.5 && percentComplete <= 0.75){
            currentHabitBox.style.backgroundColor = "orange"
        } else if(percentComplete > 0.75){
            currentHabitBox.style.backgroundColor = "green"
        }
    } catch (err) {
        console.warn(err);
    }
}

async function changeBlnValue (e) {
    const habitId = parseInt(e.target.id)
    let habitValue
    if(e.target.className === "blnFalse"){
        habitValue = true
    } else if(e.target.className === "blnTrue"){
        habitValue = false
    }
    console.log(habitId)
    try {
        const options = {
            method: 'PATCH',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id: habitId, habit_bln_entry: habitValue})
        }
        const response = await fetch(`${baseUrl}blns`, options);
        const data = await response.json()
        const currentHabitBox = document.getElementById(`habit${habitId}`)
        if(data.habit_bln_entry === true){
            e.target.className = "blnTrue"
            currentHabitBox.style.backgroundColor = "green"
        } else if(data.habit_bln_entry === false){
            e.target.className = "blnFalse"
            currentHabitBox.style.backgroundColor = "red"
        }
    } catch (err) {
        console.warn(err);
    }
}


async function renderHabits(habit) {
    console.log(habit)
    const habitBox = document.createElement("div")
    habitBox.classList.add("habitBox")

    const habitDesc = document.createElement("p")
    habitDesc.textContent = habit.description

    const habitRepeat = document.createElement("p")
    habitRepeat.textContent = `Repeated ${habit.freq_value} times a ${habit.freq_unit}`

    habitBox.appendChild(habitDesc)
    habitBox.appendChild(habitRepeat)
    habitBox.id = `habit${habit.id}`
    
    if(habit.type === "int") {
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
            habitBox.style.backgroundColor = "red"
        } else if(percentComplete > 0.5 && percentComplete <= 0.75){
            habitBox.style.backgroundColor = "orange"
        } else if(percentComplete > 0.75){
            habitBox.style.backgroundColor = "green"
        }
        const counterArea = document.createElement("div")
        const counterSection = document.createElement("div")
        counterSection.id = habit.id
        const counterTitle = document.createElement("p")
        counterTitle.textContent = "Current"
        const minusCounterBtn = document.createElement("button")
        minusCounterBtn.style.backgroundColor = "blue"
        minusCounterBtn.addEventListener("click", decreaseCounter)
        const plusCounterBtn = document.createElement("button")
        plusCounterBtn.style.backgroundColor = "green"
        plusCounterBtn.addEventListener("click", increaseCounter)
        const currentValue = document.createElement("p")
        currentValue.textContent = habit.habit_int_entry

        counterSection.append(minusCounterBtn, currentValue, plusCounterBtn)

        counterArea.appendChild(counterSection)

        habitBox.appendChild(counterArea)
    }

    if(habit.type === "boolean") {
        const blnBtn = document.createElement("button")
        blnBtn.id = habit.id
        blnBtn.addEventListener("click", changeBlnValue)
        if(habit.habit_bln_entry === true){
            blnBtn.className = "blnTrue"
            habitBox.style.backgroundColor = "green"
        }
        if(habit.habit_bln_entry === false){
            blnBtn.className = "blnFalse"
            habitBox.style.backgroundColor = "red"
        }
        habitBox.append(blnBtn)
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
const renderNoHabitsMessage = () => {
    const noHabitsPara1 = document.createElement("p")
    noHabitsPara1.textContent = "You have no habits set!"
    const noHabitsPara2 = document.createElement("p")
    noHabitsPara2.textContent = "Contact your carer to set up some new habits for you"
    noHabitsDiv.append(noHabitsPara1, noHabitsPara2)
}
async function getUsersHabits() {
    const userId = localStorage.getItem('userId')
    console.log(userId)
    try {
        const options = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({user_id: userId})
        }
        const response = await fetch(`${baseUrl}habits/users`, options);
        console.log(response)
        const data = await response.json()
        console.log(data)
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