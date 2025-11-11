import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import bgStyle from "../assets/styles/bgStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

let userNotes = [];
let userKeys = [];
export default function HomeUI({ navigation }) {
  const [notes, setNotes] = useState([]); // <-- use state
  let [taps, settaps] = useState(0);
  const screenWidth = Dimensions.get("window").width;
  // 60 = total horizontal padding + spacing between cards
  const cardWidth = (screenWidth - 60) / 2;
  const [val, setVal] = useState(0);

  const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        console.log("Retrieved value:", value);
        return value;
      }
    } catch (e) {
      console.error("Failed to fetch data", e);
    }
  };

  async function saveData(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
      console.log("Data saved successfully");
    } catch (e) {
      console.error("Failed to save data.", e);
    }
  }

  let value = [];
  const getKeys = async () => {
    try {
      value = await AsyncStorage.getAllKeys();
      // await AsyncStorage.clear();
      // console.log(value);
      return value;
    } catch (e) {
      console.error(e);
    }
  };

  async function deleteAll() {
    try {
      await AsyncStorage.clear();
      setNotes([]); // clear UI too
      alert("All notes deleted!");
    } catch (e) {
      console.error("Failed to delete notes", e);
    }
  }

  // Example: define async function that awaits and then logs

  async function loadAndLogKeys() {
    try {
      userKeys = await getKeys();
      // console.log("Key values are:", userKeys);
      await getKeyValues(); // wait for note loading
      // console.log("All notes:", userNotes);
    } catch (err) {
      console.log("Error loading keys:", err);
    }
  }

  async function getKeyValues() {
    for (const key of userKeys) {
      // console.log("Fetching data for key:", key);
      try {
        const value = await getData(String(key)); // ✅ wait for AsyncStorage
        if (value) {
          userNotes.push(JSON.parse(value)); // ✅ store parsed data
        }
      } catch (err) {
        console.log("Error parsing data for key:", key, err);
      }
    }
  }

  const loadNotes = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(keys);
      const parsedNotes = result.map(([key, value]) => JSON.parse(value));
      setNotes(parsedNotes);
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

  loadAndLogKeys();
  const notes2 = [
    {
      id: 1,
      title: "Buy milk",
      body: "Pick up a carton of low-fat milk from the store.",
    },
    {
      id: 2,
      title: "Finish project",
      body: "Complete the final report and submit it before the deadline.",
    },
    {
      id: 3,
      title: "Call mom",
      body: "Give mom a quick call to check in and catch up.",
    },
    {
      id: 4,
      title: "Pay electricity bill",
      body: "Log in to the utility website and pay this month’s bill.",
    },
    {
      id: 5,
      title: "Book dentist appointment",
      body: "Schedule a routine check-up with the dentist.",
    },
    {
      id: 6,
      title: "Clean the kitchen",
      body: "Wash dishes, wipe counters, and mop the floor",
    },
    {
      id: 7,
      title: "Read 20 pages of a book",
      body: "Continue reading the novel and mark progress.",
    },
    {
      id: 8,
      title: "Go for a run",
      body: "Run 3 kilometers around the park for exercise.",
    },
    {
      id: 9,
      title: "Prepare presentation slides",
      body: "Design slides with visuals and bullet points for the meeting.",
    },
    {
      id: 10,
      title: "Reply to emails",
      body: "Respond to pending work and personal emails.",
    },
    {
      id: 11,
      title: "Organize desk",
      body: "Clear clutter, file papers, and arrange stationery neatly.",
    },
    {
      id: 12,
      title: "Buy groceries",
      body: "Get vegetables, fruits, and other weekly essentials.",
    },
    {
      id: 13,
      title: "Water the plants",
      body: "Give the indoor and balcony plants enough water.",
    },
    {
      id: 14,
      title: "Plan weekend trip",
      body: "Research destinations, book tickets, and plan itinerary.",
    },
    {
      id: 15,
      title: "Update resume",
      body: "Add recent work experience and polish formatting.",
    },
  ];

  if (taps > 10) {
    alert("WHY BRO WHY???");
    settaps((taps = 0));
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={bgStyle.container}>
      {/* //! HEADING */}
      <View style={styles.headingContainer}>
        <TouchableOpacity
          onPress={() => {
            settaps(taps + 1);
          }}
        >
          <Text style={styles.headingTxt}>Notebook</Text>
        </TouchableOpacity>
        {/* {taps > 10 ?  : ""}
        {taps > 10 ? settaps((taps = 0)) : null} */}

        {/* //! DELETE */}
        <TouchableOpacity
          onPress={() => {
            // navigation.navigate("DeletedUI");
            // console.log();
            deleteAll();
          }}
        >
          <Image
            style={styles.deleteIcon}
            color={"#6B4226"}
            source={require("../assets/icons/delete.png")}
          />
        </TouchableOpacity>
      </View>

      {/* //! SEARCH */}
      <View style={styles.searchContainer}>
        <View style={styles.txtInputContainer}>
          <TextInput
            style={styles.txtInput}
            placeholder="Search Notes"
            // placeholderTextColor={"#440044FF"}
            placeholderTextColor={"#9C745588"}
          />
          {/* //! SEARCH */}
          <TouchableOpacity
            onPress={() => {
              // alert("Search icon is pressed");
              getData("0");
            }}
          >
            <Ionicons
              color={"#440044FF"}
              style={styles.searchIcon}
              name="search-sharp"
              size={26}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* //! NOTES  UI*/}
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.flatlistStyle}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={notes}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-evenly" }}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("NoteUI", item.id);
              }}
            >
              <View style={[styles.flatlistContainer, { width: cardWidth }]}>
                <Text style={styles.flatlistTxtHeading}>
                  {item.userNoteTitle}
                </Text>
                <Text style={styles.flatlistTxtBody}>
                  {item?.userNoteBody?.length > 75
                    ? item?.userNoteBody?.slice(0, 75) + "..."
                    : item?.userNoteBody}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={() => (
          <View style={styles.emptyNote}>
            <Text style={styles.txtEmptyNote}>No Notes yet</Text>
          </View>
        )}
      ></FlatList>

      {/* //! FLOATING BTN */}
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.floatingBtn}
        onPress={() => {
          navigation.navigate("NoteUI", {
            noteTitle: "",
            noteBody: "",
          });
        }}
      >
        <Ionicons
          name="pencil-outline"
          size={40}
          // color={"#E8D3FFAD"}
          color={"#FAF3E0"} // light beige to contrast the dark brown
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E8D3FFAD",
    width: "100%",
    height: "100%",
  },
  headingTxt: {
    fontSize: 30,
    fontWeight: "600",
    // color: "#440044FF",
    color: "#6B4226",
  },
  headingContainer: {
    alignItems: "center",
    marginTop: 20,
    margin: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deleteIcon: {
    width: 25,
    height: 25,
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
    borderColor: "#9C7455",
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
    borderColor: "#440044FF",
  },

  txtInput: {
    fontSize: 16,
  },

  searchIcon: {},

  floatingBtn: {
    borderWidth: 1,
    borderRadius: 50,
    shadowColor: "#000",
    position: "absolute",
    // backgroundColor: "#391639FF",
    backgroundColor: "#8C5E3C",
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    padding: 10,
    shadowOffset: { width: 0, height: 4 },
    bottom: 30,
    right: 20,
  },

  flatlistContainer: {
    elevation: 8,
    borderRadius: 12,
    // backgroundColor: "#DCCCF7FF",
    backgroundColor: "#F5E6C5",
    height: 150,
    borderWidth: 1,
    marginBottom: 10,
  },

  flatlistStyle: {
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
    margin: 12,
    color: "#513624FF",
  },

  emptyNote: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "30%",
  },

  txtEmptyNote: {
    color: "#44004442",
    fontSize: 30,
    fontStyle: "italic",
  },
});
