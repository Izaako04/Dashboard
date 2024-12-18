import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { SxProps } from '@mui/system';

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

interface ForecastButtonsProps {
  forecastData: ForecastData[];
  selectedDay: string;
  onDaySelect: (date: string) => void;
  sx?: SxProps;
}

function ForecastButtons(props: ForecastButtonsProps): JSX.Element {
  const { forecastData, selectedDay, onDaySelect } = props;

  const dailyForecasts = forecastData.reduce((acc, forecast) => {
    const forecastDate = new Date(forecast.dt * 1000);
    const dateStr = forecastDate.toISOString().split('T')[0];

    if (!acc[dateStr]) {
      acc[dateStr] = {
        temps: [],
        icon: forecast.weather[0].icon,
        description: forecast.weather[0].description,
        dt: forecast.dt,
      };
    }
    acc[dateStr].temps.push(forecast.main.temp);
    return acc;
  }, {} as Record<string, { temps: number[]; icon: string; description: string; dt: number }>);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 0.3, // Menor espacio entre botones
        overflowX: 'auto',
        p: 1,
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {Object.entries(dailyForecasts).map(([date, data]) => {
        const avgTemp = data.temps.reduce((sum, temp) => sum + temp, 0) / data.temps.length;
        const displayDate = new Date(date + 'T00:00:00');

        return (
          <Button
            key={date}
            variant={selectedDay === date ? 'contained' : 'outlined'}
            onClick={() => onDaySelect(date)}
            sx={{
              minWidth: '100px', // Botón aún más pequeño
              padding: '6px', // Padding reducido
              display: 'flex',
              flexDirection: 'column',
              gap: 0.1,
              whiteSpace: 'nowrap',
              textTransform: 'none',
            }}
          >
            <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 'bold' }}>
              {displayDate
                .toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  timeZone: 'UTC',
                })
                .toUpperCase()}
            </Typography>
            <img
              src={`http://openweathermap.org/img/w/${data.icon}.png`}
              alt={data.description}
              style={{ width: 20, height: 20 }} // Ícono aún más pequeño
            />
            <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
              {Math.round(avgTemp)}°C
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'white' }}>
              {data.description}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.1,
                mt: 0.3,
                fontSize: '0.6rem',
              }}
            >
              <Typography variant="caption">💨 {Math.round(forecastData.find(f => f.dt === data.dt)?.wind.speed || 0)} m/s</Typography>
              <Typography variant="caption">☁️ {forecastData.find(f => f.dt === data.dt)?.clouds.all || 0}%</Typography>
              <Typography variant="caption">💧 {Math.round(forecastData.find(f => f.dt === data.dt)?.main.humidity || 0)}%</Typography>
            </Box>
          </Button>
        );
      })}
    </Box>
  );
}

export default ForecastButtons;
