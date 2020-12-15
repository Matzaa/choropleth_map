(function () {
    let userEdu;
    let counties;

    const countyUrl =
        "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
    const userUrl =
        "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

    d3.json(countyUrl).then((data, error) => {
        if (error) {
            console.log(log);
        } else {
            counties = topojson.feature(data, data.objects.counties).features;
            d3.json(userUrl).then((data, error) => {
                if (error) {
                    console.log("error: ", error);
                } else {
                    userEdu = data;
                    makeChart();
                }
            });
        }
    });

    function makeChart() {
        let base = d3.select("#base");

        // tooltip

        const tooltip = d3
            .select("body")
            .append("div")
            .attr("id", "tooltip")
            .style("width", 100)
            .style("height", 50)
            .style("z-index", "10")
            .style("visibility", "hidden")
            .text("");

        // colors

        const colors = [
            "#f8d1c9",
            "#d2a5a8",
            "#a58f9b",
            "#6a768b",
            "#50637c",
            "#334961",
        ];

        const colorScale = d3
            .scaleLinear()
            .domain([0, 5])
            .range([
                d3.min(userEdu, (d) => d.bachelorsOrHigher),
                d3.max(userEdu, (d) => d.bachelorsOrHigher),
            ]);

        // legend

        const legendSquareW = 40;

        const x = d3
            .scaleLinear()
            .domain([
                d3.min(userEdu, (d) => d.bachelorsOrHigher),
                d3.max(userEdu, (d) => d.bachelorsOrHigher),
            ])
            .range([0, legendSquareW * 6]);

        const legend = base
            .append("g")
            .attr("id", "legend")
            .attr("width", 300)
            .attr("height", 80)
            .attr("transform", "translate(830, 420)");

        legend
            .selectAll("rect")
            .data(colors)
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * legendSquareW)
            .attr("fill", (d) => d)
            .attr("width", legendSquareW)
            .attr("height", 30);

        const legendAxis = d3.axisBottom(x);

        legend
            .append("g")
            .attr("transform", "translate(0, 30)")
            .call(legendAxis);

        // map

        base.append("g")
            .selectAll("path")
            .data(counties)
            .enter()
            .append("path")
            .attr("d", d3.geoPath())
            .attr("class", "county")
            .attr("data-fips", (d) => d.id)
            .attr("data-education", (d) => {
                let res = userEdu.filter((el) => el.fips === d.id);
                return res[0].bachelorsOrHigher;
            })
            .attr("fill", function (d) {
                let result = userEdu.filter((el) => el.fips === d.id);
                if (result[0].bachelorsOrHigher <= colorScale(1)) {
                    return colors[0];
                } else if (result[0].bachelorsOrHigher <= colorScale(2)) {
                    return colors[1];
                } else if (result[0].bachelorsOrHigher <= colorScale(3)) {
                    return colors[2];
                } else if (result[0].bachelorsOrHigher <= colorScale(4)) {
                    return colors[3];
                } else if (result[0].bachelorsOrHigher <= colorScale(5)) {
                    return colors[3];
                }
            })
            .attr("stroke", "beige")
            .on("mouseover", (e, d) => {
                tooltip
                    .style("left", e.pageX - 100 + "px")
                    .style("top", e.pageY - 20 + "px")
                    .style("transform", "translateX(100px)")
                    .style("visibility", "visible")
                    .html(`<p>${d.id}</p>`)
                    .attr("data-education", () => {
                        let res = userEdu.filter((el) => el.fips === d.id);
                        return res[0].bachelorsOrHigher;
                    });
            })
            .on("mouseout", () => {
                tooltip.style("visibility", "hidden");
            });
    }
})();
