class StreamModel {
  final String id;
  final String name;
  final String slug;
  final String? logoUrl;
  final String category;
  final int sortOrder;
  final String status;
  final bool isPremium;
  final bool isFeatured;

  const StreamModel({
    required this.id,
    required this.name,
    required this.slug,
    this.logoUrl,
    required this.category,
    required this.sortOrder,
    required this.status,
    required this.isPremium,
    required this.isFeatured,
  });

  factory StreamModel.fromJson(Map<String, dynamic> json) => StreamModel(
    id: json['id'] as String,
    name: json['name'] as String,
    slug: json['slug'] as String,
    logoUrl: json['logo_url'] as String?,
    category: json['category'] as String,
    sortOrder: json['sort_order'] as int? ?? 0,
    status: json['status'] as String,
    isPremium: json['is_premium'] as bool? ?? false,
    isFeatured: json['is_featured'] as bool? ?? false,
  );
}

class SignedMirror {
  final String id;
  final String label;
  final String signedUrl;
  final bool isBdix;
  final String region;
  final int priority;
  final int healthScore;

  const SignedMirror({
    required this.id,
    required this.label,
    required this.signedUrl,
    required this.isBdix,
    required this.region,
    required this.priority,
    required this.healthScore,
  });

  factory SignedMirror.fromJson(Map<String, dynamic> json) => SignedMirror(
    id: json['id'] as String,
    label: json['label'] as String,
    signedUrl: json['signedUrl'] as String,
    isBdix: json['isBdix'] as bool? ?? false,
    region: json['region'] as String? ?? 'bd',
    priority: json['priority'] as int? ?? 1,
    healthScore: json['healthScore'] as int? ?? 100,
  );
}
