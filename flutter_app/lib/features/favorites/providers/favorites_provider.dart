import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../../channels/data/stream_model.dart';

class FavoritesNotifier extends StateNotifier<List<String>> {
  FavoritesNotifier() : super(_loadIds());

  static List<String> _loadIds() {
    final box = Hive.box('favorites');
    return List<String>.from(box.get('ids', defaultValue: <String>[]));  
  }

  bool isFavorite(String id) => state.contains(id);

  void toggle(String id) {
    if (state.contains(id)) {
      state = state.where((s) => s != id).toList();
    } else {
      state = [...state, id];
    }
    Hive.box('favorites').put('ids', state);
  }
}

final favoritesProvider = StateNotifierProvider<FavoritesNotifier, List<String>>(
  (ref) => FavoritesNotifier(),
);
