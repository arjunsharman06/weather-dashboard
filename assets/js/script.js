// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
//https://openweathermap.org/api/one-call-api
// https://openweathermap.org/api


var key = 'ca6e92376d7a582a383532b7582df7c0';
var maxCityLimit = '5';
var searchEl = document.querySelector(".search-section");
var searchedList = document.querySelector(".searched-city-list");
var currentDayEl = document.querySelector(".current-day");
var parentForcasteEl = document.querySelector(".forcast");
var searchedCityArray = [];

// Start function
var init = () => {
  searchedCityArray = getLocal("Cities");
  searchedCityArray = searchedCityArray === null ? searchedCityArray = [] : searchedCityArray;
  searchedCities();
  if(searchedCityArray.length > 0){
    longLatitude(searchedCityArray[0]);
  }else{
    currentDayEl.innerHTML ="No Data to show";
  }
}

// Searched City Name
var searchCity = function (event) {
  event.preventDefault();
  let cityName = this.querySelector("input");

  if (isEmptyOrNull(cityName)) {
    let capitalName = titleCase(cityName.value)
    searchedCityArray.push(capitalName);
    let btn = this.querySelector("#btn-search");
    btn.classList.add("active");
    longLatitude(capitalName);

    searchedCities();

    // Resetting the value of the input
    cityName.value = "";

    // Save Value in Local Storag
    saveInLocal("Cities", searchedCityArray);

    // removing the active class
    setTimeout(() => {
      btn.classList.remove("active");
    }, 1000);
  } else {
    alert("Please input the city name");
  }
};

