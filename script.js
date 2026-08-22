const SECRET_CODE="010110";
let enteredCode="";

const $=s=>document.querySelector(s);
const loadingScreen=$("#loadingScreen"),lockScreen=$("#lockScreen"),letterScreen=$("#letterScreen"),mainContent=$("#mainContent");
const dots=$("#dots"),wrongCode=$("#wrongCode"),envelope=$("#envelope"),openingLetter=$("#openingLetter"),continueButton=$("#continueButton");

function renderDots(){dots.innerHTML="";for(let i=0;i<SECRET_CODE.length;i++){const d=document.createElement("span");d.className="dot"+(i<enteredCode.length?" filled":"");dots.appendChild(d)}}

document.addEventListener("DOMContentLoaded",()=>{
  renderDots();
  setTimeout(()=>{loadingScreen.classList.add("hidden");lockScreen.classList.remove("hidden")},1400);
  makePetals();
});

document.querySelectorAll(".keypad button").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const k=btn.dataset.key;
    if(k==="clear"){enteredCode="";renderDots();return}
    if(k==="enter"){checkCode();return}
    if(enteredCode.length<SECRET_CODE.length){enteredCode+=k;renderDots();if(enteredCode.length===SECRET_CODE.length)setTimeout(checkCode,180)}
  })
});
function checkCode(){
  if(enteredCode===SECRET_CODE){
    lockScreen.classList.add("hidden");
    letterScreen.classList.remove("hidden");
    enteredCode="";renderDots();
  }else{
    wrongCode.textContent="Kode salah. Coba lagi ya 💗";
    enteredCode="";renderDots();
    setTimeout(()=>wrongCode.textContent="",1600);
  }
}

envelope.addEventListener("click",()=>{
  if(envelope.classList.contains("open"))return;
  envelope.classList.add("open");
  $("#envelopeHint").textContent="A little message, just for you ♡";
  setTimeout(()=>openingLetter.classList.remove("hidden"),1000);
});

continueButton.addEventListener("click",()=>{
  letterScreen.classList.add("closing");
  setTimeout(()=>{letterScreen.classList.add("hidden");mainContent.classList.remove("hidden");window.scrollTo(0,0)},800);
});

/* flowers */
const flowerMessage=$("#flowerMessage");
document.querySelectorAll(".floating-flower").forEach(f=>{
  f.addEventListener("click",()=>{
    flowerMessage.textContent=f.dataset.message;
    flowerMessage.classList.remove("hidden");
  })
});

/* photo modal */
const photoModal=$("#photoModal"),modalPhoto=$("#modalPhoto"),modalCaption=$("#modalCaption");
document.querySelectorAll(".polaroid").forEach(card=>{
  card.addEventListener("click",()=>{
    modalPhoto.src=card.dataset.photo;
    modalCaption.textContent=card.dataset.caption;
    photoModal.classList.remove("hidden");
  })
});
$("#closePhoto").addEventListener("click",()=>photoModal.classList.add("hidden"));
photoModal.addEventListener("click",e=>{if(e.target===photoModal)photoModal.classList.add("hidden")});

/* jar */
const jar=$("#jar"),jarMessage=$("#jarMessage");
const jarNotes=[
"Aku beruntung pernah mengenal kamu, karena nggak semua orang bisa meninggalkan kesan sedalam itu dalam hidup seseorang.",
"Aku beruntung pernah dekat sama kamu, bahkan meskipun akhirnya kita sempat menjauh.",
"Aku beruntung bisa melihat sisi kamu yang mungkin nggak semua orang tahu, dari tingkah kecilmu sampai cara kamu memperlakukan orang lain.",
"Aku beruntung pernah punya cerita sama kamu sejak SMP, karena sampai sekarang cerita itu masih jadi salah satu hal yang aku ingat.",
"Aku beruntung bisa mengagumi seseorang seperti kamu, bukan cuma karena parasmu, tapi juga karena sifat dan caramu menjadi diri sendiri.",
"Aku beruntung kita masih dipertemukan sampai sekarang, bahkan setelah sempat kehilangan kedekatan."
];
function shakeJar(){
  jar.classList.remove("shake");void jar.offsetWidth;jar.classList.add("shake");
  setTimeout(()=>{jarMessage.textContent=jarNotes[Math.floor(Math.random()*jarNotes.length)];jarMessage.classList.remove("hidden")},650)
}
$("#shakeJar").addEventListener("click",shakeJar);jar.addEventListener("click",shakeJar);

