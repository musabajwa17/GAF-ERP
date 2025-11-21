"use client";
import { useState, useEffect } from "react";
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  Gauge,
  MapPin,
} from "lucide-react";

export default function WeatherForecast() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const API_KEY = "f90c98bcc992dcde24b028f575ba21fb"; // ✅ your key

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Location error:", err);
          setError("Unable to get your location. Showing default (Chakwal).");
          setLocation({ lat: 32.9328, lon: 72.863 });
        }
      );
    } else {
      setError("Geolocation not supported by your browser.");
      setLocation({ lat: 32.9328, lon: 72.863 });
    }
  }, []);

  // Fetch weather
  useEffect(() => {
    if (!location) return;

    const fetchWeather = async () => {
      try {
        setLoading(true);

        const currentRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${API_KEY}`
        );
        const currentData = await currentRes.json();

        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${API_KEY}`
        );
        const forecastData = await forecastRes.json();

        // Group by day and compute averages
        const groupedDays = {};
        forecastData.list.forEach((item) => {
          const date = new Date(item.dt * 1000);
          const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

          if (!groupedDays[dayName]) groupedDays[dayName] = {
            temps: [],
            humidities: [],
            winds: [],
            visibilities: [],
          };

          groupedDays[dayName].temps.push(item.main.temp);
          groupedDays[dayName].humidities.push(item.main.humidity);
          groupedDays[dayName].winds.push(item.wind.speed * 3.6); // convert to km/h
          groupedDays[dayName].visibilities.push(item.visibility / 1000); // convert to km
        });

        const forecast = Object.entries(groupedDays)
          .slice(0, 5)
          .map(([day, vals]) => ({
            day,
            high: Math.round(Math.max(...vals.temps)),
            low: Math.round(Math.min(...vals.temps)),
            humidity: Math.round(vals.humidities.reduce((a, b) => a + b, 0) / vals.humidities.length),
            wind: Math.round(vals.winds.reduce((a, b) => a + b, 0) / vals.winds.length),
            visibility: Math.round(vals.visibilities.reduce((a, b) => a + b, 0) / vals.visibilities.length),
          }));

        setWeatherData({
          current: {
            temp: Math.round(currentData.main.temp),
            condition: currentData.weather[0].main,
            humidity: currentData.main.humidity,
            windSpeed: Math.round(currentData.wind.speed * 3.6),
            visibility: Math.round(currentData.visibility / 1000),
            feelsLike: Math.round(currentData.main.feels_like),
            location: `${currentData.name}, ${currentData.sys.country}`,
            high: Math.round(currentData.main.temp_max),
            low: Math.round(currentData.main.temp_min),
            pressure: currentData.main.pressure,
          },
          forecast,
        });

        setLoading(false);
        setError(null);
      } catch (err) {
        console.error("Weather fetch failed:", err);
        setError("Failed to fetch weather data.");
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  const getWeatherIcon = (condition, size = 28) => {
    if (condition.includes("Rain")) return <CloudRain size={size} className="text-blue-400" />;
    if (condition.includes("Cloud")) return <Cloud size={size} className="text-gray-400" />;
    return <Sun size={size} className="text-yellow-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="text-green-700 text-lg">Getting your location...</div>
        <div className="text-green-500 text-sm mt-1">
          Please allow location access 🌍
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {/* <div className="text-center mb-3">
          <p className="flex items-center justify-center gap-2 text-green-600 text-lg">
            <MapPin size={20} /> {weatherData.current.location}
          </p>
          {error && (
            <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg px-4 py-2 mt-3 inline-block">
              {error}
            </div>
          )}
        </div> */}

        {/* Current Weather */}
        <div className="bg-white shadow-xl rounded-3xl p-6 mb-3 border border-green-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-2 rounded-3xl">
                {getWeatherIcon(weatherData.current.condition, 80)}
              </div>
              <div>
                <h2 className="text-4xl font-bold text-green-800">
                  {weatherData.current.temp}°
                </h2>
                <p className="text-xl text-green-600 mt-2">
                  {weatherData.current.condition}
                </p>
                <div className="flex gap-4 text-green-700 mt-3 text-lg">
                  <span>H: {weatherData.current.high}°</span>
                  <span>L: {weatherData.current.low}°</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center bg-green-50 rounded-2xl p-4 border border-green-100">
                <Droplets className="mx-auto mb-2 text-green-600" />
                <p className="text-sm text-green-600">Humidity</p>
                <p className="text-2xl font-bold text-green-800">
                  {weatherData.current.humidity}%
                </p>
              </div>
              <div className="text-center bg-green-50 rounded-2xl p-4 border border-green-100">
                <Wind className="mx-auto mb-2 text-green-600" />
                <p className="text-sm text-green-600">Wind</p>
                <p className="text-2xl font-bold text-green-800">
                  {weatherData.current.windSpeed} km/h
                </p>
              </div>
              <div className="text-center bg-green-50 rounded-2xl p-4 border border-green-100">
                <Eye className="mx-auto mb-2 text-green-600" />
                <p className="text-sm text-green-600">Visibility</p>
                <p className="text-2xl font-bold text-green-800">
                  {weatherData.current.visibility} km
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Forecast Table */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-green-100">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-5">
            <h2 className="text-2xl font-bold text-white">5-Day Forecast</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-green-100 border-b border-green-200">
                <th className="px-8 py-3 text-left text-green-800 font-semibold text-lg">Day</th>
                <th className="px-8 py-3 text-center text-green-800 font-semibold text-lg">High</th>
                <th className="px-8 py-3 text-center text-green-800 font-semibold text-lg">Low</th>
                <th className="px-8 py-3 text-center text-green-800 font-semibold text-lg">Humidity</th>
                <th className="px-8 py-3 text-center text-green-800 font-semibold text-lg">Wind</th>
                <th className="px-8 py-3 text-center text-green-800 font-semibold text-lg">Visibility</th>
              </tr>
            </thead>
            <tbody>
              {weatherData.forecast.map((d, i) => (
                <tr
                  key={i}
                  className="border-b border-green-100 hover:bg-green-50 transition-colors"
                >
                  <td className="px-8 py-4 text-green-800 font-semibold">{d.day}</td>
                  <td className="px-8 py-4 text-center text-green-800 font-bold text-xl">{d.high}°</td>
                  <td className="px-8 py-4 text-center text-green-600 font-semibold text-xl">{d.low}°</td>
                  <td className="px-8 py-4 text-center text-green-700 font-semibold">{d.humidity}%</td>
                  <td className="px-8 py-4 text-center text-green-700 font-semibold">{d.wind} km/h</td>
                  <td className="px-8 py-4 text-center text-green-700 font-semibold">{d.visibility} km</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
