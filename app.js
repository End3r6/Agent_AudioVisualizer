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

import { Canvas } from "./Canvas.js"
import { Simulation } from "./Simulation.js";
import { AudioPlayer } from "./AudioPlayer.js"
import { BeatDetector } from "./BeatDetector.js"
import { EventEmitter } from "./EventEmitter.js";
import { SimulationSettings, SpeciesSettings } from "./Settings.js";

function checkWebGLSupport() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            console.log('WebGL is supported');
            return true;
        } else {
            console.error('WebGL is not supported');
            return false;
        }
    } catch (e) {
        console.error('WebGL is not supported', e);
        return false;
    }
}

if (!checkWebGLSupport()) {
    console.error('WebGL is not supported in this browser. Please use a modern browser.');
}


// Get the save settings button
const saveSettingsButton = document.getElementById('save-settings');

// Get the add species button
const addSpeciesButton = document.getElementById('add-species');

let currentAudioPlayer = null;
let fileUrl = null;

// Add an event listener to the add species button
addSpeciesButton.addEventListener('click', () => {
    // Get the species settings table body
    const speciesSettingsTableBody = document.getElementById('species-settings-table-body');

    // Create a new row in the species settings table
    const newRow = speciesSettingsTableBody.insertRow();

    // Create a new table data cell for the number of agents
    const newCell1 = newRow.insertCell();
    newCell1.innerHTML = '<input type="number" id="num-agents" value="100">';

    // Create a new table data cell for the color
    const newCell2 = newRow.insertCell();
    newCell2.innerHTML = '<input type="color" id="color" value="#ff0000">';

    // Create a new table data cell for the add species settings button
    const newCell3 = newRow.insertCell();
    newCell3.innerHTML = '<button id="remove-species">Remove</button>';

    // Get the remove species button
    const removeSpeciesButton = newCell3.children[0];

    // Add an event listener to the remove species button
    removeSpeciesButton.addEventListener('click', () => {
        // Get the row that the remove button is in
        const row = removeSpeciesButton.parentNode.parentNode;

        // Remove the row from the table
        row.parentNode.removeChild(row);
    });
});

const songUploadInput = document.getElementById('song-upload');

songUploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    fileUrl = URL.createObjectURL(file);
});

// Add an event listener to the save settings button
saveSettingsButton.addEventListener('click', () => {
    // Get the values from the input fields
    const width = parseInt(document.getElementById('width').value);
    const height = parseInt(document.getElementById('height').value);
    const fadeFactor = parseFloat(document.getElementById('fade-factor').value);
    const diffuseFactor = parseFloat(document.getElementById('diffuse-factor').value);
    const threshold = parseFloat(document.getElementById('threshold').value);

    // Create a new simulation settings object
    const newSimulationSettings = new SimulationSettings(
        width, height, fadeFactor, threshold, diffuseFactor,
        []
    );

    // Get the species settings table body
    const speciesSettingsTableBody = document.getElementById('species-settings-table-body');

    // Iterate over the rows in the species settings table
    for (let i = 0; i < speciesSettingsTableBody.rows.length; i++) {
        const row = speciesSettingsTableBody.rows[i];

        // Get the color and number of agents from the row
        const color = row.cells[1].children[0].value;
        const numAgents = parseInt(row.cells[0].children[0].value);

        // Create a new species settings object
        const speciesSettings = new SpeciesSettings(
            {
                r: parseInt(color.substr(1, 2), 16),
                g: parseInt(color.substr(3, 2), 16),
                b: parseInt(color.substr(5, 2), 16),
                a: 255
            },
            numAgents
        );

        // Add the species settings to the new simulation settings
        newSimulationSettings.addSpeciesSettings(speciesSettings);
    }

    // Create a new canvas object
    const newCanvas = new Canvas('drawing-canvas');
    newCanvas.canvas.width = newSimulationSettings.getWidth();
    newCanvas.canvas.height = newSimulationSettings.getHeight();

    // Create a new emitter object
    const newEmitter = new EventEmitter();

    // Create a new audio player object
    if (currentAudioPlayer) {
        currentAudioPlayer.stop();
    }

    currentAudioPlayer = new AudioPlayer(fileUrl);

    // Create a new beat detector object
    const newBeatDetector = new BeatDetector(newEmitter, currentAudioPlayer, newSimulationSettings.getThreshold());

    // Create a new simulation object
    const newSimulation = new Simulation(newSimulationSettings, newEmitter);

    // Define a new animation function
    function newAnimate() {
        newBeatDetector.isBeat();

        newSimulation.tick();

        newCanvas.drawTexture(newSimulation.getDisplayTexture());

        // Request the next frame
        requestAnimationFrame(newAnimate);
    }

    // Start the new animation loop
    newAnimate();

    // Stop any remaining audio playback
    currentAudioPlayer.stop();
});