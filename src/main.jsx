import React,{useState,useEffect,useRef} from 'react';
import{createRoot}from'react-dom/client';
import Markdown from'react-markdown';
import letter from'./letter.md?raw';
import './style.css';

function Sky(){
 const ref=useRef(null);
 useEffect(()=>{
  const canvas=ref.current,ctx=canvas.getContext('2d');let frame,w,h,t=0;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const resize=()=>{w=innerWidth;h=innerHeight;canvas.width=w*devicePixelRatio;canvas.height=h*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)};
  resize();addEventListener('resize',resize);
  const stars=Array.from({length:110},(_,i)=>({x:Math.random(),y:Math.random(),r:Math.random()*1.3+.3,p:i}));
  const draw=()=>{ctx.clearRect(0,0,w,h);t+=.008;
   stars.forEach(s=>{ctx.globalAlpha=.25+.55*(.5+.5*Math.sin(t+s.p));ctx.fillStyle='#fbd8e8';ctx.beginPath();ctx.arc(s.x*w,s.y*h,s.r,0,Math.PI*2);ctx.fill()});
   ctx.globalAlpha=1;const scale=Math.min(w*.022,12),cx=w/2,cy=h*.47;
   for(let i=0;i<260;i++){const a=i/260*Math.PI*2;const pulse=1+.025*Math.sin(t*2);const x=16*Math.sin(a)**3;const y=13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a);ctx.fillStyle=i%3?'#ed93b4':'#fff0f7';ctx.shadowColor='#ff69ad';ctx.shadowBlur=10;ctx.globalAlpha=.25+.45*(.5+.5*Math.sin(i+t));ctx.beginPath();ctx.arc(cx+x*scale*pulse,cy-y*scale*pulse,Math.random()*.3+1,0,Math.PI*2);ctx.fill()}
   ctx.shadowBlur=0;ctx.globalAlpha=1;if(!reduced)frame=requestAnimationFrame(draw);
  };draw();return()=>{cancelAnimationFrame(frame);removeEventListener('resize',resize)};
 },[]);
 return <canvas ref={ref} className="sky" aria-hidden="true"/>;
}
function useMusic(){
 const audio=useRef(null),timer=useRef(null),wanted=useRef(true);
 const[on,setOn]=useState(false);
 const start=()=>{
  if(!wanted.current)return;
  const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
  try{
   let ac=audio.current;
   if(!ac){
    ac=new Audio();audio.current=ac;let step=0;
    const notes=[261.63,329.63,392,523.25,392,329.63,220,329.63,440,523.25,440,329.63,174.61,261.63,349.23,440,349.23,261.63,196,293.66,392,493.88,392,293.66];
    const play=()=>{
     if(ac.state!=='running'||!wanted.current)return;
     const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=notes[step++%notes.length];
     g.gain.setValueAtTime(0,ac.currentTime);g.gain.linearRampToValueAtTime(.065,ac.currentTime+.025);
     g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+2.1);
     o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+2.2);
    };
    const sync=()=>{
     if(audio.current!==ac)return;
     const running=ac.state==='running'&&wanted.current;setOn(running);
     if(running&&timer.current===null){play();timer.current=setInterval(play,650)}
     if(!running){clearInterval(timer.current);timer.current=null}
    };
    ac.onstatechange=sync;sync();
   }
   if(ac.state!=='running')ac.resume().catch(()=>{});
  }catch{setOn(false)}
 };
 const stop=()=>{
  wanted.current=false;clearInterval(timer.current);timer.current=null;
  const ac=audio.current;audio.current=null;
  if(ac){ac.onstatechange=null;ac.close().catch(()=>{})}setOn(false);
 };
 const toggle=()=>{
  if(audio.current?.state==='running'&&wanted.current){stop();return}
  wanted.current=true;start();
 };
 useEffect(()=>{
  start();
  const unlock=(event)=>{
   if(event.target instanceof Element&&event.target.closest('.music'))return;
   if(wanted.current)start();
  };
  document.addEventListener('pointerdown',unlock);
  document.addEventListener('keydown',unlock);
  return()=>{
   document.removeEventListener('pointerdown',unlock);
   document.removeEventListener('keydown',unlock);
   clearInterval(timer.current);timer.current=null;
   const ac=audio.current;audio.current=null;
   if(ac){ac.onstatechange=null;ac.close().catch(()=>{})}
  };
 },[]);
 return[on,toggle];
}

