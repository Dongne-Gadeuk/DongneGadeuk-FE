// 아이소메트릭 좌표 변환
// SVG viewBox 좌표계(360 x 380) 안에서 그리드 좌표 -> 화면 좌표로 변환한다.
// 방/바닥/아이템 전부 같은 viewBox 안에 그려서 정렬 계산을 단순하게 유지.

export const VIEW = { w: 360, h: 380 };

// 바닥 다이아몬드 기준점들
export const FLOOR = {
  N: 4, // N x N 타일
  back: { x: 180, y: 122 }, // 안쪽 코너(그리드 0,0)
  stepX: { dx: 30, dy: 17.5 }, // gx 증가 방향 (오른쪽 아래)
  stepY: { dx: -30, dy: 17.5 }, // gy 증가 방향 (왼쪽 아래)
} as const;

/** 그리드 꼭짓점(gx, gy) -> 화면 좌표 */
export function gridToScreen(gx: number, gy: number) {
  return {
    x: FLOOR.back.x + FLOOR.stepX.dx * gx + FLOOR.stepY.dx * gy,
    y: FLOOR.back.y + FLOOR.stepX.dy * gx + FLOOR.stepY.dy * gy,
  };
}

/** 타일(gx, gy)의 중심 좌표 (아이템 배치 기준점, 바닥에 닿는 지점) */
export function tileCenter(gx: number, gy: number) {
  return gridToScreen(gx + 0.5, gy + 0.5);
}

/** 한 타일의 4 꼭짓점 (탭 영역 polygon용) */
export function tilePolygon(gx: number, gy: number) {
  const a = gridToScreen(gx, gy);
  const b = gridToScreen(gx + 1, gy);
  const c = gridToScreen(gx + 1, gy + 1);
  const d = gridToScreen(gx, gy + 1);
  return `${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y} ${d.x},${d.y}`;
}

/** 기본 정렬용 깊이값: 클수록 화면 앞쪽 */
export function tileDepth(gx: number, gy: number) {
  return gx + gy;
}