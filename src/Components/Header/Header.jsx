import React from "react";
import Clock from "../Clock/Clock";
import "./Header.css";
const COEFICCIENT_TRANSLATE_TO_CELSI = 273.15;

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: null,
      temperature: null
    };
  }

  componentWillMount() {
    const { name, temp } = this.checkService(this.props);
    this.setState({
      city: name,
      temperature: temp
    });
  }

  componentWillReceiveProps(nextProps) {
    const { name, temp } = this.checkService(nextProps);
    this.setState({
      city: name,
      temperature: temp
    });
  }

  checkService = props => {
    const { currentWeatherApi } = props;
    let name;
    let temp;

    if (!currentWeatherApi) {
      ({
        weather: {
          name,
          main: { temp }
        }
      } = props);
      temp -= COEFICCIENT_TRANSLATE_TO_CELSI;
    } else {
      ({
        weather: {
          location: { name },
          current: { temp_c: temp }
        }
      } = props);
    }
    return { name, temp };
  };

  render() {
    const { city, temperature } = this.state;
    return (
      <div className="container header-container">
        <div className="row">
          <div className=".col-12 col-md-4">
            <span className="temp">
              {Math.floor(temperature)}
              &#176;
            </span>
          </div>
          <div className=".col-12 col-md-5 containerCity">
            <span className="city">{city}</span>
          </div>
          <div className=".col-12 col-md-3 containerDate">
            <Clock />
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
