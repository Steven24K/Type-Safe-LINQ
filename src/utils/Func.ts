export interface Func<a, b> {
    f: (_: a) => b
    then: <c>(this: Func<a, b>, g: Func<b, c>) => Func<a, c>
    repeat: (this: Func<a, a>) => Func<number, Func<a, a>>
    repeatUntil: (this: Func<a, a>) => Func<Func<a, boolean>, Func<a, a>>
}

export let Func = <a, b>(f: (_: a) => b): Func<a, b> => {
    return {
        f: f,
        then: function <c>(this: Func<a, b>, g: Func<b, c>): Func<a, c> {
            return Func<a, c>(x => g.f(this.f(x)))
        },
        repeat: function (this: Func<a, a>): Func<number, Func<a, a>> {
            return Func<number, Func<a, a>>(n => repeat(this, n))
        },
        repeatUntil: function(this: Func<a, a>): Func<Func<a, boolean>, Func<a, a>> {
            return Func<Func<a, boolean>, Func<a, a>>(p => repeatUntil(this, p))
        }
    }
}

export let Identity = <a>(): Func<a, a> => Func(x => x)


let repeat = function <a>(f: Func<a, a>, n: number): Func<a, a> {
    if (n <= 0) {
        return Identity<a>() // Return the identity function when n <= 0, basicly means do nothing
    }
    else {
        return f.then(repeat(f, n - 1)) // Else build a chain then's, pass f around and decrement n
    }
}

let repeatUntil = function<a>(f: Func<a, a>, predicate: Func<a, boolean>) : Func<a, a> {
    let g =
      (x: a) => {
        if (predicate.f(x)) {
          return Identity<a>().f(x) // If predicate is true apply the identity function to x
        }
        else {
          return f.then(repeatUntil(f, predicate)).f(x) // Else build a chain of then's pass f around and apply f to x
        }
      }
    return Func<a, a>(g)
  }