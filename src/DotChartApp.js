//App组件

//导入所需库、样式文件和已创建的组件
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './DotChartApp.css';
import * as d3 from 'd3';
import ScatterPlot from './ScatterPlot';
import LineChart from './LineChart';

function DotChartApp() {

  //使用useState创建变量
  const [data, setData] = useState([]);//数据
  const [selectedPoints, setSelectedPoints] = useState({});//选中的点
  const [xAxis, setXAxis] = useState('Log GDP per capita');//x轴数据类型
  const [yAxis, setYAxis] = useState('Life Ladder');//y轴数据类型
  const [Xmax, setXmax] = useState([]);
  const [Ymax, setYmax] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);//国家筛选器
  const [allCountries, setAllCountries] = useState([]);
  const [axesOptions, setAxesOptions] = useState([]);//所有可选的数据类型
  const [year, setYear] = useState('2023');//年份
  const [selectedCountriesName, setSelectedCountriesName] = useState([]) // 所有被选中待显示的国家名称
  const [lineCountry, setLineCountry] = useState(null);
  const countryOptions = allCountries.map(country => ({ value: country, label: country }));
  const regionColors = {
        "South Asia": "#1f77b4",
        "Central and Eastern Europe": "#ff7f0e",
        "Middle East and North Africa": "#2ca02c",
        "Latin America and Caribbean": "#d62728",
        "Sub-Saharan Africa": "#9467bd",
        "Commonwealth of Independent States": "#8c564b",
        "Eastern Europe and Central Asia": "#e377c2",
        "North America and ANZ": "#7f7f7f",
        "Western Europe": "#bcbd22",
        "Southeast Asia": "#17becf",
        "East Asia": "#ffa500",
        "": "#ffe4e1"
   };

  //在year、xAxis和yAxis更改时（选中的坐标轴数据类型变化时）重新运行
  useEffect(() => {

    //读取CSV文件，处理返回的数据
    d3.csv('WHR_NEW.csv').then(data => {
      // 获取CSV文件的所有列，过滤掉'Country name'和'Regional indicator'，设置axesOptions状态
      const columns = data.columns;
      setAxesOptions(columns.filter(column => column !== 'Country name' && column !== 'Regional indicator' && column !== 'year'));

      //获取最大值以确定坐标轴范围
      setXmax(d3.max(data, d => d[xAxis]));
      setYmax(d3.max(data, d => d[yAxis]));

      // 提取所有国家的列表并设置到 allCountries 状态中
      const allCountriesList = Array.from(new Set(data.map(item => item['Country name'])));
      setAllCountries(allCountriesList);

      //根据选择的年份和国家过滤数据并使用map函数处理数据中的每一项
      const processedData = data.filter(item => item['year'] === year && item[xAxis] && item[yAxis] && (selectedCountries.length === 0 || selectedCountries.includes(item['Country name']))).map(item => ({
        country: item['Country name'],
        region: item['Regional indicator'],
        x: item[xAxis],
        y: item[yAxis],
        isSelected: selectedPoints[item['Country name']]
      }));

      //设置data状态为处理后的数据
      setData(processedData);

      // 更新折线图数据
      setSelectedCountriesName(processedData.filter(item => item['isSelected'] === true).map(item => ({
        value: item['country'],
        label: item['country']
     })));
    });
  }, [xAxis, yAxis, year, selectedPoints, selectedCountries, lineCountry]);

  // 更新点的选中状态
  const togglePoint = (country) => {
    setSelectedPoints(prevSelectedPoints => ({
      ...prevSelectedPoints,
      [country]: !prevSelectedPoints[country]
    }));  
  };

  return (
    <div> 
      <header className="App-header"> 
        <h1>
          ScatterPlot
        </h1>
        
      </header>
      <div>
          <div>
            <label className="selector">Country: </label>
            <Select 
              isMulti
              value={selectedCountries.map(country => ({ value: country, label: country }))}
              onChange={selectedOptions => setSelectedCountries(selectedOptions.map(option => option.value))}
              options={countryOptions}
            />
          </div>
          <div>
            <label className="axisLable">X-Axis: </label> 
            <select value={xAxis} onChange={e => setXAxis(e.target.value)}>
              {axesOptions.map(option => (
                //为axesOptions状态中的每一项创建一个 option 元素
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
          <label className="axisLable">Y-Axis: </label> 
            <select value={yAxis} onChange={e => setYAxis(e.target.value)}>
              {axesOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div id="ScatterChartContainer">
            <ScatterPlot data={data} regionColors={regionColors} xAxis={xAxis} yAxis={yAxis} togglePoint={togglePoint} Xmax={Xmax} Ymax={Ymax} preserveAspectRatio="xMidYMid meet"/>
          </div>
          <div>
            <label id = "year">Year: {year}</label>
            <input
              type="range"
              min="2008"
              max="2023"
              value={year}
              onChange={e => setYear(e.target.value)}
            />
          </div>
          <div>
            <label className="selector">select a country: </label>
            <Select 
              value={lineCountry ? {value: lineCountry, label: lineCountry} : null}
              onChange={selectedOption => setLineCountry(selectedOption.value)}
              options={selectedCountriesName}
            />
          </div>
          <div>
            <LineChart xAxis={'year'} yAxis={yAxis} country={lineCountry}/>
          </div>
        </div>
        
    </div>
  );
}

//导出App组件
export default DotChartApp;