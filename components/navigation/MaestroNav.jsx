import React, { createContext, useContext, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeMaestro from "../Maestros/Home";
import MateriaDetails from "../Maestros/MateriaDetails";
import ProgramaDetails from "../Maestros/Programa";
import Reportes from "../Maestros/Reportes";
import CheckboxTree from "../Maestros/ModReportes";
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
        component={HomeMaestro}
        initialParams={{userId: user.id}}
        options={{
          headerShown: false
        }}
        listeners={{
            focus: () => {
                setHeaderColor(theme.colors.primary)
                setShownDrawerHeader(true)
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
        initialParams={{materiaNrc: 0}}
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
    </Stack.Navigator>
  );
}

export default function MaestroNav() {
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
