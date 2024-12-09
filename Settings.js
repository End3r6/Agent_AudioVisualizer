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

class SimulationSettings
{
    constructor(width, height, fadeFactor, threshold, diffuseFactor, speciesSettings)
    {
        this.width = width;
        this.height = height;
        this.fadeFactor = fadeFactor;
        this.threshold = threshold;
        this.diffuseFactor = diffuseFactor;
        this.speciesSettings = speciesSettings;

        let numAgents = 0;
        for (const setting of this.speciesSettings) {
            numAgents += setting.getNumAgents();
        }

        this.numAgents = numAgents;
    }

    getNumAgents() { return this.numAgents; }
    getWidth() { return this.width; }
    getHeight() { return this.height; }
    getFadeFactor() { return this.fadeFactor; }
    getThreshold() { return this.threshold; }
    getSpeciesSettings() { return this.speciesSettings; }

    addSpeciesSettings(speciesSettings) { this.speciesSettings.push(speciesSettings); }
}

class SpeciesSettings
{
    constructor(color, numAgents, speed)
    {
        this.color = color;
        this.numAgents = numAgents;
        this.speed = speed;
    }

    getColor() { return this.color; }
    getNumAgents() { return this.numAgents; }
    getSpeed() { return this.speed; }
}

export { SimulationSettings, SpeciesSettings }