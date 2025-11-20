import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  ToastAndroid,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import bgStyle from "../assets/styles/bgStyle";
import { Ionicons } from "@expo/vector-icons";
import darkColor from "../assets/styles/darkColor";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// let deletedNotes = [];

const DeletedUI = ({ navigation }) => {
  const [deletedNotes, setDeletedNotes] = useState([]);
  const screenWidth = Dimensions.get("window").width;
  // 60 = total horizontal padding + spacing between cards
  const cardWidth = (screenWidth - 60) / 2;
  // const deletedNotes = [
  //   { id: 1, title: "Test", body: "This is for testing only" },
  //   { id: 2, title: "Test", body: "This is for testing only" },
  // ];
  const [deletekeys, setkeys] = useState([]);

  const loadNotes = async () => {
    try {
      let numKeys = [];
      let i = 0;
      let keys = await AsyncStorage.getAllKeys();
      numKeys = keys.forEach((index) => {
        if (index.startsWith("delete")) {
          numKeys[i] = index;
          i++;
        }
        keys = numKeys;
        setkeys(keys);
      });
      console.log(deletekeys);
      const result = await AsyncStorage.multiGet(keys);

      const parsedNotes = result.map(([key, value]) => JSON.parse(value));
      setDeletedNotes(parsedNotes);
      // console.log(parsedNotes);
    } catch (e) {
      console.error("Failed to load notes:", e);
    }
  };
  useEffect(() => {
    loadNotes();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadNotes();
    }, [])
  );

  async function deleteAll() {
    if (!deletedNotes.length > 0) {
      Alert.alert("Error!", "Nothing to delete!");
    } else {
      try {
        Alert.alert("Delete All", "Do you really want to delete all notes?", [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              await AsyncStorage.multiRemove(deletekeys);
              setDeletedNotes([]); // clear UI too
              alert("All notes are deleted!");
            },
          },
        ]);
      } catch (e) {
        console.error("Failed to delete notes", e);
      }
    }
  }

  return (
    <SafeAreaView style={bgStyle.container}>
      {/* //! HEADING */}
      <View style={DeleteStyles.headingContainer}>
        <View style={DeleteStyles.headignAndBtn}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={28} color={darkColor.color} />
          </TouchableOpacity>
          <Text style={DeleteStyles.headingTxt}>Recently Deleted</Text>
        </View>

        <View>
          {/* //! DELETE BTN */}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              deleteAll();
            }}
          >
            <Ionicons
              style={DeletedUI.deleteIcon}
              color={"#6B4226"}
              size={28}
              name="trash-sharp"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* //! SEARCH */}
      <View style={DeleteStyles.searchContainer}>
        <View style={DeleteStyles.txtInputContainer}>
          <TextInput
            style={DeleteStyles.txtInput}
            placeholder="Search Notes"
            // placeholderTextColor={"#440044FF"}
            placeholderTextColor={"#8C5E3C"}
          />
          <TouchableOpacity
            onPress={() => {
              alert("Search icon is pressed");
            }}
          >
            <Ionicons
              // color={"#440044FF"}
              color={"#6B4226"}
              style={DeleteStyles.searchIcon}
              name="search-sharp"
              size={26}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* //! DELETE INFO */}
      <View>
        <Text style={DeleteStyles.infoTxt}>
          Notes will remain available for a period of 30 days. After this time,
          they will be permanently deleted.
        </Text>
      </View>
      {/* //! NOTES  UI*/}
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        style={DeleteStyles.flatlistStyle}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={deletedNotes}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-evenly" }}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                console.log("ID: ", item.id);
                navigation.navigate("NoteUI", {
                  noteID: item.id,
                  fromDelete: "fromDelete",
                });
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
            >
              <View
                style={[DeleteStyles.flatlistContainer, { width: cardWidth }]}
              >
                <Text style={DeleteStyles.flatlistTxtHeading}>
                  {item.userNoteTitle}
                </Text>
                <Text style={DeleteStyles.flatlistTxtBody}>
                  {item?.userNoteBody?.length > 75
                    ? item.userNoteBody.slice(0, 75) + "..."
                    : item.userNoteBody}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={() => (
          <View style={DeleteStyles.emptyNote}>
            <Text style={DeleteStyles.txtEmptyNote}>No Notes yet</Text>
          </View>
        )}
      ></FlatList>
    </SafeAreaView>
  );
};

export default DeletedUI;
const DeleteStyles = StyleSheet.create({
  headingContainer: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
    margin: 18,
    alignItems: "center",
    justifyContent: "space-between",
  },
  headignAndBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  headingTxt: {
    fontWeight: 600,
    fontSize: 24,
    color: "#6B4226",
  },
  deleteIcon: {
    // marginLeft: 8,
    // tintColor: "#440044FF",
    tintColor: "#6B4226",
  },
  searchContainer: {
    alignItems: "center",
    marginRight: 15,
    marginLeft: 15,
    flexDirection: "row",
    justifyContent: "space-evenly",
    height: "15px",
  },
  txtInputContainer: {
    alignItems: "center",
    padding: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    maxWidth: "100%",
    borderWidth: 1,
    borderRadius: 20,
    borderStyle: "solid",
    // borderColor: "#440044FF",
    borderColor: "#9C7455",
  },
  infoTxt: {
    marginTop: 8,
    marginLeft: 12,
    marginRight: 12,
    textAlign: "center",
    // color: "#FF00006A",
    color: "#6E4B0071",
    fontWeight: 500,
  },
  flatlistContainer: {
    borderRadius: 12,
    // backgroundColor: "#DCCCF7FF",
    backgroundColor: "#F5E6C5",
    height: 150,
    borderWidth: 1,
    marginBottom: 10,
  },

  flatlistStyle: {
    // elevation: 8,
    marginTop: 20,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 12,
  },
  flatlistTxtHeading: {
    marginTop: 12,
    marginLeft: 12,
    marginRight: 12,
    fontWeight: "700",
    color: "#673C1FFF",
  },
  flatlistTxtBody: {
    color: "#513624FF",
    margin: 12,
  },

  emptyNote: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  txtEmptyNote: {
    color: "#44004442",
    fontSize: 30,
    fontStyle: "italic",
  },
});
