// Simple playlist player script - cleaned up and guarded
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
  if (audio) audio.src = tracks[i].src;
  if (nowTitle) nowTitle.textContent = tracks[i].title;
  if (nowArtist) nowArtist.textContent = tracks[i].artist;
  if (lyricsEl) lyricsEl.textContent = 'Lời mẫu cho: ' + tracks[i].title + '\n(Thêm lời ở đây hoặc load động từ file .lrc)';
  highlightPlaylist();
  const autoplay = document.getElementById('autoplay');
  if(autoplay && autoplay.checked && audio) audio.play();
}

function highlightPlaylist(){
  playlistEls.forEach((el, idx)=>{
    el.style.background = idx===current ? 'linear-gradient(90deg, rgba(124,58,237,0.12), rgba(6,182,212,0.06))' : 'transparent';
    const eq = el.querySelector('.eq');
    if(eq) eq.style.opacity = idx===current ? 0.9 : 0.25;
  });
}

playlistEls.forEach((el,idx)=> el.addEventListener('click', ()=> loadTrack(idx)));

if (playBtn) {
  playBtn.addEventListener('click', ()=>{
    if(!audio?.src) loadTrack(0);
    if(audio.paused) { audio.play(); playBtn.textContent='⏸'; }
    else { audio.pause(); playBtn.textContent='▶️'; }
  });
}

if (prevBtn) prevBtn.addEventListener('click', ()=> loadTrack((current-1+tracks.length)%tracks.length));
if (nextBtn) nextBtn.addEventListener('click', ()=> loadTrack((current+1)%tracks.length));

if (audio) {
  audio.addEventListener('timeupdate', ()=>{
    if(audio.duration){
      const pct = (audio.currentTime/audio.duration)*100;
      if (progressBar) progressBar.style.width = pct + '%';
      const mm = Math.floor(audio.currentTime/60);
      const ss = Math.floor(audio.currentTime%60).toString().padStart(2,'0');
      if (timeLabel) timeLabel.textContent = mm+':'+ss;
    }
  });

  audio.addEventListener('play', ()=>{ if (playBtn) playBtn.textContent='⏸'; if (nowEq) nowEq.style.opacity=0.9; });
  audio.addEventListener('pause', ()=>{ if (playBtn) playBtn.textContent='▶️'; if (nowEq) nowEq.style.opacity=0.25; });
  audio.addEventListener('ended', ()=>{ 
    const loop = document.getElementById('loop');
    if(loop && loop.checked) audio.play(); 
    else if (nextBtn) nextBtn.click(); 
  });
}

const searchBtn = document.getElementById('searchBtn');
if (searchBtn) {
  searchBtn.addEventListener('click', ()=>{
    const q = (document.getElementById('search')?.value || '').trim().toLowerCase();
    playlistEls.forEach(el=>{
      const title = (el.dataset.title || '').toLowerCase();
      const artist = (el.dataset.artist || '').toLowerCase();
      el.style.display = (title.includes(q) || artist.includes(q) || q==='') ? 'flex' : 'none';
    });
  });
}

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();