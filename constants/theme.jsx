import {
    configureFonts,
    MD3LightTheme as DefaultTheme,
  } from 'react-native-paper';
  
  const fontConfig = {
    fontFamily: 'Poetsen'
  };

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#FECF81',
      primary_op: '#FFE4B9',
      secondary: '#F3898B',
      secondary_op: '#F6D0D1',
      tertiary: '#4DBFE4',
      tertiary_op: '#9EDAED',
      error: 'red'
    },
    fonts: configureFonts({config: fontConfig})
  };

  export default theme
  