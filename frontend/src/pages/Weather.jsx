// src/pages/Weather.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Weather = () => {
  const [city, setCity] = useState('Sao Paulo');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const brazilianCities = ["Presidente Bernardes, Sao Paulo","Sao Paulo", "Rio de Janeiro", "Belo Horizonte", "Salvador", "Fortaleza", "Curitiba", "Manaus", "Recife", "Goiania", "Belem", "Porto Alegre"];

  const handleFetchWeather = useCallback(async () => {
    if (!city) {
      setError('Por favor, selecione uma cidade.');
      return;
    }
    setLoading(true);
    setError('');
    setWeatherData(null);
    try {
      const response = await api.get(`/weather/${city}`);
      setWeatherData(response.data);
    } catch (err) {
      console.error("Erro ao buscar clima:", err);
      setError('Não foi possível buscar os dados do clima. Verifique a conexão com o backend.');
    } finally {
      setLoading(false);
    }
  }, [city]); 

  useEffect(() => {
    handleFetchWeather();

  }, []);

  const chartData = useMemo(() => {
    if (!weatherData) return { labels: [], datasets: [] };

    const hourlyForecast = weatherData.forecast.forecastday[0].hour;
    return {
      labels: hourlyForecast.map(h => h.time.split(' ')[1]),
      datasets: [{
        label: `Temperatura em ${weatherData.location.name} (°C)`,
        data: hourlyForecast.map(h => h.temp_c),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      }],
    };
  }, [weatherData]);

  return (
    <div>
      <h2>Consulte o Clima de uma Cidade</h2>
      <div className="filters">
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          {brazilianCities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={handleFetchWeather} disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar Clima'}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {loading && <p>Carregando dados do clima...</p>}
      {weatherData && (
        <div className="results">
          <h3>{weatherData.location.name}, {weatherData.location.region}</h3>
          <div className="current-weather">
            <p><strong>Temperatura Atual:</strong> {weatherData.current.temp_c}°C</p>
            <p><strong>Condição:</strong> {weatherData.current.condition.text}</p>
            <p><strong>Umidade:</strong> {weatherData.current.humidity}%</p>
          </div>
          <hr />
          <h4>Variação de Temperatura ao Longo do Dia (Chart.js)</h4>
          {/* Agora passamos o objeto memorizado 'chartData' */}
          <Line options={{ responsive: true }} data={chartData} />
          <hr />
          <h4>Localização no Mapa (Leaflet)</h4>
          <MapContainer 
            key={weatherData.location.name}
            center={[weatherData.location.lat, weatherData.location.lon]} 
            zoom={13} 
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[weatherData.location.lat, weatherData.location.lon]}>
              <Popup>{weatherData.location.name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default Weather;