import React, { useContext, useState, useEffect } from "react";
import { View, Text, Image, ImageBackground } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Drawer, Chip } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginContext } from "../MainComponent";
import Icon from "react-native-vector-icons/FontAwesome6";
import { styles } from "@/constants/styles";
import theme from "@/constants/theme";

function DrawerAdmin(props) {
  const { user, getUser } = useContext(LoginContext);

  const [userInfo, setUserInfo] = useState({nombre: '', foto_url: ''})

  useEffect(() => {
    const options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({id: user.id})
      };      

      fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/show`, options)
      .then((response) => response.json())
      .then((data) => {
        setUserInfo(data)
      })
      .catch((error) => {
        console.log("Fetch error:", error);
      });
  }, [])
  

  const handleSignOut = async () => {
    await AsyncStorage.removeItem("user:id");
    await AsyncStorage.removeItem("user:rol");
    getUser();
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawer.container}
    >
      <View style={{ ...styles.drawer.profileSection }}>
        <ImageBackground
          source={require("@/assets/images/backgroundUser.jpeg")}
          style={{
            ...styles.general.image,
            height: 230,
            width: "100%",
            paddingVertical: 30,
          }}
        >
          <View style={{ padding: 20 }}>
            <Image
              source={require("@/assets/images/user.png")}
              style={styles.drawer.profileImage}
            />
            <Chip style={{marginVertical: 5, alignSelf: 'flex-start', backgroundColor: theme.colors.secondary }}>{userInfo.nombre}</Chip>
            <Chip style={{marginVertical: 5, alignSelf: 'flex-start', backgroundColor: theme.colors.tertiary }}>Codigo: {user.id}</Chip>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.drawer.drawerSection}>
        <Drawer.Item
          icon={({ color, size }) => (
            <View style={{ width: 30 }}>
              <Icon name="house" color={color} size={20} />
            </View>
          )}
          label="Inicio"
          onPress={() => props.navigation.navigate("Home")}
        />
        <Drawer.Item
          icon={({ color, size }) => (
            <View style={{ width: 30 }}>
              <Icon name="user-group" color={color} size={20} />
            </View>
          )}
          label="Alumnos"
          onPress={() => props.navigation.navigate("Alumnos")}
        />
        <Drawer.Item
          icon={({ color, size }) => (
            <View style={{ width: 30 }}>
              <Icon name="users-between-lines" color={color} size={20} />
            </View>
          )}
          label="Maestros"
          onPress={() => props.navigation.navigate("Maestros")}
        />
        <Drawer.Item
          icon={({ color, size }) => (
            <View style={{ width: 30 }}>
              <Icon name="ruler" color={color} size={20} />
            </View>
          )}
          label="Materias"
          onPress={() => props.navigation.navigate("Materias")}
        />
        <Drawer.Item
          icon={({ color, size }) => (
            <View style={{ width: 30 }}>
              <Icon name="code" color={color} size={20} />
            </View>
          )}
          label="Programas"
          onPress={() => props.navigation.navigate("Programas")}
        />
      </View>

      <View style={styles.drawer.bottomDrawerSection}>
        <Drawer.Item
          icon={({ color, size }) => (
            <View style={{ width: 30 }}>
              <Icon name="gear" color={color} size={20} />
            </View>
          )}
          label="Configuración"
          onPress={() => props.navigation.navigate("Configuracion")}
        />
        <Drawer.Item
          icon={({ color, size }) => (
            <View style={{ width: 30 }}>
              <Icon name="arrow-right-from-bracket" color={color} size={20} />
            </View>
          )}
          label="Cerrar sesión"
          onPress={handleSignOut}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default DrawerAdmin;
