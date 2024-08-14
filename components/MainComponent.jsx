import { registerRootComponent } from "expo";
import { useEffect, createContext, useState } from 'react';
import 'react-native-reanimated';
import {NavigationContainer} from '@react-navigation/native';
import AuthNav from '@/components/navigation/AuthNav'
import useUser from "@/hooks/useUser";
import AdminNav from "@/components/navigation/AdminNav";
import { View } from "react-native";

const LoginContext = createContext();

function MainComponent() {
  const { user, setUser, getUser } = useUser()
  const [flagUser, setFlagUser] = useState(false)

  const navRol = [
    {
      rol: 'admin',
      component: <AdminNav />,
    },
  ];

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

export {MainComponent, LoginContext}