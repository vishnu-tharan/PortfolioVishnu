import test from 'node:test';
import assert from 'node:assert/strict';
import { createStage } from '../dist/src/stage.js';

function fixture(gl) {
  const events = {};
  const canvas = {clientWidth:390,clientHeight:844,width:300,height:150,dataset:{scene:'0'},style:{},getContext:() => gl,parentElement:{addEventListener(){}},addEventListener:(name,fn) => {events[name]=fn;}};
  return {canvas,events};
}
test('A browser without WebGL keeps the portfolio usable', () => {
  const {canvas}=fixture(null);
  const stage=createStage(canvas);
  assert.doesNotThrow(()=>stage.draw(0));
});
test('The renderer changes palette, limits mobile resolution and handles lost contexts', () => {
  const uniforms=[];
  let draws=0;
  const gl = new Proxy({}, {get:(_,key)=>{
    if(key==='getShaderParameter'||key==='getProgramParameter')return ()=>true;
    if(key==='getUniformLocation')return (_,name)=>name;
    if(key==='uniform1f')return (name,value)=>uniforms.push([name,value]);
    if(key==='drawArrays')return ()=>draws++;
    if(key==='getAttribLocation')return ()=>0;
    return ()=>({});
  }});
  const saved={document:globalThis.document,matchMedia:globalThis.matchMedia,devicePixelRatio:globalThis.devicePixelRatio};
  try {
    globalThis.document={documentElement:{dataset:{theme:'light'}}};
    globalThis.matchMedia=()=>({matches:true});
    globalThis.devicePixelRatio=3;
    const {canvas,events}=fixture(gl);
    const stage=createStage(canvas);
    stage.draw(1);
    assert.ok(uniforms.some(([name,value])=>name==='uLight'&&value===1));
    assert.equal(canvas.width,Math.round(390*1.25));
    globalThis.document.documentElement.dataset.theme='dark';
    stage.draw(1);
    assert.ok(uniforms.some(([name,value])=>name==='uLight'&&value===0));
    const before=draws;
    events.webglcontextlost({preventDefault(){}});
    stage.draw(2);
    assert.equal(draws,before);
    assert.equal(canvas.style.visibility,'hidden');
    events.webglcontextrestored();
    stage.draw(2);
    assert.equal(draws,before+1);
    canvas.clientWidth=0;
    stage.draw(3);
    assert.equal(draws,before+1,'Zero-sized scenes do not submit invalid draws');
  } finally {
    for(const [key,value] of Object.entries(saved)){if(value===undefined)delete globalThis[key];else globalThis[key]=value;}
  }
});
