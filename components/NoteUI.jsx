import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import bgStyle from "../assets/styles/bgStyle";
import darkColor from "../assets/styles/darkColor";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";

export default function NoteUI({ naviagtion }) {
  const [isAttach, setIsAttach] = useState(false);
  const [isTxt, setIsTxt] = useState(false);
  const [isCenter, setisCenter] = useState(false);
  const [isRight, setisRight] = useState(false);
  const [isLeft, setisLeft] = useState(false);
  const [isJustify, setisJustify] = useState(false);
  return (
    <SafeAreaView style={bgStyle.container}>
      {/* //! HEADING */}
      <View style={NoteStyles.headingContainer}>
        <TouchableOpacity onPress={() => naviagtion.goBack()}>
          <Ionicons name="arrow-back" size={40} color={darkColor.color} />
        </TouchableOpacity>
        <View style={NoteStyles.insideHeadingContainer}>
          <TouchableOpacity>
            <Ionicons name="share" size={40} color={darkColor.color} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="save" size={38} color={darkColor.color} />
          </TouchableOpacity>
        </View>
      </View>

      {/* //! TITLE TEXT */}
      <TextInput
        multiline={true}
        placeholderTextColor={"#44004493"}
        style={NoteStyles.headingTxt}
        placeholder="Title goes here..."
      />
      {/* //! BODY TEXT */}
      <View style={NoteStyles.bodyTxtContainer}>
        <TextInput
          multiline={true}
          style={NoteStyles.bodyTxt}
          placeholder="Note goes here..."
        />
      </View>

      {/* //! BOTTOM BAR */}
      <View style={NoteStyles.bottomBar}>
        <TouchableOpacity
          onPress={() => {
            setIsAttach(!isAttach);
          }}
        >
          <Ionicons
            name="attach"
            style={isAttach ? NoteStyles.btnEnabled : null}
            size={40}
            color={darkColor.color}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setIsTxt(!isTxt);
          }}
        >
          <Ionicons
            name="text"
            style={isTxt ? NoteStyles.btnEnabled : null}
            size={38}
            color={darkColor.color}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            !isLeft ? setisJustify(!isJustify) : setisLeft(!isLeft),
              setisJustify(!isJustify);
            !isRight ? setisJustify(!isJustify) : setisRight(!isRight),
              setisJustify(!isJustify);
            !isCenter ? setisJustify(!isJustify) : setisCenter(!isCenter),
              setisJustify(!isJustify);
          }}
        >
          <Feather
            name="align-justify"
            style={isJustify ? NoteStyles.btnEnabled : null}
            size={40}
            color={darkColor.color}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            !isRight ? setisLeft(!isLeft) : setisRight(!isRight),
              setisLeft(!isLeft);
            !isJustify ? setisLeft(!isLeft) : setisJustify(!isJustify),
              setisLeft(!isLeft);
            !isCenter ? setisLeft(!isLeft) : setisCenter(!isCenter),
              setisLeft(!isLeft);
          }}
        >
          <Feather
            name="align-left"
            style={isLeft ? NoteStyles.btnEnabled : null}
            size={40}
            color={darkColor.color}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            !isRight ? setisCenter(!isCenter) : setisRight(!isRight),
              setisCenter(!isCenter);
            !isJustify ? setisCenter(!isCenter) : setisJustify(!isJustify),
              setisCenter(!isCenter);
            !isLeft ? setisCenter(!isCenter) : setisLeft(!isLeft),
              setisCenter(!isCenter);
          }}
        >
          <Feather
            name="align-center"
            style={isCenter ? NoteStyles.btnEnabled : null}
            size={40}
            color={darkColor.color}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            !isLeft ? setisRight(!isRight) : setisLeft(!isLeft),
              setisRight(!isRight);
            !isCenter ? setisRight(!isRight) : setisCenter(!isCenter),
              setisRight(!isRight);
            !isJustify ? setisRight(!isRight) : setisJustify(!isJustify),
              setisRight(!isRight);
          }}
        >
          <Feather
            name="align-right"
            size={40}
            style={isRight ? NoteStyles.btnEnabled : null}
            color={darkColor.color}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const NoteStyles = StyleSheet.create({
  headingContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginLeft: 12,
    marginRight: 12,
    alignItems: "center",
  },
  insideHeadingContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  headingTxt: {
    color: darkColor.color,
    fontSize: 25,
    marginTop: 12,
    marginLeft: 12,
    marginRight: 12,
    fontWeight: 700,
  },
  bodyTxtContainer: {
    height: "74%",
    backgroundColor: "#E8D3FFFF",
    marginTop: 12,
    borderRadius: 12,
    marginLeft: 12,
    marginRight: 12,
  },
  bodyTxt: {
    letterSpacing: 1.5,
    color: darkColor.color,
    flexWrap: "wrap",
    width: "100%",
    paddingHorizontal: 12,
    fontSize: 16,
    fontStyle: "italic",
  },
  bottomBar: {
    height: 60,
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    borderRadius: 18,
    marginLeft: 12,
    marginTop: 15,
    marginRight: 12,
    backgroundColor: "#E8D3FFFF",
  },
  btnEnabled: {
    padding: 5,
    backgroundColor: "#44004428",
    borderRadius: 20,
  },
});
