import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import bgStyle from "../assets/styles/bgStyle";
import darkColor from "../assets/styles/darkColor";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NoteUI({ navigation, route }) {
  const noteID = route.params;
  const [alignment, setAlignment] = useState("left");
  const [activeBtn, setActiveBtn] = useState(null);
  let [randomVal, setRandomVal] = useState(0);
  const [funRun, setfunRun] = useState(false);
  let [randomNumberBoolen, setRandomNumberBoolean] = useState(false);

  const [note, setnote] = useState({
    id: randomVal,
    userNoteTitle: "",
    userNoteBody: "",
  });

  const userNoteObj = {
    id: randomVal,
    userNoteTitle: note.userNoteTitle,
    userNoteBody: note.userNoteBody,
  };

  const handleHaptic = () =>
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

  const handleAlign = (alignType) => {
    setAlignment(alignType);
    handleHaptic();
  };

  const getKeys = async () => {
    try {
      const value = await AsyncStorage.getAllKeys();
      if (value !== null) {
        return value;
      }
    } catch (e) {
      console.error("Failed to fetch keys", e);
    }
  };

  // async function generateFourDigitRandom() {
  //   try {
  //     const oldKeys = await getKeys(); // wait for the keys first
  //     const newKey = Math.floor(1000 + Math.random() * 9000);
  //     console.log("new:", newKey);

  //     // Check if the key already exists
  //     if (oldKeys.includes(String(newKey))) {
  //       console.log("Duplicate key found. Regenerating...");
  //       return generateFourDigitRandom(); // recursive retry
  //     }

  //     // Unique key found
  //     console.log("Unique key:", newKey);
  //     setRandomVal(newKey);
  //     setRandomNumberBoolean(true);
  //   } catch (e) {
  //     console.error("Error generating random key:", e);
  //   }
  // }

  async function generateFourDigitRandom() {
    const oldKeys = await getKeys();
    const newKey = Math.floor(1000 + Math.random() * 9000);
    if (oldKeys.includes(String(newKey))) return generateFourDigitRandom();
    console.log(newKey);
    return newKey;
  }

  useEffect(() => {
    if (!randomNumberBoolen) {
      generateFourDigitRandom();
    }
  }, [randomNumberBoolen]);

  async function saveData(key, value) {
    if (note.userNoteBody === "" && note.userNoteTitle === "") {
      alert("There is nothing to save!");
    } else if (note.userNoteTitle === "") {
      alert("Please write a title!");
    } else if (note.userNoteBody === "") {
      alert("Please write a note!");
    } else {
      try {
        if (typeof noteID === "number") {
          userNoteObj.id = noteID;
        }
        await AsyncStorage.setItem(key, value);
        console.log("Data saved successfully");
        ToastAndroid.show("Data saved successfully", 500);
      } catch (e) {
        console.error("Failed to save data.", e);
      }
    }
  }

  const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // value previously stored
        // console.log("Retrieved value:", value);
        setnote(JSON.parse(value));
        setfunRun(true);
        // console.log("Data", note.userNoteBody);
      }
    } catch (e) {
      console.error("Failed to fetch data", e);
    }
  };

  useEffect(() => {
    if (!funRun && noteID) {
      getData(String(noteID));
    }
  }, [funRun, noteID]);

  return (
    <SafeAreaView style={bgStyle.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color={darkColor.color} />
        </TouchableOpacity>

        {/* //! SHARE */}
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons
              name="share"
              size={30}
              color={darkColor.color}
              style={styles.iconMargin}
            />
          </TouchableOpacity>

          {/* //! SAVE */}
          <TouchableOpacity
            onPress={async () => {
              const keyToSave =
                typeof noteID !== "number"
                  ? await generateFourDigitRandom()
                  : noteID;
              console.log("key: ", keyToSave);
              userNoteObj.id = keyToSave;
              saveData(String(keyToSave), JSON.stringify(userNoteObj));
            }}
          >
            <Ionicons name="save" size={28} color={darkColor.color} />
          </TouchableOpacity>
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
          {/* //! TITLE */}
          <TextInput
            multiline
            placeholder="Title goes here..."
            // placeholderTextColor="#44004493"
            placeholderTextColor={"#8C5E3C"}
            style={styles.titleInput}
            value={note.userNoteTitle}
            // onChangeText={setuserTitleTxt}
            onChangeText={(text) => setnote({ ...note, userNoteTitle: text })}
          />

          {/* //! BODY TEXT */}
          <View style={styles.bodyContainer}>
            <TextInput
              multiline
              scrollEnabled
              value={note.userNoteBody}
              onChangeText={(text) => setnote({ ...note, userNoteBody: text })}
              placeholder="Note goes here..."
              // placeholderTextColor="#44004493"
              placeholderTextColor={"#8C5E3C"}
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
            getKeys();
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
        color={active ? "#8C5E3C" : darkColor.color}
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
    marginTop: 0,
    margin: 12,
    fontWeight: "600",
    // maxHeight: 320,
  },
  bodyContainer: {
    marginHorizontal: 12,
    // backgroundColor: "#E8D3FFFF",
    backgroundColor: "#F5E6C5",
    borderRadius: 12,
    elevation: 5,
    minHeight: 500,
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
    // backgroundColor: "#DEC1FDFF",
    backgroundColor: "#F5E6C5",
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
    // backgroundColor: "#44004428",
    backgroundColor: "#6B422620", // subtle brown tint on press
  },
});
