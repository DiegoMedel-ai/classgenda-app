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
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/FontAwesome6";
import IconFeather from "react-native-vector-icons/Feather";
import { Formik } from "formik";
import { programaSchema } from "@/constants/schemas";

export default function ListProfesores({navigation}) {
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
  };
  const [materias, setMaterias] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [programaSelected, setProgramaSelected] = useState();
  const [editable, setEditable] = useState(false);
  const [update, setUpdate] = useState(true);
  const [visibleModal, setVisibleModal] = useState(false);
  const [successResult, setSuccessResult] = useState(false);
  const [openInitHour, setOpenInitHour] = useState(false);
  const [openFinalHour, setOpenFinalHour] = useState(false);
  const select = useRef();
  const selectRequisito = useRef();
  const selectSimultaneo = useRef();

  const fetchProgramas = (loadingS = false) => {
    if (!loadingS) {
      setLoading(true);
      setProgramaSelected();
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

  useEffect(() => {
    fetchProgramas();
  }, []);

  useEffect(() => {
    fetchProfesores();
  }, [programaSelected]);

  const fetchProfesores = () => {
    setLoading(true);
    try {
      const options = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      };

      fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/profesores/materia/${programaSelected.clave}`,
        options
      )
        .then((response) => response.json())
        .then((data) => {
          setProfesores(data);
        })
        .then(() => setLoading(false))
        .catch((error) => {
          console.log(
            `Fetch error to: ${process.env.EXPO_PUBLIC_API_URL}/profesores/materia/${programaSelected.clave}`,
            error
          );
        });
    } catch (error) {}
  };

  return (
    <View
      style={{ ...styles.admin.overlay_top, flex: 1, position: "relative" }}
    >
      <View
        style={{
          height: 220,
          width: "100%",
          backgroundColor: theme.colors.secondary_op,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          flexDirection: "column",
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          marginBottom: 20,
        }}
      >
        <Text style={{width: '100%', textAlign: 'center', fontSize: 24, paddingBottom: 40, paddingTop: 80}}>
            Lista de profesores
        </Text>
        <SelectDropdown
          data={programas}
          ref={select}
          renderButton={(selectedItem, isOpen) => {
            return (
              <View
                style={{
                  height: 50,
                  maxHeight: 100,
                  top: 15,
                  backgroundColor: theme.colors.secondary,
                  borderRadius: 10,
                  justifyContent: "center",
                  marginHorizontal: 'auto',
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
      </View>

      {profesores && programaSelected && (
        <View
          style={{
            flex: 1,
            paddingTop: 30,
            paddingBottom: "10%",
            paddingHorizontal: 20,
          }}
        >
          <ScrollView
            contentContainerStyle={{
              elevation: 5,
              marginBottom: "10%",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 15,
              alignItems: "center",
              width: "90%",
              marginHorizontal: "auto",
              backgroundColor: theme.colors.secondary_op,
            }}
          >
            {profesores.length === 0 && (
              <Text>Todavia no hay profesores enlistados</Text>
            )}
            {profesores.map((profesor, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  width: "100%",
                  height: "auto",
                  backgroundColor: "white",
                  marginVertical: 10,
                  borderRadius: 15,
                  padding: 10,
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
                onPressIn={() => navigation.navigate("ProfesorDetails", { maestroId: profesor.profesor.id })}
              >
                <Image
                  style={{
                    height: 35,
                    width: 35,
                    borderRadius: 50,
                    marginRight: 10,
                  }}
                  source={
                    profesor.profesor.foto_url
                      ? {
                          uri: `${process.env.EXPO_PUBLIC_STORAGE_IMAGE_URL}/img/${profesor.profesor.foto_url}`,
                        }
                      : require("@/assets/images/user.png")
                  }
                />
                <Text style={{ width: "90%" }}>
                  ID: {profesor.profesor.id} - {profesor.profesor.nombre}{" "}
                  {profesor.profesor.apellido}
                </Text>
              </TouchableOpacity>
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
