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
} from "react-native-paper";
import {
  View,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/FontAwesome6";
import IconFeather from "react-native-vector-icons/Feather";
import { Formik } from "formik";
import { maestroSchema } from "@/constants/schemas";
import DatePicker from "react-native-date-picker";
import { adjustTimeZone, getDateFormat, setDateTimeZone } from "@/hooks/date";
import WeekdaySelector from "@/components/WeekDaySelect";

export default function MaestrosAdmin({ navigation }) {
  const initMaestro = {
    id: 0,
    codigo: "",
    rol: 3,
    correo: "",
    telefono: "",
    nombre: "",
    apellido: "",
    carrera: "",
    centro: "",
    situacion: 1,
  };
  const carreras = [
    "ICOM",
    "INNI",
    "LCMA",
    "LIFI",
    "INBI",
    "ICIV",
    "LIAB",
    "INCE",
    "Topografía",
    "IGFO",
  ];

  const situaciones = [
    {
      id: 1,
      situacion: "Activo",
    },
    {
      id: 2,
      situacion: "Inactivo",
    },
  ];

  const centros = ["CUCEI", "CUCS"];
  const [profesores, setProfesores] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [academias, setAcademias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [maestroSelected, setMaestroSelected] = useState(initMaestro);
  const [editable, setEditable] = useState(false);
  const [update, setUpdate] = useState(true);
  const [visibleModal, setVisibleModal] = useState(false);
  const [successResult, setSuccessResult] = useState(false);
  const select = useRef();
  const selectCarrera = useRef();
  const selectCentro = useRef();
  const selectSituacion = useRef();
  const selectAcademia = useRef();
  const selectDepartamento = useRef();

  /**
   * Funcion para obtener la lista de informacion de los maestros.
   * 
   * @param {Boolean} loadingS Variable para saber si ya está cargando el loader o no
   */
  const fetchMaestros = (loadingS = false) => {
    if (!loadingS) {
      setLoading(true);
      setMaestroSelected(initMaestro);
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

      fetch(`${process.env.EXPO_PUBLIC_API_URL}/profesores`, options)
        .then((response) => response.json())
        .then((data) => {
          setProfesores(data);
        })
        .then(() => setLoading(false))
        .catch((error) => {
          console.log(
            `Fetch error to: ${process.env.EXPO_PUBLIC_API_URL}/profesores`,
            error
          );
        });
    } catch (error) {}
  };

  /**
   * Funcion para obtener la lista de todos los departamentos.
   */
  const fetchDepartamentosAcademias = () => {
    setLoading(true);

    try {
      const options = {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      };

      const urlDepartamentos = `${process.env.EXPO_PUBLIC_API_URL}/departamentos`;
      const urlAcademias = `${process.env.EXPO_PUBLIC_API_URL}/academias`;

      fetch(urlDepartamentos, options)
        .then((response) => response.json())
        .then((data) => {
          setDepartamentos(data)
        })
        .catch((error) => {
          console.log(`Fetch error to: ${urlDepartamentos}`, error);
        });
        
      fetch(urlAcademias, options)
      .then((response) => response.json())
      .then((data) => {
        setAcademias(data)
      })
      .catch((error) => {
        console.log(`Fetch error to: ${urlAcademias}`, error);
      });
    } catch (error) {}
  }

  /**
   * Funcion para modificar los datos actuales del profesor.
   * 
   * @param {Object} values Valores del formulario Formik con los datos del profesor. 
   */
  const updateFun = (values) => {
    setLoading(true);
    
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(values),
      };

      const url = `${process.env.EXPO_PUBLIC_API_URL}/users/${
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
              fetchMaestros(true);
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
   * Funcion para borrar del registro cualquier profesor seleccionado.
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

      const url = `${process.env.EXPO_PUBLIC_API_URL}/users/delete/${maestroSelected.id}`;

      fetch(url, options)
        .then((response) => {
          if (response.status === 200) {
            Alert.alert(
              "Alumno eliminado",
              "Se ha eliminado el registro correctamente",
              [
                {
                  text: "Ok",
                  style: "cancel",
                  onPress: () => fetchMaestros(),
                },
              ]
            );
          } else {
            Alert.alert("Error", "Ha ocurrido un error al eliminar al alumno", [
              {
                text: "Ok",
                style: "cancel",
              },
            ]);
          }
        })
        .catch((error) => {
          console.log(`Fetch error to: ${url}`, error);
        });
    } catch (error) {}
  };

  /**
   * Ejecuta primeramente la funcion para poder obtener toda la informacion de los profesores, departamentos y academias.
   */
  useEffect(() => {
    fetchMaestros();
    fetchDepartamentosAcademias();
  }, []);

  /**
   * Cambia el estado de todos los selects para mostrar la informacion precisa de cada profesor.
   */
  useEffect(() => {
    selectCarrera.current?.selectIndex(
      carreras.findIndex((x) => x === maestroSelected?.carrera)
    );
    selectCentro.current?.selectIndex(
      centros.findIndex((x) => x === maestroSelected?.centro)
    );
    selectSituacion.current?.selectIndex(
      situaciones.findIndex((x) => x.id === maestroSelected?.situacion) 
    );
    selectAcademia.current?.selectIndex(
      academias.findIndex((x) => x.id === maestroSelected?.academia) 
    );
    selectDepartamento.current?.selectIndex(
      departamentos.findIndex((x) => x.id === maestroSelected?.departamento) 
    );
  }, [maestroSelected]);

  /**
   * Reinicia el formulario a valores iniciales cuando la funcion de update cambia.
   */
  useEffect(() => {
    setMaestroSelected(initMaestro);
  }, [update]);

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
          <Text>Correo o codigo a buscar:</Text>
          <View style={{ ...styles.general.center, flexDirection: "row" }}>
            <SelectDropdown
              data={profesores}
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
                        `${selectedItem.nombre} ${selectedItem.apellido}`) ||
                        "Selecciona un maestro"}
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
                    {item.id} - {item.correo}
                  </Text>
                </View>
              )}
              onSelect={(item) => setMaestroSelected(item)}
              defaultValue={maestroSelected}
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
              onPress={() => fetchMaestros(false)}
              style={{ backgroundColor: theme.colors.tertiary }}
            />
          </View>
        </View>
      )}
      {(maestroSelected.id !== 0 || !update) && (
        <Formik
          initialValues={maestroSelected}
          validationSchema={maestroSchema}
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
                  <View
                    style={{
                      width: "90%",
                      marginHorizontal: "auto",
                      height: "auto",
                      backgroundColor: theme.colors.secondary_op,
                      marginVertical: 10,
                      borderRadius: 20,
                      elevation: 5,
                    }}
                  >
                    <View
                      style={{
                        ...styles.general.center,
                        width: "97%",
                        marginTop: 10,
                      }}
                    >
                      <Text style={{ ...styles.general.title, fontSize: 20 }}>
                        Info del alumno
                      </Text>
                    </View>

                    <View style={{ ...styles.general.center, width: "97%" }}>
                      <View
                        style={{
                          marginTop: 20,
                          flexDirection: "row",
                        }}
                      >
                        <Text
                          style={{
                            paddingHorizontal: 10,
                            textAlignVertical: "center",
                            width: "30%",
                          }}
                        >
                          Nombre(s):
                        </Text>
                        <TextInput
                          style={{
                            ...styles.general.button_input,
                            width: "65%",
                            marginVertical: "auto",
                            marginTop: 0,
                          }}
                          editable={editable || !update}
                          onChangeText={handleChange("nombre")}
                          value={values?.nombre}
                        />
                      </View>
                    </View>

                    <View style={{ ...styles.general.center, width: "97%" }}>
                      <View
                        style={{
                          marginTop: 20,
                          flexDirection: "row",
                        }}
                      >
                        <Text
                          style={{
                            paddingHorizontal: 10,
                            textAlignVertical: "center",
                            width: "30%",
                          }}
                        >
                          Apellidos:
                        </Text>
                        <TextInput
                          style={{
                            ...styles.general.button_input,
                            width: "65%",
                            marginVertical: "auto",
                            marginTop: 0,
                          }}
                          editable={editable || !update}
                          onChangeText={handleChange("apellido")}
                          value={values?.apellido}
                        />
                      </View>
                    </View>

                    <View style={{ ...styles.general.center, width: "97%" }}>
                      <View
                        style={{
                          marginTop: 20,
                          flexDirection: "row",
                        }}
                      >
                        <Text
                          style={{
                            paddingHorizontal: 10,
                            textAlignVertical: "center",
                            width: "30%",
                          }}
                        >
                          Codigo:
                        </Text>
                        <TextInput
                          style={{
                            ...styles.general.button_input,
                            width: "65%",
                            marginVertical: "auto",
                            marginTop: 0,
                          }}
                          editable={editable || !update}
                          onChangeText={handleChange("codigo")}
                          value={values?.codigo}
                        />
                      </View>
                    </View>

                    <View style={{ ...styles.general.center, width: "97%" }}>
                      <View
                        style={{
                          marginTop: 20,
                          flexDirection: "row",
                        }}
                      >
                        <Text
                          style={{
                            paddingHorizontal: 10,
                            textAlignVertical: "center",
                            width: "30%",
                          }}
                        >
                          Correo:
                        </Text>
                        <TextInput
                          style={{
                            ...styles.general.button_input,
                            width: "65%",
                            marginVertical: "auto",
                            marginTop: 0,
                          }}
                          editable={editable || !update}
                          onChangeText={handleChange("correo")}
                          value={values?.correo}
                        />
                      </View>
                    </View>

                    <View style={{ ...styles.general.center, width: "97%" }}>
                      <View
                        style={{
                          marginTop: 20,
                          flexDirection: "row",
                        }}
                      >
                        <Text
                          style={{
                            paddingHorizontal: 10,
                            textAlignVertical: "center",
                            width: "30%",
                          }}
                        >
                          Telefono:
                        </Text>
                        <TextInput
                          style={{
                            ...styles.general.button_input,
                            width: "65%",
                            marginVertical: "auto",
                            marginTop: 0,
                          }}
                          editable={editable || !update}
                          onChangeText={handleChange("telefono")}
                          keyboardType="phone-pad"
                          value={values?.telefono}
                        />
                      </View>
                    </View>

                    <View style={{ ...styles.general.center, width: "97%" }}>
                      <View
                        style={{
                          marginTop: 20,
                          flexDirection: "row",
                        }}
                      >
                        <Text
                          style={{
                            paddingHorizontal: 10,
                            textAlignVertical: "center",
                            width: "30%",
                          }}
                        >
                          Carrera:
                        </Text>
                        <SelectDropdown
                          data={carreras}
                          disabled={!editable && update}
                          ref={selectCarrera}
                          renderButton={(selectedItem, isOpen) => {
                            return (
                              <View
                                style={{
                                  ...styles.general.button_input,
                                  width: "65%",
                                  marginVertical: "auto",
                                  marginTop: 0,
                                  paddingVertical: 5,
                                }}
                              >
                                <Text>
                                  {(selectedItem && `${selectedItem}`) ||
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
                              <Text>{item}</Text>
                            </View>
                          )}
                          onSelect={(item) => setFieldValue("carrera", item)}
                          search
                          dropdownStyle={{ borderRadius: 10, height: 300 }}
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

                    <View style={{ ...styles.general.center, width: "97%" }}>
                      <View
                        style={{
                          marginTop: 20,
                          flexDirection: "row",
                        }}
                      >
                        <Text
                          style={{
                            paddingHorizontal: 10,
                            textAlignVertical: "center",
                            width: "30%",
                          }}
                        >
                          Centro:
                        </Text>
                        <SelectDropdown
                          data={centros}
                          disabled={!editable && update}
                          ref={selectCentro}
                          renderButton={(selectedItem, isOpen) => {
                            return (
                              <View
                                style={{
                                  ...styles.general.button_input,
                                  width: "65%",
                                  marginVertical: "auto",
                                  marginTop: 0,
                                  paddingVertical: 5,
                                }}
                              >
                                <Text>
                                  {(selectedItem && `${selectedItem}`) ||
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
                              <Text>{item}</Text>
                            </View>
                          )}
                          onSelect={(item) => setFieldValue("centro", item)}
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
                        width: "97%",
                      }}
                    >
                      <View
                        style={{
                          marginTop: 20,
                          flexDirection: "row",
                        }}
                      >
                        <Text
                          style={{
                            paddingHorizontal: 10,
                            textAlignVertical: "center",
                            width: "30%",
                          }}
                        >
                          Situación:
                        </Text>
                        <SelectDropdown
                          data={situaciones}
                          disabled={!editable && update}
                          ref={selectSituacion}
                          renderButton={(selectedItem, isOpen) => {
                            return (
                              <View
                                style={{
                                  ...styles.general.button_input,
                                  width: "65%",
                                  marginVertical: "auto",
                                  marginTop: 0,
                                  paddingVertical: 5,
                                }}
                              >
                                <Text>
                                  {(selectedItem &&
                                    `${selectedItem.situacion}`) ||
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
                                {item.id} - {item.situacion}
                              </Text>
                            </View>
                          )}
                          onSelect={(item) =>
                            setFieldValue("situacion", item.id)
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

                    {(maestroSelected.rol === 4 && academias.length > 0) &&
                    <View
                      style={{
                        ...styles.general.center,
                        width: "97%",
                        marginBottom: 20,
                      }}
                    >
                      <View
                        style={{
                          marginTop: 20,
                          flexDirection: "row",
                        }}
                      >
                        <Text
                          style={{
                            paddingHorizontal: 10,
                            textAlignVertical: "center",
                            width: "30%",
                          }}
                        >
                          Academia:
                        </Text>
                        <SelectDropdown
                          data={academias}
                          disabled={!editable && update}
                          ref={selectAcademia}
                          renderButton={(selectedItem, isOpen) => {
                            return (
                              <View
                                style={{
                                  ...styles.general.button_input,
                                  width: "65%",
                                  marginVertical: "auto",
                                  marginTop: 0,
                                  paddingVertical: 5,
                                }}
                              >
                                <Text>
                                  {(selectedItem &&
                                    `${selectedItem.academia}`) ||
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
                                {item.academia}
                              </Text>
                            </View>
                          )}
                          onSelect={(item) =>
                            setFieldValue("academia", item.id)
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
                    }
                    
                    {(maestroSelected.rol === 5 && departamentos.length > 0) &&
                    <View
                      style={{
                        ...styles.general.center,
                        width: "97%",
                        marginBottom: 20,
                      }}
                    >
                      <View
                        style={{
                          marginTop: 20,
                          flexDirection: "row",
                        }}
                      >
                        <Text
                          style={{
                            paddingHorizontal: 10,
                            textAlignVertical: "center",
                            width: "30%",
                          }}
                        >
                          Departamento:
                        </Text>
                        <SelectDropdown
                          data={departamentos}
                          disabled={!editable && update}
                          ref={selectDepartamento}
                          renderButton={(selectedItem, isOpen) => {
                            return (
                              <View
                                style={{
                                  ...styles.general.button_input,
                                  width: "65%",
                                  marginVertical: "auto",
                                  marginTop: 0,
                                  paddingVertical: 5,
                                }}
                              >
                                <Text>
                                  {(selectedItem &&
                                    `${selectedItem.departamento}`) ||
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
                    }
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
                    style={{ ...(!maestroSelected && { marginTop: 10 }) }}
                    textColor="black"
                    buttonColor={theme.colors.tertiary}
                    onPress={() =>
                      navigation.navigate("Horario", {
                        alumnoId: maestroSelected.id,
                      })
                    }
                    disabled={maestroSelected.rol === 4}
                  >
                    Horario
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
                        "Eliminar usuario",
                        "Estás seguro de eliminar a este usuario?",
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
                Maestro {update ? "modificado" : "agregado"} correctamente!
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
      </Portal>
    </View>
  );
}
