import { Formik } from "formik";
import { useEffect, useState, useContext } from "react";
import LoginContext from "@/constants/loginContext";
import {
  View,
  TextInput,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { styles } from "@/constants/styles";
import theme from "@/constants/theme";
import { Button, Text } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { Toast, ALERT_TYPE } from "react-native-alert-notification";

const ConfigPerfil = ({ route }) => {
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState({});
  const { userId } = route.params;
  const { setProfileImage } = useContext(LoginContext);

  const fetchUsuario = () => {
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
        `${process.env.EXPO_PUBLIC_API_URL}/users/getAllInfo/${userId}`,
        options
      )
        .then((response) => response.json())
        .then((data) => {
            setProfileImage(data.foto_url)
          setUsuario(data);
        })
        .then(() => setLoading(false))
        .catch((error) => {
          console.log(
            `Fetch error to: ${process.env.EXPO_PUBLIC_API_URL}/users/getAllInfo`,
            error
          );
        });
    } catch (error) {}
  };

  useEffect(() => {
    fetchUsuario();
  }, []);

  const getMimeType = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      default:
        return null;
    }
  };

  const uploadFile = async (file, tema) => {
    setLoading(true);

    const mimeType = getMimeType(file.name);

    if (!mimeType) {
      Toast.show({
        type: ALERT_TYPE.ERROR,
        title: "Formato no soportado",
        textBody: "Solo se permiten imágenes JPEG, JPG o PNG.",
      });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      type: mimeType,
      name: file.name,
    });
    formData.append("userId", userId);

    const url = `${process.env.EXPO_PUBLIC_API_URL}/users/storeImg`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        fetchUsuario();
      } else {
        console.error("Failed to upload file", result);
      }

      return response;
    } catch (error) {
      console.error("Error uploading file", error);
      return error;
    }
  };

  const selectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "image/jpg", "image/png"],
      });

      if (!result.canceled) {
        const resultImg = await uploadFile(result.assets[0]);
        if (resultImg.ok) {
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: "Foto modificada con exito",
            textBody: `Su foto de perfil se ha subido con exito!`,
          });
        }
      }
    } catch (err) {
      console.error("Error selecting file", err);
    }
  };

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

      const url = `${process.env.EXPO_PUBLIC_API_URL}/users/update`;

      fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: "Informacion modificada",
                textBody: `Su informacion de perfil ha sido modificada con exito!`,
              });
            setLoading(false)
          }
        })
        .catch((error) => {
          console.log(`Fetch error to: ${url}`, error);
        });
    } catch (error) {}
  };

  return (
    <View style={{ ...styles.admin.overlay_top }}>
      <View
        style={{
          backgroundColor: theme.colors.primary,
          width: "100%",
          height: "auto",
        }}
      >
        <Text
          style={{
            width: "100%",
            textAlign: "center",
            fontSize: 25,
            paddingVertical: 10,
          }}
        >
          Editar Perfil
        </Text>
      </View>
      <View style={{ width: "100%", padding: 20 }}>
        <Formik initialValues={usuario} enableReinitialize onSubmit={(values) => updateFun(values)
        }>
          {({ values, handleChange, handleSubmit }) => {
            return (
              <>
                <View
                  style={{
                    backgroundColor: theme.colors.tertiary_op,
                    width: "100%",
                    padding: 20,
                    borderRadius: 20,
                    marginBottom: 20,
                  }}
                >
                  <Text>Nombre(s):</Text>
                  <TextInput
                    style={{
                      ...styles.general.button_input,
                      width: "100%",
                      marginVertical: 5,
                      textAlign: "left",
                      paddingHorizontal: 10,
                      marginBottom: 10,
                    }}
                    value={values.nombre}
                    onChangeText={handleChange('nombre')}
                  />
                  <Text>Apellidos:</Text>
                  <TextInput
                    style={{
                      ...styles.general.button_input,
                      width: "100%",
                      marginVertical: 5,
                      textAlign: "left",
                      paddingHorizontal: 10,
                    }}
                    value={values.apellido}
                    onChangeText={handleChange('apellido')}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    marginBottom: 20
                  }}
                >
                  <View
                    style={{
                      backgroundColor: theme.colors.secondary_op,
                      width: "45%",
                      padding: 20,
                      borderRadius: 20,
                    }}
                  >
                    <Text>Foto de perfil</Text>
                    <Image
                      style={{
                        marginVertical: 10,
                        height: 100,
                        width: 100,
                        borderRadius: 50,
                        marginHorizontal: "auto",
                      }}
                      source={
                        values.foto_url
                          ? {
                              uri: `${process.env.EXPO_PUBLIC_STORAGE_IMAGE_URL}/img/${values.foto_url}`,
                            }
                          : require("@/assets/images/user.png")
                      }
                    />
                    <TouchableOpacity
                      style={{
                        ...styles.general.button_input,
                        width: "100%",
                        textAlign: "left",
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                      }}
                      onPress={() => selectFile()}
                    >
                      <Text>Seleccionar</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ width: "45%" }}>
                    <View
                      style={{
                        backgroundColor: theme.colors.primary_op,
                        width: "100%",
                        padding: 20,
                        borderRadius: 20,
                        marginBottom: 10,
                      }}
                    >
                      <Text>Codigo</Text>
                      <TextInput
                        style={{
                          ...styles.general.button_input,
                          width: "100%",
                          marginVertical: 5,
                          textAlign: "left",
                          paddingHorizontal: 10,
                          marginBottom: 10,
                        }}
                        value={values.id?.toString()}
                        editable={false}
                      />
                    </View>
                    <View
                      style={{
                        backgroundColor: theme.colors.primary_op,
                        width: "100%",
                        padding: 20,
                        borderRadius: 20,
                      }}
                    >
                      <Text>Rol</Text>
                      <TextInput
                        style={{
                          ...styles.general.button_input,
                          width: "100%",
                          marginVertical: 5,
                          textAlign: "left",
                          paddingHorizontal: 10,
                          marginBottom: 10,
                        }}
                        value={values.rol === 2 ? "Estudiante" : "Profesor"}
                        editable={false}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: theme.colors.tertiary_op,
                    width: "100%",
                    padding: 20,
                    borderRadius: 20,
                    marginBottom: 20,
                  }}
                >
                  <Text>Correo</Text>
                  <TextInput
                    style={{
                      ...styles.general.button_input,
                      width: "100%",
                      marginVertical: 5,
                      textAlign: "left",
                      paddingHorizontal: 10,
                      marginBottom: 10,
                    }}
                    value={values.correo}
                    keyboardType="email-address"
                    onChangeText={handleChange('correo')}
                  />
                  <Text>Telefono:</Text>
                  <TextInput
                    style={{
                      ...styles.general.button_input,
                      width: "100%",
                      marginVertical: 5,
                      textAlign: "left",
                      paddingHorizontal: 10,
                    }}
                    keyboardType="numeric"
                    value={values.telefono}
                    onChangeText={handleChange('telefono')}
                  />
                </View>
                <Button style={{backgroundColor: theme.colors.tertiary_op}} onPress={handleSubmit}>
                    <Text>
                        Guardar
                    </Text>
                </Button>
              </>
            );
          }}
        </Formik>
        {loading && (
          <View style={styles.general.overlay_loader}>
            <ActivityIndicator size={"large"} color={"#4DBFE4"} />
          </View>
        )}
      </View>
    </View>
  );
};

export default ConfigPerfil;
