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
    <div className="p-8 bg-white shadow-md rounded-lg">
  <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
    Consulte o Clima de uma Cidade
  </h2>

  {/* Controles de Busca */}
  <div className="flex items-center space-x-4 mb-6">
    <select 
      value={city} 
      onChange={(e) => setCity(e.target.value)}
      className="block w-full md:w-1/3 px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    >
      {brazilianCities.map(c => <option key={c} value={c}>{c}</option>)}
    </select>
    <button 
      onClick={handleFetchWeather} 
      disabled={loading}
      className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? 'Buscando...' : 'Buscar Clima'}
    </button>
  </div>

  {/* Mensagens de Estado */}
  {error && (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-4" role="alert">
      <p>{error}</p>
    </div>
  )}
  {loading && <p className="text-gray-500 text-center py-4">Carregando dados do clima...</p>}
  
  {/* Container dos Resultados */}
  {weatherData && (
    <div className="mt-8 space-y-8">
      <h3 className="text-2xl font-bold text-gray-900">
        {weatherData.location.name}, {weatherData.location.region}
      </h3>
      
      {/* Box de Clima Atual */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div>
          <span className="block text-sm font-medium text-gray-500">Temperatura Atual</span>
          <span className="text-4xl font-bold text-blue-600">{weatherData.current.temp_c}°C</span>
        </div>
        <div>
          <span className="block text-sm font-medium text-gray-500">Condição</span>
          <span className="text-2xl font-semibold text-gray-800 flex items-center justify-center">
            <img src={weatherData.current.condition.icon} alt={weatherData.current.condition.text} className="w-10 h-10 mr-2" />
            {weatherData.current.condition.text}
          </span>
        </div>
        <div>
          <span className="block text-sm font-medium text-gray-500">Umidade</span>
          <span className="text-4xl font-bold text-gray-800">{weatherData.current.humidity}%</span>
        </div>
      </div>
      
      {/* Seção do Gráfico */}
      <div>
        <h4 className="text-xl font-semibold text-gray-700 mb-4">Variação de Temperatura ao Longo do Dia</h4>
        <div className="p-4 border border-gray-200 rounded-lg">
          <Line options={{ responsive: true }} data={chartData} />
        </div>
      </div>

      {/* Seção do Mapa */}
      <div>
        <h4 className="text-xl font-semibold text-gray-700 mb-4">Localização no Mapa</h4>
        <div className="rounded-lg overflow-hidden border border-gray-200">
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
      </div>
    </div>
  )}
</div>
  );
};

export default Weather;