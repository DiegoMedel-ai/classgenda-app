import { useState, useEffect, useContext } from "react";
import { ImageBackground, View, Alert, ActivityIndicator } from "react-native";
import { Text, Button, TextInput as Input, HelperText } from "react-native-paper";
import { styles } from "@/constants/styles";
import Icon from "react-native-vector-icons/Feather";
import theme from "@/constants/theme";
import { Formik } from "formik";
import { loginSchema } from "@/constants/schemas";
import LoginContext from "@/constants/loginContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Pantalla para poder ingresar a la plataforma con correo de usuario y contraseña
 * @param {Navigation} navigation Hook para poder manejar la navegacion de la app
 * @returns {JSX.Element}
 */
const Login = ({ navigation }) => {
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const { user, getUser } = useContext(LoginContext)

  const login = (values) => {
    setLoading(true)
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify(values)
    };

    fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/login`, options)
      .then((response) => {
        setLoading(false);
        if(response.status === 200){
          return response.json()
        }else if(response.status === 401) {
          setResult('Contraseña incorrecta')
        }else if(response.status === 402) {
          setResult('Correo no coincide')
        }

        setTimeout(() => {
          setResult('')
        }, 1200);
      }).then(async (data) => {
        try {
          await AsyncStorage.setItem('user:id', data.user.id.toString());
          await AsyncStorage.setItem('user:rol', data.user.rol);
          await AsyncStorage.setItem('user:departamentos', JSON.stringify(data.user.departamentos));
          
          getUser();
        } catch (error) {
          console.error('Error al guardar los datos del usuario en AsyncStorage', error);
        }
      })
      .catch((error) => {
        console.log("Fetch error:", error);
      });
  }

  return (
    <View style={{ height: "100%", backgroundColor: "white" }}>
      <ImageBackground
        source={require("@/assets/images/backgroundSignup.jpg")}
        style={{ ...styles.general.image, height: "90%" }}
      >
        <View style={styles.general.overlay}>
          <Text
            style={{
              ...styles.general.title,
              marginBottom: 50,
              marginTop: 100,
            }}
          >
            Login
          </Text>

          <Formik
            initialValues={{
              correo: '',
              password: ''
            }}
            validationSchema={loginSchema}
            onSubmit={(values) => login(values)}
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
              <>
                <Input
                  style={{
                    ...styles.login.input_text,
                    width: "70%",
                    marginVertical: 10,
                  }}
                  mode="outlined"
                  label="Email"
                  activeOutlineColor="black"
                  theme={{ roundness: 50 }}
                  onChangeText={handleChange('correo')}
                  value={values.correo}
                />
                <Input
                  style={{
                    ...styles.login.input_text,
                    width: "70%",
                    marginVertical: 10,
                  }}
                  mode="outlined"
                  label="Password"
                  activeOutlineColor="black"
                  theme={{ roundness: 50 }}
                  onChangeText={handleChange('password')}
                  value={values.password}
                />
                
                <HelperText
                  type="error"
                  visible={errors.password !== "" || errors.correo !== "" || result !== ""}
                  padding="none"
                  style={{ width: "50%", marginHorizontal: 'auto' }}
                >
                  {errors.password || errors.correo || result}
                </HelperText>

                <Button
                  mode="contained"
                  style={styles.general.button}
                  icon={() => (
                    <Icon name="arrow-right" color="white" size={20} />
                  )}
                  contentStyle={{ flexDirection: "row-reverse" }}
                  onPress={handleSubmit}
                >
                  <Text style={styles.general.button_text}>Sign in</Text>
                </Button>
              </>
            )}
          </Formik>
          <View
            style={{
              flexDirection: "row",
              marginTop: 50,
              justifyContent: "space-evenly",
              width: "100%",
            }}
          >
            {/* <Button
              mode="contained"
              style={styles.login.buttons}
              onPress={() => navigation.navigate("Login")}
            >
              <Text
                style={{
                  ...styles.login.buttons_text,
                  color: theme.colors.secondary,
                }}
              >
                Forgot password?
              </Text>
            </Button> */}
            <Button
              mode="contained"
              style={styles.login.buttons}
              onPress={() => navigation.navigate("Signup")}
            >
              <Text
                style={{
                  ...styles.login.buttons_text,
                  color: theme.colors.tertiary,
                }}
              >
                Sign Up
              </Text>
            </Button>
          </View>
        </View>
      </ImageBackground>
      {loading && (
        <View style={styles.general.overlay_loader}>
          <ActivityIndicator size={"large"} color={"#4DBFE4"} />
        </View>
      )}
    </View>
  );
};

export default Login;
