import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/constants/route_names.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final box = Hive.box('settings');
    final bdixPreferred = box.get('bdix_preferred', defaultValue: true) as bool;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Settings', style: AppTextStyles.h3)),
      body: ListView(
        children: [
          _Section(title: 'Streaming'),
          _Tile(
            title: 'Prefer BDIX Servers',
            subtitle: 'Faster streaming for Bangladesh ISPs',
            trailing: Switch.adaptive(
              value: bdixPreferred,
              onChanged: (v) => box.put('bdix_preferred', v),
              activeColor: AppColors.green,
            ),
          ),
          _Section(title: 'Account'),
          _Tile(
            title: 'Upgrade to Premium',
            subtitle: 'No ads, HD streams, priority servers',
            trailing: const Icon(Icons.chevron_right, color: AppColors.textMuted),
            onTap: () => context.push(RouteNames.premium),
          ),
          _Section(title: 'About'),
          _Tile(title: 'App Version', subtitle: '1.0.0'),
          _Tile(title: 'Sports TV BD', subtitle: 'Bangladesh IPTV Platform'),
        ],
      ),
    );
  }
}

class _Section extends StatelessWidget {
  final String title;
  const _Section({required this.title});

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.fromLTRB(20, 20, 20, 8),
    child: Text(title.toUpperCase(), style: AppTextStyles.label),
  );
}

class _Tile extends StatelessWidget {
  final String title;
  final String? subtitle;
  final Widget? trailing;
  final VoidCallback? onTap;

  const _Tile({required this.title, this.subtitle, this.trailing, this.onTap});

  @override
  Widget build(BuildContext context) => ListTile(
    onTap: onTap,
    title: Text(title, style: AppTextStyles.body),
    subtitle: subtitle != null ? Text(subtitle!, style: AppTextStyles.caption) : null,
    trailing: trailing,
    tileColor: AppColors.surface,
  );
}
