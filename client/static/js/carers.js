const baseUrl = "http://localhost:3000/"
const baseClientUrl = "http://localhost:8080/"

const logo = document.getElementById("logo")
logo.addEventListener("click", () => {
    window.location.href = baseClientUrl
})
const navSection = document.getElementById("navSection")
const navBtn = document.querySelector(".navBtn")
const navLinksDiv = document.querySelector(".navLinksDiv")
navBtn.addEventListener("click", () => {
    
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

if(loggedIn === "loggedIn" && role === "carer"){

const usersWrapper = document.querySelector(".usersWrapper")
const userSummaryModal = document.getElementById("userSummaryModal")
const userSummaryPage = document.getElementById("userSummaryPage")

let habits
let metrics
let userId
let usersNameText

const carerPageH2 = document.getElementById("carerPageH2")
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

Chart.register(ChartDataLabels);
function setAttributes(element, attributes) {
    Object.keys(attributes).forEach(attr => {
      element.setAttribute(attr, attributes[attr]);
    });
}

const renderUsers = (user) => {
    const userBox = document.createElement("div")
    userBox.id = user.user_id
    userBox.className = "userToplineSummary"
    const usersName = document.createElement("p")
    usersName.textContent = `${user.userFirstName} ${user.userSecondName}`
    const userCompletedPercent = document.createElement("p")
    userCompletedPercent.textContent = Math.floor(user.percentCompleted)

    if(user.percentCompleted < 50){
        userBox.style.backgroundColor = "rgb(255, 69, 66)"
    } else if (user.percentCompleted >= 50 && user.percentCompleted < 75){
        userBox.style.backgroundColor = "rgb(247, 130, 35)"
    } else if (user.percentCompleted >= 100){
        userBox.style.backgroundColor = "rgb(152, 247, 114)"
    }

    const moreUserInfoBtn = document.createElement("div")
    const moreUserIcon = document.createElement("img")
    moreUserIcon.src = "./static/images/ellipsis.png"
    moreUserInfoBtn.className = "moreUserInfoBtn"
    moreUserInfoBtn.append(moreUserIcon)
    moreUserInfoBtn.id = user.user_id
    moreUserIcon.className = "moreUserIcon"
    moreUserInfoBtn.addEventListener("click", (e) => {
        usersNameText = `${user.userFirstName} ${user.userSecondName}`
        seeMoreUserInfo(e) 
    })
    userBox.append(usersName, userCompletedPercent, moreUserInfoBtn)
    usersWrapper.append(userBox)
    userBox.addEventListener("click", getUserSummary)
}

const renderNoUsersMessage = () =>{
    const noUsersMessage = document.createElement("div")
    noUsersMessage.className = "noUsersMessage"
    const noUsersMessageParas = document.createElement("div")
    const noUsersMessagePara1 = document.createElement("p")
    noUsersMessagePara1.textContent = "You have no associated Indees yet!"
    const noUsersMessagePara2 = document.createElement("p")
    noUsersMessagePara2.textContent = "Navigate to the connections page to get started"
    const takeMeThereBtn = document.createElement("button")
    takeMeThereBtn.textContent = "Take me there!"
    takeMeThereBtn.className = "takeMeThereBtn"
    takeMeThereBtn.addEventListener("click", () => {
        window.location.href = `${baseClientUrl}requests`
    })
    noUsersMessageParas.append(noUsersMessagePara1, noUsersMessagePara2)
    noUsersMessage.append(noUsersMessageParas,takeMeThereBtn)
    usersWrapper.append(noUsersMessage)
}

async function getAssociatedUsers() {
    const carerId = localStorage.getItem('userId')
    try {
        const options = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({user_id: carerId})
        }
        const response = await fetch(`${baseUrl}carers`, options);
        const data = await response.json()
        if(data.length){
           data.forEach(renderUsers) 
        }else{
            renderNoUsersMessage()
        }
    } catch (err) {
        console.warn(err);
    }
}
getAssociatedUsers()


const closeSection = (sectionName) => {
    sectionName.style.display = "none"
    while (sectionName.lastElementChild) {
        sectionName.removeChild(sectionName.lastElementChild);
    }
}



const createWeekGraph = (chartName, appendedElement, data, title, axisDisplay, axisTicksDisplay) => {
    let color
    if(appendedElement.classList.contains("userSummaryModal")){
        color = "#d9d9d9"
    } else {
        color = "rgb(43, 43, 43)"
    }
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
    myChart.setAttribute("height", 250)
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
                        size: 18
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                },
                legend: {
                    display: false
                },
                datalabels: {
                    color: '#d9d9d9',
                    anchor: 'end',
                    align: 'top',
                    formatter: function(value) {
                        return value + '%'
                    }
            }
            },
            scales: {
                y: {
                    display: axisDisplay,
                    ticks: {
                        display: axisTicksDisplay,
                        beginAtZero: true,
                        color: color,
                        stepSize: 25
                    },
                    grid: {
                        display: false
                    },
                    suggestedMax: 100
                },
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        color: color
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
                backgroundColor: 'rgba(205, 205, 245, 0.2)'
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
                        size: 18
                    },
                    padding: {
                        top: 10,
                        bottom: 30
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
                        stepSize: 25,
                    },
                    beginAtZero: true,
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
    const habitBox = document.createElement("div")
    habitBox.classList.add("habitBox")
    const habitDesc = document.createElement("p")
    habitDesc.textContent = habit.description
    const habitRepeat = document.createElement("p")
    habitRepeat.textContent = `${habit.freq_value} times a ${habit.freq_unit}`
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
            habitBox.style.backgroundColor = "rgb(255, 69, 66)"
        } else if(percentComplete > 0.5 && percentComplete <= 0.75){
            habitBox.style.backgroundColor = "rgb(247, 130, 35)"
        } else if(percentComplete > 0.75){
            habitBox.style.backgroundColor = "rgb(152, 247, 114)"
        }

        const counterArea = document.createElement("div")
        counterArea.className = "currentValueSection"
        const counterTitle = document.createElement("p")
        counterTitle.textContent = "Current"
        const currentValue = document.createElement("p")
        currentValue.textContent = habit.habit_int_entry
        counterArea.append(counterTitle, currentValue)
        habitBox.append(counterArea)
    }

    if(habit.type === "boolean") {
        const blnIcon = document.createElement("i")
        blnIcon.id = habit.id
        if(habit.habit_bln_entry === true){
            blnIcon.className = "fa-solid fa-check"
            habitBox.style.backgroundColor = "rgb(152, 247, 114)"
        }           
        if(habit.habit_bln_entry === false){
            blnIcon.className = "fa-solid fa-x"
            habitBox.style.backgroundColor = "rgb(255, 69, 66)"
        }
        habitBox.append(blnIcon)
    }
    const editHabitArea = document.createElement("div")
        editHabitArea.addEventListener("click", (e) => {
            renderEditCreateHabitModal("edit", habit.id, e)
        })
        const editHabitIcon = document.createElement("i")
        editHabitIcon.className = "fa-regular fa-pen-to-square"
        editHabitArea.append(editHabitIcon)
        habitBox.append(editHabitArea)
    if(habit.freq_unit === "day"){
        habitTodaySection.appendChild(habitBox)
        habitTodaySection.style.display = "block"
    } else if(habit.freq_unit === "week"){
        habitWeekSection.style.display = "block"
        habitWeekSection.appendChild(habitBox)
    } else if(habit.freq_unit === "month"){
        habitMonthSection.style.display = "block"
        habitMonthSection.appendChild(habitBox)
    }
}

