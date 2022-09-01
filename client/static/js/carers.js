const baseUrl = "http://localhost:3000/"
const baseClientUrl = "http://localhost:8080/"

const usersWrapper = document.querySelector(".usersWrapper")
const userSummaryModal = document.getElementById("userSummaryModal")
const userSummaryPage = document.getElementById("userSummaryPage")
Chart.register(ChartDataLabels);
function setAttributes(element, attributes) {
    Object.keys(attributes).forEach(attr => {
      element.setAttribute(attr, attributes[attr]);
    });
}
let userId

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
    moreUserInfoBtn.textContent = "..."
    userBox.append(usersName, userCompletedPercent, moreUserInfoBtn)
    usersWrapper.append(userBox)

    userBox.addEventListener("click", getUserSummary)
}

async function getAssociatedUsers() {
    const carerId = localStorage.getItem('userId')
    console.log(carerId)
    try {
        const options = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({user_id: carerId})
        }
        const response = await fetch(`${baseUrl}carers`, options);
        console.log(response)
        const data = await response.json()
        console.log(data)
        data.forEach(renderUsers)
    } catch (err) {
        console.warn(err);
    }
}
getAssociatedUsers()

let habits
let metrics
const habitTodaySection = document.createElement("div")
const habitWeekSection = document.createElement("div")
const habitMonthSection = document.createElement("div")
habitTodaySection.style.display = "none"
habitWeekSection.style.display = "none"
habitMonthSection.style.display = "none"


const habitsSummarySection = document.createElement("div")
const metricsSummarySection = document.createElement("div")
const metricsWeekSection = document.createElement("div")
const metricsMonthSection = document.createElement("div")
const metricsAllTimeSection = document.createElement("div")
metricsWeekSection.className = "metricsWeekSection"
metricsMonthSection.className = "metricsMonthSection"
metricsAllTimeSection.className = "metricsAllTimeSection"
const editCreateHabitModal = document.createElement("div")

const closeSection = (sectionName) => {
    sectionName.style.display = "none"
    while (sectionName.lastElementChild) {
        sectionName.removeChild(sectionName.lastElementChild);
    }
}
const navSection = document.getElementById("navSection")
const navLinksDiv = document.createElement("ul")
const usersNavLink = document.createElement("li")
const usersLink = document.createElement("a")
usersLink.textContent = "Users"
usersLink.href = "./carer"
usersNavLink.append(usersLink)
const connectionsNavLink = document.createElement("li")
const connectionsLink = document.createElement("a")
connectionsLink.textContent = "Connections"
connectionsLink.href = "./requests"
connectionsNavLink.append(connectionsLink)
const logoutNavLink = document.createElement("li")
logoutNavLink.textContent = "Logout"
navLinksDiv.append(usersNavLink, connectionsNavLink, logoutNavLink)
navSection.append(navLinksDiv)

const createWeekGraph = (chartName, appendedElement, data, title, axisDisplay, axisTicksDisplay, dataLabels) => {
    console.log("dataLabels", dataLabels)
    let graphValues = []
    let graphColors = []
    let graphBorders = []
        for(let i = 1; i <= Object.keys(data).length; i++){
            if(data[i].complete === 0){
                graphValues.unshift(0)
            } else {
                let  value = Math.floor((data[i].complete/data[i].total)*100)
               graphValues.unshift(value)
               if(value < 50){
                graphColors.unshift('rgba(255, 99, 132, 0.2)')
                graphBorders.unshift('rgba(255, 99, 132, 1)')
               } else if(value >= 50 && value < 75){
                graphColors.unshift('rgba(255, 167, 99, 0.2)')
                graphBorders.unshift('rgba(255, 167, 99, 1)')
               } else if(value >= 75){
                graphColors.unshift('rgba(99, 255, 112, 0.2)')
                graphBorders.unshift('rgba(99, 255, 112, 1)')
               }
            }
        }
    const past7Days = [...Array(7).keys()].map(index => {
        const date = new Date();
        date.setDate(date.getDate() - index);
        let str = date.toString()
        return `${str.substring(8,10)} ${str.substring(4,7)}`
    });

    const formattedPast7Days = past7Days.reverse()
    const myChart = document.createElement("canvas")
    myChart.id = chartName
    myChart.setAttribute("width", 300)
    myChart.setAttribute("height", 300)
    appendedElement.append(myChart)

    new Chart(myChart, {
        type: 'bar',
        data: {
            labels: formattedPast7Days,
            datasets: [{
                label: '% complete',
                data: graphValues,
                backgroundColor: graphColors,
                borderColor: graphBorders,
                borderWidth: 1,
                borderRadius: 2
            }]
        },
        options: 
            {
                plugins:{
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 16
                    }
                },
                legend: {
                    display: false
                },
                datalabels: dataLabels
            },
            scales: {
                y: {
                    display: axisDisplay,
                    ticks: {
                        display: axisTicksDisplay,
                        beginAtZero: true,
                    },
                    grid: {
                        display: false
                    },
                    suggestedMax: 100
                },
                x: {
                    grid: {
                        display: false,
                    }
                    
                }
            }
        }
    });
}

