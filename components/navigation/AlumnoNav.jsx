import React, { createContext, useContext, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeAlumnos from "../Alumnos/Home";
import OptionsPrograma from "../Alumnos/OptionsPrograma";
import ProfesorDetails from "../PresidenteAcademia/InfoProfesor";
import ProgramaDetails from "../Maestros/Programa";
import HorarioAlumno from "../Alumnos/Horario";
import MallaCurricular from "../Alumnos/MallaCurricular";
import OptionsPerfil from "../OptionsPerfil";
import ConfigPerfil from "../ConfiguracionPerfil";
import DrawerAdmin from "./DrawerAdmin";
import theme from "@/constants/theme";
import LoginContext from "@/constants/loginContext";

export const HeaderContext = createContext();

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function HomeStack() {
    const { setHeaderColor, headerColor, setShownDrawerHeader } =
      useContext(HeaderContext);
    const { user } = useContext(LoginContext);
  
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeAlumnos}
          options={{
            headerShown: false,
          }}
          initialParams={{ alumnoId: user.id }}
          listeners={{
            focus: () => {
              setHeaderColor(theme.colors.primary);
              setShownDrawerHeader(true);
            },
          }}
        />
        <Stack.Screen
          name="OptionsPrograma"
          component={OptionsPrograma}
          options={{
            headerStyle: { backgroundColor: headerColor },
            headerTitle: "",
          }}
          initialParams={{ programaClave: 0, maestroId: 0 }}
          listeners={{
            focus: () => {
              setHeaderColor(theme.colors.tertiary_op);
              setShownDrawerHeader(false);
            },
          }}
        />
        <Stack.Screen
          name="ProfesorDetails"
          component={ProfesorDetails}
          options={{
            headerStyle: { backgroundColor: headerColor },
            headerTitle: "",
          }}
          initialParams={{ maestroId: 0 }}
          listeners={{
            focus: () => {
              setHeaderColor(theme.colors.tertiary_op);
              setShownDrawerHeader(false);
            },
          }}
        />
        <Stack.Screen
          name="Programa"
          component={ProgramaDetails}
          options={{
            headerStyle: { backgroundColor: headerColor },
            headerTitle: "",
          }}
          initialParams={{ programaClave: 0 }}
          listeners={{
            focus: () => {
              setHeaderColor(theme.colors.tertiary_op);
              setShownDrawerHeader(false);
            },
          }}
        />
        <Stack.Screen
          name="Horario"
          component={HorarioAlumno}
          options={{
            headerShown: false
          }}
          initialParams={{ userId: user.id }}
          listeners={{
            focus: () => {
              setHeaderColor(theme.colors.primary);
              setShownDrawerHeader(true);
            },
          }}
        />
        <Stack.Screen
          name="Malla"
          component={MallaCurricular}
          options={{
            headerShown: false
          }}
          initialParams={{ userId: user.id }}
          listeners={{
            focus: () => {
              setHeaderColor(theme.colors.primary);
              setShownDrawerHeader(true);
            },
          }}
        />
        <Stack.Screen
          name="OptionsPerfil"
          component={OptionsPerfil}
          options={{
            headerShown: false
          }}
          listeners={{
            focus: () => {
              setHeaderColor(theme.colors.primary);
              setShownDrawerHeader(true);
            },
          }}
        />
        <Stack.Screen
          name="ConfigPerfil"
          component={ConfigPerfil}
          options={{
            headerStyle: { backgroundColor: headerColor },
            headerTitle: "",
          }}
          initialParams={{ userId: user.id }}
          listeners={{
            focus: () => {
              setHeaderColor(theme.colors.primary);
              setShownDrawerHeader(false);
            },
          }}
        />
      </Stack.Navigator>
    );
  }

export default function AlumnoNav() {
  const [headerColor, setHeaderColor] = useState(theme.colors.primary);
  const [shownDrawerHeader, setShownDrawerHeader] = useState(true);

  return (
    <HeaderContext.Provider
      value={{ headerColor, setHeaderColor, setShownDrawerHeader }}
    >
      <Drawer.Navigator drawerContent={(props) => <DrawerAdmin {...props} />}>
        <Drawer.Screen
          name="HomeStack"
          component={HomeStack}
          options={{
            headerTitle: "",
            headerStyle: { backgroundColor: headerColor },
            headerShown: shownDrawerHeader,
          }}
        />
      </Drawer.Navigator>
    </HeaderContext.Provider>
  );
}
