class MatchModel {
  final String id;
  final String title;
  final String homeTeam;
  final String awayTeam;
  final String? homeLogo;
  final String? awayLogo;
  final String? tournament;
  final String? streamId;
  final String status;
  final DateTime scheduledAt;
  final int homeScore;
  final int awayScore;
  final bool isFeatured;

  const MatchModel({
    required this.id,
    required this.title,
    required this.homeTeam,
    required this.awayTeam,
    this.homeLogo,
    this.awayLogo,
    this.tournament,
    this.streamId,
    required this.status,
    required this.scheduledAt,
    required this.homeScore,
    required this.awayScore,
    required this.isFeatured,
  });

  bool get isLive => status == 'live';
  bool get isScheduled => status == 'scheduled';

  factory MatchModel.fromJson(Map<String, dynamic> json) => MatchModel(
    id: json['id'] as String,
    title: json['title'] as String,
    homeTeam: json['home_team'] as String,
    awayTeam: json['away_team'] as String,
    homeLogo: json['home_logo'] as String?,
    awayLogo: json['away_logo'] as String?,
    tournament: json['tournament'] as String?,
    streamId: json['stream_id'] as String?,
    status: json['status'] as String,
    scheduledAt: DateTime.parse(json['scheduled_at'] as String),
    homeScore: json['home_score'] as int? ?? 0,
    awayScore: json['away_score'] as int? ?? 0,
    isFeatured: json['is_featured'] as bool? ?? false,
  );
}
