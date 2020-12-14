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
        base.selectAll("path")
            .data(counties)
            .enter()
            .append("path")
            .attr("d", d3.geoPath())
            .attr("class", "county")
            .attr("fill", "red");
    }
})();
