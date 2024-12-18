import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box
} from '@mui/material';

interface ForecastData {
  dt: number;
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

interface ForecastTableProps {
  forecastData: ForecastData[];
  selectedDay: string;
}

const ForecastTable: React.FC<ForecastTableProps> = ({ forecastData, selectedDay }) => {
  if (!forecastData || !Array.isArray(forecastData) || forecastData.length === 0 || !selectedDay) {
    return <Box sx={{ p: 2, color: 'white', backgroundColor: '#1b1b1b' }}>No hay datos disponibles</Box>;
  }

  const dayForecasts = forecastData
    .filter(forecast => {
      const forecastDate = new Date(forecast.dt * 1000).toISOString().split('T')[0];
      return forecastDate === selectedDay;
    })
    .sort((a, b) => new Date(a.dt * 1000).getHours() - new Date(b.dt * 1000).getHours());

  if (dayForecasts.length === 0) {
    return <Box sx={{ p: 2, color: 'white', backgroundColor: '#1b1b1b' }}>No hay datos disponibles para este día</Box>;
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        p: 4,backgroundColor: '#121212', // Fondo principal oscuro
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)', // Sombra sutil
        overflow: 'hidden',
        width:'66.3rem',
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: '#4293fa', fontWeight: 'bold', backgroundColor: '#1b1b1b' }}>Hora</TableCell>
            <TableCell sx={{ color: '#4293fa', fontWeight: 'bold', backgroundColor: '#1b1b1b' }}>Condición</TableCell>
            <TableCell sx={{ color: '#4293fa', fontWeight: 'bold', backgroundColor: '#1b1b1b' }} align="right">Temperatura</TableCell>
            <TableCell sx={{ color: '#4293fa', fontWeight: 'bold', backgroundColor: '#1b1b1b' }} align="right">Humedad</TableCell>
            <TableCell sx={{ color: '#4293fa', fontWeight: 'bold', backgroundColor: '#1b1b1b' }} align="right">Nubosidad</TableCell>
            <TableCell sx={{ color: '#4293fa', fontWeight: 'bold', backgroundColor: '#1b1b1b' }} align="right">Viento</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dayForecasts.map((forecast) => (
            <TableRow
              key={forecast.dt}
              sx={{
                backgroundColor: '#1b1b1b', // Fondo negro para filas
                '&:hover': { backgroundColor: '#111' } // Efecto hover con un gris oscuro
              }}
            >
              <TableCell sx={{ color: 'white' }}>
                {new Date(forecast.dt * 1000).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })}
              </TableCell>
              <TableCell sx={{ color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <img
                    src={`http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`}
                    alt={forecast.weather[0].description}
                    style={{ width: 30, height: 30 }}
                  />
                  {forecast.weather[0].description}
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="right">
                {Math.round(forecast.main.temp)}°C
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="right">
                {forecast.main.humidity}%
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="right">
                {forecast.clouds.all}%
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="right">
                {Math.round(forecast.wind.speed * 3.6)} km/h {forecast.wind.deg}°
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ForecastTable;
