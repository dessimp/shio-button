const UISounds = document.getElementById('sounds');

let players = [];

const getSounds = () => fetch('./sounds.json').then((res) => res.json());

const stopAll = () => {
  players.forEach(({ player }) => {
    player.pause();
  });
};

const addSounds = (sounds) => {
  sounds.forEach((category) => {
    const catDiv = document.createElement('div');
    catDiv.className = 'category';
    const catTitle = document.createElement('p');
    catTitle.textContent = category.categoryTitle;
    catDiv.appendChild(catTitle);

    category.sounds.forEach((sound) => {
      const soundDiv = document.createElement('div');
      soundDiv.className = 'sound';
      const soundTitle = document.createElement('span');
      soundTitle.textContent = sound.title;
      soundDiv.appendChild(soundTitle);

      const player = document.createElement('audio');
      player.setAttribute('src', `sounds/${sound.src}`);
      soundDiv.appendChild(player);
      players.push({ player, soundDiv });

      soundDiv.addEventListener('mousedown', (e) => {
        if (e.button !== 0 || (player.currentTime !== 0 && player.currentTime !== player.duration)) return;
        player.currentTime = 0;
        player.play();
        const node = document.createElement('a');
        node.classList.add('processing');
        node.style.animation = `playing ${player.duration}s linear`;
        soundDiv.appendChild(node);
        setTimeout(() => {
          const childs = soundDiv.childNodes;
          soundDiv.removeChild(childs[2]);
        }, player.duration * 1000);
        e.preventDefault();
      });
      catDiv.appendChild(soundDiv);
    });

    UISounds.appendChild(catDiv);
  });
};

const getSubCount = async () => {
  const { result } = await fetch('https://shio-sub.netlify.app/.netlify/functions/getSubscribers').then((res) => res.json());
  document.getElementById('sub-count').textContent = `${result} subscribers`;
};

(async () => {
  getSubCount();
  const sounds = await getSounds();
  addSounds(sounds);
})();
