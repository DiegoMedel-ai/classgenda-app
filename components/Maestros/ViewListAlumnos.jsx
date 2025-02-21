import React, { useEffect, useState } from "react";
import { styles } from "@/constants/styles";
import theme from "@/constants/theme";
import { Text } from "react-native-paper";
import {
  View,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Image,
} from "react-native";

export default function ViewListAlumnos({ route }) {
  const { materiaNrc } = route.params;
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState();

  const fetchAlumnos = () => {
    setLoading(true);

    try {
      const options = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      };

      const url = `${process.env.EXPO_PUBLIC_API_URL}/inscripciones/users/${materiaNrc}`;
      fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          setValues(data);
        })
        .then(() => setLoading(false))
        .catch((error) => {
          console.log(
            `Fetch error to: ${process.env.EXPO_PUBLIC_API_URL}/inscripciones/users`,
            error
          );
        });
    } catch (error) {}
  };

  useEffect(() => {
    fetchAlumnos();
  }, []);

  return (
    <View style={{ flex: 1, position: "relative" }}>
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
          marginBottom: 20,
          position: "absolute",
          zIndex: -1,
        }}
      >
        <Text style={{ width: "100%", textAlign: "center", fontSize: 24 }}>
          Alumnos inscritos
        </Text>
      </View>
      {values && (
        <View style={{
            flex: 1,
            paddingTop: '20%',
            paddingBottom: '10%',
            paddingHorizontal: 20,
        }}>
        <ScrollView
          contentContainerStyle={{
            elevation: 5,
            marginBottom: '10%',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 15,
            alignItems: 'center',
            width: '90%',
            marginHorizontal: 'auto',
            backgroundColor: theme.colors.secondary_op
          }}
        >
            {values.length === 0 &&
            <Text>Todavia no hay alumnos inscritos</Text>
            }
          {values.map((inscripcion, index) => (
            <View
              key={index}
              style={{
                width: "100%",
                height: 60,
                backgroundColor: "white",
                marginVertical: 10,
                borderRadius: 15,
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              <Image
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 50,
                  marginRight: 10,
                  marginVertical: 20
                }}
                source={
                  inscripcion.usuario.foto_url
                    ? {
                        uri: `${process.env.EXPO_PUBLIC_STORAGE_IMAGE_URL}/img/${inscripcion.usuario.foto_url}`,
                      }
                    : require("@/assets/images/user.png")
                }
              />
              <Text style={{height: 60, verticalAlign: 'middle'}}>
                Codigo: {inscripcion.usuario.codigo} {'\n'} {inscripcion.usuario.nombre} {inscripcion.usuario.apellido}
              </Text>
            </View>
          ))}
        </ScrollView>
        </View>
      )}
      {loading && (
        <View style={styles.general.overlay_loader}>
          <ActivityIndicator size={"large"} color={"#4DBFE4"} />
        </View>
      )}
    </View>
  );
}
