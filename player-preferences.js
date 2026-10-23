// Editorial pacing is the normal 1x experience; UI multipliers are relative to it.
const NORMAL_PACE=1.12;
const EPISODE_TITLES_EN={1:'Terms of Shelter',2:'Dangerous Roommate',3:'Bite Back',4:'Let Me Decide',5:'Rules Can Wait Tonight',6:'Put Down the Crown'};
function initialLanguage(){try{const saved=localStorage.getItem('nine-lives-language');if(['en','zh'].includes(saved))return saved}catch{}return (navigator.language||'en').toLowerCase().startsWith('zh')?'zh':'en'}
function saveLanguage(language){document.documentElement.lang=language;try{localStorage.setItem('nine-lives-language',language)}catch{}window.dispatchEvent(new Event('playerlanguagechange'))}
function episodeTitle(row,language){return language==='en'?(row.title_en||EPISODE_TITLES_EN[row.episode||row.id]||'Episode'):row.title}
function setPlaybackPace(video,multiplier){video.playbackRate=NORMAL_PACE*(Number(multiplier)||1);video.preservesPitch=true;if('webkitPreservesPitch' in video)video.webkitPreservesPitch=true}
