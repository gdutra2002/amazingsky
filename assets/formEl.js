// API info: openweathermap
// Key:3fade8c75faf1243c424955cb9eafdfa
// Initial conditions found in index.html document.
var formEl = $("#currentCity");
var nameInputEl = $("#name-input");
var commentInputEl = $("#comment-input");
var searchHistory = [];
var weatherApiRootUrl = "https://api.openweathermap.org";
var weatherApiKey = "3fade8c75faf1243c424955cb9eafdfa";
var locationDisplayEl = $("#locationDisplay");
var searchForm = document.querySelector("#search-form");
var searchInput = document.querySelector("#search-input");
var todayContainer = document.querySelector("#today");
var forecastContainer = document.querySelector("#forecast");
var searchHistoryContainer = document.querySelector("#history");

// First input box
function printQueryData(name, comment) {
  var cardColumnEl = $("<div>");
  cardColumnEl.addClass("col-12 col-sm-4 col-md-3");

  var cardEl = $("<div>");
  cardEl.addClass("card h-100 custom-card");
  cardEl.appendTo(cardColumnEl);

  var cardName = $("<h5>")
    .addClass("card-header custom-card-header")
    .text(name);
  cardName.appendTo(cardEl);

  var cardBodyEl = $("<div>");
  cardBodyEl.addClass("card-body");
  cardBodyEl.appendTo(cardEl);

  var cardComment = $("<p>").addClass("card-text").text(comment);
  cardComment.appendTo(cardBodyEl);
  locationDisplayEl.append(cardColumnEl);
}

// Display the current weather data fetched from OpenWeather api.
function renderCurrentWeather(city, weather) {
  var date = dayjs().format("M/D/YYYY");
  var tempF = weather.main.temp;
  var humidity = weather.main.humidity;
  var windMph = weather.wind.speed;
  var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
  var iconDescription = weather.weather[0].description || weather[0].main;
  var card = document.createElement("div");
  var cardBody = document.createElement("div");
  var heading = document.createElement("h2");
  var weatherIcon = document.createElement("img");
  var tempEl = document.createElement("p");
  var humidityEl = document.createElement("p");
  var windEl = document.createElement("p");
  

  card.setAttribute("class", "card");
  cardBody.setAttribute("class", "card h-100 custom-card");
  card.append(cardBody);
  heading.setAttribute("class", "h3 card-title");
  tempEl.setAttribute("class", "card-text");
  humidityEl.setAttribute("class", "card-text");
  windEl.setAttribute("class", "card-text");
  heading.textContent = `${city} (${date})`;
  weatherIcon.setAttribute("src", iconUrl);
  weatherIcon.setAttribute("alt", iconDescription);
  weatherIcon.setAttribute("class", "img");
  heading.append(weatherIcon);
  humidityEl.textContent = `Humidity: ${humidity} %`;
  tempEl.textContent = `Temp: ${tempF}°F`;
  windEl.textContent = `Wind: ${windMph} MPH`;
  cardBody.append(heading, tempEl, windEl, humidityEl);
  todayContainer.innerHTML = "";
  todayContainer.append(card);
}

// Display forecast cards from open weather api data.
function renderForecastCard(forecast) {
  var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
  var iconDescription = forecast.weather[0].description;
  var tempF = forecast.main.temp;
  var humidity = forecast.main.humidity;
  var windMph = forecast.wind.speed;
  var col = document.createElement("div");
  var card = document.createElement("div");
  var cardBody = document.createElement("div");
  var cardTitle = document.createElement("h5");
  var weatherIcon = document.createElement("img");
  var tempEl = document.createElement("p");
  var humidityEl = document.createElement("p");
  var windEl = document.createElement("p");
  
  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, humidityEl, windEl);
  col.setAttribute("class", "col-md");
  col.classList.add("five-day-card");
  card.setAttribute("class", "card bg-primary h-100 text-white");
  cardBody.setAttribute("class", "card-body p-2");
  cardTitle.setAttribute("class", "card-title");
  tempEl.setAttribute("class", "card-text");
  humidityEl.setAttribute("class", "card-text");
  windEl.setAttribute("class", "card-text");
  cardTitle.textContent = dayjs(forecast.dt_txt).format("M/D/YYYY");
  weatherIcon.setAttribute("src", iconUrl);
  weatherIcon.setAttribute("alt", iconDescription);
  tempEl.textContent = `Temp: ${tempF} °F`;
  humidityEl.textContent = `Humidity: ${humidity} %`;
  windEl.textContent = `Wind: ${windMph} MPH`;
  forecastContainer.append(col);
}
// The 5 day forecast with timestamps.
// Filters and returns data captured at noon for each day.
// Returns data between one day after the current data, to 5 days later.
function renderForecast(dailyForecast) {
  var startDt = dayjs().add(1, "day").startOf("day").unix();
  var endDt = dayjs().add(6, "day").startOf("day").unix();
  var headingCol = document.createElement("div");
  var heading = document.createElement("h4");
  headingCol.setAttribute("class", "col-12");
  heading.textContent = "5-Day Forecast:";
  headingCol.append(heading);
  forecastContainer.innerHTML = "";
  forecastContainer.append(headingCol);
  for (var i = 0; i < dailyForecast.length; i++) {
    if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {
      if (dailyForecast[i].dt_txt.slice(11, 13) == "12") {
        renderForecastCard(dailyForecast[i]);
      }
    }
  }
}

