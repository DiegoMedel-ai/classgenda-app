import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  Pressable,
  ActivityIndicator,
  FlatList,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Text } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome6";
import { getDateFormat24, isTimeBetween, getWeekDay } from "@/hooks/date";
import { styles } from "@/constants/styles";
import theme from "@/constants/theme";

const HorarioAlumno = ({ route, navigation }) => {
  const currDay = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState(
    currDay === 0 || currDay === 6 ? 0 : currDay - 1
  );
  const [loading, setLoading] = useState(false);
  const [inscripciones, setInscripciones] = useState([]);
  const [selectedId, setSelectedId] = useState(0);
  const [inscripcionesShow, setInscripcionesShow] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { userId } = route.params;
  
  const days = [
    {
      label: "Lu",
    },
    {
      label: "Ma",
    },
    {
      label: "Mi",
    },
    {
      label: "Ju",
    },
    {
      label: "Vi",
    },
  ];

  const onRefresh = useCallback(() => {
    setRefresh(true);
    try {
      fetchInscripciones();
    } catch (error) {
      console.log(error);
    } finally {
      setRefresh(false);
    }
  }, []);

  const Item = ({ item, onPress, backgroundColor, width, isSelected }) => (
    <View style={{ ...styles.general.center, width: "100%" }}>
      <Pressable
        onPress={onPress}
        style={[styles.horario.touchable, { backgroundColor, width }]}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: isSelected ? "85%" : "100%" }}>
            <Text
              style={{
                width: "100%",
                textAlign: "center",
                fontSize: isSelected ? 20 : 17,
              }}
            >
              {item.materia.programa?.nombre}
            </Text>
            <View
              style={{
                justifyContent: "space-evenly",
                alignContent: "center",
                flexDirection: "row",
                paddingTop: 15,
              }}
            >
              <Text style={{ fontSize: isSelected ? 15 : 13 }}>
                {isSelected
                  ? `NRC: ${item.materia.nrc}`
                  : `${getDateFormat24(item.materia.hora_inicio)} - ${getDateFormat24(
                      item.materia.hora_final
                    )}`}
              </Text>
            </View>
            {isSelected && (
              <View
                style={{
                  justifyContent: "space-evenly",
                  alignContent: "center",
                  flexDirection: "row",
                  paddingTop: 15,
                  width: "100%",
                  marginHorizontal: "auto",
                }}
              >
                <Text style={{ fontSize: isSelected ? 13 : 10 }}>
                  Clave: {item.materia.programa.clave}
                </Text>
                <Text style={{ fontSize: isSelected ? 13 : 10 }}>
                  {getDateFormat24(item.materia.hora_inicio)} -{" "}
                  {getDateFormat24(item.materia.hora_final)}
                </Text>
                <Text style={{ fontSize: isSelected ? 13 : 10 }}>
                  Aula: {item.materia.edificio}-{item.materia.aula.toString()}
                </Text>
              </View>
            )}
          </View>
          {isSelected && (
            <View style={{ ...styles.general.center, width: "15%" }}>
              <Pressable
                style={{
                  ...styles.general.center,
                  elevation: 5,
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  backgroundColor: theme.colors.tertiary_op,
                }}
                onPressIn={() => navigation.navigate("OptionsPrograma", { maestroId: item.materia.profesor?.id, programaClave: item.materia.programa?.clave })}
              >
                <Icon name="list" color={"black"} size={20} />
              </Pressable>
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );

  const renderItem = ({ item, index }) => {
    const isSelected = item.materia.nrc === selectedId;
    const currentSubject =
      currDay === selectedDay + 1 &&
      isTimeBetween(item.materia.hora_inicio, item.materia.hora_final);

    const backgroundColor = currentSubject
      ? isSelected
        ? "#7AEC7A"
        : "#A0E9A0"
      : isSelected
      ? theme.colors.secondary
      : theme.colors.secondary_op;
    const width = isSelected ? "95%" : "90%";

    return (
      <>
        <Item
          item={item}
          onPress={() => setSelectedId(item.materia.nrc)}
          isSelected={isSelected}
          backgroundColor={backgroundColor}
          width={width}
        />
      </>
    );
  };

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
      `${process.env.EXPO_PUBLIC_API_URL}/inscripciones/${userId}`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        setInscripciones(data);
      })
      .catch((error) => {
        console.log(
          `Fetch error to: ${process.env.EXPO_PUBLIC_API_URL}/inscripciones/${userId}`,
          error
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInscripciones();
  }, []);

  useEffect(() => {
    setInscripcionesShow(
      inscripciones.filter((item) =>
        item.materia.dias_clase.includes(days[selectedDay].label)
      )
    );
  }, [inscripciones, selectedDay]);

  return (
    <View style={{ ...styles.general.overlay, justifyContent: "top" }}>
      <View
        style={{
          backgroundColor: theme.colors.primary,
          height: "auto",
          width: "100%",
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          elevation: 5,
        }}
      >
        <Text
          style={{
            paddingBottom: 30,
            paddingHorizontal: 25,
            paddingTop: 10,
            fontSize: 23,
            textTransform: "capitalize",
          }}
        >
          {new Date()
            .toLocaleDateString("es-ES", { year: "numeric", month: "short" })
            .replace(" ", ", ")}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            paddingBottom: 45,
          }}
        >
          {days.map((item, index) => {
            const selected = index === selectedDay;
            return (
              <Pressable
                style={{
                  ...styles.general.center,
                  height: selected ? 60 : 50,
                  width: selected ? 60 : 50,
                  backgroundColor: selected
                    ? theme.colors.tertiary
                    : theme.colors.tertiary_op,
                  padding: 10,
                  borderRadius: 10,
                  elevation: 5,
                }}
                key={index}
                onPressIn={() => setSelectedDay(index)}
              >
                <Text style={{ fontSize: selected ? 18 : 13 }}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={{ ...styles.horario.container, width: "100%" }}>
        <Text style={{ paddingBottom: 10, fontSize: 23, marginLeft: 25 }}>
          Horario
        </Text>
        {Array.isArray(inscripcionesShow) && inscripcionesShow.length > 0 && (
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
            }
            data={inscripcionesShow}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            extraData={selectedId}
            style={{ maxHeight: "100%" }}
          />
        )}
      </View>
      {loading && (
        <View style={styles.general.overlay_loader}>
          <ActivityIndicator size={"large"} color={"#4DBFE4"} />
        </View>
      )}
    </View>
  );
};

export default HorarioAlumno;
