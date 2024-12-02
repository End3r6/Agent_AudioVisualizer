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

class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  addEventListener(eventName, listener) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(listener);
  }

  removeEventListener(eventName, listener) {
    if (this.listeners[eventName]) {
      this.listeners[eventName] = this.listeners[eventName].filter(
        (l) => l !== listener
      );
    }
  }

  dispatchEvent(eventName, data) {
    if (this.listeners[eventName]) {
      const event = new CustomEvent(eventName, { detail: data });
      this.listeners[eventName].forEach((listener) => listener(event));
    }
  }
}

export { EventEmitter }
