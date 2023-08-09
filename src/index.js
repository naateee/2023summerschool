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
          <h3>
            这里是控制面板
          </h3>
        </div>
        <div className="App">
          <MapChart />
        </div>
      </div>
      <div id="rightpart">
        <div id="rightupp" className="App">
          <DotChartApp />
        </div>
        <div className="App">
          <h3>
            这里是折线图
          </h3>
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
