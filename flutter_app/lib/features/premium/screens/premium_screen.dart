import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';

class PremiumScreen extends StatelessWidget {
  const PremiumScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Premium', style: AppTextStyles.h3)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppColors.greenDark, AppColors.green],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text('Sports TV Premium', style: TextStyle(color: Colors.black, fontSize: 22, fontWeight: FontWeight.bold)),
                  SizedBox(height: 8),
                  Text('Unlock the best streaming experience', style: TextStyle(color: Colors.black87, fontSize: 14)),
                ],
              ),
            ),
            const SizedBox(height: 24),
            const Text('What you get', style: AppTextStyles.h3),
            const SizedBox(height: 16),
            for (final item in [
              ['No Ads', 'Enjoy uninterrupted streaming', Icons.block],
              ['HD Streams', 'Full HD quality on all channels', Icons.hd],
              ['Priority Servers', 'Fastest BDIX servers first', Icons.speed],
              ['All Channels', 'Access every premium channel', Icons.tv],
            ])
              _BenefitTile(title: item[0] as String, subtitle: item[1] as String, icon: item[2] as IconData),
            const SizedBox(height: 32),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                children: [
                  const Text('Monthly Plan', style: AppTextStyles.h3),
                  const SizedBox(height: 8),
                  const Text('Contact admin to activate', style: AppTextStyles.bodyMuted),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {},
                      child: const Text('Get Premium'),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _BenefitTile extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;

  const _BenefitTile({required this.title, required this.subtitle, required this.icon});

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: 12),
    child: Row(
      children: [
        Container(
          width: 40, height: 40,
          decoration: BoxDecoration(color: AppColors.greenGlow, borderRadius: BorderRadius.circular(10)),
          child: Icon(icon, color: AppColors.green, size: 20),
        ),
        const SizedBox(width: 14),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: AppTextStyles.body),
            Text(subtitle, style: AppTextStyles.caption),
          ],
        ),
      ],
    ),
  );
}
