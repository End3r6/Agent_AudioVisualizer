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

import { Texture } from "./Texture.js";
import { Agent } from "./Agent.js";

class Simulation
{
    constructor(simulationSettings, emitter)
    {
        this.displayTexture = new Texture(simulationSettings.width, simulationSettings.height);
        this.trailTexture = new Texture(simulationSettings.width, simulationSettings.height); // New trail texture
        this.width = simulationSettings.width;
        this.height = simulationSettings.height;

        this.fadeFactor = simulationSettings.fadeFactor;
        this.diffuseFactor = simulationSettings.diffuseFactor;

        this.emitter = emitter;

        this.agents = Array();
        for (let s = 0; s < simulationSettings.speciesSettings.length; s++) 
        {
            const species = simulationSettings.speciesSettings[s];
            for (let i = 0; i < species.getNumAgents(); i++) 
            {
                this.agents.push(new Agent(
                    simulationSettings.width / 2,
                    simulationSettings.height / 2, 
                    this.getRandomNumber(0, 360), 
                    simulationSettings.speciesSettings[s].getSpeed(),
                    simulationSettings.width, 
                    simulationSettings.height,
                    species.color,
                    species.doScreenWrap,
                    species.doBeatFlash
                ));
            }
        }

        this.emitter.addEventListener('onBeat', () => 
        {
            for (let i = 0; i < this.agents.length; i++) 
            {
                this.agents[i].changeDirection(this.agents[i].getDirection() + (90 + this.getRandomNumber(-0.5, 0.5))); // Adjust direction based on beat

                if(this.agents[i].getDoBeatFlash())
                {
                    const position = this.agents[i].getPosition();
                    this.drawCircle(this.trailTexture, position.x, position.y, 5, this.agents[i].color);
                }
            }
        });
    }

    getDisplayTexture()
    {
        return this.displayTexture;
    }

    tick()
    {        
        // Update trail texture
        this.trailTexture.pixels.forEach((pixel) => {
            if (pixel.a > 0) {
                pixel.r -= this.fadeFactor;
                pixel.g -= this.fadeFactor;
                pixel.b -= this.fadeFactor;
            }
        });

        this.agents.forEach(agent => {

            agent.move(agent.getSpeed());
    
            const position = agent.getPosition();
            this.trailTexture.setPixel(position.x, position.y, agent.color); // Add new pixel to trail texture
        });

        // Copy diffuse map to display texture
        this.displayTexture.pixels = this.trailTexture.pixels.slice();
        // this.drawCircle(this.displayTexture, this.width / 2, this.height / 2, 10, { r: 255, g: 0, b: 0, a: 255 });
    }

    drawCircle(texture, x, y, radius, color) {
        const centerX = x;
        const centerY = y;
    
        for (let i = 0; i <= radius; i++) {
            const y1 = Math.sqrt(radius * radius - i * i);
    
            // Draw all four quadrants
            this.setPixel(texture, centerX + i, centerY + y1, color);
            this.setPixel(texture, centerX + i, centerY - y1, color);
            this.setPixel(texture, centerX - i, centerY + y1, color);
            this.setPixel(texture, centerX - i, centerY - y1, color);
        }
    }
    
    setPixel(texture, x, y, color) {
        // Ensure the coordinates are within the bounds of the texture
        if (x >= 0 && x < texture.width && y >= 0 && y < texture.height) {
            texture.setPixel(Math.round(x), Math.round(y), color);
        }
    }
    getRandomNumber(min, max) 
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

export { Simulation }