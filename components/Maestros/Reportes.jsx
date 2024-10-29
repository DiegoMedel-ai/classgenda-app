import { ActivityIndicator, Dimensions, Image, ImageBackground, View } from "react-native";
import { styles } from "@/constants/styles";
import theme from "@/constants/theme";
import { Button, Text } from "react-native-paper";
import { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome6";
import CircularProgressBar from "../CircularProgress";
import { useIsFocused } from "@react-navigation/native";
import useUids from "../../hooks/uids";

const Reportes = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false)
  const [percentage, setPercentage] = useState(0)
  const isFocused = useIsFocused();
  const { materiaNrc } = route.params;
  const { getTemaData } = useUids()

  /**
   * Funcion para calcular el porcentaje de avance de la materia
   * 
   * @param {Array} uids Lista de uids de todos los reportes
   * @returns Porcentaje de completado de la materia
   */
  function calculatePercentage(uids = []) {
    var hoursCompleted = 0;
    var hoursTotal = 0;
    uids.forEach(uid => {
      const [ , level, name, value, hours] = getTemaData(uid);
      
      hoursTotal += Number.parseInt(hours);

      if(Number.parseInt(value) === 2){
        hoursCompleted += Number.parseInt(hours);
      }
    });

    const percentage = (hoursCompleted * 100) / hoursTotal;
    
    return percentage;
  }

  /**
   * Funcion para traer la informacion de todos los reportes ligados a la materia en la pantalla.
   */
  const fetchReportes = () => {
    setLoading(true);

    try {
      const options = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      };

      const url = `${process.env.EXPO_PUBLIC_API_URL}/reportes/${materiaNrc}`;
      fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          if(data.length > 0){
            setPercentage(calculatePercentage(JSON.parse(data[data.length - 1]?.temas)));
          }else{
            setPercentage(0);
          }
          
        })
        .then(() => setLoading(false))
        .catch((error) => {
          console.log(
            `Fetch error to: ${process.env.EXPO_PUBLIC_API_URL}/reportes/${materiaNrc}`,
            error
          );
        });
    } catch (error) {}
  };

  useEffect(() => {
    if (materiaNrc === 0) {
      navigation.goBack();
    } else {
      fetchReportes()
    }
  }, [isFocused]);

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
        <CircularProgressBar percentage={percentage}/>
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
          onPressIn={() => navigation.navigate("ViewReportes", {materiaNrc: materiaNrc})}
        >
          <Text style={{ fontSize: 24, paddingHorizontal: 10, paddingVertical: 5 }}>
            Ver reportes
          </Text>
        </Button>
      </View>
      {loading && (
        <View style={styles.general.overlay_loader}>
          <ActivityIndicator size={"large"} color={"#4DBFE4"} />
        </View>
      )}
    </View>
  );
};

export default Reportes;
