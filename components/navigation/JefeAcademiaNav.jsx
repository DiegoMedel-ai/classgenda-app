import React, { createContext, useContext, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeJefeAcademia from "../JefeAcademia/Home";
import OptionsPrograma from "../JefeAcademia/OptionsPrograma";
import ViewProgramas from "../JefeAcademia/ViewPrograma";
import EditProgramas from "../JefeAcademia/EditPrograma";
import ListProgramas from "../JefeAcademia/ListProgramas";
import ListMaterias from "../JefeAcademia/ListMaterias";
import OptionsMateria from "../JefeAcademia/OptionsMateria";
import ProfesorDetails from "../JefeAcademia/InfoProfesor";
import ListProfesores from "../JefeAcademia/ListProfesores";
import MateriaDetails from "../Maestros/MateriaDetails";
import ProgramaDetails from "../Maestros/Programa";
import Reportes from "../Maestros/Reportes";
import CheckboxTree from "../Maestros/ModReportes";
import ViewReportes from "../Maestros/ViewReportes";
import ViewListAlumnos from "../Maestros/ViewListAlumnos";
import DrawerAdmin from "./DrawerAdmin";
import theme from "@/constants/theme";
import { styles } from "@/constants/styles";
import { Text } from "react-native-paper";
import LoginContext from "@/constants/loginContext"

const HeaderContext = createContext();

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function HomeStack() {
  const { setHeaderColor, headerColor, setShownDrawerHeader } = useContext(HeaderContext);
  const { user } = useContext(LoginContext);

  return (
    <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeJefeAcademia}
      options={{
        headerShown: false
      }}
      listeners={{
          focus: () => {
              setHeaderColor(theme.colors.primary_op)
              setShownDrawerHeader(true)
          }
      }}
    />
    <Stack.Screen
      name="OptionsPrograma"
      component={OptionsPrograma}
      options={{
        headerStyle: { backgroundColor: headerColor },
        headerTitle: ""
      }}
      listeners={{
          focus: () => {
              setHeaderColor(theme.colors.secondary_op)
              setShownDrawerHeader(false)
          }
      }}
    />
    <Stack.Screen
      name="ViewProgramas"
      component={ViewProgramas}
      options={{
        headerStyle: { backgroundColor: headerColor },
        headerTitle: ""
      }}
      listeners={{
          focus: () => {
              setHeaderColor(theme.colors.tertiary_op)
              setShownDrawerHeader(false)
          }
      }}
    />
    <Stack.Screen
      name="EditProgramas"
      component={EditProgramas}
      options={{
        headerStyle: { backgroundColor: headerColor },
        headerTitle: ""
      }}
      listeners={{
          focus: () => {
              setHeaderColor(theme.colors.tertiary_op)
              setShownDrawerHeader(false)
          }
      }}
    />
    <Stack.Screen
      name="ListProgramas"
      component={ListProgramas}
      options={{
        headerStyle: { backgroundColor: headerColor },
        headerTitle: ""
      }}
      listeners={{
          focus: () => {
              setHeaderColor(theme.colors.primary_op)
              setShownDrawerHeader(false)
          }
      }}
    />
    <Stack.Screen
      name="ListMaterias"
      component={ListMaterias}
      initialParams={{programaClave: 0}}
      options={{
        headerStyle: { backgroundColor: headerColor },
        headerTitle: ""
      }}
      listeners={{
          focus: () => {
              setHeaderColor(theme.colors.primary_op)
              setShownDrawerHeader(false)
          }
      }}
    />
    <Stack.Screen
      name="OptionsMateria"
      component={OptionsMateria}
      initialParams={{materiaNrc: 0,maestroId: 0}}
      options={{
        headerStyle: { backgroundColor: headerColor },
        headerTitle: ""
      }}
      listeners={{
          focus: () => {
              setHeaderColor(theme.colors.primary_op)
              setShownDrawerHeader(false)
          }
      }}
    />
    <Stack.Screen
      name="ProfesorDetails"
      component={ProfesorDetails}
      initialParams={{maestroId: 0}}
      options={{
        headerStyle: { backgroundColor: headerColor },
        headerTitle: ""
      }}
      listeners={{
          focus: () => {
              setHeaderColor(theme.colors.tertiary_op)
              setShownDrawerHeader(false)
          }
      }}
    />
    <Stack.Screen
      name="ListProfesores"
      component={ListProfesores}
      options={{
        headerStyle: { backgroundColor: headerColor },
        headerTitle: ""
      }}
      listeners={{
          focus: () => {
              setHeaderColor(theme.colors.secondary_op)
              setShownDrawerHeader(false)
          }
      }}
    />
      <Stack.Screen
        name="Materia"
        component={MateriaDetails}
        initialParams={{materiaNrc: 0}}
        options={{
          headerStyle: { backgroundColor: headerColor },
          headerTitle: ""
        }}
        listeners={{
            focus: () => {
                setHeaderColor(theme.colors.secondary_op)
                setShownDrawerHeader(false)
            }
        }}
      />
      <Stack.Screen
        name="Programa"
        component={ProgramaDetails}
        initialParams={{materiaNrc: 0, programaClave: 0}}
        options={{
          headerStyle: { backgroundColor: headerColor },
          headerTitle: ""
        }}
        listeners={{
            focus: () => {
                setHeaderColor(theme.colors.tertiary_op)
                setShownDrawerHeader(false)
            }
        }}
      />
      <Stack.Screen
        name="Reportes"
        component={Reportes}
        initialParams={{materiaNrc: 0}}
        options={{
          headerStyle: { backgroundColor: headerColor },
          headerTitle: ""
        }}
        listeners={{
            focus: () => {
                setHeaderColor(theme.colors.secondary_op)
                setShownDrawerHeader(false)
            }
        }}
      />
      <Stack.Screen
        name="ModReportes"
        component={CheckboxTree}
        initialParams={{materiaNrc: 0}}
        options={{
          headerStyle: { backgroundColor: headerColor },
          headerTitle: ""
        }}
        listeners={{
            focus: () => {
                setHeaderColor(theme.colors.secondary_op)
                setShownDrawerHeader(false)
            }
        }}
      />
      <Stack.Screen
        name="ViewReportes"
        component={ViewReportes}
        initialParams={{materiaNrc: 0}}
        options={{
          headerStyle: { backgroundColor: headerColor },
          headerTitle: ""
        }}
        listeners={{
            focus: () => {
                setHeaderColor(theme.colors.secondary_op)
                setShownDrawerHeader(false)
            }
        }}
      />
      <Stack.Screen
        name="ViewListAlumnos"
        component={ViewListAlumnos}
        initialParams={{materiaNrc: 0}}
        options={{
          headerStyle: { backgroundColor: headerColor },
          headerTitle: ""
        }}
        listeners={{
            focus: () => {
                setHeaderColor(theme.colors.primary_op)
                setShownDrawerHeader(false)
            }
        }}
      />
    </Stack.Navigator>
  );
}

export default function JefeAcademiaNav() {
  const [headerColor, setHeaderColor] = useState(theme.colors.primary);
  const [shownDrawerHeader, setShownDrawerHeader] = useState(true)

  return (
    <HeaderContext.Provider value={{headerColor,setHeaderColor, setShownDrawerHeader}}>
      <Drawer.Navigator drawerContent={(props) => <DrawerAdmin {...props} />}>
        <Drawer.Screen
          name="HomeStack"
          component={HomeStack}
          options={{
            headerTitle: "",
            headerStyle: { backgroundColor: headerColor },
            headerShown: shownDrawerHeader
          }}
        />
      </Drawer.Navigator>
    </HeaderContext.Provider>
  );
}
