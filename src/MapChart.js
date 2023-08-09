import React, { useEffect, useState } from "react";
import { csv } from "d3-fetch";
import { scaleLinear } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule
} from "react-simple-maps";

const geoUrl = "/features.json";

// const colorScale = scaleLinear()
//   .domain([3, 8])
//   .range(["#ffedea", "#ff5233"]);


const MapChart = () => {
  const [data, setData] = useState([]);
  const [yearup, setYear] = useState('2023');
  const [selectedOption, setSelectedOption] = useState("Life Ladder");

  const colorScale = scaleLinear()
  .domain([3, 8])
  .range(["#ffedea", "#ff5233"]);

  useEffect(() => {
    csv(`/WHR_stand.csv`).then((data) => {
      setData(data);
    });
  }, []);

  return (
    <><ComposableMap
      projectionConfig={{
        rotate: [-10, 0, 0],
        scale: 147
      }}
      >
      <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
      <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
      {data.length > 0 && (
        <><Geographies geography={geoUrl}>
          {({ geographies }) => geographies.map((geo) => {
            const d = data.find((s) => s.ISO3 === geo.id && s.year === yearup);
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={d ? colorScale(d[selectedOption]) : "#F5F4F6"}
                style={{
                  default: {
                    outline: "none"
                  },
                  hover: {
                    outline: "none",
                    stroke: "red",
                    strokeWidth: 1
                  },
                  pressed: {
                    outline: "none",
                    stroke: "red",
                    strokeWidth: 1
                  },
                }}
              />
            );
          })}
        </Geographies></>
      )}
    </ComposableMap><div>
        <label id="yearup">Year: {yearup}</label>
        <input
          type="range"
          min="2008"
          max="2023"
          value={yearup}
          onChange={e => setYear(e.target.value)} />
      </div>
      <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
        <option value="Life Ladder">Life Ladder</option>
        <option value="Log GDP per capita">Log GDP per capita</option>
      </select>
      </>
  );
};

export default MapChart;