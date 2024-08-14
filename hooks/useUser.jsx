import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useUser = () => {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const id = await AsyncStorage.getItem('user:id');
      const rol = await AsyncStorage.getItem('user:rol');
      if (id) {
        setUser({ id, rol });
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
