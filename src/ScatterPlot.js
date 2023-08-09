//创建散点图ScatterPlot组件

//引入react、useRef和useEffect钩子、d3库
import React, { useRef, useEffect } from 'react'; 
import * as d3 from 'd3'; 

// 定义React组件，接收data参数
const ScatterPlot = ({ data, regionColors, xAxis, yAxis, togglePoint, Xmax, Ymax}) => {

  //创建一个名为ref的引用，引用SVG元素
  const ref = useRef(); 

  //处理组件的加载与更新
  useEffect(() => {
    
    // 选择当前元素
    const svg = d3.select(ref.current); 
    //清空不需要的历史数据
    svg.selectAll("*").remove();
    //获取SVG的宽和高
    const width = +svg.attr("width");
    const height = +svg.attr("height");

    //利用线性比例尺创建坐标轴
    const xScale = d3.scaleLinear()
      .domain([0, (1.35 * Xmax)])//定义域为0到数据中x值的最大值的135%（使数据完全显示）
      .range([0, width]); // 值域为0到SVG的宽度
    // y轴的比例尺，定义域为0到数据中y值的最大值的120%，值域为SVG的高度到0
    const yScale = d3.scaleLinear().domain([0, 1.2 * Ymax]).range([height, 0]);

    //添加组元素g作为原点，并将其向右和向下移动30个单位使得坐标轴可以在svg中完整显示
    const g = svg.append("g").attr("transform", "translate(30, 0)");

    //散点标签
    const tooltip = d3.select("body").append("div")
      .style("position", "absolute")
      //初始时设置为隐藏
      .style("visibility", "hidden")
      .style("background", "#f9f9f9")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      //标签文字可以换行
      .style("white-space", "pre-wrap");

    //为每一个数据点添加一个圆形元素，位置由x和y的值决定，颜色由数据中的region值决定
    g.selectAll("circle")
      .data(data)//绑定数据
      .enter()//对于每一个数据元素，如果没有对应的圆形元素，就创建一个
      //创建圆形元素
      .append("circle")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", d => d.isSelected ? 10 : 5)
        .attr("fill", d => d.isSelected ? 'rgb(216, 255, 44)' : regionColors[d.region])
        .attr("fill-opacity", d => d.isSelected ? 1 : 0.7)
        
        //鼠标互动事件
        //当鼠标悬停在点上时，点的颜色变为亮黄色，并显示具体数值标签
        .on("mouseover", function(event, d) {
          d3.select(this).attr("fill", "lightgoldenrodyellow");
          tooltip.html(`<strong>${d.country}</strong><br/>Region: ${d.region}<br/>${xAxis}: ${d.x}<br/>${yAxis}: ${d.y}`);
          tooltip.style("visibility", "visible");
        })
        //设置提示框的位置，跟随鼠标移动
        .on("mousemove", function(event) {
          tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
        })

        //当鼠标离开点时，点的颜色变回初始颜色，并隐藏标签
        .on("mouseout", function(d) {
            d3.select(this).attr("fill", d => regionColors[d.region]);
          tooltip.style("visibility", "hidden");
        })
        //当点被点击时，调用togglePoint函数跟踪点
        .on('click', function(event, d) {
          togglePoint(d.country);
          tooltip.style("visibility", "hidden");
        });

    //x轴标签
    g.append("g")
      .attr("transform", `translate(0, ${height - 60})`)
      //创建x轴并把x轴添加到新的元素中
      .call(d3.axisBottom(xScale))
      //x轴的标签
      .append("text")
      .attr("class", "x label")
      //文本以最后一个字符对齐
      .attr("text-anchor", "end")
      .attr("x", 0.9 * width)
      .attr("y", -6)
      .style("fill", "black")
      .text(xAxis);

    //y轴标签
    g.append("g")
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("dy", ".75em")
      //竖直显示
      .attr("transform", "rotate(-90)")
      .style("fill", "black")
      .text(yAxis);
      
  }, [data, xAxis, yAxis]);
  //当data、xAxis、yAxis其中任何一个变化时，重新运行这个函数

  // 返回一个SVG元素，使用ref引用，以便在effect中选择
  return <svg ref={ref} width="300" height="300"></svg>;
};

// 导出 ScatterPlot 组件
export default ScatterPlot;