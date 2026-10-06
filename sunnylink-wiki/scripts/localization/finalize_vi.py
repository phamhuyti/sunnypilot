"""Apply reviewed terminology and generate presentation-only translations."""
import json,re
from pathlib import Path
root=Path(__file__).resolve().parents[2]
def read(p):return json.loads((root/p).read_text())
cache=read('scripts/localization/vi-cache.json');overrides=read('scripts/localization/overrides.json')
terms={
 'Chỉ đạo':'Đánh lái','chỉ đạo':'đánh lái',
 'Kiểm soát bên':'Điều khiển ngang','kiểm soát bên':'điều khiển ngang',
 'Kiểm soát theo chiều dọc':'Điều khiển dọc','kiểm soát theo chiều dọc':'điều khiển dọc',
 'Kiểm soát hành trình':'Ga tự động','kiểm soát hành trình':'ga tự động',
 'Điều khiển hành trình':'Ga tự động','điều khiển hành trình':'ga tự động',
 'Mạng lưới thần kinh':'Mạng nơ-ron','mạng lưới thần kinh':'mạng nơ-ron',
 'Hạm đội':'Đội xe','hạm đội':'đội xe',
 'cổ phiếu':'nguyên bản','Cổ phiếu':'Nguyên bản',
 'Phê bình':'Quan trọng','phê bình':'quan trọng',
}
for source,value in cache.items():
 for old,new in terms.items():value=value.replace(old,new)
 cache[source]=overrides.get(source,value)
cache.update(overrides)
(root/'scripts/localization/vi-cache.json').write_text(json.dumps(cache,ensure_ascii=False,indent=2)+'\n')
# Store all original text -> translation pairs for display without mutating device values.
(root/'lib/vi-display.json').write_text(json.dumps(cache,ensure_ascii=False,indent=2)+'\n')
for name in ['toggles','models','cars','features']:
 original=read(f'data/{name}.json');translated=read(f'data/{name}.vi.json')
 def review(src,dst):
  if isinstance(src,dict):return {k:review(v,dst[k]) for k,v in src.items()}
  if isinstance(src,list):return [review(a,b) for a,b in zip(src,dst)]
  if isinstance(src,str) and src!=dst:return cache.get(src,dst)
  return dst
 result = review(original, translated)
 if name == 'features':
  for feature in result['features']:
   feature['name'] = cache.get(feature['name'], feature['name'])
 (root/f'data/{name}.vi.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
ui=read('locales/en.json')
ui_translated = {k:cache[v] for k,v in ui.items()}
ui_translated.update(read('scripts/localization/ui-overrides.json'))
(root/'locales/vi.json').write_text(json.dumps(ui_translated,ensure_ascii=False,indent=2)+'\n')
