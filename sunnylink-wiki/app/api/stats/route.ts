import { NextResponse } from 'next/server';
import { getDashboardData } from '@/lib/metabase';
import { STATS_SNAPSHOT } from '@/lib/statsSnapshot';

export const dynamic = 'force-dynamic';
export async function GET() {
    const live = await getDashboardData();
    const available = live.onlineDevices > 0 || live.activeUsers > 0 || live.topModels.length > 0;
    return NextResponse.json(available ? {
        ...STATS_SNAPSHOT,
        source: 'live',
        lastUpdated: new Date().toISOString(),
        activeUsers: live.activeUsers,
        onlineDevices: live.onlineDevices,
        branchDistribution: live.branchDistribution,
        topPlatforms: live.topModels,
    } : STATS_SNAPSHOT, { headers: { 'Cache-Control': 'public, max-age=60' } });
}
