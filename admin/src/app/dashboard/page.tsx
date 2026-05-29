import { TopBar } from '@/components/layout/TopBar';
import { Stat } from '@/components/ui/Stat';
import { Card } from '@/components/ui/Card';

export default function DashboardPage() {
  return (
    <>
      <TopBar title="Dashboard" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Active Viewers" value="—" sub="Last 1 hour" />
          <Stat label="Live Streams" value="—" sub="Currently active" color="#22c55e" />
          <Stat label="Avg Buffering" value="—" sub="Last 1 hour" color="#f59e0b" />
          <Stat label="Total Users" value="—" sub="All time" color="#a1a1aa" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <h2 className="font-semibold mb-4" style={{ color: '#fafafa' }}>Quick Actions</h2>
            <div className="space-y-2">
              {[
                ['Go to Streams', '/dashboard/streams'],
                ['Go to Matches', '/dashboard/matches'],
                ['Server Control', '/dashboard/server-control'],
                ['App Config', '/dashboard/app-config'],
              ].map(([label, href]) => (
                <a key={href} href={href}
                   className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors hover:opacity-80"
                   style={{ background: '#27272a', color: '#fafafa' }}>
                  {label}
                  <span style={{ color: '#a1a1aa' }}>→</span>
                </a>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold mb-4" style={{ color: '#fafafa' }}>System Status</h2>
            <div className="space-y-3">
              {['API Server', 'Database', 'Firebase FCM', 'Stream CDN'].map(service => (
                <div key={service} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: '#a1a1aa' }}>{service}</span>
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: '#22c55e' }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: '#22c55e' }} />
                    Operational
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
