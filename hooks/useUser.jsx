import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useUser = () => {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const id = await AsyncStorage.getItem('user:id');
      const rol = await AsyncStorage.getItem('user:rol');
      const departamentos = await AsyncStorage.getItem('user:departamentos');
      if (id) {
        const newUser = { id, rol, departamentos };
        setUser((prevUser) => (JSON.stringify(prevUser) !== JSON.stringify(newUser) ? newUser : prevUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return { user, setUser, getUser };
};

export default useUser;