const noHabitsDiv = document.createElement("div")
const renderNoHabitsMessage = () => {
    noHabitsDiv.style.display = "block"
    noHabitsDiv.className = "noHabitsDiv"
    const noHabitsPara1 = document.createElement("p")
    noHabitsPara1.textContent = "This Indee has no habits set!"
    const noHabitsPara2 = document.createElement("p")
    noHabitsPara2.textContent = "Click the create habit button to create some for them"
    noHabitsDiv.append(noHabitsPara1, noHabitsPara2)
    userSummaryPage.append(noHabitsDiv)
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
        if(data.length){
            data.forEach(renderHabitBoxes)
        }else {
            renderNoHabitsMessage()
        }
    } catch (err) {
        console.warn(err);
    }
}

async function getWeekData() {
    if(!metricsWeekSection.lastElementChild){
        try {
            closeSection(metricsMonthSection)
            closeSection(metricsAllTimeSection)
            const allHabitsOptions = {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({user_id: userId, number_of_days: 7})
            }
            const allHabitsResponse = await fetch(`${baseUrl}users/summary`, allHabitsOptions);
            const allHabitsData = await allHabitsResponse.json()
            const individualHabitsOptions = {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({user_id: userId, number_of_days: 7})
            }
            const individualHabitsResponse = await fetch(`${baseUrl}users/habit/summary`, individualHabitsOptions);
            const individualHabitsData = await individualHabitsResponse.json()
            individualHabitsData.dataArr.unshift({habitId: "Overall", habitTitle: "Overall", entriesData: allHabitsData.entriesData})
            individualHabitsData.dataArr.forEach(function(x) {
                createWeekGraph(`individualHabitsSummary-habit${x.habitId}`, metricsWeekSection, x.entriesData, x.habitTitle, true, true)
            })
            metricsWeekSection.style.display = "block"
        } catch (err) {
            console.warn(err);
        }
    }
}

