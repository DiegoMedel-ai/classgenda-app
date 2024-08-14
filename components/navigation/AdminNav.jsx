import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeAdmin from "@/components/Admin/Home";
import DrawerAdmin from "./DrawerAdmin";
import theme from "@/constants/theme";
import { styles } from "@/constants/styles";
import { Text } from "react-native-paper";
import ProgramasAdmin from "@/components/Admin/Programas";
import MateriasAdmin from "@/components/Admin/Materias";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeAdmin}
        options={{
          headerTitleAlign: "center",
          headerTitle: (props) => (
            <Text style={styles.general.drawer_title}>Bienvenido</Text>
          ),
          headerStyle: styles.general.drawer_style,
          headerBackgroundContainerStyle: {
            backgroundColor: theme.colors.primary_op,
          },
        }}
      />
    </Stack.Navigator>
  );
}

function ProgramaStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProgramasHome"
        component={ProgramasAdmin}
        options={{
          headerTitleAlign: "center",
          headerTitle: (props) => (
            <Text style={styles.general.drawer_title}>Programas</Text>
          ),
          headerStyle: styles.general.drawer_style,
          headerBackgroundContainerStyle: {
            backgroundColor: theme.colors.white,
          },
        }}
      />
    </Stack.Navigator>
  );
}

function MateriaStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MateriasHome"
        component={MateriasAdmin}
        options={{
          headerTitleAlign: "center",
          headerTitle: (props) => (
            <Text style={styles.general.drawer_title}>Programas</Text>
          ),
          headerStyle: styles.general.drawer_style,
          headerBackgroundContainerStyle: {
            backgroundColor: theme.colors.white,
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default function AdminNav() {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerAdmin {...props} />}>
      <Drawer.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          headerTitle: "",
          headerStyle: { backgroundColor: theme.colors.tertiary_op },
        }}
      />
      <Drawer.Screen
        name="Programas"
        component={ProgramaStack}
        options={{
          headerTitle: "",
          headerStyle: { backgroundColor: theme.colors.tertiary_op },
        }}
      />
      <Drawer.Screen
        name="Materias"
        component={MateriaStack}
        options={{
          headerTitle: "",
          headerStyle: { backgroundColor: theme.colors.tertiary_op },
        }}
      />
    </Drawer.Navigator>
  );
}
