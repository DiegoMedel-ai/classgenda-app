import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { styles as style } from "@/constants/styles";
import theme from "@/constants/theme";
import Icon from "react-native-vector-icons/FontAwesome6";
import { getDateFormat24 } from "@/hooks/date";
import { Button, Text } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { Linking } from "react-native";
import useUids from "../../hooks/uids";
import SelectDropdown from "react-native-select-dropdown";
import { TouchableOpacity } from "react-native";

const CheckboxTree = ({ route, navigation }) => {
  const { materiaNrc } = route.params;
  const [reportes, setReportes] = useState([]);
  const [materia, setMateria] = useState();
  const [loading, setLoading] = useState(false);
  const [newWeek, setNewWeek] = useState();
  const [selectedReport, setSelectedReport] = useState();
  const [description, setDescription] = useState('')
  const selectWeek = useRef();

  const {
    setCheckableTree,
    checkableTree,
    renderTree,
    setUids,
    uids,
    newReport,
    setNewReport,
  } = useUids();

  /**
   * Funcion para abrir el pdf en el navegador del usuario
   * @param {String} pdf_url Url del pdf del reporte ligado a la semana
   */
  const openPDF = async (pdf_url) => {
    try {
      const supported = await Linking.canOpenURL(pdf_url);

      if (supported) {
        await Linking.openURL(pdf_url);
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "No se puede abrir el pdf",
        });
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Error al intentar abrir el pdf",
      });
    }
  };

  /**
   * Funcion para traer la informacion de la materia ligada a la pantalla en el momento.
   */
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

  /**
   * Funcion para recopilar los datos del programa seleccionado y asignar la lista de UIDs
   * 
   * @param {Number} programaClave Clave del programa a traer los datos
   */
  const fetchPrograma = (programaClave) => {
    try {
      const options = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      };

      const url = `${process.env.EXPO_PUBLIC_API_URL}/programas/${programaClave}`;
      fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          if(uids)
          setUids(JSON.parse(data.temas));
        })
        .then(() => setLoading(false))
        .catch((error) => {
          console.log(
            `Fetch error to: ${process.env.EXPO_PUBLIC_API_URL}/programas/${programaClave}`,
            error
          );
        });
    } catch (error) {}
  };

  /**
   * Funcion para establecer el ultimo UID en el render de los temas
   *
   * @param {Array} listUids Lista de UIDs para ubicar el ultimo uid ingresado
   */
  const setLastUids = (listUids) => {
    setUids(JSON.parse(listUids.temas));
  };

  /**
   * Funcion para obtener todos los reportes correspondientes a la materia y asigna los datos a la variable Reportes y el ultimo reporte para que se muestre
   */
  const fetchReportes = async () => {
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
      await fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          setLastUids(data[data.length - 1]);
          setDescription(data[data.length - 1]?.descripcion);
          setReportes(data);
        })
        .finally(() => setLoading(false))
        .catch((error) => {
          console.log(
            `Fetch error to: ${process.env.EXPO_PUBLIC_API_URL}/reportes`,
            error
          );
        });
    } catch (error) {}
  };

  /**
   * Funcion para poder modificar los temas de los reportes y crear nuevos junto con la semana. 
   */
  const updateTemas = () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("temas", JSON.stringify(uids));
    formData.append("materia", materiaNrc);
    formData.append("semana", newWeek);
    formData.append("descripcion", description);

    try {
      const options = {
        method: "POST",
        headers: {
          "Content-type": "multipart/form-data",
        },
        body: formData,
      };

      const url = `${process.env.EXPO_PUBLIC_API_URL}/reportes/upload`;

      fetch(url, options)
        .then((response) => {
          if (response.status !== 200) {
            Alert.alert("Error", `Ocurrió un error inesperado\n${response}`, [
              {
                text: "Ok",
                style: "cancel",
              },
            ]);
          }
        })
        .then(() => setLoading(false))
        .finally(() => {
          setNewReport(false);
          fetchReportes();
          setNewWeek();
          setSelectedReport();
        })
        .catch((error) => {
          console.log(
            `Fetch error to: ${process.env.EXPO_PUBLIC_API_URL}/reportes/upload`,
            error
          );
        });
    } catch (error) {}
  };

  /**
   * Hook para traer toda la informacion necesaria al montar los componentes
   */
  useEffect(() => {
    const fetchData = async () =>{
      try {
        await fetchReportes();
        fetchMateria();
        setCheckableTree(true);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData()
  }, []);

  useEffect(() => {
    if (reportes.length === 0 && materia?.programa) {
      fetchPrograma(materia?.programa?.clave);
    }
  }, [materia]);

  /**
   * Funcion para subir el reporte en PDF junto con la semana en la que se realizaron las actividades
   * 
   * @param {Blob} file Archivo PDF en binario que se va a subir
   * @param {String} week Semana en la que se va a subir el reporte
   * @returns
   */
  const uploadFile = async (file, week) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      type: "application/pdf",
      name: file.name,
    });
    formData.append("semana", week);
    formData.append("materia", materiaNrc);    

    const url = `${process.env.EXPO_PUBLIC_API_URL}/reportes/upload`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        fetchReportes();
      } else {
        console.error("Failed to upload file", result);
      }

      return response;
    } catch (error) {
      console.error("Error uploading file", error);
      return error;
    }
  };

  /**
   * Funcion para abrir el selector de archivos y proceder con la subida de archivos una vez que se seleccione el PDF.
   * 
   * @param {String} week Semana en la que se va a subir el archivo
   */
  const selectFile = async (week) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (!result.canceled) {
        const resultPdf = await uploadFile(result.assets[0], week);
        if (resultPdf?.ok) {
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: "PDF subido con éxito",
            textBody: `El reporte de la semana ${week} se ha subido con éxito!`,
          });
          fetchReportes()
        }
      }
    } catch (err) {
      console.error("Error selecting file", err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
    <View style={{ ...style.general.overlay_top, flex: 1 }}>
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

            <View
              style={{ position: "relative", flexDirection: "row", top: 20 }}
            >
              <SelectDropdown
                data={reportes}
                renderButton={(selectedItem, isOpen) => {
                  return (
                    <View
                      style={{
                        minHeight: 50,
                        backgroundColor: theme.colors.secondary,
                        borderRadius: 10,
                        justifyContent: "center",
                        alignItems: "flex-start",
                        elevation: 5,
                        width: "65%",
                      }}
                    >
                      <Text style={{ fontSize: 18, paddingHorizontal: 15 }}>
                        {newWeek
                          ? `Semana ${newWeek}`
                          : selectedItem?.semana
                          ? `Semana ${selectedItem?.semana}`
                          : "Selecciona una semana"}
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
                    <Text>Semana {item?.semana}</Text>
                  </View>
                )}
                search
                onSelect={(selectedItem) => {
                  setUids(JSON.parse(selectedItem.temas));
                  setSelectedReport(selectedItem);
                  setDescription(selectedItem?.descripcion);
                }}
                ref={selectWeek}
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
              <Pressable
                style={{
                  height: 35,
                  width: 35,
                  backgroundColor: theme.colors.tertiary_op,
                  borderRadius: 10,
                  elevation: 5,
                  marginVertical: "auto",
                  marginLeft: 15,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  newReport ? setNewWeek() : setNewWeek(reportes.length + 1);
                  setNewReport(!newReport);
                  if(reportes.length > 0){
                    setUids(JSON.parse(reportes[reportes.length - 1]?.temas))
                  }
                  setSelectedReport();
                  selectWeek.current.reset();
                }}
              >
                <Icon
                  name={newReport ? "ban" : "plus"}
                  size={20}
                  color={"black"}
                />
              </Pressable>
            </View>
          </View>
        )}
      </View>
      <View style={{ padding: 20, paddingVertical: 30, width: "100%", flex: 1 }}>
        {/* Sección para mostrar los temas que corresponden a la materia */}
        <View style={styles.container}>
          <ScrollView style={{ maxHeight: 220 }}>{reportes && renderTree(reportes[reportes?.length - 1])}</ScrollView> 
        </View>
        <View style={{
          flex: 1,
          padding: 20,
          justifyContent: 'flex-start',
        }}>
          <TextInput
            multiline
            style={{
              height: 100,
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              textAlignVertical: 'top',
            }}
            onChangeText={(text) => setDescription(text)}
            readOnly={!newReport}
            value={description}
            placeholder="Escribe aquí..."
          />
        </View>
        {selectedReport ? (
          selectedReport.pdf_uid === "" ?
          <Button
            mode="elevated"
            style={{
              backgroundColor: theme.colors.tertiary_op,
            }}
            onPress={() => selectFile(selectedReport.semana)}
          >
            <Text>Crear PDF </Text>
            <Icon name="file" color={"black"} size={19} />
          </Button>
          : 
          <Button
            mode="elevated"
            style={{
              backgroundColor: theme.colors.tertiary_op,
            }}
            onPress={() => openPDF(`https://docs.google.com/gview?embedded=true&url=${process.env.EXPO_PUBLIC_STORAGE_URL}/pdfs/${selectedReport.pdf_uid}`)}
          >
            <Text>Ver PDF </Text>
            <Icon name="file" color={"black"} size={19} />
          </Button>
        ) : (
          newReport && (
            <Button
              mode="elevated"
              style={{
                backgroundColor: theme.colors.tertiary_op,
              }}
              onPress={() => updateTemas()}
            >
              <Text>Guardar</Text>
            </Button>
          )
        )}
      </View>

      {loading && (
        <View style={style.general.overlay_loader}>
          <ActivityIndicator size={"large"} color={"#4DBFE4"} />
        </View>
      )}
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: theme.colors.secondary_op,
    borderRadius: 10,
    width: "95%",
    marginHorizontal: "auto",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default CheckboxTree;
