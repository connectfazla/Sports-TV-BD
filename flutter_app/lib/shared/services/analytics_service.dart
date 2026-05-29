import 'package:hive_flutter/hive_flutter.dart';
import '../../core/network/dio_client.dart';
import '../../core/network/api_endpoints.dart';

class AnalyticsEvent {
  final String eventType;
  final String? streamId;
  final String? mirrorId;
  final String? sessionId;
  final String? quality;
  final int bufferingMs;
  final int durationMs;

  const AnalyticsEvent({
    required this.eventType,
    this.streamId,
    this.mirrorId,
    this.sessionId,
    this.quality,
    this.bufferingMs = 0,
    this.durationMs = 0,
  });

  Map<String, dynamic> toJson() => {
    'event_type': eventType,
    if (streamId != null) 'stream_id': streamId,
    if (mirrorId != null) 'mirror_id': mirrorId,
    if (sessionId != null) 'session_id': sessionId,
    if (quality != null) 'quality': quality,
    'buffering_ms': bufferingMs,
    'duration_ms': durationMs,
  };
}

class AnalyticsService {
  static final _buffer = <AnalyticsEvent>[];
  static final _dio = DioClient.instance.dio;

  static void track(AnalyticsEvent event) {
    _buffer.add(event);
    if (_buffer.length >= 10) flush();
  }

  static Future<void> flush() async {
    if (_buffer.isEmpty) return;
    final events = List<AnalyticsEvent>.from(_buffer);
    _buffer.clear();
    try {
      await _dio.post(ApiEndpoints.analyticsEvents, data: events.map((e) => e.toJson()).toList());
    } catch (_) {
      // Re-add to buffer on failure
      _buffer.insertAll(0, events);
    }
  }
}
