function attachEvents() {
    const getWeatherBtn = document.getElementById('submit');
    getWeatherBtn.addEventListener('click', weatherHandler);
    const inputField = document.getElementById('location');

    let conditions = {
        Sunny: () => '☀',
        'Partly sunny': () => '⛅',
	    Overcast: () => '☁',
    	Rain: () => '☂',
    };

    function weatherHandler() {
        let forecastDisplay = document.getElementById('forecast');
        forecastDisplay.style.display = 'block';

        let currentForecastDiv = document.querySelector('#current');
        Array.from(currentForecastDiv.children).forEach((el, i) => {
            i !== 0 ? el.remove(): el;
        });
        let upcomingForecastDiv = document.querySelector('#upcoming');
        Array.from(upcomingForecastDiv.children).forEach((el, i) => {
            i !== 0 ? el.remove(): el;
        });

        const locationName = inputField.value;

        fetch('http://localhost:3030/jsonstore/forecaster/locations')
            .then(response => response.json())
            .then(locations => {
                let loc = locations.find(l => l.name == locationName);
                return fetch(`http://localhost:3030/jsonstore/forecaster/today/${loc.code}`)
                    .then(res => res.json())
                    .then(currentForecast => ({code:loc.code, currentForecast}));
            })
            .then(({code, currentForecast}) => {
                let htmlReport = createCurrWeatherElements(currentForecast);
                currentForecastDiv.appendChild(htmlReport);

                return fetch(`http://localhost:3030/jsonstore/forecaster/upcoming/${code}`);
            })
            .then(x => x.json())
            .then(upcomingWeather => {
                let upcomingForecast = createUpcomingElements(upcomingWeather);
                upcomingForecastDiv.appendChild(upcomingForecast);
            })
            .catch(err => {
                let errorDiv = document.createElement('div');
                errorDiv.classList.add('label');
                errorDiv.textContent = 'ERROR';
                currentForecastDiv.appendChild(errorDiv);
            });

            function createUpcomingElements(weatherForecast) {
                let forecastInfoDiv = document.createElement('div');
                forecastInfoDiv.classList.add('forecast-info');

                let day1Html = createDayReport(weatherForecast.forecast[0]);
                let day2Html = createDayReport(weatherForecast.forecast[1]);
                let day3Html = createDayReport(weatherForecast.forecast[2]);

                forecastInfoDiv.appendChild(day1Html);
                forecastInfoDiv.appendChild(day2Html);
                forecastInfoDiv.appendChild(day3Html);

                return forecastInfoDiv;
            }

            function createDayReport(forecast) {
                let upcomingSpan = document.createElement('span');
                upcomingSpan.classList.add('upcoming');

                let symbolSpan = document.createElement('span');
                symbolSpan.classList.add('symbol');
                symbolSpan.textContent = conditions[forecast.condition]();

                let degreeSpan = document.createElement('span');
                degreeSpan.classList.add('forecast-data');
                degreeSpan.textContent = `${forecast.low}°/${forecast.high}°`;

                let weatherSpan = document.createElement('span');
                weatherSpan.classList.add('forecast-data');
                weatherSpan.textContent = forecast.condition;

                upcomingSpan.appendChild(symbolSpan);
                upcomingSpan.appendChild(degreeSpan);
                upcomingSpan.appendChild(weatherSpan);

                return upcomingSpan;
            }

            function createCurrWeatherElements(weatherForecast) {
                let forecastDiv = document.createElement('div');
                forecastDiv.classList.add('forecasts');

                let symbolSpan = document.createElement('span');
                symbolSpan.classList.add('condition', 'symbol');
                symbolSpan.textContent = conditions[weatherForecast.forecast.condition]();
            
                let upcomingSpan = document.createElement('span');
                upcomingSpan.classList.add('condition');

                let nameSpan = document.createElement('span');
                nameSpan.classList.add('forecast-data');
                nameSpan.textContent = weatherForecast.name;

                let degreeSpan = document.createElement('span');
                degreeSpan.classList.add('forecast-data');
                degreeSpan.textContent = `${weatherForecast.forecast.low}°/${weatherForecast.forecast.high}°`;

                let weatherSpan = document.createElement('span');
                weatherSpan.classList.add('forecast-data');
                weatherSpan.textContent = weatherForecast.forecast.condition;

                upcomingSpan.appendChild(nameSpan);
                upcomingSpan.appendChild(degreeSpan);
                upcomingSpan.appendChild(weatherSpan);
                
                forecastDiv.appendChild(upcomingSpan);
                forecastDiv.appendChild(symbolSpan);

                return forecastDiv;
            }
    }
}
attachEvents();