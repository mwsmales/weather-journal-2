// Personal API Key for OpenWeatherMap API
const apiKey = "373b3c94ddd7cced9679c7abb6cfcdf2&units=imperial";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?";
const geoBaseUrl = "http://api.openweathermap.org/geo/1.0/zip?";

// global variables
let zip = ""; 
let feelings = "";

// listeners
button = document.getElementById("generate");
button.addEventListener('click', function() {
    generateEntry();
}
);

// main function
function generateEntry() {
    // get zipcode
    zip = document.getElementById('zip').value;
    console.log('user zip: ', zip);
    // get user content
    feelings = document.getElementById('feelings').value;
    console.log('user feelings: ', feelings);
    // execute chained promises: openweathermaps API call, server POST, then server GET
    chainedPromises(zip, feelings, apiKey, geoBaseUrl, baseUrl);
    // dynamically add content to webpage

};


async function chainedPromises(zip, feelings, apiKey, geoBaseUrl, baseUrl) {
    getCoords(zip, apiKey, geoBaseUrl) // 1. get the coordinates corresponding to zip
    .then(coords => getCoordWeather(coords.lat, coords.lon, apiKey, baseUrl)) // 2. pass lat and long to get weather data
    .then(weatherData => createEntry(weatherData.dt, weatherData.main.temp, feelings)) // 3. collate the new entry
    .then(newEntry => postData('/addEntry', newEntry)) // 4. pass weather data & user content to server to log
    .then(function() {
        return(getData('./getData'));
    }) //5. get the updated data object from the server
    .then(projectData => updateUI(projectData)); // 6. Update page with updated data
} 

// functions
async function getCoords(zip, apiKey, geoBaseUrl) { 
    // function to convert zip into lat an long using openweathermap.org
    const res = await fetch(`${geoBaseUrl}zip=${zip},US&appid=${apiKey}`);
    try {
        const data = await res.json();
        console.log(zip, data.lat, data.lon);
        return(data);
    }
    catch (error) {
        console.log("error", error);
    }
}


async function getCoordWeather(lat, lon, apiKey, baseUrl) {
    // function to get the current weather based on latitude and longitude
    console.log("running 2nd weather api call with coords", lat, lon)
    const res = await fetch(`${baseUrl}lat=${lat}&lon=${lon}&appid=${apiKey}`);
    try {
        const data = await res.json();
        console.log(zip, data);
        return(data);
    }
    catch (error) {
        console.log("error: ", error);
    }
}


function createEntry  (unixDate, temp, userContent) {
    const date = new Date(unixDate * 1000); // convert API unix date to JS Date object
    const newEntry = {
        "date": date,
        "temp": temp,
        "content": userContent
    }
    return(newEntry);
}


async function postData ( url = '', data = {}) {
    // post request to send client-side data to server
    console.log(data);
    const response = await fetch(url, {
        method: 'POST', 
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },    
        // Body data type must match "Content-Type" header
        body: JSON.stringify(data),
    });    
    
    try {
        const responseData = await response.json();
        console.log("post response: ", responseData);
    } catch(error) {
        console.log("error: ", error);
    }    
}

async function getData (url = "") {
    // get request to fetch all app data
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    try {
        const projectData = await response.json()
        console.log('GET data: ', projectData);
        return(projectData);
    }
    catch(error) {
        console.log("error: ", error)
    }
}


function updateUI(projectData) {
    // update the UI with the most recent entry in the projectData array
    const projectDataLength = projectData['data'].length;
    const date = projectData['data'][projectDataLength-1]['date'];
    const temp = projectData['data'][projectDataLength-1]['temp'];
    const content = projectData['data'][projectDataLength-1]['content'];
    
    // convert the date string to a locale-specific string
    const dateObj = new Date(Date.parse(date))
    const dateString = dateObj.toLocaleDateString("en-US", {day: 'numeric', month: 'long', year: 'numeric'}) 

    document.getElementById('date').innerHTML = `<p><strong>Date:</strong> ${dateString}</p>`;
    document.getElementById('temp').innerHTML = `<p><strong>Temp:</strong> ${temp}F</p>`;
    document.getElementById('content').innerHTML = `<p><strong>Your feelings:</strong> ${content}</p>`;
}