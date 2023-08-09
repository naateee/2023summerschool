//App组件

//导入所需库、样式文件和已创建的组件
import React, { useState, useEffect } from 'react';
import './DotChartApp.css';
import * as d3 from 'd3';
import ScatterPlot from './ScatterPlot';

function DotChartApp() {

  //使用useState创建变量
  const [data, setData] = useState([]);//数据
  const [selectedPoints, setSelectedPoints] = useState({});//选中的点
  const [xAxis, setXAxis] = useState('Log GDP per capita');//x轴数据类型
  const [yAxis, setYAxis] = useState('Life Ladder');//y轴数据类型
  const [Xmax, setXmax] = useState([]);
  const [Ymax, setYmax] = useState([]);
  const [axesOptions, setAxesOptions] = useState([]);//所有可选的数据类型
  const [year, setYear] = useState('2023');//年份
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10); //颜色比例尺

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

      //根据选择的年份过滤数据并使用map函数处理数据中的每一项
      const processedData = data.filter(item => item['year'] === year && item[xAxis] && item[yAxis]).map(item => ({
        country: item['Country name'],
        region: item['Regional indicator'],
        x: item[xAxis],
        y: item[yAxis],
        isSelected: selectedPoints[item['Country name']]
      }));

      //设置data状态为处理后的数据
      setData(processedData);
    });
  }, [xAxis, yAxis, year, selectedPoints]);

  // 更新点的选中状态
  const togglePoint = (country) => {
    setSelectedPoints(prevSelectedPoints => ({
      ...prevSelectedPoints,
      [country]: !prevSelectedPoints[country]
    }));
  };

  return (
    <div className="App"> 
      <header className="App-header"> 
        <h1>
          ScatterPlot
        </h1>
        <div className="App">
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
          <ScatterPlot data={data} colorScale={colorScale} xAxis={xAxis} yAxis={yAxis} togglePoint={togglePoint} Xmax={Xmax} Ymax={Ymax}/>
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
          <br />
        </div>
      </header>
    </div>
  );
}

//导出App组件
export default DotChartApp;