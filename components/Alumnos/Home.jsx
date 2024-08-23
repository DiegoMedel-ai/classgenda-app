import React, { useState, useEffect, useRef } from "react";
import { Button, Text } from "react-native-paper";
import theme from "@/constants/theme";
import { Portal, Modal, Divider } from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";
import {
  View,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { getDateFormat24 } from "@/hooks/date";
import Icon from "react-native-vector-icons/Feather";
import IconF6 from "react-native-vector-icons/FontAwesome6";
import { styles } from "@/constants/styles";

export default function HomeAlumnos({ route, navigation }) {
  const { alumnoId } = route.params;
  const [loading, setLoading] = useState(false);
  const [inscripciones, setInscripciones] = useState([]);
  const [inscripcionesShow, setInscripcionesShow] = useState([]);

  function calculatePercentageOfOnes(data) {
    function countValues(obj) {
      let count = 0;
      let total = 0;

      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          total++;
          if (obj[key].value === 1) {
            count++;
          }

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

    if (total === 0) return 0;
    return (count / total) * 100;
  }

  const fetchInscripciones = () => {
    setLoading(true);

    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    };

    fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/inscripciones/${alumnoId}`,
      options
    )
      .then((response) => response.json())
      .then((_data) => {
        const data = _data.filter(
          (item) =>
            calculatePercentageOfOnes(JSON.parse(item.materia.temas)) !== 100
        );
        setInscripciones(_data);
        setInscripcionesShow(data);
      })
      .catch((error) => {
        console.log(
          `Fetch error to: ${process.env.EXPO_PUBLIC_API_URL}/inscripciones/${alumnoId}`,
          error
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInscripciones();
    if (alumnoId === 0) {
      navigation.navigate("AlumnoHome");
    }
  }, []);

  return (
    <View style={{ flexDirection: "column", height: "100%", padding: 20 }}>
      <View
        style={{
          maxHeight: "40%",
          width: "100%",
          backgroundColor: theme.colors.tertiary,
          marginVertical: 10,
          borderRadius: 20,
          padding: 10,
        }}
      >
        <View style={{ flexDirection: "row", width: "100%" }}>
          <View style={{ width: "40%" }}>
            <Text style={{ textAlign: "center" }}>Asignatura</Text>
          </View>
          <View style={{ width: "20%" }}>
            <Text style={{ textAlign: "center" }}>Progreso</Text>
          </View>
          <View style={{ width: "20%" }}>
            <Text style={{ textAlign: "center" }}>Estatus</Text>
          </View>
          <View style={{ width: "20%" }}>
            <Text style={{ textAlign: "center" }}>Detalles</Text>
          </View>
        </View>
        <FlatList
          data={inscripcionesShow}
          renderItem={({ item, index }) => (
            <>
              <View
                style={{
                  marginHorizontal: "auto",
                  width: "100%",
                  marginVertical: 10,
                  backgroundColor: "white",
                  height: 2,
                  borderRadius: 2,
                }}
              ></View>
              <View style={{ flexDirection: "row", width: "100%" }}>
                <View style={{ width: "40%" }}>
                  <View
                    style={{
                      ...styles.general.button_input,
                      marginTop: 0,
                      marginHorizontal: "auto",
                    }}
                  >
                    <Text style={{ padding: 5, fontSize: 12 }}>
                      {item.materia?.programa?.nombre}
                    </Text>
                  </View>
                </View>
                <View style={{ width: "20%" }}>
                  <View
                    style={{
                      ...styles.general.button_input,
                      marginTop: 0,
                      marginHorizontal: "auto",
                    }}
                  >
                    <Text style={{ padding: 5, fontSize: 12 }}>
                      {calculatePercentageOfOnes(
                        JSON.parse(item.materia?.temas)
                      ).toFixed(0)}
                      %
                    </Text>
                  </View>
                </View>
                <View style={{ width: "20%" }}>
                  <View
                    style={{
                      ...styles.general.button_input,
                      marginTop: 0,
                      marginHorizontal: "auto",
                    }}
                  >
                    <Text style={{ padding: 5, fontSize: 12 }}>En curso</Text>
                  </View>
                </View>
                <View style={{ width: "20%" }}>
                  <TouchableOpacity
                    style={{
                      width: "90%",
                      marginTop: 0,
                      marginHorizontal: "auto",
                    }}
                    onPress={() =>
                      navigation.navigate("OptionsPrograma", {
                        programaClave: item.materia?.programa?.clave,
                        maestroId: item.materia?.profesor?.id,
                      })
                    }
                  >
                    <IconF6
                      name="list-ul"
                      size={20}
                      style={{
                        marginHorizontal: "auto",
                        textAlignVertical: "center",
                        marginVertical: "auto",
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
          style={{
            maxHeight: "100%",
            width: "100%",
          }}
        />
      </View>
      <View
        style={{
          height: "auto",
          width: "60%",
          flexDirection: "row",
          padding: 10,
          backgroundColor: theme.colors.secondary_op,
          borderRadius: 20,
          marginVertical: 10,
        }}
      >
        <Text
          style={{
            width: "65%",
            textAlign: "center",
            textAlignVertical: "center",
          }}
        >
          Asignaturas totales
        </Text>
        <Text
          style={{
            width: "35%",
            height: 65,
            borderRadius: 10,
            backgroundColor: "white",
            fontSize: 36,
            textAlign: "center",
            textAlignVertical: "center",
          }}
        >
          {inscripciones.length}
        </Text>
      </View>
      <View
        style={{
          height: "auto",
          width: "60%",
          flexDirection: "row",
          padding: 10,
          backgroundColor: theme.colors.primary_op,
          borderRadius: 20,
          marginVertical: 10,
        }}
      >
        <Text
          style={{
            width: "65%",
            textAlign: "center",
            textAlignVertical: "center",
          }}
        >
          Clases totales
        </Text>
        <Text
          style={{
            width: "35%",
            height: 65,
            borderRadius: 10,
            backgroundColor: "white",
            fontSize: 36,
            textAlign: "center",
            textAlignVertical: "center",
          }}
        >
          {inscripcionesShow.length}
        </Text>
      </View>
    </View>
  );
}
