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
  TouchableOpacity,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/FontAwesome6";
import IconFeather from "react-native-vector-icons/Feather";
import { Formik } from "formik";
import { programaSchema } from "@/constants/schemas";
import useUids from "../../hooks/uids";

/**
 * Componente `ProgramasAdmin` para la administración de programas.
 *
 * Este componente permite gestionar la lista de programas, seleccionar un programa,
 * editarlo y actualizar la información. Maneja la visibilidad de modales y el estado
 * de carga. También incluye referencias para los selectores de requisitos y simultaneidad.
 *
 * @component
 *
 * @returns {JSX.Element} El componente renderiza la interfaz de administración de programas.
 */
export default function ProgramasAdmin() {
  // Estado inicial de un programa
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

  // Estados del componente
  const [programas, setProgramas] = useState([]); // Lista de programas
  const [departamentos, setDepartamentos] = useState([]); // Lista de departamentos
  const [loading, setLoading] = useState(false); // Estado de carga
  const [programaSelected, setProgramaSelected] = useState(initPrograma); // Programa seleccionado
  const [editable, setEditable] = useState(false); // Indica si el programa es editable
  const [update, setUpdate] = useState(true); // Indica si se debe actualizar
  const [visibleModal, setVisibleModal] = useState(false); // Visibilidad del modal de éxito
  const [successResult, setSuccessResult] = useState(false); // Resultado de la operación de éxito

  // Estados para los temas
  const {
    visibleModalHours,
    visibleModalSubtopic,
    setVisibleModalHours,
    setVisibleModalSubtopic,
    subtitleToAdd,
    nameToAdd,
    setNameToAdd,
    hoursToAdd,
    setHoursToAdd,
    typeOfSub,
    setTypeOfSub,
    uids,
    setUids,
    setEditableTree,
    setUpdateTree,
    getNewCount,
    handleAddTema,
    editTema,
    editHours,
    renderTree,
    getTemaData,
  } = useUids();

  // Referencias a los selectores
  const select = useRef();
  const selectRequisito = useRef();
  const selectSimultaneo = useRef();
  const selectDepartamento = useRef();

  /**
   * Obtiene todos los programas desde el servidor y actualiza el estado `programas`.
   *
   * @param {boolean} [loadingS=false] Indica si la carga ya está en curso.
   */
  const fetchProgramas = (loadingS = false) => {
    if (!loadingS) {
      setLoading(true); // Activa el estado de carga
      setProgramaSelected(initPrograma); // Reinicia la selección de programa
      select.current?.reset(); // Reinicia el selector
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
          setProgramas(data); // Actualiza el estado con los datos obtenidos
        })
        .finally(() => {
          setLoading(false); // Desactiva el estado de carga
        })
        .catch((error) => {
          console.log(
            `Error en la solicitud a: ${process.env.EXPO_PUBLIC_API_URL}/programas`,
            error
          );
          setLoading(false); // Desactiva el estado de carga en caso de error
        });
    } catch (error) {
      console.log("Error al intentar obtener los programas", error);
      setLoading(false); // Desactiva el estado de carga en caso de error
    }
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

  /**
   * Actualiza un programa enviando una solicitud POST al servidor con los valores del formulario.
   * Incluye los temas en el cuerpo de la solicitud y maneja la respuesta para mostrar el resultado.
   *
   * @param {Object} values Valores del formulario enviados para actualizar el programa.
   */
  const updateFun = (values) => {
    setLoading(true); // Activa el estado de carga    

    try {
      const options = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ ...values, temas: JSON.stringify(uids) }), // Incluye los temas en el cuerpo de la solicitud
      };

      const url = `${process.env.EXPO_PUBLIC_API_URL}/programas/${
        update ? "update" : "new"
      }`;

      fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            // Muestra el modal de éxito y actualiza la lista de programas
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
          console.log(`Error en la solicitud a: ${url}`, error);
          setLoading(false); // Desactiva el estado de carga en caso de error
        });
    } catch (error) {
      console.log("Error al intentar actualizar el programa", error);
      setLoading(false); // Desactiva el estado de carga en caso de error
    }
  };

  /**
   * Elimina un programa seleccionado enviando una solicitud GET al servidor.
   * Muestra una alerta confirmando la eliminación o un error si no se puede eliminar.
   */
  const deleteFun = () => {
    setLoading(true); // Activa el estado de carga

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
            // Muestra una alerta de éxito y actualiza la lista de programas
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
            // Muestra una alerta de error si el programa no se puede eliminar
            Alert.alert(
              "Error",
              "Se tienen relacionadas materias a este programa por lo que no se puede eliminar",
              [
                {
                  text: "Ok",
                  style: "cancel",
                  onPress: () => setLoading(false),
                },
              ]
            );
          }
        })
        .catch((error) => {
          console.log(`Error en la solicitud a: ${url}`, error);
          setLoading(false); // Desactiva el estado de carga en caso de error
        });
    } catch (error) {
      console.log("Error al intentar eliminar el programa", error);
      setLoading(false); // Desactiva el estado de carga en caso de error
    }
  };

  // Hook para cargar programas y departamentos al montar el componente
  useEffect(() => {
    fetchProgramas();
    fetchDepartamentos();
  }, []);

  // Hook para actualizar las selecciones y los temas cuando cambia `programaSelected`
  useEffect(() => {
    selectRequisito.current?.selectIndex(
      programas.findIndex((x) => x.clave === programaSelected?.requisito) + 1
    );
    selectSimultaneo.current?.selectIndex(
      programas.findIndex((x) => x.clave === programaSelected?.simultaneo) + 1
    );
    selectDepartamento.current?.selectIndex(
      departamentos.findIndex((x) => x.id === programaSelected?.departamento) + 1
    );

    setUids(JSON.parse(programaSelected?.temas));
  }, [programaSelected]);

  // Hook para inicializar `programaSelected` y `uids` cuando cambia `update`
  useEffect(() => {
    setProgramaSelected(initPrograma);
    setUids(JSON.parse(initPrograma.temas));
    setUpdateTree(update);
  }, [update]);

  // Hook para cambiar el valor de editable en el tree de temas
  useEffect(() => {
    setEditableTree(editable);
  }, [editable]);

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
                    maxHeight: editable ? "85%" : "100%",
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

                  <View style={{...styles.general.center, width: "100%"}}>
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
                      disabled={!editable && update}
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
                          <Text>
                            {item.departamento}
                          </Text>
                        </View>
                      )}
                      onSelect={(item) =>
                        setFieldValue("departamento", item.id)
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

                    {(editable || !update) && (
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

        {/* Modal to edit or add name to subtopic */}
        <Modal
          visible={visibleModalSubtopic}
          onDismiss={() => setVisibleModalSubtopic(false)}
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

        {/* Modal to edit or add hours to subtopic */}
        <Modal
          visible={visibleModalHours}
          onDismiss={() => setVisibleModalHours(false)}
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
