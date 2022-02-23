import { Component } from "react";
import { Dropdown } from "react-bootstrap";
import MovieRelation from "./movieRelation";

import "./datePicker.css";

// At this point the configuration is done on individual component level but
//need to be fixed and need to call from root level// index.js

const neo4j = require("neo4j-driver");
const driver = neo4j.driver(
  "bolt://54.211.132.106:7687",
  neo4j.auth.basic("neo4j", "console-august-buckle"),
  {
    /* encrypted: 'ENCRYPTION_OFF' */
  }
);

let session = driver.session({ database: "neo4j" });

//required parameter
let params = { startyear: 1975, lastyear: 1975 };
//intialize movieData Variable so that it would be avaialble throughout the component and can share data with others.
let movieData = [];
let query = "";


class DropDownDemo extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.myData?.startyear);
    query =
      "Match (m:Movie) WHERE $startyear<=m.released<=$lastyear RETURN m.title as movies";
    //   console.log(typeof this.props.myData?.startyear);
    params = {
      startyear: Number(this.props.myData?.startyear),
      lastyear: Number(this.props.myData?.endyear),
    };
    this.state = {
      selectedMovie: "",
    };
  }

  componentDidMount() {
    this.populateData();
  }

  componentDidUpdate() {
    // session = driver.session({ database: "neo4j" });
    query =
      "Match (m:Movie) WHERE $startyear<=m.released<=$lastyear RETURN m.title as movies";
    params = {
      startyear: Number(this.props.myData?.startyear),
      lastyear: Number(this.props.myData?.endyear),
    };
    movieData.length = 0;
    this.populateData();
  }

  populateData() {
    session
      .run(query, params)
      .then((result) => {
        result.records.forEach((record) => {
          movieData.push(record.get("movies"));
        });
        console.log();
        this.forceUpdate();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  changeMovieTitle = (e) => {
    this.setState({
      selectedMovie: e,
    });
  };

  render() {
    return (
      <div className="movieList">
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Movies
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {movieData?.map((movie) => (
              <Dropdown.Item onClick={() => this.changeMovieTitle(movie)}>
                {movie}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <MovieRelation myMovie={this.state.selectedMovie} />
      </div>
    );
  }
}

export default DropDownDemo;
