// Declare variables

const searchForm = $("#search-form");
const searchInput = $("#search-input");
const todayContainer = $("#today");
const forecastContainer = $("#forecast");
const historyContainer = $("#history");
var APIKey = "fa766ad2df19558f80ac998a4f5cbf45";

// Function to handle form submit
searchForm.submit(function(e) {
  e.preventDefault();
  // Get the city name from the input
  const city = searchInput.val();

  // Build the URLs to query the database
  var currentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIKey;
  var forecastWeatherURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + APIKey;

  // Make an AJAX request to the weather API to get the current weather data
  $.ajax({
    url: currentWeatherURL,
    type: "GET",
    dataType: "json",
    success: function(data) {
      
      // Handle the current weather data
      var date = new Date();
      var dateString = date.toLocaleDateString();
      
      // Convert the temp to Celsius
      var tempC = data.main.temp - 273.15;

      // add weather contents to html
      todayContainer.html('<h4>' + data.name +" (" + dateString + ")"+ '<img src="https://openweathermap.org/img/w/' + data.weather[0].icon + '.png" alt="Weather icon">' +'</h4>  <p>Temp: ' + tempC.toFixed(2) + '°C' + '<p>Wind: ' + data.wind.speed + 'KPH' + '</p> <p>Humidity: ' + data.main.humidity + '%'+ '</p> </div>');
    }
  });
    
// Make an AJAX request to the weather API to get the forecast weather data
$.ajax({
  url: forecastWeatherURL,
  type: "GET",
  dataType: "json",
  success: function(data) {
    console.log(data)
    // Clear the forecast container
    forecastContainer.html("");}
    
    // Get the date of tomorrow