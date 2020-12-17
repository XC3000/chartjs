/* eslint-disable react/no-direct-mutation-state */
import React, { Component } from "react";
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
    chart: null,
  };

  generateData = (callback) => {
    const inputs = Object.assign({}, this.state.inputs);

    const returnPercent = (
      (Math.pow(1 + inputs.cagr / 100, 1 / 12) - 1) *
      100
    ).toFixed(2);
    let accumulatedAmount = 0;
    const dataArray = [];
    for (let i = 1; i <= inputs.time * 12; i++) {
      const investedAmount = inputs.sip * i;
      let returnAmount =
        (accumulatedAmount + investedAmount) * (returnPercent / 100);
      accumulatedAmount = investedAmount + returnAmount;
      dataArray.push({
        month: i,
        accumulatedAmount,
        investedAmount,
      });
    }

    this.setState({ data: dataArray, dataPoints: inputs.time * 12 }, () => {
      if (callback) callback();
    });
  };

  renderChart = () => {
    const { data } = Object.assign({}, this.state);

    const ctx = document.getElementById("target").getContext("2d");
    this.setState({
      chart: new Chart(ctx, {
        type: "line",
        data: {
          labels: data.map(({ month }) => month),
          // .filter((val, index) => index % 3 === 0),
          datasets: [
            {
              label: "Accumulated Amount",
              backgroundColor: "rgba(0,226,178, 0.4)",
              borderColor: "rgba(0,226,178, 0.4)",
              data: data.map(
                ({ accumulatedAmount }) => accumulatedAmount / 1000
              ),
              // .filter((val, index) => index % 3 === 0),
            },
            {
              label: "Invested Amount",
              backgroundColor: "rgb(3, 78, 0, 0.6)",
              borderColor: "rgb(3, 78, 0, 0.6)",
              data: data.map(({ investedAmount }) => investedAmount / 1000),
              // .filter((val, index) => index % 3 === 0),
            },
          ],
        },
        options: {
          fill: false,
          title: {
            display: true,
            text: "SIP Calculator",
          },
          scales: {
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "Amount (thousand)",
                },
                // ticks: {
                //     suggestedMax: (
                //         data[dataPoints - 1][
                //             "accumulatedAmount"
                //         ] / 1000
                //     ).toFixed(2),
                //     min: inputs.sip / 1000,
                // },
              },
            ],
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "Months",
                },
                ticks: {
                  min: 1,
                  stepSize: 3,
                },
              },
            ],
          },
          elements: {
            point: {
              radius: 2,
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
        },
      }),
    });
  };

  updateChart = () => {
    const { data } = this.state;
    this.state.chart.data = {
      labels: data.map(({ month }) => month),
      datasets: [
        {
          label: "Accumulated Amount",
          backgroundColor: "rgba(0,226,178, 0.4)",
          borderColor: "rgba(0,226,178, 0.4)",
          data: data.map(({ accumulatedAmount }) => accumulatedAmount / 1000),
        },
        {
          label: "Invested Amount",
          backgroundColor: "rgb(3, 78, 0, 0.6)",
          borderColor: "rgb(3, 78, 0, 0.6)",
          data: data.map(({ investedAmount }) => investedAmount / 1000),
        },
      ],
    };
    this.state.chart.options = {
      fill: false,
      title: {
        display: true,
        text: "SIP Calculator",
      },
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Amount (thousand)",
            },
            // ticks: {
            //     suggestedMax: (
            //         data[dataPoints - 1]["accumulatedAmount"] / 1000
            //     ).toFixed(2),
            //     min: inputs.sip / 1000,
            // },
          },
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Months",
            },
            ticks: {
              min: 1,
              stepSize: 3,
            },
          },
        ],
      },
      elements: {
        point: {
          radius: 2,
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
    };
    this.state.chart.update({
      duration: 750,
      easing: "easeInOutSine",
    });
  };

  static getDerivedStateFromProps(props, state) {
    console.log({ props, state });
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
    const { data, dataPoints, inputs } = this.state;

    return (
      <div className="charts-container">
        <canvas id="target"></canvas>
        <div className="data-overlay">
          <span>
            Total Investment: {inputs.curr}
            <span className="data-total">
              {data[dataPoints - 1]["investedAmount"].toFixed(2)}
            </span>
          </span>
          <span>
            Total Accumulation: {inputs.curr}
            <span className="data-total">
              {data[dataPoints - 1]["accumulatedAmount"].toFixed(2)}
            </span>
          </span>
        </div>
      </div>
    );
  }
}

export default Charts;
