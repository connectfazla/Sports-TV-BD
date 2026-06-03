import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../features/home/screens/home_screen.dart';
import '../../features/channels/screens/channels_screen.dart';
import '../../features/matches/screens/matches_screen.dart';
import '../../features/player/screens/player_screen.dart';
import '../../features/favorites/screens/favorites_screen.dart';
import '../../features/settings/screens/settings_screen.dart';
import '../../features/premium/screens/premium_screen.dart';
import '../../features/fifa/screens/fifa_screen.dart';
import '../constants/route_names.dart';
import 'main_shell.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: RouteNames.home,
    routes: [
      ShellRoute(
        builder: (context, state, child) => MainShell(child: child),
        routes: [
          GoRoute(path: RouteNames.home, builder: (ctx, state) => const HomeScreen()),
          GoRoute(path: RouteNames.channels, builder: (ctx, state) => const ChannelsScreen()),
          GoRoute(path: RouteNames.matches, builder: (ctx, state) => const MatchesScreen()),
          GoRoute(path: RouteNames.fifa, builder: (ctx, state) => const FifaScreen()),
          GoRoute(path: RouteNames.favorites, builder: (ctx, state) => const FavoritesScreen()),
        ],
      ),
      GoRoute(
        path: RouteNames.player,
        builder: (ctx, state) {
          final extra = state.extra as Map<String, dynamic>;
          return PlayerScreen(
            streamId: extra['streamId'] as String,
            streamName: extra['streamName'] as String,
          );
        },
      ),
      GoRoute(path: RouteNames.settings, builder: (ctx, state) => const SettingsScreen()),
      GoRoute(path: RouteNames.premium, builder: (ctx, state) => const PremiumScreen()),
    ],
  );
});
