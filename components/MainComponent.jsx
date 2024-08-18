import { registerRootComponent } from "expo";
import { useEffect, createContext, useState, useCallback } from 'react';
import 'react-native-reanimated';
import {NavigationContainer} from '@react-navigation/native';
import AuthNav from '@/components/navigation/AuthNav'
import useUser from "@/hooks/useUser";
import AdminNav from "@/components/navigation/AdminNav";
import MaestroNav from "./navigation/MaestroNav";
import { RefreshControl, ScrollView, View } from "react-native";
import LoginContext from "@/constants/loginContext";

function MainComponent() {
  const { user, setUser, getUser } = useUser()
  const [flagUser, setFlagUser] = useState(false)
  const [refresh, setRefresh] = useState(false)

  const navRol = [
    {
      rol: 'admin',
      component: <AdminNav />,
    },
    {
      rol: 'profesor',
      component: <MaestroNav />,
    }
  ];

  const onRefresh = useCallback(() => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      await getUser();
      setFlagUser(true)
    };

    checkUser();
  }, [user]);

  return (
    <LoginContext.Provider value={{ setUser, getUser, user }}>
        <NavigationContainer>
          {flagUser ? (user ? navRol.find((x) => x.rol === user.rol)?.component || <View></View> : <AuthNav />) : <View></View>}
        </NavigationContainer>
    </LoginContext.Provider>
  );
}

export default MainComponent