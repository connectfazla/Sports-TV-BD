import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/dio_client.dart';
import '../../../core/network/api_endpoints.dart';
import 'stream_model.dart';

class StreamsRepository {
  final _dio = DioClient.instance.dio;

  Future<List<StreamModel>> getStreams({String? category}) async {
    final params = category != null ? {'category': category} : null;
    final response = await _dio.get(ApiEndpoints.streams, queryParameters: params);
    final data = response.data['data'] as List;
    return data.map((e) => StreamModel.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<SignedMirror>> getPlayUrls(String streamId) async {
    final response = await _dio.get(ApiEndpoints.streamPlay(streamId));
    final mirrors = response.data['data']['mirrors'] as List;
    return mirrors.map((e) => SignedMirror.fromJson(e as Map<String, dynamic>)).toList();
  }
}

final streamsRepositoryProvider = Provider<StreamsRepository>((ref) => StreamsRepository());

final streamsProvider = FutureProvider.family<List<StreamModel>, String?>((ref, category) {
  return ref.read(streamsRepositoryProvider).getStreams(category: category);
});
