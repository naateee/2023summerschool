import React from "react";
import ReactDOM from "react-dom";

import "./index.css";

import DotChartApp from './DotChartApp';

import MapChart from "./MapChart";

function App() {
  return (
    <div>
      <div>
        <MapChart />
      </div>
      <div>
        <DotChartApp />
      </div>
      </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
