import 'package:better_player_plus/better_player_plus.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../providers/player_provider.dart';

class PlayerScreen extends ConsumerStatefulWidget {
  final String streamId;
  final String streamName;

  const PlayerScreen({super.key, required this.streamId, required this.streamName});

  @override
  ConsumerState<PlayerScreen> createState() => _PlayerScreenState();
}

class _PlayerScreenState extends ConsumerState<PlayerScreen> {
  BetterPlayerController? _controller;

  @override
  void initState() {
    super.initState();
    SystemChrome.setPreferredOrientations([
      DeviceOrientation.landscapeLeft,
      DeviceOrientation.landscapeRight,
      DeviceOrientation.portraitUp,
    ]);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(playerProvider.notifier).loadStream(widget.streamId);
    });
  }

  @override
  void dispose() {
    _controller?.dispose();
    SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp, DeviceOrientation.portraitDown]);
    ref.read(playerProvider.notifier).reset();
    super.dispose();
  }

  void _initPlayer(String url) {
    _controller?.dispose();
    final dataSource = BetterPlayerDataSource(
      BetterPlayerDataSourceType.network,
      url,
      videoFormat: BetterPlayerVideoFormat.hls,
      bufferingConfiguration: const BetterPlayerBufferingConfiguration(
        minBufferMs: 2000,
        maxBufferMs: 10000,
        bufferForPlaybackMs: 1000,
        bufferForPlaybackAfterRebufferMs: 2000,
      ),
    );
    _controller = BetterPlayerController(
      BetterPlayerConfiguration(
        aspectRatio: 16 / 9,
        autoPlay: true,
        looping: false,
        fullScreenByDefault: false,
        allowedScreenSleep: false,
        autoDetectFullscreenDeviceOrientation: true,
        errorBuilder: (ctx, msg) => _buildError(msg),
        controlsConfiguration: const BetterPlayerControlsConfiguration(
          controlBarColor: Colors.black54,
          iconsColor: Colors.white,
          playIcon: Icons.play_arrow,
          pauseIcon: Icons.pause,
          progressBarPlayedColor: AppColors.green,
          progressBarHandleColor: AppColors.green,
        ),
      ),
      betterPlayerDataSource: dataSource,
    );

    _controller!.addEventsListener((event) {
      if (event.betterPlayerEventType == BetterPlayerEventType.exception) {
        ref.read(playerProvider.notifier).onMirrorFailure();
      }
    });
    setState(() {});
  }

  Widget _buildError(String? msg) => Center(
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Icon(Icons.error_outline, color: AppColors.danger, size: 48),
        const SizedBox(height: 12),
        Text(msg ?? 'Stream error', style: AppTextStyles.bodyMuted),
        const SizedBox(height: 16),
        ElevatedButton(
          onPressed: () => ref.read(playerProvider.notifier).loadStream(widget.streamId),
          child: const Text('Retry'),
        ),
      ],
    ),
  );

  @override
  Widget build(BuildContext context) {
    final playerState = ref.watch(playerProvider);

    // When mirror changes, re-init player
    ref.listen(playerProvider, (prev, next) {
      if (next.currentMirror != null &&
          (prev?.currentMirror?.signedUrl != next.currentMirror?.signedUrl ||
              prev?.status != next.status)) {
        if (next.status == PlayerStatus.playing || next.status == PlayerStatus.reconnecting) {
          _initPlayer(next.currentMirror!.signedUrl);
        }
      }
    });

    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(widget.streamName, style: const TextStyle(color: Colors.white, fontSize: 16)),
        actions: [
          if (playerState.mirrors.length > 1)
            PopupMenuButton<int>(
              icon: const Icon(Icons.hd, color: Colors.white),
              color: AppColors.surface,
              onSelected: (i) => ref.read(playerProvider.notifier).onMirrorFailure(),
              itemBuilder: (ctx) => playerState.mirrors.asMap().entries.map((e) =>
                PopupMenuItem(value: e.key, child: Text(e.value.label, style: const TextStyle(color: AppColors.textPrimary)))
              ).toList(),
            ),
        ],
      ),
      body: Center(
        child: switch (playerState.status) {
          PlayerStatus.loading => const Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                CircularProgressIndicator(color: AppColors.green),
                SizedBox(height: 16),
                Text('Loading stream...', style: AppTextStyles.bodyMuted),
              ],
            ),
          PlayerStatus.reconnecting => Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const CircularProgressIndicator(color: AppColors.warning),
                const SizedBox(height: 16),
                Text(
                  'Switching to ${playerState.currentMirror?.label ?? "backup"}...',
                  style: AppTextStyles.bodyMuted,
                ),
              ],
            ),
          PlayerStatus.error => _buildError(playerState.errorMessage),
          PlayerStatus.playing || PlayerStatus.idle => _controller != null
              ? AspectRatio(
                  aspectRatio: 16 / 9,
                  child: BetterPlayer(controller: _controller!),
                )
              : const CircularProgressIndicator(color: AppColors.green),
        },
      ),
    );
  }
}
