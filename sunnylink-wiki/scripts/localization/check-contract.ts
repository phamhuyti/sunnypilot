import assert from 'node:assert/strict';
import modelsEn from '../../data/models.json';
import modelsVi from '../../data/models.vi.json';
import { deriveSkillRatings } from '../../lib/skillRatings';
import { buildSunnylinkExport } from '../../lib/wizardExport';
import { localizeValue } from '../../lib/localizeValue';
import type { ConfigValues } from '../../components/ConfigWizard';

for (let c = 0; c < modelsEn.categories.length; c++) {
    for (let m = 0; m < modelsEn.categories[c].models.length; m++) {
        const en = modelsEn.categories[c].models[m];
        const vi = modelsVi.categories[c].models[m];
        assert.deepEqual(deriveSkillRatings({ ...en, badge: en.badge ?? undefined }), deriveSkillRatings({ ...vi, badge: vi.badge ?? undefined }), 'Model scores must not change with translated prose');
    }
}
const config = {
    make: 'Toyota', model: 'RAV4', year: 2020, device: 'comma 3X',
    Mads: 'True', MadsSteeringMode: 'Remain Active', DrivingModel: 'WMI V12',
    CameraOffset: -0.05, AutoLaneChangeTimer: 'Nudgeless',
    HyundaiLongitudinalTuning: 'Predictive', SpeedLimitControlMode: 'User Confirm',
} as unknown as ConfigValues;
const result = buildSunnylinkExport(config);
assert.equal(result.config.commaAI.madsSteeringMode, 1);
assert.equal(result.config.commaAI.mads, true);
assert.equal(result.config.lateral.cameraOffset, -0.05);
assert.equal(config.MadsSteeringMode, 'Remain Active');
assert.equal(localizeValue(config.MadsSteeringMode), 'Tiếp tục hoạt động');
assert.equal(localizeValue(config.MadsSteeringMode, 'en'), 'Remain Active');
assert.equal(localizeValue('WMI V12'), 'WMI V12');
console.log('Model scoring and device export contracts verified across Vietnamese translation.');
