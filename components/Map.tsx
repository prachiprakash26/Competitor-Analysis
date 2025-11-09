import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { MapPoint, Cluster } from '../types';

interface MapProps {
  clusters: Cluster[];
  unclusteredStores: MapPoint[];
  width: number;
  height: number;
  onClusterClick: (cluster: Cluster) => void;
}

const StoreMap: React.FC<MapProps> = ({ clusters, unclusteredStores, width, height, onClusterClick }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const allPoints = [
        ...clusters.map(c => ({ lat: c.center.lat, lon: c.center.lon })),
        ...unclusteredStores
    ];
    if (!svgRef.current || allPoints.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    const [lonMin, lonMax] = d3.extent(allPoints, d => d.lon) as [number, number];
    const [latMin, latMax] = d3.extent(allPoints, d => d.lat) as [number, number];

    const xScale = d3.scaleLinear()
      .domain([lonMin - 0.01, lonMax + 0.01])
      .range([0, chartWidth]);

    const yScale = d3.scaleLinear()
      .domain([latMin - 0.01, latMax + 0.01])
      .range([chartHeight, 0]);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "d3-tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("background", "#334155")
      .style("border", "1px solid #475569")
      .style("border-radius", "8px")
      .style("padding", "8px")
      .style("color", "#f8fafc")
      .style("font-size", "12px");

    const colorScale = (type: 'selected' | 'competitor' | 'other') => {
        if (type === 'selected') return '#2563eb';
        if (type === 'competitor') return '#f59e0b';
        return '#475569';
    };

    // Draw Clusters
    const clusterGroup = g.selectAll("g.cluster")
      .data(clusters, (d: any) => d.id)
      .enter()
      .append("g")
      .attr("class", "cluster")
      .style("cursor", "pointer")
      .on("click", (event, d) => onClusterClick(d))
      .on("mouseover", function(event, d) {
          tooltip.style("visibility", "visible").text(`${d.name} (${d.stores.length} stores)`);
          d3.select(this).select("circle").transition().duration(200).attr("r", 8 + Math.sqrt(d.stores.length) * 4);
      })
      .on("mousemove", (event) => {
          tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function(event, d) {
          tooltip.style("visibility", "hidden");
          d3.select(this).select("circle").transition().duration(200).attr("r", 6 + Math.sqrt(d.stores.length) * 4);
      });

    clusterGroup.append("circle")
        .attr("cx", d => xScale(d.center.lon))
        .attr("cy", d => yScale(d.center.lat))
        .attr("r", d => 6 + Math.sqrt(d.stores.length) * 4)
        .attr("fill", d => colorScale(d.type))
        .attr("stroke", "#0f172a")
        .attr("stroke-width", 2)
        .attr("opacity", 0.9);

    clusterGroup.append("text")
        .attr("x", d => xScale(d.center.lon))
        .attr("y", d => yScale(d.center.lat))
        .attr("dy", "0.35em")
        .text(d => d.stores.length)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .attr("fill", "#f8fafc")
        .style("pointer-events", "none");

    // Draw Unclustered Stores
    g.selectAll("circle.store")
      .data(unclusteredStores, (d: any) => d.storeNumber)
      .enter()
      .append("circle")
      .attr("class", "store")
      .attr("cx", d => xScale(d.lon))
      .attr("cy", d => yScale(d.lat))
      .attr("r", 5)
      .attr("fill", d => colorScale(d.type))
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", (event, d) => {
          tooltip.style("visibility", "visible").text(d.storeName);
          d3.select(event.currentTarget).transition().duration(200).attr('r', 8);
      })
      .on("mousemove", (event) => {
          tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", (event, d) => {
          tooltip.style("visibility", "hidden");
          d3.select(event.currentTarget).transition().duration(200).attr('r', 5);
      });
      
    // Cleanup tooltip on component unmount
    return () => {
        tooltip.remove();
    };

  }, [clusters, unclusteredStores, width, height, onClusterClick]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default StoreMap;