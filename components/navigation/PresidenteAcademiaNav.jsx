import React, { createContext, useContext, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomePresidenteAcademia from "../PresidenteAcademia/Home";
import OptionsPrograma from "../PresidenteAcademia/OptionsPrograma";
import ViewProgramas from "../PresidenteAcademia/ViewPrograma";
import EditProgramas from "../PresidenteAcademia/EditPrograma";
import ListProgramas from "../PresidenteAcademia/ListProgramas";
import ListMaterias from "../PresidenteAcademia/ListMaterias";
import OptionsMateria from "../PresidenteAcademia/OptionsMateria";
import ProfesorDetails from "../PresidenteAcademia/InfoProfesor";
import ListProfesores from "../PresidenteAcademia/ListProfesores";
import ViewReportes from "../Maestros/ViewReportes";
import DrawerAdmin from "./DrawerAdmin";
import theme from "@/constants/theme";
import LoginContext from "@/constants/loginContext";

const HeaderContext = createContext();

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
        component={HomePresidenteAcademia}
        options={{
          headerShown: false,
        }}
        listeners={{
          focus: () => {
            setHeaderColor(theme.colors.primary_op);
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
        listeners={{
          focus: () => {
            setHeaderColor(theme.colors.secondary_op);
            setShownDrawerHeader(false);
          },
        }}
      />
      <Stack.Screen
        name="ViewProgramas"
        component={ViewProgramas}
        options={{
          headerStyle: { backgroundColor: headerColor },
          headerTitle: "",
        }}
        listeners={{
          focus: () => {
            setHeaderColor(theme.colors.tertiary_op);
            setShownDrawerHeader(false);
          },
        }}
      />
      <Stack.Screen
        name="EditProgramas"
        component={EditProgramas}
        options={{
          headerStyle: { backgroundColor: headerColor },
          headerTitle: "",
        }}
        listeners={{
          focus: () => {
            setHeaderColor(theme.colors.tertiary_op);
            setShownDrawerHeader(false);
          },
        }}
      />
      <Stack.Screen
        name="ListProgramas"
        component={ListProgramas}
        options={{
          headerStyle: { backgroundColor: headerColor },
          headerTitle: "",
        }}
        listeners={{
          focus: () => {
            setHeaderColor(theme.colors.primary_op);
            setShownDrawerHeader(false);
          },
        }}
      />
      <Stack.Screen
        name="ListMaterias"
        component={ListMaterias}
        initialParams={{ programaClave: 0 }}
        options={{
          headerStyle: { backgroundColor: headerColor },
          headerTitle: "",
        }}
        listeners={{
          focus: () => {
            setHeaderColor(theme.colors.primary_op);
            setShownDrawerHeader(false);
          },
        }}
      />
      <Stack.Screen
        name="OptionsMateria"
        component={OptionsMateria}
        initialParams={{ materiaNrc: 0, maestroId: 0 }}
        options={{
          headerStyle: { backgroundColor: headerColor },
          headerTitle: "",
        }}
        listeners={{
          focus: () => {
            setHeaderColor(theme.colors.primary_op);
            setShownDrawerHeader(false);
          },
        }}
      />
      <Stack.Screen
        name="ProfesorDetails"
        component={ProfesorDetails}
        initialParams={{ maestroId: 0 }}
        options={{
          headerStyle: { backgroundColor: headerColor },
          headerTitle: "",
        }}
        listeners={{
          focus: () => {
            setHeaderColor(theme.colors.tertiary_op);
            setShownDrawerHeader(false);
          },
        }}
      />
      <Stack.Screen
        name="ListProfesores"
        component={ListProfesores}
        options={{
          headerStyle: { backgroundColor: headerColor },
          headerTitle: "",
        }}
        listeners={{
          focus: () => {
            setHeaderColor(theme.colors.secondary_op);
            setShownDrawerHeader(false);
          },
        }}
      />
      <Stack.Screen
        name="ViewReportes"
        component={ViewReportes}
        initialParams={{ materiaNrc: 0 }}
        options={{
          headerStyle: { backgroundColor: headerColor },
          headerTitle: "",
        }}
        listeners={{
          focus: () => {
            setHeaderColor(theme.colors.secondary_op);
            setShownDrawerHeader(false);
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default function PresidenteAcademiaNav() {
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
