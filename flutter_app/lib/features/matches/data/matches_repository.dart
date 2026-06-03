import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/dio_client.dart';
import '../../../core/network/api_endpoints.dart';
import 'match_model.dart';

class MatchesRepository {
  final _dio = DioClient.instance.dio;

  Future<List<MatchModel>> getMatches({String? status}) async {
    final params = status != null ? {'status': status} : null;
    final response = await _dio.get(ApiEndpoints.matches, queryParameters: params);
    final data = response.data['data'] as List;
    return data.map((e) => MatchModel.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<MatchModel>> getLiveMatches() async {
    final response = await _dio.get(ApiEndpoints.liveMatches);
    final data = response.data['data'] as List;
    return data.map((e) => MatchModel.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<MatchModel> getMatch(String id) async {
    final response = await _dio.get(ApiEndpoints.matchById(id));
    return MatchModel.fromJson(response.data['data'] as Map<String, dynamic>);
  }
}

final matchesRepositoryProvider = Provider<MatchesRepository>((ref) => MatchesRepository());

final liveMatchesProvider = FutureProvider<List<MatchModel>>((ref) {
  return ref.read(matchesRepositoryProvider).getLiveMatches();
});

final allMatchesProvider = FutureProvider.family<List<MatchModel>, String?>((ref, status) {
  return ref.read(matchesRepositoryProvider).getMatches(status: status);
});
