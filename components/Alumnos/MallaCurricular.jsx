import { Text, Modal, Portal } from "react-native-paper";
import { styles } from "@/constants/styles";
import theme from "@/constants/theme";
import {
  FlatList,
  View,
  Text as TextNormal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";
import { useState } from "react";
import WebView from "react-native-webview";

const MallaCurricular = () => {
  const data = [
    {
      siglas: "ICOM",
      nombre: "Ingenieria en computación",
      malla:
        "http://www.pregrado.udg.mx/sites/default/files/mallasCurriculares/ingenieria_en_computacion_0.pdf",
    },
    {
      siglas: "INNI",
      nombre: "Ingenieria en informatica",
      malla:
        "http://www.pregrado.udg.mx/sites/default/files/mallasCurriculares/malla_curricular_inni.pdf",
    },
    {
      siglas: "LCMA",
      nombre: "Ciencia de los materiales",
      malla:
        "http://www.pregrado.udg.mx/sites/default/files/mallasCurriculares/mll_materiales.pdf",
    },
    {
      siglas: "LIFI",
      nombre: "Fisica",
      malla:
        "http://www.pregrado.udg.mx/sites/default/files/mallasCurriculares/malla_fisica_oct_2019.pdf",
    },
    {
      siglas: "INBI",
      nombre: "Ingenieria en biomedica",
      malla:
        "http://www.pregrado.udg.mx/sites/default/files/mallasCurriculares/malla_biomedica.pdf",
    }
  ];

  const [visibleModal, setVisibleModal] = useState(false)
  const [urlMalla, setUrlMalla] = useState(data[0].malla)

  return (
    <View style={{ ...styles.admin.overlay_top }}>
      <View
        style={{
          backgroundColor: theme.colors.primary,
          width: "100%",
          height: "auto",
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            width: "100%",
            textAlign: "center",
            fontSize: 25,
            paddingVertical: 10,
          }}
        >
          Licenciaturas
        </Text>
      </View>
      <View style={{ padding: 20, width: "100%", maxHeight: '70%' }}>
        <View
          style={{
            backgroundColor: theme.colors.primary,
            width: "100%",
            padding: 20,
            borderRadius: 20,
          }}
        >
          <Text>Mallas curriculares</Text>
          <View
            style={{
              width: "100%",
              marginVertical: 20,
              height: 3,
              backgroundColor: "white",
              borderRadius: 20,
              marginHorizontal: "auto",
            }}
          ></View>
          <FlatList
            data={data}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{
                  backgroundColor: theme.colors.tertiary,
                  flexDirection: "row",
                  height: "auto",
                  borderWidth: 1,
                  borderRadius: 15,
                  padding: 10,
                  marginVertical: 5,
                }}
                onPress={() => {
                    setUrlMalla(item.malla)
                    setVisibleModal(true);
                }}
              >
                <Icon
                  name="user-graduate"
                  size={30}
                  style={{ textAlignVertical: "center", marginRight: 10 }}
                />
                <View
                  style={{
                    justifyContent: "top",
                    alignItems: "flex-start",
                    height: "100%",
                  }}
                >
                  <Text style={{ fontSize: 20 }}>{item.siglas}</Text>
                  <TextNormal style={{ fontSize: 11 }}>
                    {item.nombre}
                  </TextNormal>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
      <Portal>
        <Modal
          visible={visibleModal}
          onDismiss={() => setVisibleModal(false)}
          contentContainerStyle={{
            backgroundColor: "white",
            width: "100%",
            borderRadius: 30,
            height: 'auto'
          }}
        >
            <View style={{ alignItems: "center", height: 550, width: '100%' }}>
                <WebView
                    source={{uri: `https://docs.google.com/gview?embedded=true&url=${urlMalla}`}}
                    style={{height: '100%', borderRadius: 15, width: Dimensions.get('window').width}}
                    useWebKit={true}
                />
            </View>

        </Modal>
      </Portal>
    </View>
  );
};

export default MallaCurricular;
