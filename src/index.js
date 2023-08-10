import React from "react";
import ReactDOM from "react-dom";

import "./index.css";

import DotChartApp from './DotChartApp';
import MapChart from "./MapChart";
import './OverallStyle.css';

function App() {
  return (
    <div className="flexbox">
      <div id="leftpart">
        <div id="leftupp" className="App">
        <h1>
          <b>
            World Happiness Report Visualization
          </b>
        </h1>
        </div>
        <div className="App">
          <MapChart />
        </div>
      </div>
      <div id="rightpart" className="App">
          <DotChartApp />
        </div>
      </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
