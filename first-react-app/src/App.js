import './App.css';
import Footer from './Footer';
import Navbar from './Navbar';
import Exchange from './Exchange';
import Chart from './Chart';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React, { useEffect, useState } from 'react';

const base_URL = 'http://api.exchangeratesapi.io/v1/latest?access_key=2e1db2cc4355d1f21952fe535ea4e0d4'


function App() {

  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)
  
  let toAmount, fromAmount
  if (amountInFromCurrency) {
    fromAmount = amount
    toAmount = amount * exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }

  useEffect(() => {
      fetch(base_URL)
          .then(res => res.json())
          .then(data => {
              const firstCurrency = Object.keys(data.rates)[0]
              
              setCurrencyOptions([data.base, ...Object.keys(data.rates)])
              
              setFromCurrency(data.base) 
              setToCurrency(firstCurrency)
              setExchangeRate(data.rates[firstCurrency])
          })
  }, [])

  /*useEffect(() =>{
    if(fromCurrency != null && toCurrency != null) {
      fetch(`${base_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
     .then(res => res.json())
     .then(data => setExchangeRate(data.rates[toCurrency]))
    }
  }, [fromCurrency, toCurrency]) */

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  return (
    <Router>
      <div>
        <Navbar/>
          <Switch>
            <Route exact path="/">
              <Exchange
              currencyOptions={currencyOptions}
              selectedCurrency={toCurrency}
              selectedCurrency2={fromCurrency}
              onChangeCurrency={e => setToCurrency(e.target.value)}
              onChangeCurrency2={e => setFromCurrency(e.target.value)}
              onChangeAmount={handleFromAmountChange}
              onChangeAmount2={handleToAmountChange}
              amount={fromAmount}
              amount2={toAmount}
              />
            </Route>
            <Route path="/chart">
              <Chart
              currencyOptions={currencyOptions}
              selectedCurrency={toCurrency}
              selectedCurrency2={fromCurrency}
              onChangeCurrency={e => setToCurrency(e.target.value)}
              onChangeCurrency2={e => setFromCurrency(e.target.value)}
              onChangeAmount={handleFromAmountChange}
              onChangeAmount2={handleToAmountChange}
              amount={fromAmount}
              amount2={toAmount}
              />
            </Route>
          </Switch>
        <Footer/>
        
      </div>
    </Router>
  );
}

export default App;
