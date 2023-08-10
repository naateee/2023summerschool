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
            console.log("country: %s", country);
            if (country == null) {
                console.log("no element");
                return;
            }

            // 过滤缺失值
            const filteredData = data.filter(d => d[xAxis] !== null && d[yAxis] !== null && d['Country name'] === country);

            // 定义尺度
            const xScale = d3.scaleLinear()
                .domain(d3.extent(filteredData, d => +d[xAxis]))
                .range([50, 350]); // 留出空间用于坐标轴的标签
            
            console.log(filteredData)
            console.log("%d" , d3.extent(filteredData, d => d[xAxis])[0])
            
            console.log("[%d, %d]", 0, d3.max(filteredData, d => +d[yAxis]));
            const yScale = d3.scaleLinear()
                .domain([0, d3.max(filteredData, d => +d[yAxis])])
                .range([350, 50]); // 留出空间用于坐标轴的标签

            // 定义线生成器
            const line = d3.line()
                .x(d => xScale(+d[xAxis]))
                .y(d => yScale(+d[yAxis]));

            // 绘制线
            svg.append("path")
                .datum(filteredData)
                .attr("fill", "none")
                .attr("stroke", "#0000FF") // 将线条颜色设为亮蓝色
                .attr("stroke-width", 1.5)
                .attr("d", line);

            // 定义坐标轴
            const xAxisD3 = d3.axisBottom(xScale);
            const yAxisD3 = d3.axisLeft(yScale);

            // 绘制x轴
            svg.append("g")
                .attr("transform", "translate(0, 350)") // 定位坐标轴
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
                .attr("y", 6)
                .attr("dy", ".75em")
                //竖直显示
                .attr("transform", "rotate(-90)")
                .style("fill", "black")
                .text(yAxis);
        });
    }, [xAxis, yAxis, country]);

    return (
        <svg ref={svgRef} width="350" height="400"></svg>
    );
}

export default LineChart;
