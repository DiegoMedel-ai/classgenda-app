import React, { useEffect, useState } from "react";
import { styles } from "@/constants/styles";
import theme from "@/constants/theme";
import { Text } from "react-native-paper";
import { View, ActivityIndicator, ScrollView, TextInput } from "react-native";
import { getTemaData } from "../../hooks/uids";

export default function ProgramaDetails({ route }) {
  const { materiaNrc, programaClave } = route.params;
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState();
  const [editable, setEditable] = useState(false);
  const [update, setUpdate] = useState(true);

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
          setUids(JSON.parse(data?.temas))
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

  useEffect(() => {
    fetchPrograma();
  }, []);

  /**
   * Section to render tree of subjects
   */
  const [uids, setUids] = useState([]);

  /**
   * Function to sort the tree of uids by the number of subject
   * @param {String} a
   * @param {String} b
   * @returns String[]
   */
  const sortTree = (a, b) => {
    const matchA = getTemaData(a);
    const matchB = getTemaData(b);

    if (matchA && matchB) {
      const numA = matchA[1].split(".").map(Number);
      const numB = matchB[1].split(".").map(Number);

      for (let i = 0; i < Math.max(numA.length, numB.length); i++) {
        const valA = numA[i] || 0;
        const valB = numB[i] || 0;

        if (valA !== valB) {
          return valA - valB;
        }
      }
    }
    return 0;
  };

  /**
   * Function to render the array of uids
   * @returns View to render the uids
   */
  const renderTree = () => {
    return uids.sort(sortTree).map((uid) => {
      const _paddingLeft = getTemaData(uid)[1].split(".").length * 15;
      return (
        <View key={uid} style={{ paddingLeft: _paddingLeft }}>
          <View style={styles.programas.checkboxRow}>
            <Text
              style={{ ...(!editable && { marginBottom: 15 }), fontSize: 15 }}
            >
              {getTemaData(uid)[1]}. {getTemaData(uid)[2]} -{" "}
              {getTemaData(uid)[4]} h
            </Text>
          </View>
        </View>
      );
    });
  };

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
          <View style={{...styles.programas.container, marginBottom: 20}}>
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
