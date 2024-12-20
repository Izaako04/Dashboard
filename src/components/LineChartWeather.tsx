import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

interface WeatherData {
  time: string[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
}

interface LineChartWeatherProps {
  latitude: number;
  longitude: number;
}

export default function LineChartWeather({ latitude, longitude }: LineChartWeatherProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [dataType, setDataType] = useState<string>('humidity');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=relative_humidity_2m,apparent_temperature,precipitation_probability&timezone=auto&forecast_days=1`
        );
        const data = await response.json();
        
        const hours = Array.from({ length: 24 }, (_, i) => i);

        setWeatherData({
          time: hours.map(String),
          relative_humidity_2m: data.hourly.relative_humidity_2m.slice(0, 24),
          apparent_temperature: data.hourly.apparent_temperature.slice(0, 24),
          precipitation_probability: data.hourly.precipitation_probability.slice(0, 24),
        });
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchData();
  }, [latitude, longitude]);

  const handleDataTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newDataType: string,
  ) => {
    if (newDataType !== null) {
      setDataType(newDataType);
    }
  };

  if (!weatherData) return null;

  const getDataConfig = () => {
    switch (dataType) {
      case 'temperature':
        return { data: weatherData.apparent_temperature, color: '#FF4444' };
      case 'humidity':
        return { data: weatherData.relative_humidity_2m, color: '#4444FF' };
      case 'precipitation':
        return { data: weatherData.precipitation_probability, color: '#44AA44' };
      default:
        return { data: weatherData.apparent_temperature, color: '#FF4444' };
    }
  };

  const dataConfig = getDataConfig();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        width: '68.3rem',
        maxWidth: '100%',
        backgroundColor: '#121212', // Fondo principal oscuro
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)', // Sombra sutil
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: '#4293fa',
          mb: 2,
          fontWeight: 'bold',
        }}
      >
        Weather Chart
      </Typography>

      <ToggleButtonGroup
        value={dataType}
        exclusive
        onChange={handleDataTypeChange}
        aria-label="weather data type"
        orientation={isMobile ? 'vertical' : 'horizontal'}
        sx={{
          mb: 2,
          '& .MuiToggleButton-root': {
            color: '#4293fa',
            borderColor: '#4293fa',
            '&.Mui-selected': {
              color: '#fff',
              backgroundColor: '#1976D2',
              borderColor: '#4293fa',
            },
            '&:hover': {
              backgroundColor: 'rgba(19, 90, 161, 0.2)', // 80% de opacidad
            },
          },
        }}
      >
        <ToggleButton value="temperature" sx={{ color: '#4293fa'}}>Temperature (°C)</ToggleButton>
        <ToggleButton value="humidity">Humidity (%)</ToggleButton>
        <ToggleButton value="precipitation">Precipitation (%)</ToggleButton>
      </ToggleButtonGroup>

      <Box
        sx={{
          width: '100%',
          height: isMobile ? 250 : 300,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#1e1e1e',
          borderRadius: 2,
        }}
      >
        <LineChart
          width={undefined}
          height={undefined}
          series={[
            {
              data: dataConfig.data,
              color: dataConfig.color,
              curve: 'linear',
            },
          ]}
          xAxis={[
            {
              data: hours,
              label: 'Hour of Day',
              scaleType: 'linear',
            },
          ]}
          margin={{
            left: 50,
            right: 20,
            top: 20,
            bottom: 40,
          }}
          sx={{
            '& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel': {
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              fill: '#bbb', // Color gris claro
            },
            '& .MuiChartsAxis-left .MuiChartsAxis-tickLabel': {
              fill: '#bbb', // Color gris claro
            },
            '& .MuiChartsAxis-bottom .MuiChartsAxis-label': {
              fill: '#ffffff', // Etiqueta principal blanca
              fontSize: '0.9rem',
            },
          }}
        />
      </Box>
    </Paper>
  );
}
