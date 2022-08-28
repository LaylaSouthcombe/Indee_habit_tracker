const baseUrl = "http://localhost:3000/"
const baseClientUrl = "http://localhost:8080/"

const usersWrapper = document.querySelector(".usersWrapper")
const userSummaryModal = document.getElementById("userSummaryModal")
Chart.register(ChartDataLabels);

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
const habitsSummarySection = document.createElement("div")
const metricsSummarySection = document.createElement("div")
const metricsWeekSection = document.createElement("div")
const metricsMonthSection = document.createElement("div")
const metricsAllTimeSection = document.createElement("div")
metricsWeekSection.className = "metricsWeekSection"
metricsMonthSection.className = "metricsMonthSection"
metricsAllTimeSection.className = "metricsAllTimeSection"

const closeSection = (sectionName) => {
    sectionName.style.display = "none"
    while (sectionName.lastElementChild) {
        sectionName.removeChild(sectionName.lastElementChild);
    }
}

const openEditCreateHabitModal = () => {
    console.log("open edit create habit modal")
}
const createWeekGraph = (chartName, appendedElement, data, title, axisDisplay, axisTicksDisplay, dataLabels) => {
    console.log("dataLabels", dataLabels)
    let graphValues = []
    let graphColors = []
    let graphBorders = []
        for(let i = 1; i <= Object.keys(data).length; i++){
            if(data[i].complete === 0){
                graphValues.unshift(0)
            } else {
                let  value = (data[i].complete/data[i].total)*100
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

async function getUserHabitsSummary(userId) {
    habits = "hi habits"

    //add in a for each when get actual habits
    let habit = {description: "text habit", freq_value: 2, freq_unit: "days", id: 2, type: "int", goal: 3, habit_int_entry: 2}


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
    const habitBox = document.createElement("div")
    habitBox.classList.add("habitBox")

    const habitDesc = document.createElement("p")
    habitDesc.textContent = habit.description

    const habitRepeat = document.createElement("p")
    habitRepeat.textContent = `Repeated ${habit.freq_value} times a ${habit.freq_unit.slice(0, -1)}`

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

        const editHabitArea = document.createElement("div")
        editHabitArea.addEventListener("click", openEditCreateHabitModal)
        const editHabitImg = document.createElement("p")
        editHabitImg.textContent = "img"
        editHabitArea.append(editHabitImg)

        counterSection.append(currentValue)

        counterArea.appendChild(counterSection)

        habitBox.append(counterArea, editHabitArea)
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
    if(habit.freq_unit === "days"){
        habitTodaySection.appendChild(habitBox)
        habitTodaySection.style.display = "block"
    } else if(habit.freq_unit === "weeks"){
        habitWeekSection.style.display = "block"
        habitWeekSection.appendChild(habitBox)
    } else if(habit.freq_unit === "months"){
        habitMonthSection.style.display = "block"

        habitMonthSection.appendChild(habitBox)
    }
}

async function getWeekData() {
    closeSection(metricsWeekSection)
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

async function getMonthData() {
    closeSection(metricsWeekSection)
    closeSection(metricsMonthSection)
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

async function getAllTimeData() {
    closeSection(metricsWeekSection)
    closeSection(metricsMonthSection)
    closeSection(metricsAllTimeSection)
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

const removeUserPage = () =>{
    window.location.href = `${baseClientUrl}carer`
    console.log("remove page and redirect")
}



const openHabitsSection = () => {
    console.log(habitsSummarySection.style.display)
    if(habitsSummarySection.style.display === "none"){
        metricsSummarySection.style.display = "none"
        habitsSummarySection.style.display = "block"
    }
}

const openMetricsSection = () => {
    console.log("openMetricsSection")
    if(metricsSummarySection.style.display === "none"){
        habitsSummarySection.style.display = "none"
        metricsSummarySection.style.display = "block"
    }
}

async function renderUserSummaryPage(userId) {
    await getUserHabitsSummary(userId)
    await getUsersMetricsSummary(userId)
    
    const userSummaryPage = document.getElementById("userSummaryPage")
    const userSummaryPageTopSection = document.createElement("div")
    userSummaryPageTopSection.className = "userSummaryPageTopSection"
    //top section
    const backBtn = document.createElement("button")
    backBtn.addEventListener("click", removeUserPage)

    const usersName = document.createElement("p")
    usersName.textContent = "users name"
    
    const createHabitDiv = document.createElement("div")
    createHabitDiv.textContent = "+"
    createHabitDiv.addEventListener("click", openEditCreateHabitModal)
    
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
let userId
window.addEventListener('hashchange', () => {
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
    //get's targeted user's id
    
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
        const text = [{summaryUsersName: `${data.userFirstName} ${data.userSecondName}`}, {completedText: "Habits completed today"}, {completedHabits: `${data.numOfHabitsCompleted}/${data.numOfHabits}`}, {lastLoginText: "Last login"}, {lastLoginValue: data.lastLogin}, {weekReviewTitle: "This week in review"}]
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

