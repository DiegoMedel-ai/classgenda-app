import { ActivityIndicator, Dimensions, Image, ImageBackground, View } from "react-native";
import { styles } from "@/constants/styles";
import theme from "@/constants/theme";
import { Button, Text } from "react-native-paper";
import { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome6";
import CircularProgressBar from "../CircularProgress";
import { useIsFocused } from "@react-navigation/native";

const OptionsMateria = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false)
  const [percentage, setPercentage] = useState(0)
  const isFocused = useIsFocused();
  const { materiaNrc, maestroId } = route.params;

  function calculatePercentageOfOnes(data) {
    // Función recursiva para contar los valores de 1 y el total de elementos
    function countValues(obj) {
      let count = 0; // Contador de valores que son 1
      let total = 0; // Contador total de elementos
  
      // Iterar sobre las claves del objeto
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          // Contar el valor actual
          total++;
          if (obj[key].value === 1) {
            count++;
          }
  
          // Contar los valores en los subtemas
          if (obj[key].subtemas && Object.keys(obj[key].subtemas).length > 0) {
            const result = countValues(obj[key].subtemas);
            count += result.count;
            total += result.total;
          }
        }
      }
  
      return { count, total };
    }
  
    const { count, total } = countValues(data);
  
    if (total === 0) return 0; // Evitar división por cero
    return (count / total) * 100;
  }

  const fetchMateria = () => {
    setLoading(true);

    try {
      const options = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      };

      const url = `${process.env.EXPO_PUBLIC_API_URL}/materias/${materiaNrc}`;
      fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          setPercentage(calculatePercentageOfOnes(JSON.parse(data.temas)));
        })
        .then(() => setLoading(false))
        .catch((error) => {
          console.log(
            `Fetch error to: ${process.env.EXPO_PUBLIC_API_URL}/materias`,
            error
          );
        });
    } catch (error) {}
  };

  
  useEffect(() => {
    if (materiaNrc === 0) {
      navigation.goBack();
    } else {
      fetchMateria()
    }
  }, [isFocused]);

  return (
    <View style={{ ...styles.general.overlay_top }}>
      <View
        style={{
          height: 220,
          width: "100%",
          backgroundColor: theme.colors.primary_op,
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
        <Text style={{ fontSize: 25 }}>Opciones</Text>
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
          icon={() => <Icon name="clipboard-list" color="black" size={32} />}
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

export default OptionsMateria;
