import React from "react";
import {
  getApiCityWeatherHelper,
  getApiGeolocationWeatherHelper
} from "./Api/WeatherApi";
import { addLocaleStorage, updateLocaleStorage } from "./Helpers/LocalStorage";
import Keys from "./Data/Keys";
import "./App.css";
import Header from "./Components/Header/Header";
import Form from "./Components/Form/Form";
import GeoData from "./Components/GeoData/GeoData";

const TIME_CHECK_OLD_REQUEST = 7200000; // 2 hours(ms)

let openWeatherRequests = [];

let APIXURequests = [];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentWeatherApi: 0,
      latitude: null,
      longitude: null,
      weather: null,
      form: [{ name: "cities", value: "" }, { name: "services", value: "" }]
    };
  }

  componentDidMount() {
    const latitude = localStorage.getItem("latitude");
    const longitude = localStorage.getItem("longitude");
    const { currentWeatherApi } = this.state;
    if (longitude && latitude) {
      return this.getWeather(Keys[currentWeatherApi].key, latitude, longitude);
    }

    this.getWeather(Keys[currentWeatherApi].key, null, null);
    return false;
  }

  getGeoPosition = async () => {
    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          this.setState({
            latitude,
            longitude
          });
          localStorage.setItem("latitude", latitude);
          localStorage.setItem("longitude", longitude);
          resolve(true);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    });
  };

  getApiWeather = async (key, latitude, longitude) => {
    const res = await getApiGeolocationWeatherHelper(latitude, longitude);
    const weather = res.data;
    addLocaleStorage(weather, "OpenWeather");
    this.setState({ weather });
  };

  getWeather = async (key, latitudeGet, longitudeGet) => {
    if (latitudeGet && longitudeGet) {
      this.getApiWeather(key, latitudeGet, longitudeGet);
      return;
    }

    const isGeolocation = await this.getGeoPosition();

    if (isGeolocation) {
      const { latitude, longitude } = this.state;
      this.getApiWeather(key, latitude, longitude);
    }
  };

  //
  gettingWeather = e => {
    // ovverride the default button handler
    e.preventDefault();

    const {
      form: [cities, services]
    } = this.state;

    // if city is not selected, exit from handler
    if (cities.value === "" || services.value === "") {
      return;
    }

    if (services.value === "OpenWeather") {
      openWeatherRequests = JSON.parse(localStorage.getItem("openWeather"));
      this.checkStateOpenWeatherRequest(
        openWeatherRequests,
        cities.value,
        services.value
      );
    } else {
      APIXURequests = JSON.parse(localStorage.getItem("APIXU"));
      this.checkStateAPIXURequest(APIXURequests, cities.value, services.value);
    }
  };

  formCitiesChangeHandler = e => {
    const {
      form: [, services]
    } = this.state;
    this.setState({
      form: [{ name: "cities", value: e.target.value }, services]
    });
  };

  formServicesChangeHandler = e => {
    const {
      form: [cities]
    } = this.state;
    this.setState({
      form: [cities, { name: "services", value: e.target.value }]
    });
  };

  async checkStateOpenWeatherRequest(objectRequests, city, service) {
    const currentTime = new Date().getTime();
    const isThereCity = false;
    let res;

    for (let i = 0; i < objectRequests.length; i += 1) {
      if (city === objectRequests[i].data.name) {
        if (currentTime - objectRequests[i].date < TIME_CHECK_OLD_REQUEST) {
          this.setState({
            weather: objectRequests[i].data,
            currentWeatherApi: 0
          });
          return;
        }

        res = await getApiCityWeatherHelper(city, service);
        if (!res) {
          return;
        }
        const weather = res.data;
        this.setState({ weather, currentWeatherApi: 0 });
        updateLocaleStorage(weather, service, i);
        return;
      }
    }

    if (!isThereCity) {
      res = await getApiCityWeatherHelper(city, service);
      if (!res) {
        return;
      }
      const weather = res.data;
      this.setState({ weather, currentWeatherApi: 0 });
      addLocaleStorage(weather, service);
    }
  }

  async checkStateAPIXURequest(objectRequests, city, service) {
    const currentTime = new Date().getTime();
    const isThereCity = false;
    let res;

    for (let i = 0; i < objectRequests.length; i += 1) {
      if (city === objectRequests[i].data.location.name) {
        if (currentTime - objectRequests[i].date < TIME_CHECK_OLD_REQUEST) {
          this.setState({
            weather: objectRequests[i].data,
            currentWeatherApi: 1
          });
          return;
        }
        res = await getApiCityWeatherHelper(city, service);
        if (!res) {
          return;
        }
        const weather = res.data;
        this.setState({ weather, currentWeatherApi: 1 });
        updateLocaleStorage(weather, service, i);
        return;
      }
    }
    if (!isThereCity) {
      res = await getApiCityWeatherHelper(city, service);
      if (!res) {
        return;
      }
      const weather = res.data;
      this.setState({ weather, currentWeatherApi: 1 });
      addLocaleStorage(weather, service);
    }
  }

  render() {
    const { weather, currentWeatherApi, form } = this.state;
    return (
      <div className="main-container">
        {weather && (
          <Header weather={weather} currentWeatherApi={currentWeatherApi} />
        )}
        <div className="container">
          <div className="row">
            <div className="offset-md-2 col-md-8 offset-lg-0 col-lg-5 col-xl-4">
              <Form
                weatherMethod={this.gettingWeather}
                formCitiesChangeHandler={this.formCitiesChangeHandler}
                form={form}
                formServicesChangeHandler={this.formServicesChangeHandler}
              />
            </div>
            <div className="offset-md-2 col-md-8 offset-lg-0 col-lg-7 col-xl-8">
              {weather && (
                <GeoData
                  weather={weather}
                  currentWeatherApi={currentWeatherApi}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
