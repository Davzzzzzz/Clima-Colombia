import { OPEN_WEATHER_API_KEY, OPEN_WEATHER_BASE_URL } from '../config';
import { WeatherResponse } from '../models/Weather';

// Consulta el clima actual de una ciudad por nombre.
// Lanza un error con el status HTTP para que el componente decida qué mensaje mostrar.
export async function getWeatherByCity(city: string): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    q: `${city},CO`,        // ",CO" evita ambigüedad con ciudades homónimas de otros países
    appid: OPEN_WEATHER_API_KEY,
    units: 'metric',
    lang: 'es'
  });

  const response = await fetch(`${OPEN_WEATHER_BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    const error: any = new Error('Error al consultar el clima');
    error.status = response.status;
    throw error;
  }

  return response.json();
}

// Construye la URL del ícono del clima que devuelve OpenWeather
export function getIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// NOTA para el laboratorio (Parte 5):
// Aquí agregarás getWeatherForCities(cities: string[]) para consultar varias
// ciudades en paralelo con Promise.allSettled, cuando llegues al mapa interactivo.
