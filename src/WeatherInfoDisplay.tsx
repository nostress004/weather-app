import React, {useState, useEffect} from 'react';
import axios from 'axios';
import WeatherType from './types/Weather';
import Position from './types/Position';
import PositionError from './types/PositionError';
import './weather.css';

const WEATHER_API_KEY = '67016261fe6f47307e52b966d81605ef';

export default function WeatherInfoDisplay() {
    const [weatherInfo, setWeatherInfo] = useState<WeatherType>();
    const [loaded, setLoaded] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [currentCity, setCurrentCity] = useState<string>('');
    const defaultCity = 'Budapest';

    useEffect(() => {
        getLocation();
    }, []);

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        }
    }

    function successCallback(position: Position) {
        const { coords } = position;

        axios.get('http://api.openweathermap.org/data/2.5/weather',
            {params: {lat: coords.latitude, lon: coords.longitude, appid: WEATHER_API_KEY, units: 'metric'}})
            .then(function(response) {
                setWeatherInfo(response.data);
                setLoaded(true);
            });
    }

    function errorCallback(position: PositionError) {
        setLoaded(true);
    }

    function getWeatherByCity(city: string) {
        axios.get('http://api.openweathermap.org/data/2.5/weather',
            {params: {q: city, appid: WEATHER_API_KEY, units: 'metric'}})
            .then(function(response) {
                 setWeatherInfo(response.data);
                 setLoaded(true);
             })
            .catch(error => {
                setErrorMessage('Could not find location, please try another one!');
            });
    }

    function submitCityForm(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();

        if (currentCity) {
            getWeatherByCity(currentCity);
        }
    }

    function handleChange(event: React.FormEvent<HTMLInputElement>) {
        const target = event.target as HTMLTextAreaElement;
        setCurrentCity(target.value);
    }

    return <div>
        {weatherInfo &&
            <div className=''>
                <p className="display-1 degree">{weatherInfo && weatherInfo.main && weatherInfo.main.temp} °C</p>
                <p>{weatherInfo && weatherInfo.name}</p>
                <p>{weatherInfo && weatherInfo.weather && weatherInfo.weather[0].main}</p>
                <img src={`http://openweathermap.org/img/wn/${ weatherInfo && weatherInfo.weather && weatherInfo.weather[0].icon}@2x.png`} />
            </div>}
            {!weatherInfo && loaded &&
                <form onSubmit={submitCityForm}>
                    <small>We could not get your current location, please enter your current city</small>
                    <div className="form-group">
                        <input className="input-field" placeholder="Budapest" onChange={handleChange}/>
                        <button type="submit" className="btn btn-outline-success submitbutton">Submit</button>
                    </div>
                    {errorMessage && <small>{errorMessage}</small>}
                </form>
            }
        </div>;
}