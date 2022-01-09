function normalize(num: number) {
  if (num === 0) return num;
  return num > 0 ? 1 : -1;
}

export class Range implements Iterable<number> {
  public dir = 0;

  fnDef(i: number) {
    return i + this.dir;
  };

  step(n: number) {
    const { fn = i => i, dir } = this;
    return new Range(this.from, this.to, i => fn(i) + n * dir, this.inset);
  }

  req(req = true) {
    return new Range(this.from, this.to, this.fn, req);
  }

  constructor(
    public from: number,
    public to: number,
    public fn?: (i: number) => number,
    public inset = false
  ) { this.dir = normalize(to - from); }

  public *[Symbol.iterator]() {
    const fn = this.fn ?? this.fnDef.bind(this);
    const { from, to } = this;

    if (this.inset) {
      if (this.dir > 0) {
        for (let i = from; i <= to; i = fn(i))
          yield i;
      }

      else if (this.dir < 0) {
        for (let i = from; i >= to; i = fn(i))
          yield i;
      }

      else yield from;
    }

    else {
      if (this.dir > 0) {
        for (let i = from; i < to; i = fn(i))
          yield i;
      }

      if (this.dir < 0) {
        for (let i = from; i > to; i = fn(i))
          yield i;
      }
    }
  };

  static to(to: number) {
    return new Range(0, to);
  }

  static toReq(to: number) {
    return new Range(0, to, undefined, true);
  }

  static fromTo(from: number, to: number) {
    return new Range(from, to);
  }

  static fromToReq(from: number, to: number) {
    return new Range(from, to, undefined, true);
  }

  static from(from: number) {
    return {
      to(to: number) {
        return new Range(from, to);
      },
      toReq(to: number) {
        return new Range(from, to, undefined, true);
      }
    };
  }
}