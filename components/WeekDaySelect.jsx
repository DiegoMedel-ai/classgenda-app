import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '@/constants/theme';
import { Text } from 'react-native-paper';

export default function WeekdaySelector({ selected = [], setSelectedDays, formik = null, disabled = false }) {
  const [days, setDays] = useState([
    { name: "Lunes", selected: false, label: 'Lu' },
    { name: "Martes", selected: false, label: 'Ma' },
    { name: "Miércoles", selected: false, label: 'Mi' },
    { name: "Jueves", selected: false, label: 'Ju' },
    { name: "Viernes", selected: false, label: 'Vi' },
  ]);

  useEffect(() => {
    // Inicializa el estado según los días ya seleccionados
    const newDays = days.map(day => ({
      ...day,
      selected: selected.includes(day.name),
    }));
    setDays(newDays);
  }, [selected]);

  const toggleDay = (index) => {
    const newDays = [...days];
    newDays[index].selected = !newDays[index].selected;

    const selectedDays = newDays
      .filter(day => day.selected)
      .map(day => day.name);
    
    setDays(newDays);

    if (formik) {
      setSelectedDays('dias_clase', JSON.stringify(selectedDays));
    } else {
      setSelectedDays(selectedDays);
    }
  };

  return (
    <View style={styles.container}>
      {days.map((day, index) => (
        <TouchableOpacity
          key={index}
          disabled={disabled}
          style={[
            styles.bubble,
            day.selected && styles.bubbleSelected,
          ]}
          onPress={() => toggleDay(index)}
        >
          <Text style={styles.bubbleText}>{day.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 5,
  },
  bubble: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  bubbleSelected: {
    backgroundColor: theme.colors.tertiary, // Cambia el color cuando se selecciona
  },
  bubbleText: {
    color: '#000',
    fontSize: 16,
  },
});
