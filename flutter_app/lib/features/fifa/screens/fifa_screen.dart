import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../matches/data/matches_repository.dart';
import '../../../shared/widgets/match_card.dart';
import '../../../shared/widgets/loading_shimmer.dart';

class FifaScreen extends ConsumerWidget {
  const FifaScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final matches = ref.watch(allMatchesProvider(null));

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(color: AppColors.green, borderRadius: BorderRadius.circular(4)),
              child: const Text('FIFA', style: TextStyle(color: Colors.black, fontSize: 12, fontWeight: FontWeight.bold)),
            ),
            const SizedBox(width: 10),
            const Text('World Cup', style: AppTextStyles.h3),
          ],
        ),
      ),
      body: matches.when(
        data: (list) {
          final fifaMatches = list.where((m) =>
            m.tournament?.toLowerCase().contains('fifa') == true ||
            m.tournament?.toLowerCase().contains('world cup') == true
          ).toList();

          if (fifaMatches.isEmpty) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.emoji_events_outlined, color: AppColors.textMuted, size: 64),
                  const SizedBox(height: 16),
                  const Text('No FIFA matches scheduled', style: AppTextStyles.bodyMuted),
                ],
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: fifaMatches.length,
            itemBuilder: (ctx, i) => MatchCard(match: fifaMatches[i]),
          );
        },
        loading: () => Padding(
          padding: const EdgeInsets.all(16),
          child: Column(children: List.generate(3, (_) => Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: LoadingShimmer(height: 90),
          ))),
        ),
        error: (e, _) => const Center(child: Text('Failed to load matches', style: AppTextStyles.bodyMuted)),
      ),
    );
  }
}
