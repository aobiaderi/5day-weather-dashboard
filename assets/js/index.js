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
      todayContainer.html('<h4>' + data.name +" (" + dateString + ")"+ '<img src="https://openweathermap.org/img/w/' + data.weather[0].icon + '.png" alt="Weather icon">' +'</h4>  <p>Temp: ' + tempC.toFixed(2) + '°C' + '</p>'+'<p>Wind: ' + data.wind.speed + 'KPH' + '</p> <p>Humidity: ' + data.main.humidity + '%'+ '</p> </div>');
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
// Use local storage to save search history and display this on the browser

let searchedCities = [];

// Try to retrieve the list of searched cities from local storage
try {
  searchedCities = JSON.parse(localStorage.getItem("searchedCities")) || [];
} catch (error) {
  // In case of any error, log it to the console
  console.error(error);
}
// Event handler for the submit event of the search form
$("#search-form").submit(function(event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get the value of the search input and trim it
  const city = $.trim($("#search-input").val());

  // If the city value is empty, return without doing anything
  if (!city) return;

  // If the city is not already in the list of searched cities
  if (!searchedCities.includes(city)) {
    // Add the city to the list of searched cities
    searchedCities.push(city);
    // Store the list of searched cities in local storage
    localStorage.setItem("searchedCities", JSON.stringify(searchedCities.slice(-4)));
  }
  // Clear the content of the history container
  $("#history").empty();
  // Append an unordered list to the history container
  $("#history").append('<ul class="list-group">');
  // Loop through the list of searched cities
  for (let i = 0; i < searchedCities.length; i++) {
    // If the current city value is not empty after trimming
    if (searchedCities[i].trim() !== "") {
      // Append a list item to the unordered list
      $("#history").append('<li class="list-group-item">' + searchedCities[i] + '</li>');
    }
  }
  // Close the unordered list
  $("#history").append('</ul>');
});



$("#history").on("click", "li", function() {
  const city = $(this).text();
  // Call the function to retrieve current and future conditions for the selected city
  getWeather(city);
});

// Add function to display current and future weather forecasts when a city in the search history is clicked on.
function getWeather(city) {
  // API call to retrieve current conditions for the city
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/weather",
    data: {
      q: city,
      units: "metric",
      appid: APIKey
    },
    success: function(currentData) {
      // API call to retrieve future conditions for the city
      $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast",
        data: {
          q: city,
          units: "metric",
          appid: APIKey
        },
        success: function(forecastData) {
          // Clear the content of the today and forecast sections
          todayContainer.empty();
          forecastContainer.empty();
          // Display the current conditions for the city

          todayContainer.append(
            '<h4 class="city-name">' + currentData.name + ' '+ new Date().toLocaleDateString() + '<img src="https://openweathermap.org/img/w/' + currentData.weather[0].icon + '.png" alt="Weather icon">' + '</h4>'+
            '<p>Temp: ' + currentData.main.temp + '°C'+ '</p>' +
            '<p> Wind: '+ currentData.wind.speed + 'KPH' +'</p>' + 
            '<p> Humidity: ' + currentData.main.humidity + '%'+ '</p>'
            );
          

          // Loop through the 5-day forecast
          // for (let i = 0; i < 5; i++) {
          for (let i = 0; i < 40; i+=8) {


            // Display the forecast for each day
            forecastContainer.append(`
              <div class="col-lg-2">
                <div class="card">
                  <div class="card-body">
                    <p class="date">${new Date(forecastData.list[i].dt * 1000).toLocaleDateString()}</p>
                    <p class="temperature">${forecastData.list[i].main.temp}°C</p>
                    <p class="weather-description">${forecastData.list[i].weather[0].description}</p>
                  </div>
                </div>
              </div>
            `);
          }
        },
        error: function(error) {
          // In case of any error, log it to the console
          console.error(error);
        }
      });
    },
    error: function(error) {
      // In case of any error, log it to the console
      console.error(error);
    }
  });
}

