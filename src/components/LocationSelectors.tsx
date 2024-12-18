import React from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';

interface LocationSelectorsProps {
  ecuadorProvinces: { [key: string]: string[] }; // Objeto con provincias y ciudades
  selectedProvince: string | null;
  setSelectedProvince: (value: string | null) => void;
  selectedCity: string | null;
  setSelectedCity: (value: string | null) => void;
}

const LocationSelectors: React.FC<LocationSelectorsProps> = ({
  ecuadorProvinces,
  selectedProvince,
  setSelectedProvince,
  selectedCity,
  setSelectedCity,
}) => {
  // Función para manejar el cambio de provincia
  const handleProvinceChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setSelectedProvince(newValue);
    setSelectedCity(null); // Reinicia la ciudad al cambiar la provincia
  };

  // Función para manejar el cambio de ciudad
  const handleCityChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setSelectedCity(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, width: '100%'  }}>
      {/* Selector de Provincias */}
      <Autocomplete
        disablePortal
        options={Object.keys(ecuadorProvinces)}
        value={selectedProvince}
        onChange={handleProvinceChange}
        sx={{ flex: 1 }}  
        renderInput={(params) => (
          <TextField
            {...params}
            label="Province"
            variant="outlined"
            sx={{
              '& .MuiInputLabel-root': { color: '#4293fa', fontWeight: 'bold' },
              '& .MuiOutlinedInput-root': {
                fontSize: '0.9rem', // Reduce el tamaño del texto
                color: 'white', // Texto dentro del campo en blanco
                '& fieldset': { borderColor: '#4293fa' }, // Borde blanco
                '&:hover fieldset': { borderColor: '#4293fa' }, // Hover en borde blanco
              },
            }}
          />
        )}
      />

      {/* Selector de Ciudades */}
      <Autocomplete
        sx={{ flex: 1 }}
        disablePortal
        options={selectedProvince ? ecuadorProvinces[selectedProvince] : []}
        value={selectedCity}
        onChange={handleCityChange}
        disabled={!selectedProvince}
        renderInput={(params) => (
          <TextField
            {...params}
            label="City"
            variant="outlined"
            sx={{
              '& .MuiInputLabel-root': { color: '#4293fa' }, // Texto del label en blanco
              '& .MuiOutlinedInput-root': {
                fontSize: '0.9rem', // Reduce el tamaño del texto
                color: 'white', // Texto dentro del campo en blanco
                '& fieldset': { borderColor: '#4293fa' }, // Borde blanco
                '&:hover fieldset': { borderColor: '#4293fa' },
                 // Hover en borde blanco
              },
            }}
          />
        )}
      />
    </Box>
  );
};

export default LocationSelectors;
