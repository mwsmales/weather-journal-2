// Personal API Key for OpenWeatherMap API
const apiKey = "373b3c94ddd7cced9679c7abb6cfcdf2&units=imperial";
// baseUrl = "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}"

// chained promises retunring the temperature from openweathermap.org
// TODO replace zip with user input from page 
const zip = "60614"

getCoords(zip, apiKey)
.then(geoData => getCoordWeather(geoData.lat, geoData.lon, apiKey))
.then(data => console.log(data.main.temp))


async function getCoords(zip, apiKey) { 
    // function to convert zip into lat an long using openweathermap.org
    const res = await fetch(`http://api.openweathermap.org/geo/1.0/zip?zip=${zip},US&appid=${apiKey}`);
    try {
        const data = await res.json();
        console.log(zip, data.lat, data.lon);
        return(data);
    }
    catch (error) {
        console.log("error", error);
    }
}

async function getCoordWeather(lat, lon, apiKey) {
    // function to get the current weather based on latitude and longitude
    console.log("running 2nd function", lat, lon)
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    try {
        const data = await res.json();
        console.log(zip, data);
        return(data);
    }
    catch (error) {
        console.log("error", error);
    }
}

// post request to send client-side data to server
async function postData ( url = '', data = {}) {
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
        console.log(response.json());
    } catch(error) {
        console.log("error", error);
    }
}

postData('/addEntry', {answer:42});