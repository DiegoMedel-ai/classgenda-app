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

const ListProgramas = ({ route, navigation }) => {
  const currDay = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState(
    currDay === 0 || currDay === 6 ? 0 : currDay - 1
  );
  const [loading, setLoading] = useState(false);
  const [programas, setProgramas] = useState([]);
  const [selectedId, setSelectedId] = useState(0);
  const [inscripcionesShow, setInscripcionesShow] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const onRefresh = useCallback(() => {
    setRefresh(true);
    try {
      fetchProgramas();
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
              {item.nombre}
            </Text>
            <View
              style={{
                justifyContent: "space-evenly",
                alignContent: "center",
                flexDirection: "row",
                paddingTop: 15,
              }}
            >
              <Text style={{ fontSize: isSelected ? 16 : 16 }}>
                Clave: {item.clave}
              </Text>
            </View>
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
                onPressIn={() => navigation.navigate("ListMaterias", { programaClave: item.clave })}
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
    const isSelected = item.clave === selectedId;

    const backgroundColor = isSelected
      ? theme.colors.secondary
      : theme.colors.secondary_op;
    const width = isSelected ? "95%" : "90%";

    return (
      <>
        <Item
          item={item}
          onPress={() => setSelectedId(item.clave)}
          isSelected={isSelected}
          backgroundColor={backgroundColor}
          width={width}
        />
      </>
    );
  };

  const fetchProgramas = () => {
    setLoading(true);

    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    };

    fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/programas`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        setProgramas(data);
      })
      .catch((error) => {
        console.log(
          `Fetch error to: ${process.env.EXPO_PUBLIC_API_URL}/programas`,
          error
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProgramas();
  }, []);

  return (
    <View style={{ ...styles.general.overlay, justifyContent: "top", position: "relative" }}>
      <View
        style={{
          backgroundColor: theme.colors.primary_op,
          height: 220,
          width: "100%",
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          elevation: 5,
          position: 'absolute'
        }}
      >
      </View>
        <Text
          style={{
            paddingHorizontal: 25,
            paddingTop: 50,
            fontSize: 25,
            textTransform: "capitalize",
          }}
        >
          Materias
        </Text>
      <View style={{ ...styles.horario.container, width: "100%" }}>
        {Array.isArray(programas) && programas.length > 0 && (
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
            }
            data={programas}
            renderItem={renderItem}
            keyExtractor={(item) => item.clave.toString()}
            extraData={selectedId}
            style={{ maxHeight: "85%" }}
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

export default ListProgramas;
