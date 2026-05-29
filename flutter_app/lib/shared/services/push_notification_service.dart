import 'package:firebase_messaging/firebase_messaging.dart';

@pragma('vm:entry-point')
Future<void> _backgroundHandler(RemoteMessage message) async {}

class PushNotificationService {
  static Future<void> initialize() async {
    FirebaseMessaging.onBackgroundMessage(_backgroundHandler);

    final messaging = FirebaseMessaging.instance;
    await messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    FirebaseMessaging.onMessage.listen((message) {
      // Foreground notification handling
    });

    FirebaseMessaging.onMessageOpenedApp.listen((message) {
      // Handle tap on notification — deep link routing
      final deepLink = message.data['deepLink'] as String?;
      if (deepLink != null) {
        // Parse and navigate
      }
    });
  }

  static Future<String?> getToken() => FirebaseMessaging.instance.getToken();
}
