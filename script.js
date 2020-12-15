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
            "rgb(115, 230, 186)",
            "rgb(231, 223, 111)",
            "rgb(230, 180, 115)",
            "rgb(231, 94, 94)",
        ];

        const colorScale = d3
            .scaleLinear()
            .domain([0, 5])
            .range([
                d3.min(userEdu, (d) => d.bachelorsOrHigher),
                d3.max(userEdu, (d) => d.bachelorsOrHigher),
            ]);

        // legend

        console.log(
            "minimum",
            d3.max(userEdu, (d) => d.bachelorsOrHigher)
        );
        const x = d3
            .scaleLinear()
            .domain([
                d3.min(userEdu, (d) => d.bachelorsOrHigher),
                d3.max(userEdu, (d) => d.bachelorsOrHigher),
            ])
            .range([0, 100]);

        const legend = base
            .append("g")
            .attr("id", "legend")
            .attr("width", 300)
            .attr("height", 80);

        const legendSquareW = 40;
        legend
            .selectAll("rect")
            .data(colors)
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * legendSquareW + legendSquareW / 2)
            .attr("fill", (d) => d)
            .attr("width", legendSquareW)
            .attr("height", 30);

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
                if (result[0].bachelorsOrHigher < 20) {
                    return colors[0];
                } else if (result[0].bachelorsOrHigher < 40) {
                    return colors[1];
                } else if (result[0].bachelorsOrHigher < 60) {
                    return colors[2];
                } else if (result[0].bachelorsOrHigher < 80) {
                    return colors[3];
                }
            })
            .attr("stroke", "beige");
    }
})();
