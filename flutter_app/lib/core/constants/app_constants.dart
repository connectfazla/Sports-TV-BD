class AppConstants {
  // Replace with your production API URL
  static const String apiBaseUrl = 'https://api.sports-tv.bd/api/v1';
  static const String apiBaseUrlDev = 'http://10.0.2.2:3001/api/v1';

  static const String appName = 'Sports TV';
  static const String appVersion = '1.0.0';

  // AES key for config decryption — must match backend CONFIG_ENCRYPTION_KEY
  // Store securely; this is a placeholder
  static const String configKey = '0000000000000000000000000000000000000000000000000000000000000000';

  static const Duration streamTokenRefresh = Duration(minutes: 50);
  static const Duration bdixProbTimeout = Duration(seconds: 5);
  static const List<Duration> reconnectBackoff = [
    Duration(seconds: 1),
    Duration(seconds: 2),
    Duration(seconds: 4),
    Duration(seconds: 8),
    Duration(seconds: 30),
  ];
}