/* playlist - put files in assets/music1.mp3, music2.mp3, music3.mp3 */
const songs=[
 {title:"Song One",artist:"Artist One",file:"assets/music1.mp3",icon:"🌷"},
 {title:"Song Two",artist:"Artist Two",file:"assets/music2.mp3",icon:"🌸"},
 {title:"Song Three",artist:"Artist Three",file:"assets/music3.mp3",icon:"🌹"}
];
let current=0,playing=false;
const audio=$("#audio"),playPause=$("#playPause"),progress=$("#progress"),albumArt=$("#albumArt"),songTitle=$("#songTitle"),songArtist=$("#songArtist"),playlist=$("#playlist");
function loadSong(i,autoplay=false){
 current=(i+songs.length)%songs.length;const s=songs[current];
 audio.src=s.file;songTitle.textContent=s.title;songArtist.textContent=s.artist;albumArt.textContent=s.icon;
 playlist.innerHTML=songs.map((x,n)=>`<div class="track ${n===current?"active":""}" data-i="${n}"><div><small>${n+1}</small> &nbsp; ${x.title}<br><small>${x.artist}</small></div><span>${x.icon}</span></div>`).join("");
 playlist.querySelectorAll(".track").forEach(t=>t.addEventListener("click",()=>loadSong(Number(t.dataset.i),true)));
 if(autoplay)audio.play().catch(()=>{});
}
loadSong(0);
playPause.addEventListener("click",async()=>{if(audio.paused){await audio.play().catch(()=>{});playing=true}else{audio.pause();playing=false}});
audio.addEventListener("play",()=>{playing=true;playPause.textContent="❚❚"});
audio.addEventListener("pause",()=>{playing=false;playPause.textContent="▶"});
$("#prevSong").addEventListener("click",()=>loadSong(current-1,true));
$("#nextSong").addEventListener("click",()=>loadSong(current+1,true));
audio.addEventListener("timeupdate",()=>{if(audio.duration){progress.value=audio.currentTime/audio.duration*100;$("#currentTime").textContent=time(audio.currentTime);$("#duration").textContent=time(audio.duration)}});
progress.addEventListener("input",()=>{if(audio.duration)audio.currentTime=progress.value/100*audio.duration});
audio.addEventListener("ended",()=>loadSong(current+1,true));
function time(s){if(!isFinite(s))return"0:00";return Math.floor(s/60)+":"+String(Math.floor(s%60)).padStart(2,"0")}
$("#musicFloat").addEventListener("click",async()=>{if(audio.paused)await audio.play().catch(()=>{});else audio.pause()});

/* background petals */
function makePetal(){
 const p=document.createElement("span");p.className="petal";
 const flowers=["🌸","🌷","🌼","🌺","✿","❀"];
 p.textContent=flowers[Math.floor(Math.random()*flowers.length)];
 p.style.left=Math.random()*100+"vw";p.style.top=(100+Math.random()*20)+"vh";
 p.style.fontSize=(12+Math.random()*18)+"px";p.style.setProperty("--dx",(Math.random()*160-80)+"px");
 p.style.animationDuration=(8+Math.random()*9)+"s";$("#petalLayer").appendChild(p);
 setTimeout(()=>p.remove(),18000);
}
function makePetals(){for(let i=0;i<18;i++)setTimeout(makePetal,i*350);setInterval(makePetal,800)}
