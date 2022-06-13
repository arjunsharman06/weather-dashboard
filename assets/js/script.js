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
      if (data != null) {
        totalWeather(data[0].lon, data[0].lat,cityName);
      } else {
        return false;
      }
  });
};

// API call to get  current , 5 days  weather details
var totalWeather =  (longitude, latitude,cityName) => {
  // let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude={part}&units=imperial&appid=${key}`;
  apiFunction(url)
  .then(data => {
    console.log(data);
      if (data != null) {
        // call current Weather
        currentWeather(data["current"],cityName);

        // call 5 days forecast
        forcastWeather(data["daily"]);
      }
  });
}

// Current Weather
var currentWeather = (weatherObject , name)=>{
debugger;
  
  let cityName = document.createElement("span");
  const currentDate = new Date(weatherObject.dt*1000);
  let icon = weatherObject.weather[0].icon;

  // Adding the city name
  cityName.classList = "display-5",
  cityName.innerHTML = `<h3>${name}&nbsp(${currentDate.toLocaleDateString("en-US")})<img src="http://openweathermap.org/img/wn/${icon}@2x.png" height="50vh"></img></h3`;

  currentDayEl.innerHTML="";
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
   let uv = Math.round(parseFloat (weatherObject.uvi));

  //  Color of UV according to severity
   if(uv>=0 && uv<=2){
    color="green"
   }else if(uv>=3 && uv<=5){
    color="yellow";
   }else if(uv>=6 && uv<=7){
    color="orange";
   }else{
    color="red";
   } 

   currentUVI.innerHTML = `UV Index &nbsp:&nbsp<label class="uv" style="background-color:${color}">${weatherObject.uvi}</label>`;

  //  Appending to the parent
   currentDayEl.appendChild(currentTemp);
   currentDayEl.appendChild(currentWindSpeed);
   currentDayEl.appendChild(currentHumidity);
   currentDayEl.appendChild(currentUVI);
}

// API calls
const apiFunction =  async  (url) => {
   let response = await fetch(`${url}`);
   let data = await response.json();
   return data;
};

// Capitilising the first letter of each word
var titleCase = (str) => {
  var tStr = "";
 str.split(" ").forEach(element => {
  tStr = tStr + (element.charAt(0).toUpperCase() + element.slice(1) + " ");
 });
 return tStr.trim();
};



// On Submit call
//searchEl.querySelector('input').addEventListener("keypress", inputCity);
searchEl.addEventListener("submit", searchCity);