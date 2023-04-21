

// API info
// Name:
// Default
// Key:
// 3fade8c75faf1243c424955cb9eafdfa


var formEl = $('#currentCity');
var nameInputEl = $('#name-input');
var commentInputEl = $('#comment-input');

var locationDisplayEl = $('#locationDisplay');

//weather data

function renderCurrentWeather(city, weather) {
  var date = dayjs().format('M/D/YYYY');
  // Store response data from our fetch request in variables
  var tempF = weather.main.temp;
  var windMph = weather.wind.speed;
  var humidity = weather.main.humidity;
  var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
  var iconDescription = weather.weather[0].description || weather[0].main;

  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var heading = document.createElement('h2');
  var weatherIcon = document.createElement('img');
  var tempEl = document.createElement('p');
  var windEl = document.createElement('p');
  var humidityEl = document.createElement('p');

  card.setAttribute('class', 'card');
  cardBody.setAttribute('class', 'card-body');
  card.append(cardBody);

  heading.setAttribute('class', 'h3 card-title');
  tempEl.setAttribute('class', 'card-text');
  windEl.setAttribute('class', 'card-text');
  humidityEl.setAttribute('class', 'card-text');

  heading.textContent = `${city} (${date})`;
  weatherIcon.setAttribute('src', iconUrl);
  weatherIcon.setAttribute('alt', iconDescription);
  weatherIcon.setAttribute('class', 'weather-img');
  heading.append(weatherIcon);
  tempEl.textContent = `Temp: ${tempF}°F`;
  windEl.textContent = `Wind: ${windMph} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;
  cardBody.append(heading, tempEl, windEl, humidityEl);

  todayContainer.innerHTML = '';
  todayContainer.append(card);
}





// hx below

var printQueryData = function (name, comment) {
  var cardColumnEl = $('<div>');
  cardColumnEl.addClass('col-12 col-sm-4 col-md-3');

  var cardEl = $('<div>');
  // Add a class of .custom-card
  cardEl.addClass('card h-100 custom-card');
  cardEl.appendTo(cardColumnEl);

  // Add a class of .custom-card-header
  var cardName = $('<h5>').addClass('card-header custom-card-header').text(name);
  cardName.appendTo(cardEl);

  var cardBodyEl = $('<div>');
  cardBodyEl.addClass('card-body');
  cardBodyEl.appendTo(cardEl);

  var cardComment = $('<p>').addClass('card-text').text(comment);
  cardComment.appendTo(cardBodyEl);

  locationDisplayEl.append(cardColumnEl);
};

var handleFormSubmit = function (event) {
  event.preventDefault();

  var nameInput = nameInputEl.val();
  var commentInput = commentInputEl.val();

  // if (!nameInput || !commentInput) {
  //   console.log('Where are you plannning going to?');
  //   return;
  // }

  fetchCoords(nameInput);

  printQueryData(nameInput, commentInput);

  // reset form
  nameInputEl.val('');
  commentInputEl.val('');
};

formEl.on('submit', handleFormSubmit);

function renderItems(city, data) {
  renderCurrentWeather(city, data.list[0], data.city.timezone);
  renderForecast(data.list);
}

function fetchWeather(location) {
  console.log("I'm inside function fetchWeather");
  var { lat } = location;
  var { lon } = location;
  var city = location.name;

  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=3fade8c75faf1243c424955cb9eafdfa`;
    
  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);
       renderItems(city, data);
    })
    .catch(function (err) {
      console.error(err);
    });
}

// search => name

function fetchCoords(name) {
  var apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${name},USA&limit=5&appid=3fade8c75faf1243c424955cb9eafdfa`;

  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data[0]) {
        alert('Location not found');
      } else {
        // appendToHistory(name);
        fetchWeather(data[0]);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}

// 3. What is the current time in the format: hours:minutes:seconds
var time = dayjs().format('hh:mm:ss');
$('#3a').text(time);