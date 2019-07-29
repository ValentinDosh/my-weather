import React from "react";
import PropTypes from "prop-types";
import "./GeoData.css";

const GeoData = props => {
  const COEFICCIENT_SPEED_FOR_TRANSLATE_TO_MS = 1000 / 3600;
  const { currentWeatherApi } = props;
  let pressure;
  let description;
  let speed;

  // если пришел Json(обьект) от сервиса OpenWeather
  if (!currentWeatherApi) {
    ({
      weather: {
        main: { pressure },
        weather: [{ description }],
        wind: { speed }
      }
    } = props);
  }
  // если пришел Json(обьект) от сервиса APIXU
  else {
    ({
      weather: {
        current: {
          pressure_mb: pressure,
          condition: { text: description },
          wind_kph: speed
        }
      }
    } = props);
    // округление до одного знака после запятой
    speed = Math.floor(speed * COEFICCIENT_SPEED_FOR_TRANSLATE_TO_MS * 10) / 10;
  }

  return (
    <div className="geodata-container">
      <ul>
        <li>{description} </li>
        <li>
          Wind speed:
          <b> {speed} m/s</b>
        </li>
        <li>
          Pressure:
          <b> {pressure} mmHg</b>
        </li>
      </ul>
    </div>
  );
};

GeoData.propTypes = {
  currentWeatherApi: PropTypes.number.isRequired
};

export default GeoData;