const createMixedGraph = (chartName, appendedElement, data, title, numOfDays) => {
    let graphValues = []
    let graphColors = []
        for(let i = 1; i <= Object.keys(data).length; i++){
            if(data[i].complete === 0){
                graphValues.unshift(0)
            } else {
                let  value = (data[i].complete/data[i].total)*100
               graphValues.unshift(value)
               if(value < 50){
                graphColors.unshift('rgba(255, 99, 132, 0.2)')
               } else if(value >= 50 && value < 75){
                graphColors.unshift('rgba(255, 167, 99, 0.2)')
               } else if(value >= 75){
                graphColors.unshift('rgba(99, 255, 112, 0.2)')
               }
            }
        }
    const pastDays = [...Array(numOfDays).keys()].map(index => {
        const date = new Date();
        date.setDate(date.getDate() - index);
        let str = date.toString()
        return `${str.substring(8,10)} ${str.substring(4,7)}`
    });

    const formattedPastDays = pastDays.reverse()
    const myChart = document.createElement("canvas")
    myChart.id = chartName
    myChart.setAttribute("width", 300)
    myChart.setAttribute("height", 300)
    appendedElement.append(myChart)
    new Chart(myChart, {
        data: {
            datasets: [{
                type: 'line',
                label: 'Line Dataset',
                data: graphValues,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgb(75, 192, 192)'
            },{
                type: 'bar',
                label: 'Bar Dataset',
                data: graphValues,
                backgroundColor: graphColors,
                categoryPercentage: 1.0,
                barPercentage: 1.0
            }],
            labels: formattedPastDays,
        },
        options: 
            {
            plugins:{
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 16
                    }
                },
                legend: {
                    display: false
                }, datalabels: {
                    display: false
                }
            },
            scales: {
                y: {
                    ticks: {
                        beginAtZero: true,
                        stepSize: 25
                    },
                    suggestedMax: 100,
                    grid: {
                        display: false,
                    }
                },
                x: {
                    grid: {
                        display: false,
                    }
                    
                }
            }
        }
    });
}

const renderHabitBoxes = (habit) => {
    // console.log(habit)
    
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
        
        const currentValue = document.createElement("p")
        currentValue.textContent = habit.habit_int_entry

        
        counterSection.append(currentValue)

        counterArea.appendChild(counterSection)

        habitBox.append(counterArea)
    }

    if(habit.type === "boolean") {
        const blnBtn = document.createElement("button")
        blnBtn.id = habit.id
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
    const editHabitArea = document.createElement("div")
        editHabitArea.addEventListener("click", (e) => {
            renderEditCreateHabitModal("edit", habit.id, e)
        })
        const editHabitImg = document.createElement("p")
        editHabitImg.textContent = "img"
        editHabitArea.append(editHabitImg)
        habitBox.append(editHabitArea)
        console.log(habitBox)
    if(habit.freq_unit === "day"){
        habitTodaySection.appendChild(habitBox)
        habitTodaySection.style.display = "block"
    } else if(habit.freq_unit === "week"){
        console.log("week")
        habitWeekSection.style.display = "block"
        habitWeekSection.appendChild(habitBox)
    } else if(habit.freq_unit === "month"){
        habitMonthSection.style.display = "block"
        habitMonthSection.appendChild(habitBox)
    }
}

