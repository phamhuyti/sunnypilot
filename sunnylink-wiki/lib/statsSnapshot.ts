import brands from '../data/fleet_brand_branch_stats.json';
import models from '../data/fleet_model_stats.json';

const branches = new Map<string, number>();
for (const brand of brands.brands) {
    for (const [name, count] of Object.entries(brand.branches)) {
        branches.set(name, (branches.get(name) ?? 0) + Number(count));
    }
}
export const STATS_SNAPSHOT = {
    source: 'snapshot' as 'snapshot' | 'live',
    lastUpdated: brands.lastUpdated,
    activeUsers: 0,
    onlineDevices: brands.totalDevices,
    branchDistribution: [...branches].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
    topPlatforms: brands.brands.slice(0, 10).map(brand => ({ name: brand.brand, value: brand.totalDevices })),
    topModels: models.models.slice(0, 10).map(model => ({ name: model.cleanName, value: model.routes })),
};
