/* eslint-disable no-unused-vars */
import "./App.css";
import React, { useEffect, useState } from "react";
import Charts from "./Charts";

function App() {
  const [currencyicon, setCurrencyicon] = useState("₹");
  /* const [selectValue, setSelectValue] = useState(""); */
  const [principal, setPrincipal] = useState(`${currencyicon}15000`);
  const [newprincipal, setNewprincipal] = useState(15000);
  const [years, setYears] = useState(1);
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

    setInputs({
      sip: newprincipal,
      cagr: cagr,
      time: years,
      curr: currencyicon,
    });
    // console.log(principal, years, currencyicon, risk);
  }, [principal, years, currencyicon, risk, newprincipal]);

  function handleDropdownChange(e) {
    setRisk(e.target.value);
  }

  return (
    <div className="App">
      <div className="edufund">
        <div className="edufund__rangeselect">
          <div className="edufund__rangeslect__firstsection">
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
                min="1"
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
            <div className="edufund__rangeselect__expectations">
              <h2>What to expect</h2>
              <div className="edufund__expectations__firstdiv">
                <img
                  width="35"
                  height="35"
                  src="https://chartsjs.s3.us-east-2.amazonaws.com/green.24327dbe.png"
                  alt="green graph"
                />
                <div className="edufund__expectations__text">
                  <p
                    className="edufund__expectations__text__percentage"
                    style={{ marginRight: "10px" }}
                  >
                    15.4%
                  </p>
                  <p className="edufund__expectations__text__text">EduFund</p>
                </div>
                <p
                  style={{
                    fontSize: "0.7rem",
                    width: "60%",
                    paddingTop: "10px",
                  }}
                >
                  Due to scheme selection, asset allocation, & savings on
                  commissions.
                </p>
              </div>
              <div className="edufund__expectations__seconddiv">
                <img
                  width="35"
                  height="35"
                  src="https://chartsjs.s3.us-east-2.amazonaws.com/black.e868dd38.png"
                  alt="black graph"
                />
                <div className="edufund__expectations__text">
                  <p
                    className="edufund__expectations__text__percentage"
                    style={{ marginRight: "10px" }}
                  >
                    12%
                  </p>
                  <p className="edufund__expectations__text__text">Balanced</p>
                </div>

                <p
                  style={{
                    fontSize: "0.7rem",
                    width: "60%",
                    paddingTop: "10px",
                  }}
                >
                  The weighted average return of an aggressive and conservative
                  investor in ratio of 65:35.
                </p>
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
