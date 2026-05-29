import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../features/matches/data/match_model.dart';
import 'live_badge.dart';

class MatchCard extends StatelessWidget {
  final MatchModel match;
  final VoidCallback? onTap;

  const MatchCard({super.key, required this.match, this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: match.isLive ? AppColors.green.withAlpha(77) : AppColors.border,
          ),
        ),
        child: Column(
          children: [
            Row(
              children: [
                if (match.tournament != null)
                  Text(match.tournament!, style: AppTextStyles.caption),
                const Spacer(),
                if (match.isLive) const LiveBadge()
                else Text(
                  _formatTime(match.scheduledAt),
                  style: AppTextStyles.caption,
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: Text(match.homeTeam, style: AppTextStyles.body, textAlign: TextAlign.center),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: match.isLive
                      ? Text(
                          '${match.homeScore}  –  ${match.awayScore}',
                          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.green),
                        )
                      : const Text('vs', style: AppTextStyles.bodyMuted),
                ),
                Expanded(
                  child: Text(match.awayTeam, style: AppTextStyles.body, textAlign: TextAlign.center),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  String _formatTime(DateTime dt) {
    final local = dt.toLocal();
    return '${local.hour.toString().padLeft(2, '0')}:${local.minute.toString().padLeft(2, '0')}';
  }
}
