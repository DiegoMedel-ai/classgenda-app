import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
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

const CheckboxTree = ({ route, navigation }) => {
  const { materiaNrc } = route.params;
  const [visibleModal, setVisibleModal] = useState(false);
  const [subtitleToAdd, setSubtitleToAdd] = useState();
  const [newPathRef, setNewPathRef] = useState([]);
  const [nameToAdd, setNameToAdd] = useState("");
  const [typeOfSub, setTypeOfSub] = useState("tema");
  const [tree, setTree] = useState({});
  const [materia, setMateria] = useState()
  const [loading, setLoading] = useState(false)

  const handleCheckboxChange = (path) => {
    const updatedTree = { ...tree };
    let current = updatedTree;

    path.forEach((key, index) => {
      if (index === path.length - 1) {
        if (current[key]) {
          current[key].value = current[key].value === 1 ? 0 : 1;
        }
      } else {
        if (current[key] && current[key].subtemas) {
          current = current[key].subtemas;
        }
      }
    });

    setTree(updatedTree);
  };

  const handleAddSubtema = (path) => {
    const updatedTree = { ...tree };
    let current = updatedTree;

    path.forEach((key, index) => {
      if (index === path.length - 1) {
        const subtemaCount = Object.keys(current[key].subtemas).length + 1;
        const parentKey = key.split("_")[0];
        const newSubtema = `${parentKey}.${subtemaCount}_${nameToAdd}`;
        current[key].subtemas[newSubtema] = { value: 0, subtemas: {} };
      } else {
        if (!current[key]) {
          current[key] = { value: 0, subtemas: {} };
        }
        current = current[key].subtemas;
      }
    });

    setVisibleModal(false);
    setTree(updatedTree);
  };

  const getNewCount = (path) => {
    const updatedTree = { ...tree };
    let current = updatedTree;

    if (!path) {
      setSubtitleToAdd(Object.keys(current).length + 1);
      setVisibleModal(true);
    } else {
      path.forEach((key, index) => {
        if (index === path.length - 1) {
          const subtemaCount = Object.keys(current[key].subtemas).length + 1;
          const parentKey = key.split("_")[0];
          const newSubtema = `${parentKey}.${subtemaCount}`;
          setSubtitleToAdd(newSubtema);
          setNewPathRef(path);
          setVisibleModal(true);
        } else {
          if (!current[key]) {
            current[key] = { value: 0, subtemas: {} };
          }
          current = current[key].subtemas;
        }
      });
    }
  };

  const handleAddTema = () => {
    const updatedTree = { ...tree };
    let current = updatedTree;

    const temaCount = Object.keys(current).length + 1;
    current[`${temaCount}_${nameToAdd}`] = { value: 0, subtemas: {} };

    setVisibleModal(false);
    setTree(updatedTree);
  };

  const renderTree = (node, path = []) => {
    return Object.keys(node).map((key) => {
      const newPath = [...path, key];
      return (
        <View key={newPath.join("_")} style={{ paddingLeft: path.length * 20 }}>
          <View style={styles.checkboxRow}>
            <Checkbox
              color="green"
              status={node[key].value === 1 ? "checked" : "unchecked"}
              onPress={() => handleCheckboxChange(newPath)}
            />
            <Text style={{ fontSize: 15 }}>{key.replace(/_/g, ".")}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setTypeOfSub("sub");
              getNewCount(newPath);
            }}
            style={{ height: 30, paddingVertical: 0, justifyContent: "center" }}
          >
            <Text
              style={{
                fontSize: 11,
                width: "auto",
                paddingLeft: 40,
                color: theme.colors.tertiary,
              }}
            >
              + Añadir subtema
            </Text>
          </TouchableOpacity>
          {node[key].subtemas &&
            node[key].value === 0 &&
            renderTree(node[key].subtemas, newPath)}
        </View>
      );
    });
  };

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
          setTree(JSON.parse(data.temas))
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

  const updateTemas = () => {    
    setLoading(true);

    const data = {...materia}
    data.profesor = data.profesor.id
    data.programa = data.programa.clave

    try {
      const options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({...data, temas: JSON.stringify(tree)})
      };

      console.log(JSON.stringify({...data, temas: JSON.stringify(tree)}));
      

      const url = `${process.env.EXPO_PUBLIC_API_URL}/materias/update`;
      fetch(url, options)
        .then((response) => {
          if(response.status !== 200) {
            Alert.alert('Error', `Ocurrió un error inesperado`, [
              {
                "text": "Ok",
                "style": "cancel"
              }
            ])
          }
        })
        .then(() => setLoading(false))
        .catch((error) => {
          console.log(
            `Fetch error to: ${process.env.EXPO_PUBLIC_API_URL}/materias`,
            error
          );
        });
    } catch (error) {}
  }

  useEffect(() => {
    fetchMateria()
  }, [])

  const [firstFetch, setFirstFetch] = useState(true)
  
  useEffect(() => {
    if(materia){
      if(firstFetch){
        setFirstFetch(false);
      }else{
        updateTemas()
      }
    }
  }, [tree])
  

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
        {materia &&
        <View style={{justifyContent: 'top', alignItems: 'center', width: '100%'}}>
          <Text style={{width: 'auto', fontSize: 24, marginTop: 20}}>Reportar</Text>
          <Text style={{width: 'auto', fontSize: 20, marginTop: 20}}>{materia.programa.nombre}</Text>
          <Text style={{width: 'auto', fontSize: 16, marginTop: 25}}>NRC: {materia.nrc}</Text>
          <View style={{flexDirection: 'row', width: '70%', justifyContent: 'space-around'}}>
          <Text style={{width: 'auto', fontSize: 14, marginTop: 15}}>Clave: {materia.programa.clave}</Text>
          <Text style={{width: 'auto', fontSize: 14, marginTop: 15}}>{getDateFormat24(materia.hora_inicio)} - {getDateFormat24(materia.hora_final)}</Text>
          <Text style={{width: 'auto', fontSize: 14, marginTop: 15}}>Aula: {materia.edificio}-{materia.aula}</Text>

          </View>
        </View>
        }
      </View>
      <View style={{ padding: 20, paddingVertical: 30, width: "100%" }}>
        <View style={styles.container}>
          <ScrollView style={{ maxHeight: 300 }}>{renderTree(tree)}</ScrollView>
          <TouchableOpacity
            onPress={() => {
              setTypeOfSub("tema");
              getNewCount();
            }}
            style={{ height: 40, paddingVertical: 0, justifyContent: "center" }}
          >
            <Text
              style={{
                fontSize: 11,
                width: "auto",
                color: theme.colors.tertiary,
              }}
            >
              + Añadir tema
            </Text>
          </TouchableOpacity>
          <Portal>
            <Modal
              visible={visibleModal}
              onDismiss={() => setVisibleModal(false)}
              contentContainerStyle={{
                backgroundColor: "white",
                padding: 30,
                width: "90%",
                margin: "auto",
                borderRadius: 30,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    textAlign: "center",
                    marginBottom: 15,
                    fontSize: 20,
                  }}
                >
                  Nombre del tema {subtitleToAdd}
                </Text>
                <Input
                  onChangeText={(text) => setNameToAdd(text)}
                  style={{
                    ...style.login.input_text,
                    width: "90%",
                    marginVertical: 10,
                  }}
                  theme={{ roundness: 20 }}
                  activeOutlineColor={"black"}
                  mode="outlined"
                />
                <Button
                  onPress={() =>
                    typeOfSub.includes("tema")
                      ? handleAddTema()
                      : handleAddSubtema(newPathRef)
                  }
                  style={{
                    backgroundColor: theme.colors.tertiary_op,
                    marginTop: 15,
                  }}
                  mode="elevated"
                >
                  <Text style={{ color: "black" }}>Añadir</Text>
                </Button>
              </View>
            </Modal>
          </Portal>
        </View>
        <View style={{paddingTop: 20}}>
        <Button
          mode="elevated"
          icon={() => <Icon name="file" color="black" size={22} />}
          contentStyle={{ flexDirection: "row-reverse" }}
          style={{
            ...style.general.button,
            ...style.general.center,
            marginHorizontal: 'auto',
            backgroundColor: theme.colors.tertiary,
            marginTop: 0,
            width: 'auto'
          }}
          onPressIn={() => navigation.navigate("ModReportes", {materiaNrc: materiaNrc})}
        >
          <Text style={{paddingHorizontal: 10, fontSize: 15}}>
            Crear reporte
          </Text>
        </Button>
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
