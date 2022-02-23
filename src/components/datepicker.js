import React, { Component } from "react";
import Slider from "react-rangeslider";
import "react-rangeslider/lib/index.css";
import App from "../App";
import DropDownDemo from "./dateDropDown";
import "./datePicker.css";

class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startyear: 1975,
      endyear: 2011,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  render() {
    return (
      <form>
        <div class="datePicker">
          {/* <App movieData={this.state}/> */}

          <label>
            Start Year:
            <input
              name="startyear"
              type="text"
              value={this.state.startyear}
              onChange={this.handleInputChange}
            />
          </label>
          <br />
          <label class="myLabel">
            End Year:
            <input
              name="endyear"
              type="text"
              value={this.state.endyear}
              onChange={this.handleInputChange}
            />
          </label>
        </div>
        <DropDownDemo myData={this.state} />
      </form>
    );
  }

  
}
export default Example;
