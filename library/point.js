import Library from "../cordinate";

export default class Point {
  constructor(a, b) {
    this.x = a;
    this.y = b;
    this.polar = false;
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
}
