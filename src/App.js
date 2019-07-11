import React from 'react';
import './App.css';
import Header from './Components/Header/Header.js';
import Form from './Components/Form/Form.js';
import GeoData from './Components/GeoData/GeoData.js';
import axios from 'axios';


const timeCheck = 60 * 60 * 2 * 1000; // 2 hours(ms)
const weatherKeys =[
	{
		name: "OpenWeather",
		key: "1c351509e3900fb1d311487716229c6f"
	},
	{
		name: "APIXU",
		key: "46771c4c18874f9493975424192606"
	}
]

var openWeatherRequests = [

]

var APIXURequests = [

]

class App extends React.Component{
	constructor(props) {
		super(props);	
		this.state = {
			currentWeatherApi: 0,
			city: null,
			latitude: null,
			longitude: null,
			weather: null,
			error: null
		};
	}

	componentDidMount() {
		const latitude = localStorage.getItem('latitude');
		const longitude = localStorage.getItem('longitude');

		if (longitude && latitude){
			return this.getWeather(weatherKeys[this.state.currentWeatherApi].key, latitude, longitude)
		}

		this.getWeather(weatherKeys[this.state.currentWeatherApi].key, null, null)
	}

	getGeoPosition = () =>  new Promise ((resolve, reject) =>{
		navigator.geolocation.getCurrentPosition(
      	(position) => {

				const {latitude, longitude} = position.coords;
        this.setState({
          latitude,
          longitude,
          error: null,
				});

				localStorage.setItem('latitude', latitude);
				localStorage.setItem('longitude', longitude);
				resolve (true)
      },
      (error) => {
				this.setState({ error: error.message })
				reject(false)
			},
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
		);
	})

	getApiWeather = async( key, latitude, longitude)=>{
		const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`)
		const weather = res.data;
		openWeatherRequests.push({data: weather, date: new Date().getTime()})
		localStorage.setItem('openWeather', JSON.stringify(openWeatherRequests));
		localStorage.setItem('APIXU',JSON.stringify([]));
		this.setState({ weather });

	}

	getWeather = async (key, latitude, longitude) => {
		if ( latitude && longitude) {
			this.getApiWeather(key, latitude, longitude);
			return
		}

		const isGeolocation =  await this.getGeoPosition();
		
		if (isGeolocation){
			const {latitude, longitude} = this.state
			this.getApiWeather(key, latitude, longitude);
		}
	}

	async checkStateAPIXURequest(objectRequests, city, ikey){
		var currentTime = new Date().getTime();
		var isThereCity = false;
		var res = undefined;

		for(var i = 0; i < objectRequests.length; i++){
			if(city === objectRequests[i].data.location.name){
				if(currentTime - objectRequests[i].date < timeCheck){
					this.setState({ weather:  objectRequests[i].data,
									currentWeatherApi: 1});
					return;
				}
				else{
					res = 
					await axios.get(`http://api.apixu.com/v1/current.json?key=${weatherKeys[ikey - 1].key}&q=${city}`);
					const weather = res.data;
					this.setState({ weather,
									currentWeatherApi: 1});
					APIXURequests[i].data = weather;
					APIXURequests[i].date = new Date().getTime();
					localStorage.setItem('APIXU', JSON.stringify(APIXURequests));
					return;
				}
			}
		}
		if(!isThereCity){
			res = 
			await axios.get(`http://api.apixu.com/v1/current.json?key=${weatherKeys[ikey - 1].key}&q=${city}`);
			const weather = res.data;
			this.setState({ weather,
							currentWeatherApi: 1});
			APIXURequests.push({data: weather, date: new Date().getTime()});
			localStorage.setItem('APIXU', JSON.stringify(APIXURequests));
		}
	}

	async checkStateOpenWeatherRequest(objectRequests, city, ikey){
		var currentTime = new Date().getTime();
		var isThereCity = false;
		var res = undefined;

		for(var i = 0; i < objectRequests.length; i++){
			if(city === objectRequests[i].data.name){
				if(currentTime - objectRequests[i].date < timeCheck){
					this.setState({ weather:  objectRequests[i].data,
									currentWeatherApi: 0});
					return;
				}
				else{
					res = 
					await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherKeys[ikey - 1].key}`);
					const weather = res.data;
					this.setState({ weather,
									currentWeatherApi: 0});
					openWeatherRequests[i].data = weather;
					openWeatherRequests[i].date = new Date().getTime();
					localStorage.setItem('openWeather', JSON.stringify(openWeatherRequests));
					return;
				}
			}
		}

		if(!isThereCity){
			res = 
			await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherKeys[ikey - 1].key}`);
			const weather = res.data;
			this.setState({ weather,
							currentWeatherApi: 0 });
			openWeatherRequests.push({data: weather, date: new Date().getTime()});
			localStorage.setItem('openWeather', JSON.stringify(openWeatherRequests));
		}
	}

	
	gettingWeather = (e) => {
		// ovverride the default button handler
		e.preventDefault();
		// get city and service from component form's
		var selectCity = document.querySelector(".cities");
		var selectService = document.querySelector(".services");
		// if city is not selected, exit from handler
		if(selectCity.selectedIndex === 0 || selectService.selectedIndex === 0){
			return;
		}
		var city = selectCity.options[selectCity.selectedIndex].value;

		if(selectService.selectedIndex === 1){
			openWeatherRequests = JSON.parse(localStorage.getItem('openWeather'));
			this.checkStateOpenWeatherRequest(openWeatherRequests, city, selectService.selectedIndex);
			console.log(openWeatherRequests);
		}
		else{
			APIXURequests = JSON.parse(localStorage.getItem('APIXU'));
			this.checkStateAPIXURequest(APIXURequests, city, selectService.selectedIndex);
			console.log(APIXURequests);
		}
		console.log(this.state.weather);
	}
	
	render(){
		return (
			<div className="main-container">
				{this.state.weather && <Header weather={[this.state.weather, this.state.currentWeatherApi]}/>}
				<div className="container">
					<div className="row">
						<div className="offset-md-2 col-md-8 offset-lg-0 col-lg-5 col-xl-4">
							<Form weatherMethod={this.gettingWeather}/>
						</div>
						<div className="offset-md-2 col-md-8 offset-lg-0 col-lg-7 col-xl-8">
							{this.state.weather && <GeoData weather={[this.state.weather, this.state.currentWeatherApi]}/>}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default App;