import React from 'react';
import logo from './logo.svg';
import './App.css';
import WeatherInfoDisplay from './WeatherInfoDisplay';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <WeatherInfoDisplay/>
      </header>
    </div>
  );
}

export default App;
