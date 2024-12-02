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

class Texture {
    constructor(width, height, background = { r: 0, g: 0, b: 0, a: 255 }) {
        this.width = width;
        this.height = height;
        this.background = background;

        // Initialize the pixel data array with the background color
        this.pixels = Array(width * height).fill(null).map(() => ({ ...background }));
    }

    setPixel(x, y, color) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            // console.warn(`Coordinates (${x}, ${y}) are out of bounds.`);
            return;
        }

        const index = y * this.width + x;
        this.pixels[index] = { ...color };
    }

    getPixel(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            // console.warn(`Coordinates (${x}, ${y}) are out of bounds.`);
            return null;
        }

        const index = y * this.width + x;
        return this.pixels[index];
    }

    clear()
    {
        this.pixels = Array(this.width * this.height).fill(null).map(() => ({ ...this.background }));
    }
}

export { Texture }