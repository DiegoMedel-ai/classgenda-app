import React, { useEffect, useRef, useState, useCallback } from "react";
import { styles } from "@/constants/styles";
import theme from "@/constants/theme";
import {
  Button,
  IconButton,
  Text,
  HelperText,
  Modal,
  Portal,
  TextInput as Input,
} from "react-native-paper";
import {
  View,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/FontAwesome6";
import IconFeather from "react-native-vector-icons/Feather";
import { Formik } from "formik";
import { programaSchema } from "@/constants/schemas";
import { generateUID, getTemaData } from "../../hooks/uids";

export default function ProgramasAdmin() {
  const initPrograma = {
    clave: 0,
    nombre: "",
    tipo: "",
    creditos: null,
    requisito: null,
    simultaneo: null,
    horas_practica: null,
    horas_curso: null,
    descripcion: "",
    perfil_egreso: "",
    temas: "[]",
  };
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [programaSelected, setProgramaSelected] = useState(initPrograma);
  const [editable, setEditable] = useState(false);
  const [update, setUpdate] = useState(true);
  const [visibleModal, setVisibleModal] = useState(false);
  const [successResult, setSuccessResult] = useState(false);
  const select = useRef();
  const selectRequisito = useRef();
  const selectSimultaneo = useRef();

  /**
   * Function to fetch all the programs and set it to the object programas
   * @param {boolean} loadingS Value that says if fetching is already in use
   */
  const fetchProgramas = (loadingS = false) => {
    if (!loadingS) {
      setLoading(true);
      setProgramaSelected(initPrograma);
      select.current?.reset();
    }
    try {
      const options = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      };

      fetch(`${process.env.EXPO_PUBLIC_API_URL}/programas`, options)
        .then((response) => response.json())
        .then((data) => {
          setProgramas(data);
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
   * Function to update the program
   * @param {Object} values values of formik to submit
   */
  const updateFun = (values) => {
    setLoading(true);

    try {
      const options = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ ...values, temas: JSON.stringify(uids) }),
      };

      const url = `${process.env.EXPO_PUBLIC_API_URL}/programas/${
        update ? "update" : "new"
      }`;

      fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setSuccessResult(true);
            setVisibleModal(true);
            setTimeout(() => {
              setSuccessResult(true);
              setVisibleModal(false);
              fetchProgramas(true);
              setUpdate(true);
            }, 800);
          }
        })
        .catch((error) => {
          console.log(`Fetch error to: ${url}`, error);
        });
    } catch (error) {}
  };

  /**
   * Function to delete program
   */
  const deleteFun = () => {
    setLoading(true);

    try {
      const options = {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      };

      const url = `${process.env.EXPO_PUBLIC_API_URL}/programas/delete/${programaSelected.clave}`;

      fetch(url, options)
        .then((response) => {
          if (response.status === 200) {
            Alert.alert(
              "Programa eliminado",
              "Se ha eliminado el registro correctamente",
              [
                {
                  text: "Ok",
                  style: "cancel",
                  onPress: () => fetchProgramas(),
                },
              ]
            );
          } else {
            Alert.alert(
              "Error",
              "Se tienen relacionadas materias a este programa por lo que no se puede eliminar",
              [
                {
                  text: "Ok",
                  style: "cancel",
                  onPress: setLoading(false),
                },
              ]
            );
          }
        })
        .catch((error) => {
          console.log(`Fetch error to: ${url}`, error);
        });
    } catch (error) {}
  };

  useEffect(() => {
    fetchProgramas();
  }, []);

  useEffect(() => {
    selectRequisito.current?.selectIndex(
      programas.findIndex((x) => x.clave === programaSelected?.requisito) + 1
    );
    selectSimultaneo.current?.selectIndex(
      programas.findIndex((x) => x.clave === programaSelected?.simultaneo) + 1
    );

    setUids(JSON.parse(programaSelected?.temas));
  }, [programaSelected]);

  useEffect(() => {
    setProgramaSelected(initPrograma);
    setUids(JSON.parse(initPrograma.temas));
  }, [update]);

  /**
   * Section to render tree of subjects
   */
  const [visibleModal2, setVisibleModal2] = useState(false);
  const [visibleModal3, setVisibleModal3] = useState(false);
  const [subtitleToAdd, setSubtitleToAdd] = useState("N1.1.1TV0H0");
  const [nameToAdd, setNameToAdd] = useState("_");
  const [hoursToAdd, setHoursToAdd] = useState(0);
  const [typeOfSub, setTypeOfSub] = useState("tema");
  const [uids, setUids] = useState([]);

  /**
   * Gets the new count after the param path
   * @param {String} path uid to add new count
   */
  const getNewCount = (path) => {
    var length;
    if (!path) {
      length =
        uids.filter((uid) => getTemaData(uid)[1].split(".").length === 1)
          .length + 1;
    } else {
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
    setVisibleModal2(true);
  };

  /**
   * Sets a new subject uid
   */
  const handleAddTema = () => {
    const data = getTemaData(subtitleToAdd);
    const uid = generateUID(data[1], nameToAdd, 0, 0);
    setUids((prevUids) => [...prevUids, uid]);
    setNameToAdd("_");
    setVisibleModal2(false);
  };

  /**
   * Edits the name of the subject using the reference to nameToAdd
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
    setVisibleModal2(false);
  };

  /**
   * Edits the hours of the subject using the reference to hoursToAdd
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
    setVisibleModal3(false);
  };

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
   *
   * @param {String} node uid to delete
   */
  const deleteTree = (node) => {
    const newTree = uids.filter(
      (uid) => !getTemaData(uid)[1].startsWith(getTemaData(node)[1])
    );
    setUids(newTree);
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

            {editable && (
              <TouchableOpacity
                style={{
                  height: 30,
                  paddingVertical: 0,
                  justifyContent: "center",
                }}
                onPress={() => {
                  setTypeOfSub("edit");
                  setSubtitleToAdd(uid);
                  setVisibleModal2(true);
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

            {editable && (
              <TouchableOpacity
                style={{
                  height: 30,
                  paddingVertical: 0,
                  justifyContent: "center",
                }}
                onPress={() => {
                  Alert.alert(
                    "Confirmar",
                    `Seguro que quiere eliminar todo el tema y subtemas del ${
                      getTemaData(uid)[1]
                    }?`,
                    [
                      {
                        text: "Confirmar",
                        style: "default",
                        onPress: () => deleteTree(uid),
                      },
                      {
                        text: "Cancelar",
                        style: "cancel",
                      },
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

            {editable && (
              <TouchableOpacity
                style={{
                  height: 30,
                  paddingVertical: 0,
                  justifyContent: "center",
                }}
                onPress={() => {
                  setTypeOfSub("edit");
                  setSubtitleToAdd(uid);
                  setVisibleModal3(true);
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

          {editable && (
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

  return (
    <View style={{ ...styles.admin.overlay_top }}>
      {update && (
        <View
          style={{
            ...styles.programas.cards_show,
            marginBottom: 10,
            paddingVertical: 8,
          }}
        >
          <Text>Clave de programa a buscar:</Text>
          <View style={{ ...styles.general.center, flexDirection: "row" }}>
            <SelectDropdown
              data={programas}
              ref={select}
              renderButton={(selectedItem, isOpen) => {
                return (
                  <View
                    style={{
                      ...styles.general.button_select,
                      width: "70%",
                      marginTop: 0,
                    }}
                  >
                    <Text>
                      {(selectedItem &&
                        `${selectedItem.clave} - ${selectedItem.nombre}`) ||
                        "Selecciona un programa"}
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
                  <Text>
                    {item.clave} - {item.nombre}
                  </Text>
                </View>
              )}
              onSelect={(item) => setProgramaSelected(item)}
              defaultValue={programaSelected}
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

            <IconButton
              icon={() => <Icon name={"repeat"} size={15} />}
              size={20}
              mode="contained"
              onPress={() => fetchProgramas(false)}
              style={{ backgroundColor: theme.colors.tertiary }}
            />
          </View>
        </View>
      )}
      {(programaSelected.clave !== 0 || !update) && (
        <Formik
          initialValues={programaSelected}
          validationSchema={programaSchema}
          onSubmit={(values) => updateFun(values)}
          enableReinitialize={true}
        >
          {({ values, errors, handleChange, setFieldValue, handleSubmit }) => {
            return (
              <>
                <ScrollView
                  contentContainerStyle={{ flexGrow: 1 }}
                  style={{
                    width: "100%",
                    maxHeight: editable ? "75%" : "100%",
                  }}
                >
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
                        onChangeText={handleChange("nombre")}
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
                        onChangeText={handleChange("clave")}
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
                        onChangeText={handleChange("tipo")}
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
                        onChangeText={handleChange("creditos")}
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
                      <SelectDropdown
                        data={[
                          { clave: null, nombre: "Ninguna" },
                          ...programas,
                        ]}
                        disabled={!editable && update}
                        ref={selectRequisito}
                        renderButton={(selectedItem, isOpen) => {
                          return (
                            <View
                              style={{
                                ...styles.general.button_select,
                                width: "90%",
                              }}
                            >
                              <Text>
                                {(selectedItem && `${selectedItem.nombre}`) ||
                                  "Ninguna"}
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
                            <Text>
                              {item.clave} - {item.nombre}
                            </Text>
                          </View>
                        )}
                        onSelect={(item) =>
                          setFieldValue("requisito", item.clave)
                        }
                        search
                        dropdownStyle={{ borderRadius: 10 }}
                        searchInputTxtColor={"black"}
                        searchPlaceHolder={"Search here"}
                        searchPlaceHolderColor={"grey"}
                        renderSearchInputLeftIcon={() => {
                          return (
                            <Icon
                              name={"magnifying-glass"}
                              color={"black"}
                              size={18}
                            />
                          );
                        }}
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
                      <SelectDropdown
                        data={[
                          { clave: null, nombre: "Ninguna" },
                          ...programas,
                        ]}
                        disabled={!editable && update}
                        ref={selectSimultaneo}
                        renderButton={(selectedItem, isOpen) => {
                          return (
                            <View
                              style={{
                                ...styles.general.button_select,
                                width: "90%",
                              }}
                            >
                              <Text>
                                {(selectedItem && `${selectedItem.nombre}`) ||
                                  "Ninguna"}
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
                            <Text>
                              {item.clave} - {item.nombre}
                            </Text>
                          </View>
                        )}
                        onSelect={(item) =>
                          setFieldValue("simultaneo", item.clave)
                        }
                        search
                        dropdownStyle={{ borderRadius: 10 }}
                        searchInputTxtColor={"black"}
                        searchPlaceHolder={"Search here"}
                        searchPlaceHolderColor={"grey"}
                        renderSearchInputLeftIcon={() => {
                          return (
                            <Icon
                              name={"magnifying-glass"}
                              color={"black"}
                              size={18}
                            />
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
                        onChangeText={handleChange("horas_practica")}
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
                        onChangeText={handleChange("horas_curso")}
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
                        onChangeText={handleChange("descripcion")}
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
                        onChangeText={handleChange("perfil_egreso")}
                        value={values?.perfil_egreso}
                      />
                    </View>
                  </View>
                  <View style={styles.programas.container}>
                    <ScrollView style={{ maxHeight: "auto" }}>
                      {renderTree(uids)}
                    </ScrollView>

                    {editable && (
                      <TouchableOpacity
                        onPress={() => {
                          setTypeOfSub("tema");
                          getNewCount();
                        }}
                        style={{
                          height: 40,
                          paddingVertical: 0,
                          justifyContent: "center",
                        }}
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
                    )}
                  </View>
                </ScrollView>
                {update ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      width: "100%",
                      paddingTop: 10,
                    }}
                  >
                    <Button
                      mode="elevated"
                      style={{ ...(!programaSelected && { marginTop: 10 }) }}
                      textColor="black"
                      buttonColor={theme.colors.tertiary}
                      onPress={() => setUpdate(false)}
                    >
                      Añadir
                    </Button>
                    <Button
                      mode="elevated"
                      textColor="black"
                      buttonColor={theme.colors.tertiary}
                      onPress={() => {
                        if (editable) {
                          handleSubmit();
                          setEditable((prev) => !prev);
                        } else {
                          setEditable((prev) => !prev);
                        }
                      }}
                    >
                      {editable ? "Guardar" : "Actualizar"}
                    </Button>
                    <Button
                      mode="elevated"
                      textColor="black"
                      buttonColor={theme.colors.tertiary}
                      onPress={() => {
                        Alert.alert(
                          "Eliminar programa",
                          "Estás seguro de eliminar este programa?",
                          [
                            {
                              text: "Confirmar",
                              style: "default",
                              onPress: () => deleteFun(),
                            },
                            {
                              text: "Cancelar",
                              style: "cancel",
                            },
                          ]
                        );
                      }}
                    >
                      Eliminar
                    </Button>
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      width: "100%",
                      paddingTop: 10,
                    }}
                  >
                    <Button
                      mode="elevated"
                      style={{ ...(!programaSelected && { marginTop: 10 }) }}
                      textColor="black"
                      buttonColor={theme.colors.tertiary}
                      onPress={handleSubmit}
                    >
                      Añadir
                    </Button>
                    <Button
                      mode="elevated"
                      style={{ ...(!programaSelected && { marginTop: 10 }) }}
                      textColor="black"
                      buttonColor={theme.colors.tertiary}
                      onPress={() => setUpdate(true)}
                    >
                      Cancelar
                    </Button>
                  </View>
                )}

                <HelperText
                  type="error"
                  visible={errors}
                  padding="none"
                  style={{ width: "55%" }}
                >
                  {Object.keys(errors).map((x) => errors[x] + "\n")}
                </HelperText>
              </>
            );
          }}
        </Formik>
      )}
      {programaSelected.clave === 0 && update && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: "100%",
            paddingTop: 10,
          }}
        >
          <Button
            mode="elevated"
            style={{ ...(programaSelected.clave === 0 && { marginTop: 10 }) }}
            textColor="black"
            buttonColor={theme.colors.tertiary}
            onPress={() => setUpdate(false)}
          >
            Añadir
          </Button>
        </View>
      )}

      {loading && (
        <View style={styles.general.overlay_loader}>
          <ActivityIndicator size={"large"} color={"#4DBFE4"} />
        </View>
      )}

      <Portal>
        {/* Modal to view the result of the processing result */}
        <Modal
          visible={visibleModal}
          onDismiss={() => setVisibleModal(false)}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 30,
            width: "70%",
            margin: "auto",
            borderRadius: 30,
          }}
        >
          {successResult ? (
            <View style={{ alignItems: "center" }}>
              <IconFeather name="check-circle" color="green" size={40} />
              <Text style={{ textAlign: "center", marginTop: 10 }}>
                Programa {update ? "modificado" : "agregado"} correctamente!
              </Text>
            </View>
          ) : (
            <View style={{ alignItems: "center" }}>
              <IconFeather
                name="x-circle"
                color={theme.colors.error}
                size={40}
              />
              <Text style={{ textAlign: "center", marginTop: 10 }}>
                Hubo un error
              </Text>
            </View>
          )}
        </Modal>

        {/* Modal to edit or add name to subject */}
        <Modal
          visible={visibleModal2}
          onDismiss={() => setVisibleModal2(false)}
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
              Nombre del {typeOfSub === "sub" && typeOfSub}tema{" "}
              {getTemaData(subtitleToAdd) && getTemaData(subtitleToAdd)[1]}
            </Text>
            <Input
              onChangeText={(text) => setNameToAdd(text)}
              defaultValue={
                typeOfSub === "edit" ? getTemaData(subtitleToAdd)[2] : ""
              }
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
              disabled={nameToAdd === ""}
              onPress={() =>
                typeOfSub === "edit" ? editTema() : handleAddTema()
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

        {/* Modal to edit or add hours to subject */}
        <Modal
          visible={visibleModal3}
          onDismiss={() => setVisibleModal3(false)}
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
              Horas del tema{" "}
              {getTemaData(subtitleToAdd) && getTemaData(subtitleToAdd)[1]}
            </Text>
            <Input
              onChangeText={(text) => setHoursToAdd(text)}
              defaultValue={
                typeOfSub === "edit" ? getTemaData(subtitleToAdd)[4] : ""
              }
              keyboardType="number-pad"
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
              disabled={hoursToAdd === ""}
              onPress={() => editHours()}
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
  );
}