async function getMonthData() {
    if(!metricsMonthSection.lastElementChild){
        try {
            closeSection(metricsWeekSection)
            closeSection(metricsAllTimeSection)
            const allHabitsOptions = {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({user_id: userId, number_of_days: 30})
            }
            const allHabitsResponse = await fetch(`${baseUrl}users/summary`, allHabitsOptions);
            const allHabitsData = await allHabitsResponse.json()
            const individualHabitsOptions = {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({user_id: userId, number_of_days: 30})
            }
            const individualHabitsResponse = await fetch(`${baseUrl}users/habit/summary`, individualHabitsOptions);
            const individualHabitsData = await individualHabitsResponse.json()
            individualHabitsData.dataArr.unshift({habitId: "Overall", habitTitle: "Overall", entriesData: allHabitsData.entriesData})
            individualHabitsData.dataArr.forEach(function(x) {
                createMixedGraph(`individualHabitsMonthSummary-habit${x.habitId}`, metricsMonthSection, x.entriesData, x.habitTitle, individualHabitsData.number_of_days)
            })
            metricsMonthSection.style.display = "block"
        } catch (err) {
            console.warn(err);
        }
    }
}

async function getAllTimeData() {
    if(!metricsAllTimeSection.lastElementChild){
        try {
            closeSection(metricsWeekSection)
            closeSection(metricsMonthSection)
            const allHabitsOptions = {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({user_id: userId, number_of_days: "all time"})
            }
            const allHabitsResponse = await fetch(`${baseUrl}users/summary`, allHabitsOptions);
            const allHabitsData = await allHabitsResponse.json()
            const individualHabitsOptions = {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({user_id: userId, number_of_days: "all time"})
            }
            const individualHabitsResponse = await fetch(`${baseUrl}users/habit/summary`, individualHabitsOptions);
            const individualHabitsData = await individualHabitsResponse.json()
            individualHabitsData.dataArr.unshift({habitId: "Overall", habitTitle: "Overall", entriesData: allHabitsData.entriesData})
            individualHabitsData.dataArr.forEach(function(x) {
                createMixedGraph(`individualHabitsMonthSummary-habit${x.habitId}`, metricsAllTimeSection, x.entriesData, x.habitTitle, individualHabitsData.number_of_days)
            })
            metricsAllTimeSection.style.display = "block"
        } catch (err) {
            console.warn(err);
        }
    }
}

