import React, {useEffect, useRef, useState, useCallback} from 'react';
import {styles} from '@/constants/styles'
import {
  Button,
  IconButton,
  Text,
  HelperText,
  Modal,
  Portal,
} from 'react-native-paper';
import theme from '@/constants/theme';
import {View, ActivityIndicator, ScrollView, TextInput, Alert} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome6';
import IconFeather from 'react-native-vector-icons/Feather';
import {Formik} from 'formik';
import {materiaSchema} from '@/constants/schemas';
import DateTimePicker from '@react-native-community/datetimepicker';
import {adjustTimeZone, getDateFormat, setDateTimeZone} from '../../hooks/date';
import WeekdaySelector from '@/components/WeekDaySelect';

export default function MateriasAdmin() {
  const initMateria = {
    nrc: 0,
    programa: {},
    dias_clase: [],
    hora_inicio: new Date(),
    hora_final: new Date(),
    edificio: '',
    aula: null,
    profesor: null,
  };
  const [materias, setMaterias] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [profesores, setProfesores] = useState([])
  const [loading, setLoading] = useState(false);
  const [materiaSelected, setMateriaSelected] = useState(initMateria);
  const [editable, setEditable] = useState(false);
  const [update, setUpdate] = useState(true);
  const [visibleModal, setVisibleModal] = useState(false);
  const [successResult, setSuccessResult] = useState(false);
  const [openInitHour, setOpenInitHour] = useState(false);
  const [openFinalHour, setOpenFinalHour] = useState(false);
  const select = useRef();
  const selectPrograma = useRef();
  const selectProfesor = useRef();

  const fetchMaterias = (loadingS = false) => {
    if (!loadingS) {
      setLoading(true);
      setMateriaSelected(initMateria);
      select.current?.reset();
    }
    try {
      const options = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      };

      fetch(`${process.env.EXPO_PUBLIC_API_URL}/materias`, options)
        .then(response => response.json())
        .then(data => {
          setMaterias(data);
        })
        .then(() => setLoading(false))
        .catch(error => {
          console.log(`Fetch error to: ${process.env.EXPO_PUBLIC_API_URL}/materia`, error);
        });
    } catch (error) {}
  };

  const updateFun = values => {
    setLoading(true);

    const data = {...values}
    data.programa = data.programa.clave;
    data.profesor = data.profesor.id;
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
      };

      const url = `${process.env.EXPO_PUBLIC_API_URL}/materias/${update ? 'update' : 'new'}`;

      fetch(url, options)
        .then(response => response.json())
        .then(data => {
          if (data) {
            setSuccessResult(true);
            setVisibleModal(true);
            setTimeout(() => {
              setSuccessResult(true);
              setVisibleModal(false);
              fetchMaterias(true);
              setUpdate(true);
            }, 800);
          }
        })
        .catch(error => {
          console.log(`Fetch error to: ${url}`, error);
        });
    } catch (error) {}
  };
  
  const deleteFun = () => {
    setLoading(true);

    try {
      const options = {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      };

      const url = `${process.env.EXPO_PUBLIC_API_URL}/materias/delete/${materiaSelected.nrc}`;

      fetch(url, options)
        .then((response) => {
          if (response.status === 200) {
            Alert.alert(
              "Materia eliminada",
              "Se ha eliminado el registro correctamente",
              [
                {
                  text: "Ok",
                  style: "cancel",
                  onPress: () => fetchMaterias(),
                },
              ]
            );
          } else {
            Alert.alert("Error", "Se tienen relacionados horarios/programas a esta materia por lo que no se puede eliminar", [
              {
                text: "Ok",
                style: "cancel",
                onPress: setLoading(false)
              },
            ]);
          }
        })
        .catch((error) => {
          console.log(`Fetch error to: ${url}`, error);
        });
    } catch (error) {}
  };

  useEffect(() => {
    try {
      const options = {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      };

      const urlProgramas = `${process.env.EXPO_PUBLIC_API_URL}/programas`;

      fetch(urlProgramas, options)
        .then(response => response.json())
        .then(data => {
          if (data) {
            setProgramas(data);
          }
        })
        .catch(error => {
          console.log(`Fetch error to: ${url}`, error);
        });
        
      const urlProfesores = `${process.env.EXPO_PUBLIC_API_URL}/profesores`;

      fetch(urlProfesores, options)
        .then(response => response.json())
        .then(data => {
          if (data) {
            setProfesores(data);
          }
        })
        .catch(error => {
          console.log(`Fetch error to: ${url}`, error);
        });
    } catch (error) {}
    fetchMaterias();
  }, []);

  useEffect(() => {
    selectPrograma.current?.selectIndex(
      programas.findIndex(x => x.clave === materiaSelected?.programa?.clave),
    );
    selectProfesor.current?.selectIndex(
      profesores.findIndex(x => x.id === materiaSelected?.profesor?.id),
    );
  }, [materiaSelected]);

  useEffect(() => {
    setMateriaSelected(initMateria);
  }, [update]);

  return (
    <View style={{...styles.admin.overlay_top}}>
      {update && (
        <View style={{...styles.programas.cards_show, marginBottom: 10}}>
          <Text>NRC de materia a buscar:</Text>
          <View style={{...styles.general.center, flexDirection: 'row'}}>
            <SelectDropdown
              data={materias}
              ref={select}
              renderButton={(selectedItem, isOpen) => {
                return (
                  <View
                    style={{
                      ...styles.general.button_select,
                      width: '70%',
                      marginTop: 0,
                    }}>
                    <Text>
                      {(selectedItem && selectedItem.nrc) ||
                        'Selecciona una materia'}
                    </Text>
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => (
                <View
                  style={{
                    ...styles.general.center,
                    ...(isSelected && {
                      backgroundColor: theme.colors.tertiary_op,
                    }),
                    paddingVertical: 10,
                  }}>
                  <Text>
                    {item.nrc} - {item.programa?.nombre}
                  </Text>
                </View>
              )}
              onSelect={item => setMateriaSelected(item)}
              defaultValue={materiaSelected}
              search
              dropdownStyle={{borderRadius: 10}}
              searchInputTxtColor={'black'}
              searchPlaceHolder={'Search here'}
              searchPlaceHolderColor={'grey'}
              renderSearchInputLeftIcon={() => {
                return (
                  <Icon name={'magnifying-glass'} color={'black'} size={18} />
                );
              }}
            />

            <IconButton
              icon={() => <Icon name={'repeat'} size={15} />}
              size={20}
              mode="contained"
              onPress={() => fetchMaterias(false)}
              style={{backgroundColor: theme.colors.tertiary}}
            />
          </View>
        </View>
      )}
      {(materiaSelected.nrc !== 0 || !update) && (
        <Formik
          initialValues={materiaSelected}
          validationSchema={materiaSchema}
          onSubmit={values => updateFun(values)}
          enableReinitialize={true}>
          {({
            values,
            errors,
            handleChange,
            setFieldValue,
            handleSubmit,
          }) => {
            return (
              <>
                <ScrollView
                  contentContainerStyle={{flexGrow: 1}}
                  style={{width: '100%', maxHeight: editable ? '75%' : '100%'}}>
                  <View style={{...styles.general.center, width: '100%'}}>
                    <View
                      style={{
                        ...styles.programas.cards_show,
                        backgroundColor: theme.colors.secondary,
                        marginTop: 10,
                      }}>
                      <Text>Nombre de la materia</Text>
                      <SelectDropdown
                        data={programas}
                        disabled={!editable && update}
                        ref={selectPrograma}
                        renderButton={(selectedItem, isOpen) => {
                          return (
                            <View
                              style={{
                                ...styles.general.button_select,
                                width: '90%',
                              }}>
                              <Text>
                                {(selectedItem && selectedItem.nombre) ||
                                  'Ninguna'}
                              </Text>
                            </View>
                          );
                        }}
                        renderItem={(item, index, isSelected) => (
                          <View
                            style={{
                              ...styles.general.center,
                              ...(isSelected && {
                                backgroundColor: theme.colors.tertiary_op,
                              }),
                              paddingVertical: 10,
                            }}>
                            <Text>
                              {item.clave} - {item.nombre}
                            </Text>
                          </View>
                        )}
                        onSelect={item =>
                          setFieldValue('programa', {
                            clave: item.clave,
                            nombre: item.nombre,
                          })
                        }
                        search
                        dropdownStyle={{borderRadius: 10}}
                        searchInputTxtColor={'black'}
                        searchPlaceHolder={'Search here'}
                        searchPlaceHolderColor={'grey'}
                        renderSearchInputLeftIcon={() => {
                          return (
                            <Icon
                              name={'magnifying-glass'}
                              color={'black'}
                              size={18}
                            />
                          );
                        }}
                      />
                    </View>
                  </View> 
                  <View style={{...styles.general.center, width: '100%'}}>
                    <Text style={{marginTop: 15}}>Dias de clase</Text>
                    <WeekdaySelector
                      selected={values.dias_clase} 
                      formik={true}
                      setSelectedDays={setFieldValue}
                      disabled={!editable && update}
                    />
                  </View>
                  <View
                    style={{
                      ...styles.general.center,
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}>
                    <View
                      style={{
                        ...styles.programas.cards_show,
                        backgroundColor: theme.colors.primary,
                        marginTop: 10,
                        width: '40%',
                      }}>
                      <Text>Hora de inicio</Text>
                      <TextInput
                        style={{...styles.general.button_input}}
                        editable={editable || !update}
                        showSoftInputOnFocus={false}
                        value={
                          values?.hora_inicio
                            ? getDateFormat(values.hora_inicio)
                            : getDateFormat(new Date())
                        }
                        onPress={() => setOpenInitHour(true)}
                      />
                      {openInitHour && 
                        <DateTimePicker
                            value={values?.hora_inicio
                                ? adjustTimeZone(values.hora_inicio)
                                : adjustTimeZone(new Date())}
                            mode='time'
                            is24Hour={false}
                            onChange={(e, date) => {
                                setOpenInitHour(false);
                                setFieldValue('hora_inicio', setDateTimeZone(date));
                            }
                            }
                        />
                        }
                    </View>
                    <View
                      style={{
                        ...styles.programas.cards_show,
                        backgroundColor: theme.colors.primary,
                        marginTop: 10,
                        width: '40%',
                      }}>
                      <Text>Hora final</Text>
                      <TextInput
                        style={{...styles.general.button_input}}
                        editable={editable || !update}
                        showSoftInputOnFocus={false}
                        value={
                          values?.hora_final
                            ? getDateFormat(values.hora_final)
                            : getDateFormat(new Date())
                        }
                        onPress={() => setOpenFinalHour(true)}
                      />
                      {openFinalHour && 
                        <DateTimePicker
                            value={values?.hora_final
                                ? adjustTimeZone(values.hora_final)
                                : adjustTimeZone(new Date())}
                            mode='time'
                            is24Hour={false}
                            onChange={(e, date) => {
                                setOpenFinalHour(false);
                                setFieldValue('hora_final', setDateTimeZone(date));
                            }
                            }
                        />
                        }
                    </View>
                  </View>
                  <View
                    style={{
                      ...styles.general.center,
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}>
                    <View
                      style={{
                        ...styles.programas.cards_show,
                        backgroundColor: theme.colors.primary,
                        width: '40%',
                      }}>
                      <Text>Edificio</Text>
                      <TextInput
                        style={{...styles.general.button_input}}
                        editable={editable || !update}
                        onChangeText={handleChange('edificio')}
                        value={
                          values?.edificio
                        }
                      />
                    </View>
                    <View
                      style={{
                        ...styles.programas.cards_show,
                        backgroundColor: theme.colors.primary,
                        width: '40%',
                      }}>
                      <Text>Aula</Text>
                      <TextInput
                        style={{...styles.general.button_input}}
                        editable={editable || !update}
                        onChangeText={handleChange('aula')}
                        keyboardType='numeric'
                        value={
                          values?.aula?.toString()
                        }
                      />
                    </View>
                  </View>
                  <View style={{...styles.general.center, width: '100%'}}>
                    <View
                      style={{
                        ...styles.programas.cards_show,
                        marginTop: 20,
                        marginBottom: 20
                      }}>
                      <Text>Profesor</Text>
                      <SelectDropdown
                        data={profesores}
                        disabled={!editable && update}
                        ref={selectProfesor}
                        renderButton={(selectedItem, isOpen) => {
                          return (
                            <View
                              style={{
                                ...styles.general.button_select,
                                width: '90%',
                              }}>
                              <Text>
                                {(selectedItem && `${selectedItem.nombre} ${selectedItem.apellido}`) ||
                                  'Ninguna'}
                              </Text>
                            </View>
                          );
                        }}
                        renderItem={(item, index, isSelected) => (
                          <View
                            style={{
                              ...styles.general.center,
                              ...(isSelected && {
                                backgroundColor: theme.colors.tertiary_op,
                              }),
                              paddingVertical: 10,
                            }}>
                            <Text>
                              {item.nombre} {item.apellido}
                            </Text>
                          </View>
                        )}
                        onSelect={item =>
                          setFieldValue('profesor', {
                            id: item.id,
                            nombre: item.nombre,
                            apellido: item.apellido,
                          })
                        }
                        search
                        dropdownStyle={{borderRadius: 10}}
                        searchInputTxtColor={'black'}
                        searchPlaceHolder={'Search here'}
                        searchPlaceHolderColor={'grey'}
                        renderSearchInputLeftIcon={() => {
                          return (
                            <Icon
                              name={'magnifying-glass'}
                              color={'black'}
                              size={18}
                            />
                          );
                        }}
                      />
                    </View>
                  </View>
                </ScrollView>
                {update ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      width: '100%',
                      paddingTop: 10,
                    }}>
                    <Button
                      mode="elevated"
                      style={{...(!materiaSelected && {marginTop: 10})}}
                      textColor="black"
                      buttonColor={theme.colors.tertiary}
                      onPress={() => setUpdate(false)}>
                      Añadir
                    </Button>
                    <Button
                      mode="elevated"
                      textColor="black"
                      buttonColor={theme.colors.tertiary}
                      onPress={() => {
                        if (editable) {
                          handleSubmit();
                          setEditable(prev => !prev);
                        } else {
                          setEditable(prev => !prev);
                        }
                      }}>
                      {editable ? 'Guardar' : 'Actualizar'}
                    </Button>
                    <Button
                      mode="elevated"
                      textColor="black"
                      buttonColor={theme.colors.tertiary}
                      onPress={() => {
                        Alert.alert(
                          "Eliminar materia",
                          "Estás seguro de eliminar esta materia?",
                          [
                            {
                              text: "Confirmar",
                              style: "default",
                              onPress: () => deleteFun(),
                            },
                            {
                              text: "Cancelar",
                              style: "cancel",
                            },
                          ]
                        );
                      }}>
                      Eliminar
                    </Button>
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      width: '100%',
                      paddingTop: 10,
                    }}>
                    <Button
                      mode="elevated"
                      style={{...(!materiaSelected && {marginTop: 10})}}
                      textColor="black"
                      buttonColor={theme.colors.tertiary}
                      onPress={handleSubmit}>
                      Añadir
                    </Button>
                    <Button
                      mode="elevated"
                      style={{...(!materiaSelected && {marginTop: 10})}}
                      textColor="black"
                      buttonColor={theme.colors.tertiary}
                      onPress={() => setUpdate(true)}>
                      Cancelar
                    </Button>
                  </View>
                )}

                <HelperText
                  type="error"
                  visible={errors}
                  padding="none"
                  style={{width: '55%'}}>
                  {Object.keys(errors).map(x => errors[x] + '\n')}
                </HelperText>
              </>
            );
          }}
        </Formik>
      )}
      {materiaSelected.nrc === 0 && update && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            width: '100%',
            paddingTop: 10,
          }}>
          <Button
            mode="elevated"
            style={{...(materiaSelected.clave === 0 && {marginTop: 10})}}
            textColor="black"
            buttonColor={theme.colors.tertiary}
            onPress={() => setUpdate(false)}>
            Añadir
          </Button>
        </View>
      )}
      {loading && (
        <View style={styles.general.overlay_loader}>
          <ActivityIndicator size={'large'} color={'#4DBFE4'} />
        </View>
      )}

      <Portal>
        <Modal
          visible={visibleModal}
          onDismiss={() => setVisibleModal(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 30,
            width: '70%',
            margin: 'auto',
            borderRadius: 30,
          }}>
          {successResult ? (
            <View style={{alignItems: 'center'}}>
              <IconFeather name="check-circle" color="green" size={40} />
              <Text style={{textAlign: 'center', marginTop: 10}}>
                Programa {update ? 'modificado' : 'agregado'} correctamente!
              </Text>
            </View>
          ) : (
            <View style={{alignItems: 'center'}}>
              <IconFeather
                name="x-circle"
                color={theme.colors.error}
                size={40}
              />
              <Text style={{textAlign: 'center', marginTop: 10}}>
                Hubo un error
              </Text>
            </View>
          )}
        </Modal>
      </Portal>
    </View>
  );
}