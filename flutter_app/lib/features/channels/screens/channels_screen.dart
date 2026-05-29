import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/constants/route_names.dart';
import '../data/streams_repository.dart';
import '../../../shared/widgets/channel_card.dart';
import '../../../shared/widgets/loading_shimmer.dart';
import '../../../shared/widgets/error_state.dart';
import '../../favorites/providers/favorites_provider.dart';

const _categories = ['All', 'Sports', 'Football', 'Cricket', 'Tennis', 'FIFA', 'International', 'BDIX'];

class ChannelsScreen extends ConsumerStatefulWidget {
  const ChannelsScreen({super.key});

  @override
  ConsumerState<ChannelsScreen> createState() => _ChannelsScreenState();
}

class _ChannelsScreenState extends ConsumerState<ChannelsScreen> {
  String _selected = 'All';

  @override
  Widget build(BuildContext context) {
    final cat = _selected == 'All' ? null : _selected.toLowerCase();
    final streams = ref.watch(streamsProvider(cat));
    final favIds = ref.watch(favoritesProvider);
    final favNotifier = ref.read(favoritesProvider.notifier);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Channels', style: AppTextStyles.h3),
        actions: [
          IconButton(
            icon: const Icon(Icons.search, color: AppColors.textMuted),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          SizedBox(
            height: 44,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              scrollDirection: Axis.horizontal,
              itemCount: _categories.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (ctx, i) {
                final cat = _categories[i];
                final active = cat == _selected;
                return GestureDetector(
                  onTap: () => setState(() => _selected = cat),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: active ? AppColors.green : AppColors.surfaceVariant,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(cat, style: TextStyle(
                      color: active ? Colors.black : AppColors.textMuted,
                      fontSize: 13, fontWeight: FontWeight.w500,
                    )),
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 12),
          Expanded(
            child: streams.when(
              data: (list) => GridView.builder(
                padding: const EdgeInsets.all(16),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2, childAspectRatio: 4 / 3,
                  crossAxisSpacing: 12, mainAxisSpacing: 12,
                ),
                itemCount: list.length,
                itemBuilder: (ctx, i) => ChannelCard(
                  stream: list[i],
                  isFavorite: favIds.contains(list[i].id),
                  onFavoriteToggle: () => favNotifier.toggle(list[i].id),
                  onTap: () => context.push(RouteNames.player, extra: {
                    'streamId': list[i].id,
                    'streamName': list[i].name,
                  }),
                ),
              ),
              loading: () => Padding(
                padding: const EdgeInsets.all(16),
                child: Column(children: List.generate(3, (_) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: LoadingShimmer(height: 120),
                ))),
              ),
              error: (e, _) => ErrorState(message: e.toString()),
            ),
          ),
        ],
      ),
    );
  }
}
