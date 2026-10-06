#!/usr/bin/env python3
"""Translate public wiki prose. Preserve identifiers, model names and placeholders.
Uses the public Google Translate endpoint; cached results make interrupted runs resumable.
Run from the website root: python3 scripts/localization/translate_vi.py
"""
import concurrent.futures,json,re,time,urllib.request,urllib.parse
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
CACHE=ROOT/'scripts/localization/vi-cache.json'
fields={
 'toggles':{'appName','name','label','description','helpText','useCase','tradeoffs','userNote','warning','deepDive','unit'},
 'models':{'appName','description','title','subtitle','vibe','bestFor','recommendation','consensus','note','positives','negatives'},
 'cars':{'appName','communityConsensus','comment','text','context','radar'},
 'features':{'appName','dataSource','fullName','category','officialDefinition','userSummary','userTranslation'},
}
sources={n:json.loads((ROOT/'data'/f'{n}.json').read_text()) for n in fields}
models={m['name'] for c in sources['models']['categories'] for m in c['models']}
models.update({'sunnypilot','openpilot','sunnylink','Sunnylink Wiki','comma.ai','Down to Ride','Dark Souls','Tomb Raider','Firehose','Recertified Herbalist','North Dakota','Space Lab','Kumars Vibe','Chestnut','Macrostiff'})
protected=re.compile('|'.join(re.escape(n) for n in sorted(models,key=len,reverse=True))+r'|\{\{[^}]+\}\}|https?://\S+')
cache=json.loads(CACHE.read_text()) if CACHE.exists() else {}
strings=set()
def selected(name,path):
 key=str(path[-1])
 if key.isdigit(): key=str(path[-2])
 if name=='features' and 'glossary' in path:return True
 if key=='name': return name=='toggles' or (name=='models' and len(path)==3) or (name=='cars' and 'configs' in path)
 return key in fields[name]
def visit(x,path,fn):
 if isinstance(x,dict):return {k:visit(v,path+[k],fn) for k,v in x.items()}
 if isinstance(x,list):return [visit(v,path+[str(i)],fn) for i,v in enumerate(x)]
 return fn(x,path)
for name,data in sources.items():
 visit(data,[],lambda v,p:strings.add(v) if isinstance(v,str) and selected(name,p) and re.search('[A-Za-z]',v) else None)
ui=json.loads((ROOT/'locales/en.json').read_text()); strings.update(ui.values())
extra=ROOT/'scripts/localization/ui-source.json'
if extra.exists():strings.update(json.loads(extra.read_text()))
strings.discard(''); todo=sorted(strings-cache.keys())
print(f'{len(strings)} unique texts; {len(todo)} to translate',flush=True)
def translate(text):
 saved=[]
 def protect(m):
  saved.append(m.group());return f'ZXQ{len(saved)-1}QXZ'
 payload=protected.sub(protect,text)
 url='https://translate.googleapis.com/translate_a/single?'+urllib.parse.urlencode({'client':'gtx','sl':'en','tl':'vi','dt':'t','q':payload})
 for attempt in range(5):
  try:
   req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
   with urllib.request.urlopen(req,timeout=40) as resp:data=json.load(resp)
   result=''.join(part[0] for part in data[0] if part[0])
   for i,value in enumerate(saved):
    token=f'ZXQ{i}QXZ'
    if token not in result:raise ValueError('Translation changed a protected token')
    result=result.replace(token,value)
   return text,result
  except Exception:
   if attempt==4:raise
   time.sleep(2**attempt)
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
 futures=[pool.submit(translate,s) for s in todo]
 for i,future in enumerate(concurrent.futures.as_completed(futures),1):
  source,value=future.result(); cache[source]=value
  if i%40==0:
   CACHE.write_text(json.dumps(cache,ensure_ascii=False,indent=2)+'\n');print(f'{i}/{len(todo)}',flush=True)
CACHE.write_text(json.dumps(cache,ensure_ascii=False,indent=2)+'\n')
for name,data in sources.items():
 result=visit(data,[],lambda v,p:cache.get(v,v) if isinstance(v,str) and selected(name,p) else v)
 (ROOT/'data'/f'{name}.vi.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
(ROOT/'locales/vi.json').write_text(json.dumps({k:cache[v] for k,v in ui.items()},ensure_ascii=False,indent=2)+'\n')
print('Vietnamese catalogues written.',flush=True)
