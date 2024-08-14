import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Landing from "../AuthScreens/Landing";
import Login from "../AuthScreens/Login";
import SignUpScreen from "../AuthScreens/Signup"

const Authstack = createNativeStackNavigator();

const AuthNav = () => (
    <Authstack.Navigator>
        <Authstack.Screen name="Landing" options={{headerShown: false}} component={Landing}/>
        <Authstack.Screen name="Login" options={{headerShown: false}} component={Login}/>
        <Authstack.Screen name="Signup" options={{headerShown: false}} component={SignUpScreen}/>
    </Authstack.Navigator>
)

export default AuthNav