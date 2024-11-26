import { useState, useEffect, useRef } from "react";
import { View, ImageBackground, ActivityIndicator, Alert } from "react-native";
import { Text, Button } from "react-native-paper";
import {
  TextInput as Input,
  HelperText,
  Menu,
  Divider,
  Portal,
  Modal
} from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";
import { styles } from "@/constants/styles";
import theme from "@/constants/theme";
import Icon from "react-native-vector-icons/Feather";
import { Formik } from "formik";
import { signUpSchema } from "@/constants/schemas";

/**
 * Pantalla para poder registrar nuevos usuarios en la base de datos donde se inicia como inactivo
 * @param {Navigation} navigation Hook para poder manejar la navegacion de la app
 * @returns {JSX.Element}
 */
const SignUpScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false)
  const [successResult, setSuccessResult] = useState(false)

  const itemsRol = [
    { key: "2", rol: "Estudiante" },
    { key: "3", rol: "Profesor" },
    { key: "4", rol: "Presidente de academia" },
    { key: "5", rol: "Jefe de departamento" },
  ];

  const confirmAlert = (values) => 
    Alert.alert('Confirme sus datos', 'Está seguro de que sus datos son correctos?', [
      {
        text: 'Confirmar',
        onPress: () => submitUser(values)
      },
      {
        text: 'Cancelar',
        style: 'cancel'
      }
    ])

  const submitUser = (values) => {
    setLoading(true)
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify(values)
    };
    console.log(options.body);
    

    fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/new`, options)
      .then((response) => {
        if(response.status === 200){
          setLoading(false);
          setSuccessResult(true);
          setVisibleModal(true);
          setTimeout(() => {
            setVisibleModal(false)
            navigation.navigate('Login');
          }, 1200);
        }
      })
      .catch((error) => {
        console.log("Fetch error:", error);
      });
  }

  return (
    <View style={{ backgroundColor: "white", height: "100%" }}>
      <ImageBackground
        source={require("@/assets/images/backgroundLogin.jpg")}
        style={{ ...styles.general.image, height: "100%" }}
      >
        {!loading && (
          <Formik
            initialValues={{
              nombre: "",
              apellido: "",
              correo: "",
              codigo: "",
              rol: "2",
              password: "",
              passwordConfirm: ""
            }}
            validationSchema={signUpSchema}
            onSubmit={(values) => confirmAlert(values)}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
            }) => (
              <View style={styles.general.overlay}>
                <Text
                  style={{
                    ...styles.general.title,
                    marginBottom: 20,
                    marginTop: 60,
                  }}
                >
                  Sign up
                </Text>
                <Input
                  activeOutlineColor="black"
                  style={styles.login.input_text}
                  theme={styles.login.input_text}
                  label={"Nombre"}
                  mode={"outlined"}
                  keyboardType="text"
                  onChangeText={handleChange("nombre")}
                  value={values.nombre}
                  onBlur={handleBlur("nombre")}
                />
                <HelperText
                  type="error"
                  visible={errors.nombre !== ""}
                  padding="none"
                  style={{ width: "70%" }}
                >
                  {errors.nombre}
                </HelperText>
                <Input
                  activeOutlineColor="black"
                  style={styles.login.input_text}
                  theme={styles.login.input_text}
                  label={"Apellido"}
                  mode={"outlined"}
                  keyboardType="text"
                  onChangeText={handleChange("apellido")}
                  value={values.apellido}
                  onBlur={handleBlur("apellido")}
                />
                <HelperText
                  type="error"
                  visible={errors.apellido !== ""}
                  padding="none"
                  style={{ width: "70%" }}
                >
                  {errors.apellido}
                </HelperText>
                <Input
                  activeOutlineColor="black"
                  style={styles.login.input_text}
                  theme={styles.login.input_text}
                  label={"Email"}
                  mode={"outlined"}
                  keyboardType="email-address"
                  onChangeText={handleChange("correo")}
                  value={values.correo}
                  onBlur={handleBlur("correo")}
                />
                <HelperText
                  type="error"
                  visible={errors.correo !== ""}
                  padding="none"
                  style={{ width: "70%" }}
                >
                  {errors.correo}
                </HelperText>

                <View style={{ flexDirection: "row" }}>
                  <Input
                    activeOutlineColor="black"
                    style={{
                      ...styles.login.input_text,
                      width: "50%",
                      marginRight: 10,
                    }}
                    theme={styles.login.input_text}
                    label={"Codigo"}
                    mode={"outlined"}
                    onChangeText={handleChange("codigo")}
                    value={values.codigo}
                    onBlur={handleBlur("codigo")}
                  />
                  <SelectDropdown
                    data={itemsRol}
                    render
                    renderButton={(selectedItem, isOpen) => {
                      return (
                        <View>
                          <Input
                            activeOutlineColor="black"
                            style={{
                              ...styles.login.input_text,
                              width: "auto",
                              marginLeft: 10,
                            }}
                            readOnly
                            theme={styles.login.input_text}
                            label={"Rol"}
                            mode={"outlined"}
                            value={
                              itemsRol.find((x) => x.key === values.rol)?.rol
                            }
                            right={
                              <Input.Icon
                              disabled
                                icon="chevron-down"
                                color="black"
                                size={20}
                              />
                            }
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
                        <Text>{item?.rol}</Text>
                      </View>
                    )}
                    onSelect={(item) => setFieldValue("rol", item?.key)}
                    defaultValue={itemsRol.find((x) => x.key === 2)}
                    dropdownStyle={{ borderRadius: 10 }}
                  />
                </View>
                <HelperText
                  type="error"
                  visible={errors.codigo !== ""}
                  padding="none"
                  style={{ width: "50%", marginHorizontal: 'auto' }}
                >
                  {errors.codigo}
                </HelperText>

                <Input
                  activeOutlineColor="black"
                  style={{...styles.login.input_text, marginTop: 0, width: '55%'}}
                  theme={styles.login.input_text}
                  label={"Password"}
                  mode={"outlined"}
                  keyboardType="text"
                  onChangeText={handleChange("password")}
                  value={values.password}
                  onBlur={handleBlur("password")}
                />
                <HelperText
                  type="error"
                  visible={errors.password !== ""}
                  padding="none"
                  style={{ width: "50%", marginHorizontal: 'auto' }}
                >
                  {errors.password}
                </HelperText>

                <Input
                  activeOutlineColor="black"
                  style={{...styles.login.input_text, width: '55%'}}
                  theme={styles.login.input_text}
                  label={"Confirmar password"}
                  mode={"outlined"}
                  keyboardType="text"
                  onChangeText={handleChange("passwordConfirm")}
                  value={values.passwordConfirm}
                  onBlur={handleBlur("passwordConfirm")}
                />
                <HelperText
                  type="error"
                  visible={errors.passwordConfirm !== ""}
                  padding="none"
                  style={{ width: "50%", marginHorizontal: 'auto' }}
                >
                  {errors.passwordConfirm}
                </HelperText>

                <Button
                  mode="contained"
                  style={{...styles.general.button, marginTop: 10, backgroundColor: theme.colors.tertiary}}
                  icon={() => (
                    <Icon name="arrow-right" color="white" size={20} />
                  )}
                  contentStyle={{ flexDirection: "row-reverse" }}
                  onPress={handleSubmit}
                >
                  <Text style={styles.general.button_text}>Sign up</Text>
                </Button>
              </View>
            )}
          </Formik>
        )}
      </ImageBackground>
      <Portal>
        <Modal
          visible={visibleModal}
          onDismiss={() => setVisibleModal(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 30,
            width: '70%',
            margin: 'auto',
            borderRadius: 30,
          }}>
          {successResult ? (
            <View style={{alignItems: 'center'}}>
              <Icon name="check-circle" color="green" size={40} />
              <Text style={{textAlign: 'center', marginTop: 10}}>
                Usuario agregado correctamente!
              </Text>
            </View>
          ) : (
            <View style={{alignItems: 'center'}}>
              <Icon
                name="x-circle"
                color={theme.colors.error}
                size={40}
              />
              <Text style={{textAlign: 'center', marginTop: 10}}>
                Hubo un error
              </Text>
            </View>
          )}
        </Modal>
      </Portal>

      {loading && (
        <View style={styles.general.overlay_loader}>
          <ActivityIndicator size={"large"} color={"#4DBFE4"} />
        </View>
      )}
    </View>
  );
};

export default SignUpScreen;
