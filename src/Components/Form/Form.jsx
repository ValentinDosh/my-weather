import React from "react";
import PropTypes from "prop-types";
import "./Form.css";

const Form = props => {
  const {
    weatherMethod,
    formCitiesChangeHandler,
    formServicesChangeHandler,
    form
  } = props;
  const [cities, services] = form;
  return (
    <form className="form" onSubmit={weatherMethod}>
      <input
        type="text"
        name="city"
        placeholder="Ener your city name"
        className="cities"
        value={cities.value}
        onChange={formCitiesChangeHandler}
      />
      <select
        name="service"
        className="services"
        value={services.value}
        onChange={formServicesChangeHandler}
      >
        <option value="">Choose a service</option>
        <option value="OpenWeather">Open Weather</option>
        <option value="APIXU">APIXU</option>
      </select>
      <button className="button" type="submit">
        Получить информацию
      </button>
    </form>
  );
};

Form.propTypes = {
  weatherMethod: PropTypes.func.isRequired,
  formCitiesChangeHandler: PropTypes.func.isRequired,
  formServicesChangeHandler: PropTypes.func.isRequired,
  form: PropTypes.array.isRequired
};

export default Form;
