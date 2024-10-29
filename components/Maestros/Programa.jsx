import React, { useEffect, useRef, useState } from "react";
import { styles } from "@/constants/styles";
import theme from "@/constants/theme";
import { Text } from "react-native-paper";
import { View, ActivityIndicator, ScrollView, TextInput } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/FontAwesome6";
import { Formik } from "formik";
import useUids from "../../hooks/uids";

export default function ProgramaDetails({ route }) {
  const { materiaNrc, programaClave } = route.params;
  const selectDepartamento = useRef();
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState();
  const [editable, setEditable] = useState(false);
  const [update, setUpdate] = useState(true);

  // Estados para los temas
  const { uids, setUids, renderTree } = useUids();

  const fetchPrograma = () => {
    setLoading(true);

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
          setUids(JSON.parse(data?.temas));
          setValues(data);
        })
        .then(() => setLoading(false))
        .catch((error) => {
          console.log(
            `Fetch error to: ${process.env.EXPO_PUBLIC_API_URL}/programas`,
            error
          );
        });
    } catch (error) {}
  };

  /**
   * Obtiene todos los departamentos desde el servidor y actualiza los `departamentos`.
   */
  const fetchDepartamentos = () => {
    try {
      const options = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      };

      fetch(`${process.env.EXPO_PUBLIC_API_URL}/departamentos`, options)
        .then((response) => response.json())
        .then((data) => {
          setDepartamentos(data);
        })
        .finally(() => {
          setLoading(false);
        })
        .catch((error) => {
          console.log(
            `Error en la solicitud a: ${process.env.EXPO_PUBLIC_API_URL}/departamentos`,
            error
          );
          setLoading(false);
        });
    } catch (error) {
      console.log("Error al intentar obtener los departamentos", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograma();
    fetchDepartamentos();
  }, []);

  // Hook para actualizar las selecciones cuando cambia `values`
  useEffect(() => {
    try {
      selectDepartamento.current?.selectIndex(
        departamentos.findIndex((x) => x.id === values?.departamento) + 1
      );
    } catch (error) {
      console.log(error);
    }
  }, [departamentos, values]);

  return (
    <View style={{ flex: 1, position: "relative" }}>
      {values && (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start" }}
        >
          <View
            style={{
              height: 220,
              width: "100%",
              backgroundColor: theme.colors.tertiary_op,
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 40,
              flexDirection: "row",
              elevation: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
              marginBottom: 20,
              position: "absolute",
            }}
          ></View>
          <Text
            style={{
              width: "100%",
              textAlign: "center",
              paddingVertical: 20,
              fontSize: 24,
            }}
          >
            Programa
          </Text>
          <View style={{ ...styles.general.center, width: "100%" }}>
            <View
              style={{
                ...styles.programas.cards_show,
                backgroundColor: theme.colors.secondary,
                marginTop: 10,
              }}
            >
              <Text>Nombre de la unidad de aprendizaje</Text>
              <TextInput
                style={{ ...styles.general.button_input }}
                editable={editable || !update}
                value={values?.nombre}
              />
            </View>
          </View>

          <View style={{ ...styles.general.center, width: "100%" }}>
            <View
              style={{
                ...styles.programas.cards_show,
                backgroundColor: theme.colors.secondary,
                marginTop: 20,
              }}
            >
              <Text>Departamento del programa</Text>
              <SelectDropdown
                data={[{ clave: null, nombre: "Ninguno" }, ...departamentos]}
                disabled
                ref={selectDepartamento}
                renderButton={(selectedItem, isOpen) => {
                  return (
                    <View
                      style={{
                        ...styles.general.button_select,
                        width: "90%",
                      }}
                    >
                      <Text>
                        {(selectedItem && `${selectedItem.departamento}`) ||
                          "Ninguno"}
                      </Text>
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => (
                  <View
                    style={{
                      ...styles.general.center,
                      ...(isSelected && {
                        backgroundColor: theme.colors.tertiary_op,
                      }),
                      paddingVertical: 10,
                    }}
                  >
                    <Text>{item.departamento}</Text>
                  </View>
                )}
                search
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
          </View>

          <View
            style={{
              ...styles.general.center,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginTop: 10,
            }}
          >
            <View
              style={{
                ...styles.programas.cards_show,
                backgroundColor: theme.colors.primary,
                marginTop: 10,
                width: "30%",
              }}
            >
              <Text>Clave UA</Text>
              <TextInput
                style={{ ...styles.general.button_input }}
                editable={false}
                value={values?.clave?.toString()}
              />
            </View>
            <View
              style={{
                ...styles.programas.cards_show,
                backgroundColor: theme.colors.primary,
                marginTop: 10,
                width: "30%",
              }}
            >
              <Text>Tipo de UA</Text>
              <TextInput
                style={{ ...styles.general.button_input }}
                editable={editable || !update}
                value={values?.tipo}
                multiline
                numberOfLines={2}
              />
            </View>
            <View
              style={{
                ...styles.programas.cards_show,
                backgroundColor: theme.colors.primary,
                marginTop: 10,
                width: "30%",
              }}
            >
              <Text>Creditos</Text>
              <TextInput
                style={{ ...styles.general.button_input }}
                editable={editable || !update}
                value={values?.creditos?.toString()}
                keyboardType="numeric"
              />
            </View>
          </View>
          <View
            style={{
              ...styles.general.center,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginTop: 10,
            }}
          >
            <View
              style={{
                ...styles.programas.cards_show,
                backgroundColor: theme.colors.primary,
                marginTop: 10,
                width: "42%",
              }}
            >
              <Text>UA de pre-requisito</Text>
              <TextInput
                style={{ ...styles.general.button_input }}
                editable={editable || !update}
                value={values?.requisito_programa?.nombre}
                multiline
              />
            </View>
            <View
              style={{
                ...styles.programas.cards_show,
                backgroundColor: theme.colors.primary,
                marginTop: 10,
                width: "42%",
              }}
            >
              <Text>UA en simultaneo</Text>
              <TextInput
                style={{ ...styles.general.button_input }}
                editable={editable || !update}
                value={values?.simultaneo_programa?.nombre}
                multiline
              />
            </View>
          </View>
          <View
            style={{
              ...styles.general.center,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <View
              style={{
                ...styles.programas.cards_show,
                backgroundColor: theme.colors.primary,
                width: "40%",
              }}
            >
              <Text>Horas de practica</Text>
              <TextInput
                style={{ ...styles.general.button_input }}
                editable={editable || !update}
                keyboardType="numeric"
                value={values?.horas_practica?.toString()}
              />
            </View>
            <View
              style={{
                ...styles.programas.cards_show,
                backgroundColor: theme.colors.primary,
                width: "40%",
              }}
            >
              <Text>Horas de curso</Text>
              <TextInput
                style={{ ...styles.general.button_input }}
                editable={editable || !update}
                keyboardType="numeric"
                value={values?.horas_curso?.toString()}
              />
            </View>
          </View>
          <View
            style={{
              ...styles.general.center,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <View
              style={{
                ...styles.programas.cards_show,
                backgroundColor: theme.colors.secondary,
                width: "90%",
              }}
            >
              <Text>Descripcion de la asignatura</Text>
              <TextInput
                style={{
                  ...styles.general.button_input,
                  textAlignVertical: "top",
                  textAlign: "left",
                  padding: 10,
                }}
                editable={editable || !update}
                multiline
                numberOfLines={8}
                value={values?.descripcion}
              />
            </View>
          </View>
          <View
            style={{
              ...styles.general.center,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-evenly",
              paddingBottom: 20,
            }}
          >
            <View
              style={{
                ...styles.programas.cards_show,
                backgroundColor: theme.colors.secondary,
                width: "90%",
              }}
            >
              <Text>Perfil de egreso del alumno</Text>
              <TextInput
                style={{
                  ...styles.general.button_input,
                  textAlignVertical: "top",
                  textAlign: "left",
                  padding: 10,
                }}
                editable={editable || !update}
                multiline
                numberOfLines={8}
                value={values?.perfil_egreso}
              />
            </View>
          </View>
          <View style={{ ...styles.programas.container, marginBottom: 20 }}>
            <ScrollView style={{ maxHeight: "auto" }}>
              {renderTree(uids)}
            </ScrollView>
          </View>
        </ScrollView>
      )}
      {loading && (
        <View style={styles.general.overlay_loader}>
          <ActivityIndicator size={"large"} color={"#4DBFE4"} />
        </View>
      )}
    </View>
  );
}
