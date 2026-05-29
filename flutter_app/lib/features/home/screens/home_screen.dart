import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/constants/route_names.dart';
import '../../channels/data/streams_repository.dart';
import '../../matches/data/matches_repository.dart';
import '../../../shared/widgets/channel_card.dart';
import '../../../shared/widgets/match_card.dart';
import '../../../shared/widgets/loading_shimmer.dart';
import '../../../shared/widgets/error_state.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final streams = ref.watch(streamsProvider(null));
    final liveMatches = ref.watch(liveMatchesProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 120,
            floating: true,
            snap: true,
            backgroundColor: AppColors.background,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                padding: const EdgeInsets.fromLTRB(20, 60, 20, 0),
                child: Row(
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text('Sports TV', style: AppTextStyles.h2),
                        Text('Bangladesh IPTV', style: AppTextStyles.caption),
                      ],
                    ),
                    const Spacer(),
                    IconButton(
                      onPressed: () => context.push(RouteNames.settings),
                      icon: const Icon(Icons.settings_outlined, color: AppColors.textMuted),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Live Now section
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
              child: Row(
                children: [
                  Container(width: 3, height: 16, color: AppColors.green),
                  const SizedBox(width: 8),
                  const Text('Live Now', style: AppTextStyles.h3),
                ],
              ),
            ),
          ),

          SliverToBoxAdapter(
            child: liveMatches.when(
              data: (matches) => matches.isEmpty
                  ? const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                      child: Text('No live matches right now', style: AppTextStyles.bodyMuted),
                    )
                  : SizedBox(
                      height: 120,
                      child: ListView.separated(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        scrollDirection: Axis.horizontal,
                        itemCount: matches.length,
                        separatorBuilder: (_, __) => const SizedBox(width: 12),
                        itemBuilder: (ctx, i) => SizedBox(
                          width: 260,
                          child: MatchCard(match: matches[i]),
                        ),
                      ),
                    ),
              loading: () => const Padding(
                padding: EdgeInsets.symmetric(horizontal: 20),
                child: LoadingShimmer(height: 100),
              ),
              error: (e, _) => const SizedBox.shrink(),
            ),
          ),

          // Featured Channels
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 24, 20, 8),
              child: Row(
                children: [
                  Container(width: 3, height: 16, color: AppColors.green),
                  const SizedBox(width: 8),
                  const Text('Featured Channels', style: AppTextStyles.h3),
                  const Spacer(),
                  TextButton(
                    onPressed: () => context.go(RouteNames.channels),
                    child: const Text('See all', style: TextStyle(color: AppColors.green, fontSize: 13)),
                  ),
                ],
              ),
            ),
          ),

          streams.when(
            data: (list) {
              final featured = list.where((s) => s.isFeatured).take(6).toList();
              if (featured.isEmpty) return const SliverToBoxAdapter(child: SizedBox.shrink());
              return SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                sliver: SliverGrid(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 4 / 3,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                  ),
                  delegate: SliverChildBuilderDelegate(
                    (ctx, i) => ChannelCard(
                      stream: featured[i],
                      onTap: () => context.push(RouteNames.player, extra: {
                        'streamId': featured[i].id,
                        'streamName': featured[i].name,
                      }),
                    ),
                    childCount: featured.length,
                  ),
                ),
              );
            },
            loading: () => SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(children: List.generate(2, (_) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: LoadingShimmer(height: 140),
                ))),
              ),
            ),
            error: (e, _) => SliverToBoxAdapter(child: ErrorState(message: e.toString())),
          ),

          const SliverPadding(padding: EdgeInsets.only(bottom: 24)),
        ],
      ),
    );
  }
}
