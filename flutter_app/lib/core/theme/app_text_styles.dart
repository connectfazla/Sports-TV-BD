import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppTextStyles {
  static const TextStyle h1 = TextStyle(
    fontSize: 28, fontWeight: FontWeight.bold, color: AppColors.textPrimary,
  );
  static const TextStyle h2 = TextStyle(
    fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.textPrimary,
  );
  static const TextStyle h3 = TextStyle(
    fontSize: 18, fontWeight: FontWeight.w600, color: AppColors.textPrimary,
  );
  static const TextStyle body = TextStyle(
    fontSize: 14, color: AppColors.textPrimary,
  );
  static const TextStyle bodyMuted = TextStyle(
    fontSize: 14, color: AppColors.textMuted,
  );
  static const TextStyle caption = TextStyle(
    fontSize: 12, color: AppColors.textMuted,
  );
  static const TextStyle label = TextStyle(
    fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textMuted, letterSpacing: 0.5,
  );
}
