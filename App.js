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

      const pushTokenData = await Notification.getExpoPushTokenAsync({
        projectId: "c131d92f-63a1-44ce-b674-f6ce2b7c0656",
      });
      console.log("pushTokenData", pushTokenData);
    }

    if (Platform.OS === "android") {
      Notification.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notification.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    configurePushNotification();
  }, []);

  useEffect(() => {
    const subscription = Notification.addNotificationReceivedListener(
      (notification) => {
        const userName = notification.request.content.data.userName;
        console.log(`Notification received from ${userName}`);
        console.log(notification);
      }
    );

    const subscription2 = Notification.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notification response");
        console.log(response);
      }
    );

    // clean-up function
    return () => {
      subscription.remove();
      subscription2.remove();
    };
  }, []);

  function localNotificationHandler() {
    Notification.scheduleNotificationAsync({
      content: {
        title: "로컬 알림",
        subtitle: "로컬 알림 테스트",
        body: "로컬 알림 테스트 바디입니다!",
        data: { userName: "wontae" },
      },
      trigger: null,
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
        title: "푸시알림 테스트",
        body: "푸시알림 테스트 바디입니다!",
        data: { userName: "server" },
      }),
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.paddingV}>
        <View style={styles.paddingV}>
          <Button
            title="Push Notification"
            onPress={sendPushNotificationHandler}
          />
        </View>
        <View style={styles.paddingV}>
          <Button
            title="Local Notification"
            onPress={localNotificationHandler}
          />
        </View>
      </View>
      <Text>푸시 알림 테스트</Text>
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
  paddingV: {
    paddingVertical: 4,
  },
});
