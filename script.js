const playlistEls = Array.from(document.querySelectorAll('.playlist-item'));
const audio = document.getElementById('audio');
const nowTitle = document.getElementById('nowTitle');
const nowArtist = document.getElementById('nowArtist');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progressBar = document.querySelector('#progress > i');
const timeLabel = document.getElementById('time');
const lyricsEl = document.getElementById('lyrics');
const nowEq = document.getElementById('nowEq');

let current = -1;
const tracks = playlistEls.map(el => ({
  src: el.dataset.src,
  title: el.dataset.title,
  artist: el.dataset.artist
}));

function loadTrack(i){
  if(i<0 || i>=tracks.length) return;
  current = i;
  audio.src = tracks[i].src;
  nowTitle.textContent = tracks[i].title;
  nowArtist.textContent = tracks[i].artist;
  lyricsEl.textContent = 'Lời mẫu cho: ' + tracks[i].title + '\n(Thêm lời ở đây hoặc load động từ file .lrc)';
  highlightPlaylist();
  if(document.getElementById('autoplay').checked) audio.play();
}

function highlightPlaylist(){
  playlistEls.forEach((el, idx)=>{
    el.style.background = idx===current ? 'linear-gradient(90deg, rgba(124,58,237,0.12), rgba(6,182,212,0.06))' : 'transparent';
    el.querySelector('.eq').style.opacity = idx===current ? 0.9 : 0.25;
  });
}

playlistEls.forEach((el,idx)=> el.addEventListener('click', ()=> loadTrack(idx)));

playBtn.addEventListener('click', ()=>{
  if(!audio.src) loadTrack(0);
  if(audio.paused) { audio.play(); playBtn.textContent='⏸'; }
  else { audio.pause(); playBtn.textContent='▶️'; }
});

prevBtn.addEventListener('click', ()=> loadTrack((current-1+tracks.length)%tracks.length));
nextBtn.addEventListener('click', ()=> loadTrack((current+1)%tracks.length));

audio.addEventListener('timeupdate', ()=>{
  if(audio.duration){
    const pct = (audio.currentTime/audio.duration)*100;
    progressBar.style.width = pct + '%';
    const mm = Math.floor(audio.currentTime/60);
    const ss = Math.floor(audio.currentTime%60).toString().padStart(2,'0');
    timeLabel.textContent = mm+':'+ss;
  }
});

audio.addEventListener('play', ()=>{ playBtn.textContent='⏸'; nowEq.style.opacity=0.9; });
audio.addEventListener('pause', ()=>{ playBtn.textContent='▶️'; nowEq.style.opacity=0.25; });
audio.addEventListener('ended', ()=>{ 
  if(document.getElementById('loop').checked) audio.play(); 
  else nextBtn.click(); 
});

document.getElementById('searchBtn').addEventListener('click', ()=>{
  const q = document.getElementById('search').value.trim().toLowerCase();
  playlistEls.forEach(el=>{
    const title = el.dataset.title.toLowerCase();
    const artist = el.dataset.artist.toLowerCase();
    el.style.display = (title.includes(q) || artist.includes(q) || q==='') ? 'flex' : 'none';
  });
});

document.getElementById('year').textContent = new Date().getFullYear();