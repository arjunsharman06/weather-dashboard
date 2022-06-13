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

// Searched City Name
var searchCity = function (event) {
  event.preventDefault();

  let cityName = this.querySelector("input");
  let capitalName = titleCase(cityName.value)
  longLatitude(capitalName);
  
  // Creating the tab of the city searched in the list 
  var cityTab = document.createElement("li");
  cityTab.textContent = capitalName;
  cityTab.classList.add ("searched-city");
  searchedList.appendChild(cityTab);

  // Resetting the value of the input
  cityName.value = "";
};

// Api Call to find the Longitude & Latitude
var longLatitude =  (cityName) => {
  let url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${maxCityLimit}&appid=${key}`;
  apiFunction(url)
  .then(data => {
      if (data.length > 0) {
        currentWeather(data[0].lon, data[0].lat);
      } else {
        return false;
      }
  });
};

// API call to calculate current weather
var currentWeather = async function (longitude, latitude) {
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
  apiFunction(url)
  .then(data => {
      if (data.length > 0) {

      }
  });
}

// API calls
const apiFunction =  async function (url) {
   let response = await fetch(`${url}`);
   let data = await response.json();
   return data;
};

// Capitilising the first letter of each word
var titleCase = function(str) {
  var tStr = "";
 str.split(" ").forEach(element => {
  tStr = tStr + (element.charAt(0).toUpperCase() + element.slice(1) + " ");
 });
 return tStr.trim();
};



// On Submit call
//searchEl.querySelector('input').addEventListener("keypress", inputCity);
searchEl.addEventListener("submit", searchCity);