// City selected from the list 
var selectedFromList = (event) => {

  if (event.target != null && event.target.innerText != "") {
    longLatitude(event.target.innerText);
  }
}
// Api Call to find the Longitude & Latitude
var longLatitude = (cityName) => {

  if (cityName !== undefined && cityName !== "") {
    let url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${maxCityLimit}&appid=${key}`;
    apiFunction(url)
      .then(data => {
        if (data != null) {
          totalWeather(data[0].lon, data[0].lat, cityName);
        } else {
          return false;
        }
      });
  } else {
    return false
  }
};

// API call to get  current , 5 days  weather details
var totalWeather = (longitude, latitude, cityName) => {
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude={part}&units=imperial&appid=${key}`;
  apiFunction(url)
    .then(data => {      
      if (data != null) {        
        // call current Weather
        currentWeather(data["current"], cityName);

        // call 5 days forecast
        forcastWeather(data["daily"]);
      }
    });
}

// Current Weather
var currentWeather = (weatherObject, name) => {

  let cityName = document.createElement("span");
  let currentDate = getDate(weatherObject.dt);
  let icon = weatherObject.weather[0].icon;

  // Adding the city name
  cityName.classList = "display-5",
    cityName.innerHTML = `<h3>${name}&nbsp(${currentDate})<img src="http://openweathermap.org/img/wn/${icon}@2x.png" height="50vh"></img></h3`;

  currentDayEl.innerHTML = "";
  currentDayEl.appendChild(cityName);

  // Current Temp
  let currentTemp = document.createElement("h5");
  currentTemp.innerHTML = `Temp&nbsp:&nbsp${weatherObject.temp}&#176;F`;

  // Current Wind Speed
  let currentWindSpeed = document.createElement("h5");
  currentWindSpeed.innerHTML = `Wind&nbsp:&nbsp${weatherObject.wind_speed}MPH`;


  // Current Humidity
  let currentHumidity = document.createElement("h5");
  currentHumidity.innerHTML = `Humidity&nbsp:&nbsp${weatherObject.humidity}%`;

  // UV Index
  let currentUVI = document.createElement("h5");
  let uv = Math.round(parseFloat(weatherObject.uvi));

  //  Color of UV according to severity
  if (uv >= 0 && uv <= 2) {
    color = "green"
  } else if (uv >= 3 && uv <= 5) {
    color = "yellow";
  } else if (uv >= 6 && uv <= 7) {
    color = "orange";
  } else {
    color = "red";
  }

  currentUVI.innerHTML = `UV Index &nbsp:&nbsp<label class="uv" style="background-color:${color}">${weatherObject.uvi}</label>`;

  //  Appending to the parent
  currentDayEl.appendChild(currentTemp);
  currentDayEl.appendChild(currentWindSpeed);
  currentDayEl.appendChild(currentHumidity);
  currentDayEl.appendChild(currentUVI);
}

// 5-Days Weather
var forcastWeather = (weatherObject) => {
  parentForcasteEl.innerHTML = "";
  weatherObject.forEach((element, index) => {
    if (index !== 0 && index < weatherObject.length - 2) {
      let forcastLi = document.createElement("li");
      let headerInfo = document.createElement("span");
      let currentDate = getDate(element.dt);
      let icon = element.weather[0].icon;

      // Date 
      forcastLi.classList = "col-6 col-lg-2 d-flex flex-column m-2 card";
      headerInfo.innerHTML = `<h3>${currentDate}<br><br><img src="http://openweathermap.org/img/wn/${icon}@2x.png" height="50vh"></img></h3`;
      forcastLi.appendChild(headerInfo);

      // Current Temp
      let currentTemp = document.createElement("h5");
      currentTemp.innerHTML = `Temp&nbsp:&nbsp${element.temp.day}&#176;F`;

      // Current Wind Speed
      let currentWindSpeed = document.createElement("h5");
      currentWindSpeed.innerHTML = `Wind&nbsp:&nbsp${element.wind_speed}MPH`;


      // Current Humidity
      let currentHumidity = document.createElement("h5");
      currentHumidity.innerHTML = `Humidity&nbsp:&nbsp${element.humidity}%`;

      //  Appending to the parent
      forcastLi.appendChild(currentTemp);
      forcastLi.appendChild(currentWindSpeed);
      forcastLi.appendChild(currentHumidity);
      parentForcasteEl.appendChild(forcastLi);
    }
  });
}

// API calls
const apiFunction = async (url) => {
  debugger;
  let response = await fetch(`${url}`);
  if (response.ok) {
    let data = response.json();
    return data;
  } else {
    return false;
  }  
};

// Capitilising the first letter of each word
var titleCase = (str) => {
  var tStr = "";
  str.split(" ").forEach(element => {
    tStr = tStr + (element.charAt(0).toUpperCase() + element.slice(1) + " ");
  });
  return tStr.trim();
};

// Get Current date
var getDate = (timestamp) => {
  const currentDate = new Date(timestamp * 1000);
  return currentDate.toLocaleDateString("en-US");
}

// Check for is empty or null
var isEmptyOrNull = (element) => {
  return element.value != null && element.value != "" ? true : false;
}

// List of all Searched cities
var searchedCities = () => {

  if (searchedCityArray != null && searchedCityArray.length > 0) {
    searchedList.innerHTML = "";
    searchedCityArray.forEach((element) => {
      // Creating the tab of the city searched in the list 
      var cityTab = document.createElement("li");
      cityTab.textContent = element;
      cityTab.classList.add("searched-city");
      searchedList.appendChild(cityTab);
    });
  } else {
    searchedList.innerHTML = "No City Searched so far";
  }
}

// Save in Local Storage
var saveInLocal = (key, value) => {
  if (key != null && (value != null || value != "")) {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    alert("Value not Saved in Local Storage");
    return false;
  }
}

// Get from Local Storage
var getLocal = (key) => {
  if (key != null) {
    return JSON.parse(localStorage.getItem(key));
  } else {
    alert("Provided Key is Wrong!! Cannot get data from the Local Storage!!")
    return false;
  }
}

// On Submit call
searchEl.addEventListener("submit", searchCity);
searchedList.addEventListener("click", selectedFromList);
init();