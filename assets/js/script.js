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

// Retrieves weather data for a given set of coordinates and updates the current weather details
function getListCity(coordinates) {
    apiURL =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      coordinates[0] +
      "&lon=" +
      coordinates[1] +
      "&exclude=minutely,hourly&units=imperial&appid=71311474f5b26fb7bbfa0bc1985b90cd";
  
    // Fetches the weather data for the coordinates
    fetch(apiURL).then(function (response) {
      if (response.ok) {

        response.json().then(function (data) {
          // Updates the current weather details on the page
          getCurrentWeather(data);
        });
      }
    });
  }
  
  // Updates the current weather details on the page
  function getCurrentWeather(data) {
    $(".results-panel").addClass("visible");
  
    // Updates the current weather icon
    $("#currentIcon")[0].src =
      "http://openweathermap.org/img/wn/" +
      data.current.weather[0].icon +
      "@2x.png";
    
    // Updates the current temperature, humidity, wind speed, and UV index
    $("#temperature")[0].textContent =
      "Temperature: " + data.current.temp.toFixed(1) + " \u2109";
    $("#humidity")[0].textContent =
      "Humidity: " + data.current.humidity + "% ";
    $("#wind-speed")[0].textContent =
      "Wind Speed: " + data.current.wind_speed.toFixed(1) + " MPH";
    $("#uv-index")[0].textContent = "  " + data.current.uvi;
  
    // Updates the CSS class for the UV index based on its value
    if (data.current.uvi < 3) {
      $("#uv-index").removeClass("moderate severe");
      $("#uv-index").addClass("favorable");
    } else if (data.current.uvi < 6) {
      $("#uv-index").removeClass("favorable severe");
      $("#uv-index").addClass("moderate");
    } else {
      $("#uv-index").removeClass("favorable moderate");
      $("#uv-index").addClass("severe");
    }
  
    // Retrieves and updates the future weather forecast
    getFutureWeather(data);
  }
  
  // Retrieves and updates the future weather forecast on the page
  function getFutureWeather(data) {
    for (var i = 0; i < 5; i++) {
      var futureWeather = {
        date: convertUnixTime(data, i),
        icon:
          "http://openweathermap.org/img/wn/" +
          data.daily[i + 1].weather[0].icon +
          "@2x.png",
        temp: data.daily[i + 1].temp.day.toFixed(1),
        humidity: data.daily[i + 1].humidity,
      };
  
      var currentSelector = "#day-" + i;
      $(currentSelector)[0].textContent = futureWeather.date;
      currentSelector = "#img-" + i;
      $(currentSelector)[0].src = futureWeather.icon;
      currentSelector = "#temp-" + i;
      $(currentSelector)[0].textContent =
        "Temp: " + futureWeather.temp + " \u2109";
      currentSelector = "#hum-" + i;
      $(currentSelector)[0].textContent =
        "Humidity: " + futureWeather.humidity + "%";
    }
  }


// Converts a city string to title case
function titleCase(city) {
    var updatedCity = city.toLowerCase().split(" ");
    var returnedCity = "";
    for (var i = 0; i < updatedCity.length; i++) {
      updatedCity[i] =
        updatedCity[i][0].toUpperCase() + updatedCity[i].slice(1);
      returnedCity += " " + updatedCity[i];
    }
    return returnedCity;
  }
  
  // Converts a Unix timestamp to a formatted date string
  function convertUnixTime(data, index) {
    const dateObject = new Date(data.daily[index + 1].dt * 1000);
    return dateObject.toLocaleDateString();
  }
  
  // Event listener for the search button click
  $("#search-button").on("click", function (e) {
    e.preventDefault();
    
    // Executes the findCity function
    findCity();
    
    // Resets the form
    $("form")[0].reset();
  });
  
  // Event listener for clicking a city in the city list
  $(".city-list-box").on("click", ".city-name", function () {
    // Retrieves the coordinates for the clicked city from the local storage
    var coordinates = localStorage.getItem($(this)[0].textContent).split(" ");
    coordinates[0] = parseFloat(coordinates[0]);
    coordinates[1] = parseFloat(coordinates[1]);
    
    // Updates the city name and current date on the page
    $("#city-name")[0].textContent =
      $(this)[0].textContent + " (" + moment().format("M/D/YYYY") + ")";
    
    // Retrieves and updates the weather details for the clicked city
    getListCity(coordinates);
  });