async function getUserHabitsSummary(userId) {
    try {
        const options = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({user_id: userId})
        }
        const response = await fetch(`${baseUrl}habits/users`, options);
        const data = await response.json()
        console.log(data)
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
        data.forEach(renderHabitBoxes)
    } catch (err) {
        console.warn(err);
    }
}

async function getWeekData() {
    if(!metricsWeekSection.lastElementChild){
    closeSection(metricsMonthSection)
    closeSection(metricsAllTimeSection)
    const allHabitsOptions = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({user_id: userId, number_of_days: 7})
    }
    const allHabitsResponse = await fetch(`${baseUrl}users/summary`, allHabitsOptions);
    const allHabitsData = await allHabitsResponse.json()
    
    //for each for habits array (add summary in first, then each habit after)
    const individualHabitsOptions = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({user_id: userId, number_of_days: 7})
    }
    const individualHabitsResponse = await fetch(`${baseUrl}users/habit/summary`, individualHabitsOptions);
    const individualHabitsData = await individualHabitsResponse.json()

    individualHabitsData.dataArr.unshift({habitId: "Overall", habitTitle: "Overall", entriesData: allHabitsData.entriesData})

    let dataLabels = {display: false}
    individualHabitsData.dataArr.forEach(function(x) {
        createWeekGraph(`individualHabitsSummary habit${x.habitId}`, metricsWeekSection, x.entriesData, x.habitTitle, true, true, dataLabels)
    })
    
    metricsWeekSection.style.display = "block"
}
}

async function getMonthData() {
    if(!metricsMonthSection.lastElementChild){
    closeSection(metricsWeekSection)
    closeSection(metricsAllTimeSection)
    const allHabitsOptions = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({user_id: userId, number_of_days: 30})
    }
    const allHabitsResponse = await fetch(`${baseUrl}users/summary`, allHabitsOptions);
    const allHabitsData = await allHabitsResponse.json()

    //for each for habits array (add summary in first, then each habit after)
    const individualHabitsOptions = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({user_id: userId, number_of_days: 30})
    }
    const individualHabitsResponse = await fetch(`${baseUrl}users/habit/summary`, individualHabitsOptions);
    const individualHabitsData = await individualHabitsResponse.json()

    individualHabitsData.dataArr.unshift({habitId: "Overall", habitTitle: "Overall", entriesData: allHabitsData.entriesData})

    individualHabitsData.dataArr.forEach(function(x) {
        createMixedGraph(`individualHabitsMonthSummary habit${x.habitId}`, metricsMonthSection, x.entriesData, x.habitTitle, individualHabitsData.numOfDays)
    })
    metricsMonthSection.style.display = "block"
}
}

async function getAllTimeData() {
    if(!metricsAllTimeSection.lastElementChild){
    closeSection(metricsWeekSection)
    closeSection(metricsMonthSection)
    const allHabitsOptions = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({user_id: userId, number_of_days: "all time"})
    }
    const allHabitsResponse = await fetch(`${baseUrl}users/summary`, allHabitsOptions);
    const allHabitsData = await allHabitsResponse.json()

    //for each for habits array (add summary in first, then each habit after)
    const individualHabitsOptions = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({user_id: userId, number_of_days: "all time"})
    }
    const individualHabitsResponse = await fetch(`${baseUrl}users/habit/summary`, individualHabitsOptions);
    const individualHabitsData = await individualHabitsResponse.json()
    individualHabitsData.dataArr.unshift({habitId: "Overall", habitTitle: "Overall", entriesData: allHabitsData.entriesData})
    individualHabitsData.dataArr.forEach(function(x) {
        createMixedGraph(`individualHabitsMonthSummary habit${x.habitId}`, metricsAllTimeSection, x.entriesData, x.habitTitle, individualHabitsData.numOfDays)
    })
    metricsAllTimeSection.style.display = "block"
}
}

