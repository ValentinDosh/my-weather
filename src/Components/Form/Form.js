import React from 'react';
import './Form.css';

const Form = (props) => {

	

	return (
			<form className="form" onSubmit={props.weatherMethod}>

				<select name="city" className="cities">
					<option>Выберите город</option>
					<option value="Minsk">Минск</option>
  					<option value="London">Лондон</option>
  					<option value="Moscow">Москва</option>
					<option value="New York">Нью-Йорк</option>
					<option value="Kiev">Киев</option>
  					<option value="Berlin">Берлин</option>
  					<option value="Paris">Париж</option>
					<option value="Taganrog">Таганрок</option>
				</select>
				<select name="service" className="services">
					<option>Выберите сервис</option>
					<option value="OpenWeather">Open Weather</option>
					<option value="APIXU">APIXU</option>
				</select>
			      	<button className="button">Получить информацию</button>
			</form>
	);
}

export default Form;