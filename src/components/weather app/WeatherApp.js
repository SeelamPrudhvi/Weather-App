import React, { useEffect, useState } from "react";
import "./WeatherApp.css";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import humidity_icon from "../assets/humidity.png";
import rain_icon from "../assets/rain.png";
import search_icon from "../assets/search.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";

const WeatherApp = () => {
  let key = "a9d5f3652ddf8f7f507a9a93158820e9";

  const [wicon, setWicon] = useState(cloud_icon);
  const [loading, setLoading] = useState(false);

  // const [location, setLocation] = useState({ name: "", latitude: null, longitude: null });
  const [weatherData, setWeatherData] = useState({
    temp: "",
    location: "",
    humidity: "",
    windSpeed: "",
  });

  useEffect(() => {
    getLocation();
  }, []); // Run once when component mounts

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          // setLocation({ name: "Current Location", latitude, longitude });
          getWeatherByCoordinates(latitude, longitude);
        },
        () => {
          // Handle Geolocation error
          console.log("Geolocation request denied or failed.");
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const getWeatherByCoordinates = async (latitude, longitude) => {
    setLoading(true);
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=Metric&appid=${key}`;
      let response = await fetch(url);
      if (!response.ok) {
        throw new Error("Location not found. Please enter a valid location.");
      }
      let data = await response.json();
      // Update weather information based on data...
      updateWeatherInfo(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateWeatherInfo = (data, enteredLocation) => {
    const humidity = document.getElementsByClassName("humidity-percent");
    const wind = document.getElementsByClassName("wind-rate");
    const temp = document.getElementsByClassName("weather-temp");
    const locationElement = document.getElementsByClassName("weather-location");

    humidity[0].innerHTML = `${data.main.humidity} %`;
    wind[0].innerHTML = `${Math.floor(data.wind.speed)} km/h`;
    temp[0].innerHTML = `${Math.floor(data.main.temp)}℃`;

    if (enteredLocation !== undefined) {
      locationElement[0].innerHTML = enteredLocation;
    } else {
      locationElement[0].innerHTML = "Current Location";
    }

    if (data.weather[0].icon === "01d" || data.weather[0].icon === "01n") {
      setWicon(clear_icon);
    } else if (
      data.weather[0].icon === "02d" ||
      data.weather[0].icon === "02n"
    ) {
      setWicon(cloud_icon);
    } else if (
      data.weather[0].icon === "03d" ||
      data.weather[0].icon === "03n"
    ) {
      setWicon(drizzle_icon);
    } else if (
      data.weather[0].icon === "04d" ||
      data.weather[0].icon === "04n"
    ) {
      setWicon(drizzle_icon);
    } else if (
      data.weather[0].icon === "09d" ||
      data.weather[0].icon === "09n"
    ) {
      setWicon(rain_icon);
    } else if (
      data.weather[0].icon === "10d" ||
      data.weather[0].icon === "10n"
    ) {
      setWicon(rain_icon);
    } else if (
      data.weather[0].icon === "13d" ||
      data.weather[0].icon === "13n"
    ) {
      setWicon(snow_icon);
    } else {
      setWicon(clear_icon);
    }
  };

  const search = async () => {
    const element = document.getElementsByClassName("cityInput");
    const enteredLocation = element[0].value.trim();
    if (enteredLocation === "") {
      alert("please enter a location");
      // getLocation();
      return;
    }
    setLoading(true);
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${element[0].value}&units=Metric&appid=${key}`;
      let response = await fetch(url);
      if (!response.ok) {
        throw new Error("Location not found. Please enter a valid location.");
      }
      let data = await response.json();
      updateWeatherInfo(data, enteredLocation);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        <div className="top-bar">
          <input type="text" className="cityInput" placeholder="search" />
          <div
            className="search-icon"
            onClick={() => {
              search();
            }}
          >
            <img src={search_icon} alt=".." width="50px" />
          </div>
        </div>
        <div className="weather-image">
          <img src={wicon} alt=".." width={250} />
        </div>
        <div className="weather-temp">{weatherData.temp}</div>
        <div className="weather-location">{weatherData.location}</div>
        <div className="data-container">
          <div className="element">
            <img src={humidity_icon} alt="" className="icon" width={80} />
            <div className="data">
              <div className="humidity-percent">{weatherData.humidity}</div>
              <div className="text">Humidity</div>
            </div>
          </div>
          <div className="element">
            <img src={wind_icon} alt="" className="icon" width={80} />
            <div className="data">
              <div className="wind-rate">{weatherData.windSpeed}</div>
              <div className="text">Wind Speed</div>
            </div>
          </div>
        </div>
        {loading && <div className="loading-indicator">Loading...</div>}
      </div>
    </>
  );
};
export default WeatherApp;
