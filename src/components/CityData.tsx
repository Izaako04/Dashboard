import { Box, Card, Typography, Grid } from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import CompressIcon from '@mui/icons-material/Compress';
import CloudIcon from '@mui/icons-material/Cloud';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';

interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    cloudCover: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    tempMax?: number;
    tempMin?: number;
    weatherMain: string;
    weatherDescription: string;
    weatherIcon: string;
  };
  city: string;
}

interface InfoCityProps {
  data: WeatherData | null;
}

function CityData({ data }: InfoCityProps): JSX.Element | null {
  if (!data) return null;

  return (
    <Card
      sx={{
        p: { xs: 4, sm: 5 },
        background: '  #1f1f1f',
        color: '#4293fa',
        borderRadius: 2,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontWeight: 'bold',
          }}
        >
          {data.city}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <img
            src={`http://openweathermap.org/img/wn/${data.current.weatherIcon}@2x.png`}
            alt={data.current.weatherDescription}
            style={{ width: 40, height: 40 }}
          />
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {data.current.temperature.toFixed(1)}°C
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <DeviceThermostatIcon sx={{ color: '#FF7043', fontSize: 20 }} />
          <Typography variant="body2" sx={{ color: '#ccc' }}>
            Max: {data.current.tempMax?.toFixed(1)}°C / Min: {data.current.tempMin?.toFixed(1)}°C
          </Typography>
        </Box>
      </Box>

      {/* Weather Details */}
      <Grid container spacing={0.5} sx={{ mt: 1 }}>
        <Grid item xs={6} sm={3}>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <WaterDropIcon sx={{ color: '#42A5F5', fontSize: 20 }} />
            <Box>
              <Typography variant="caption" sx={{ color: '#aaa' }}>
                Humidity
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {data.current.humidity}%
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <AirIcon sx={{ color: '#26C6DA', fontSize: 20 }} />
            <Box>
              <Typography variant="caption" sx={{ color: '#aaa' }}>
                Wind
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {data.current.windSpeed.toFixed(1)} km/h
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={2} sm={3}>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <CloudIcon sx={{ color: '#78909C', fontSize: 20 }} />
            <Box>
              <Typography variant="caption" sx={{ color: '#aaa' }}>
                Cloud
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {data.current.cloudCover}%
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <CompressIcon sx={{ color: '#8D6E63', fontSize: 20 }} />
            <Box>
              <Typography variant="caption" sx={{ color: '#aaa' }}>
                Pressure
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {data.current.pressure} hPa
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}

export default CityData;
