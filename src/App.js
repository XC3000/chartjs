/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Charts from "./Charts";
import Finance from "financejs";

var commaNumber = require("comma-number");

function App() {
  const [investmentamount, setInvestmentamount] = useState(15000);
  const [totalvalue, setTotalvalue] = useState(15000);

  const [currencyicon, setCurrencyicon] = useState("₹");
  /* const [selectValue, setSelectValue] = useState(""); */
  const [principal, setPrincipal] = useState(`${currencyicon}15000`);
  const [newprincipal, setNewprincipal] = useState(15000);
  const [years, setYears] = useState(10);
  /* const [principal, setPrincipal] = useState(15000);
  const [years, setYears] = useState(10); */
  const [risk, setRisk] = useState("low");
  const [inputs, setInputs] = useState({
    sip: 15000,
    cagr: 7,
    time: 10,
    curr: "₹",
  });

  // window.addEventListener("resize", changeDivSize);

  // function changeDivSize() {
  //   alert(1);
  //   window.location.reload();
  // }

  function calculate(sip, cagr, time) {
    console.log(sip, cagr, time);

    time = time === 0 ? 1 : time;
    const finance = new Finance();

    const returnPercent = (Math.pow(1 + cagr / 100, 1 / 12) - 1) * 100;
    let accumulatedAmount = 0,
      investedAmount = 0;
    for (let i = 1; i <= time * 12; i++) {
      investedAmount = sip * i;
      accumulatedAmount = finance.FV(returnPercent, sip + accumulatedAmount, 1);
    }

    console.log(investedAmount, accumulatedAmount);
    console.log(commaNumber(2580283.23));

    investedAmount = commaNumber(investedAmount);
    accumulatedAmount = commaNumber(Math.ceil(accumulatedAmount));

    setInvestmentamount(investedAmount);
    setTotalvalue(accumulatedAmount);

    /* After this function has run its course, use accumulatedAmount and investedAmount */
  }

  function handleChange(value) {
    setRisk(value);
  }

  function getcurrencyicon(e) {
    const dollar = document.getElementById("dollar-btn");
    const indian = document.getElementById("inr-btn");
    const value = e.target.value;
    if (value === "$") {
      setCurrencyicon("$");
      if (principal.length > 1) {
        let p1 = "$";
        let p2 = principal.substring(1);
        setPrincipal(p1 + p2);
        settingprincipal(p1 + p2);
      } else {
        setPrincipal("$");
      }
      if (!dollar.classList.contains("active")) {
        dollar.classList.add("active");
        if (indian.classList.contains("active"))
          indian.classList.remove("active");
      }
    } else if (value === "₹") {
      setCurrencyicon("₹");
      if (principal.length > 1) {
        let p1 = "₹";
        let p2 = principal.substring(1);
        setPrincipal(p1 + p2);
        settingprincipal(p1 + p2);
      } else {
        setPrincipal("₹");
      }
      if (!indian.classList.contains("active")) {
        indian.classList.add("active");
        if (dollar.classList.contains("active"))
          dollar.classList.remove("active");
      }
    }
  }

  function settingprincipal(value) {
    if (value.substring(0, 1) === "₹" || value.substring(0, 1) === "$") {
      setNewprincipal(parseInt(value.substring(1, value.length)));
    } else {
      setNewprincipal(parseInt(value));
    }
  }

  useEffect(() => {
    let cagr = 7;
    if (currencyicon === "₹") {
      if (risk === "low") {
        cagr = 7;
      } else if (risk === "average") {
        cagr = 11;
      } else if (risk === "high") {
        cagr = 15;
      }
    } else if (currencyicon === "$") {
      if (risk === "low") {
        cagr = 5;
      } else if (risk === "average") {
        cagr = 9;
      } else if (risk === "high") {
        cagr = 13;
      }
    }

    if (
      principal.substring(0, 1) === "₹" ||
      principal.substring(0, 1) === "$"
    ) {
      setNewprincipal(parseInt(principal.substring(1, principal.length)));
      console.log({ sip: principal });
    } else {
      setNewprincipal(parseInt(principal));
    }

    calculate(newprincipal, cagr, years);

    setInputs({
      sip: newprincipal,
      cagr: cagr,
      time: years || 0,
      curr: currencyicon,
    });
    // console.log(principal, years, currencyicon, risk);
  }, [principal, years, currencyicon, risk, newprincipal]);

  function handleDropdownChange(e) {
    setRisk(e.target.value);
  }

  return (
    <div className="App">
      <Alert type="success" text="Address Updated Successfully." />
      <div className="edufund">
        <div className="edufund__rangeselect">
          <div className="edufund__rangeslect__firstsection">
            <div className="edufund__rangeslect__fsection">
              <p className="edufund__rangeslect__firstsection__text">
                It&apos;s your money. <br /> Make the most of it.
              </p>
              <div className="edufund__rangeselect__investment_details">
                I can invest{" "}
                <input
                  type="text"
                  value={principal}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setPrincipal(e.target.value);
                  }}
                />{" "}
                every month. <br />
                at{" "}
                <select
                  id="dropdown"
                  className="edufund__select__dropdown"
                  onChange={handleDropdownChange}
                  onBlur={handleDropdownChange}
                >
                  <option value="low">Low</option>
                  <option value="average">Average</option>
                  <option value="high">High</option>
                </select>
                risk for{" "}
                <input
                  type="number"
                  onChange={(e) => setYears(e.target.value)}
                  value={years}
                  style={{
                    width: "15%",
                  }}
                />{" "}
                years
              </div>
              <div className="edufund__rangeselect__currencyselect">
                <p>Investment in</p>
                <div className="edufund__rangeselect__currencyselect__buttons">
                  <button id="dollar-btn" value="$" onClick={getcurrencyicon}>
                    $
                  </button>
                  <button
                    id="inr-btn"
                    value="₹"
                    onClick={getcurrencyicon}
                    className="active"
                  >
                    ₹
                  </button>
                </div>
              </div>
              <div className="edufund__investementamount">
                <p className="edufund__investementamount--heading">
                  Invested Amount - {currencyicon}{" "}
                </p>
                <p className="edufund__investementamount--amount">
                  {currencyicon} {investmentamount}
                </p>
              </div>

              <div className="edufund__totalamount">
                <p className="edufund__totalamount--heading">
                  Total Value - {currencyicon}{" "}
                </p>
                <p className="edufund__totalamount--amount">
                  {currencyicon} {totalvalue}
                </p>
              </div>
            </div>
            <div className="edufund__rangeselect__expectations">
              <h2>Make a smart money move with EduFund</h2>
              <div className="edufund__expectations__firstdiv">
                <img
                  width="35"
                  height="35"
                  src="https://chartsjs.s3.us-east-2.amazonaws.com/green.24327dbe.png"
                  alt="green graph"
                />
                <div
                  style={{
                    fontSize: "0.7rem",
                    width: "60%",
                  }}
                >
                  <p className="edufund__expectations__firstdiv__heading">
                    Grow with EduFund
                  </p>
                  <p className="edufund__expectations__firstdiv__paragraph">
                    This is how your child’s education fund can grow when you
                    invest with EduFund.
                  </p>
                </div>
              </div>
              <div className="edufund__expectations__seconddiv">
                <img
                  width="35"
                  height="35"
                  src="https://chartsjs.s3.us-east-2.amazonaws.com/black.e868dd38.png"
                  alt="black graph"
                />
                <div
                  style={{
                    fontSize: "0.7rem",
                    width: "60%",
                  }}
                >
                  <p className="edufund__expectations__seconddiv__heading">
                    Amount you invest
                  </p>
                  <p className="edufund__expectations__seconddiv__paragraph">
                    This is the amount you’ve chosen to set aside for your
                    child, every month.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="edufund__chart">
          <Charts inputs={inputs} />
        </div>
      </div>
      <div className="background"></div>
    </div>
  );
}

export default App;
