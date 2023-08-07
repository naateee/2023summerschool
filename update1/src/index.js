// import React from "react";
// import ReactDOM from "react-dom";
// import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// import "./styles.css";

// const App = () => (
//   <div>
//     <ComposableMap>
//       <Geographies geography="/features.json">
//         {({ geographies }) =>
//           geographies.map((geo) => (
//             <Geography key={geo.rsmKey} geography={geo} />
//           ))
//         }
//       </Geographies>
//     </ComposableMap>
//   </div>
// );

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);

import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

import MapChart from "./MapChart";

function App() {
  return (
    <div>
      <MapChart />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
