// Clears all the data stored in the local storage
localStorage.clear();

// Finds the city entered in the input field, retrieves weather data, and updates the current weather details
function findCity() {
  var cityName = titleCase($("#cityName")[0].value.trim());
  
  // Constructs the API URL using the city name
  var apiURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&units=imperial&appid=71311474f5b26fb7bbfa0bc1985b90cd";

  // Makes a fetch request to the OpenWeatherMap API
  fetch(apiURL)
    .then(function (response) {
      if (response.ok) {

        response.json().then(function (data) {
          // Updates the city name and current date on the page
          $("#city-name")[0].textContent =
            cityName + " (" + moment().format("M/D/YYYY") + ")";

          // Appends the city name to the city list
          $("#city-list").append(
            '<button type="button" class="list-group-item list-group-item-light list-group-item-action city-name">' +
              cityName
          );

          const lat = data.coord.lat;
          const lon = data.coord.lon;

          var latLonPair = lat.toString() + " " + lon.toString();

          // Stores the city name and its corresponding latitude-longitude pair in the local storage
          localStorage.setItem(cityName, latLonPair);

          // Constructs the API URL for fetching future weather data
          apiURL =
            "https://api.openweathermap.org/data/2.5/onecall?lat=" +
            lat +
            "&lon=" +
            lon +
            "&exclude=minutely,hourly&units=imperial&appid=71311474f5b26fb7bbfa0bc1985b90cd";

          // Fetches the future weather data
          fetch(apiURL).then(function (newResponse) {
            if (newResponse.ok) {

              newResponse.json().then(function (newData) {
                // Updates the current weather details on the page
                getCurrentWeather(newData);
              });
            }
          });
        });
      } else {
        // Displays an alert if the city cannot be found
        alert("Cannot find city!");
      }
    });

}


