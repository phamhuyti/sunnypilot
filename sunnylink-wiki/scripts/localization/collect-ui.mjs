import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
const roots=['app','components','lib/new-sim','lib/gallery'];
const attrs=new Set(['title','placeholder','aria-label','alt','label','description','emptyMessage']);
const props=new Set(['title','subtitle','label','description','hint','helpText','q','a','message','emptyMessage','tooltip','summary','detail','error','/','/models','/cars','/features','/wizard','/stats']);
const texts=new Set();const edits=[];
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?files(path.join(dir,x.name)):/\.(tsx?|jsx?)$/.test(x.name)?[path.join(dir,x.name)]:[]);}
function decode(s){return s.replace(/&ldquo;|&rdquo;/g,'"').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&apos;|&#39;|&rsquo;/g,"'").replace(/&lsquo;/g,"'").replace(/&ndash;/g,'–').replace(/&mdash;/g,'—').replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&nbsp;/g,' ');}
for(const file of roots.flatMap(files)){
 const src=fs.readFileSync(file,'utf8');const ast=ts.createSourceFile(file,src,ts.ScriptTarget.Latest,true,file.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 function add(n,text,jsx=false){
  const clean=decode(text.trim().replace(/\s+/g,' '));
  if(!/[a-zA-Z]{2}/.test(clean)||/https?:|^\.|^\/|^[\w.-]+\.json$|^#[0-9a-f]+$/i.test(clean))return;
  // Identifiers and Tailwind/technical tokens are not prose.
  if(!jsx && !/\s/.test(clean) && !/^[A-Z][a-z]+$/.test(clean)) return;
  texts.add(clean);edits.push({file,start:n.getStart(ast),end:n.end,text:clean,jsx,leading:jsx&&/^\s/.test(text)?' ': '',trailing:jsx&&/\s$/.test(text)?' ':''});
 }
 function visit(n){
  if(ts.isJsxText(n)){add(n,n.text,true);return;}
  if(ts.isStringLiteral(n)||ts.isNoSubstitutionTemplateLiteral(n)){
   const p=n.parent;
   if(ts.isJsxAttribute(p)&&attrs.has(p.name.getText(ast)))add(n,n.text);
   else if(ts.isPropertyAssignment(p)&&props.has(p.name.getText(ast).replace(/["']/g,'')))add(n,n.text);
   else {
    // Only literal output in JSX expressions; never conditions, function arguments or attributes.
    let a=p;let display=false;
    while(a && !ts.isJsxExpression(a)){
     if(ts.isCallExpression(a)||ts.isBinaryExpression(a)||ts.isElementAccessExpression(a)||ts.isPropertyAssignment(a)||ts.isVariableDeclaration(a)){a=null;break;}
     if(ts.isConditionalExpression(a)&&a.condition===n){a=null;break;}
     a=a.parent;
    }
    if(a&&ts.isJsxExpression(a)&&!ts.isJsxAttribute(a.parent))display=true;
    if(display)add(n,n.text);
   }
  }
  ts.forEachChild(n,visit);
 }
 visit(ast);
}
fs.writeFileSync('scripts/localization/ui-source.json',JSON.stringify([...texts].sort(),null,2)+'\n');
fs.writeFileSync('scripts/localization/ui-edits.json',JSON.stringify(edits,null,2)+'\n');
console.log(`${texts.size} extra UI texts in ${new Set(edits.map(x=>x.file)).size} files`);
