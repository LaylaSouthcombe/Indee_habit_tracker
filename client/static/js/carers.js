const baseUrl = "http://localhost:3000/"
const usersWrapper = document.querySelector(".usersWrapper")
const userSummaryModal = document.getElementById("userSummaryModal")
Chart.register(ChartDataLabels);

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
    if(e.target.type !== "submit") {
    console.log("summary")
    //get's targeted user's id
    let userId
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
            body: JSON.stringify({user_id: userId})
        }
        const response = await fetch(`${baseUrl}users/summary`, options);
        const data = await response.json()
        console.log(data)
        //declare text to be present in modal
        const text = [{summaryUsersName: `${data.userFirstName} ${data.userSecondName}`}, {completedText: "Habits completed today"}, {completedHabits: `${data.numOfHabitsCompleted}/${data.numOfHabits}`}, {lastLoginText: "Last login"}, {lastLoginValue: data.lastLogin}, {weekReviewTitle: "This week in review"}]
        const graphValues = [data.daySevenPercent, data.daySixPercent, data.dayFivePercent, data.dayFourPercent, data.dayThreePercent, data.dayTwoPercent, data.dayOnePercent]
        const modalCloseX = document.createElement("span")
        modalCloseX.textContent = "X"
        modalCloseX.addEventListener("click", closeSummaryModal)
        userSummaryModal.append(modalCloseX)
        text.forEach(function(el) {
            let para = document.createElement("p")
            para.className = Object.keys(el)[0]
            para.textContent = Object.values(el)[0]
            userSummaryModal.append(para)
        })

        userSummaryModal.style.display = "block"
        //create the week chart
        const myChart = document.createElement("canvas")
        myChart.id = "myChart"
        myChart.setAttribute("width", 300)
        myChart.setAttribute("height", 300)
        userSummaryModal.append(myChart)

        const past7Days = [...Array(7).keys()].map(index => {
            const date = new Date();
            date.setDate(date.getDate() - index);
            let str = date.toString()
            return `${str.substring(8,10)} ${str.substring(4,7)}`
        });

        const formattedPast7Days = past7Days.reverse()

        new Chart(myChart, {
            type: 'bar',
            data: {
                labels: [formattedPast7Days[0], formattedPast7Days[1], formattedPast7Days[2], formattedPast7Days[3], formattedPast7Days[4], formattedPast7Days[5], formattedPast7Days[6]],
                datasets: [{
                    label: '% complete',
                    data: [graphValues[0]*100, graphValues[1]*100, graphValues[2]*100, graphValues[3]*100, graphValues[4]*100, graphValues[5]*100, graphValues[6]*100],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1,
                    borderRadius: 2
                }]
            },
            options: 
                {
                    plugins:{
                    title: {
                        display: true,
                        text: "% complete last 7 days",
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        display: false
                    },
                    datalabels: {
                        color: '#36A2EB',
                        anchor: 'end',
                        align: 'top',
                        formatter: function(value) {
                            return value + '%'
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            display: false,
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
        const seeMoreDetails = document.createElement("p")
        seeMoreDetails.textContent = "See more details"
        seeMoreDetails.addEventListener("click", seeMoreUserInfo)
        userSummaryModal.append(seeMoreDetails)
    } catch (err) {
        console.warn(err);
    }
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
        // habitsWrapper.append(habitTodaySection, habitWeekSection, habitMonthSection)
    } catch (err) {
        console.warn(err);
    }
}
getAssociatedUsers()