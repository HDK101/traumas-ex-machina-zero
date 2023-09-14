import { intersect } from "./aabb.js";
const intersection1 = intersect({
    x: 0,
    y: 0,
    width: 32,
    height: 32
}, {
    x: 64,
    y: 64,
    width: 32,
    height: 32
});
console.log(intersection1);
