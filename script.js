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
            console.log("data: ", data);
            counties = topojson.feature(data, data.objects.counties).features;
            console.log("counties ", counties);
            d3.json(userUrl).then((data, error) => {
                if (error) {
                    console.log("error: ", error);
                } else {
                    userEdu = data;
                    console.log("userEdu: ", userEdu);
                    makeChart();
                }
            });
        }
    });

    function makeChart() {
        let base = d3.select("#base");

        // colors

        const colors = [
            // "rgb(115, 230, 186)",
            // // "rgb(255, 123, 123)",
            // "rgb(231, 223, 111)",
            // "rgb(230, 180, 115)",
            // "rgb(231, 94, 94)",
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
        console.log(
            "minimum",
            d3.max(userEdu, (d) => d.bachelorsOrHigher)
        );
        console.log("colorscale: ", colorScale(0));

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

        base.selectAll("path")
            .data(counties)
            .enter()
            .append("path")
            .attr("d", d3.geoPath())
            .attr("class", "county")
            .attr("data-fips", (d) => d.id)
            .attr("data-education", (d) => {
                return userEdu.filter((el) => el.fips === d.id);
            })
            .attr("fill", function (d) {
                let result = userEdu.filter((el) => el.fips === d.id);
                // console.log("result: ", result);
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
            .attr("stroke", "beige");
    }
})();
