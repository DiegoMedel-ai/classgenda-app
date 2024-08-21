import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { styles as style } from "@/constants/styles";
import theme from "@/constants/theme";
import Icon from "react-native-vector-icons/FontAwesome6";
import { getDateFormat24 } from "@/hooks/date";
import {
  Checkbox,
  Text,
  Modal,
  Portal,
  TextInput as Input,
  Button,
} from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { Linking } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import WebView from "react-native-webview";

const ViewReportes = ({ route, navigation }) => {
  const { materiaNrc } = route.params;
  const [currentPdf, setCurrentPdf] = useState("")
  const [reportes, setReportes] = useState([]);
  const [materia, setMateria] = useState();
  const [loading, setLoading] = useState(false);

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
          setMateria(data);
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
          setReportes(data);
        })
        .then(() => setLoading(false))
        .catch((error) => {
          console.log(
            `Fetch error to: ${process.env.EXPO_PUBLIC_API_URL}/reportes`,
            error
          );
        });
    } catch (error) {}
  };

  useEffect(() => {
    fetchReportes();
    fetchMateria();
  }, []);  

  return (
    <View style={{ ...style.general.overlay_top }}>
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
        {materia && (
          <View
            style={{
              justifyContent: "top",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Text style={{ width: "auto", fontSize: 24, marginTop: 20 }}>
              Reportar
            </Text>
            <Text style={{ width: "auto", fontSize: 20, marginTop: 20 }}>
              {materia.programa.nombre}
            </Text>
            <Text style={{ width: "auto", fontSize: 16, marginTop: 25 }}>
              NRC: {materia.nrc}
            </Text>
            <View
              style={{
                flexDirection: "row",
                width: "70%",
                justifyContent: "space-around",
              }}
            >
              <Text style={{ width: "auto", fontSize: 14, marginTop: 15 }}>
                Clave: {materia.programa.clave}
              </Text>
              <Text style={{ width: "auto", fontSize: 14, marginTop: 15 }}>
                {getDateFormat24(materia.hora_inicio)} -{" "}
                {getDateFormat24(materia.hora_final)}
              </Text>
              <Text style={{ width: "auto", fontSize: 14, marginTop: 15 }}>
                Aula: {materia.edificio}-{materia.aula}
              </Text>
            </View>
            <SelectDropdown
              data={reportes.map(reporte => {
                return {key: Object.keys(JSON.parse(materia.temas)).find(key => key.startsWith(reporte.temas + "_")).replace('_', '. '), reporte: reporte.pdf_uid};
              }).filter(key => key?.key !== undefined)}
              renderButton={(selectedItem, isOpen) => {
                return (
                  <View
                    style={{
                      minHeight: 50,
                      backgroundColor: theme.colors.secondary,
                      borderRadius: 10,
                      position: "relative",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      top: 20,
                      elevation: 5,
                      width: "70%",
                    }}
                  >
                    <Text style={{ fontSize: 18, paddingHorizontal: 15 }}>
                      {selectedItem?.key || "Selecciona un reporte"}
                    </Text>
                    <Icon
                      name="chevron-down"
                      size={18}
                      color={"black"}
                      style={{
                        position: "absolute",
                        right: 10,
                        height: 48,
                        textAlignVertical: "center",
                      }}
                    />
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => (
                <View
                  style={{
                    ...style.general.center,
                    ...(isSelected && {
                      backgroundColor: theme.colors.tertiary_op,
                    }),
                    paddingVertical: 10,
                  }}
                >
                  <Text>{item?.key}</Text>
                </View>
              )}
              search
              onSelect={(selectedItem) => setCurrentPdf(`${process.env.EXPO_PUBLIC_STORAGE_URL}/pdfs/${selectedItem.reporte}`)}
              dropdownStyle={{ borderRadius: 10 }}
              searchInputTxtColor={"black"}
              searchPlaceHolder={"Search here"}
              searchPlaceHolderColor={"grey"}
              renderSearchInputLeftIcon={() => {
                return (
                  <Icon name={"magnifying-glass"} color={"black"} size={18} />
                );
              }}
            />
          </View>
        )}
      </View>
      <View style={{ padding: 10, paddingVertical: 30, width: "100%", height: '100%' }}>
        <View style={styles.container}>
            {currentPdf !== "" && 
            <WebView
                source={{ uri: `https://docs.google.com/gview?embedded=true&url=${currentPdf}` }}
                style={{height: '100%', borderRadius: 15}}
                useWebKit={true}
            />
            // <Pdf
            //     source={{ uri: currentPdf, cache: true }}
            //     style={{height: '100%', width: '100%', flex: 1}}
            // />
            }
        </View>
      </View>

      {loading && (
        <View style={style.general.overlay_loader}>
          <ActivityIndicator size={"large"} color={"#4DBFE4"} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: theme.colors.secondary_op,
    borderRadius: 10,
    width: "95%",
    marginHorizontal: "auto",
    height: 460
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default ViewReportes;
