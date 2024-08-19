import React, { useState } from "react";
import { View, Button, StyleSheet, Alert } from "react-native";
import { Checkbox, Text, Modal, Portal } from "react-native-paper";

const CheckboxTree = () => {
  const [tree, setTree] = useState({
    "1_nombre": {
      value: 0,
      subtemas: {
        "1.1_nombre": { value: 1, subtemas: {} },
        "1.2_nombre": { value: 1, subtemas: {} },
        "1.3_nombre": {
          value: 0,
          subtemas: {
            "1.3.1_nombre": { value: 0, subtemas: {} },
          },
        },
      },
    },
    "2_nombre": { value: 0, subtemas: {} },
  });

  const handleCheckboxChange = (path) => {
    const updatedTree = { ...tree };
    let current = updatedTree;

    path.forEach((key, index) => {
      if (index === path.length - 1) {
        if (current[key]) {
          current[key].value = current[key].value === 1 ? 0 : 1;
        }
      } else {
        if (current[key] && current[key].subtemas) {
          current = current[key].subtemas;
        }
      }
    });

    setTree(updatedTree);
  };

  const handleAddSubtema = (path) => {
    const updatedTree = { ...tree };
    let current = updatedTree;

    // Navega hasta el nodo padre
    path.forEach((key, index) => {
      if (index === path.length - 1) {
        // Crear el nuevo subtema dentro del nodo padre
        const subtemaCount = Object.keys(current[key].subtemas).length + 1;
        const parentKey = key.split("_")[0];
        const newSubtema = `${parentKey}.${subtemaCount}_nombre`;
        current[key].subtemas[newSubtema] = { value: 0, subtemas: {} };
      } else {
        if (!current[key]) {
          current[key] = { value: 0, subtemas: {} };
        }
        current = current[key].subtemas;
      }
    });

    setTree(updatedTree);
  };

  const handleAddTema = () => {
    const updatedTree = { ...tree };
    let current = updatedTree;

    const temaCount = Object.keys(current).length +1

    // Navega hasta el nodo padre
    path.forEach((key, index) => {
      if (index === path.length - 1) {
        // Crear el nuevo subtema dentro del nodo padre
        const subtemaCount = Object.keys(current[key].subtemas).length + 1;
        const parentKey = key.split("_")[0];
        const newSubtema = `${parentKey}.${subtemaCount}_nombre`;
        current[key].subtemas[newSubtema] = { value: 0, subtemas: {} };
      } else {
        if (!current[key]) {
          current[key] = { value: 0, subtemas: {} };
        }
        current = current[key].subtemas;
      }
    });

    setTree(updatedTree);
  };

  const handleAlert = () => {
    console.log('2');
    
    Alert.prompt(
        "Enter password",
        "Enter your password to claim your $1.5B in lottery winnings",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          {
            text: "OK",
            onPress: password => console.log("OK Pressed, password: " + password)
          }
        ],
        "secure-text"
      );
  }

  const renderTree = (node, path = []) => {
    return Object.keys(node).map((key) => {
      const newPath = [...path, key];
      return (
        <View key={newPath.join("_")} style={{ paddingLeft: path.length * 20 }}>
          <View style={styles.checkboxRow}>
            <Checkbox
              status={node[key].value === 1 ? "checked" : "unchecked"}
              onPress={() => handleCheckboxChange(newPath)}
            />
            <Text>{key.replace(/_/g, ".")}</Text>
            <Button title="+" onPress={() => handleAddSubtema(newPath)} />
          </View>
          {node[key].subtemas && renderTree(node[key].subtemas, newPath)}
        </View>
      );
    });
  };

  const handleSave = () => {
    console.log(tree);
  };

  return (
    <View style={styles.container}>
      {renderTree(tree)}
      <Button title="Guardar" onPress={handleAlert} />
      <Portal>
        <Modal
          visible={visibleModal}
          onDismiss={() => setVisibleModal(false)}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 30,
            width: "70%",
            margin: "auto",
            borderRadius: 30,
          }}
        >
            <View style={{ alignItems: "center" }}>
              <Text style={{ textAlign: "center", marginTop: 10 }}>
                Hubo un error
              </Text>
            </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8DCDC",
    borderRadius: 10,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default CheckboxTree;
