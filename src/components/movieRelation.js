import { Component } from "react";
import MoviePersonDetails from "./MoviePersonDetails";

const neo4j = require("neo4j-driver");
const driver = neo4j.driver(
  "bolt://54.211.132.106:7687",
  neo4j.auth.basic("neo4j", "console-august-buckle"),
  {
    /* encrypted: 'ENCRYPTION_OFF' */
  }
);

let params = { title: "" };

const session = driver.session({ database: "neo4j" });
let moviePopulatedData = [];
let query = "";
let movieTitle = "";
let isMatched = false;
class MovieRelation extends Component {
  constructor(props) {
    super(props);
    query =
      "MATCH (p:Person)-[relatedTo]-(m:Movie {title: $title}) return p.name, type(relatedTo)";
    params = { title: this.props.myMovie };
    this.state = {
      relationship: "",
      pName: "",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }
  componentDidMount() {
    if (this.props.myMovie != "") {
      this.populateMovieData();
    }
  }

  componentDidUpdate() {
    params = { title: this.props.myMovie };
    if (this.props.myMovie != "" && this.props.myMovie != movieTitle) {
      movieTitle = this.props.myMovie;
      moviePopulatedData.length = 0;
      this.populateMovieData();
      document.getElementById("movieRelationData").hidden = false;
    }
  }

  populateMovieData() {
    session
      .run(query, params)
      .then((result) => {
        result.records.forEach((record) => {
          moviePopulatedData.push(record);
          console.log(record.get("p.name"));
          console.log(record.get("type(relatedTo)"));
        });
        this.forceUpdate();
        isMatched = true;
      })
      .finally()
      .catch((error) => {
        console.error(error);
      });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    // const name = target.name;
    console.log(event.target.value);
    this.setState({
      relationship: value,
    });
  }

  fetchPersonName = (e) => {
    const value = e;
    // const name = target.name;
    this.setState({
      pName: value,
    });
    document.getElementById("movieRelationData").hidden = true;
  };

  render() {
    let filterele;
    let tableTitle;
    if (isMatched) {
      filterele = (
        <div>
          Filter By
          <label>
            Look For RelationShip:
            <input
              name="relationship"
              type="text"
              value={this.state.relationship}
              onChange={this.handleInputChange}
            />
          </label>
        </div>
      );
      tableTitle = (
        <tr>
          <th>PName</th>
          <th>type(relatedTo)</th>
        </tr>
      );
    }
    return (
      <div>
        <div>{filterele}</div>
        <div>
          <table id="movieRelationData">
            <tbody>
              {tableTitle}
              {moviePopulatedData.filter((e)=>e.get("type(relatedTo)").includes(this.state.relationship)).map((movieData) => (
                <tr onClick={() => this.fetchPersonName(movieData.get("p.name"))}>
                  <td>{movieData.get("p.name")}</td>
                  <td>{movieData.get("type(relatedTo)")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {this.props.myMovie}
        <MoviePersonDetails personName={this.state.pName} />
      </div>
    );
  }
}

export default MovieRelation;
