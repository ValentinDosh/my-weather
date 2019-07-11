import React from 'react';
import './GeoData.css';

const GeoData = (props) => {
	var description = undefined;
	var speed = undefined;
	var pressure = undefined;

	if(!props.weather[1]){
		description = props.weather[0].weather[0].description;
		speed = props.weather[0].wind.speed;
		pressure = props.weather[0].main.pressure;
	}
	else{
		description = props.weather[0].current.condition.text;
		speed = Math.floor(props.weather[0].current.wind_kph / 3.619 * 10) / 10;
		pressure = props.weather[0].current.pressure_mb;
	}
	
	return (
			<div className="geodata-container">
				<ul>
					<li>{description} </li>
					<li>Wind speed <b>{speed} m/s</b></li>
					<li>Pressure: <b>{pressure} mmHg</b></li>
				</ul>
			</div>
		);
	}

export default GeoData;