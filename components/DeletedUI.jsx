import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import bgStyle from "../assets/styles/bgStyle";
import { Ionicons } from "@expo/vector-icons";
import darkColor from "../assets/styles/darkColor";

const DeletedUI = ({ navigation }) => {
  const screenWidth = Dimensions.get("window").width;
  // 60 = total horizontal padding + spacing between cards
  const cardWidth = (screenWidth - 60) / 2;
  const deletedNotes = [
    { id: 1, title: "Test", body: "This is for testing only" },
    { id: 2, title: "Test", body: "This is for testing only" },
  ];
  return (
    <SafeAreaView style={bgStyle.container}>
      {/* //! HEADING */}
      <View style={DeleteStyles.headingContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={30} color={darkColor.color} />
        </TouchableOpacity>
        <Text style={DeleteStyles.headingTxt}>Recently Deleted</Text>
      </View>

      {/* //! SEARCH */}
      <View style={DeleteStyles.searchContainer}>
        <View style={DeleteStyles.txtInputContainer}>
          <TextInput
            style={DeleteStyles.txtInput}
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
                ToastAndroid.show(item.title, 500);
              }}
            >
              <View
                style={[DeleteStyles.flatlistContainer, { width: cardWidth }]}
              >
                <Text style={DeleteStyles.flatlistTxtHeading}>
                  {item.title}
                </Text>
                <Text style={DeleteStyles.flatlistTxtBody}>
                  {item?.body?.length > 75
                    ? item.body.slice(0, 75) + "..."
                    : item.body}
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
  },
  headingTxt: {
    fontWeight: 600,
    fontSize: 24,
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
  infoTxt: {
    marginTop: 8,
    marginLeft: 12,
    marginRight: 12,
    textAlign: "center",
    color: "#FF00006A",
    fontWeight: 500,
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
