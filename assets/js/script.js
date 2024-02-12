const apiKey = '18383a477dce3195768091ae9235b252';

$(function() {
    
    function forecastLookup(lat, lon){
        fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&cnt=6`)
        .then(function (response){
            return response.json();
        })
        .then(function(data) {
            console.log(data);
        })
    }

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