import React, { useEffect, useState } from "react";
import { styles } from "@/constants/styles";
import theme from "@/constants/theme";
import {
  Text,
} from "react-native-paper";
import {
  View,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Image,
} from "react-native";

export default function ProfesorDetails({ route }) {
  const { maestroId } = route.params;
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState();
  const [editable, setEditable] = useState(false);
  const [update, setUpdate] = useState(true);

  const fetchMaestro = () => {
    setLoading(true);

    try {
      const options = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      };

      const url = `${process.env.EXPO_PUBLIC_API_URL}/users/getProfesor/${maestroId}`;
      fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          setValues(data);
        })
        .then(() => setLoading(false))
        .catch((error) => {
          console.log(
            `Fetch error to: ${process.env.EXPO_PUBLIC_API_URL}/users/getProfesor/${maestroId}`,
            error
          );
        });
    } catch (error) {}
  };

  useEffect(() => {
    fetchMaestro();
  }, []);

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {values && (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}
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
              position: 'absolute'
            }}
          ></View>
        <Text style={{width: '100%', textAlign: 'center', paddingBottom: 20, paddingTop: 60, fontSize: 24}}>
            Info del profesor
        </Text>
        
        <Image
                style={{
                  height: 180,
                  width: 180,
                  borderRadius: 50,
                  marginHorizontal: 'auto'
                }}
                source={
                  values.foto_url
                    ? {
                        uri: `${process.env.EXPO_PUBLIC_STORAGE_IMAGE_URL}/img/${values.foto_url}`,
                      }
                    : require("@/assets/images/user.png")
                }
              />
          <View style={{ ...styles.general.center, width: "100%" }}>
            <View
              style={{
                ...styles.programas.cards_show,
                backgroundColor: theme.colors.primary,
                marginTop: 10,
              }}
            >
              <Text>Nombres</Text>
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
                backgroundColor: theme.colors.primary,
                marginTop: 20,
              }}
            >
              <Text>Apellidos</Text>
              <TextInput
                style={{ ...styles.general.button_input }}
                editable={editable || !update}
                value={values?.apellido}
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
                width: "45%",
              }}
            >
              <Text>Código</Text>
              <TextInput
                style={{ ...styles.general.button_input }}
                editable={false}
                value={values?.id.toString()}
              />
            </View>
            <View
              style={{
                ...styles.programas.cards_show,
                backgroundColor: theme.colors.primary,
                marginTop: 10,
                width: "45%",
              }}
            >
              <Text>Número de contacto</Text>
              <TextInput
                style={{ ...styles.general.button_input }}
                editable={editable || !update}
                value={values?.telefono}
                multiline
              />
            </View>
          </View>
          <View style={{ ...styles.general.center, width: "100%" }}>
            <View
              style={{
                ...styles.programas.cards_show,
                backgroundColor: theme.colors.primary,
                marginTop: 20,
              }}
            >
              <Text>Correo institucional</Text>
              <TextInput
                style={{ ...styles.general.button_input }}
                editable={editable || !update}
                value={values?.correo}
              />
            </View>
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
