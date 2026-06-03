import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../features/channels/data/stream_model.dart';
import 'live_badge.dart';

class ChannelCard extends StatelessWidget {
  final StreamModel stream;
  final VoidCallback onTap;
  final bool isFavorite;
  final VoidCallback? onFavoriteToggle;

  const ChannelCard({
    super.key,
    required this.stream,
    required this.onTap,
    this.isFavorite = false,
    this.onFavoriteToggle,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    Container(color: AppColors.surfaceVariant),
                    if (stream.logoUrl != null)
                      CachedNetworkImage(
                        imageUrl: stream.logoUrl!,
                        fit: BoxFit.contain,
                        placeholder: (_, __) => const SizedBox(),
                        errorWidget: (_, __, ___) => const Icon(Icons.tv, color: AppColors.textMuted),
                      ),
                    if (stream.status == 'active')
                      const Positioned(top: 8, left: 8, child: LiveBadge()),
                    if (onFavoriteToggle != null)
                      Positioned(
                        top: 6, right: 6,
                        child: GestureDetector(
                          onTap: onFavoriteToggle,
                          child: Icon(
                            isFavorite ? Icons.favorite : Icons.favorite_outline,
                            color: isFavorite ? AppColors.danger : AppColors.textMuted,
                            size: 18,
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(stream.name, style: AppTextStyles.body, maxLines: 1, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 2),
                  Text(stream.category.toUpperCase(), style: AppTextStyles.label),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
