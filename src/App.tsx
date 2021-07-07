import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { SHEET_URL } from "./const";
import "./App.scss";

const PLAY_TYPE = {
  patinko: "パチ",
  throttle: "スロ",
};

function App() {
  const [storeName, setStoreName] = useState("");
  const [playRateMoneyAmount, setPlayRateMoneyAmount] = useState("");
  const [exchangeAmount, setExchangeAmount] = useState("");
  const [unit, setUnit] = useState("");

  useEffect(() => {
    let unitResult = "";
    if (playRateMoneyAmount === "1" || playRateMoneyAmount === "4") {
      unitResult = "玉";
    }
    if (playRateMoneyAmount === "5" || playRateMoneyAmount === "20") {
      unitResult = "枚";
    }

    setUnit(unitResult);
  }, [playRateMoneyAmount]);

  const storeNames = [
    { key: "lionNakano", displayName: "ライオンズ" },
    { key: "mandoruNakano", displayName: "百万ドル" },
    { key: "ntNakano", displayName: "ニュー東" },
  ];

  const playRates = [
    {
      number: 1,
      playType: PLAY_TYPE.patinko,
    },
    {
      number: 4,
      playType: PLAY_TYPE.patinko,
    },
    {
      number: 5,
      playType: PLAY_TYPE.throttle,
    },
    {
      number: 20,
      playType: PLAY_TYPE.throttle,
    },
  ];

  const changeStoreName = (event: any) => {
    setStoreName(event.target.value);
  };
  const changePlayRateMoneyAmount = (event: any) => {
    console.log(event.target.value);
    setPlayRateMoneyAmount(event.target.value);
  };
  const changeExchangeAmount = (event: any) => {
    setExchangeAmount(event.target.value);
  };

  // レートから遊戯タイプを取得
  const getPlayType = () => {
    let result = "";
    if (playRateMoneyAmount === "1" || playRateMoneyAmount === "4") {
      result = PLAY_TYPE.patinko;
    }
    if (playRateMoneyAmount === "5" || playRateMoneyAmount === "20") {
      result = PLAY_TYPE.throttle;
    }

    return result;
  };

  // シート書込関数
  const writeRecordToSheet = () => {
    const params = new URLSearchParams();
    // 現在日時を取得
    const dateNow = format(new Date(), "yyyy/MM/dd HH:mm");
    params.append("date", dateNow);
    params.append("storeName", storeName);
    params.append("playRate", playRateMoneyAmount);
    params.append("playType", getPlayType());
    params.append("exchangeAmount", exchangeAmount);
    axios.post(SHEET_URL, params);
  };

  const $storeNames = storeNames.map((storeName) => {
    return (
      <option key={storeName.key} value={storeName.displayName}>
        {storeName.displayName}
      </option>
    );
  });
  const $playRates = playRates.map((playRate) => {
    return (
      <option key={playRate.number} value={playRate.number}>
        {playRate.number}
        {playRate.playType === PLAY_TYPE.patinko ? "パチ" : "スロ"}
      </option>
    );
  });
  return (
    <div className="app">
      <header className="header">
        <p className="title">一般景品記録書込アプリ</p>
      </header>
      <main className="main">
        <div className="content">
          <label htmlFor="">店名：</label>
          <select className="select" value={storeName} onChange={changeStoreName}>
            <option key="storeNameDefault" value="">
              選択して下さい
            </option>
            {$storeNames}
          </select>
        </div>
        <div className="content">
          <label htmlFor="">金額レート：</label>
          <select className="select" value={playRateMoneyAmount} onChange={changePlayRateMoneyAmount}>
            <option key="playRateDefault" value="">
              選択して下さい
            </option>
            {$playRates}
          </select>
        </div>
        <div className="content exchangeAmountWrapper">
          <label htmlFor="">交換数量：</label>
          <input className="exchangeAmountInput" type="number" name="" value={exchangeAmount} onChange={changeExchangeAmount} />
          <span>{unit}</span>
        </div>
        <button className="writeBtn" onClick={writeRecordToSheet}>
          書込
        </button>
      </main>
    </div>
  );
}

export default App;
