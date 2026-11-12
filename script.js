'use strict';
// Event location is in India (IST, UTC+05:30); edit here if location/time changes.
const WEDDING_DATE = new Date('2027-01-09T17:30:00+05:30');
const YOUTUBE_VIDEO_ID = '8bWRU2ipOwA';
const STORAGE_KEY = 'nabeel-farhana-wishes-v1';
const intro = document.getElementById('intro');
const toast = document.getElementById('toast');
let toastTimer;
function notify(message){toast.textContent=message;toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),4100)}

// YouTube requires interaction before audible playback; video owner may also disable embedding.
let ytPlayer=null, ytReady=false, musicPlaying=false, youtubeRequested=false, musicMode='youtube';
const musicToggle=document.getElementById('musicToggle');
const localMusic=new Audio('assets/background-music.mp3');
localMusic.loop=true;localMusic.preload='none';
const soundIcon=document.getElementById('musicIcon');
const soundText=document.getElementById('musicText');
function updateMusicButton(){soundIcon.textContent=musicPlaying?'♫':'♪';soundText.textContent=musicPlaying?'Pause':'Music';musicToggle.setAttribute('aria-label',musicPlaying?'Pause background music':'Play background music')}
function loadYoutube(){if(window.YT?.Player){initYT();return}if(document.getElementById('yt-iframe-api'))return;const s=document.createElement('script');s.id='yt-iframe-api';s.src='https://www.youtube.com/iframe_api';document.head.appendChild(s)}
window.onYouTubeIframeAPIReady=function(){initYT()};
function initYT(){if(ytPlayer||!window.YT?.Player)return;ytPlayer=new YT.Player('musicPlayer',{height:'200',width:'200',videoId:YOUTUBE_VIDEO_ID,playerVars:{autoplay:0,controls:0,playsinline:1,rel:0,loop:1,playlist:YOUTUBE_VIDEO_ID},events:{onReady:()=>{ytReady=true;if(youtubeRequested){ytPlayer.playVideo()}},onStateChange:e=>{if(e.data===YT.PlayerState.PLAYING){musicPlaying=true;updateMusicButton()}else if(e.data===YT.PlayerState.ENDED){musicPlaying=false;updateMusicButton()}},onError:()=>{musicPlaying=false;updateMusicButton();notify('YouTube audio cannot play in this browser. Use the YouTube link or add a licensed MP3 file in assets/background-music.mp3.')}}})}
async function startMusic(){// Local licensed music file has priority when provided.
  try{const head=await fetch('assets/background-music.mp3',{method:'HEAD'});if(head.ok){musicMode='local';await localMusic.play();musicPlaying=true;updateMusicButton();return}}catch(_e){}
  musicMode='youtube';youtubeRequested=true;loadYoutube();if(ytReady&&ytPlayer){ytPlayer.playVideo();musicPlaying=true;updateMusicButton()}else{notify('Music is loading. Tap Music again if it does not start.')}}
async function toggleMusic(){if(musicPlaying){if(musicMode==='local')localMusic.pause();else if(ytReady)ytPlayer.pauseVideo();musicPlaying=false;updateMusicButton();return}try{await startMusic()}catch(e){notify('Music playback was blocked. Tap the Music button to try again.')}}
musicToggle.addEventListener('click',toggleMusic);
document.getElementById('openInvitation').addEventListener('click',()=>{intro.classList.add('intro--gone');document.body.classList.remove('locked');setTimeout(()=>intro.setAttribute('aria-hidden','true'),1200);startMusic().catch(()=>{});});

function updateCountdown(){const now=new Date();const remaining=WEDDING_DATE-now;if(remaining<=0){['days','hours','minutes','seconds'].forEach(k=>document.getElementById(k).textContent='00');document.getElementById('countdownDone').hidden=false;return}const d=Math.floor(remaining/86400000),h=Math.floor(remaining/3600000)%24,m=Math.floor(remaining/60000)%60,s=Math.floor(remaining/1000)%60;for(const [key,value] of Object.entries({days:d,hours:h,minutes:m,seconds:s}))document.getElementById(key).textContent=String(value).padStart(2,'0')}
updateCountdown();setInterval(updateCountdown,1000);
const observer=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');observer.unobserve(e.target)}})},{threshold:.13});document.querySelectorAll('.reveal:not(.show)').forEach(el=>observer.observe(el));

function readWishes(){try{const w=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');return Array.isArray(w)?w.slice(-20):[]}catch(_){return []}}
function renderWishes(){const list=document.getElementById('wishList');list.replaceChildren();readWishes().slice().reverse().forEach(({name,message})=>{const item=document.createElement('article');item.className='wish-item';const author=document.createElement('strong');author.textContent=name;const msg=document.createElement('p');msg.textContent=message;item.append(author,msg);list.append(item)})}
document.getElementById('wishForm').addEventListener('submit',e=>{e.preventDefault();const name=document.getElementById('guestName').value.trim(),message=document.getElementById('guestWish').value.trim();if(!name||!message)return;const wishes=readWishes();wishes.push({name:name.slice(0,65),message:message.slice(0,500)});try{localStorage.setItem(STORAGE_KEY,JSON.stringify(wishes));renderWishes();e.target.reset();notify('Wish saved on this device. Thank you!')}catch(_){notify('This browser does not allow saving wishes.')}});
renderWishes();
function shareText(){return 'With the blessings of Allah, you are invited to the Nikah of Nabeel Moideen & Farhana Musthafa.\n📅 Saturday, 9 January 2027 at 5:30 PM IST\n📍 Labeebas House, Pothamkandam\nLocation: https://maps.app.goo.gl/ruK47q7Ax5nZjoDW6\n\n'+(window.location.protocol.startsWith('http')?window.location.href:'')}
document.getElementById('shareInvitation').addEventListener('click',async()=>{if(navigator.share){try{await navigator.share({title:'Nabeel & Farhana | Nikah',text:shareText(),url:location.href});return}catch(e){if(e.name==='AbortError')return}}try{await navigator.clipboard.writeText(shareText());notify('Invitation copied! Share it with your loved ones.')}catch(e){notify('Copy the website link from your browser to share.')}});
document.getElementById('shareWish').addEventListener('click',()=>{const name=document.getElementById('guestName').value.trim();const msg=document.getElementById('guestWish').value.trim();const text=msg?`${name||'A guest'} sends blessings to Nabeel & Farhana:\n${msg}`:'Barakallahu lakuma, Nabeel & Farhana! May Allah bless your beautiful union.';window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank','noopener,noreferrer')});