async function getUsersMetricsSummary() {
    
    //date buttons
    const dateBtns = document.createElement("div")
    
    const weekBtn = document.createElement("p")
    weekBtn.textContent = "Week"
    weekBtn.addEventListener("click", getWeekData)
    
    const monthBtn = document.createElement("p")
    monthBtn.textContent = "Month"
    monthBtn.addEventListener("click", getMonthData)
    
    const allTimeBtn = document.createElement("p")
    allTimeBtn.textContent = "All time"
    allTimeBtn.addEventListener("click", getAllTimeData)
    
    dateBtns.append(weekBtn, monthBtn, allTimeBtn)
    metricsSummarySection.append(dateBtns)
}

const removeUserPage = (e) =>{
    e.preventDefault()
    closeSection(userSummaryPage)
    closeSection(editCreateHabitModal)
    closeSection(habitTodaySection)
    closeSection(habitWeekSection)
    closeSection(habitMonthSection)
    closeSection(habitsSummarySection)
    closeSection(metricsSummarySection)
    history.back()
    console.log("remove page and redirect")
}

const openHabitsSection = () => {
    console.log(habitsSummarySection.style.display)
    if(habitsSummarySection.style.display === "none"){
        metricsSummarySection.style.display = "none"
        habitsSummarySection.style.display = "block"
    }
}

async function openMetricsSection() {
    // console.log("openMetricsSection")
    if(metricsSummarySection.style.display === "none"){
        habitsSummarySection.style.display = "none"
        await getWeekData()
        metricsSummarySection.style.display = "block"
    }
}

async function renderUserSummaryPage(userId) {
    await getUserHabitsSummary(userId)
    await getUsersMetricsSummary(userId)
    
    const userSummaryPageTopSection = document.createElement("div")
    userSummaryPageTopSection.className = "userSummaryPageTopSection"
    //top section
    const backBtn = document.createElement("button")
    backBtn.addEventListener("click", (e) => {
        removeUserPage(e)
    })

    const usersName = document.createElement("p")
    usersName.textContent = "users name"
    
    const createHabitDiv = document.createElement("div")
    createHabitDiv.textContent = "+"
    createHabitDiv.addEventListener("click", () => {
        renderEditCreateHabitModal("create")
    })
    
    userSummaryPageTopSection.append(backBtn, usersName, createHabitDiv)
    //habits/metrics area
    const habitsMetricsTitleDiv = document.createElement("div")
    
    const habitsTitleDiv = document.createElement("div")
    const habitsTitle = document.createElement("p")
    habitsTitle.textContent = "habits"
    habitsTitleDiv.append(habitsTitle)
    habitsTitleDiv.addEventListener("click", openHabitsSection)
    
    const metricsTitleDiv = document.createElement("div")
    const metricsTitle = document.createElement("p")
    metricsTitle.textContent = "metrics"
    metricsTitleDiv.append(metricsTitle)
    metricsTitleDiv.addEventListener("click", openMetricsSection)

    habitsMetricsTitleDiv.append(habitsTitleDiv, metricsTitleDiv)
    
    //habits area
    habitsSummarySection.append(habitTodaySection, habitWeekSection, habitMonthSection)
    habitsSummarySection.style.display = "block"

    //metrics area
    metricsSummarySection.style.display = "none"
    metricsSummarySection.append(metricsWeekSection, metricsMonthSection, metricsAllTimeSection)
    //final append
    userSummaryPage.append(userSummaryPageTopSection, habitsMetricsTitleDiv, habitsSummarySection, metricsSummarySection)
    userSummaryPage.style.display = "block"
}

async function sendEditCreateHabitRequest(method, e, habitId) {
    e.preventDefault()
    // console.log(habitFormInfo)

    const habitDescInput = document.getElementById("habitDescInput").value
    const repeatedHabitNumInput = document.getElementById("repeatedHabitNumInput").value
    const repeatedHabitUnitInput = document.getElementById("repeatedHabitUnitInput").value
    const typeOfGoalNumInput = document.getElementById("typeOfGoalNumInput")
    // const typeOfGoalBooleanInput = document.getElementById("typeOfGoalBooleanInput").value
    let goalValueInput = "1"
    let type = "boolean"
    if(typeOfGoalNumInput.checked){
        goalValueInput = document.getElementById("goalValueInput").value
        type = "int"
    }
    console.log(goalValueInput)

//add entry on create route
//change all unit to week/day/month
    const habitFormInfo = {
        description: habitDescInput,
        freq_value: repeatedHabitNumInput,
        freq_unit: repeatedHabitUnitInput,
        type: type,
        method: method,
        id: habitId,
        user_id: userId,
        goal: goalValueInput
    }

    let routeMethod = "POST"
    if(habitFormInfo.method === "edit"){
        routeMethod = "PUT"
    }
    const habitFormOptions = {
                method: routeMethod,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(habitFormInfo)
    }
    const habitFormResponse = await fetch(`${baseUrl}habits`, habitFormOptions);
    const habitFormData = await habitFormResponse.json()
    console.log(habitFormData)
    closeSection(userSummaryPage)
    closeSection(habitTodaySection)
    closeSection(habitWeekSection)
    closeSection(habitMonthSection)
    closeSection(habitsSummarySection)
    closeSection(metricsSummarySection)
    closeSection(editCreateHabitModal)
    renderUserSummaryPage(userId)
}

