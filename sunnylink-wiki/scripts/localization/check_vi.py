#!/usr/bin/env python3
"""Verify translation coverage and preserve the device-facing data contract."""
import json,re
from pathlib import Path
root=Path(__file__).resolve().parents[2]
def read(file):return json.loads((root/file).read_text())
en=read('locales/en.json');vi=read('locales/vi.json')
assert en.keys()==vi.keys(),'Vietnamese UI keys do not match English'
for key,src in en.items():
 assert vi[key].strip(),f'Empty UI translation: {key}'
 assert sorted(re.findall(r'\{\{[^}]+\}\}',src))==sorted(re.findall(r'\{\{[^}]+\}\}',vi[key])),f'Changed placeholder: {key}'
# These fields participate in config export, model identity, filtering, or scoring.
protected={'id','key','type','default','options','recommended','min','max','step','version','schemaVersion','deviceAvailability','safetyLevel','settingsKeys','date','years','make','model','drivingModel','torqueTuning','lateralControl','longitudinalControl','mads','experimentalMode','harness','device','tags','badge','steeringFeel','includes','testedOn','lastUpdated'}
counts={}
for name in ['toggles','models','cars','features']:
 src=read(f'data/{name}.json');dst=read(f'data/{name}.vi.json');changed=0
 def walk(a,b,path=()):
  global changed
  if isinstance(a,dict):
   assert a.keys()==b.keys(),f'{name}: keys changed at {path}'
   for k,v in a.items():walk(v,b[k],path+(k,))
  elif isinstance(a,list):
   assert len(a)==len(b),f'{name}: list length changed at {path}'
   for i,(x,y) in enumerate(zip(a,b)):walk(x,y,path+(str(i),))
  else:
   assert type(a)==type(b),f'{name}: value type changed at {path}'
   field=next((p for p in reversed(path) if not p.isdigit()),'')
   if not isinstance(a,str) or field in protected or field.lower().endswith('url') or (field=='name' and name=='models' and 'models' in path):
    assert a==b,f'{name}: canonical value changed at {path}'
   elif a!=b:changed+=1
 walk(src,dst);assert changed>0,f'{name}: no translated content';counts[name]=changed
print(f'Vietnamese UI: {len(vi)} keys; placeholders intact')
print('Translated prose:',counts)
for d in ['app','components']:
 for p in (root/d).rglob('*.tsx'):
  for key in re.findall(r"\bt\(['\"]([^'\"]+)['\"]",p.read_text()):
   assert key in en,f'Missing UI key {key} in {p.relative_to(root)}'
assert 'lang="vi"' in (root/'app/layout.tsx').read_text()
print('UI references, locale and canonical values verified')
