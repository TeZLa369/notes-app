import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DeletedUI from "./components/DeletedUI";
import NoteUI from "./components/NoteUI";
import HomeUI from "./components/HomeUI";
import bgStyle from "./assets/styles/bgStyle";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="HomeUI"
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          statusBarStyle: "dark",
        }}
      >
        <Stack.Screen name="HomeUI" component={HomeUI} />
        <Stack.Screen name="NoteUI" component={NoteUI} />
        <Stack.Screen name="DeletedUI" component={DeletedUI} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
