import React, {useState, useEffect} from 'react';
import axios from 'axios';
import WeatherType from './types/Weather';
import Position from './types/Position';
import './weather.css';

const WEATHER_API_KEY = 'd8307bc01685cdccd72639be4759b286';

export default function WeatherInfoDisplay() {
    const [weatherInfo, setWeatherInfo] = useState<WeatherType>();
    const [location, setLocation] = useState<Position>();
    const defaultCity = 'Budapest';

    useEffect(() => {
        if(!weatherInfo) {
            getLocation();
        }
    });

    function getLocation() {
        const options = {};

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successCallback);
        } else {
            debugger;
        }
    }

    function successCallback(position: Position) {
        const { coords } = position;

        axios.get('http://api.openweathermap.org/data/2.5/weather',
            {params: {lat: coords.latitude, lon: coords.longitude, appid:WEATHER_API_KEY, units: 'metric'}})
            .then(function(response) {
                setWeatherInfo(response.data);
            });
    }

    function errorCallback(position: Position) {
        axios.get('http://api.openweathermap.org/data/2.5/weather',
            {params: {city: 'Budapest', appid:WEATHER_API_KEY, units: 'metric'}})
            .then(function(response) {
                setWeatherInfo(response.data);
            });
    }

    return <div>
            <p className="display-1 degree">{weatherInfo && weatherInfo.main && weatherInfo.main.temp} °C</p>
            <p>{weatherInfo && weatherInfo.name}</p>
            <i className="fa fa-sun-o loading-spinner"/>
        </div>;
}