import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import './App.css';
import images from './unsplash_images.json';

const apiUrl = process.env.REACT_APP_API_URL;

async function getFirefighter(date) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'Access-Control-Allow-Origin': true },
    body: date && `datestring=${date}`
  };
  return fetch(`${apiUrl}/firefighter/new`, requestOptions)
    .then(response => response.json())
}

async function skipFirefighter(e) {
  e.preventDefault();
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': true }
  };
  return fetch(`${apiUrl}/firefighter/skip`, requestOptions);
}

function getImage(setImageUrl, firefighter) {
  setImageUrl(images[firefighter?.id]?.urls.small);
}

function App() {
  const [imageUrl, setImageUrl] = useState();
  const [firefighter, setFirefighter] = useState();
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    setDate(new Date());

  }, []);

  useEffect(() => {
    getImage(setImageUrl, firefighter)
  }, [firefighter]);

  useEffect(() => {
    const datestring = date.toLocaleString('sv', { timeZoneName: 'short' }).split(' ')[0];
    getFirefighter(datestring)
      .then(ff => setFirefighter(ff));
  }, [date])


  const datePhrase = (date.toDateString() === (new Date()).toDateString()) ? `d'aujourd'hui` : `du ${date.toLocaleDateString('fr-FR')}`

  return (
    <div className="App">
      <header className="App-header">
        <img src={imageUrl} className="App-logo" alt="logo" />
        <p>
          Le pompier {datePhrase} est <b>{firefighter?.name}</b>.
        </p>
        <p><button className="App-link" onClick={e => skipFirefighter(e).then(() => getFirefighter()).then(setFirefighter)}>Décaler ↪</button></p>
        <Calendar
          className={"calendar"}
          onChange={setDate}
          value={date}
        />
      </header>
    </div>
  );
}

export default App;
