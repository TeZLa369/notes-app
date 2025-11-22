import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import bgStyle from "../assets/styles/bgStyle";
import darkColor from "../assets/styles/darkColor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import * as ImagePicker from "expo-image-picker";

export default function NoteUI({ navigation, route }) {
  const [date, setdate] = useState(new Date());
  const { noteID, fromDelete } = route.params;
  const [alignment, setAlignment] = useState("left");
  const [activeBtn, setActiveBtn] = useState(null);
  let [randomVal, setRandomVal] = useState(0);
  const [funRun, setfunRun] = useState(false);
  let [randomNumberBoolen, setRandomNumberBoolean] = useState(false);
  const [oldPics, setoldPics] = useState(false);
  const [trackUseEffect, setTrackUseEffect] = useState(false);
  const [imageURI, setimageURI] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setdate(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const [note, setnote] = useState({
    id: randomVal,
    userNoteTitle: "",
    userNoteBody: "",
    userNoteImgURI: "",
    userNoteDate: "",
    userNoteSaveDate: "",
  });

  const userNoteObj = {
    id: randomVal,
    userNoteTitle: note.userNoteTitle,
    userNoteBody: note.userNoteBody,
    userNoteImgURI: note.userNoteImgURI,
    userNoteDate: note.userNoteDate,
    userNoteSaveDate: note.userNoteSaveDate,
  };

  const textToPDF = async () => {
    try {
      const html = `
      <html>
        <body style="font-family: sans-serif; padding: 20px;">
          <h1>${userNoteObj.userNoteTitle}</h1>
          <p>${userNoteObj.userNoteBody}</p>
        </body>
      </html>
    `;

      const { uri } = await Print.printToFileAsync({ html });
      const newPath = `${FileSystem.documentDirectory}${userNoteObj.userNoteTitle}.pdf`;

      await FileSystem.moveAsync({
        from: uri,
        to: newPath,
      });

      Alert.alert("Success", `PDF saved at: ${newPath}`);
      console.log("✅ PDF saved:", newPath);
      try {
        await Sharing.shareAsync(newPath);
      } catch (e) {
        console.error("Failed to send PDF! ", e);
      }
      return newPath;
    } catch (error) {
      console.log("❌ Failed to create PDF:", error);
    }
  };

  // function openImagePicker() {
  //   const options = {
  //     mediaType: "photo",
  //     includeBase64: false,
  //     maxWidth: 2000,
  //     maxHeight: 2000,
  //   };
  //   launchImageLibrary(options, (response) => {
  //     if (response.didCancel) {
  //       console.log("User cancelled");
  //     } else if (response.errorCode) {
  //       console.error("There is an error: ", response.errorMessage);
  //     } else if (response.assets && response.assets.length > 0) {
  //       const imageURI = response.assets[0].uri;
  //       console.log("Selected image URI:", imageURI);
  //     }
  //   });
  // }

  const openImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission required",
        "You need to allow access to your photos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setimageURI((prev) => {
        const updated = [...prev, result.assets[0].uri];
        setnote({ ...note, userNoteImgURI: JSON.stringify(updated) });
        // console.log(imageURI);
        console.log("new image", result.assets[0].uri);
        return updated;
      });
    }
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

  async function deleteNote(key) {
    Alert.alert("Delete Note", "Do you want to delete the note?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const keyToSave =
              typeof noteID !== "number"
                ? "delete" + (await generateFourDigitRandom())
                : "delete" + noteID;
            console.log("key: ", keyToSave);
            userNoteObj.id = keyToSave;

            try {
              await saveData(
                "delete",
                String(keyToSave),
                JSON.stringify(userNoteObj)
              );
            } catch (e) {
              console.error("Can't move!", e);
            }
            try {
              await AsyncStorage.removeItem(key);
            } catch (e) {
              console.error("Can't move note to delete folder: ", e);
            }
            navigation.goBack();

            console.log("Note has been deleted!");
          } catch (error) {
            console.error("Failed to delete note: ", error);
          }
        },
      },
    ]);
  }

  async function saveData(place, key, value) {
    // userNoteObj.userNoteDate = date.toLocaleDateString();

    console.log(userNoteObj.userNoteDate);
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
        // ToastAndroid.show("Data saved successfully", 500);
        if (place === "save") {
          navigation.goBack();
        }
      } catch (e) {
        console.error("Failed to save data.", e);
      }
    }
  }

  async function restoreNote(key) {
    try {
      const keyToSave = await generateFourDigitRandom();
      userNoteObj.id = keyToSave;
      saveData("save", String(keyToSave), JSON.stringify(userNoteObj));
    } catch (error) {
      console.error("Failed to save note to homescreen: ", error);
    }
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {}
    console.error("Failed to delete note: ", error);
  }

  const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // value previously stored
        // console.log("Retrieved value:", value);
        setnote(JSON.parse(value));
        setfunRun(true);
        setTrackUseEffect(true);
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

  useEffect(() => {
    console.log(oldPics === false);
    if (trackUseEffect) {
      if (
        (typeof noteID === "number" && oldPics === false) ||
        (oldPics === false && fromDelete === "fromDelete")
      ) {
        console.log("Inside fun");
        if (note.userNoteImgURI) {
          const oldImages = JSON.parse(note.userNoteImgURI);
          // console.log("OLD images", oldImages);
          setimageURI(oldImages);
          console.log("length", oldImages.length);
        }
        setoldPics(true);
      }
    }
  }, [trackUseEffect, noteID, oldPics]);
  // console.log("HEEEEEEEE", note.userNoteImgURI);

  return (
    <SafeAreaView style={bgStyle.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color={darkColor.color} />
        </TouchableOpacity>

        {/* //! SHARE */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            disabled={fromDelete === "fromDelete" ? true : false}
            style={{
              opacity: fromDelete === "fromDelete" ? 0.2 : 1,
            }}
            onPress={async () => {
              await generateFourDigitRandom();
              // await exportTextFile(
              //   typeof noteID === "number" ? String(noteID) : String(randomVal),
              //   JSON.stringify(userNoteObj)
              // );
              textToPDF();
            }}
          >
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
              if (fromDelete === "fromDelete") {
                await restoreNote(noteID);
              } else {
                const keyToSave =
                  typeof noteID !== "number"
                    ? await generateFourDigitRandom()
                    : noteID;
                console.log("key: ", keyToSave);
                userNoteObj.id = keyToSave;
                userNoteObj.userNoteDate = date.toLocaleString();
                // userNoteObj.userNoteSaveDate = date.toISOString();
                // console.log("date: ",userNoteObj.userNoteSaveDate)
                userNoteObj.userNoteSaveDate = "2025-10-30T10:00:00";

                saveData(
                  "save",
                  String(keyToSave),
                  JSON.stringify(userNoteObj)
                );
              }
            }}
          >
            <MaterialIcons
              name={fromDelete === "fromDelete" ? "restore" : "save"}
              size={28}
              color={darkColor.color}
            />
          </TouchableOpacity>

          {/* //! DELETE */}
          <TouchableOpacity
            disabled={typeof noteID === "number" ? false : true}
            onPress={async () => {
              // navigation.navigate("DeletedUI");
              // console.log();
              // deleteAll();
              console.log("working");
              await deleteNote(String(noteID));
            }}
          >
            <Ionicons
              style={[
                styles.deleteIcon,
                {
                  display: typeof noteID === "number" ? "" : "none",
                },
              ]}
              color={"#6B4226"}
              size={28}
              name="trash-sharp"
            />
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
          {/* //! IMAGE */}
          {fromDelete === "fromDelete" || imageURI.length > 0 ? (
            <View style={styles.ImageContainer}>
              <ScrollView horizontal>
                {imageURI.map((uri, index) => (
                  <ImageBackground
                    style={styles.imageStyle}
                    key={index}
                    borderRadius={12}
                    source={{ uri }}
                    // height={200}
                    // width={300}
                    resizeMode="cover"
                  >
                    {/* //! REMOVE Image */}
                    {fromDelete === "fromDelete" ? null : (
                      <TouchableOpacity
                        onPress={() => {
                          const newImageArray = [...imageURI];
                          newImageArray.splice(index, 1);
                          // console.log(index, newImageArray, newImageArray.length);
                          try {
                            setimageURI(newImageArray);
                            setnote({
                              ...note,
                              userNoteImgURI: JSON.stringify(newImageArray),
                            });
                          } catch (e) {
                            console.error("Unable to remove image: ", e);
                          }
                        }}
                      >
                        <Ionicons
                          style={{
                            position: "absolute",
                            top: 3,
                            right: 4,
                          }}
                          name="close-circle-sharp"
                          color={"#FFF8F8FF"}
                          size={28}
                        />
                      </TouchableOpacity>
                    )}
                  </ImageBackground>
                ))}
              </ScrollView>
            </View>
          ) : null}
          {/* //! TITLE */}
          <TextInput
            multiline
            placeholder="Title goes here..."
            editable={fromDelete === "fromDelete" ? false : true}
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
              editable={fromDelete === "fromDelete" ? false : true}
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
          {/* //! DATE */}

          {/* <View style={styles.dateContainer}> */}
          <Text style={styles.dateStyle}>
            {noteID ? note.userNoteDate : date.toLocaleString()}
          </Text>
          {/* </View> */}
        </ScrollView>
      </KeyboardAvoidingView>
      {/* BOTTOM BAR */}

      {fromDelete === "fromDelete" ? (
        <View
          style={[
            styles.bottomBar,
            { opacity: fromDelete === "fromDelete" ? 0.3 : 1 },
          ]}
        >
          <Text>Editing is uavailable</Text>
        </View>
      ) : (
        <View
          style={[
            styles.bottomBar,
            { opacity: fromDelete === "fromDelete" ? 0.3 : 1 },
          ]}
        >
          <IconButton
            icon="attach"
            active={activeBtn === "attach"}
            onPress={() => {
              setActiveBtn(activeBtn === "attach" ? null : "attach");
              openImagePicker();
            }}
          />

          {/* //& IMAGE */}
          <IconButton
            icon="text"
            active={activeBtn === "text"}
            onPress={() => {
              setActiveBtn(activeBtn === "text" ? null : "text");
              console.log(note.userNoteDate);
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
      )}
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
  deleteIcon: {
    marginLeft: 8,
    // tintColor: "#440044FF",
    tintColor: "#6B4226",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    // alignItems: "center",
    justifyContent: "space-evenly",
  },
  iconMargin: {
    marginRight: 8,
  },
  scrollContainer: {
    paddingBottom: 120, // prevent overlap with bottom bar
  },
  titleInput: {
    color: darkColor.color,
    fontSize: 25,
    marginTop: 0,
    margin: 12,
    marginBottom: 16,
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
  ImageContainer: {
    marginLeft: 12,
    elevation: 8,
    marginBottom: 12,
    width: "100%",
  },
  imageStyle: {
    borderRadius: 12,
    width: 200,
    elevation: 8,
    marginRight: 12,
    height: 200,
  },
  bodyInput: {
    flex: 1,
    color: darkColor.color,
    fontSize: 16,
    padding: 12,
    letterSpacing: 1,
    fontStyle: "italic",
  },
  dateContainer: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dateStyle: {
    marginTop: "12%",
    textAlign: "center",
    color: "#8C5E3C",
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