async function deleteHabit(habitId, e) {
    e.preventDefault()
    const habitDivChildren = document.getElementById(`habit${habitId}`).children
    let type = "boolean"
    console.log(habitDivChildren.item(2).className)
    if(habitDivChildren.item(2).className === "goalSection"){
        type = "int"
    }
    console.log("type", type)
    e.preventDefault()
    const deleteHabitOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({habit_id: habitId, type: type})
    }
    const deleteHabitResponse = await fetch(`${baseUrl}habits`, deleteHabitOptions);
    const deleteHabitData = await deleteHabitResponse.json()
    console.log(deleteHabitData)
    closeSection(userSummaryPage)
    closeSection(habitTodaySection)
    closeSection(habitWeekSection)
    closeSection(habitMonthSection)
    closeSection(habitsSummarySection)
    closeSection(metricsSummarySection)
    closeSection(editCreateHabitModal)
    renderUserSummaryPage(userId)
}

const openDeleteHabitModal = (habitId, e) => {
    const deleteHabitModal = document.createElement("div")
    const deleteHabitPara1 = document.createElement("p")
    deleteHabitPara1.textContent = "Warning!"
    const deleteHabitPara2 = document.createElement("p")
    deleteHabitPara2.textContent = "Deleting this habit will remove all entries for this habit"
    const continueBtn = document.createElement("button")
    continueBtn.textContent = "Continue"
    continueBtn.addEventListener("click", (e) => {
        deleteHabit(habitId, e)
    })
    const cancelBtn = document.createElement("button")
    cancelBtn.textContent = "Cancel"

    cancelBtn.addEventListener("click", (e) => {
        e.preventDefault()
        deleteHabitModal.remove()
    })
    deleteHabitModal.append(deleteHabitPara1, deleteHabitPara2, continueBtn, cancelBtn)
    userSummaryPage.append(deleteHabitModal)
}