function App(){
 const[stage,setStage]=useState('closed'),[on,toggle]=useMusic(),[progress,setProgress]=useState(0);
 const heading=useRef(null),openTimer=useRef(null);
 useEffect(()=>()=>clearTimeout(openTimer.current),[]);
 useEffect(()=>{if(stage!=='reading')return;window.scrollTo({top:0,behavior:'instant'});heading.current?.focus({preventScroll:true});const update=()=>setProgress(Math.min(100,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)*100));addEventListener('scroll',update,{passive:true});update();
 const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}),{threshold:.04});document.querySelectorAll('.letter p').forEach(e=>{e.classList.add('reveal');obs.observe(e)});
 return()=>{removeEventListener('scroll',update);obs.disconnect()}},[stage]);
 const finishOpen=()=>{clearTimeout(openTimer.current);setStage('reading')};
 const open=()=>{
  if(stage!=='closed')return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){finishOpen();return}
  setStage('opening');
  openTimer.current=setTimeout(finishOpen,3200);
 };
 const onOpeningEnd=(event)=>{
  if(event.target===event.currentTarget&&event.animationName==='envelope-scene-out'&&stage==='opening')finishOpen();
 };

 return <><Sky/><div className="vignette"/><header><a className="brand" href="#top" aria-label="Về đầu trang"><span>c.</span> một lá thư gửi cậu</a><button className={'music '+(on?'playing':'')} onClick={toggle} aria-pressed={on}><span className="bars" aria-hidden="true"><i/><i/><i/><i/></span>{on?'Tắt nhạc':'Bật nhạc'}<span className="music-dot"/></button></header>
 {stage!=='reading'?<main id="top" className={'intro '+stage} onAnimationEnd={onOpeningEnd} aria-busy={stage==='opening'}>
 <p className="eyebrow">DÀNH RIÊNG CHO CÔNG MINH</p><h1>Mình có một điều<br/><em>muốn nói…</em></h1>
 <p className="subtitle">Có những cảm xúc, mình muốn gửi thành một lá thư.</p>
 <button className="envelope-button" onClick={open} disabled={stage==='opening'} aria-label="Mở lá thư gửi Công Minh"><div className="envelope"><div className="paper-peek">Gửi Công Minh,<br/><span>từ một người đã lấy hết can đảm.</span></div><div className="flap"/><div className="pocket"/><div className="seal">♡</div></div></button>
 <button className="primary" onClick={open} disabled={stage==='opening'}>{stage==='opening'?'Đang mở thư…':'Mở thư'}<span aria-hidden="true">↗</span></button>
 <p className="whisper">Cậu cứ đọc thật chậm nhé.</p><footer>TỪ CƯỜNG <span>✦</span> BẰNG TẤT CẢ SỰ CHÂN THÀNH</footer>
 </main>:<main id="top" className="reading"><div className="progress" style={{width:progress+'%'}}/><div className="letter-heading"><p className="eyebrow">CÓ NHỮNG ĐIỀU, CUỐI CÙNG CŨNG THÀNH LỜI</p><h1 ref={heading} tabIndex="-1">Gửi <em>Công Minh,</em></h1><p>Một câu chuyện nhỏ, bắt đầu từ những buổi sáng bóng chuyền.</p><span className="little-star">✦</span></div><article className="letter"><div className="paper-top"><span>MỘT LÁ THƯ GỬI CẬU</span><span>♡</span></div><div className="memory-photos" aria-label="Hai bức ảnh được vẽ lại theo phong cách chibi"><figure className="memory-photo group-photo"><img src={`${import.meta.env.BASE_URL}images/cong-minh-group.jpg`} alt="Minh họa chibi bốn người bạn đứng cạnh bức tường xanh ở trường" width="1024" height="1440"/><figcaption>Một góc thanh xuân.</figcaption></figure><figure className="memory-photo portrait-photo"><img src={`${import.meta.env.BASE_URL}images/cong-minh-portrait.jpg`} alt="Chân dung chibi Công Minh mặc vest đen, đưa tay chỉnh cà vạt" width="1024" height="1024"/><figcaption>Và một người thật đặc biệt.</figcaption></figure></div><Markdown>{letter}</Markdown><div className="signature"><time className="letter-date" dateTime="2026-10-15">Ngày 15 tháng 10 năm 2026</time><span>Thật lòng,</span><strong>Cường</strong></div></article><section className="ending"><span className="end-heart">♡</span><h2>Cảm ơn cậu,<br/><em>vì đã đọc đến đây.</em></h2><p>Cậu không cần trả lời ngay.<br/>Mình trân trọng cảm xúc của cậu, dù câu trả lời là gì.</p><button className="back" onClick={()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}>Đọc lại từ đầu ↑</button><button className="back" onClick={()=>{clearTimeout(openTimer.current);setStage('closed');window.scrollTo({top:0,behavior:'instant'})}}>Gấp lá thư lại ♡</button></section><footer>TỪ CƯỜNG <span>✦</span> BẰNG TẤT CẢ SỰ CHÂN THÀNH</footer></main>}
 </>;
}
createRoot(document.getElementById('root')).render(<App/>);
