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
  Alert
} from "react-native";
import { getDateFormat24 } from "@/hooks/date";
import Icon from "react-native-vector-icons/Feather";
import IconF6 from "react-native-vector-icons/FontAwesome6";
import { styles } from "@/constants/styles";

const Horario = ({ userId }) => {
  const [inscripciones, setInscripciones] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [filteredMaterias, setFilteredMaterias] = useState([])
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [visibleModal, setVisibleModal] = useState(false);
  const [nrcAdd, setNrcAdd] = useState(0)
  const [flagFirstFetch, setFlagFirstFetch] = useState(true)
  const select = useRef();

  const Item = ({ item, onPress, backgroundColor, width, isSelected }) => (
    <View style={{ ...styles.general.center, width: "100%" }}>
      <Pressable
        onPress={onPress}
        style={[stylesLocal.touchable, { backgroundColor, width }]}
      >
        <Text
          style={{
            width: "100%",
            textAlign: "center",
            fontSize: isSelected ? 20 : 17,
          }}
        >
          {item.materia.programa.nombre}
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
              : `${getDateFormat24(
                  item.materia.hora_inicio
                )} - ${getDateFormat24(item.materia.hora_final)}`}
          </Text>
          <Text style={{ fontSize: isSelected ? 15 : 13 }}>
            {JSON.parse(item.materia.dias_clase)
              .map((item) => item.slice(0, 2))
              .join(" - ")}
          </Text>
          <Text style={{ fontSize: isSelected ? 15 : 13 }}>
            Aula: {item.materia.edificio}-{item.materia.aula.toString()}
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
              Prof: {item.materia.profesor?.nombre}{" "}
              {item.materia.profesor?.apellido}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );

  const renderItem = ({ item, index }) => {
    const backgroundColor =
      item.id === selectedId
        ? theme.colors.secondary
        : theme.colors.secondary_op;
    const width = item.id === selectedId ? "95%" : "90%";

    return (
      <>
        {index !== inscripciones.length ? (
          <Item
            item={item}
            onPress={() => setSelectedId(item.id)}
            isSelected={item.id === selectedId}
            backgroundColor={backgroundColor}
            width={width}
          />
        ) : (
          <View style={{ ...styles.general.center, width: "100%" }}>
            <Pressable
              style={[
                stylesLocal.touchable,
                styles.general.center,
                {
                  backgroundColor: theme.colors.secondary_op,
                  width: "90%",
                  borderWidth: 1,
                  borderStyle: "dashed",
                },
              ]}
              onPress={() => setVisibleModal(true)}
            >
              <Icon
                name="plus"
                size={30}
                color={"black"}
                style={{ paddingVertical: 10, fontWeight: "bold" }}
              />
            </Pressable>
          </View>
        )}
      </>
    );
  };
  
  const filterMaterias = () => {
    const data = [...materias]
    
    const materiasFiltradas = data.filter(
      (materia) =>
        !inscripciones.some(
          (inscripcion) => inscripcion.materia.nrc === materia.nrc
        )
      );
      select.current?.reset()

    setFilteredMaterias(materiasFiltradas);
  }

  const deleteInscripcion = () => {
    setLoading(true);

    try {
      const options = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      };

      fetch(`${process.env.EXPO_PUBLIC_API_URL}/inscripciones/delete/${selectedId}`, options)
        .then((response) => {
          if(response.status === 200){
            Alert.alert('Inscripcion borrada', 'Se ha borrado la inscripcion correctamente', [
              {
                'text': 'Ok',
                'style': 'cancel'
              }
            ])
          }else {
            Alert.alert('Error', 'Error al borrar la inscripcion', [
              {
                'text': 'Ok',
                'style': 'cancel'
              }
            ])
          }
        })
        .then(() => fetchInscripciones())
        .catch((error) => {
          console.log(
            `Fetch error to: ${process.env.EXPO_PUBLIC_API_URL}/inscripciones/delete/${selectedId}`,
            error
          );
        });
    } catch (error) {}
  }

  const addInscripcion = () => {    
    setLoading(true);

    try {
      const options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({ usuario: userId, materia: nrcAdd })
      };

      fetch(`${process.env.EXPO_PUBLIC_API_URL}/inscripciones/new`, options)
        .then((response) => {
          if(response.status === 200){
            select.current.reset();
            setNrcAdd(0);
            setVisibleModal(false);
            Alert.alert('Inscripcion añadida', 'Se ha inscrito correctamente', [
              {
                'text': 'Ok',
                'style': 'cancel'
              }
            ])
          }else {
            Alert.alert('Error', 'Ha ocurrido un error al inscribirse', [
              {
                'text': 'Ok',
                'style': 'cancel'
              }
            ])
          }
        })
        .then(() => fetchInscripciones())
        .catch((error) => {
          console.log(
            `Fetch error to: ${process.env.EXPO_PUBLIC_API_URL}/inscripciones/new`,
            error
          );
        });
    } catch (error) {}
  }

  useEffect(() => {
    fetchInscripciones();
  }, []);
  
  useEffect(() => {
    if (!flagFirstFetch) {
      filterMaterias();
    } else {
      setFlagFirstFetch(false);
    }
  }, [materias]);
  
  useEffect(() => {
    if (materias.length > 0) {
      filterMaterias();
    }
  }, [inscripciones]);
  
  const fetchMaterias = () => {
    setLoading(true);
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    };
  
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/materias`, options)
      .then((response) => response.json())
      .then((data) => {
        setMaterias(data);
      })
      .catch((error) => {
        console.log(`Fetch error to: ${process.env.EXPO_PUBLIC_API_URL}/materias`, error);
      })
      .finally(() => setLoading(false));
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
  
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/inscripciones/${userId}`, options)
      .then((response) => response.json())
      .then((data) => {
        setInscripciones(data);
      })
      .catch((error) => {
        console.log(`Fetch error to: ${process.env.EXPO_PUBLIC_API_URL}/inscripciones/${userId}`, error);
      })
      .finally(() => {
        setLoading(false); 
        if (materias.length === 0) {
          fetchMaterias();
        }
      });
  };

  return (
    <View style={stylesLocal.container}>
      {Array.isArray(inscripciones) && inscripciones[0]?.id !== 0 && (
        <FlatList
          data={[...inscripciones, { id: -1 }]}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          extraData={selectedId}
          style={{ maxHeight: "80%" }}
        />
      )}
      <View style={{ ...styles.general.center, width: "100%" }}>
        <Button
          mode="elevated"
          style={{
            width: 110,
            marginBottom: 20,
            backgroundColor: theme.colors.tertiary_op,
            elevation: 5,
          }}
          disabled={selectedId === 0}
          onPress={deleteInscripcion}
        >
          <Text>Eliminar</Text>
        </Button>
      </View>

      {loading && (
        <View style={styles.general.overlay_loader}>
          <ActivityIndicator size={"large"} color={"#4DBFE4"} />
        </View>
      )}

      <Portal>
        <Modal
          visible={visibleModal}
          onDismiss={() => setVisibleModal(false)}
          contentContainerStyle={{
            backgroundColor: "white",
            paddingHorizontal: 30,
            paddingVertical: 20,
            width: "80%",
            margin: "auto",
            borderRadius: 10,
          }}
        >
          <Text>NRC a añadir:</Text>
          <SelectDropdown
            data={filteredMaterias}
            ref={select}
            renderButton={(selectedItem, isOpen) => {
              return (
                <View
                  style={{
                    ...styles.general.button_select,
                    paddingVertical: 10,
                    width: "100%",
                    marginTop: 20,
                    borderWidth: 1,
                  }}
                >
                  <Text>
                    {(selectedItem &&
                      `NRC: ${selectedItem.nrc} - ${selectedItem.programa.nombre}`) ||
                      "Selecciona una materia"}
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
                  borderBottomWidth: 0.5,
                  justifyContent: "center",
                  maxWidth: "100%",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  NRC: {item.nrc} - {item.programa.nombre}
                  {"\n"}
                  {getDateFormat24(item.hora_inicio)} -{" "}
                  {getDateFormat24(item.hora_final)}
                  {"\n"}Prof: {item.profesor?.nombre} {item.profesor?.apellido}
                </Text>
              </View>
            )}
            onSelect={(item) => setNrcAdd(item.nrc)}
            search
            dropdownStyle={{ borderRadius: 10, width: 250 }}
            searchInputTxtColor={"black"}
            searchPlaceHolder={"Search here"}
            searchPlaceHolderColor={"grey"}
            renderSearchInputLeftIcon={() => {
              return (
                <IconF6 name={"magnifying-glass"} color={"black"} size={18} />
              );
            }}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
          <Button mode="elevated" style={{backgroundColor: theme.colors.tertiary}} onPress={addInscripcion} disabled={loading}>
            <Text>
              Confirmar
            </Text>
          </Button>
          <Button mode="elevated" style={{backgroundColor: theme.colors.secondary}} onPress={() => setVisibleModal(false)}>
            <Text>
              Cancelar
            </Text>
          </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const stylesLocal = StyleSheet.create({
  touchable: {
    width: "90%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 10,
  },
  container: {
    paddingTop: 20,
    height: "100%",
  },
  card: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  }
});

export default function HorarioAlumnosAdmin({ route, navigation }) {
    const { alumnoId } = route.params;

    useEffect(() => {
      if(alumnoId === 0) {
        navigation.navigate("AlumnoHome")
      }
    }, [])
    
    return(
      <View style={{flexDirection: 'column', height: '100%'}}>
        <Horario userId={alumnoId}/>
      </View>
    )
}