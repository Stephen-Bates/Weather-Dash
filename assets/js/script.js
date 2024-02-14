const apiKey = '18383a477dce3195768091ae9235b252';

$(function() {
    
    // After DOM initializes, create buttons for each saved search option
    for(var location of loadLocations()){
        $('<li />')
        .append($('<button />', {
            text: location.name
        }))
        .appendTo('#saved-searchs');
    }
    
    // Function to load and return previously searched locations
    function loadLocations(){
        var savedLocations = JSON.parse(localStorage.getItem('savedLocations'));
        if(!savedLocations){
            savedLocations = [];
        }
        return savedLocations;
    }
    
    // Function to save a new location to previous searchs
    function saveLocation(locationData){
        var locations = loadLocations();

        // Don't save if it already exists
        if(!locations.some(i => i.name === locationData.name)){
            locations.push(locationData);
        }
        localStorage.setItem('savedLocations',JSON.stringify(locations));
    }

    // Function to query openWeather for weather data at a location
    function forecastLookup(lat, lon){
        fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&cnt=6`)
        .then(function (response){
            return response.json();
        })
        .then(function(data) {
            console.log(data);
        })
    }

    // Function to query openWeather geocoder api for locations data of a city
    function locationLookup(location){
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${apiKey}`)
        .then(function (response){
            return response.json();
        })
        .then(function(data) {
            if(data.length){
                saveLocation(data[0]);
            }

           // forecastLookup(data[0].lat,data[0].lon);
        })
    }

    $('#location-search').on('submit', function(event){
        event.preventDefault();

        let location =  $(this).serialize().split('=')[1];

        locationLookup(location);
    })
})