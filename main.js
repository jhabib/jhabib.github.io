/* global d3, crossfilter, timeSeriesChart, barChart */

var dateFmt = d3.timeParse("%Y-%m-%d");
var d = new Date();

var chartTimeline = timeSeriesChart()
  .width(1000)
  .height(300)
  .x(function (d) { return d.key;})
  .y(function (d) { return d.value;});

d3.csv("data/10k_fire_dates.csv",
  function (d) {
    // This function is applied to each row of the dataset
    d.Date = dateFmt(d['START_DATE']);
    // console.log(d['STAT_CAUSE_DESCR'])
    return d;
  },
  function (err, data) {
    if (err) throw err;

    var ndx = crossfilter(data);

    // We create dimensions for each attribute we want to filter by
    dimDate = ndx.dimension(function (d) { return d.Date; });
    dimCategory = ndx.dimension(function (d) {return d['STAT_CAUSE_DESCR']; });
    dimYear = ndx.dimension(function (d) { return d.Date.getFullYear(); });


    // We bin each dimension
    dateGroup = dimDate.group(d3.timeYear).reduceCount();
    categoryGroup = dimCategory.group().reduceCount();
    yearGroup = dimYear.group().reduceCount();


    chartTimeline.onBrushed(function (selected) {
      dimDate.filter(selected);
      console.log(selection);
      update();
    });

    function update() {
      d3.select("#timeline")
        .datum(dateGroup.all())
        .call(chartTimeline);
    }

    update();


  }
);
