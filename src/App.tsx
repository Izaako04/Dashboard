import React, { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import './index.css';
import CityData from './components/CityData';
import LineChartWeather from './components/LineChartWeather';
import ForecastButtons from './components/ForecastButtons';
import ForecastTable from './components/ForecastTable';
import Container from '@mui/material/Container';    
import LocationSelectors from './components/LocationSelectors';
import { Grid, Paper } from '@mui/material';


interface Props {

  window?: () => Window;
}

const ecuadorProvinces: Record<string, string[]> = {
  'Azuay': ['Cuenca', 'Gualaceo', 'Paute', 'Sigsig', 'Girón', 'San Fernando', 'Santa Isabel', 'Pucar', 'Nabón'],
  'Bolívar': ['Guaranda', 'San Miguel', 'Caluma', 'Chillanes', 'Echeandía', 'Chimbo'],
  'Cañar': ['Azogues', 'Cañar', 'Biblián', 'La Troncal'],
  'Chimborazo': ['Riobamba', 'Guano', 'Alausí', 'Chambo', 'Colta', 'Penipe', 'Pallatanga', 'Guamote', 'Chunchi', 'Cumandá'],
  'Cotopaxi': ['Latacunga', 'Saquisilí', 'Pujilí', 'Salcedo', 'Sigchos', 'La Maná'],
  'El Oro': ['Machala', 'Santa Rosa', 'Pasaje', 'Huaquillas', 'Zaruma', 'Portovelo', 'El Guabo', 'Arenillas', 'Atahualpa', 'Balsas', 'Chilla', 'Marcabelí'],
  'Esmeraldas': ['Esmeraldas', 'Atacames', 'Quinindé', 'San Lorenzo', 'Muisne', 'La Concordia', 'Rioverde'],
  'Galápagos': ['Puerto Baquerizo Moreno', 'Puerto Ayora', 'Puerto Villamil'],
  'Guayas': ['Guayaquil', 'Durán', 'Samborondón', 'Milagro', 'Daule', 'Playas', 'El Triunfo', 'Naranjal', 'Balao', 'Balzar', 'Colimes', 'Palestina', 'Pedro Carbo', 'Salitre', 'Santa Lucía', 'Yaguachi Nuevo'],
  'Imbabura': ['Ibarra', 'Otavalo', 'Cotacachi', 'Atuntaqui', 'Pimampiro', 'Urcuquí'],
  'Loja': ['Loja', 'Catamayo', 'Macará', 'Cariamanga', 'Celica', 'Saraguro', 'Sozoranga', 'Gonzanamá', 'Quilanga', 'Espíndola'],
  'Los Ríos': ['Babahoyo', 'Quevedo', 'Ventanas', 'Vinces', 'Buena Fe', 'Puebloviejo', 'Montalvo', 'Mocache', 'Palenque', 'Quinsaloma'],
  'Manab': ['Portoviejo', 'Manta', 'Chone', 'Bahía de Caráquez', 'Jipijapa', 'Montecristi', 'El Carmen', 'Sucre', 'Tosagua', 'Santa Ana', 'Paján', 'Pedernales', 'San Vicente', 'Bolívar', 'Jama', 'Jaramijó', 'Junín', 'Olmedo', 'Flavio Alfaro'],
  'Morona Santiago': ['Macas', 'Gualaquiza', 'Sucúa', 'Limón Indanza', 'Santiago', 'Palora', 'Huamboya', 'San Juan Bosco', 'Taisha', 'Logroño'],
  'Napo': ['Tena', 'Archidona', 'El Chaco', 'Carlos Julio Arosemena Tola', 'Baeza'],
  'Orellana': ['Puerto Francisco de Orellana', 'La Joya de los Sachas', 'Loreto', 'Nuevo Rocafuerte'],
  'Pastaza': ['Puyo', 'Mera', 'Santa Clara', 'Arajuno'],
  'Pichincha': ['Quito', 'Cayambe', 'Rumiñahui', 'Mejía', 'Pedro Moncayo', 'Pedro Vicente Maldonado', 'San Miguel de los Bancos', 'Puerto Quito'],
  'Santa Elena': ['Santa Elena', 'La Libertad', 'Salinas'],
  'Santo Domingo de los Tsáchilas': ['Santo Domingo', 'La Concordia'],
  'Sucumbíos': ['Nueva Loja', 'Shushufindi', 'Lago Agrio', 'Cuyabeno', 'Putumayo', 'Sucumbíos'],
  'Tungurahua': ['Ambato', 'Baños de Agua Santa', 'Cevallos', 'Mocha', 'Patate', 'Pelileo', 'Quero', 'Tisaleo'],
  'Zamora Chinchipe': ['Zamora', 'Yantzaza', 'Nangaritza', 'Centinela del Cóndor', 'Palanda', 'Chinchipe', 'El Pangui', 'Paquisha'],
};

// Actualizar la interface WeatherData para que coincida con InfoCity
interface WeatherData {
  current: {
    time: Date;
    temperature: number;
    humidity: number;
    feelsLike: number;
    description: string;
    cloudCover: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    rain?: number;
    visibility: number;
    tempMax?: number;
    tempMin?: number;
    weatherMain: string;
    weatherDescription: string;
    weatherIcon: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  city: string;
  sunrise: Date;
  sunset: Date;
}

// Modificar la interface para el pronóstico
interface ForecastData {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
}

function App(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | null>('Guayas');
  const [selectedCity, setSelectedCity] = useState<string | null>('Guayaquil');

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('');

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleProvinceChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    if (newValue) {
      setSelectedProvince(newValue);
      setSelectedCity(ecuadorProvinces[newValue][0]);
    } else {
      setSelectedProvince('Guayas');
      setSelectedCity('Guayaquil');
    }
  };

  const handleCityChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    if (newValue) {
      setSelectedCity(newValue);
    } else if (selectedProvince) {
      setSelectedCity(ecuadorProvinces[selectedProvince][0]);
    }
  };

  // Modificar la función fetchWeatherData
  const fetchWeatherData = useCallback(async (city: string) => {
    try {
      const API_KEY = "3f3a46be5b39afdf7737f3cc150923cb";
      
      // Fetch actual weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const currentData = await currentResponse.json();

      // Fetch forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastResponse.json();

      if (currentData) {
        const weatherData: WeatherData = {
          current: {
            time: new Date(currentData.dt * 1000),
            temperature: currentData.main.temp,
            humidity: currentData.main.humidity,
            feelsLike: currentData.main.feels_like,
            description: currentData.weather[0].description,
            cloudCover: currentData.clouds.all,
            pressure: currentData.main.pressure,
            windSpeed: currentData.wind.speed,
            windDirection: currentData.wind.deg,
            rain: currentData.rain ? currentData.rain["1h"] : 0,
            visibility: currentData.visibility,
            tempMax: currentData.main.temp_max,
            tempMin: currentData.main.temp_min,
            weatherMain: currentData.weather[0].main,
            weatherDescription: currentData.weather[0].description,
            weatherIcon: currentData.weather[0].icon
          },
          coordinates: {
            latitude: currentData.coord.lat,
            longitude: currentData.coord.lon
          },
          city: currentData.name,
          sunrise: new Date(currentData.sys.sunrise * 1000),
          sunset: new Date(currentData.sys.sunset * 1000)
        };

        setWeatherData(weatherData);
      }

      if (forecastData && forecastData.list) {
        setForecastData(forecastData.list);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }, []);

  React.useEffect(() => {
    if (selectedCity) {
      fetchWeatherData(selectedCity);
    }
  }, [selectedCity, fetchWeatherData]);

  useEffect(() => {
    if (forecastData.length > 0 && !selectedDay) {
      // Seleccionar el primer día disponible
      const firstDate = new Date(forecastData[0].dt * 1000).toISOString().split('T')[0];
      setSelectedDay(firstDate);
    }
  }, [forecastData]);

  return (
    <Box
      sx={{
        mt: 5,
        backgroundColor: '#AAAA',
        width: '82.3rem',   // Asegura que cubra todo el ancho
        gap: 2, // Espacio entre filas
        display: 'flex',
        flexDirection:'column',
        color: 'white',
        p: 2,
        justifyContent: 'center',   // Centra las cajas horizontalmente
        alignItems: 'center',       // Centra las cajas verticalmente
      }}
    >
      <Box
        sx={{
          display: 'flex',
          backgroundColor: '#121212', // Fondo principal oscuro
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)', // Sombra sutil
          alignItems:'center',
          justifyContent: 'center',   // Centra el contenido horizontalmente
          p: 3,
          gap: 20,                     // Espacio entre las dos cajas
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CityData data={weatherData} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <LocationSelectors
            ecuadorProvinces={ecuadorProvinces}
            selectedProvince={selectedProvince}
            setSelectedProvince={setSelectedProvince}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
          />
          <Typography variant="h5" sx={{ mb: 2 }}>
          </Typography>
          <ForecastButtons
            forecastData={forecastData}
            selectedDay={selectedDay}
            onDaySelect={setSelectedDay}
          />
          </Box>
      </Box>
      <LineChartWeather
        latitude= {weatherData?.coordinates.latitude || -2.1962} 
        longitude={weatherData?.coordinates.longitude || -79.8862} 
      />
      <ForecastTable forecastData={forecastData} selectedDay={selectedDay} />
    </Box>
  );
}



export default App