async function getUsersMetricsSummary() {
    const dateBtns = document.createElement("div")
    const weekBtn = document.createElement("p")
    weekBtn.textContent = "Week"
    weekBtn.className = "weekBtn activeDateBtn"
    const monthBtn = document.createElement("p")
    monthBtn.textContent = "Month"
    monthBtn.className = "monthBtn"
    const allTimeBtn = document.createElement("p")
    allTimeBtn.textContent = "All time"
    allTimeBtn.className = "allTimeBtn"

    weekBtn.addEventListener("click", () => {
        monthBtn.classList.remove("activeDateBtn")
        allTimeBtn.classList.remove("activeDateBtn")
        weekBtn.classList.add("activeDateBtn")
        getWeekData()
    })
    monthBtn.addEventListener("click", () => {
        weekBtn.classList.remove("activeDateBtn")
        allTimeBtn.classList.remove("activeDateBtn")
        monthBtn.classList.add("activeDateBtn")
        getMonthData()
    })
    allTimeBtn.addEventListener("click", () => {
        monthBtn.classList.remove("activeDateBtn")
        weekBtn.classList.remove("activeDateBtn")
        allTimeBtn.classList.add("activeDateBtn")
        getAllTimeData()
    })
    
    dateBtns.append(weekBtn, monthBtn, allTimeBtn)
    dateBtns.className = "dateBtns"
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
    closeSection(noHabitsDiv)
    history.back()
}

const openHabitsSection = () => {
    if(habitsSummarySection.style.display === "none"){
        const habitsTitleDiv = document.querySelector(".habitsTitleDiv")
        habitsTitleDiv.classList.add("activeTitleDiv")
        const metricsTitleDiv = document.querySelector(".metricsTitleDiv")
        metricsTitleDiv.classList.remove("activeTitleDiv")
        metricsSummarySection.style.display = "none"
        habitsSummarySection.style.display = "block"
    }
}

async function openMetricsSection() {
    if(metricsSummarySection.style.display === "none"){
        const habitsTitleDiv = document.querySelector(".habitsTitleDiv")
        habitsTitleDiv.classList.remove("activeTitleDiv")
        const metricsTitleDiv = document.querySelector(".metricsTitleDiv")
        metricsTitleDiv.classList.add("activeTitleDiv")
        habitsSummarySection.style.display = "none"
        await getWeekData()
        metricsSummarySection.style.display = "block"
    }
}

async function renderUserSummaryPage(userId, usersNameTitle) {
    await getUserHabitsSummary(userId)
    await getUsersMetricsSummary(userId)
    
    const userSummaryPageTopSection = document.createElement("div")
    userSummaryPageTopSection.className = "userSummaryPageTopSection"

    const backBtn = document.createElement("div")
    const backBtnIcon = document.createElement("i")
    backBtnIcon.className = "fa-solid fa-arrow-left"
    backBtn.append(backBtnIcon)
    backBtn.addEventListener("click", (e) => {
        removeUserPage(e)
    })

    const usersName = document.createElement("p")
    usersName.textContent = usersNameTitle
    usersName.classList = "usersName"
    const createHabitDiv = document.createElement("div")
    createHabitDiv.textContent = "+"
    createHabitDiv.addEventListener("click", () => {
        renderEditCreateHabitModal("create")
    })
    
    userSummaryPageTopSection.append(backBtn, usersName, createHabitDiv)

    const habitsMetricsTitleDiv = document.createElement("div")
    habitsMetricsTitleDiv.className = "habitsMetricsTitleDiv"
    const habitsTitleDiv = document.createElement("div")
    habitsTitleDiv.className = "habitsTitleDiv activeTitleDiv"
    const habitsTitle = document.createElement("p")
    habitsTitle.textContent = "Habits"
    habitsTitleDiv.append(habitsTitle)
    habitsTitleDiv.addEventListener("click", openHabitsSection)
    
    const metricsTitleDiv = document.createElement("div")
    metricsTitleDiv.className = "metricsTitleDiv"
    const metricsTitle = document.createElement("p")
    metricsTitle.textContent = "Metrics"
    metricsTitleDiv.append(metricsTitle)
    metricsTitleDiv.addEventListener("click", openMetricsSection)

    habitsMetricsTitleDiv.append(habitsTitleDiv, metricsTitleDiv)
    
    habitsSummarySection.append(habitTodaySection, habitWeekSection, habitMonthSection)
    habitsSummarySection.style.display = "block"
    habitsSummarySection.className = "habitsSummarySection"

    metricsSummarySection.style.display = "none"
    metricsSummarySection.className = "metricsSummarySection"
    metricsSummarySection.append(metricsWeekSection, metricsMonthSection, metricsAllTimeSection)

    userSummaryPage.append(userSummaryPageTopSection, habitsMetricsTitleDiv, habitsSummarySection, metricsSummarySection)
    userSummaryPage.style.display = "block"
}

