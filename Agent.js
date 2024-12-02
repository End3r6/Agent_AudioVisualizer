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

class Agent {
    constructor(x, y, direction, width, height, color) {
        this.x = x;
        this.y = y;
        this.direction = this.wrapDirection(direction); // Ensure direction is within 0 to 360
        this.width = width;
        this.height = height;
        this.color = color;
    }

    wrapDirection(direction) 
    {
        return ((direction % 360) + 360) % 360;
    }

    changeDirection(newDirection) 
    {
        this.direction = this.wrapDirection(newDirection);
    }

    move(stepSize) 
    {
        if (stepSize <= 0) {
            console.warn(`Step size ${stepSize} should be greater than 0.`);
            return;
        }

        // Convert direction from degrees to radians
        const radians = this.direction * (Math.PI / 180);

        // Calculate new position
        this.x += stepSize * Math.cos(radians);
        this.y += stepSize * Math.sin(radians);

        this.bounceOffEdges();
    }

    bounceOffEdges() {
        let newDirection = this.direction;

        // Check left and right boundaries
        if (this.x <= 0 || this.x >= this.width - 1) {
            newDirection = 180 - newDirection;
        }

        // Check top and bottom boundaries
        if (this.y <= 0 || this.y >= this.height - 1) {
            newDirection = 360 - newDirection;
        }

        // Wrap the new direction
        this.direction = this.wrapDirection(newDirection);
    }

    getPosition() {
        return { x: Math.round(this.x), y: Math.round(this.y) };
    }

    getDirection()
    {
        return this.direction;
    }

    getBeatDetector()
    {
        return this.beatDetector;
    }

    getColor()
    {
        return this.color;
    }
}

export { Agent }