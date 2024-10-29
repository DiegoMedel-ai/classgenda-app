import { registerRootComponent } from "expo";
import { useEffect, createContext, useState, useCallback } from "react";
import "react-native-reanimated";
import { NavigationContainer } from "@react-navigation/native";
import AuthNav from "@/components/navigation/AuthNav";
import useUser from "@/hooks/useUser";
import AdminNav from "@/components/navigation/AdminNav";
import MaestroNav from "./navigation/MaestroNav";
import PresidenteAcademiaNav from "./navigation/PresidenteAcademiaNav";
import AlumnoNav from "./navigation/AlumnoNav";
import { RefreshControl, ScrollView, View } from "react-native";
import LoginContext from "@/constants/loginContext";
import { AlertNotificationRoot } from "react-native-alert-notification";

function MainComponent() {
  const { user, setUser, getUser } = useUser();
  const [flagUser, setFlagUser] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [profileImage, setProfileImage] = useState();

  const navRol = [
    {
      rol: "admin",
      component: <AdminNav />,
    },
    {
      rol: "profesor",
      component: <MaestroNav />,
    },
    {
      rol: "presidente_academia",
      component: <PresidenteAcademiaNav />,
    },
    {
      rol: "jefe_departamento",
      component: <PresidenteAcademiaNav />,
    },
    {
      rol: "estudiante",
      component: <AlumnoNav />,
    },
  ];

  useEffect(() => {
    const checkUser = async () => {
      await getUser();
      setFlagUser(true);
    };

    checkUser();
  }, []);

  return (
    <LoginContext.Provider value={{ setUser, getUser, user, profileImage, setProfileImage }}>
      <AlertNotificationRoot theme="dark" toastConfig={{ autoClose: true }}>
        <NavigationContainer>
          {flagUser ? (
            user ? (
              navRol.find((x) => x.rol === user.rol)?.component || <View></View>
            ) : (
              <AuthNav />
            )
          ) : (
            <View></View>
          )}
        </NavigationContainer>
      </AlertNotificationRoot>
    </LoginContext.Provider>
  );
}

export default MainComponent;
