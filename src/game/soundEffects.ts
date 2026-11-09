import { JukeboxTrack, JukeboxTrackId } from './types';

/**
 * Tactile, Physical ASMR Audio Engine for The Executive Game (Sopranos Poker Roguelike)
 * Uses procedural pink-noise buffer synthesis, resonant ceramic/clay filtering,
 * and heavy acoustic transients. Replaces generic arcade MIDI beeps with weighted,
 * tactile cardstock and casino clay feedback.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private noiseBuffer: AudioBuffer | null = null;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    if (this.ctx && !this.noiseBuffer) {
      this.noiseBuffer = this.generatePinkNoiseBuffer(this.ctx, 1.2);
    }

    return this.ctx;
  }

  /**
   * Generates organic pink noise buffer (Paul Kellet filter method)
   * for realistic paper friction, card swishes, and acoustic transients.
   */
  private generatePinkNoiseBuffer(ctx: AudioContext, durationSeconds: number): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * durationSeconds);
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.12;
      b6 = white * 0.115926;
    }

    return buffer;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * 1. CARD DEAL / DRAW: Realistic ASMR 300gsm cardstock friction swish + snap
   */
  public playCardDraw(staggerIndex = 0) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const startTime = ctx.currentTime + Math.max(0, staggerIndex * 0.055);

    // Friction whoosh: bandpass filtered pink noise
    if (this.noiseBuffer) {
      const noise = ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, startTime);
      filter.frequency.exponentialRampToValueAtTime(1200, startTime + 0.11);
      filter.Q.setValueAtTime(2.2, startTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.22, startTime + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(startTime);
      noise.stop(startTime + 0.13);
    }

    // Heavy linen cardstock edge snap impulse
    const osc = ctx.createOscillator();
    const snapGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1150, startTime + 0.035);
    osc.frequency.exponentialRampToValueAtTime(420, startTime + 0.07);

    snapGain.gain.setValueAtTime(0.001, startTime + 0.035);
    snapGain.gain.linearRampToValueAtTime(0.14, startTime + 0.04);
    snapGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

    osc.connect(snapGain);
    snapGain.connect(ctx.destination);

    osc.start(startTime + 0.035);
    osc.stop(startTime + 0.085);
  }

  /**
   * 2. CARD SELECT: Tactile crisp physical card lift / snap off green felt
   */
  public playCardSelect() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Card friction flick
    if (this.noiseBuffer) {
      const noise = ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3400, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 0.04);
      filter.Q.setValueAtTime(3.0, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.05);
    }

    // Felt table wood tap
    const osc = ctx.createOscillator();
    const tapGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.045);

    tapGain.gain.setValueAtTime(0.15, now);
    tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(tapGain);
    tapGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * 3. CARD DESELECT: Soft card landing on green felt baize
   */
  public playCardDeselect() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (this.noiseBuffer) {
      const noise = ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, now);
      filter.frequency.exponentialRampToValueAtTime(500, now + 0.04);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.045);
    }

    const osc = ctx.createOscillator();
    const tapGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.05);

    tapGain.gain.setValueAtTime(0.1, now);
    tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(tapGain);
    tapGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.055);
  }

  /**
   * 4. CARD PLAY (COLLECT VIG): Smooth upward levitation whoosh into scoring lane
   */
  public playCardPlay() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (this.noiseBuffer) {
      const noise = ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(700, now);
      filter.frequency.exponentialRampToValueAtTime(2600, now + 0.16);
      filter.Q.setValueAtTime(1.8, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.24, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.22);
    }
  }

  /**
   * 5. SCORING PULSE / CHIP COUNT: Authentic 14g ceramic casino clay chip clack + sub thud
   * Pitch multiplier increases with each successive scoring card (Balatro-style dopamine rise)
   */
  public playCardScorePulse(pitchMultiplier = 1) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const p = Math.max(0.6, Math.min(2.5, pitchMultiplier));

    // Ceramic Clay Ping #1 (high harmonic peak)
    const ping1 = ctx.createOscillator();
    const ping1Gain = ctx.createGain();
    ping1.type = 'sine';
    ping1.frequency.setValueAtTime(2240 * p, now);
    ping1.frequency.exponentialRampToValueAtTime(1950 * p, now + 0.045);

    ping1Gain.gain.setValueAtTime(0.2, now);
    ping1Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    ping1.connect(ping1Gain);
    ping1Gain.connect(ctx.destination);
    ping1.start(now);
    ping1.stop(now + 0.05);

    // Ceramic Clay Ping #2 (secondary ring)
    const ping2 = ctx.createOscillator();
    const ping2Gain = ctx.createGain();
    ping2.type = 'triangle';
    ping2.frequency.setValueAtTime(3480 * p, now);
    ping2.frequency.exponentialRampToValueAtTime(3100 * p, now + 0.03);

    ping2Gain.gain.setValueAtTime(0.14, now);
    ping2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    ping2.connect(ping2Gain);
    ping2Gain.connect(ctx.destination);
    ping2.start(now);
    ping2.stop(now + 0.04);

    // Heavy 14g Clay Core Thud (low-pass filtered impact body)
    const thud = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(190 * p, now);
    thud.frequency.exponentialRampToValueAtTime(65, now + 0.07);

    thudGain.gain.setValueAtTime(0.25, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    thud.connect(thudGain);
    thudGain.connect(ctx.destination);
    thud.start(now);
    thud.stop(now + 0.085);
  }

  // Alias for backward compatibility
  public playChipCount(pitchMultiplier = 1) {
    this.playCardScorePulse(pitchMultiplier);
  }

  /**
   * 6. MULT TRIGGER / IGNITE: Saturated sub-bass punch + mob enforcer flame ignite
   */
  public playMultTrigger() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Heavy cinematic sub-bass punch
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(95, now);
    sub.frequency.exponentialRampToValueAtTime(42, now + 0.18);

    subGain.gain.setValueAtTime(0.35, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    sub.connect(subGain);
    subGain.connect(ctx.destination);
    sub.start(now);
    sub.stop(now + 0.24);

    // Filtered flame whoosh
    if (this.noiseBuffer) {
      const noise = ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(450, now + 0.18);
      filter.Q.setValueAtTime(2.0, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.22);
    }
  }

  /**
   * 7. CASH CHIME / ENVELOPE DROP: Heavy metallic drawer ring + bill rustle
   */
  public playCashChime() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bellFrequencies = [1046.5, 1318.51, 1567.98, 2093.0]; // E6, G6, C7 harmonics

    bellFrequencies.forEach((freq, idx) => {
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const delay = idx * 0.045;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);

      gain.gain.setValueAtTime(0.001, now + delay);
      gain.gain.linearRampToValueAtTime(0.12 / (idx + 1), now + delay + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.5);
    });

    // Money envelope paper bill rustle
    if (this.noiseBuffer) {
      const noise = ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.frequency.exponentialRampToValueAtTime(1000, now + 0.18);
      filter.Q.setValueAtTime(1.5, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.2);
    }
  }

  /**
   * 8. CARD DISCARD / MUCK SWISH: Aggressive slide & toss into muck pile
   */
  public playDiscardSwish() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Fast descending paper friction slide
    if (this.noiseBuffer) {
      const noise = ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(4200, now);
      filter.frequency.exponentialRampToValueAtTime(650, now + 0.15);
      filter.Q.setValueAtTime(2.4, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.26, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.18);
    }

    // Heavy muck impact
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now + 0.04);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.14);

    gain.gain.setValueAtTime(0.14, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + 0.04);
    osc.stop(now + 0.15);
  }

  /**
   * 9. BOSS BLIND STING: Heavy ominous cinematic sub-bass boom (mob sit-down dread)
   */
  public playBossSting() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Low sub-bass drop
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(65, now);
    sub.frequency.exponentialRampToValueAtTime(32, now + 0.65);

    subGain.gain.setValueAtTime(0.4, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    sub.connect(subGain);
    subGain.connect(ctx.destination);
    sub.start(now);
    sub.stop(now + 0.8);

    // Dark orchestral filtered horn swell
    const horn = ctx.createOscillator();
    const hornFilter = ctx.createBiquadFilter();
    const hornGain = ctx.createGain();

    horn.type = 'sawtooth';
    horn.frequency.setValueAtTime(73.42, now); // D2

    hornFilter.type = 'lowpass';
    hornFilter.frequency.setValueAtTime(450, now);
    hornFilter.frequency.exponentialRampToValueAtTime(90, now + 0.6);

    hornGain.gain.setValueAtTime(0.25, now);
    hornGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    horn.connect(hornFilter);
    hornFilter.connect(hornGain);
    hornGain.connect(ctx.destination);

    horn.start(now);
    horn.stop(now + 0.7);
  }

  /**
   * 10. VICTORY FANFARE: Vintage lounge brass chord + crystal whisky tumbler clink
   */
  public playVictoryFanfare() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Warm Sopranos lounge progression (F9 -> C6/9)
    const notes = [
      { freq: 261.63, delay: 0 }, // C4
      { freq: 329.63, delay: 0.08 }, // E4
      { freq: 392.0, delay: 0.16 }, // G4
      { freq: 523.25, delay: 0.24 }, // C5
    ];

    notes.forEach(({ freq, delay }) => {
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + delay);

      gain.gain.setValueAtTime(0.001, now + delay);
      gain.gain.linearRampToValueAtTime(0.14, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.75);
    });

    // High-end crystal glass toast clink
    const glass = ctx.createOscillator();
    const glassGain = ctx.createGain();
    glass.type = 'sine';
    glass.frequency.setValueAtTime(2850, now + 0.28);

    glassGain.gain.setValueAtTime(0.18, now + 0.28);
    glassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    glass.connect(glassGain);
    glassGain.connect(ctx.destination);

    glass.start(now + 0.28);
    glass.stop(now + 1.25);
  }

  /**
   * 11. DEFEAT ("GETTING WHACKED"): Suppressed Newark alley gunshot with reverb tail
   */
  public playGunshotDefeat() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Explosive muzzle blast transient
    if (this.noiseBuffer) {
      const noise = ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(7500, now);
      filter.frequency.exponentialRampToValueAtTime(140, now + 0.35);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.4);
    }

    // Heavy ballistic low-end kick
    const kick = ctx.createOscillator();
    const kickGain = ctx.createGain();
    kick.type = 'sine';
    kick.frequency.setValueAtTime(120, now);
    kick.frequency.exponentialRampToValueAtTime(35, now + 0.25);

    kick.connect(kickGain);
    kickGain.connect(ctx.destination);

    kick.start(now);
    kick.stop(now + 0.32);
  }

  /**
   * 11B. WHACK CREW MEMBER: Sharp suppressed revolver crack
   */
  public playGunshot() {
    this.playGunshotDefeat();
  }

  /**
   * 12. FBI POLICE SIREN: Oscillating two-tone Federal cruiser siren
   */
  public playFbiSiren() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(750, now);
    osc.frequency.linearRampToValueAtTime(1350, now + 0.35);
    osc.frequency.linearRampToValueAtTime(750, now + 0.7);
    osc.frequency.linearRampToValueAtTime(1350, now + 1.05);
    osc.frequency.linearRampToValueAtTime(750, now + 1.4);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
    gain.gain.setValueAtTime(0.25, now + 1.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.65);
  }

  /**
   * 13. DOOR BREACH / BATTERING RAM: Heavy wooden splintering crash + tactical flashbang
   */
  public playDoorBreach() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Splinter noise blast
    if (this.noiseBuffer) {
      const noise = ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(5500, now);
      filter.frequency.exponentialRampToValueAtTime(180, now + 0.5);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.6);
    }

    // Heavy battering ram thud
    const ram = ctx.createOscillator();
    const ramGain = ctx.createGain();
    ram.type = 'sine';
    ram.frequency.setValueAtTime(150, now);
    ram.frequency.exponentialRampToValueAtTime(28, now + 0.45);

    ramGain.gain.setValueAtTime(0.6, now);
    ramGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    ram.connect(ramGain);
    ramGain.connect(ctx.destination);

    ram.start(now);
    ram.stop(now + 0.55);
  }

  /**
   * 14. THE JUKEBOX AUDIO SYNTHESIS ENGINE
   * 4 distinct instrumental vibes: Late 90s Alternative, Italian Crooner, Blues Rock, Lounge Noir
   */
  private currentTrackId: JukeboxTrackId = 'trip_hop';
  private isJukeboxPlayingState: boolean = false;
  private jukeboxTimer: ReturnType<typeof setTimeout> | null = null;
  private jukeboxActiveNodes: { stop?: () => void; disconnect?: () => void }[] = [];
  private jukeboxVolume: number = 0.28;

  public getJukeboxVolume(): number {
    return this.jukeboxVolume;
  }

  public setJukeboxVolume(vol: number) {
    this.jukeboxVolume = Math.max(0, Math.min(1, vol));
  }

  public getCurrentTrackId(): JukeboxTrackId {
    return this.currentTrackId;
  }

  public isJukeboxPlaying(): boolean {
    return this.isJukeboxPlayingState && !this.isMuted;
  }

  public toggleJukeboxPlay(): boolean {
    if (this.isJukeboxPlayingState) {
      this.stopJukebox();
      return false;
    } else {
      this.playJukeboxTrack(this.currentTrackId);
      return true;
    }
  }

  public playJukeboxTrack(trackId: JukeboxTrackId) {
    this.stopJukebox();
    this.currentTrackId = trackId;
    this.isJukeboxPlayingState = true;
    if (this.isMuted) return;

    this.scheduleTrackLoop(trackId);
  }

  public stopJukebox() {
    this.isJukeboxPlayingState = false;
    if (this.jukeboxTimer) {
      clearTimeout(this.jukeboxTimer);
      this.jukeboxTimer = null;
    }
    // Stop all active loop nodes
    for (const node of this.jukeboxActiveNodes) {
      try {
        node.stop?.();
      } catch {
        // ignore already stopped
      }
      try {
        node.disconnect?.();
      } catch {
        // ignore
      }
    }
    this.jukeboxActiveNodes = [];
  }

  private scheduleTrackLoop(trackId: JukeboxTrackId) {
    if (!this.isJukeboxPlayingState || this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime + 0.05;
    let loopDurationMs = 8000;

    if (trackId === 'trip_hop') {
      // 92 BPM 4-bar loop (approx 10.43s)
      loopDurationMs = 10430;
      this.renderTripHopLoop(ctx, now);
    } else if (trackId === 'crooner') {
      // 108 BPM 4-bar waltz loop (approx 6.66s)
      loopDurationMs = 6660;
      this.renderCroonerLoop(ctx, now);
    } else if (trackId === 'blues_rock') {
      // 116 BPM 4-bar blues shuffle (approx 8.27s)
      loopDurationMs = 8270;
      this.renderBluesRockLoop(ctx, now);
    } else {
      // Lounge Noir 76 BPM 4-bar ballad (approx 12.63s)
      loopDurationMs = 12630;
      this.renderLoungeNoirLoop(ctx, now);
    }

    this.jukeboxTimer = setTimeout(() => {
      this.scheduleTrackLoop(this.currentTrackId);
    }, loopDurationMs - 150);
  }

  // 1. Late 90s Alternative ("Woke Up This Morning" gritty organ-groove & trip-hop wah bass)
  private renderTripHopLoop(ctx: AudioContext, startTime: number) {
    const bassNotes = [
      { freq: 43.65, time: 0, dur: 1.2 }, // F1
      { freq: 51.91, time: 1.3, dur: 1.1 }, // Ab1
      { freq: 58.27, time: 2.6, dur: 2.3 }, // Bb1
      { freq: 43.65, time: 5.2, dur: 1.2 }, // F1
      { freq: 65.41, time: 6.5, dur: 1.1 }, // C2
      { freq: 58.27, time: 7.8, dur: 2.4 }, // Bb1
    ];

    bassNotes.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime + time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, startTime + time);
      filter.frequency.linearRampToValueAtTime(140, startTime + time + dur);

      gain.gain.setValueAtTime(0.001, startTime + time);
      gain.gain.linearRampToValueAtTime(0.18 * this.jukeboxVolume, startTime + time + 0.05);
      gain.gain.setValueAtTime(0.15 * this.jukeboxVolume, startTime + time + dur - 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + time + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + time);
      osc.stop(startTime + time + dur + 0.05);
      this.jukeboxActiveNodes.push(osc);
    });

    // Muted organ chords: Fm (F3, Ab3, C4) & Bbm (Bb3, Db4, F4)
    const organStabs = [
      { freqs: [174.61, 207.65, 261.63], time: 0.65 },
      { freqs: [174.61, 207.65, 261.63], time: 3.26 },
      { freqs: [233.08, 277.18, 349.23], time: 5.87 },
      { freqs: [174.61, 207.65, 261.63], time: 8.48 },
    ];

    organStabs.forEach(({ freqs, time }) => {
      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime + time);

        gain.gain.setValueAtTime(0.001, startTime + time);
        gain.gain.linearRampToValueAtTime(0.07 * this.jukeboxVolume, startTime + time + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + time + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime + time);
        osc.stop(startTime + time + 0.5);
        this.jukeboxActiveNodes.push(osc);
      });
    });
  }

  // 2. Classic Italian Crooner (Sinatra/Bennett slow romantic jazz waltz with nylon guitar & soft brushed cymbals)
  private renderCroonerLoop(ctx: AudioContext, startTime: number) {
    const bassWaltz = [
      { freq: 65.41, time: 0 }, // C2 (Beat 1)
      { freq: 55.0, time: 1.66 }, // A1 (Beat 4)
      { freq: 73.42, time: 3.33 }, // D2 (Beat 7)
      { freq: 49.0, time: 5.0 }, // G1 (Beat 10)
    ];

    bassWaltz.forEach(({ freq, time }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime + time);

      gain.gain.setValueAtTime(0.001, startTime + time);
      gain.gain.linearRampToValueAtTime(0.2 * this.jukeboxVolume, startTime + time + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + time + 1.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime + time);
      osc.stop(startTime + time + 1.45);
      this.jukeboxActiveNodes.push(osc);
    });

    // Gentle jazz guitar chords on beats 2 & 3: Cmaj7, Am7, Dm7, G7
    const guitarChords = [
      { freqs: [261.63, 329.63, 392.0, 493.88], times: [0.55, 1.1] }, // Cmaj7
      { freqs: [220.0, 261.63, 329.63, 392.0], times: [2.22, 2.77] }, // Am7
      { freqs: [293.66, 349.23, 440.0, 523.25], times: [3.88, 4.44] }, // Dm7
      { freqs: [196.0, 246.94, 293.66, 349.23], times: [5.55, 6.11] }, // G7
    ];

    guitarChords.forEach(({ freqs, times }) => {
      times.forEach((t) => {
        freqs.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime + t);

          gain.gain.setValueAtTime(0.001, startTime + t);
          gain.gain.linearRampToValueAtTime(0.045 * this.jukeboxVolume, startTime + t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + t + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(startTime + t);
          osc.stop(startTime + t + 0.45);
          this.jukeboxActiveNodes.push(osc);
        });
      });
    });
  }

  // 3. Blues Rock (Bada Bing swagger blues shuffle with overdriven slide guitar riffs)
  private renderBluesRockLoop(ctx: AudioContext, startTime: number) {
    const shuffleBeats = [
      { freq: 82.41, time: 0 }, // E2
      { freq: 98.0, time: 0.51 }, // G2
      { freq: 110.0, time: 1.03 }, // A2
      { freq: 116.54, time: 1.55 }, // Bb2 (blues note)
      { freq: 123.47, time: 2.06 }, // B2
      { freq: 82.41, time: 4.13 }, // E2
      { freq: 110.0, time: 5.16 }, // A2
      { freq: 123.47, time: 6.2 }, // B2
      { freq: 82.41, time: 7.23 }, // E2
    ];

    shuffleBeats.forEach(({ freq, time }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime + time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750, startTime + time);

      gain.gain.setValueAtTime(0.001, startTime + time);
      gain.gain.linearRampToValueAtTime(0.18 * this.jukeboxVolume, startTime + time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + time + 0.42);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + time);
      osc.stop(startTime + time + 0.45);
      this.jukeboxActiveNodes.push(osc);
    });
  }

  // 4. Lounge Noir (Smoky midnight diner jazz ballad with upright walking bass)
  private renderLoungeNoirLoop(ctx: AudioContext, startTime: number) {
    const noirBass = [
      { freq: 73.42, time: 0 }, // D2
      { freq: 87.31, time: 1.57 }, // F2
      { freq: 98.0, time: 3.15 }, // G2
      { freq: 103.83, time: 4.73 }, // Ab2
      { freq: 110.0, time: 6.31 }, // A2
      { freq: 87.31, time: 7.89 }, // F2
      { freq: 73.42, time: 9.47 }, // D2
      { freq: 65.41, time: 11.05 }, // C2
    ];

    noirBass.forEach(({ freq, time }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + time);

      gain.gain.setValueAtTime(0.001, startTime + time);
      gain.gain.linearRampToValueAtTime(0.22 * this.jukeboxVolume, startTime + time + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + time + 1.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime + time);
      osc.stop(startTime + time + 1.45);
      this.jukeboxActiveNodes.push(osc);
    });

    // Muted Rhodes chords (Dm9, Gm7, A7alt)
    const rhodesChords = [
      { freqs: [293.66, 349.23, 440.0, 523.25, 659.25], time: 0.4 }, // Dm9
      { freqs: [196.0, 293.66, 349.23, 440.0], time: 3.5 }, // Gm7
      { freqs: [220.0, 277.18, 329.63, 415.3], time: 6.7 }, // A7b9
      { freqs: [293.66, 349.23, 440.0, 523.25], time: 9.8 }, // Dm7
    ];

    rhodesChords.forEach(({ freqs, time }) => {
      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime + time);

        gain.gain.setValueAtTime(0.001, startTime + time);
        gain.gain.linearRampToValueAtTime(0.04 * this.jukeboxVolume, startTime + time + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + time + 1.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime + time);
        osc.stop(startTime + time + 1.65);
        this.jukeboxActiveNodes.push(osc);
      });
    });
  }

  /**
   * 15. THE "CUT TO BLACK" FINALE SHUTDOWN
   * Instantly stops ALL audio nodes, loops, and suspends the context mid-frame
   * with zero tail or reverb, matching the abrupt Sopranos series finale cut.
   */
  public cutAllAudioInstantly() {
    this.stopJukebox();
    if (this.ctx) {
      try {
        this.ctx.suspend().catch(() => {});
      } catch {
        // ignore
      }
    }
  }

  public resumeAudioAfterFinale() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }
}

export const JUKEBOX_TRACKS: JukeboxTrack[] = [
  {
    id: 'trip_hop',
    title: 'Woke Up This Morning',
    artist: 'A3 Syndicate',
    genre: 'Late 90s Alternative',
    year: '1999',
    vibe: 'Gritty Newark highway overdrive & organ groove',
  },
  {
    id: 'crooner',
    title: "Core 'ngrato (Ungrateful Heart)",
    artist: 'Junior & The Vesuvio Trio',
    genre: 'Classic Italian Crooner',
    year: '1962',
    vibe: 'Warm romantic jazz waltz with nylon guitar',
  },
  {
    id: 'blues_rock',
    title: 'Bada Bing Shuffle',
    artist: 'The Route 17 All-Stars',
    genre: 'Blues Rock',
    year: '1998',
    vibe: 'Heavy overdriven blues shuffle & slide guitar riff',
  },
  {
    id: 'lounge_noir',
    title: "Holsten's Midnight Noir",
    artist: 'Meadowlands Quartet',
    genre: 'Lounge Noir',
    year: '2007',
    vibe: 'Smoky diner ballad with upright walking bass',
  },
];

export const sounds = new SoundManager();

