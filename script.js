"use strict";
const WEDDING_DATE=new Date('2027-01-09T17:30:00+05:30');
const $=id=>document.getElementById(id);
const intro=$('intro');
const localMusic=new Audio('assets/background-music.mp3');
localMusic.loop=true;
localMusic.preload='auto';
let musicPlaying=false;
const toast=$('toast');let toastTimer;
function notify(msg){toast.textContent=msg;toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),4700)}
function musicUI(){ $('musicIcon').textContent=musicPlaying?'♫':'♪';$('musicText').textContent=musicPlaying?'Mute':'Music';$('musicToggle').setAttribute('aria-label',musicPlaying?'Mute background music':'Play background music'); }
function startMusic(){
  // Calling play() directly in the click gesture avoids losing autoplay permission to an async fetch.
  const playing=localMusic.play();
  if(playing&&typeof playing.then==='function')return playing.then(()=>{musicPlaying=true;musicUI()}).catch(()=>{musicPlaying=false;musicUI();notify('Tap Music to enable sound in your browser.')});
  musicPlaying=true;musicUI();return Promise.resolve();
}
function stopMusic(){localMusic.pause();musicPlaying=false;musicUI()}
$('musicToggle').addEventListener('click',()=>{if(musicPlaying)stopMusic();else startMusic()});
$('openInvitation').addEventListener('click',()=>{intro.classList.add('opening');$('openInvitation').disabled=true;startMusic().catch(()=>{});setTimeout(()=>{intro.classList.add('intro--gone');document.body.classList.remove('locked')},1700);setTimeout(()=>intro.setAttribute('aria-hidden','true'),2800)},{once:true});
function countdown(){let left=WEDDING_DATE-new Date();if(left<=0){['days','hours','minutes','seconds'].forEach(k=>$(k).textContent='00');$('countdownDone').hidden=false;return}let parts={days:Math.floor(left/86400000),hours:Math.floor(left/3600000)%24,minutes:Math.floor(left/60000)%60,seconds:Math.floor(left/1000)%60};for(let [k,v]of Object.entries(parts))$(k).textContent=String(v).padStart(2,'0')};countdown();setInterval(countdown,1000);
if('IntersectionObserver'in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}}),{threshold:.10});document.querySelectorAll('.reveal:not(.show)').forEach(el=>io.observe(el))}else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('show'));
// Moving hearts rise as the guest scrolls, echoing the reference's heart scroll motif.
let scrollTick=false;window.addEventListener('scroll',()=>{if(scrollTick)return;scrollTick=true;requestAnimationFrame(()=>{const y=window.scrollY,max=Math.max(1,document.documentElement.scrollHeight-innerHeight),pct=y/max;const trail=$('heartTrail');trail.classList.toggle('active',y>160&&pct<.91);trail.style.transform=`translateY(${Math.sin(pct*11)*55}px)`;scrollTick=false})},{passive:true});
// Scratch card: retina-aware drawing and pointer support; keyboard-accessible reveal button.
const canvas=$('scratchCanvas'),shell=$('scratchShell'),ctx=canvas.getContext('2d');let drawing=false,touches=0;
function renderScratch(){let rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);let grad=ctx.createLinearGradient(0,0,rect.width,rect.height);grad.addColorStop(0,'#993e50');grad.addColorStop(.5,'#bd6572');grad.addColorStop(1,'#7c2b3e');ctx.fillStyle=grad;ctx.fillRect(0,0,rect.width,rect.height);ctx.font='500 22px Georgia';ctx.textAlign='center';ctx.fillStyle='#fff1e0';ctx.fillText('✧  REVEAL  ✧',rect.width/2,rect.height/2-8);ctx.font='13px Arial';ctx.fillText('SCRATCH HERE',rect.width/2,rect.height/2+25);ctx.globalCompositeOperation='destination-out';ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=38}
function pos(e){let r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
function finish(){shell.classList.add('scratch-complete');canvas.setAttribute('aria-hidden','true')}
canvas.addEventListener('pointerdown',e=>{drawing=true;canvas.setPointerCapture(e.pointerId);const p=pos(e);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+.1,p.y+.1);ctx.stroke();e.preventDefault()});
canvas.addEventListener('pointermove',e=>{if(!drawing)return;const p=pos(e);ctx.lineTo(p.x,p.y);ctx.stroke();if(++touches>75)finish();e.preventDefault()});
['pointerup','pointercancel','pointerleave'].forEach(name=>canvas.addEventListener(name,()=>{drawing=false}));
$('revealDate').addEventListener('click',finish);renderScratch();
$('rsvpForm').addEventListener('submit',e=>{e.preventDefault();let name=$('rsvpName').value.trim();let answer=document.querySelector('input[name="attendance"]:checked');if(!name||!answer){notify('Please enter your name and select an RSVP option.');return}let message=`Assalamu Alaikum!\nRSVP for the Nikah of Nabeel Moideen & Farhana Musthafa\nDate: 09 January 2027, 5:30 PM\nGuest: ${name}\nResponse: ${answer.value}`;window.open('https://wa.me/917510330497?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');notify('WhatsApp opened. Please press Send there to complete RSVP.')});
function shareText(){return 'With the blessings of Allah, you are invited to the Nikah of Nabeel Moideen & Farhana Musthafa.\n09 January 2027, 5:30 PM IST\nLabeebas House, Pothamkandam\nhttps://maps.app.goo.gl/ruK47q7Ax5nZjoDW6\n\n'+location.href}
$('shareInvitation').addEventListener('click',async()=>{if(navigator.share){try{await navigator.share({title:'Nabeel Moideen & Farhana Musthafa | Nikah',text:shareText(),url:location.href});return}catch(e){if(e.name==='AbortError')return}}try{await navigator.clipboard.writeText(shareText());notify('Invitation copied to clipboard.')}catch(_){notify('Copy the URL in your browser to share.')}});
