import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../dist/src/transitions.js', import.meta.url), 'utf8').replaceAll('export function', 'function');
function setup({reduced = false, paused = false, supported = false, broken = false} = {}) {
  const events = {};
  const properties = {};
  const root = {dataset:{},style:{setProperty:(key,value)=>{properties[key]=value;}},classList:{contains:()=>paused}};
  let skipCount = 0, finish;
  const document = {hidden:false,documentElement:root,addEventListener:(name,fn)=>{events[name]=fn;}};
  if (supported) document.startViewTransition = update => {
    if (broken) throw new Error('Unavailable');
    update();
    return {ready:Promise.resolve(),finished:new Promise(resolve=>{finish=resolve;}),skipTransition:()=>{skipCount++;finish();}};
  };
  const context = vm.createContext({document,innerWidth:390,innerHeight:844,matchMedia:()=>({matches:reduced,addEventListener:()=>{}}),MutationObserver:class{observe(){}},Math});
  vm.runInContext(source + '\nglobalThis.api={viewTransition,motionAllowed};',context);
  return {api:context.api,root,properties,document,events,finish:()=>finish?.(),skips:()=>skipCount};
}

test('Unsupported, reduced-motion and paused browsers still perform the action', () => {
  for (const options of [{},{supported:true,reduced:true},{supported:true,paused:true},{supported:true,broken:true}]) {
    const state=setup(options);let actions=0,cleanup=0;
    state.api.viewTransition(()=>actions++,{cleanup:()=>cleanup++});
    assert.equal(actions,1);assert.equal(cleanup,1);assert.equal(state.root.dataset.transition,undefined);
  }
});
test('Theme reveals cover every viewport corner and release their state', async () => {
  const state=setup({supported:true});let cleanup=0;
  state.api.viewTransition(()=>{}, {origin:{getBoundingClientRect:()=>({left:320,top:20,width:44,height:44})},cleanup:()=>cleanup++});
  assert.equal(state.root.dataset.transition,'theme');
  assert.equal(state.properties['--transition-x'],'342px');
  assert.equal(state.properties['--transition-y'],'42px');
  assert.ok(parseFloat(state.properties['--transition-radius']) >= Math.hypot(342,802));
  state.finish();await new Promise(resolve=>setImmediate(resolve));
  assert.equal(cleanup,1);assert.equal(state.root.dataset.transition,undefined);
});
test('A new transition and a hidden page cancel active animation safely', async () => {
  const state=setup({supported:true});let actions=0;
  state.api.viewTransition(()=>actions++);
  state.api.viewTransition(()=>actions++, {kind:'project'});
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(state.root.dataset.transition,'project');assert.equal(state.skips(),1);assert.equal(actions,2);
  state.document.hidden=true;state.events.visibilitychange();
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(state.skips(),2);assert.equal(state.root.dataset.transition,undefined);
});
