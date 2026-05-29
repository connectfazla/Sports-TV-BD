import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../data/matches_repository.dart';
import '../../../shared/widgets/match_card.dart';
import '../../../shared/widgets/loading_shimmer.dart';
import '../../../shared/widgets/error_state.dart';

class MatchesScreen extends ConsumerStatefulWidget {
  const MatchesScreen({super.key});

  @override
  ConsumerState<MatchesScreen> createState() => _MatchesScreenState();
}

class _MatchesScreenState extends ConsumerState<MatchesScreen> with SingleTickerProviderStateMixin {
  late TabController _tabs;

  @override
  void initState() {
    super.initState();
    _tabs = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabs.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Matches', style: AppTextStyles.h3),
        bottom: TabBar(
          controller: _tabs,
          indicatorColor: AppColors.green,
          labelColor: AppColors.green,
          unselectedLabelColor: AppColors.textMuted,
          tabs: const [
            Tab(text: 'Live'),
            Tab(text: 'Upcoming'),
            Tab(text: 'Results'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabs,
        children: [
          _MatchList(status: 'live'),
          _MatchList(status: 'scheduled'),
          _MatchList(status: 'finished'),
        ],
      ),
    );
  }
}

class _MatchList extends ConsumerWidget {
  final String status;
  const _MatchList({required this.status});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final matches = ref.watch(allMatchesProvider(status));
    return matches.when(
      data: (list) => list.isEmpty
          ? Center(child: Text('No $status matches', style: AppTextStyles.bodyMuted))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: list.length,
              itemBuilder: (ctx, i) => MatchCard(match: list[i]),
            ),
      loading: () => Padding(
        padding: const EdgeInsets.all(16),
        child: Column(children: List.generate(4, (_) => Padding(
          padding: const EdgeInsets.only(bottom: 10),
          child: LoadingShimmer(height: 90),
        ))),
      ),
      error: (e, _) => ErrorState(message: e.toString()),
    );
  }
}
