import React, { useRef, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Image, Dimensions, Pressable } from "react-native";
import { Text, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome6";
import Carousel from "react-native-reanimated-carousel";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { blurhash, styles } from "@/constants/styles";

const alumnosImg = require("@/assets/images/alumnos.png");
const maestrosImg = require("@/assets/images/maestros.png");
const materiasImg = require("@/assets/images/materias.png");
const programasImg = require("@/assets/images/programas.png");

const data = [
  { icon: "user-group", text: "Alumnos", image: alumnosImg },
  { icon: "users-between-lines", text: "Maestros", image: maestrosImg },
  { icon: "ruler", text: "Materias", image: materiasImg },
  { icon: "code", text: "Programas", image: programasImg },
];

const HomeAdmin = ({ navigation }) => {
  const [indexCarousel, setIndexCarousel] = useState(0);
  const refCarousel = useRef();
  const refCarouselImg = useRef();
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  const userNav = ( page ) => {
      try {
        navigation.navigate(page);
    } catch (error) {
        console.log(error);
        
    }
  };

  return (
    <View style={styles.admin.overlay}>
      <View style={styles.admin.container}>
        <Carousel
          width={width}
          height={height * 0.65}
          style={{...styles.admin.carousel, width: width, height: '100%'}}
          data={data}
          ref={refCarouselImg}
          renderItem={({ index, item, animationValue }) => (
            <View style={{...styles.general.center}}>
                <Image source={item.image} style={styles.admin.image} />
                <Text style={{...styles.general.drawer_title, marginTop: 20}}>{item.text}</Text>
            </View>
          )}
        />
      </View>
        <Carousel
          width={100}
          height={60}
          style={{...styles.admin.carousel, width: width}}
          data={data}
          ref={refCarousel}
          onSnapToItem={(index) => {
            refCarouselImg.current?.scrollTo({
                index: index,
                animated: true
            })
            setIndexCarousel(index)
          }}
          renderItem={({ index, item, animationValue }) => (
            <Item
              animationValue={animationValue}
              item={item}
              onPress={() => {
                refCarousel.current?.scrollTo({
                  count: animationValue.value,
                  animated: true,
                });
                refCarouselImg.current?.scrollTo({
                  count: animationValue.value,
                  animated: true,
                });
                if (index === indexCarousel) {
                  userNav(item.text);
                }
              }}
            />
          )}
        />
    </View>
  );
};

const Item = ({ animationValue, item, onPress }) => {
  const translateY = useSharedValue(0);

  const labelStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [1, 1.25, 1],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }, { translateY: translateY.value }],
      opacity,
    };
  }, [animationValue, translateY]);

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={[styles.admin.animatedItem, labelStyle]}>
        <Button style={styles.admin.icon_carousel}>
          <Icon name={item.icon} color="black" size={20} />
        </Button>
      </Animated.View>
    </Pressable>
  );
};

export default HomeAdmin;
