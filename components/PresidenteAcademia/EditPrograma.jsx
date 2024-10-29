import React, { useEffect, useRef, useState, useContext } from "react";
import { styles } from "@/constants/styles";
import theme from "@/constants/theme";
import {
  Button,
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
  TouchableOpacity,
  TurboModuleRegistry,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/FontAwesome6";
import IconFeather from "react-native-vector-icons/Feather";
import { Formik } from "formik";
import { programaSchema } from "@/constants/schemas";
import useUids, { ModalEditVars } from "../../hooks/uids";
import LoginContext from "@/constants/loginContext";

/**
 * Componente `EditProgramas` para la administración de programas.
 *
 * Este componente permite gestionar la lista de programas, seleccionar un programa,
 * editarlo y actualizar la información. Maneja la visibilidad de modales y el estado
 * de carga. También incluye referencias para los selectores de requisitos y simultaneidad.
 *
 * @component
 *
 * @returns {JSX.Element} El componente renderiza la interfaz de administración de programas.
 */
export default function EditProgramas({ navigation }) {
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
  const { user } = useContext(LoginContext);
  const [programas, setProgramas] = useState([]); // Lista de programas
  const [departamentos, setDepartamentos] = useState([])
  const [loading, setLoading] = useState(false); // Estado de carga
  const [programaSelected, setProgramaSelected] = useState(initPrograma); // Programa seleccionado
  const [editable, setEditable] = useState(true); // Indica si el programa es editable
  const [update, setUpdate] = useState(true); // Indica si se debe actualizar
  const [visibleModal, setVisibleModal] = useState(false); // Visibilidad del modal de éxito
  const [successResult, setSuccessResult] = useState(false); // Resultado de la operación de éxito

  // Referencias a los selectores
  const select = useRef();
  const selectRequisito = useRef();
  const selectSimultaneo = useRef();
  const selectDepartamento = useRef();

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

  /**
   * Obtiene todos los programas desde el servidor y actualiza el estado `programas`.
   *
   * @param {boolean} [loadingS=false] Indica si la carga ya está en curso.
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
          setProgramas(data.filter(x => JSON.parse(user.departamentos).includes(x.departamento)));
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
    setLoading(true);

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
          console.log(`Fetch error to: ${url}`, error);
          setLoading(false); // Desactiva el estado de carga en caso de error
        });
    } catch (error) {}
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
    <View
      style={{ ...styles.admin.overlay_top, flex: 1, position: "relative" }}
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
      {update && (
        <SelectDropdown
          data={programas}
          ref={select}
          renderButton={(selectedItem, isOpen) => {
            return (
              <View
                style={{
                  minHeight: 50,
                  backgroundColor: theme.colors.secondary,
                  borderRadius: 10,
                  position: "relative",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  marginVertical: 25,
                  elevation: 5,
                  width: "70%",
                }}
              >
                <Text style={{ fontSize: 18, paddingHorizontal: 15 }}>
                  {(selectedItem &&
                    `${selectedItem.clave} - ${selectedItem.nombre}`) ||
                    "Selecciona un programa"}
                </Text>
                <Icon
                  name="chevron-down"
                  size={18}
                  color={"black"}
                  style={{
                    position: "absolute",
                    right: 10,
                    height: 48,
                    textAlignVertical: "center",
                  }}
                />
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
            return <Icon name={"magnifying-glass"} color={"black"} size={18} />;
          }}
        />
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
                      disabled
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
                    textColor="black"
                    buttonColor={theme.colors.tertiary}
                    onPress={() => {
                      handleSubmit();
                    }}
                  >
                    {editable ? "Guardar" : "Actualizar"}
                  </Button>
                  <Button
                    mode="elevated"
                    textColor="black"
                    buttonColor={theme.colors.secondary}
                    onPress={() => navigation.goBack()}
                  >
                    Cancelar
                  </Button>
                </View>

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

        {/* Modal para editar nombres de los temas y añadir los mismos */}
        <ModalEditVars
          visible={visibleModalSubtopic}
          setVisible={setVisibleModalSubtopic}
          title={`Nombre del tema ${
            getTemaData(subtitleToAdd) && getTemaData(subtitleToAdd)[1]
          }`}
          onChangeText={setNameToAdd}
          defaultValue={
            typeOfSub === "edit" ? getTemaData(subtitleToAdd)[2] : ""
          }
          disabled={nameToAdd === ""}
          onSubmit={typeOfSub === "edit" ? editTema : handleAddTema}
        />

        {/* Modal para editar las horas de un tema */}
        <ModalEditVars
          visible={visibleModalHours}
          setVisible={setVisibleModalHours}
          title={`Horas del tema ${
            getTemaData(subtitleToAdd) && getTemaData(subtitleToAdd)[1]
          }`}
          onChangeText={setHoursToAdd}
          defaultValue={
            typeOfSub === "edit" ? getTemaData(subtitleToAdd)[4] : ""
          }
          disabled={hoursToAdd === ""}
          onSubmit={editHours}
          numpad={true}
        />
      </Portal>
    </View>
  );
}
