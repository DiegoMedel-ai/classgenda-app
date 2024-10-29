import { Dimensions, Image, ImageBackground, View } from "react-native";
import { styles } from "@/constants/styles";
import theme from "@/constants/theme";
import { Button, Text } from "react-native-paper";
import { useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome6";

const MateriaDetails = ({ route, navigation }) => {
  const { materiaNrc, programaClave } = route.params;

  useEffect(() => {
    if (materiaNrc === 0) {
      navigation.goBack();
    }
  }, []);

  return (
    <View style={{ ...styles.general.overlay_top }}>
      <View
        style={{
          height: 220,
          width: "100%",
          backgroundColor: theme.colors.secondary_op,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          flexDirection: "row",
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
        }}
      >
        <ImageBackground
          source={require("@/assets/images/materiaDetails.png")}
          resizeMode="contain"
          style={{ height: "100%", width: "100%", left: 60 }}
        >
          <View
            style={{
              ...styles.general.center,
              width: "60%",
              height: "100%",
              right: 60,
              bottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                paddingHorizontal: 15,
                textAlign: "center",
              }}
            >
              “Frases hacia profesores, mostrar aleatorio”
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
        <Text style={{ fontSize: 25 }}>Gestión</Text>
        <Button
          mode="elevated"
          icon={() => <Icon name="book-open-reader" color="black" size={32} />}
          contentStyle={{ flexDirection: "row-reverse" }}
          style={{
            ...styles.general.button,
            ...styles.general.center,
            marginHorizontal: 'auto',
            minWidth: '85%',
            backgroundColor: theme.colors.tertiary,
            paddingVertical: 10,
            borderRadius: 40,
            height: 82,
          }}
          onPressIn={() => navigation.navigate("Programa", {materiaNrc: materiaNrc, programaClave: programaClave})}
        >
          <Text style={{ fontSize: 24, paddingHorizontal: 10, paddingVertical: 5 }}>
            Ver programa
          </Text>
        </Button>
        <Button
          mode="elevated"
          icon={() => <Icon name="list-check" color="black" size={32} />}
          contentStyle={{ flexDirection: "row-reverse" }}
          style={{
            ...styles.general.button,
            ...styles.general.center,
            marginHorizontal: 'auto',
            minWidth: '85%',
            backgroundColor: theme.colors.secondary,
            paddingVertical: 10,
            borderRadius: 40,
            height: 82,
          }}
          onPressIn={() => navigation.navigate("Reportes", {materiaNrc: materiaNrc})}
        >
          <Text style={{ fontSize: 24, paddingHorizontal: 10, paddingVertical: 5 }}>
            Reportes
          </Text>
        </Button>
        <Button
          mode="elevated"
          icon={() => <Icon name="users" color="black" size={32} />}
          contentStyle={{ flexDirection: "row-reverse" }}
          style={{
            ...styles.general.button,
            ...styles.general.center,
            marginHorizontal: 'auto',
            minWidth: '90%',
            backgroundColor: theme.colors.primary,
            paddingVertical: 10,
            borderRadius: 40,
            height: 82,
          }}
          onPressIn={() => navigation.navigate("ViewListAlumnos", {materiaNrc: materiaNrc})}
        >
          <Text style={{ fontSize: 24, paddingHorizontal: 10, paddingVertical: 5 }}>
            Lista de alumnos
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default MateriaDetails;
