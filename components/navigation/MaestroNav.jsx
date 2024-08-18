import React, { createContext, useContext, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeMaestro from "../Maestros/Home";
import DrawerAdmin from "./DrawerAdmin";
import theme from "@/constants/theme";
import { styles } from "@/constants/styles";
import { Text } from "react-native-paper";
import LoginContext from "@/constants/loginContext"

const HeaderContext = createContext();

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function HomeStack() {
  const { setHeaderColor, headerColor } = useContext(HeaderContext);
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
      />
    </Stack.Navigator>
  );
}

export default function MaestroNav() {
  const [headerColor, setHeaderColor] = useState(theme.colors.primary);

  return (
    <HeaderContext.Provider value={{headerColor,setHeaderColor}}>
      <Drawer.Navigator drawerContent={(props) => <DrawerAdmin {...props} />}>
        <Drawer.Screen
          name="HomeStack"
          component={HomeStack}
          options={{
            headerTitle: "",
            headerStyle: { backgroundColor: headerColor },
          }}
        />
      </Drawer.Navigator>
    </HeaderContext.Provider>
  );
}
