const apiKey = '18383a477dce3195768091ae9235b252';

$(function () {
    // After DOM initializes, create buttons for each saved search option
    updateQuickSelects();

    function updateQuickSelects() {
        $('#saved-searchs').empty();
        for (var data of loadLocations()) {
            addQuickSelect(data);
        }
    }

    // Add a quick select button for saved search locations
    function addQuickSelect(data) {
        $('<li />', {
            class: "d-flex justify-content-center m-3 col"
        })
            .append($('<button />', {
                text: data.name,
                class: "btn bg-secondary"
            })).on('click', event => updateLocation(data))
            .appendTo('#saved-searchs');
    }

    // Function to load and return previously searched locations
    function loadLocations() {
        var savedLocations = JSON.parse(localStorage.getItem('savedLocations'));
        if (!savedLocations) {
            savedLocations = [];
        }
        return savedLocations;
    }

    // Function to save a new location to previous searchs
    function saveLocation(locationData) {
        var locations = loadLocations();

        // Don't save if it already exists
        if (!locations.some(i => i.name === locationData.name)) {
            locations.push(locationData);
        }
        localStorage.setItem('savedLocations', JSON.stringify(locations));
        updateQuickSelects();
    }

    // Updates weather elements with weather data for new location
    // In : [location latitude, location longitude]
    function updateLocation(data) {
        weatherLookup(data, updateWeather);
        forecastLookup(data, updateForecast);
    }

    function updateWeather(data) {
        console.log(data);
        console.log(data.weather[0].icon);
        $('#daily-forecast').find('#name').text(data.name).end()
            .find('.date').text(new Date().toISOString().slice(0, 10)).end()
            .find('.icon').attr('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`).end()
            .find('.temp').text(`Temp: ${data.main.temp}°F`).end()
            .find('.wind').text(`Wind: ${data.wind.speed} MPH`).end()
            .find('.humidity').text(`Humidity: ${data.main.humidity}%`)
    }

    function updateForecast(data) {
        const regex = new RegExp("9:00:00$")
        let fiveDayForecast = data.list.filter(res => regex.test(res.dt_txt));

        $('#five-day-forecast li').map((i, dailyForecast) => {
            let forecast = fiveDayForecast[i];

            // early exit if there is no forecast
            if (!forecast) { return; }

            $(dailyForecast)
                .find('.date').text(forecast.dt_txt.split(" ")[0]).end()
                .find('.icon').attr('src', `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`).end()
                .find('.temp').text(`Temp: ${forecast.main.temp}°F`).end()
                .find('.wind').text(`Wind: ${forecast.wind.speed} MPH`).end()
                .find('.humidity').text(`Humidity: ${forecast.main.humidity}%`)
        })
    }

    // Function to query openWeather for current weather data at a location
    function weatherLookup(data, callback) {
        fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lon}&appid=${apiKey}&units=imperial`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                callback(data);
            })
    }

    // Function to query openWeather for weather forecast data at a location
    function forecastLookup(data, callback) {
        fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${data.lat}&lon=${data.lon}&appid=${apiKey}&units=imperial`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                callback(data);
            })
    }

    // Function to query openWeather geocoder api for locations data of a city
    function locationLookup(location, callback) {
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${apiKey}`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data.length) {
                    saveLocation(data[0]);
                    callback(data[0]);
                }
            })
    }

    $('#location-search').on('submit', function (event) {
        event.preventDefault();

        let location = $(this).serialize().split('=')[1];

        locationLookup(location, data => updateLocation(data))
    })

    $('#clear-searchs').on('click', function (event) {
        localStorage.setItem('savedLocations', JSON.stringify(""));

        $('#saved-searchs').empty();
    })
})