import 'dart:convert';
import 'package:encrypt/encrypt.dart' as enc;
import 'package:hive_flutter/hive_flutter.dart';
import '../../core/network/dio_client.dart';
import '../../core/network/api_endpoints.dart';
import '../../core/constants/app_constants.dart';

class AppConfigResult {
  final String minAppVersion;
  final String latestAppVersion;
  final String latestApkUrl;
  final bool maintenanceMode;
  final String maintenanceMessage;
  final Map<String, bool> featureFlags;

  const AppConfigResult({
    required this.minAppVersion,
    required this.latestAppVersion,
    required this.latestApkUrl,
    required this.maintenanceMode,
    required this.maintenanceMessage,
    required this.featureFlags,
  });

  factory AppConfigResult.fromMap(Map<String, dynamic> m) => AppConfigResult(
    minAppVersion: (m['min_app_version'] as String?) ?? '1.0.0',
    latestAppVersion: (m['latest_app_version'] as String?) ?? '1.0.0',
    latestApkUrl: (m['latest_apk_url'] as String?) ?? '',
    maintenanceMode: (m['maintenance_mode'] as bool?) ?? false,
    maintenanceMessage: (m['maintenance_message'] as String?) ?? '',
    featureFlags: Map<String, bool>.from(m['feature_flags'] as Map? ?? {}),
  );
}

class AppConfigService {
  static final _dio = DioClient.instance.dio;

  static Future<AppConfigResult?> fetchConfig() async {
    try {
      final response = await _dio.get(ApiEndpoints.appConfig);
      final data = response.data['data'] as Map<String, dynamic>;

      final keyHex = AppConstants.configKey;
      final keyBytes = enc.Key.fromBase16(keyHex);
      final iv = enc.IV.fromBase64(data['iv'] as String);
      final encrypter = enc.Encrypter(enc.AES(keyBytes, mode: enc.AESMode.gcm));

      final decrypted = encrypter.decrypt64(data['payload'] as String, iv: iv);
      final config = jsonDecode(decrypted) as Map<String, dynamic>;

      Hive.box('cache').put('app_config', config);
      return AppConfigResult.fromMap(config);
    } catch (_) {
      final cached = Hive.box('cache').get('app_config') as Map?;
      if (cached != null) return AppConfigResult.fromMap(Map<String, dynamic>.from(cached));
      return null;
    }
  }
}
