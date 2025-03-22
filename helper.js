// Description: Helper functions for the project
// This file defines helper functions for the project, to manage vector operations, random numbers, etc.

export function rotateVec3(angle, x, y, z) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
        x: x * cos - z * sin,
        y: y,
        z: x * sin + z * cos
    };
}

export function randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function distanceToSun(x, y, z) {
    return Math.sqrt(x ** 2 + y ** 2 + z ** 2);
}