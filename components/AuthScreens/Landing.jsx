import {View, StyleSheet, ImageBackground} from 'react-native';
import {Text, Button} from 'react-native-paper';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import { styles } from '@/constants/styles'

export default function Landing({navigation}) {
  return (
    <ImageBackground
      source={require('@/assets/images/backgroundLogin.jpg')}
      style={styles.general.image}>
      <View style={styles.general.overlay}>
        <Text style={styles.general.title}>ClassGenda</Text>
        <Button
          mode="contained"
          style={styles.general.button}
          icon={() => <Icon name="arrow-right" color="white" size={20} />}
          contentStyle={{flexDirection: 'row-reverse'}}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.general.button_text}>Login</Text>
        </Button>
      </View>
    </ImageBackground>
  );
};