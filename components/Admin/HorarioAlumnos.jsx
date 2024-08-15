import { useEffect } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { Collapsible } from "@/components/Collapsible"
import Horario from "@/components/Horario";

export default function HorarioAlumnosAdmin({ route, navigation }) {
    const { alumnoId } = route.params;

    useEffect(() => {
      if(alumnoId === 0) {
        navigation.navigate("AlumnoHome")
      }
    }, [])
    
    return(
            <Horario userId={alumnoId}/>
    )
}