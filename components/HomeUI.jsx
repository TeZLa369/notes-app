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
import { useState } from "react";
import bgStyle from "../assets/styles/bgStyle";
import NoteUI from "./NoteUI";

export default function HomeUI({ navigation }) {
  let [taps, settaps] = useState(0);
  const screenWidth = Dimensions.get("window").width;
  // 60 = total horizontal padding + spacing between cards
  const cardWidth = (screenWidth - 60) / 2;
  const emptyNotes = [];
  const notes = [
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

  return (
    <SafeAreaView edges={["top", "bottom"]} style={bgStyle.container}>
      {/* //! HEADING */}
      <View style={styles.headingContainer}>
        <Text
          onPress={() => {
            settaps(taps + 1);
          }}
          style={styles.headingTxt}
        >
          Notebook
        </Text>
        {taps > 10 ? ToastAndroid.show("WHY BRO WHY???", 500) : null}
        {taps > 10 ? settaps((taps = 0)) : null}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("DeletedUI");
          }}
        >
          <Image
            style={styles.deleteIcon}
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
            placeholderTextColor={"#440044FF"}
          />
          <TouchableOpacity
            onPress={() => {
              alert("Search icon is pressed");
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
                ToastAndroid.show(item.title, 500);
              }}
            >
              <View style={[styles.flatlistContainer, { width: cardWidth }]}>
                <Text style={styles.flatlistTxtHeading}>{item.title}</Text>
                <Text style={styles.flatlistTxtBody}>
                  {item.body.length > 75
                    ? item.body.slice(0, 75) + "..."
                    : item.body}
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
          navigation.navigate("NoteUI");
        }}
      >
        <Ionicons name="pencil-outline" size={40} color={"#E8D3FFAD"} />
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
    color: "#440044FF",
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
    tintColor: "#440044FF",
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
    backgroundColor: "#391639FF",
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    padding: 10,
    shadowOffset: { width: 0, height: 4 },
    bottom: 30,
    right: 20,
  },

  flatlistContainer: {
    borderRadius: 12,
    backgroundColor: "#DCCCF7FF",
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
    fontWeight: "900",
  },
  flatlistTxtBody: {
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
