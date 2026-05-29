import 'package:device_info_plus/device_info_plus.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:package_info_plus/package_info_plus.dart';
import '../../../core/network/dio_client.dart';
import '../../../core/network/api_endpoints.dart';
import '../../../core/storage/secure_storage.dart';

class AuthRepository {
  final _dio = DioClient.instance.dio;

  Future<void> registerDevice() async {
    final deviceInfo = DeviceInfoPlugin();
    final androidInfo = await deviceInfo.androidInfo;
    final deviceId = androidInfo.id;

    final packageInfo = await PackageInfo.fromPlatform();
    final appVersion = packageInfo.version;

    final response = await _dio.post(ApiEndpoints.register, data: {
      'deviceId': deviceId,
      'appVersion': appVersion,
      'platform': 'android',
    });

    final data = response.data['data'];
    await SecureStorage.saveTokens(data['accessToken'], data['refreshToken']);
  }

  Future<bool> isAuthenticated() async {
    final token = await SecureStorage.getAccessToken();
    return token != null;
  }
}

final authRepositoryProvider = Provider<AuthRepository>((ref) => AuthRepository());
