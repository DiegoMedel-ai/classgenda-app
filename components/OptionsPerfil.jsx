import { Text, Modal, Portal, Button } from "react-native-paper";
import { styles } from "@/constants/styles";
import theme from "@/constants/theme";
import {
  FlatList,
  View,
  Text as TextNormal,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";
import { useState } from "react";
import WebView from "react-native-webview";

const OptionsPerfil = ({ navigation }) => {
  const [visibleModal1, setVisibleModal1] = useState(false);
  const [visibleModal2, setVisibleModal2] = useState(false);
  const [visibleModal3, setVisibleModal3] = useState(false);

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
          Configuración
        </Text>
      </View>
      <View
        style={{
          padding: 20,
          width: "100%",
          height: "70%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          onPress={() => navigation.navigate("ConfigPerfil")}
          icon={() => <Icon name="user-pen" size={35} />}
          style={{
            height: "auto",
            width: "80%",
            paddingVertical: 15,
            backgroundColor: theme.colors.tertiary_op,
          }}
          mode="elevated"
        >
          <Text style={{ fontSize: 15, paddingLeft: 10 }}>Editar perfil</Text>
        </Button>
        <Button
          icon={() => <Icon name="book-atlas" size={35} />}
          style={{
            height: "auto",
            width: "80%",
            paddingVertical: 15,
            backgroundColor: theme.colors.tertiary_op,
          }}
          mode="elevated"
          onPress={() => setVisibleModal1(true)}
        >
          <Text style={{ fontSize: 15, paddingLeft: 10 }}>
            Terminos y condiciones
          </Text>
        </Button>
        <Button
          icon={() => <Icon name="shield-halved" size={35} />}
          style={{
            height: "auto",
            width: "80%",
            paddingVertical: 15,
            backgroundColor: theme.colors.tertiary_op,
          }}
          mode="elevated"
          onPress={() => setVisibleModal2(true)}
        >
          <Text style={{ fontSize: 15, paddingLeft: 10 }}>
            Politicas de privacidad
          </Text>
        </Button>
        <Button
          icon={() => <Icon name="circle-info" size={35} />}
          style={{
            height: "auto",
            width: "80%",
            paddingVertical: 15,
            backgroundColor: theme.colors.tertiary_op,
          }}
          mode="elevated"
          onPress={() => setVisibleModal3(true)}
        >
          <Text style={{ fontSize: 15, paddingLeft: 10 }}>Acerca de</Text>
        </Button>
      </View>
      <Portal>
        <Modal
          visible={visibleModal1}
          onDismiss={() => setVisibleModal1(false)}
          contentContainerStyle={{
            backgroundColor: theme.colors.tertiary,
            padding: 20,
            width: "90%",
            borderRadius: 30,
            height: "70%",
            marginHorizontal: "auto",
          }}
        >
          <Text
            style={{
              marginHorizontal: "auto",
              paddingBottom: 20,
              fontSize: 20,
            }}
          >
            Terminos y condiciones
          </Text>
          <ScrollView
            persistentScrollbar={true}
            contentContainerStyle={{
              borderRadius: 30,
              alignItems: "center",
              width: "100%",
              backgroundColor: theme.colors.tertiary_op,
              paddingHorizontal: 20,
              padding: 10,
              flexGrow: 1,
            }}
          >
            <TextNormal style={{ textAlign: "justify" }}>
              Estos términos reflejan la forma de trabajar de ClassGenda,
              definiendo la relación que tiene contigo cuando interactúas con
              nuestros servicios. Por ejemplo, estos términos incluyen lo
              siguiente.
            </TextNormal>
            <TextNormal style={{ fontWeight: "bold", textAlign: "justify" }}>
              {"\n"}
              ¿Qué puedes esperar de nosotros?
            </TextNormal>

            <TextNormal style={{ textAlign: "justify" }}>
              Nuestros servicios están diseñados para funcionar como una
              herramienta que facilite la generación de evidencia de tus clases,
              así como la organización de de asignaturas y que con las funciones
              disponibles puedas simplificar tus actividades escolares.
            </TextNormal>

            <TextNormal style={{ fontWeight: "bold", textAlign: "justify" }}>
              {"\n"}
              ¿Qué esperamos del usuario?
            </TextNormal>

            <TextNormal style={{ textAlign: "justify" }}>
              - No hacer uso inadecuado de los servicios ni dañarlos; por
              ejemplo, usándolos o accediendo a ellos de forma fraudulenta o
              engañosa.
              {"\n\n"}- No abusar o causar daños a otras personas ni a uno
              mismo; por ejemplo, a través del engaño, la estafa, la
              suplantación de identidad ilegal, la difamación y el acoso.
              {"\n\n"}- Respetar los derechos de los demás, incluidos los de
              privacidad y propiedad intelectual.
              {"\n\n"}- Permiso para usar tu contenido: algunos de nuestros
              servicios se han diseñado para que puedas subir, compartir y
              enviar tu contenido, pese a ello no tienes la obligación de
              proporcionar más que los datos necesarios para facilitar el
              servicio.
            </TextNormal>

            <TextNormal style={{ fontWeight: "bold", textAlign: "justify" }}>
              {"\n"}
              Contenido de los servicios:
            </TextNormal>

            <TextNormal style={{ textAlign: "justify" }}>
              Nuestros servicios permite solamente que tu contenido o
              información, esté público solo para aquellos con los que compartas
              una clase, asignatura.
              {"\n\n"}- Si crees que alguien está infringiendo tus derechos,
              puedes notificarlo desde Configuración {"->"} Contacto.
            </TextNormal>

            <TextNormal style={{ fontWeight: "bold", textAlign: "justify" }}>
              {"\n"}
              Es importante y esencial que comprendas estos términos, dado que
              al utilizar nuestros servicios implica que estas de acuerdo con
              ello y los aceptas.
            </TextNormal>
          </ScrollView>
        </Modal>
        <Modal
          visible={visibleModal2}
          onDismiss={() => setVisibleModal2(false)}
          contentContainerStyle={{
            backgroundColor: theme.colors.secondary,
            padding: 20,
            width: "90%",
            borderRadius: 30,
            height: "70%",
            marginHorizontal: "auto",
          }}
        >
          <Text
            style={{
              marginHorizontal: "auto",
              paddingBottom: 20,
              fontSize: 20,
            }}
          >
            Politicas de privacidad
          </Text>
          <ScrollView
            persistentScrollbar={true}
            contentContainerStyle={{
              borderRadius: 30,
              alignItems: "center",
              width: "100%",
              backgroundColor: theme.colors.secondary_op,
              paddingHorizontal: 20,
              padding: 10,
              flexGrow: 1,
            }}
          >
            <TextNormal style={{ textAlign: "justify" }}>
              El objetivo de esta política de privacidad es informarte sobre qué
              datos se recolectan, el por qué lo hacemos y cómo puedes
              actualizar, gestionar o eliminar tu información.
            </TextNormal>
            <TextNormal style={{ fontWeight: "bold", textAlign: "justify" }}>
              {"\n"}
              ¿Qué datos se obtienen?
            </TextNormal>

            <TextNormal style={{ textAlign: "justify" }}>
              ClassGenda solicita que ingreses información tal como nombre,
              apellido, código de estudiante y una fotografía como
              identificación (la cual podría ser opcional), además de ello, lo
              demás se relaciona con datos meramente propios de tus clases y
              asignaturas.
            </TextNormal>

            <TextNormal style={{ fontWeight: "bold", textAlign: "justify" }}>
              {"\n"}
              Motivo de la recolección de datos:
            </TextNormal>

            <TextNormal style={{ textAlign: "justify" }}>
              Para cumplir con nuestro objetivo es necesario que brindes la
              información verídica y válida de modo que las evidencias sean
              completas y exactas para tus profesores o dependencias a cargo.
              ClassGenda no pretende obtener más información tuya más que la
              necesaria para brindarte un espacio que funcione como organizador,
              agenda y una plataforma que mantenga actualizadas tus clases.
            </TextNormal>

            <TextNormal style={{ fontWeight: "bold", textAlign: "justify" }}>
              {"\n"}
              ¿Cómo actualizar tus datos?
            </TextNormal>

            <TextNormal style={{ textAlign: "justify" }}>
              - Si eres alumno puedes editar tu información de usuario (perfil)
              ingresando en el menú lateral a la opción Configuración {"->"}{" "}
              Editar perfil. Donde puedes editar cualquiera de tus datos tales
              como el nombre, foto de perfil, contraseña, etc.
              {"\n\n"}- Si eres profesor, por otro lado puedes editar además de
              tu perfil (Configuración {"->"} Editar perfil), la información de
              tus asignaturas a partir del Dashboard {"->"} Acción (toca el
              ícono de acción y se desplegarán tres opciones: ver asignatura,
              eliminar y editar).
            </TextNormal>

            <TextNormal style={{ fontWeight: "bold", textAlign: "justify" }}>
              {"\n"}
              Es importante y esencial que comprendas estas políticas, dado que
              al utilizar nuestros servicios implica que estas de acuerdo con
              ello y los aceptas.
            </TextNormal>
          </ScrollView>
        </Modal>
        <Modal
          visible={visibleModal3}
          onDismiss={() => setVisibleModal3(false)}
          contentContainerStyle={{
            backgroundColor: theme.colors.primary,
            padding: 20,
            width: "90%",
            borderRadius: 30,
            height: "70%",
            marginHorizontal: "auto",
          }}
        >
          <Text
            style={{
              marginHorizontal: "auto",
              paddingBottom: 20,
              fontSize: 20,
            }}
          >
            Classgenda
          </Text>
          <ScrollView
            persistentScrollbar={true}
            contentContainerStyle={{
              borderRadius: 30,
              alignItems: "center",
              width: "100%",
              backgroundColor: theme.colors.primary_op,
              paddingHorizontal: 20,
              padding: 10,
              flexGrow: 1,
            }}
          >
            <TextNormal style={{ textAlign: "justify" }}>
              ClassGenda está pensada y diseñada para ser la herramienta que
              facilite la generación y obtención de evidencia de tus cursos.
              {"\n"}
              Ya sea una asignatura o una clase, ClassGenda te permite aplicar
              un seguimiento adecuado y conciso tanto como para lograr validar,
              como para mantener actualizado ya sea a tus alumnos o supervisores
              sobre lo que se está impartiendo. Nuestros principales objetivos
              son los siguientes:
            </TextNormal>
            <TextNormal style={{ fontWeight: "bold", textAlign: "justify" }}>
              Objetivo 1:
            </TextNormal>

            <TextNormal style={{ textAlign: "justify" }}>
              Facilitar la creación y obtención de evidencia de las clases para
              docentes y alumnos.
            </TextNormal>

            <TextNormal style={{ fontWeight: "bold", textAlign: "justify" }}>
              {"\n"}
              Objetivo 2:
            </TextNormal>

            <TextNormal style={{ textAlign: "justify" }}>
              Brindar una herramienta óptima para el seguimiento de clases.
            </TextNormal>

            <TextNormal style={{ fontWeight: "bold", textAlign: "justify" }}>
              {"\n"}
              Más información:
              {"\n\n"}
              Dashboard.
            </TextNormal>

            <TextNormal style={{ textAlign: "justify" }}>
              La página principal muestra una tabla de asignaturas creadas,
              dentro de ella puedes encontrar el nombre, la descripción y un
              icono de acción que te permitirá ver, editar y eliminar tus
              asignaturas. Además de ello aparece contadores por asignaturas y
              clases totales.
            </TextNormal>
            <TextNormal style={{ fontWeight: "bold", textAlign: "justify" }}>
              {"\n"}
              Ver asignatura.
            </TextNormal>

            <TextNormal style={{ textAlign: "justify" }}>
              En caso de haber seleccionado la opción de ver asignatura, podrás
              acceder a la página con la información detallada de dicha
              asignatura (esto incluye además, las fechas de inicio y termino),
              así como los alumnos inscritos y la lista de clases que engloban
              el curso, en ella podrás encontrar su estatus, el nombre,
              descripción y un icono de acción (dicho icono te permitirá editar
              o eliminar la clase seleccionada). Además de esto, podrás añadir
              clases nuevas cada que sea necesario crearlas.
            </TextNormal>
            <TextNormal style={{ fontWeight: "bold", textAlign: "justify" }}>
              {"\n"}
              De parte del equipo de ClassGenda, agradecemos su preferencia.
            </TextNormal>
          </ScrollView>
        </Modal>
      </Portal>
    </View>
  );
};

export default OptionsPerfil;
