import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/auth_repository.dart';

enum AuthState { loading, authenticated, unauthenticated }

final authStateProvider = FutureProvider<AuthState>((ref) async {
  final repo = ref.read(authRepositoryProvider);
  final isAuth = await repo.isAuthenticated();
  if (isAuth) return AuthState.authenticated;
  await repo.registerDevice();
  return AuthState.authenticated;
});
