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
import useUids from "../../hooks/uids";

export default function HomeAlumnos({ route, navigation }) {
  const { alumnoId } = route.params;
  const { getTemaData } = useUids();
  const [loading, setLoading] = useState(false);
  const [inscripciones, setInscripciones] = useState([]);
  const [inscripcionesShow, setInscripcionesShow] = useState([]);

  function calculatePercentage(uids = []) {
    var hoursCompleted = 0;
    var hoursTotal = 0;
    
    if(uids.length > 0){

      uids.forEach(uid => {
        const [ , level, name, value, hours] = getTemaData(uid);
        
        hoursTotal += Number.parseInt(hours);
  
        if(Number.parseInt(value) === 2){
          hoursCompleted += Number.parseInt(hours);
        }
      });
      const percentage = (hoursCompleted * 100) / hoursTotal;
      
      return percentage;
    } else {
      return 0;
    }

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
      .then(async (_data) => {
        const dataWithReportes = await Promise.all(
          _data.map(async (item) => {
            const response = await fetch(
              `${process.env.EXPO_PUBLIC_API_URL}/reportes/${item.materia.nrc}`,
              options
            );
            
            const reportes = await response.json();
            const lastReporte = reportes[reportes.length - 1];
            
            if (lastReporte) {
              const temas = JSON.parse(lastReporte.temas || '[]');
              const progreso = calculatePercentage(temas);
              return { ...item, progreso }; 
            }
  
            return item;
          })
        );
        const filteredData = dataWithReportes.filter((item) => item.progreso !== 100);
  
        setInscripciones(_data);
        setInscripcionesShow(filteredData);
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
                      {item.progreso?.toFixed(0) || 0}
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
