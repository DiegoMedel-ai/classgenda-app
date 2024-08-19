import theme from "./theme";

const styles = {
  general: {
    title: {
      fontSize: 40,
    },
    image: {
      resizeMode: "cover",
    },
    overlay: {
      height: "100%",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    overlay_top: {
      height: "100%",
      width: "100%",
      justifyContent: "top",
      alignItems: "center",
    },
    button: {
      marginTop: 40,
      width: "45%",
    },
    button_text: {
      color: "white",
      fontSize: 20,
    },
    center: {
      justifyContent: "center",
      alignItems: "center",
    },
    overlay_loader: {
      flex: 1,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    drawer_title: {
      fontSize: 24,
    },
    drawer_style: {
      borderBottomLeftRadius: 40,
      borderBottomRightRadius: 40,
      backgroundColor: theme.colors.tertiary_op,
      elevation: 5, 
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.3, 
      shadowRadius: 3.84, 
    },
    button_select: {
      backgroundColor: 'white',
      paddingVertical: 6,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      marginTop: 5,
      height: 'auto',
      width: '90%'
    },
    button_input: {
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      height: 'auto',
      width: '90%',
      marginTop: 7,
      fontFamily: 'Poetsen',
      textAlign: 'center',
      color: 'black'
    }
  },
  login: {
    input_text: {
      backgroundColor: "white",
      borderColor: "black",
      width: "75%",
      roundness: 50,
    },
    buttons: {
      width: "auto",
      backgroundColor: "transparent",
    },
    buttons_text: {
      fontSize: 16,
    },
  },
  admin: {
    overlay: {
      height: "100%",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.primary_op,
    },
    overlay_top: {
      height: "100%",
      width: "100%",
      justifyContent: "top",
      alignItems: "center",
    },
    image: {
      resizeMode: "contain",
      width: "90%", // Ajusta el tamaño de la imagen
      height: "85%",
      alignSelf: "center",
    },
    container: {
      flexDirection: "column",
      height: "70%",
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 30,
    },
    carousel: {
      height: 150,
      justifyContent: "center",
      alignItems: "center",
    },
    icon_carousel: {
      width: 60,
      height: 60,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.secondary,
    },
    animatedItem: {
      justifyContent: "center",
      alignItems: "center",
    },
  },
  drawer: {
    container: {
      paddingTop: 0,
      flex: 1,
      backgroundColor: theme.colors.primary, // Color de fondo del Drawer
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 10,
    },
    profileName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    profileCode: {
      fontSize: 14,
      color: '#666',
    },
    drawerSection: {
      marginTop: 20,
    },
    bottomDrawerSection: {
      marginTop: 'auto',
      borderTopColor: 'black',
      borderTopWidth: 1,
      backgroundColor: theme.colors.primary,
    },
  },
  programas: {
    cards_show: {
      width: '90%',
      height: 'auto',
      paddingHorizontal: 5,
      paddingVertical: 10,
      borderRadius: 20,
      elevation: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      marginTop: 20,
    }
  },
  horario: {
    touchable: {
      width: "90%",
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginVertical: 10,
      borderRadius: 10,
    },
    container: {
      paddingTop: 20,
      height: "100%",
    },
    card: {
      padding: 15,
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 10,
    }
  }
};

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export { styles, blurhash };
