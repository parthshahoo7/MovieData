import logo from "./logo.svg";
import "./App.css";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Component, useContext } from "react";

import DateRangePicker from "react-daterange-picker";
import "react-daterange-picker/dist/css/react-calendar.css";

// const neo4j = require("neo4j-driver");
// const driver = neo4j.driver(
//   "bolt://54.211.132.106:7687",
//   neo4j.auth.basic("neo4j", "console-august-buckle"),
//   {
//     /* encrypted: 'ENCRYPTION_OFF' */
//   }
// );

// import { Neo4jContext } from "use-neo4j";
import { useReadCypher, userWriteCypher } from "use-neo4j";
const neo4j = require('neo4j-driver');
const driver = neo4j.driver('bolt://54.211.132.106:7687',
                  neo4j.auth.basic('neo4j', 'console-august-buckle'), 
                  {/* encrypted: 'ENCRYPTION_OFF' */});

const query = `
  MATCH (movie:Movie {title:$favorite})<-[:ACTED_IN]-(actor)-[:ACTED_IN]->(rec:Movie)
   RETURN distinct rec.title as title LIMIT 20
  `;

const params = { favorite: "The Matrix" };

const session = driver.session({ database: "neo4j" });

let movieData = [];

// function Data(){
//   const { loading, error, records } = useReadCypher(
//   "Match (m:Movie) RETURN m.title as movies"
// );
// }
// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.populateData();
//   }
//   populateData() {
//     session
//       .run(query, params)
//       .then((result) => {
//         result.records.forEach((record) => {
//           movieData.push(record.get("title"));
//           console.log(record.get("title"));
//         });
//         console.log(movieData)
//         session.close();
//         driver.close();
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   }
//   componentWillUpdate(){
//     this.populateData();
//   }
//   componentDidUpdate(){
//     this.render();
//   }
//   render(){
//     return (
//           <div className="App">
//             <Dropdown>
//               <Dropdown.Toggle variant="success" id="dropdown-basic">
//                 Movies
//               </Dropdown.Toggle>
//               <Dropdown.Menu>
//                 {records?.map((movie) => (
//                   <Dropdown.Item>{movie}</Dropdown.Item>
//                 ))}
//               </Dropdown.Menu>
//             </Dropdown>
//           </div>
//         );
//   }
// }

// const query = `
//   MATCH (movie:Movie {title:$favorite})<-[:ACTED_IN]-(actor)-[:ACTED_IN]->(rec:Movie)
//    RETURN distinct rec.title as title LIMIT 20
//   `;

// let state = {
//   dates: null,
// };

// let onSelect = (dates) => this.setState({ dates });

function App({movieData}) {
  const { loading, error, records } = useReadCypher(
    "Match (m:Movie) WHERE $startyear <= m.released <=$endyear RETURN m.title as movies",{startyear:movieData.startyear,endyear:movieData.endyear}
  );
  // console.log(movieData.startyear);
  if (loading) return <div> loading..</div>;
  if (error) return <div>error:{error.message}</div>;
  // records?.map((movie)=>(
  //   console.log(movie)
  // ))
  // return (
  //   <div>
  //     Hello
  //     {records?.map((row) => (
  //       <div>{row.get("movies")}</div>
  //     ))}
  //   </div>
  // );
  return (
    <div className="App">
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Movies
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {records?.map((movie) => (
            <Dropdown.Item>{movie}</Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <div>
            {movieData.startyear}
            {movieData.endyear}
        </div>
    </div>
  );
}

export default App;
