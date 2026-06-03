import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/constants/route_names.dart';
import '../../channels/data/streams_repository.dart';
import '../providers/favorites_provider.dart';
import '../../../shared/widgets/channel_card.dart';

class FavoritesScreen extends ConsumerWidget {
  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final favIds = ref.watch(favoritesProvider);
    final favNotifier = ref.read(favoritesProvider.notifier);
    final allStreams = ref.watch(streamsProvider(null));

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Favorites', style: AppTextStyles.h3)),
      body: allStreams.when(
        data: (streams) {
          final favStreams = streams.where((s) => favIds.contains(s.id)).toList();
          if (favStreams.isEmpty) {
            return const Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.favorite_outline, color: AppColors.textMuted, size: 64),
                  SizedBox(height: 16),
                  Text('No favorites yet', style: AppTextStyles.bodyMuted),
                  SizedBox(height: 8),
                  Text('Tap ♥ on any channel to save it here', style: AppTextStyles.caption),
                ],
              ),
            );
          }
          return GridView.builder(
            padding: const EdgeInsets.all(16),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2, childAspectRatio: 4 / 3,
              crossAxisSpacing: 12, mainAxisSpacing: 12,
            ),
            itemCount: favStreams.length,
            itemBuilder: (ctx, i) => ChannelCard(
              stream: favStreams[i],
              isFavorite: true,
              onFavoriteToggle: () => favNotifier.toggle(favStreams[i].id),
              onTap: () => context.push(RouteNames.player, extra: {
                'streamId': favStreams[i].id,
                'streamName': favStreams[i].name,
              }),
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator(color: AppColors.green)),
        error: (e, _) => Center(child: Text(e.toString(), style: AppTextStyles.bodyMuted)),
      ),
    );
  }
}
