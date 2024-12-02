

class BeatDetector 
{
  constructor(emitter, audioPlayer, threshold) 
  {
    this.emitter = emitter;
    this.audioPlayer = audioPlayer;
    this.threshold = threshold;
    this.lastAverage = 0;
    this.frequencyBinCount = 256; // Increase frequency bin count
    this.analyser = audioPlayer.analyser;
    this.analyser.fftSize = this.frequencyBinCount; // Update analyser FFT size
  }

  isBeat() 
  {
    const frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(frequencyData);

    // Use spectral flux method to detect beats
    var spectralFlux = this.calculateSpectralFlux(frequencyData);
    var change = Math.abs(spectralFlux - this.lastAverage);
    var isBeat = change > this.threshold;
    this.lastAverage = spectralFlux;

    if(isBeat)
    {
      this.emitter.dispatchEvent('onBeat', this.lastAverage);
    }
  }

  calculateSpectralFlux(frequencyData) 
  {
    var prevFrequencyData = this.prevFrequencyData || new Uint8Array(frequencyData.length);
    var spectralFlux = 0;
    for (let i = 0; i < frequencyData.length; i++) {
      spectralFlux += Math.abs(frequencyData[i] - prevFrequencyData[i]);
    }
    this.prevFrequencyData = frequencyData;
    return spectralFlux;
  }
}

export {BeatDetector}