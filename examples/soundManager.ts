import { createSoundManager } from '../src/index.js';

let now = 0;

const manager = createSoundManager({
  maxChannels: 3,
  channelLimits: {
    music: 1,
    sfx: 2,
  },
  getTime: () => now,
});

function advance(time: number): void {
  now += time;
  const finished = manager.update();
  if (finished.length > 0) {
    console.log('Finished sounds:', finished.map((sound) => sound.soundId));
  }
}

manager.play({ soundId: 'menu-music', channel: 'music', duration: 10, priority: 1 });
manager.play({ soundId: 'ui-click', channel: 'sfx', duration: 0.5 });
manager.play({ soundId: 'ui-hover', channel: 'sfx', duration: 0.5 });

// This request exceeds the SFX channel limit, so it only succeeds because of a higher priority.
const result = manager.play({ soundId: 'critical-warning', channel: 'sfx', duration: 2, priority: 5 });
if (result.evicted) {
  console.log('Preempted sound:', result.evicted.soundId);
}

advance(1);
manager.play({ soundId: 'accept', channel: 'sfx', duration: 0.25 });
advance(10);
console.log('Active sounds:', manager.getActive().map((sound) => sound.soundId));
