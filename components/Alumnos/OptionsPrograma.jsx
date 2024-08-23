import { Dimensions, Image, ImageBackground, View } from "react-native";
import { styles } from "@/constants/styles";
import theme from "@/constants/theme";
import { Button, Text } from "react-native-paper";
import { useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome6";

const OptionsPrograma = ({ route, navigation }) => {
    const { programaClave, maestroId } = route.params;

  return (
    <View style={{ ...styles.general.overlay_top }}>
      <View
        style={{
          height: 220,
          width: "100%",
          backgroundColor: theme.colors.tertiary_op,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          position: "relative",
        }}
      >
        <ImageBackground
          source={require("@/assets/images/programaDetails.png")}
          resizeMode="contain"
          style={{
            height: "100%",
            width: "100%",
            right: 90,
            alignSelf: "flex-start",
            position: "absolute",
            bottom: -10,
          }}
        >
          <View
            style={{
              ...styles.general.center,
              width: "60%",
              height: "100%",
              left: 230,
              bottom: 30,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                paddingHorizontal: 15,
                textAlign: "center",
              }}
            >
              “Frases hacia alumno, mostrar aleatorio”
            </Text>
          </View>
        </ImageBackground>
      </View>
      <View
        style={{
          height: Dimensions.get("window").height - 320,
          width: "100%",
          justifyContent: "space-around",
          padding: 30,
        }}
      >
        <Text style={{ fontSize: 25 }}>Programa</Text>
        <Button
          mode="elevated"
          icon={() => <Icon name="user" color="black" size={32} />}
          contentStyle={{ flexDirection: "row-reverse" }}
          style={{
            ...styles.general.button,
            ...styles.general.center,
            marginHorizontal: 'auto',
            minWidth: '90%',
            backgroundColor: theme.colors.tertiary,
            paddingVertical: 10,
            borderRadius: 40,
            height: 82,
          }}
          onPressIn={() => navigation.navigate("ProfesorDetails", {maestroId: maestroId})}
        >
          <Text style={{ fontSize: 24, paddingHorizontal: 10, paddingVertical: 5 }}>
            Info del profesor
          </Text>
        </Button>
        <Button
          mode="elevated"
          icon={() => <Icon name="graduation-cap" color="black" size={32} />}
          contentStyle={{ flexDirection: "row-reverse" }}
          style={{
            ...styles.general.button,
            ...styles.general.center,
            marginHorizontal: 'auto',
            minWidth: '90%',
            backgroundColor: theme.colors.secondary,
            paddingVertical: 10,
            borderRadius: 40,
            height: 82,
          }}
          onPressIn={() => navigation.navigate("Programa", {programaClave: programaClave})}
        >
          <Text style={{ fontSize: 24, paddingHorizontal: 10, paddingVertical: 5 }}>
            Ver programa
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default OptionsPrograma;
