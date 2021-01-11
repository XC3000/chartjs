/* eslint-disable react/no-direct-mutation-state */
import React, { Component } from "react";
import Finance from "financejs";
import Chart from "chart.js";

class Charts extends Component {
  state = {
    inputs: this.props.inputs,
    data: [
      {
        month: 1,
        investedAmount: 10000,
        accumulatedAmount: 10057,
      },
    ],
    dataPoints: 1,
    totalInv: 0,
    totalAcc: 0,
    chart: null,
  };

  generateData = (callback) => {
    const dateString = new Date().toISOString();
    let [year, month] = dateString.split("-");
    year = parseInt(year);
    month = parseInt(month) % 12;
    if (month === 0) year++;

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    let { time, cagr, sip } = Object.assign({}, this.state.inputs);
    time = time === 0 ? 1 : time;
    const finance = new Finance();

    const returnPercent = (Math.pow(1 + cagr / 100, 1 / 12) - 1) * 100;
    let accumulatedAmount = 0,
      investedAmount = 0;
    const dataArray = [];
    for (let i = 1; i <= time * 12; i++) {
      investedAmount = sip * i;
      accumulatedAmount = finance.FV(returnPercent, sip + accumulatedAmount, 1);

      let monthStr = months[month % 12];
      let displayString = `${monthStr} '${year.toString().substring(2)}`;

      dataArray.push({
        month: i,
        accumulatedAmount: Math.round(accumulatedAmount),
        investedAmount,
        monthDisplay: displayString,
      });

      if (Math.abs(month + 1) % 12 === 0) year++;
      month++;
    }

    this.setState(
      {
        data: dataArray,
        totalInv: investedAmount,
        totalAcc: Math.round(accumulatedAmount),
        dataPoints: time * 12,
      },
      () => {
        if (callback) callback();
      }
    );
  };

  renderChart = () => {
    const { data } = Object.assign({}, this.state);

    const ctx = document.getElementById("target").getContext("2d");
    this.setState({
      chart: new Chart(ctx, {
        type: "line",
        data: {
          labels: data.map(({ month }) => month),
          datasets: [
            {
              label: "Invested Amount",
              backgroundColor: "#021030",
              borderColor: "#021030",
              data: data.map(({ investedAmount }) => investedAmount / 1000),
              showLine: false,
            },
            {
              label: "Accumulated Amount",
              backgroundColor: "#00e2b2",
              borderColor: "#00e2b2",
              data: data.map(({ accumulatedAmount }) =>
                Math.round(accumulatedAmount / 1000)
              ),
            },
          ],
        },
        options: {
          fill: false,
          title: {
            display: true,
            text: "SIP Calculator",
          },
          legend: {
            display: false,
          },
          scales: {
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "Amount (thousand)",
                },
                gridLines: {
                  display: true,
                },
                ticks: {
                  callback: function (value, index, values) {
                    return "$" + value;
                  },
                },
              },
            ],
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "Months",
                },
                ticks: {
                  padding: "5",
                },
                gridLines: {
                  display: false,
                },
              },
            ],
          },
          elements: {
            point: {
              radius: 0,
              hoverRadius: 5,
              hoverBorderWidth: 3,
              borderColor: "blue",
            },
          },
          tooltips: {
            callbacks: {
              title: (toolTipItem) => `Month: ${toolTipItem[0]["label"]}`,
            },
          },
          aspectRatio: 1,
        },
      }),
    });
  };

  updateChart = () => {
    const { data } = this.state;
    const curr = this.state.inputs.curr;

    this.state.chart.data = {
      labels: data.map(({ monthDisplay }) => monthDisplay),
      datasets: [
        {
          label: "Invested Amount",
          backgroundColor: "#021030",
          borderColor: "#021030",
          data: data.map(({ investedAmount }) => {
            let { curr } = this.state.inputs,
              text,
              val;
            if (curr === "$") {
              text = "Th.";
              val = (investedAmount / 1000).toFixed(2);
            } else {
              text = "Lac.";
              val = (investedAmount / 100000).toFixed(2);
            }
            return val;
          }),
        },
        {
          label: "Accumulated Amount",
          backgroundColor: "#00e2b2",
          borderColor: "#00e2b2",
          data: data.map(({ accumulatedAmount }) => {
            let { curr } = this.state.inputs,
              text,
              val;
            if (curr === "$") {
              text = "Th.";
              val = (accumulatedAmount / 1000).toFixed(2);
            } else {
              text = "Lac.";
              val = (accumulatedAmount / 100000).toFixed(2);
            }
            return val;
          }),
        },
      ],
    };

    this.state.chart.options = {
      fill: false,
      title: {
        display: true,
        text: "SIP Calculator",
      },
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: `Amount (${curr})`,
            },
            gridLines: {
              display: true,
            },
            ticks: {
              callback: function (value, index, values) {
                return `${value} ${curr === "$" ? "K" : "Lac."}`;
              },
            },
          },
        ],
        xAxes: [
          {
            scaleLabel: {
              display: false,
              labelString: "Time",
            },
            ticks: {
              padding: 5,
              lineHeight: 2.8,
            },
            gridLines: {
              display: false,
            },
          },
        ],
      },
      elements: {
        point: {
          radius: 0,
          hoverRadius: 5,
          hoverBorderWidth: 3,
          borderColor: "blue",
        },
      },
      tooltips: {
        callbacks: {
          title: (toolTipItem) => `Month: ${toolTipItem[0]["label"]}`,
          label: function (tooltipItem, data) {
            const label = data.datasets[tooltipItem.datasetIndex].label || "";
            return `${label}: ${tooltipItem.yLabel} ${
              curr === "$" ? "K" : "Lac."
            }`;
          },
        },
        mode: "index",
        intersect: false,
      },
      hover: {
        mode: "nearest",
        intersect: true,
      },
    };
    this.state.chart.update({
      duration: 750,
      easing: "easeInOutSine",
    });
  };

  static getDerivedStateFromProps(props, state) {
    if (props.inputs !== state.inputs) {
      return {
        inputs: props.inputs,
      };
    } else return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.inputs !== prevState.inputs) {
      this.generateData(this.updateChart);
    }
  }

  componentDidMount = () => {
    this.generateData(this.renderChart);
  };

  render() {
    return (
      <div className="charts-container">
        <canvas id="target"></canvas>
      </div>
    );
  }
}

export default Charts;
