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

import {Texture} from "./Texture.js"

class Canvas 
{
    constructor(canvasId) 
    {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.imageData = this.ctx.createImageData(this.width, this.height);
    }

    setPixel(x, y, color) 
    {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            // console.warn(`Coordinates (${x}, ${y}) are out of bounds.`);
            return;
        }

        const index = (y * this.width + x) * 4;
        this.imageData.data[index] = color.r;   // Red
        this.imageData.data[index + 1] = color.g; // Green
        this.imageData.data[index + 2] = color.b; // Blue
        this.imageData.data[index + 3] = color.a; // Alpha
    }

    getPixel(x, y) 
    {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            // console.warn(`Coordinates (${x}, ${y}) are out of bounds.`);
            return null;
        }

        const index = (y * this.width + x) * 4;
        return {
            r: this.imageData.data[index],
            g: this.imageData.data[index + 1],
            b: this.imageData.data[index + 2],
            a: this.imageData.data[index + 3]
        };
    }

    drawTexture(texture) 
    {
        if (!(texture instanceof Texture)) {
            console.error('Provided object is not an instance of Texture.');
            return;
        }

        // Ensure the texture dimensions do not exceed the canvas dimensions
        const width = Math.min(this.width, texture.width);
        const height = Math.min(this.height, texture.height);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const pixel = texture.getPixel(x, y);
                this.setPixel(x, y, pixel);
            }
        }

        this.update();
    }

    clear() {
        // Clear the entire canvas to the background color
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Optionally, reset imageData to the background color
        this.imageData = this.ctx.createImageData(this.width, this.height);
    }

    update() 
    {
        this.ctx.putImageData(this.imageData, 0, 0);
    }
}

export {Canvas}