import { Component } from "react";
import { Button } from "react-bootstrap";

const neo4j = require("neo4j-driver");
const driver = neo4j.driver(
  "bolt://54.211.132.106:7687",
  neo4j.auth.basic("neo4j", "console-august-buckle"),
  {
    /* encrypted: 'ENCRYPTION_OFF' */
  }
);

let params = { personName: "" };

const session = driver.session({ database: "neo4j" });
let personDetailedData = [];
let query = "";
let personName = "";
let isContentPopulated = false;

class MoviePersonDetails extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.personName);
    query =
      "MATCH (p:Person{name:$personName})-[relatedTo]-(m:Movie) return p.name,type(relatedTo),m.title,m.released as released";
    params = { personName: this.props.personName };

    this.handleInputChange = this.handleInputChange.bind(this);
  }
  componentDidMount() {
    if (this.props.personName != "") {
      this.populateMovieData();
    }
  }

  componentDidUpdate() {
    params = { personName: this.props.personName };
    if (this.props.personName != "" && this.props.personName != personName) {
      personName = this.props.personName;
      personDetailedData.length = 0;
      this.populateMovieData();
    }
  }

  populateMovieData() {
    session
      .run(query, params)
      .then((result) => {
        result.records.forEach((record) => {
          personDetailedData.push(record);
        });
        console.log(personDetailedData);
        this.forceUpdate();
        isContentPopulated = true;
      })
      .finally()
      .catch((error) => {
        console.error(error);
      });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    console.log(event.target.value);
    this.setState({
      [name]: value,
    });
  }

  showDiv() {
    document.getElementById("movieRelationData").hidden = false;
  }

  render() {
    let filterele;
    let tableTitle;
    if (isContentPopulated) {
      tableTitle = (
        <tr>
          <th>PName</th>
          <th>type(relatedTo)</th>
          <th>Movie Name</th>
          <th>Movie Released Date</th>
        </tr>
      );
    }
    return (
      <div>
        <div>
          <Button onClick={this.showDiv}>Show relationship Table</Button>
        </div>
        <div>{filterele}</div>
        <div>
          <table>
            <tbody>
              {tableTitle}

              {personDetailedData.map((personData) => (
                <tr>
                  <td>{personData.get("p.name")}</td>
                  <td>{personData.get("type(relatedTo)")}</td>
                  <td>{personData.get("m.title")}</td>
                  <td>{personData.get("released").low}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default MoviePersonDetails;
