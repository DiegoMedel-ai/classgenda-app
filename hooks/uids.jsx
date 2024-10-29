import { useEffect, useState } from "react";
import { Alert, View, TouchableOpacity } from "react-native";
import { Button, Text, TextInput, Modal, Checkbox } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome6";
import { styles } from "@/constants/styles";
import theme from "@/constants/theme";

const useUids = () => {
  const [visibleModalSubtopic, setVisibleModalSubtopic] = useState(false); // Modal para editar subtemas
  const [visibleModalHours, setVisibleModalHours] = useState(false); // Modal para editar horas
  const [subtitleToAdd, setSubtitleToAdd] = useState("N1.1.1TV0H0"); // UID del subtema a añadir o editar
  const [nameToAdd, setNameToAdd] = useState("_"); // Nombre del nuevo subtema
  const [hoursToAdd, setHoursToAdd] = useState(0); // Horas a añadir al subtema
  const [typeOfSub, setTypeOfSub] = useState("tema"); // Tipo de subtema (tema o subtema)
  const [uids, setUids] = useState([]); // Array de uids para los temas y subtemas
  const [editableTree, setEditableTree] = useState(false);
  const [updateTree, setUpdateTree] = useState(true);
  const [checkableTree, setCheckableTree] = useState(false);
  const [newReport, setNewReport] = useState(false);

  /**
   * Funcion que genera un nuevo UID basado en los datos dados
   * @param {String} level Variable para asignar el numero del tema
   * @param {String} name Variable para asignar el nombre del nuevo tema
   * @param {String} value Valor con el que se va a inicializar el tema como visto o no visto
   * @param {String} hours Valor para asignar las horas del tema
   * @returns UID que asigna todos los datos del nuevo tema
   */
  const generateUID = (level, name, value, hours) => {
    return `N${level}T${name}V${value}H${hours}`;
  };

  /**
   * Funcion que toma un UID y lo transforma en un arreglo con los datos
   * @param {String} tema UID para obtener los datos con un regex
   * @returns Retorna un arreglo con los datos del tema de la siguiente manera:
   * [0] UID completo
   * [1] Numero del tema
   * [2] Nombre del tema
   * [3] Binario por si el tema fue visto o no
   * [4] Horas que ocupa el tema
   */
  const getTemaData = (tema) => {
    const regex = /^N(\d+(?:\.\d+)*?)T(.+?)V(\d+)H(\d+)$/;
    return tema.match(regex);
  };

  /**
   * Obtiene el nuevo contador para agregar un subtema bajo el `path` dado.
   * Calcula el próximo número disponible en la jerarquía de subtemas y genera
   * un nuevo uid con ese número.
   *
   * @param {String} path El uid del tema bajo el cual agregar el nuevo subtema.
   */
  const getNewCount = (path) => {
    let length;
    if (!path) {
      // Si no se proporciona un path, se cuenta el número de temas de primer nivel
      length =
        uids.filter((uid) => getTemaData(uid)[1].split(".").length === 1)
          .length + 1;
    } else {
      // Si se proporciona un path, se calcula el próximo número de subtema
      const childTopics = uids
        .map((uid) => getTemaData(uid)[1])
        .filter((id) => {
          const parts = id.split(".");
          return (
            id.startsWith(path + ".") &&
            parts.length === path.split(".").length + 1
          );
        })
        .map((id) => parseInt(id.split(".").pop()));

      const maxChild = Math.max(0, ...childTopics);
      length = `${path}.${maxChild + 1}`;
    }

    const uid = generateUID(length, nameToAdd, 0, 0);
    setSubtitleToAdd(uid);
    setVisibleModalSubtopic(true);
  };

  /**
   * Agrega un nuevo uid de subtema al array de `uids`.
   * Genera un nuevo uid usando `nameToAdd` y lo añade al estado de `uids`.
   */
  const handleAddTema = () => {
    const data = getTemaData(subtitleToAdd);
    const uid = generateUID(data[1], nameToAdd, 0, 0);
    setUids((prevUids) => [...prevUids, uid]);
    setNameToAdd("_");
    setVisibleModalSubtopic(false);
  };

  /**
   * Edita el nombre del subtema usando el valor de `nameToAdd`.
   * Actualiza el nombre del tema correspondiente en el array de `uids`
   * y cierra el modal de edición.
   */
  const editTema = () => {
    const index = uids.findIndex(
      (item) => getTemaData(subtitleToAdd)[1] === getTemaData(item)[1]
    );
    const _data = [...uids];
    const tema = getTemaData(subtitleToAdd);
    _data[index] = generateUID(tema[1], nameToAdd, 0, 0);
    setUids(_data);
    setNameToAdd("_");
    setVisibleModalSubtopic(false);
  };

  /**
   * Edita las horas del subtema usando el valor de `hoursToAdd`.
   * Actualiza el tema correspondiente en el array de `uids` con las nuevas horas
   * y cierra el modal de edición.
   */
  const editHours = () => {
    const index = uids.findIndex(
      (item) => getTemaData(subtitleToAdd)[1] === getTemaData(item)[1]
    );
    const _data = [...uids];
    const tema = getTemaData(subtitleToAdd);
    _data[index] = generateUID(tema[1], tema[2], 0, hoursToAdd);
    setUids(_data);
    setHoursToAdd(0);
    setVisibleModalHours(false);
  };

  /**
   * Función para ordenar el árbol de uids por el número del subtema.
   * Compara los identificadores jerárquicos de los temas y subtemas para ordenarlos
   * en función de su nivel y numeración.
   *
   * @param {String} a El uid del primer tema o subtema a comparar.
   * @param {String} b El uid del segundo tema o subtema a comparar.
   */
  const sortTree = (a, b) => {
    const matchA = getTemaData(a);
    const matchB = getTemaData(b);

    if (matchA && matchB) {
      const numA = matchA[1].split(".").map(Number); // Convierte el número jerárquico del tema a un array de números
      const numB = matchB[1].split(".").map(Number); // Convierte el número jerárquico del tema a un array de números

      // Compara cada nivel jerárquico de los temas
      for (let i = 0; i < Math.max(numA.length, numB.length); i++) {
        const valA = numA[i] || 0; // Asigna 0 si el nivel no existe
        const valB = numB[i] || 0;

        if (valA !== valB) {
          return valA - valB; // Ordena según la diferencia entre los valores
        }
      }
    }
    return 0; // Si son iguales, no se cambia el orden
  };

  /**
   * Función para eliminar un subtema y sus subtemas relacionados.
   * Filtra el nodo dado (subtema) y todos sus hijos de la lista de uids
   * basándose en su nivel jerárquico.
   *
   * @param {String} node El uid del tema o subtema que se desea eliminar.
   * Todos los temas y subtemas que tengan un uid que comience con el mismo
   * prefijo que este nodo serán eliminados.
   */
  const deleteTree = (node) => {
    const newTree = uids.filter(
      (uid) => !getTemaData(uid)[1].startsWith(getTemaData(node)[1])
    );
    setUids(newTree);
  };

  /**
   * Funcion para cambiar el valor de la vista del tema para saber si el tema fue visto en una semana o no.
   * 
   * @param {String} uid UID para modificar el valor a visto o no
   * @param {Number} lastVal Ultimo valor para saber si anteriormente se habia visualizado el tema o no.
   */
  const handleCheckboxChange = (uid, lastVal) => {
    const index = uids.findIndex(_uid => uid === _uid);
    const _uids = [...uids];
  
    if (index !== -1) {
      const temaData = getTemaData(uid);
  
      if (temaData) {
        const [ , level, name, value, hours] = temaData;
        let newValue = (parseInt(value) + 1) % 3;
  
        if (newValue < lastVal) {
          newValue = lastVal;
        }
  
        const newUid = generateUID(level, name, newValue, hours);
        _uids[index] = newUid;
  
        setUids(_uids);
      }
    }
  }

  /**
   * Función para renderizar el árbol de temas basado en un array de uids.
   * Cada uid representa un tema o subtema, el cual será renderizado con sus detalles.
   *
   * El componente muestra la jerarquía de los temas y proporciona opciones para
   * editar, eliminar o agregar subtemas si el componente está en modo editable.
   *
   * @param {JSON} lastReport Valor del ultimo reporte para compararlo con el renderizado.
   * @returns {JSX.Element[]} Un array de Views que renderizan cada tema.
   */
  const renderTree = (lastReport) => {
    var lastUids = []
    try {
      lastUids = JSON.parse(lastReport?.temas);
    } catch (error) {
      console.log(error);
    }
    
    
    return uids.sort(sortTree).map((uid) => {
      // Calcula el padding basado en el nivel jerárquico del tema
      const [ , level, name, value, hours] = getTemaData(uid)
      const _paddingLeft = level.split(".").length * 15;

      return (
        <View key={uid} style={{ paddingLeft: _paddingLeft }}>
          <View style={styles.programas.checkboxRow}>
            {/* Muestra el checkbox para saber si el tema fue visto o no */}
            {checkableTree && 
              <Checkbox
                color="green"
                status={parseInt(value) === 0 ? "unchecked" : parseInt(value) === 1 ? "indeterminate" : "checked"}
                onPress={() => handleCheckboxChange(uid, lastReport ? getTemaData(lastUids.find(x => getTemaData(x)[1] === level))[3] : 0)}
                disabled={!newReport}
              />
            }

            {/* Muestra el número y nombre del tema, con horas adicionales si se proporcionan */}
            <Text
              style={{
                ...(!(editableTree || !updateTree) && !checkableTree && { marginBottom: 15 }),
                fontSize: 15,
              }}
            >
              {level}. {name}
              {hours !== "0" && ` - ${hours} h`}
            </Text>

            {/* Botón para editar el nombre del tema */}
            {(editableTree || !updateTree) && (
              <TouchableOpacity
                style={{
                  height: 30,
                  paddingVertical: 0,
                  justifyContent: "center",
                }}
                onPress={() => {
                  setTypeOfSub("edit");
                  setSubtitleToAdd(uid);
                  setVisibleModalSubtopic(true);
                }}
              >
                <Icon
                  name="pen"
                  color={"black"}
                  size={15}
                  style={{ paddingLeft: 10 }}
                />
              </TouchableOpacity>
            )}

            {/* Botón para eliminar el tema y sus subtemas */}
            {(editableTree || !updateTree) && (
              <TouchableOpacity
                style={{
                  height: 30,
                  paddingVertical: 0,
                  justifyContent: "center",
                }}
                onPress={() => {
                  Alert.alert(
                    "Confirmar",
                    `¿Seguro que quiere eliminar todo el tema y subtemas del ${
                      level
                    }?`,
                    [
                      {
                        text: "Confirmar",
                        style: "default",
                        onPress: () => deleteTree(uid),
                      },
                      { text: "Cancelar", style: "cancel" },
                    ]
                  );
                }}
              >
                <Icon
                  name="trash"
                  color={"black"}
                  size={15}
                  style={{ paddingLeft: 10 }}
                />
              </TouchableOpacity>
            )}

            {/* Botón para editar la duración del tema */}
            {(editableTree || !updateTree) && (
              <TouchableOpacity
                style={{
                  height: 30,
                  paddingVertical: 0,
                  justifyContent: "center",
                }}
                onPress={() => {
                  setTypeOfSub("edit");
                  setSubtitleToAdd(uid);
                  setVisibleModalHours(true);
                }}
              >
                <Icon
                  name="clock"
                  color={"black"}
                  size={15}
                  style={{ paddingLeft: 10 }}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Botón para agregar un subtema si el componente está en modo editable */}
          {(editableTree || !updateTree) && (
            <TouchableOpacity
              onPress={() => {
                setTypeOfSub("sub");
                getNewCount(getTemaData(uid)[1]);
              }}
              style={{
                height: 30,
                paddingVertical: 0,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  width: "auto",
                  paddingLeft: _paddingLeft,
                  color: theme.colors.tertiary,
                }}
              >
                + Añadir subtema
              </Text>
            </TouchableOpacity>
          )}
        </View>
      );
    });
  };

  return {
    visibleModalHours,
    setVisibleModalHours,
    visibleModalSubtopic,
    setVisibleModalSubtopic,
    subtitleToAdd,
    setSubtitleToAdd,
    nameToAdd,
    setNameToAdd,
    hoursToAdd,
    setHoursToAdd,
    typeOfSub,
    setTypeOfSub,
    uids,
    setUids,
    editableTree,
    setEditableTree,
    updateTree,
    setUpdateTree,
    getNewCount,
    handleAddTema,
    editTema,
    editHours,
    renderTree,
    getTemaData,
    setCheckableTree,
    checkableTree,
    newReport,
    setNewReport
  };
};

/**
 * Modal para poder editar variables en el arbol de temas
 * @param {Boolean} visible muestra el modal en caso de que la variable sea `true`
 * @param {Function} setVisible funcion que cambia el estado de la variable `visible`
 * @param {String} title texto que aparecerá en el titulo del modal
 * @param {Function} onSubmit funcion para cuando se oprima el boton `Aceptar`
 * @param {String} defaultValue variable que muestra el valor inicial en el input
 * @param {Function} onChangeText funcion para cambiar el estado de la variable a editar
 * @param {Boolean} disabled variable para deshabilitar el boton `Aceptar`
 * @param {Boolean} [numpad=false] variable para mostrar el teclado numerico, en default mostrará teclado de texto
 * @returns {JSX.Element} Elemento modal conteniendo funciones para editar las variables de los temas
 */
const ModalEditVars = ({
  visible,
  setVisible,
  title,
  onSubmit,
  defaultValue,
  onChangeText,
  disabled,
  numpad = false,
}) => {
  return (
    <Modal
      visible={visible}
      onDismiss={() => setVisible(false)}
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
          {title}
        </Text>
        <TextInput
          onChangeText={(text) => onChangeText(text)}
          defaultValue={defaultValue}
          keyboardType={numpad ? "number-pad" : "default"}
          style={{
            ...styles.login.input_text,
            width: "90%",
            marginVertical: 10,
          }}
          theme={{ roundness: 20 }}
          activeOutlineColor={"black"}
          mode="outlined"
        />
        <Button
          disabled={disabled}
          onPress={() => onSubmit()}
          style={{
            backgroundColor: theme.colors.tertiary_op,
            marginTop: 15,
          }}
          mode="elevated"
        >
          <Text style={{ color: "black" }}>Aceptar</Text>
        </Button>
      </View>
    </Modal>
  );
};

export { ModalEditVars };
export default useUids;
