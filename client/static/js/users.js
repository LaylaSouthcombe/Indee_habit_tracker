//post user id to /habits/users to get current habits
const baseUrl = "http://localhost:3000/"
const habitsWrapper = document.querySelector(".habitsWrapper")

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
        e.target.nextElementSibling.textContent = data.habit_int_entry
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
        e.target.previousElementSibling.textContent = data.habit_int_entry
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
    try {
        const options = {
            method: 'PATCH',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id: habitId, habit_bln_entry: habitValue})
        }
        const response = await fetch(`${baseUrl}blns`, options);
        const data = await response.json()
        if(data.habit_bln_entry === true){
            e.target.className = "blnTrue"
        } else if(data.habit_bln_entry === false){
            e.target.className = "blnFalse"
        }
    } catch (err) {
        console.warn(err);
    }
}

async function renderTitles(habits) {
    for(let i = 0; i < habits.length; i++){
        if(habits[i].freq_unit === "days"){
            habitTodaySection.style.display = "block"
        } else if(habits[i].freq_unit === "weeks"){
            habitWeekSection.style.display = "block"
        } else if(habits[i].freq_unit === "months"){
            habitMonthSection.style.display = "block"
        }
    }
}

async function renderHabits(habit) {
    console.log(habit)
    const habitBox = document.createElement("div")
    habitBox.classList.add("habitBox")

    const habitDesc = document.createElement("p")
    habitDesc.textContent = habit.description

    const habitRepeat = document.createElement("p")
    habitRepeat.textContent = `Repeated ${habit.freq_value} times a ${habit.freq_unit.slice(0, -1)}`

    habitBox.appendChild(habitDesc)
    habitBox.appendChild(habitRepeat)
    
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
        }
        if(habit.habit_bln_entry === false){
            blnBtn.className = "blnFalse"
        }
        habitBox.append(blnBtn)
    }
    if(habit.freq_unit === "days"){
        habitTodaySection.appendChild(habitBox)
    } else if(habit.freq_unit === "weeks"){
        habitWeekSection.appendChild(habitBox)
    } else if(habit.freq_unit === "months"){
        habitMonthSection.appendChild(habitBox)
    }
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
        renderTitles(data)
        data.forEach(renderHabits)
        habitsWrapper.append(habitTodaySection, habitWeekSection, habitMonthSection)
    } catch (err) {
        console.warn(err);
    }
}
getUsersHabits()