async function sendEditCreateHabitRequest(method, e, habitId) {
    e.preventDefault()
    try {
        const usersNameSection = document.querySelector(".usersName")
        usersNameText = usersNameSection.textContent
        const habitDescInput = document.getElementById("habitDescInput").value
        const repeatedHabitNumInput = document.getElementById("repeatedHabitNumInput").value
        const repeatedHabitUnitInput = document.getElementById("repeatedHabitUnitInput").value
        const typeOfGoalNumInput = document.getElementById("typeOfGoalNumInput")
        let goalValueInput = "1"
        let type = "boolean"

        if(typeOfGoalNumInput.checked){
            goalValueInput = document.getElementById("goalValueInput").value
            type = "int"
        }

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
        await habitFormResponse.json()
        closeSection(userSummaryPage)
        closeSection(habitTodaySection)
        closeSection(habitWeekSection)
        closeSection(habitMonthSection)
        closeSection(habitsSummarySection)
        closeSection(metricsSummarySection)
        closeSection(editCreateHabitModal)
        renderUserSummaryPage(userId, usersNameText)
    } catch (err) {
        console.warn(err);
    }
}

async function deleteHabit(habitId, e) {
    e.preventDefault()
    try {
        const usersNameSection = document.querySelector(".usersName")
        usersNameText = usersNameSection.textContent
        const habitDivChildren = document.getElementById(`habit${habitId}`).children
        let type = "boolean"
        if(habitDivChildren.item(2).className === "goalSection"){
            type = "int"
        }
        const deleteHabitOptions = {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({habit_id: habitId, type: type})
        }
        const deleteHabitResponse = await fetch(`${baseUrl}habits`, deleteHabitOptions);
        await deleteHabitResponse.json()
        closeSection(userSummaryPage)
        closeSection(habitTodaySection)
        closeSection(habitWeekSection)
        closeSection(habitMonthSection)
        closeSection(habitsSummarySection)
        closeSection(metricsSummarySection)
        closeSection(editCreateHabitModal)
        renderUserSummaryPage(userId, usersNameText)
    } catch (err) {
        console.warn(err);
    }
}

const openDeleteHabitModal = (habitId) => {
    const deleteHabitModal = document.createElement("div")
    deleteHabitModal.className = "deleteHabitModal"
    const deleteHabitPara1 = document.createElement("p")
    deleteHabitPara1.textContent = "Warning!"
    const deleteHabitPara2 = document.createElement("p")
    deleteHabitPara2.textContent = "Deleting this habit will remove all entries for this habit"
    const continueBtn = document.createElement("button")
    continueBtn.textContent = "Continue"
    continueBtn.addEventListener("click", (e) => {
        deleteHabit(habitId, e)
    })
    continueBtn.className = "continueBtn"
    const cancelBtn = document.createElement("button")
    cancelBtn.textContent = "Cancel"
    cancelBtn.className = "cancelBtn"
    cancelBtn.addEventListener("click", (e) => {
        e.preventDefault()
        deleteHabitModal.remove()
    })
    deleteHabitModal.append(deleteHabitPara1, deleteHabitPara2, continueBtn, cancelBtn)
    userSummaryPage.append(deleteHabitModal)
}


