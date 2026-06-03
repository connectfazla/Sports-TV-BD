import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../constants/app_constants.dart';

class DioClient {
  static DioClient? _instance;
  late final Dio _dio;
  final _storage = const FlutterSecureStorage();

  DioClient._() {
    _dio = Dio(BaseOptions(
      baseUrl: AppConstants.apiBaseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 15),
      headers: {'Content-Type': 'application/json'},
    ));

    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.read(key: 'access_token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
      onError: (error, handler) async {
        if (error.response?.statusCode == 401) {
          final refreshed = await _tryRefresh();
          if (refreshed) {
            final token = await _storage.read(key: 'access_token');
            error.requestOptions.headers['Authorization'] = 'Bearer $token';
            final response = await _dio.fetch(error.requestOptions);
            handler.resolve(response);
            return;
          }
        }
        handler.next(error);
      },
    ));
  }

  static DioClient get instance => _instance ??= DioClient._();

  Dio get dio => _dio;

  Future<bool> _tryRefresh() async {
    try {
      final refreshToken = await _storage.read(key: 'refresh_token');
      if (refreshToken == null) return false;
      final response = await _dio.post('/auth/refresh', data: {'refreshToken': refreshToken});
      await _storage.write(key: 'access_token', value: response.data['data']['accessToken']);
      await _storage.write(key: 'refresh_token', value: response.data['data']['refreshToken']);
      return true;
    } catch (_) {
      return false;
    }
  }
}
