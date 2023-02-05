const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const todayContainer = document.getElementById("today");
const forecastContainer = document.getElementById("forecast");
const historyContainer = document.getElementById("history");
var APIKey = "87d845b0b6cf29baa1a73cc34b067a95";

// Function to handle form submit
searchForm.addEventListener("submit", function(e) {
e.preventDefault();

// Get the city name from the input
const city = searchInput.value;

// Build the URL to query the database
var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIKey;

// Make an AJAX request to the weather API to get the current and forecast weather data
$.ajax({
url: queryURL,
type: "GET",
dataType: "json",
success: function(data) {
// Handle the current weather data
todayContainer.innerHTML = '<h2>' + data.name + '</h2> <p>' + data.weather[0].main + '</p> <p>Temperature: ' + data.main.temp + '</p> <p>Humidity: ' + data.main.humidity + '</p> <p>Wind Speed: ' + data.wind.speed + '</p> </div>';
}
});

$.ajax({
url: queryURL,
type: "GET",
dataType: "json",
success: function(data) {
// Handle the forecast weather data
forecastContainer.innerHTML = "";
for (let i = 0; i < data.list.length; i++) {
if (i % 8 === 0) {
forecastContainer.innerHTML += '<div class="col-lg-2"> <p>' + data.list[i].dt_txt + '</p> <p>' + data.list[i].weather[0].main + '</p> <p>Temperature: ' + data.list[i].main.temp + '</p> <p>Humidity: ' + data.list[i].main.humidity + '</p> </div>';
}
}
}
});

// Get the searched cities from local storage
const searchedCities = JSON.parse(localStorage.getItem("searchedCities")) || [];

// Add the new city to the array of searched cities
searchedCities.push(city);

// Store the updated array of searched cities in local storage
localStorage.setItem("searchedCities", JSON.stringify(searchedCities));

// Display the search history
historyContainer.innerHTML = "";
for (let i = 0; i < searchedCities.length; i++) {
  historyContainer.innerHTML += '<a href="#" class="list-group-item list-group-item-action">' + searchedCities[i] + '</a>';
}});
