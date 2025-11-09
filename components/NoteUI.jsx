import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import bgStyle from "../assets/styles/bgStyle";
import darkColor from "../assets/styles/darkColor";

export default function NoteUI({ navigation }) {
  const [alignment, setAlignment] = useState("left");
  const [activeBtn, setActiveBtn] = useState(null);

  const handleHaptic = () =>
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

  const handleAlign = (alignType) => {
    setAlignment(alignType);
    handleHaptic();
  };

  return (
    <SafeAreaView style={bgStyle.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color={darkColor.color} />
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <Ionicons
            name="share"
            size={30}
            color={darkColor.color}
            style={styles.iconMargin}
          />
          <Ionicons name="save" size={28} color={darkColor.color} />
        </View>
      </View>

      {/* CONTENT */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <TextInput
            multiline
            placeholder="Title goes here..."
            placeholderTextColor="#44004493"
            style={styles.titleInput}
          />

          <View style={styles.bodyContainer}>
            <TextInput
              multiline
              scrollEnabled
              placeholder="Note goes here..."
              placeholderTextColor="#44004493"
              style={[
                styles.bodyInput,
                { textAlign: alignment, textAlignVertical: "top" },
              ]}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <IconButton
          icon="attach"
          active={activeBtn === "attach"}
          onPress={() => {
            setActiveBtn(activeBtn === "attach" ? null : "attach");
            handleHaptic();
          }}
        />

        <IconButton
          icon="text"
          active={activeBtn === "text"}
          onPress={() => {
            setActiveBtn(activeBtn === "text" ? null : "text");
            handleHaptic();
          }}
        />

        <IconButton
          icon="align-left"
          active={alignment === "left"}
          onPress={() => handleAlign("left")}
        />

        <IconButton
          icon="align-center"
          active={alignment === "center"}
          onPress={() => handleAlign("center")}
        />

        <IconButton
          icon="align-right"
          active={alignment === "right"}
          onPress={() => handleAlign("right")}
        />

        <IconButton
          icon="align-justify"
          active={alignment === "justify"}
          onPress={() => handleAlign("justify")}
        />
      </View>
    </SafeAreaView>
  );
}

/* Reusable icon button component */
function IconButton({ icon, active, onPress }) {
  const IconComponent = icon.startsWith("align") ? Feather : Ionicons;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.iconBtn, active && styles.iconBtnActive]}
    >
      <IconComponent
        name={icon}
        size={32}
        color={active ? "#440044" : darkColor.color}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 18,
    marginTop: 20,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconMargin: {
    marginRight: 12,
  },
  scrollContainer: {
    paddingBottom: 120, // prevent overlap with bottom bar
  },
  titleInput: {
    color: darkColor.color,
    fontSize: 25,
    margin: 12,
    fontWeight: "600",
    maxHeight: 120,
  },
  bodyContainer: {
    marginHorizontal: 12,
    backgroundColor: "#E8D3FFFF",
    borderRadius: 12,
    elevation: 5,
    height: 500,
  },
  bodyInput: {
    flex: 1,
    color: darkColor.color,
    fontSize: 16,
    padding: 12,
    letterSpacing: 1,
    fontStyle: "italic",
  },
  bottomBar: {
    position: "absolute",
    bottom: "5%",
    left: "5%",
    right: "5%",
    height: 60,
    borderRadius: 18,
    backgroundColor: "#DEC1FDFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  iconBtn: {
    borderRadius: 22,
    padding: 5,
  },
  iconBtnActive: {
    backgroundColor: "#44004428",
  },
});
