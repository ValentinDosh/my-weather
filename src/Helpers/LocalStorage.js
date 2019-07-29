import Keys from "../Data/Keys";

let openWeatherRequests = [];
let APIXURequests = [];

export const addLocaleStorage = (weather, service) => {
  if (service === Keys[0].key) {
    openWeatherRequests.push({ data: weather, date: new Date().getTime() });
    localStorage.setItem("APIXU", JSON.stringify(openWeatherRequests));
  } else {
    APIXURequests.push({ data: weather, date: new Date().getTime() });
    localStorage.setItem("OpenWeather", JSON.stringify(APIXURequests));
  }
};

export const updateLocaleStorage = (weather, service, index) => {
  if (service === Keys[0].key) {
    openWeatherRequests[index].data = weather;
    openWeatherRequests[index].date = new Date().getTime();
    localStorage.setItem("APIXU", JSON.stringify(openWeatherRequests));
  } else {
    APIXURequests[index].data = weather;
    APIXURequests[index].date = new Date().getTime();
    localStorage.setItem("OpenWeather", JSON.stringify(APIXURequests));
  }
};