async function renderEditCreateHabitModal(method, habitId, e) {
    editCreateHabitModal.className = "editCreateHabitModal"    
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
        setAttributes(habitDescInput, {type: "text", id: "habitDescInput", name: "habitDescInput", maxlength: "30"})
        habitDescInput.setAttribute('required', '')
        const frequencyArea = document.createElement("div")
        frequencyArea.className = "frequencyArea"
        const repeatedHabitNumLabel = document.createElement("label")
        setAttributes(repeatedHabitNumLabel, {for: "repeatedHabitNumInput"})
        repeatedHabitNumLabel.textContent = "Repeated"
        const repeatedHabitNumInput = document.createElement("input")
        setAttributes(repeatedHabitNumInput, {type: "number", id: "repeatedHabitNumInput", name: "repeatedHabitNumInput", min: "1", step: "1", value: "1"})
        const repeatedHabitUnitLabel = document.createElement("label")
        setAttributes(repeatedHabitUnitLabel, {for: "repeatedHabitUnitInput"})
        const repeatedAdditionalText = document.createElement("span")
        repeatedAdditionalText.textContent = "time"
        repeatedHabitNumInput.addEventListener("input", () => {
            if(repeatedHabitNumInput.value === "1"){
                repeatedAdditionalText.textContent = "time"
            } else {
                repeatedAdditionalText.textContent = "times"
            }
        })
        repeatedHabitUnitLabel.textContent = "per"
        const repeatedHabitUnitInput = document.createElement("select")
        setAttributes(repeatedHabitUnitInput, {id: "repeatedHabitUnitInput", name: "repeatedHabitUnitInput"})
        const freqOptions = ["day", "week", "month"]
        freqOptions.forEach(freq => {
            const freqElement = document.createElement("option")
            freqElement.value = freq
            freqElement.textContent = freq
            repeatedHabitUnitInput.appendChild(freqElement)
        })
        
        frequencyArea.append(repeatedHabitNumLabel, repeatedHabitNumInput, repeatedAdditionalText, repeatedHabitUnitLabel, repeatedHabitUnitInput)
        
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
        const typeOfGoalNumText = document.createElement("span")
        typeOfGoalNumText.textContent = "Numbered goal"
        typeOfGoalNumLabel.append(typeOfGoalNumInput, typeOfGoalNumText)

        setAttributes(typeOfGoalNumInput, {type: "radio", id: "typeOfGoalNumInput", name: "typeOfGoalInput", value: "int"})

        const typeOfGoalBooleanLabel = document.createElement("label")
        const typeOfGoalBooleanInput = document.createElement("input")
        const typeOfGoalBooleanText = document.createElement("span")

        setAttributes(typeOfGoalBooleanLabel, {for: "typeOfGoalBooleanInput"})
        typeOfGoalBooleanLabel.append(typeOfGoalBooleanInput, typeOfGoalBooleanText)
        typeOfGoalBooleanText.textContent = "Yes/no complete"
        setAttributes(typeOfGoalBooleanInput, {type: "radio", id: "typeOfGoalBooleanInput", name: "typeOfGoalInput", value: "boolean"})
        goalArea.className = "goalArea"
        typeOfGoalNumInput.addEventListener('change', (e) => {
            if (e.target.checked) {
                goalArea.append(goalValueLabel, goalValueInput)
                goalArea.style.display = "block"
            }
        });
        typeOfGoalBooleanInput.addEventListener('change', (e) => {
            if (e.target.checked) {
              closeSection(goalArea)
            }
        });
    
        typeOfGoalArea.append(typeOfGoalLabel, typeOfGoalNumLabel, goalArea, typeOfGoalBooleanLabel)
        
        const submitEditCreateFormBtn = document.createElement("button")
        submitEditCreateFormBtn.className = "updateCreateBtn"
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
            
            habitDescInput.value = habitDivChildren.item(0).textContent
            repeatedHabitNumInput.value = habitDivChildren.item(1).textContent.slice(0,1)
            
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
            deleteHabitBtn.className = "deleteBtn"
            deleteHabitBtn.addEventListener("click", (e) => {
                openDeleteHabitModal(habitId, e)
            })
            editCreateHabitModal.append(deleteHabitBtn)
        }
    }
    editCreateHabitModal.style.display = "grid"
    userSummaryPage.append(editCreateHabitModal)
}

