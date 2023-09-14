export function intersect(rect1, rect2) {
    const xIntersection = rect1.x >= rect2.x && rect1.x <= rect2.x + rect2.width || rect2.x >= rect1.x && rect2.x <= rect1.x + rect1.width;
    const yIntersection = rect1.y >= rect2.y && rect1.y <= rect2.y + rect2.height || rect2.y >= rect1.y && rect2.y <= rect1.y + rect1.height;
    console.log(xIntersection, yIntersection);
    return xIntersection && yIntersection;
}