async function renderEditCreateHabitModal(method, habitId, e) {
    editCreateHabitModal.className = "editCreateHabitModal"
    console.log(editCreateHabitModal)
    console.log(method)
    console.log(habitId)
    
    if(!editCreateHabitModal.lastElementChild){
        const closeEditCreateModalCross = document.createElement("span")
        closeEditCreateModalCross.addEventListener("click", () => {
            closeSection(editCreateHabitModal)
        })
        closeEditCreateModalCross.textContent = "X"
        const editCreateHabitModalTitle = document.createElement("p")
        if(method === "create"){
          editCreateHabitModalTitle.textContent = "Create new habit"  
        }
        if(method === "edit"){
            editCreateHabitModalTitle.textContent = "Edit habit"  
        }
        const editCreateHabitForm = document.createElement("form")
        
        const habitDescLabel = document.createElement("label")
        setAttributes(habitDescLabel, {for: "habitDescInput"})
        habitDescLabel.textContent = "Description"
        const habitDescInput = document.createElement("input")
        setAttributes(habitDescInput, {type: "text", id: "habitDescInput", name: "habitDescInput"})
    
        const frequencyArea = document.createElement("div")
        const repeatedHabitNumLabel = document.createElement("label")
        setAttributes(repeatedHabitNumLabel, {for: "repeatedHabitNumInput"})
        repeatedHabitNumLabel.textContent = "Repeated"
        const repeatedHabitNumInput = document.createElement("input")
        setAttributes(repeatedHabitNumInput, {type: "number", id: "repeatedHabitNumInput", name: "repeatedHabitNumInput", min: "1", step: "1", value: "1"})
        const repeatedHabitUnitLabel = document.createElement("label")
        setAttributes(repeatedHabitUnitLabel, {for: "repeatedHabitUnitInput"})
        repeatedHabitUnitLabel.textContent = "time(s) per"
        const repeatedHabitUnitInput = document.createElement("select")
        setAttributes(repeatedHabitUnitInput, {id: "repeatedHabitUnitInput", name: "repeatedHabitUnitInput"})
        const freqOptions = ["day", "week", "month"]
        freqOptions.forEach(freq => {
            const freqElement = document.createElement("option")
            freqElement.value = freq
            freqElement.textContent = freq
            repeatedHabitUnitInput.appendChild(freqElement)
        })
        
        frequencyArea.append(repeatedHabitNumLabel, repeatedHabitNumInput, repeatedHabitUnitLabel, repeatedHabitUnitInput)
        
        const goalArea = document.createElement("div")
    
        const goalValueLabel = document.createElement("label")
        setAttributes(goalValueLabel, {for: "goalValueInput"})
        goalValueLabel.textContent = "Goal"
        
        const goalValueInput = document.createElement("input")
        setAttributes(goalValueInput, {type: "number", id: "goalValueInput", name: "goalValueInput", min: "1", step: "1", value: "1"})
    
        const typeOfGoalArea = document.createElement("div")
        typeOfGoalArea.className="typeOfGoalArea"
    
        const typeOfGoalLabel = document.createElement("p")
        typeOfGoalLabel.textContent = "Goal type"
    
        const typeOfGoalNumLabel = document.createElement("label")
        const typeOfGoalNumInput = document.createElement("input")
        setAttributes(typeOfGoalNumLabel, {for: "typeOfGoalNumInput"})
        typeOfGoalNumLabel.textContent = "Number goal"
        setAttributes(typeOfGoalNumInput, {type: "radio", id: "typeOfGoalNumInput", name: "typeOfGoalInput", value: "int"})
        const typeOfGoalBooleanLabel = document.createElement("label")
        const typeOfGoalBooleanInput = document.createElement("input")
        setAttributes(typeOfGoalBooleanLabel, {for: "typeOfGoalBooleanInput"})
        typeOfGoalBooleanLabel.textContent = "Yes/no complete"
        setAttributes(typeOfGoalBooleanInput, {type: "radio", id: "typeOfGoalBooleanInput", name: "typeOfGoalInput", value: "boolean"})
    
        typeOfGoalNumInput.addEventListener('change', (e) => {
            if (e.target.checked) {
                console.log("Num is checked..");
                goalArea.append(goalValueLabel, goalValueInput)
                goalArea.style.display = "block"
            }
        });
        typeOfGoalBooleanInput.addEventListener('change', (e) => {
            if (e.target.checked) {
              console.log("Boolean is checked..");
              closeSection(goalArea)
            }
        });
    
        typeOfGoalArea.append(typeOfGoalLabel, typeOfGoalNumInput,typeOfGoalNumLabel, goalArea, typeOfGoalBooleanInput, typeOfGoalBooleanLabel)
        
    
        const submitEditCreateFormBtn = document.createElement("button")
        if(method === "create"){
            submitEditCreateFormBtn.textContent = "Create"  
        }
        if(method === "edit"){
            submitEditCreateFormBtn.textContent = "Update"  
        }
        
        submitEditCreateFormBtn.addEventListener("click", (e) => {
            sendEditCreateHabitRequest(method, e, habitId)
        })

        if(method === "edit"){
            const habitDivChildren = document.getElementById(`habit${habitId}`).children
            console.log(document.getElementById(`habit${habitId}`))
            console.log(habitDivChildren)
            
            habitDescInput.value = habitDivChildren.item(0).textContent
            repeatedHabitNumInput.value = habitDivChildren.item(1).textContent.slice(9,10)
            
            if(habitDivChildren.item(1).textContent.includes("day")){
                repeatedHabitUnitInput.value = "day"
            }
            if(habitDivChildren.item(1).textContent.includes("week")){
                repeatedHabitUnitInput.value = "week"
            }
            if(habitDivChildren.item(1).textContent.includes("month")){
                repeatedHabitUnitInput.value = "month"
            }
            if(habitDivChildren.item(2).className === "goalSection"){
                typeOfGoalNumInput.checked = true
                console.log(habitDivChildren.item(2).children.item(1).textContent)
                goalValueInput.value = habitDivChildren.item(2).children.item(1).textContent
                goalArea.append(goalValueLabel, goalValueInput)
                goalArea.style.display = "block"
            } else {
                typeOfGoalBooleanInput.checked = true
            }
            
        }

        editCreateHabitForm.append(habitDescLabel, habitDescInput, frequencyArea, typeOfGoalArea)
        editCreateHabitModal.append(editCreateHabitModalTitle, closeEditCreateModalCross, editCreateHabitForm, submitEditCreateFormBtn)
        if(method === "edit"){
            const deleteHabitBtn = document.createElement("button")
            deleteHabitBtn.textContent = "Delete habit"
            deleteHabitBtn.addEventListener("click", (e) => {
                openDeleteHabitModal(habitId, e)
            })
            editCreateHabitModal.append(deleteHabitBtn)
        }
    }
    editCreateHabitModal.style.display = "block"
    userSummaryPage.append(editCreateHabitModal)
}

