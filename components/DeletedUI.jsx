import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import bgStyle from "../assets/styles/bgStyle";
import { Ionicons } from "@expo/vector-icons";
import darkColor from "../assets/styles/darkColor";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DeletedUI = ({ navigation }) => {
  const [deletedNotes, setDeletedNotes] = useState([]);
  const [deletekeys, setkeys] = useState([]); // Store keys for "Delete All"
  const [searchList, setsearchList] = useState([]);
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = (screenWidth - 60) / 2;
  const [searchVal, setsearchVal] = useState();

  const loadNotes = async () => {
    try {
      // 1. Get all keys
      const allKeys = await AsyncStorage.getAllKeys();

      // 2. Filter keys that start with "delete"
      const targetKeys = allKeys.filter((key) => key.startsWith("delete"));
      setkeys(targetKeys); // Update state once, not in a loop

      if (targetKeys.length === 0) {
        setDeletedNotes([]);
        return;
      }

      // 3. Get values
      const result = await AsyncStorage.multiGet(targetKeys);

      // 4. Parse and Filter Expired Notes (Older than 30 days)
      const validNotes = [];
      const today = new Date();

      for (const [key, value] of result) {
        const parsedNote = JSON.parse(value);

        // Safety check if date exists
        if (parsedNote.userNoteSaveDate) {
          const oldDate = new Date(parsedNote.userNoteSaveDate);
          const diffTime = Math.abs(today - oldDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          // If older than 30 days, delete immediately and don't add to list
          if (diffDays > 30) {
            await AsyncStorage.removeItem(key);
            console.log(`Auto-deleted expired note: ${key}`);
          } else {
            validNotes.push(parsedNote);
          }
        } else {
          // If no date found, just show it
          validNotes.push(parsedNote);
        }
      }

      setDeletedNotes(validNotes);
      setsearchList(validNotes);
    } catch (e) {
      console.error("Failed to load notes:", e);
    }
  };

  function search(val) {
    setsearchVal(val);

    if (val.trim() === "") {
      setsearchList(deletedNotes);
      return;
    }

    const formattedQuery = val.toLowerCase();
    const filteredData = deletedNotes.filter((item) => {
      const title = item.userNoteTitle ? item.userNoteTitle.toLowerCase() : "";
      const body = item.userNoteBody ? item.userNoteBody.toLowerCase() : "";
      return title.includes(formattedQuery) || body.includes(formattedQuery);
    });
    setsearchList(filteredData);
  }

  // useFocusEffect calls the function whenever the screen comes into view
  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  async function deleteAll() {
    if (deletedNotes.length === 0) {
      Alert.alert("Error!", "Nothing to delete!");
    } else {
      Alert.alert("Delete All", "Do you really want to delete all notes?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive", // "destructive" turns the button red on iOS
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(deletekeys);
              setDeletedNotes([]);
              setkeys([]);
              // alert("All notes are deleted!"); // Alert is redundant if UI clears
            } catch (e) {
              console.error("Failed to delete notes", e);
            }
          },
        },
      ]);
    }
  }

  return (
    <SafeAreaView style={bgStyle.container}>
      {/* //! HEADING */}
      <View style={DeleteStyles.headingContainer}>
        <View style={DeleteStyles.headignAndBtn}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color={darkColor.color} />
          </TouchableOpacity>
          <Text style={DeleteStyles.headingTxt}>Recently Deleted</Text>
        </View>

        <View>
          {/* //! DELETE ALL BTN */}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              deleteAll();
            }}
          >
            <Ionicons
              style={DeleteStyles.deleteIcon}
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
            placeholderTextColor={"#8C5E3C"}
            value={searchVal}
            onChangeText={(txt) => {
              search(txt);
            }}
          />
          <TouchableOpacity onPress={() => alert("Search icon is pressed")}>
            <Ionicons
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

      {/* //! NOTES UI */}
      <FlatList
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        style={DeleteStyles.flatlistStyle}
        showsVerticalScrollIndicator={false}
        data={searchList}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()} // Important for performance
        columnWrapperStyle={{ justifyContent: "space-between" }} // space-between aligns columns better
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
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
                <Text style={DeleteStyles.flatlistTxtHeading} numberOfLines={1}>
                  {item.userNoteTitle}
                </Text>
                <Text style={DeleteStyles.flatlistTxtBody} numberOfLines={4}>
                  {/* numberOfLines handles the slicing automatically */}
                  {item.userNoteBody}
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
      />
    </SafeAreaView>
  );
};

export default DeletedUI;

const DeleteStyles = StyleSheet.create({
  headingContainer: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
    marginHorizontal: 18,
    alignItems: "center",
    justifyContent: "space-between",
  },
  headignAndBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  headingTxt: {
    fontWeight: "600",
    fontSize: 24,
    color: "#6B4226",
  },
  deleteIcon: {
    tintColor: "#6B4226",
  },
  searchContainer: {
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 5,
  },
  txtInputContainer: {
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#9C7455",
  },
  txtInput: {
    flex: 1,
    color: "#6B4226",
  },
  infoTxt: {
    marginTop: 8,
    marginHorizontal: 12,
    textAlign: "center",
    color: "#6E4B0071",
    fontWeight: "500",
    fontSize: 12,
  },
  flatlistContainer: {
    borderRadius: 12,
    backgroundColor: "#F5E6C5",
    height: 150,
    borderWidth: 1,
    borderColor: "#EAD8B1",
    marginBottom: 10,
    padding: 5,
  },
  flatlistStyle: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  flatlistTxtHeading: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    fontWeight: "700",
    color: "#673C1F",
  },
  flatlistTxtBody: {
    color: "#513624",
    margin: 10,
    fontSize: 13,
  },
  emptyNote: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  txtEmptyNote: {
    color: "#44004442",
    fontSize: 30,
    fontStyle: "italic",
  },
});
