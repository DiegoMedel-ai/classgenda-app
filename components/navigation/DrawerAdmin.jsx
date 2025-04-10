import React, { useContext, useState, useEffect } from "react";
import { View, Image, ImageBackground } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Drawer, Chip, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginContext from "@/constants/loginContext";
import Icon from "react-native-vector-icons/FontAwesome6";
import { styles } from "@/constants/styles";
import theme from "@/constants/theme";

function DrawerAdmin(props) {
  const { user, getUser, profileImage, setProfileImage } = useContext(LoginContext);

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
        setProfileImage(data.foto_url)
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

  const items = [
    {
      label: "Inicio",
      icon: "house",
      route: "Home",
      condition: !user.rol?.includes('profesor'),
    },
    {
      label: "Horario",
      icon: "calendar",
      route: "Home",
      condition: user.rol?.includes('profesor')
    },
    {
      label: "Horario",
      icon: "calendar",
      route: "Horario",
      condition: user.rol?.includes('estudiante')
    },
    {
      label: "Alumnos",
      icon: "user-group",
      route: "Alumnos",
      condition: user.rol?.includes('admin')
    },
    {
      label: "Maestros",
      icon: "users-between-lines",
      route: "Maestros",
      condition: user.rol?.includes('admin')
    },
    {
      label: "Materias",
      icon: "ruler",
      route: "Materias",
      condition: user.rol?.includes('admin')
    },
    {
      label: "Programas",
      icon: "code",
      route: "Programas",
      condition: user.rol?.includes('admin')
    },
    {
      label: "Malla curricular",
      icon: "table",
      route: "Malla",
      condition: user.rol?.includes('estudiante')
    },
  ]

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
              source={
                profileImage
                  ? {
                      uri: `${process.env.EXPO_PUBLIC_STORAGE_IMAGE_URL}/img/${profileImage}`,
                    }
                  : require("@/assets/images/user.png")}
              style={styles.drawer.profileImage}
            />
            <Chip style={{marginVertical: 5, alignSelf: 'flex-start', backgroundColor: theme.colors.secondary }}>{userInfo.nombre}</Chip>
            <Chip style={{marginVertical: 5, alignSelf: 'flex-start', backgroundColor: theme.colors.tertiary }}>Codigo: {userInfo.codigo}</Chip>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.drawer.drawerSection}>
        {items.map((item, index) => (
          <View key={index}>
            {item.condition &&
              <Drawer.Item
                icon={({ color, size }) => (
                  <View style={{ width: 30, alignItems: 'center' }}>
                    <Icon name={item.icon} color={color} size={20} />
                  </View>
                )}
                label={item.label}
                onPress={() => props.navigation.navigate(item.route)}
              />
            }
          </View>
        ))}
      </View>

      <View style={styles.drawer.bottomDrawerSection}>
        {(user.rol?.includes('estudiante') || user.rol?.includes('profesor')) &&
        <Drawer.Item
          icon={({ color, size }) => (
            <View style={{ width: 30, alignItems: 'center' }}>
              <Icon name="gear" color={color} size={20} />
            </View>
          )}
          label="Configuración"
          onPress={() => props.navigation.navigate("OptionsPerfil")}
        />
        }
        <Drawer.Item
          icon={({ color, size }) => (
            <View style={{ width: 30, alignItems: 'center' }}>
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
