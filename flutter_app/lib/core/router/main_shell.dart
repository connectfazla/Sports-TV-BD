import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../constants/route_names.dart';
import '../theme/app_colors.dart';

class MainShell extends StatelessWidget {
  final Widget child;
  const MainShell({super.key, required this.child});

  int _selectedIndex(BuildContext context) {
    final location = GoRouterState.of(context).uri.toString();
    if (location.startsWith(RouteNames.channels)) return 1;
    if (location.startsWith(RouteNames.matches)) return 2;
    if (location.startsWith(RouteNames.fifa)) return 3;
    if (location.startsWith(RouteNames.favorites)) return 4;
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    final idx = _selectedIndex(context);
    return Scaffold(
      body: child,
      bottomNavigationBar: NavigationBar(
        selectedIndex: idx,
        onDestinationSelected: (i) {
          final routes = [
            RouteNames.home, RouteNames.channels, RouteNames.matches,
            RouteNames.fifa, RouteNames.favorites,
          ];
          context.go(routes[i]);
        },
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.tv_outlined), selectedIcon: Icon(Icons.tv), label: 'Channels'),
          NavigationDestination(icon: Icon(Icons.sports_soccer_outlined), selectedIcon: Icon(Icons.sports_soccer), label: 'Matches'),
          NavigationDestination(icon: Icon(Icons.emoji_events_outlined), selectedIcon: Icon(Icons.emoji_events), label: 'FIFA'),
          NavigationDestination(icon: Icon(Icons.favorite_outline), selectedIcon: Icon(Icons.favorite), label: 'Favorites'),
        ],
      ),
    );
  }
}
