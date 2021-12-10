
var sorted = true;

const margin = ({top: 20, right: 20, bottom: 60, left: 50})

const width = 850 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

const svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const xScale = d3
    .scaleBand()
    .range([0, 800])
    .round(true)
    .paddingInner(0.1)

const yScale = d3
    .scaleLinear()
    .range([height,0])


const xAxis = d3.axisBottom()
	.scale(xScale)
	.ticks(10, "s")

const yAxis = d3.axisLeft()
	.scale(yScale)
	.ticks(10, "s")

svg.append("g")
.attr("class", "axis x-axis")

svg.append("g")
.attr("class", "axis y-axis")

svg.append("text")
.attr("class", "y label")

let type = d3.select('.group-by').node().value

let sort = d3.select('.sort-by').node().value

console.log

function update(data, type){

	// Update scale domains
	xScale.domain(data.map(d=>d.company))

	yScale.domain([0,d3.max(data.map(d=>d[type]))])

	const bars = svg.selectAll('.bar')
    .data(data);

    bars.enter()
    .append('rect')
    .attr('x', d=>xScale(d.company))
    .attr("y", (d)=> yScale(d[type]))
    .merge(bars)
    .transition()
    .duration(1000)
    .delay(500)
    .attr('x', d=>xScale(d.company))
    .attr('y', d => yScale(d[type]))
    .attr('width', xScale.bandwidth())
    .attr('height', d => height - yScale(d[type]))
    .attr('stroke', 'black')
    .attr('fill', '#69a3b2')
    .attr("class","bar");

    bars.exit()
    .transition()
    .duration(1000)
    .remove();

    svg.select(".x-axis")
    .transition()
    .duration(1000)
    .call(xAxis)
    .attr("transform", `translate(0, ${height})`);

    svg.select(".y-axis")
    .transition()
    .duration(1000)
    .call(yAxis)
    .attr("transform", `translate(0, 0)`)

    svg.select(".y")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -50)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text(type);

    svg
      .selectAll(".axis")
      .attr("aria-hidden", true);

    svg
      .selectAll(".bar")
      .attr("role", "graphics-symbol")
      .attr("aria-roledescription", "bar element")
      .attr("tabindex", 0)
      .attr("aria-label", d => {
        return type == "stores"
          ? `${d.company} has ${d.stores} stores nation wide'`
          : `${d.company} makes ${d.revenue} billion dollars per year'`;
      });

    svg
      .select(".chart")
      .select("svg")
      .attr("role", "graphics-document")
      .attr("aria-roledescription", "bar chart");
        svg.attr("tabindex", 0);
        svg.attr("aria-label",
        type == "stores"
        ? "A Bar chart which shows the number of coffee shop locations in a company within the United States. Starbucks has the most by a significant margin with over 20 thousand stores. The runner ups to Starbucks are both Dunkin Brands and Tim Hortons respectively."
        : "A Bar chart which shows the annual revenue of company in billions of dollars. Starbucks makes the most by a significant margin. Despite Paneras small number of stores comparatively in has a high revenue. Wheras Dunkin Brands have a large number of stores but a small revenue. "
    );

}

// ----Load Dataset----

d3.csv('coffee-house-chains.csv', d3.autoType).then(data=>{
    console.log('coffee', data)

    update(data, type)

    document.querySelector("#group-by").addEventListener('change', (x)=> {
        type= x.target.value;
        update(data, type);
        sorted = true;

    })

    document.querySelector('.sort-by').onclick= (function() {
        console.log('1', sorted)

        if (sorted == true) {
            update(data.sort((a,b) => b[type] - a[type]), type);
            sorted = false; 
            console.log('2', sorted);
        }
        else {
            update(data.sort((a,b) => a[type] - b[type]), type);
            sorted = true;
            console.log('3',sorted);
        }  
        console.log("4", sorted)
    })

})
