import type { ColorIdentityColors } from "../types";

const WUBRG_ORDER: ColorIdentityColors[] = ["w", "u", "b", "r", "g"];

export default class ColorIdentity {
  private rawString: string;
  colors: ColorIdentityColors[];

  constructor(colors: string) {
    this.rawString = colors;
    this.colors = WUBRG_ORDER.filter((color) => {
      return colors.indexOf(color) > -1;
    });

    if (this.colors.length === 0) {
      this.colors.push("c");
    }
  }

  private isColorless(): boolean {
    return this.colors.length === 1 && this.colors[0] === "c";
  }

  size(): number {
    if (this.isColorless()) {
      return 0;
    }

    return this.colors.length;
  }

  isWithin(colors: ColorIdentityColors[]): boolean {
    if (this.isColorless()) {
      return true;
    }

    return !this.colors.find((color) => colors.indexOf(color) === -1);
  }

  is(colors: ColorIdentityColors[]): boolean {
    if (this.colors.length !== new Set(colors).size) {
      return false;
    }

    return this.isWithin(colors);
  }

  includes(colors: ColorIdentityColors[]): boolean {
    return !colors.find((color) => this.colors.indexOf(color) === -1);
  }

  toString(): string {
    return this.rawString;
  }
}