window.addEventListener('hashchange', () => {
    console.log("hash")
    if(window.location.href === `${baseClientUrl}carer#user${userId}`){
        console.log(`user ${userId}`)
        usersWrapper.style.display = "none"
        renderUserSummaryPage(userId)
    }if(window.location.href === `${baseClientUrl}carer`){
        console.log("carer")
        usersWrapper.style.display = "block"
    }
});

const seeMoreUserInfo = (e) => {
    closeSection(userSummaryModal)
    console.log("user id", e.target.parentElement.id)
    userId = e.target.parentElement.id
    window.location.hash = `user${userId}`
}

async function getUserSummary(e) {
    closeSection(userSummaryModal)
    if(e.target.type !== "submit") {
    console.log("summary")
    //TODO: add in if to check if userId = e.parent...
    
    if(e.target.parentElement.id){
        userId = e.target.parentElement.id
    }
    if(e.target.id){
        userId = e.target.id
    }
    userSummaryModal.id = userId
    try {
        //post request to get summary info
        const options = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({user_id: userId, number_of_days: 7})
        }
        const response = await fetch(`${baseUrl}users/summary`, options);
        const data = await response.json()
        //declare text to be present in modal
        const formattedLoginDate = `${data.lastLogin.slice(11,19)} ${data.lastLogin.slice(8,10)}-${data.lastLogin.slice(5,7)}-${data.lastLogin.slice(0,4)}`
        const text = [{summaryUsersName: `${data.userFirstName} ${data.userSecondName}`}, {completedText: "Habits completed today"}, {completedHabits: `${data.numOfHabitsCompleted}/${data.numOfHabits}`}, {lastLoginText: "Last login"}, {lastLoginValue: formattedLoginDate}, {weekReviewTitle: "This week in review"}]
        //add map in here to convert to percentages

        
        const modalCloseX = document.createElement("span")
        modalCloseX.textContent = "X"
        modalCloseX.addEventListener("click", () => closeSection(userSummaryModal))
        userSummaryModal.append(modalCloseX)
        text.forEach(function(el) {
            let para = document.createElement("p")
            para.className = Object.keys(el)[0]
            para.textContent = Object.values(el)[0]
            userSummaryModal.append(para)
        })

        userSummaryModal.style.display = "block"
        //create the week chart
        let dataLabels = {
                color: '#36A2EB',
                anchor: 'end',
                align: 'top',
                formatter: function(value) {
                    return value + '%'
                }
        }
        createWeekGraph("carerHomeChart", userSummaryModal, data.entriesData, "% complete last 7 days", false, false, dataLabels)

        const seeMoreDetails = document.createElement("p")
        seeMoreDetails.textContent = "See more details"
        seeMoreDetails.addEventListener("click", seeMoreUserInfo)
        userSummaryModal.append(seeMoreDetails)
    } catch (err) {
        console.warn(err);
    }
}
}

