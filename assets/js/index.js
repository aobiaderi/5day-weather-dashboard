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
    forecastContainer.html("");
    
    // Get the date of tomorrow
     
     var tomorrow = new Date();
     tomorrow.setDate(tomorrow.getDate() + 1);
     
    // Find the index of the first element in the forecast data with a date equal to tomorrow
       var index = 0;
       for (let i = 0; i < data.list.length; i++) {
       // Create a new Date object from the time in the list data
       var date = new Date(data.list[i].dt_txt);
       // Check if the current date is equal to tomorrow's date
       if (date.toDateString() === tomorrow.toDateString()) {
       // Set the index to the current iteration
       index = i;
       // Exit the loop
       break;
       }
 }
     // Loop through the list of forecast data starting from the index found above
     for (let i = index; i < data.list.length && i < index + 40; i+=8) {
         // Convert the temp to Celsius
         var tempC1 = data.list[i].main.temp - 273.15;
 
       // Create a new Date object from the time in the list data
       var date = new Date(data.list[i].dt_txt);
       // Format the date to a string in the local format
       var dateString = date.toLocaleDateString();
      // Append the forecast data to the forecast container
      forecastContainer.append('<div class="col-lg-2">' + 
      '<div class="card">' +
        '<div class="card-body">' +
          '<h5 class="card-title">' + dateString + '</h5>' +
          // Add the weather icon
          '<img src="https://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png" alt="Weather icon">' +
          '<p class="card-text">Temp: ' + tempC1.toFixed(2) + '°C' + '</p>' +
          '<p class="card-text">Wind: ' + data.list[i].wind.speed  + 'KPH' + '</p>' +
          '<p class="card-text">Humidity: ' + data.list[i].main.humidity + '%' +'</p>' +
        '</div>' +
      '</div>' +
    '</div>');

    }
  }
});
});