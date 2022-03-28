// Personal API Key for OpenWeatherMap API
const apiKey = "373b3c94ddd7cced9679c7abb6cfcdf2&units=imperial";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?";
const geoBaseUrl = "http://api.openweathermap.org/geo/1.0/zip?";

// TODO replace zip with user input from page once this runs off generate button
zip = 60614; 
// const zip = document.getElementById("zip").value;
// console.log ("zip: ", zip);

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
    console.log("running 2nd function", lat, lon)
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


function createEntry  (date, temp, userContent) {
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

// chained promises
getCoords(zip, apiKey, geoBaseUrl) // 1. get the coordinates corresponding to zip
.then(coords => getCoordWeather(coords.lat, coords.lon, apiKey, baseUrl)) // 2. pass lat and long to get weather data
.then(weatherData => createEntry(weatherData.dt, weatherData.main.temp, "dummy_content")) // 3. collate the new entry
.then(newEntry => postData('/addEntry', newEntry)); // 4. pass weather data & user content to server to log

