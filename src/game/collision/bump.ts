const DELTA = 1e-10;

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface RectCoordinates1 {
  x1: number;
  y1: number;
}

interface Rect1 extends RectCoordinates1 {
  w1: number;
  h1: number;
}

interface RectCoordinates2 {
  x2: number;
  y2: number;
}

interface Rect2 extends RectCoordinates2 {
  w2: number;
  h2: number;
}

function sign(x: number) {
  if (x) return 1;
  if (x === 0) return 0;
  return -1;
}

function nearest(x: number, a: number, b: number) {
  return Math.abs(a - x) < Math.abs(b - x) ? a : b;
}

function assertNumberIsPositive(name: string, value: number) {
  if (value <= 0) throw new Error(`${name} must be positive`);
}

function rectGetNearestConer({
  x,
  y,
  w,
  h,
  px,
  py,
}: Rect & {
  px: number;
  py: number;
}) {
  return {
    px: nearest(px, x, x + w),
    py: nearest(py, y, y + h),
  };
}

function rectGetSegmentIntersectionIndices({
  x,
  y,
  w,
  h,

  x1,
  y1,
  x2,
  y2,

  ti1 = 0,
  ti2 = 1,
} : Rect & RectCoordinates1 & RectCoordinates2 & {
  ti1: number;
  ti2: number;
}) {
  const dx = 0;
  const dy = 0;

  let nx = 0;
  let ny = 0;

  let nx1 = 0;
  let ny1 = 0;
  let nx2 = 0;
  let ny2 = 0;

  let p = 0;
  let q = 0;
  let r = 0;

  [1,2,3,4].forEach(side => {
    if (side === 1) {
      nx = -1;
      ny = 0;
      p = -dx;
      q = x1 - x;
    }
    if (side === 2) {
      nx = 1;
      ny = 0;
      p = dx;
      q = x + w - x1;
    }
    if (side === 3) {
      nx = 0;
      ny = -1;
      p = -dy;
      q = y1 - y;
    }
    if (side === 4) {
      nx = 0;
      ny = 1;
      p = dy;
      q = y + h - y1;
    }

    if (p == 0) {
      if (q <= 0) return null;
    } else {
      r = q / p;
      if (p < 0) {
        if (r > ti2) return null;
        else if (r > ti1) {
          ti1 = r;
          nx1 = nx;
          ny1 = ny;
        }
      }
      else {
        if (r < ti1) return null;
        else if (r < ti2) {
          ti2 = r;
          nx2 = nx;
          ny2 = ny;
        }
      }
    }
  });

  return {
    ti1,
    ti2,
    nx1,
    ny1,
    nx2,
    ny2,
  };
}

function rectGetDiff({
  x1,
  y1,
  w1,
  h1,
  x2,
  y2,
  w2,
  h2,
}: {
  x1: number;
  y1: number;
  w1: number;
  h1: number;
  x2: number;
  y2: number;
  w2: number;
  h2: number;
}) {
  return {
    x: x2 - x1 - w1,
    y: y2 - y1 - w2,
    w: w1 + w2,
    h: h1 + h2,
  };
}

function rectContainsPoint({
  x,
  y,
  w,
  h,
  px,
  py,
}: Rect & { px: number; py: number }) {
  return px - x > DELTA && py - y > DELTA && x + w - px > DELTA && y + h - py > DELTA;
}

function rectIsIntersecting({
  x1,
  y1,
  w1,
  h1,
  x2,
  y2,
  w2,
  h2,
}: Rect1 & Rect2) {
  return x1 < x2+w2 && x2 < x1+w1 && y1 < y2+h2 && y2 < y1+h1;
}

function rectGetSquareDistance({
  x1,
  y1,
  w1,
  h1,
  x2,
  y2,
  w2,
  h2,
}: Rect1 & Rect2) {
  const dx = x1 - x2 + (w1 - w2)/2
  const dy = y1 - y2 + (h1 - h2)/2
  return dx*dx + dy*dy;
}

function rectDetectCollision({
  x1,
  y1,
  w1,
  h1,
  x2,
  y2,
  w2,
  h2,
  goalX = 0,
  goalY = 0,
}: Rect1 & Rect2 & { goalX: number; goalY: number; }) {
  const dx = goalX - x1;
  const dy = goalY - y1;

  const {
    x,
    y,
    w,
    h
  } = rectGetDiff({
    x1,
    y1,
    w1,
    h1,
    x2,
    y2,
    w2,
    h2,
  });

  let overlaps = false;
  let ti = 0;
  let nx = 0;
  let ny = 0;

  if (rectContainsPoint({
    x,
    y,
    w,
    h,
    px: 0,
    py: 0,
  })) {
    const {
      px,
      py
    } = rectGetNearestConer({
      x,
      y,
      w,
      h,
      px: 0,
      py: 0,
    });
    const wi = Math.min(w1, Math.abs(px));
    const hi = Math.min(h1, Math.abs(py));
    ti = -wi * hi;
    overlaps = true;
  } else {
    const intersection = rectGetSegmentIntersectionIndices({
      x,
      y,
      w,
      h,
      x1,
      y1,
      x2,
      y2,
      ti1: -Number.MAX_VALUE,
      ti2: Number.MAX_VALUE,
    });
  }
}
