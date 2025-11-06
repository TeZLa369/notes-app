import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DeletedUI from "./components/DeletedUI";
import NoteUI from "./components/NoteUI";
import HomeUI from "./components/HomeUI";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="NoteUI">
        <Stack.Screen
          options={{ headerShown: false }}
          name="HomeUI"
          component={HomeUI}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="NoteUI"
          component={NoteUI}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="DeletedUI"
          component={DeletedUI}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
