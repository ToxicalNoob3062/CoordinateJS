//firstPartyModules
import Library from "../../coordinate.js";

//thirdParty modules
import * as cheerio from "cheerio";
import open from "open";
import * as fs from "fs";
import * as path from "path";

//forming directory path
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rpath = path.resolve(__dirname, "./canvas.html");
const rpath2 = path.resolve(__dirname, "./canvas2.html");

//templates for changing DOM;
const DOMChanger = {
  setState($, res, range) {
    $("body").prepend(
      `<script>
         let a = '${res}';
         let range=[${range}]
      </script>`
    );
  },
  removePolygon($) {
    $("#polygon").remove();
  },
};

//Helps to Deal With All Functionalities Related To Points
export default class Point {
  constructor(a, b) {
    this.x = a;
    this.y = b;
    this.polar = false;
  }

  static drawGraph(points) {
    const len = points.length;
    points.push(new Point(points[len - 1].x, points[0].y));
    const [res, range] = Point.stringifyGraph(points);
    let $ = cheerio.load(fs.readFileSync(rpath));
    DOMChanger.setState($, res, range);
    fs.writeFileSync(rpath2, $.html());
    open(rpath2, { app: "browser" });
  }

  static radians_to_degrees(radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
  }

  static degrees_to_radians(radians) {
    var pi = Math.PI;
    return radians * (pi / 180);
  }

  static tanInverse(val) {
    return this.radians_to_degrees(Math.atan(val));
  }

  static stringifyGraph(points) {
    let res = "a=[";
    const range = [0, 0];
    for (let p of points) {
      res += `(${p.x},${p.y}),`;
      range[0] = Math.max(p.x, range[0]);
      range[1] = Math.max(p.y, range[1]);
    }
    res = res.slice(0, res.length - 1) + "]";
    return [res, range];
  }

  replaceCoordinate() {
    let state = false;
    if (this.polar) {
      this.cartesian();
      state = true;
    }
    console.log(this);
    const store = this.x;
    this.x = this.y;
    this.y = store;
    if (state) this.polarCoordinate();
  }

  hypotenuse() {
    if (!this.polar) return Math.sqrt(this.x ** 2 + this.y ** 2);
    else return this.x;
  }

  polarCoordinate() {
    if (this.polar) throw new Error("Already a polar coordinate!");
    const r = this.hypotenuse();
    const quad = this.quadrant();
    let theta = Point.tanInverse(Math.abs(this.y) / Math.abs(this.x));

    if (quad === "2nd") this.y = 180 - theta;
    else if (quad === "3rd") this.y = -180 + theta;
    else if (quad === "4th") this.y = -theta;
    else this.y = theta;

    this.x = r;
    this.polar = true;
  }

  cartesian() {
    if (!this.polar) throw new Error("Already a cartesian coordinate!");
    const r = this.x;
    const theta = this.y;
    this.x = Math.round(r * Math.cos(Point.degrees_to_radians(theta)), 2);
    this.y = Math.round(r * Math.sin(Point.degrees_to_radians(theta)), 2);
    this.polar = false;
  }

  quadrant() {
    let state = false;
    let res = "1st";
    if (this.polar) {
      this.cartesian();
      state = true;
    }
    if (this.x < 0 && this.y > 0) res = "2nd";
    else if (this.x < 0 && this.y < 0) res = "3rd";
    else if (this.x > 0 && this.y < 0) res = "4th";
    if (state) this.polarCoordinate();
    return res;
  }

  distance(point) {
    return Math.sqrt((this.x - point.x) ** 2 + (this.y - point.y) ** 2);
  }
  visualize() {
    const [res, range] = [`(${this.x},${this.y})`, [this.x, this.y]];
    let $ = cheerio.load(fs.readFileSync(rpath));
    DOMChanger.setState($, res, range);
    DOMChanger.removePolygon($);
    fs.writeFileSync(rpath2, $.html());
    open(rpath2, { app: "browser" });
  }
}
