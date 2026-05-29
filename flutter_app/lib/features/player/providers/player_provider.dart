import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../channels/data/stream_model.dart';
import '../../channels/data/streams_repository.dart';

enum PlayerStatus { idle, loading, playing, error, reconnecting }

class PlayerState {
  final PlayerStatus status;
  final List<SignedMirror> mirrors;
  final int currentMirrorIndex;
  final String? errorMessage;
  final String selectedQuality;
  final int reconnectAttempt;

  const PlayerState({
    this.status = PlayerStatus.idle,
    this.mirrors = const [],
    this.currentMirrorIndex = 0,
    this.errorMessage,
    this.selectedQuality = 'auto',
    this.reconnectAttempt = 0,
  });

  SignedMirror? get currentMirror =>
      mirrors.isNotEmpty && currentMirrorIndex < mirrors.length ? mirrors[currentMirrorIndex] : null;

  PlayerState copyWith({
    PlayerStatus? status,
    List<SignedMirror>? mirrors,
    int? currentMirrorIndex,
    String? errorMessage,
    String? selectedQuality,
    int? reconnectAttempt,
  }) =>
      PlayerState(
        status: status ?? this.status,
        mirrors: mirrors ?? this.mirrors,
        currentMirrorIndex: currentMirrorIndex ?? this.currentMirrorIndex,
        errorMessage: errorMessage ?? this.errorMessage,
        selectedQuality: selectedQuality ?? this.selectedQuality,
        reconnectAttempt: reconnectAttempt ?? this.reconnectAttempt,
      );
}

class PlayerNotifier extends StateNotifier<PlayerState> {
  final StreamsRepository _repo;
  PlayerNotifier(this._repo) : super(const PlayerState());

  Future<void> loadStream(String streamId) async {
    state = state.copyWith(status: PlayerStatus.loading, currentMirrorIndex: 0, reconnectAttempt: 0);
    try {
      final mirrors = await _repo.getPlayUrls(streamId);
      // Sort: BDIX first by health score
      final sorted = [...mirrors]..sort((a, b) {
          if (a.isBdix && !b.isBdix) return -1;
          if (!a.isBdix && b.isBdix) return 1;
          return b.healthScore.compareTo(a.healthScore);
        });
      state = state.copyWith(status: PlayerStatus.playing, mirrors: sorted);
    } catch (e) {
      state = state.copyWith(status: PlayerStatus.error, errorMessage: e.toString());
    }
  }

  void onMirrorFailure() {
    final nextIndex = state.currentMirrorIndex + 1;
    if (nextIndex < state.mirrors.length) {
      state = state.copyWith(
        currentMirrorIndex: nextIndex,
        status: PlayerStatus.reconnecting,
        reconnectAttempt: state.reconnectAttempt + 1,
      );
    } else {
      state = state.copyWith(
        status: PlayerStatus.error,
        errorMessage: 'All stream sources unavailable',
      );
    }
  }

  void setQuality(String quality) {
    state = state.copyWith(selectedQuality: quality);
  }

  void reset() {
    state = const PlayerState();
  }
}

final playerProvider = StateNotifierProvider<PlayerNotifier, PlayerState>((ref) {
  return PlayerNotifier(ref.read(streamsRepositoryProvider));
});
