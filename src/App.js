/* eslint-disable no-unused-vars */
import "./App.css";
import React, { useEffect, useState } from "react";
import Charts from "./Charts";
import greengraph from "../src/images/green.png";
import blackgraph from "../src/images/black.png";

function App() {
  const [selectValue, setSelectValue] = useState("");
  const [principal, setPrincipal] = useState("");
  const [newprincipal, setNewprincipal] = useState(0);
  const [years, setYears] = useState(1);
  const [currencyicon, setCurrencyicon] = useState("₹");
  const [risk, setRisk] = useState("low");
  const [inputs, setInputs] = useState({
    sip: 15000,
    cagr: 7,
    time: years,
    curr: currencyicon,
  });

  window.addEventListener("resize", changeDivSize);

  function changeDivSize() {
    window.location.reload();
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
      if (!dollar.classList.contains("active")) {
        dollar.classList.add("active");
        if (indian.classList.contains("active"))
          indian.classList.remove("active");
      }
    } else if (value === "₹") {
      setCurrencyicon("₹");
      if (!indian.classList.contains("active")) {
        indian.classList.add("active");
        if (dollar.classList.contains("active"))
          dollar.classList.remove("active");
      }
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

    if (principal.substring(0) === "₹" || principal.substring(0) === "$") {
      setNewprincipal(parseInt(principal.substring(1, principal)));
    } else {
      setNewprincipal(parseInt(principal));
    }

    setInputs({
      sip: newprincipal,
      cagr: cagr,
      time: years,
      curr: currencyicon,
    });
    console.log(principal, years, currencyicon, risk);
  }, [principal, years, currencyicon, risk]);

  function handleDropdownChange(e) {
    setSelectValue(e.target.value);
  }

  console.log("selectValue", selectValue);

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
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
              risk for{" "}
              <input
                type="number"
                onChange={(e) => setYears(e.target.value)}
                defaultValue="1"
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
                  src={greengraph}
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
                  src={blackgraph}
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
    </div>
  );
}

export default App;