var handleFormSubmit = function (event) {
  event.preventDefault();
  var nameInput = nameInputEl.val();
  var commentInput = commentInputEl.val();
  // if (!nameInput || !commentInput) {
  //   console.log('alt input, what other criteria to search for?');
  //   return;
  // }
  fetchCoords(nameInput);
  printQueryData(nameInput, commentInput);
  // reset form
  nameInputEl.val("");
  commentInputEl.val("");
};

formEl.on("submit", handleFormSubmit);

function renderItems(city, data) {
  renderCurrentWeather(city, data.list[0], data.city.timezone);
  renderForecast(data.list);
}

// Weather geolocation current and forecast data
// Call functions to display
function fetchWeather(location) {
  console.log("I'm inside function fetchWeather");
  var { lat } = location;
  var { lon } = location;
  var city = location.name;
  var apiUrl = `${weatherApiRootUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;
  //   var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=3fade8c75faf1243c424955cb9eafdfa`;
  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      renderItems(city, data);
    });
}

function fetchCoords(search) {
  var apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;
  //   var apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${name},USA&limit=5&appid=3fade8c75faf1243c424955cb9eafdfa`;
  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data[0]) {
        alert("Location does not exist");
      } else {
        appendToHistory(search);
        fetchWeather(data[0]);
      }
    });
}

// document.getElementById("stock").addEventListener("click", function(){
//   document.getElementById("myInput").value = this.value;
// });
// blank search form verify or no search
function handleSearchFormSubmit(e) {
  if (!searchInput.value) {
    return;
  }
  e.preventDefault();
  var search = searchInput.value.trim();
  fetchCoords(search);
  searchInput.value = "";
}
// search history button verify
function handleSearchHistoryClick(e) {
  if (!e.target.matches(".btn-history")) {
    return;
  }
  var btn = e.target;
  var search = btn.getAttribute("data-search");
  fetchCoords(search);
}
// Function to display the search history list.
// Start at end of history array and count down to show the most recent at the top.
// `data-search` allows access to city name with click handler
function renderSearchHistory() {
  searchHistoryContainer.innerHTML = "";
  for (var i = searchHistory.length - 1; i >= 0; i--) {
    var btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.setAttribute("aria-controls", "today forecast");
    btn.classList.add("history-btn", "btn-history");
    btn.setAttribute("data-search", searchHistory[i]);
    btn.textContent = searchHistory[i];
    searchHistoryContainer.append(btn);
  }
}
// Update search history in local storage
function appendToHistory(search) {
  if (searchHistory.indexOf(search) !== -1) {
    return;
  }
  searchHistory.push(search);
  localStorage.setItem("search-history", JSON.stringify(searchHistory));
  renderSearchHistory();
}
// Get search history from local storage.
function initSearchHistory() {
  var storedHistory = localStorage.getItem("search-history");
  if (storedHistory) {
    searchHistory = JSON.parse(storedHistory);
  }
  renderSearchHistory();
}
initSearchHistory();
searchForm.addEventListener("submit", handleSearchFormSubmit);
searchHistoryContainer.addEventListener("click", handleSearchHistoryClick);

// Timezone plugins to day.js
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);
// The current time in the format: hours:minutes:seconds
var time = dayjs().format("hh:mm:ss");
$("#3a").text(time);
