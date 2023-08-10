import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function LineChart({ xAxis, yAxis, country}) {
    const svgRef = useRef();

    useEffect(() => {
        d3.csv('WHR_NEW.csv').then(data => {
            // 获取svg元素
            const svg = d3.select(svgRef.current);

            // 清除历史记录
            svg.selectAll("*").remove();
            console.log("country:", country);
            if (country == null) {
                console.log("no element");
                return;
            }

            // 过滤缺失值
            const filteredData = data.filter(d => d[xAxis] !== null && d[yAxis] !== null && country.some(option => option.label === (d['Country name'])));

            // 定义尺度
            const xScale = d3.scaleLinear()
                .domain(d3.extent(filteredData, d => +d[xAxis]))
                .range([50, 350]); // 留出空间用于坐标轴的标签
            
            console.log(filteredData)
            console.log("%d" , d3.extent(filteredData, d => d[xAxis])[0])
            
            console.log("[%d, %d]", 0, d3.max(filteredData, d => +d[yAxis]));
            const yScale = d3.scaleLinear()
                .domain([0, d3.max(filteredData, d => +d[yAxis])])
                .range([250, 50]); // 留出空间用于坐标轴的标签
            
            //线标签
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

            // 定义线生成器
            const line = d3.line()
                .x(d => xScale(+d[xAxis]))
                .y(d => yScale(+d[yAxis]));
            
            // 绘制线
            const colors = d3.schemeCategory10;
            country.forEach((C,i)=>{
                var refilteredData
                svg.append("path")
                .datum(refilteredData=filteredData.filter(d => C.label === (d['Country name'])))
                .attr("fill", "none")
                .attr("stroke", colors[i]) // 将线条颜色设为随机颜色
                .attr("stroke-width", 3.5)
                .attr("d", line)
                //鼠标互动事件
                //鼠标停留显示具体信息
                .on("mouseover", function(event) {
                    d3.select(this).attr("stroke", "rgb(255, 240, 243)");
                    tooltip.html(`<strong>${C.label}</strong><br/>Region: ${refilteredData[0]['Regional indicator']}`);
                    tooltip.style("visibility", "visible");
                })
                //设置提示框的位置，跟随鼠标移动
                .on("mousemove", function(event) {
                    tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
                })
        
                //当鼠标离开点时，点的颜色变回初始颜色，并隐藏标签
                .on("mouseout", function() {
                    d3.select(this).attr("stroke", colors[i]);
                    tooltip.style("visibility", "hidden");
                });
            })
            

            // 定义坐标轴
            const xAxisD3 = d3.axisBottom(xScale);
            const yAxisD3 = d3.axisLeft(yScale);

            // 绘制x轴
            svg.append("g")
                .attr("transform", "translate(0, 250)") // 定位坐标轴
                .call(xAxisD3)
                .attr("color", "black"); // 将线条颜色设为黑色

            // 绘制y轴
            svg.append("g")
                .attr("transform", "translate(50, 0)") // 定位坐标轴
                .call(yAxisD3)
                .attr("color", "black"); // 将线条颜色设为黑色
            
            //y轴标签
            svg.append("g")
                .call(d3.axisLeft(yScale))
                .append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("y", 20)
                .attr("x", -50)
                .attr("dy", ".75em")
                //竖直显示
                .attr("transform", "rotate(-90)")
                .style("fill", "black")
                .text(yAxis);
        });
    }, [xAxis, yAxis, country]);

    return (
        <svg ref={svgRef} width="350" height="300"></svg>
    );
}

export default LineChart;
