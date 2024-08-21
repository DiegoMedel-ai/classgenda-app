import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Text } from 'react-native-paper';
import theme from "@/constants/theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgressBar = ({ percentage }) => {
  const strokeWidth = 15;
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const animatedValue = useRef(new Animated.Value(0)).current;

  const dashOffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: percentage,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [percentage]);

  return (
    <View style={styles.container}>
      <Svg height="160" width="160" viewBox="0 0 160 160">
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={theme.colors.secondary} />
            <Stop offset="100%" stopColor={theme.colors.tertiary} />
          </LinearGradient>
        </Defs>
        <Circle
          cx="80"
          cy="80"
          r={radius-10}
          stroke="white"
          strokeWidth={strokeWidth}
          fill="white"
        />
        <AnimatedCircle
          cx="80"
          cy="80"
          r={radius}
          stroke="url(#grad)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 80 80)`}
        />
        <Text style={styles.percentageText}>{`${percentage.toFixed(0)}%`}</Text>
      </Svg>
      <Text style={styles.labelText}>Porcentaje de completado</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 'auto'
  },
  percentageText: {
    fontSize: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderRadius: 50,
    top: 40,
    left: 40,
    width: 80,
    height: 80,
    backgroundColor: 'white',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 10, 
  },
  labelText: {
    marginTop: 10,
    fontSize: 20,
    textAlign: 'center',
  },
});

export default CircularProgressBar;
