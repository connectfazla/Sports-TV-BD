class ApiEndpoints {
  static const String register       = '/auth/register';
  static const String refresh        = '/auth/refresh';
  static const String fcmToken       = '/auth/fcm-token';
  static const String me             = '/auth/me';

  static const String streams        = '/streams';
  static String streamPlay(String id) => '/streams/$id/play';

  static const String matches        = '/matches';
  static const String liveMatches    = '/matches/live';
  static String matchById(String id) => '/matches/$id';

  static const String appConfig      = '/config/app';
  static const String adConfig       = '/config/ads';

  static const String healthBest     = '/health/servers/best';
  static const String healthServers  = '/health/servers';

  static const String analyticsEvents = '/analytics/events';

  static const String premiumStatus  = '/premium/status';
}
