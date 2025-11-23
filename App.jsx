import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeUI from "./components/HomeUI";
import NoteUI from "./components/noteUI";
import DeletedUI from "./components/deletedUI";

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
