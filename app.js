console.log("Welcome to the belly button page.")

function main() {
    let dropdown = d3.select("#selDataset")

    d3.json("samples.json").then((data) => {
        console.log(data);

        let names = data.names

        for (let i = 0; i < names.length; i++) {
            dropdown.append("option").text(names[i]).property("value", names[i])
        }
        let firstSample = names[0]
        graphs(firstSample)
        table(firstSample)
    })
}

function optionChanged(sample) {
    graphs(sample)
    table(sample)
}
main()

function table(sample) {
    d3.json("samples.json").then((data) => {
        let metadata = data.metadata
        let metadataArray = metadata.filter(sampleobj => sampleobj.id == sample)
        let metadataResult = metadataArray[0]

        let demoTable = d3.select("#sample-metadata")
        demoTable.html("")
        for (index in metadataResult) {
            demoTable.append("h5").text(`${index.toUpperCase()}: ${metadataResult[index]}`)
        }
    })
}

function graphs(sample) {
    d3.json("samples.json").then((data) => {
        let metadata = data.metadata
        let metadataArray = metadata.filter(sampleobj => sampleobj.id == sample)
        let metadataResult = metadataArray[0]
        let wash = metadataResult.wfreq

        let samples = data.samples
        let sampleArray = samples.filter(sampleobj => sampleobj.id == sample)
        let sampleResult = sampleArray[0]
        let otuids = sampleResult.otu_ids
        let otulabels = sampleResult.otu_labels
        let sample_values = sampleResult.sample_values

        let yticks = otuids.slice(0, 10).reverse().map(otuobj => `OTU ${otuobj}`)

        // bar chart
        let bardata = [{
            type: 'bar',
            x: sample_values.slice(0, 10).reverse(),
            y: yticks,
            orientation: 'h'
        }];

        let barlayout = {
            title: 'Colored Bar Chart',
        };

        Plotly.newPlot('bar', bardata, barlayout);


        // bubble

        var trace1 = {
            x: otuids,
            y: sample_values,
            mode: 'markers',
            marker: {
              size: sample_values,
              color: otuids,
              colorscale: "Earth"
            }
          };
          
          var data = [trace1];
          
          var layout = {
            title: 'Marker Size',
            showlegend: false,
            height: 600,
            width: 800
          };
          
          Plotly.newPlot('bubble', data, layout);
          


        // gauge
        var data = [
            {
                type: "indicator",
                mode: "gauge+number+delta",
                value: wash,
                title: { text: "Belly Button Washing Frequency </b> <br></br> Scrubs Per Week", font: { size: 20 } },
                delta: { reference: 400, increasing: { color: "RebeccaPurple" } },
                gauge: {
                    axis: { range: [null, 9], tickwidth: 1, tickcolor: "navy" },
                    bar: { color: "teal"},
                    bgcolor: "white",
                    borderwidth: 4,
                    bordercolor: "lightgray",
                    steps: [
                        { range: [0, 2], color: "(rgb(247, 252, 245)", text: "0-2"},
                        { range: [1, 2], color: "(rgb(229, 245, 224)", text: "1-2"},
                        { range: [2, 3], color: "rgb(199, 233, 192)", text: "2-3"},
                        { range: [3, 4], color: "rgb(161, 217, 155)", text: "3-4"},
                        { range: [4, 5], color: "rgb(116, 196, 118)", text: "4-5"},
                        { range: [5, 6], color: "rgb(65, 171, 93)", text: "5-6"},
                        { range: [6, 7], color: "rgb(35, 139, 69)", text: "6-7"},
                        { range: [7, 8], color: "rgb(0, 109, 44)", text: "7-8"},
                        { range: [8, 9], color: "rgb(0, 68, 27)", text: "8-9"},
                    ],
                }
            }
        ];

        var layout = {
            width: 500,
            height: 400,
            margin: { t: 50, r: 25, l: 25, b: 20 },
            paper_bgcolor: "white",
            font: { color: "darkblue", family: "Arial" }
        };

        Plotly.newPlot('gauge', data, layout);

    })
}

init();