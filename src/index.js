import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import "./index.css";

import DotChartApp from './DotChartApp';
import MapChart from "./MapChart";
import './OverallStyle.css';

function App() {
  const [year, setYear] = useState('2023');
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
          <MapChart year={year}/>
        </div>
      </div>
      <div id="rightpart" className="App">
          <DotChartApp year={year}/>
        </div>
      <div>
      <label >Year: {year}</label>
        <input
          type="range"
          min="2008"
          max="2023"
          value={year}
          onChange={e => setYear(e.target.value)} />
      </div>
      </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
