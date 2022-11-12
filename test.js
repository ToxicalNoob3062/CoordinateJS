import Library from "./coordinate.js";
const { Point } = Library;

let points = [];
for (let i = 1; i < 10; i++) {
  points.push(new Point(i, i + 2));
}

Point.drawGraph(points);
