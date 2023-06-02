import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, Alert, Platform } from "react-native";
import * as Notification from "expo-notifications";
import { useEffect } from "react";

Notification.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: true,
      shouldShowAlert: true,
    };
  },
});

export default function App() {
  useEffect(() => {
    async function configurePushNotification() {
      const { status } = await Notification.getPermissionsAsync();
      let finalStatus = status;

      if (finalStatus !== "granted") {
        const { status } = await Notification.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission required",
          "Push notification need the appropriate permssions."
        );
        return;
      }

      const pushTokenData = await Notification.getExpoPushTokenAsync();
      console.log(pushTokenData);
    }

    if (Platform.OS === "android") {
      Notification.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notification.AndroidImportance.DEFAULT,
      });
    }

    configurePushNotification();
  }, []);

  useEffect(() => {
    const subscription = Notification.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received");
        console.log(notification.request.content.data);
      }
    );

    const subscription2 = Notification.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notification response");
        console.log(response.notification.request.content);
      }
    );

    return () => {
      subscription.remove();
      subscription2.remove();
    };
  }, []);

  function scheduleNotificationHandler() {
    Notification.scheduleNotificationAsync({
      content: {
        title: "My first local Notification",
        subtitle: "My subtitle",
        body: "This is the body of Notification",
        data: { userName: "wontae" },
      },
      trigger: {
        seconds: 2,
      },
    });
  }

  function sendPushNotificationHandler() {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: "ExponentPushToken[oRH3S5BI2fn0UvhnwcJcBg]",
        title: "Test - sent from a device!",
        body: "This is a test!",
      }),
    });
  }

  return (
    <View style={styles.container}>
      <Button
        title="Schedule Notification"
        onPress={sendPushNotificationHandler}
      />
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

// import { useState, useEffect, useRef } from "react";
// import { Text, View, Button, Platform } from "react-native";
// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// export default function App() {
//   const [expoPushToken, setExpoPushToken] = useState("");
//   const [notification, setNotification] = useState(false);
//   const notificationListener = useRef();
//   const responseListener = useRef();

//   useEffect(() => {
//     registerForPushNotificationsAsync().then((token) =>
//       setExpoPushToken(token)
//     );

//     notificationListener.current =
//       Notifications.addNotificationReceivedListener((notification) => {
//         setNotification(notification);
//       });

//     responseListener.current =
//       Notifications.addNotificationResponseReceivedListener((response) => {
//         console.log(response);
//       });

//     return () => {
//       Notifications.removeNotificationSubscription(
//         notificationListener.current
//       );
//       Notifications.removeNotificationSubscription(responseListener.current);
//     };
//   }, []);

//   return (
//     <View
//       style={{
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "space-around",
//       }}
//     >
//       <Text>Your expo push token: {expoPushToken}</Text>
//       <View style={{ alignItems: "center", justifyContent: "center" }}>
//         <Text>
//           Title: {notification && notification.request.content.title}{" "}
//         </Text>
//         <Text>Body: {notification && notification.request.content.body}</Text>
//         <Text>
//           Data:{" "}
//           {notification && JSON.stringify(notification.request.content.data)}
//         </Text>
//       </View>
//       <Button
//         title="Press to schedule a notification"
//         onPress={async () => {
//           await schedulePushNotification();
//         }}
//       />
//     </View>
//   );
// }

// async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "You've got mail! 📬",
//       body: "Here is the notification body",
//       data: { data: "goes here" },
//     },
//     trigger: { seconds: 2 },
//   });
// }

// async function registerForPushNotificationsAsync() {
//   let token;

//   if (Platform.OS === "android") {
//     await Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: "#FF231F7C",
//     });
//   }

//   if (Device.isDevice) {
//     const { status: existingStatus } =
//       await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== "granted") {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== "granted") {
//       alert("Failed to get push token for push notification!");
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log(token);
//   } else {
//     alert("Must use physical device for Push Notifications");
//   }

//   return token;
// }
