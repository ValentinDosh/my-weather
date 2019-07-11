import React from 'react';
import './Header.css';

class Header extends React.Component{

	constructor(props) {
		super(props);
		this.state = {date: new Date()};
	  }

	  city = undefined;
	  temp = undefined;

	  componentDidMount() {
		this.timerID = setInterval(
		  () => this.tick(),
		  1000
		);
	  }
	
	  componentWillUnmount() {
		clearInterval(this.timerID);
	  }
	
	  tick() {
		this.setState({
		  date: new Date()
		});
	  }

	render(){
		if(!this.props.weather[1]){
			this.city = this.props.weather[0].name;
			this.temp = this.props.weather[0].main.temp - 273.15;
		}
		else{
			this.city = this.props.weather[0].location.name;
			this.temp = this.props.weather[0].current.temp_c;
		}
	
		return (
			<div className="container header-container">
			  <div className="row">
			    <div className=".col-12 col-md-4">
			      <span className="temp">{Math.floor(this.temp)}&#176;</span>
			    </div>
			    <div className=".col-12 col-md-5 containerCity">
			    	<span className="city">{this.city}</span>
			    </div>
			    <div className=".col-12 col-md-3 containerDate">
			      <span className="clock">{this.state.date.toLocaleTimeString()}</span>
			    </div>
			  </div>
			</div>
		);
	}
}

export default Header;