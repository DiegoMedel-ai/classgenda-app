import React, { useState, useEffect } from 'react';
import { Text } from 'react-native-paper';
import theme from "@/constants/theme";
import { View, FlatList, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolateColor } from 'react-native-reanimated';

const materias = [
  { id: '1', title: 'Seminario de Algoritmia', horario: 'L - I, 07:00 - 08:55', salon: 'X 16' },
  { id: '2', title: 'Programación', horario: 'M - J, 09:00 - 10:55', salon: 'X 07' },
  { id: '3', title: 'Algoritmia', horario: 'V, 13:00 - 14:55', salon: 'V 02' },
  { id: '4', title: 'Administración de bases de datos', horario: 'I - V, 11:00 - 12:55', salon: 'UCT 09' },
  { id: '5', title: 'Matemática Discreta', horario: 'M - J, 15:00 - 16:55', salon: 'U 14' }
];

const Horario = ({ userId }) => {
  const [selectedId, setSelectedId] = useState(null);
  const scales = materias.map(() => useSharedValue(1));
  const selections = materias.map(() => useSharedValue(0));

  const handlePress = (index, id) => { 
    setSelectedId(id);

    scales.forEach((scale, i) => {
      scale.value = withSpring(i === index ? 1.05 : 1, {
        stiffness: 80, damping: 10,
      });
    });

    selections.forEach((selection, i) => {
      selection.value = withSpring(i === index ? 1 : 0);
    });
  };

  const MateriaItem = ({ materia, index, isSelected }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
        selections[index].value,
        [0, 1],
        [theme.colors.secondary_op, theme.colors.secondary]
      );

      return {
        transform: [{ scale: scales[index].value }],
        backgroundColor
      };
    });

    return (
      <Pressable onPress={() => handlePress(index, materia.id)}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <Text style={styles.title}>{materia.title}</Text>
          <Text style={styles.subtitle}>{materia.horario}</Text>
          <Text style={styles.salon}>{materia.salon}</Text>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={materias}
        renderItem={({ item, index }) => (
          <MateriaItem
            materia={item}
            index={index}
            isSelected={item.id === selectedId}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  card: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  salon: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default Horario;