window.addEventListener('hashchange', () => {
    if(window.location.href === `${baseClientUrl}carer#user${userId}`){
        closeSection(userSummaryPage)
        usersWrapper.style.display = "none"
        carerPageH2.textContent = "Indee Summary Page"      
        renderUserSummaryPage(userId, usersNameText)
    }if(window.location.href === `${baseClientUrl}carer`){
        closeSection(userSummaryPage)
        usersWrapper.style.display = "block"
        carerPageH2.textContent = "Carer Summary Page"
    }
});

const seeMoreUserInfo = (e) => {
    userId = e.target.parentElement.id
    closeSection(userSummaryModal)
    window.location.hash = `user${userId}`
}

async function getUserSummary(e) {
    closeSection(userSummaryModal)
    userSummaryModal.className = "userSummaryModal"
    if(e.target.className !== "moreUserIcon") {
        if(e.target.parentElement.id){
            userId = e.target.parentElement.id
        }
        if(e.target.id){
            userId = e.target.id
        }
        userSummaryModal.id = userId
        try {
            const options = {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({user_id: userId, number_of_days: 7})
            }
            const response = await fetch(`${baseUrl}users/summary`, options);
            const data = await response.json()

            const formattedLoginDate = `${data.lastLogin.slice(11,16)} ${data.lastLogin.slice(8,10)}-${data.lastLogin.slice(5,7)}-${data.lastLogin.slice(0,4)}`
            
            const text = [{completedText: "Habits completed today"}, {completedHabits: `${data.numOfHabitsCompleted}/${data.numOfHabits}`}, {lastLoginText: "Last login"}, {lastLoginValue: formattedLoginDate}, {weekReviewTitle: "This week in review"}]
            const usersNameTitle = document.createElement("p")
            usersNameTitle.textContent = `${data.userFirstName} ${data.userSecondName}`
            usersNameText = `${data.userFirstName} ${data.userSecondName}`
            usersNameTitle.className = "usersNameTitle"
            const modalCloseDiv = document.createElement("div")
            
            const modalCloseX = document.createElement("img")
            modalCloseX.src = "./static/images/cross.png"
            modalCloseX.addEventListener("click", () => closeSection(userSummaryModal))
            modalCloseDiv.className = "modalCloseDiv"
            modalCloseDiv.append(modalCloseX)
            userSummaryModal.append(usersNameTitle, modalCloseDiv)
            text.forEach(function(el) {
                let para = document.createElement("p")
                para.className = Object.keys(el)[0]
                para.textContent = Object.values(el)[0]
                userSummaryModal.append(para)
            })
            userSummaryModal.style.display = "block"

            createWeekGraph("carerHomeChart", userSummaryModal, data.entriesData, "% complete last 7 days", false, false)

            const seeMoreDetails = document.createElement("p")
            seeMoreDetails.textContent = "See more details"
            seeMoreDetails.addEventListener("click",
               seeMoreUserInfo)
            userSummaryModal.append(seeMoreDetails)
        } catch (err) {
            console.warn(err);
        }
    }
}} else {
    const pleaseLoginModal = document.createElement("div")
    const pleaseLoginModalText = document.createElement("p")
    pleaseLoginModalText.textContent = "Please login as a carer to view this page"
    pleaseLoginModal.className = "pleaseLoginModal"
    const redirectLink = document.createElement("a")
    redirectLink.href = "./login"
    redirectLink.className = "btn"
    redirectLink.textContent = "Take me there!"
    pleaseLoginModal.append(pleaseLoginModalText, redirectLink)
    const carerPageH2 = document.getElementById("carerPageH2")
    carerPageH2.append(pleaseLoginModal)
}