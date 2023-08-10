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


var x,y;
function MapChart({year}) {
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("LifeLadder");
  const [Country,setcountry] = useState();
  const [countryla,setcountryla] = useState();
  const [lad,setlad] = useState();
  const colorScale = scaleLinear()
    .domain([3, 8])
    .range(["#ffedea", "#ff5233"]);

  useEffect(() => {
    csv(`/WHR_stand.csv`).then((data) => {
      setData(data);
    });
  }, []);

  const change = () => {
    setcountry(Country => x);
    setlad(lad => y);
  };

  return (
    <><ComposableMap
      projectionConfig={{
        rotate: [-10, 0, 0],
        scale: 170
      }}
    >
      <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
      <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
      {data.length > 0 && (
        <><Geographies geography={geoUrl}>
          {({ geographies }) => geographies.map((geo) => {
            const d = data.find((s) => s.ISO3 === geo.id && s.year === year);
            function handleClick() {
              // alert(geo.properties.name)
              x = geo.properties.name;
              y = d.LifeLadder ;
              change();
              // alert(x);
            }
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
                onClick={() => handleClick(geo)} 
                />
            );
          })}
        </Geographies></>
      )}
    </ComposableMap><div>
        <label>Country:{Country} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Life Ladder:{lad}</label>
      </div>
      <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
        <option value="LifeLadder">Life Ladder</option>
        <option value="Log GDP per capita">Log GDP per capita</option>
      </select>
    </>
  );
}

export default MapChart;