import axios from "axios";
import Keys from "../Data/Keys";

export const getApiCityWeatherHelper = (city, service) => {
  if (service === Keys[0].name) {
    return axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${Keys[0].key}`
      )
      .then(res => {
        return res;
      })
      .catch(() => {
        alert("the city is not correct");
        return false;
      });
  }

  return axios
    .get(`http://api.apixu.com/v1/current.json?key=${Keys[1].key}&q=${city}`)
    .then(res => {
      return res;
    })
    .catch(() => {
      alert("the city is not correct");
      return false;
    });
};

export const getApiGeolocationWeatherHelper = (latitude, longitude) => {
  return axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${Keys[0].key}`
  );
};
