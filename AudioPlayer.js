// Copyright 2024 jdswardson
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

class AudioPlayer {
    constructor(url) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.source = null;
        this.analyser = this.audioContext.createAnalyser();
        this.buffer = null;
    
        // Use scriptProcessor mode for better performance
        this.analyser.context.createScriptProcessor(2048, 2, 2);
        this.loadAudio(url);
      }

    loadAudio(url) {
        fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                this.buffer = audioBuffer;
                this.stop();
                this.play();
            })
            .catch(error => {
                console.error('Error loading audio:', error);
            });
    }

    play() {
        if (this.source) {
            this.source.stop();
            this.source.disconnect();
            this.source = null;
            
            console.log('Audio playback stopping.');
        }
        this.source = this.audioContext.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        this.source.start(0);
        this.isPlaying = true;
    }

    stop() {
        if (this.source) {
            this.source.stop();
            this.source.disconnect();
            this.source = null;
            this.isPlaying = false;

            console.log('Audio playback stopped.');
        }
    }

    getFrequencyData() {
        const frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(frequencyData);
        return frequencyData;
    }
}

export { AudioPlayer };