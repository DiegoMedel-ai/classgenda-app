import { Dimensions, Image, ImageBackground, View } from "react-native";
import { styles } from "@/constants/styles";
import theme from "@/constants/theme";
import { Button, Text } from "react-native-paper";
import { useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome6";
import CircularProgressBar from "../CircularProgress";

const Reportes = ({ route, navigation }) => {
  const { materiaNrc } = route.params;

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
        <CircularProgressBar percentage={70}/>
      </View>
      <View
        style={{
          height: Dimensions.get("window").height - 350,
          width: "100%",
          justifyContent: "space-around",
          padding: 30,
        }}
      >
        <Text style={{ fontSize: 25 }}>Gestión</Text>
        <Button
          mode="elevated"
          icon={() => <Icon name="pencil" color="black" size={32} />}
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
          onPressIn={() => navigation.navigate("ModReportes", {materiaNrc: materiaNrc})}
        >
          <Text style={{ fontSize: 24, paddingHorizontal: 10, paddingVertical: 5 }}>
            Crear reporte
          </Text>
        </Button>
        <Button
          mode="elevated"
          icon={() => <Icon name="clipboard-list" color="black" size={32} />}
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
        >
          <Text style={{ fontSize: 24, paddingHorizontal: 10, paddingVertical: 5 }}>
            Ver reportes
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default Reportes;
