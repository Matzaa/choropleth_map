(function () {
    Promise.all([
        fetch(
            "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
        ),
        fetch(
            "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
        ),
    ])
        .then()
        .catch((err) => {
            console.log("error in fetch: ", err);
        });
})();
