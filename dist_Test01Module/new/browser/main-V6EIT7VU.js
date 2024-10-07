var Ld = Object.defineProperty,
  jd = Object.defineProperties;
var Vd = Object.getOwnPropertyDescriptors;
var fa = Object.getOwnPropertySymbols;
var $d = Object.prototype.hasOwnProperty,
  Bd = Object.prototype.propertyIsEnumerable;
var ha = (e, t, n) =>
    t in e
      ? Ld(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  g = (e, t) => {
    for (var n in (t ||= {})) $d.call(t, n) && ha(e, n, t[n]);
    if (fa) for (var n of fa(t)) Bd.call(t, n) && ha(e, n, t[n]);
    return e;
  },
  k = (e, t) => jd(e, Vd(t));
var To = null;
var _o = 1,
  pa = Symbol("SIGNAL");
function P(e) {
  let t = To;
  return (To = e), t;
}
function ga() {
  return To;
}
var xo = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function Ud(e) {
  if (!(Po(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === _o)) {
    if (!e.producerMustRecompute(e) && !Ao(e)) {
      (e.dirty = !1), (e.lastCleanEpoch = _o);
      return;
    }
    e.producerRecomputeValue(e), (e.dirty = !1), (e.lastCleanEpoch = _o);
  }
}
function No(e) {
  return e && (e.nextProducerIndex = 0), P(e);
}
function ma(e, t) {
  if (
    (P(t),
    !(
      !e ||
      e.producerNode === void 0 ||
      e.producerIndexOfThis === void 0 ||
      e.producerLastReadVersion === void 0
    ))
  ) {
    if (Po(e))
      for (let n = e.nextProducerIndex; n < e.producerNode.length; n++)
        Oo(e.producerNode[n], e.producerIndexOfThis[n]);
    for (; e.producerNode.length > e.nextProducerIndex; )
      e.producerNode.pop(),
        e.producerLastReadVersion.pop(),
        e.producerIndexOfThis.pop();
  }
}
function Ao(e) {
  Fo(e);
  for (let t = 0; t < e.producerNode.length; t++) {
    let n = e.producerNode[t],
      r = e.producerLastReadVersion[t];
    if (r !== n.version || (Ud(n), r !== n.version)) return !0;
  }
  return !1;
}
function Ro(e) {
  if ((Fo(e), Po(e)))
    for (let t = 0; t < e.producerNode.length; t++)
      Oo(e.producerNode[t], e.producerIndexOfThis[t]);
  (e.producerNode.length =
    e.producerLastReadVersion.length =
    e.producerIndexOfThis.length =
      0),
    e.liveConsumerNode &&
      (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
}
function Oo(e, t) {
  if ((Hd(e), e.liveConsumerNode.length === 1 && zd(e)))
    for (let r = 0; r < e.producerNode.length; r++)
      Oo(e.producerNode[r], e.producerIndexOfThis[r]);
  let n = e.liveConsumerNode.length - 1;
  if (
    ((e.liveConsumerNode[t] = e.liveConsumerNode[n]),
    (e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[n]),
    e.liveConsumerNode.length--,
    e.liveConsumerIndexOfThis.length--,
    t < e.liveConsumerNode.length)
  ) {
    let r = e.liveConsumerIndexOfThis[t],
      o = e.liveConsumerNode[t];
    Fo(o), (o.producerIndexOfThis[r] = t);
  }
}
function Po(e) {
  return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
}
function Fo(e) {
  (e.producerNode ??= []),
    (e.producerIndexOfThis ??= []),
    (e.producerLastReadVersion ??= []);
}
function Hd(e) {
  (e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
}
function zd(e) {
  return e.producerNode !== void 0;
}
function Gd() {
  throw new Error();
}
var qd = Gd;
function va(e) {
  qd = e;
}
function y(e) {
  return typeof e == "function";
}
function pt(e) {
  let n = e((r) => {
    Error.call(r), (r.stack = new Error().stack);
  });
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  );
}
var Yn = pt(
  (e) =>
    function (n) {
      e(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = n);
    },
);
function Kt(e, t) {
  if (e) {
    let n = e.indexOf(t);
    0 <= n && e.splice(n, 1);
  }
}
var j = class e {
  constructor(t) {
    (this.initialTeardown = t),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let t;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: n } = this;
      if (n)
        if (((this._parentage = null), Array.isArray(n)))
          for (let i of n) i.remove(this);
        else n.remove(this);
      let { initialTeardown: r } = this;
      if (y(r))
        try {
          r();
        } catch (i) {
          t = i instanceof Yn ? i.errors : [i];
        }
      let { _finalizers: o } = this;
      if (o) {
        this._finalizers = null;
        for (let i of o)
          try {
            ya(i);
          } catch (s) {
            (t = t ?? []),
              s instanceof Yn ? (t = [...t, ...s.errors]) : t.push(s);
          }
      }
      if (t) throw new Yn(t);
    }
  }
  add(t) {
    var n;
    if (t && t !== this)
      if (this.closed) ya(t);
      else {
        if (t instanceof e) {
          if (t.closed || t._hasParent(this)) return;
          t._addParent(this);
        }
        (this._finalizers =
          (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t);
      }
  }
  _hasParent(t) {
    let { _parentage: n } = this;
    return n === t || (Array.isArray(n) && n.includes(t));
  }
  _addParent(t) {
    let { _parentage: n } = this;
    this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
  }
  _removeParent(t) {
    let { _parentage: n } = this;
    n === t ? (this._parentage = null) : Array.isArray(n) && Kt(n, t);
  }
  remove(t) {
    let { _finalizers: n } = this;
    n && Kt(n, t), t instanceof e && t._removeParent(this);
  }
};
j.EMPTY = (() => {
  let e = new j();
  return (e.closed = !0), e;
})();
var ko = j.EMPTY;
function Kn(e) {
  return (
    e instanceof j ||
    (e && "closed" in e && y(e.remove) && y(e.add) && y(e.unsubscribe))
  );
}
function ya(e) {
  y(e) ? e() : e.unsubscribe();
}
var ce = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var gt = {
  setTimeout(e, t, ...n) {
    let { delegate: r } = gt;
    return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
  },
  clearTimeout(e) {
    let { delegate: t } = gt;
    return (t?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function Jn(e) {
  gt.setTimeout(() => {
    let { onUnhandledError: t } = ce;
    if (t) t(e);
    else throw e;
  });
}
function Jt() {}
var Da = Lo("C", void 0, void 0);
function wa(e) {
  return Lo("E", void 0, e);
}
function Ca(e) {
  return Lo("N", e, void 0);
}
function Lo(e, t, n) {
  return { kind: e, value: t, error: n };
}
var Qe = null;
function mt(e) {
  if (ce.useDeprecatedSynchronousErrorHandling) {
    let t = !Qe;
    if ((t && (Qe = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: n, error: r } = Qe;
      if (((Qe = null), n)) throw r;
    }
  } else e();
}
function Ia(e) {
  ce.useDeprecatedSynchronousErrorHandling &&
    Qe &&
    ((Qe.errorThrown = !0), (Qe.error = e));
}
var Ye = class extends j {
    constructor(t) {
      super(),
        (this.isStopped = !1),
        t
          ? ((this.destination = t), Kn(t) && t.add(this))
          : (this.destination = Qd);
    }
    static create(t, n, r) {
      return new vt(t, n, r);
    }
    next(t) {
      this.isStopped ? Vo(Ca(t), this) : this._next(t);
    }
    error(t) {
      this.isStopped
        ? Vo(wa(t), this)
        : ((this.isStopped = !0), this._error(t));
    }
    complete() {
      this.isStopped ? Vo(Da, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(t) {
      this.destination.next(t);
    }
    _error(t) {
      try {
        this.destination.error(t);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  Wd = Function.prototype.bind;
function jo(e, t) {
  return Wd.call(e, t);
}
var $o = class {
    constructor(t) {
      this.partialObserver = t;
    }
    next(t) {
      let { partialObserver: n } = this;
      if (n.next)
        try {
          n.next(t);
        } catch (r) {
          Xn(r);
        }
    }
    error(t) {
      let { partialObserver: n } = this;
      if (n.error)
        try {
          n.error(t);
        } catch (r) {
          Xn(r);
        }
      else Xn(t);
    }
    complete() {
      let { partialObserver: t } = this;
      if (t.complete)
        try {
          t.complete();
        } catch (n) {
          Xn(n);
        }
    }
  },
  vt = class extends Ye {
    constructor(t, n, r) {
      super();
      let o;
      if (y(t) || !t)
        o = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
      else {
        let i;
        this && ce.useDeprecatedNextContext
          ? ((i = Object.create(t)),
            (i.unsubscribe = () => this.unsubscribe()),
            (o = {
              next: t.next && jo(t.next, i),
              error: t.error && jo(t.error, i),
              complete: t.complete && jo(t.complete, i),
            }))
          : (o = t);
      }
      this.destination = new $o(o);
    }
  };
function Xn(e) {
  ce.useDeprecatedSynchronousErrorHandling ? Ia(e) : Jn(e);
}
function Zd(e) {
  throw e;
}
function Vo(e, t) {
  let { onStoppedNotification: n } = ce;
  n && gt.setTimeout(() => n(e, t));
}
var Qd = { closed: !0, next: Jt, error: Zd, complete: Jt };
var yt = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function K(e) {
  return e;
}
function Bo(...e) {
  return Uo(e);
}
function Uo(e) {
  return e.length === 0
    ? K
    : e.length === 1
      ? e[0]
      : function (n) {
          return e.reduce((r, o) => o(r), n);
        };
}
var R = (() => {
  class e {
    constructor(n) {
      n && (this._subscribe = n);
    }
    lift(n) {
      let r = new e();
      return (r.source = this), (r.operator = n), r;
    }
    subscribe(n, r, o) {
      let i = Kd(n) ? n : new vt(n, r, o);
      return (
        mt(() => {
          let { operator: s, source: a } = this;
          i.add(
            s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i),
          );
        }),
        i
      );
    }
    _trySubscribe(n) {
      try {
        return this._subscribe(n);
      } catch (r) {
        n.error(r);
      }
    }
    forEach(n, r) {
      return (
        (r = Ea(r)),
        new r((o, i) => {
          let s = new vt({
            next: (a) => {
              try {
                n(a);
              } catch (u) {
                i(u), s.unsubscribe();
              }
            },
            error: i,
            complete: o,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(n) {
      var r;
      return (r = this.source) === null || r === void 0
        ? void 0
        : r.subscribe(n);
    }
    [yt]() {
      return this;
    }
    pipe(...n) {
      return Uo(n)(this);
    }
    toPromise(n) {
      return (
        (n = Ea(n)),
        new n((r, o) => {
          let i;
          this.subscribe(
            (s) => (i = s),
            (s) => o(s),
            () => r(i),
          );
        })
      );
    }
  }
  return (e.create = (t) => new e(t)), e;
})();
function Ea(e) {
  var t;
  return (t = e ?? ce.Promise) !== null && t !== void 0 ? t : Promise;
}
function Yd(e) {
  return e && y(e.next) && y(e.error) && y(e.complete);
}
function Kd(e) {
  return (e && e instanceof Ye) || (Yd(e) && Kn(e));
}
function Ho(e) {
  return y(e?.lift);
}
function T(e) {
  return (t) => {
    if (Ho(t))
      return t.lift(function (n) {
        try {
          return e(n, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function x(e, t, n, r, o) {
  return new zo(e, t, n, r, o);
}
var zo = class extends Ye {
  constructor(t, n, r, o, i, s) {
    super(t),
      (this.onFinalize = i),
      (this.shouldUnsubscribe = s),
      (this._next = n
        ? function (a) {
            try {
              n(a);
            } catch (u) {
              t.error(u);
            }
          }
        : super._next),
      (this._error = o
        ? function (a) {
            try {
              o(a);
            } catch (u) {
              t.error(u);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (a) {
              t.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var t;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: n } = this;
      super.unsubscribe(),
        !n && ((t = this.onFinalize) === null || t === void 0 || t.call(this));
    }
  }
};
function Dt() {
  return T((e, t) => {
    let n = null;
    e._refCount++;
    let r = x(t, void 0, void 0, void 0, () => {
      if (!e || e._refCount <= 0 || 0 < --e._refCount) {
        n = null;
        return;
      }
      let o = e._connection,
        i = n;
      (n = null), o && (!i || o === i) && o.unsubscribe(), t.unsubscribe();
    });
    e.subscribe(r), r.closed || (n = e.connect());
  });
}
var wt = class extends R {
  constructor(t, n) {
    super(),
      (this.source = t),
      (this.subjectFactory = n),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      Ho(t) && (this.lift = t.lift);
  }
  _subscribe(t) {
    return this.getSubject().subscribe(t);
  }
  getSubject() {
    let t = this._subject;
    return (
      (!t || t.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: t } = this;
    (this._subject = this._connection = null), t?.unsubscribe();
  }
  connect() {
    let t = this._connection;
    if (!t) {
      t = this._connection = new j();
      let n = this.getSubject();
      t.add(
        this.source.subscribe(
          x(
            n,
            void 0,
            () => {
              this._teardown(), n.complete();
            },
            (r) => {
              this._teardown(), n.error(r);
            },
            () => this._teardown(),
          ),
        ),
      ),
        t.closed && ((this._connection = null), (t = j.EMPTY));
    }
    return t;
  }
  refCount() {
    return Dt()(this);
  }
};
var ba = pt(
  (e) =>
    function () {
      e(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    },
);
var W = (() => {
    class e extends R {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(n) {
        let r = new er(this, this);
        return (r.operator = n), r;
      }
      _throwIfClosed() {
        if (this.closed) throw new ba();
      }
      next(n) {
        mt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        mt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = n);
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        mt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: n } = this;
            for (; n.length; ) n.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var n;
        return (
          ((n = this.observers) === null || n === void 0 ? void 0 : n.length) >
          0
        );
      }
      _trySubscribe(n) {
        return this._throwIfClosed(), super._trySubscribe(n);
      }
      _subscribe(n) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(n),
          this._innerSubscribe(n)
        );
      }
      _innerSubscribe(n) {
        let { hasError: r, isStopped: o, observers: i } = this;
        return r || o
          ? ko
          : ((this.currentObservers = null),
            i.push(n),
            new j(() => {
              (this.currentObservers = null), Kt(i, n);
            }));
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: o, isStopped: i } = this;
        r ? n.error(o) : i && n.complete();
      }
      asObservable() {
        let n = new R();
        return (n.source = this), n;
      }
    }
    return (e.create = (t, n) => new er(t, n)), e;
  })(),
  er = class extends W {
    constructor(t, n) {
      super(), (this.destination = t), (this.source = n);
    }
    next(t) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.next) ===
        null ||
        r === void 0 ||
        r.call(n, t);
    }
    error(t) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.error) ===
        null ||
        r === void 0 ||
        r.call(n, t);
    }
    complete() {
      var t, n;
      (n =
        (t = this.destination) === null || t === void 0
          ? void 0
          : t.complete) === null ||
        n === void 0 ||
        n.call(t);
    }
    _subscribe(t) {
      var n, r;
      return (r =
        (n = this.source) === null || n === void 0
          ? void 0
          : n.subscribe(t)) !== null && r !== void 0
        ? r
        : ko;
    }
  };
var z = class extends W {
  constructor(t) {
    super(), (this._value = t);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(t) {
    let n = super._subscribe(t);
    return !n.closed && t.next(this._value), n;
  }
  getValue() {
    let { hasError: t, thrownError: n, _value: r } = this;
    if (t) throw n;
    return this._throwIfClosed(), r;
  }
  next(t) {
    super.next((this._value = t));
  }
};
var J = new R((e) => e.complete());
function Sa(e) {
  return e && y(e.schedule);
}
function Ma(e) {
  return e[e.length - 1];
}
function _a(e) {
  return y(Ma(e)) ? e.pop() : void 0;
}
function Le(e) {
  return Sa(Ma(e)) ? e.pop() : void 0;
}
function xa(e, t, n, r) {
  function o(i) {
    return i instanceof n
      ? i
      : new n(function (s) {
          s(i);
        });
  }
  return new (n || (n = Promise))(function (i, s) {
    function a(l) {
      try {
        c(r.next(l));
      } catch (d) {
        s(d);
      }
    }
    function u(l) {
      try {
        c(r.throw(l));
      } catch (d) {
        s(d);
      }
    }
    function c(l) {
      l.done ? i(l.value) : o(l.value).then(a, u);
    }
    c((r = r.apply(e, t || [])).next());
  });
}
function Ta(e) {
  var t = typeof Symbol == "function" && Symbol.iterator,
    n = t && e[t],
    r = 0;
  if (n) return n.call(e);
  if (e && typeof e.length == "number")
    return {
      next: function () {
        return (
          e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }
        );
      },
    };
  throw new TypeError(
    t ? "Object is not iterable." : "Symbol.iterator is not defined.",
  );
}
function Ke(e) {
  return this instanceof Ke ? ((this.v = e), this) : new Ke(e);
}
function Na(e, t, n) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = n.apply(e, t || []),
    o,
    i = [];
  return (
    (o = Object.create(
      (typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype,
    )),
    a("next"),
    a("throw"),
    a("return", s),
    (o[Symbol.asyncIterator] = function () {
      return this;
    }),
    o
  );
  function s(f) {
    return function (m) {
      return Promise.resolve(m).then(f, d);
    };
  }
  function a(f, m) {
    r[f] &&
      ((o[f] = function (A) {
        return new Promise(function ($, L) {
          i.push([f, A, $, L]) > 1 || u(f, A);
        });
      }),
      m && (o[f] = m(o[f])));
  }
  function u(f, m) {
    try {
      c(r[f](m));
    } catch (A) {
      p(i[0][3], A);
    }
  }
  function c(f) {
    f.value instanceof Ke
      ? Promise.resolve(f.value.v).then(l, d)
      : p(i[0][2], f);
  }
  function l(f) {
    u("next", f);
  }
  function d(f) {
    u("throw", f);
  }
  function p(f, m) {
    f(m), i.shift(), i.length && u(i[0][0], i[0][1]);
  }
}
function Aa(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var t = e[Symbol.asyncIterator],
    n;
  return t
    ? t.call(e)
    : ((e = typeof Ta == "function" ? Ta(e) : e[Symbol.iterator]()),
      (n = {}),
      r("next"),
      r("throw"),
      r("return"),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n);
  function r(i) {
    n[i] =
      e[i] &&
      function (s) {
        return new Promise(function (a, u) {
          (s = e[i](s)), o(a, u, s.done, s.value);
        });
      };
  }
  function o(i, s, a, u) {
    Promise.resolve(u).then(function (c) {
      i({ value: c, done: a });
    }, s);
  }
}
var tr = (e) => e && typeof e.length == "number" && typeof e != "function";
function nr(e) {
  return y(e?.then);
}
function rr(e) {
  return y(e[yt]);
}
function or(e) {
  return Symbol.asyncIterator && y(e?.[Symbol.asyncIterator]);
}
function ir(e) {
  return new TypeError(
    `You provided ${e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
  );
}
function Jd() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var sr = Jd();
function ar(e) {
  return y(e?.[sr]);
}
function ur(e) {
  return Na(this, arguments, function* () {
    let n = e.getReader();
    try {
      for (;;) {
        let { value: r, done: o } = yield Ke(n.read());
        if (o) return yield Ke(void 0);
        yield yield Ke(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function cr(e) {
  return y(e?.getReader);
}
function H(e) {
  if (e instanceof R) return e;
  if (e != null) {
    if (rr(e)) return Xd(e);
    if (tr(e)) return ef(e);
    if (nr(e)) return tf(e);
    if (or(e)) return Ra(e);
    if (ar(e)) return nf(e);
    if (cr(e)) return rf(e);
  }
  throw ir(e);
}
function Xd(e) {
  return new R((t) => {
    let n = e[yt]();
    if (y(n.subscribe)) return n.subscribe(t);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable",
    );
  });
}
function ef(e) {
  return new R((t) => {
    for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
    t.complete();
  });
}
function tf(e) {
  return new R((t) => {
    e.then(
      (n) => {
        t.closed || (t.next(n), t.complete());
      },
      (n) => t.error(n),
    ).then(null, Jn);
  });
}
function nf(e) {
  return new R((t) => {
    for (let n of e) if ((t.next(n), t.closed)) return;
    t.complete();
  });
}
function Ra(e) {
  return new R((t) => {
    of(e, t).catch((n) => t.error(n));
  });
}
function rf(e) {
  return Ra(ur(e));
}
function of(e, t) {
  var n, r, o, i;
  return xa(this, void 0, void 0, function* () {
    try {
      for (n = Aa(e); (r = yield n.next()), !r.done; ) {
        let s = r.value;
        if ((t.next(s), t.closed)) return;
      }
    } catch (s) {
      o = { error: s };
    } finally {
      try {
        r && !r.done && (i = n.return) && (yield i.call(n));
      } finally {
        if (o) throw o.error;
      }
    }
    t.complete();
  });
}
function Y(e, t, n, r = 0, o = !1) {
  let i = t.schedule(function () {
    n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
  }, r);
  if ((e.add(i), !o)) return i;
}
function lr(e, t = 0) {
  return T((n, r) => {
    n.subscribe(
      x(
        r,
        (o) => Y(r, e, () => r.next(o), t),
        () => Y(r, e, () => r.complete(), t),
        (o) => Y(r, e, () => r.error(o), t),
      ),
    );
  });
}
function dr(e, t = 0) {
  return T((n, r) => {
    r.add(e.schedule(() => n.subscribe(r), t));
  });
}
function Oa(e, t) {
  return H(e).pipe(dr(t), lr(t));
}
function Pa(e, t) {
  return H(e).pipe(dr(t), lr(t));
}
function Fa(e, t) {
  return new R((n) => {
    let r = 0;
    return t.schedule(function () {
      r === e.length
        ? n.complete()
        : (n.next(e[r++]), n.closed || this.schedule());
    });
  });
}
function ka(e, t) {
  return new R((n) => {
    let r;
    return (
      Y(n, t, () => {
        (r = e[sr]()),
          Y(
            n,
            t,
            () => {
              let o, i;
              try {
                ({ value: o, done: i } = r.next());
              } catch (s) {
                n.error(s);
                return;
              }
              i ? n.complete() : n.next(o);
            },
            0,
            !0,
          );
      }),
      () => y(r?.return) && r.return()
    );
  });
}
function fr(e, t) {
  if (!e) throw new Error("Iterable cannot be null");
  return new R((n) => {
    Y(n, t, () => {
      let r = e[Symbol.asyncIterator]();
      Y(
        n,
        t,
        () => {
          r.next().then((o) => {
            o.done ? n.complete() : n.next(o.value);
          });
        },
        0,
        !0,
      );
    });
  });
}
function La(e, t) {
  return fr(ur(e), t);
}
function ja(e, t) {
  if (e != null) {
    if (rr(e)) return Oa(e, t);
    if (tr(e)) return Fa(e, t);
    if (nr(e)) return Pa(e, t);
    if (or(e)) return fr(e, t);
    if (ar(e)) return ka(e, t);
    if (cr(e)) return La(e, t);
  }
  throw ir(e);
}
function B(e, t) {
  return t ? ja(e, t) : H(e);
}
function w(...e) {
  let t = Le(e);
  return B(e, t);
}
function Ct(e, t) {
  let n = y(e) ? e : () => e,
    r = (o) => o.error(n());
  return new R(t ? (o) => t.schedule(r, 0, o) : r);
}
function Go(e) {
  return !!e && (e instanceof R || (y(e.lift) && y(e.subscribe)));
}
var Me = pt(
  (e) =>
    function () {
      e(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    },
);
function S(e, t) {
  return T((n, r) => {
    let o = 0;
    n.subscribe(
      x(r, (i) => {
        r.next(e.call(t, i, o++));
      }),
    );
  });
}
var { isArray: sf } = Array;
function af(e, t) {
  return sf(t) ? e(...t) : e(t);
}
function Va(e) {
  return S((t) => af(e, t));
}
var { isArray: uf } = Array,
  { getPrototypeOf: cf, prototype: lf, keys: df } = Object;
function $a(e) {
  if (e.length === 1) {
    let t = e[0];
    if (uf(t)) return { args: t, keys: null };
    if (ff(t)) {
      let n = df(t);
      return { args: n.map((r) => t[r]), keys: n };
    }
  }
  return { args: e, keys: null };
}
function ff(e) {
  return e && typeof e == "object" && cf(e) === lf;
}
function Ba(e, t) {
  return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
}
function hr(...e) {
  let t = Le(e),
    n = _a(e),
    { args: r, keys: o } = $a(e);
  if (r.length === 0) return B([], t);
  let i = new R(hf(r, t, o ? (s) => Ba(o, s) : K));
  return n ? i.pipe(Va(n)) : i;
}
function hf(e, t, n = K) {
  return (r) => {
    Ua(
      t,
      () => {
        let { length: o } = e,
          i = new Array(o),
          s = o,
          a = o;
        for (let u = 0; u < o; u++)
          Ua(
            t,
            () => {
              let c = B(e[u], t),
                l = !1;
              c.subscribe(
                x(
                  r,
                  (d) => {
                    (i[u] = d), l || ((l = !0), a--), a || r.next(n(i.slice()));
                  },
                  () => {
                    --s || r.complete();
                  },
                ),
              );
            },
            r,
          );
      },
      r,
    );
  };
}
function Ua(e, t, n) {
  e ? Y(n, e, t) : t();
}
function Ha(e, t, n, r, o, i, s, a) {
  let u = [],
    c = 0,
    l = 0,
    d = !1,
    p = () => {
      d && !u.length && !c && t.complete();
    },
    f = (A) => (c < r ? m(A) : u.push(A)),
    m = (A) => {
      i && t.next(A), c++;
      let $ = !1;
      H(n(A, l++)).subscribe(
        x(
          t,
          (L) => {
            o?.(L), i ? f(L) : t.next(L);
          },
          () => {
            $ = !0;
          },
          void 0,
          () => {
            if ($)
              try {
                for (c--; u.length && c < r; ) {
                  let L = u.shift();
                  s ? Y(t, s, () => m(L)) : m(L);
                }
                p();
              } catch (L) {
                t.error(L);
              }
          },
        ),
      );
    };
  return (
    e.subscribe(
      x(t, f, () => {
        (d = !0), p();
      }),
    ),
    () => {
      a?.();
    }
  );
}
function U(e, t, n = 1 / 0) {
  return y(t)
    ? U((r, o) => S((i, s) => t(r, i, o, s))(H(e(r, o))), n)
    : (typeof t == "number" && (n = t), T((r, o) => Ha(r, o, e, n)));
}
function qo(e = 1 / 0) {
  return U(K, e);
}
function za() {
  return qo(1);
}
function It(...e) {
  return za()(B(e, Le(e)));
}
function pr(e) {
  return new R((t) => {
    H(e()).subscribe(t);
  });
}
function le(e, t) {
  return T((n, r) => {
    let o = 0;
    n.subscribe(x(r, (i) => e.call(t, i, o++) && r.next(i)));
  });
}
function je(e) {
  return T((t, n) => {
    let r = null,
      o = !1,
      i;
    (r = t.subscribe(
      x(n, void 0, void 0, (s) => {
        (i = H(e(s, je(e)(t)))),
          r ? (r.unsubscribe(), (r = null), i.subscribe(n)) : (o = !0);
      }),
    )),
      o && (r.unsubscribe(), (r = null), i.subscribe(n));
  });
}
function Ga(e, t, n, r, o) {
  return (i, s) => {
    let a = n,
      u = t,
      c = 0;
    i.subscribe(
      x(
        s,
        (l) => {
          let d = c++;
          (u = a ? e(u, l, d) : ((a = !0), l)), r && s.next(u);
        },
        o &&
          (() => {
            a && s.next(u), s.complete();
          }),
      ),
    );
  };
}
function Et(e, t) {
  return y(t) ? U(e, t, 1) : U(e, 1);
}
function Ve(e) {
  return T((t, n) => {
    let r = !1;
    t.subscribe(
      x(
        n,
        (o) => {
          (r = !0), n.next(o);
        },
        () => {
          r || n.next(e), n.complete();
        },
      ),
    );
  });
}
function _e(e) {
  return e <= 0
    ? () => J
    : T((t, n) => {
        let r = 0;
        t.subscribe(
          x(n, (o) => {
            ++r <= e && (n.next(o), e <= r && n.complete());
          }),
        );
      });
}
function Wo(e) {
  return S(() => e);
}
function gr(e = pf) {
  return T((t, n) => {
    let r = !1;
    t.subscribe(
      x(
        n,
        (o) => {
          (r = !0), n.next(o);
        },
        () => (r ? n.complete() : n.error(e())),
      ),
    );
  });
}
function pf() {
  return new Me();
}
function Xt(e) {
  return T((t, n) => {
    try {
      t.subscribe(n);
    } finally {
      n.add(e);
    }
  });
}
function De(e, t) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      e ? le((o, i) => e(o, i, r)) : K,
      _e(1),
      n ? Ve(t) : gr(() => new Me()),
    );
}
function bt(e) {
  return e <= 0
    ? () => J
    : T((t, n) => {
        let r = [];
        t.subscribe(
          x(
            n,
            (o) => {
              r.push(o), e < r.length && r.shift();
            },
            () => {
              for (let o of r) n.next(o);
              n.complete();
            },
            void 0,
            () => {
              r = null;
            },
          ),
        );
      });
}
function Zo(e, t) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      e ? le((o, i) => e(o, i, r)) : K,
      bt(1),
      n ? Ve(t) : gr(() => new Me()),
    );
}
function Qo(e, t) {
  return T(Ga(e, t, arguments.length >= 2, !0));
}
function Yo(...e) {
  let t = Le(e);
  return T((n, r) => {
    (t ? It(e, n, t) : It(e, n)).subscribe(r);
  });
}
function de(e, t) {
  return T((n, r) => {
    let o = null,
      i = 0,
      s = !1,
      a = () => s && !o && r.complete();
    n.subscribe(
      x(
        r,
        (u) => {
          o?.unsubscribe();
          let c = 0,
            l = i++;
          H(e(u, l)).subscribe(
            (o = x(
              r,
              (d) => r.next(t ? t(u, d, l, c++) : d),
              () => {
                (o = null), a();
              },
            )),
          );
        },
        () => {
          (s = !0), a();
        },
      ),
    );
  });
}
function Ko(e) {
  return T((t, n) => {
    H(e).subscribe(x(n, () => n.complete(), Jt)), !n.closed && t.subscribe(n);
  });
}
function G(e, t, n) {
  let r = y(e) || t || n ? { next: e, error: t, complete: n } : e;
  return r
    ? T((o, i) => {
        var s;
        (s = r.subscribe) === null || s === void 0 || s.call(r);
        let a = !0;
        o.subscribe(
          x(
            i,
            (u) => {
              var c;
              (c = r.next) === null || c === void 0 || c.call(r, u), i.next(u);
            },
            () => {
              var u;
              (a = !1),
                (u = r.complete) === null || u === void 0 || u.call(r),
                i.complete();
            },
            (u) => {
              var c;
              (a = !1),
                (c = r.error) === null || c === void 0 || c.call(r, u),
                i.error(u);
            },
            () => {
              var u, c;
              a && ((u = r.unsubscribe) === null || u === void 0 || u.call(r)),
                (c = r.finalize) === null || c === void 0 || c.call(r);
            },
          ),
        );
      })
    : K;
}
var v = class extends Error {
  constructor(t, n) {
    super(ji(t, n)), (this.code = t);
  }
};
function ji(e, t) {
  return `${`NG0${Math.abs(e)}`}${t ? ": " + t : ""}`;
}
function $r(e) {
  return { toString: e }.toString();
}
function F(e) {
  for (let t in e) if (e[t] === F) return t;
  throw Error("Could not find renamed property on target object.");
}
function X(e) {
  if (typeof e == "string") return e;
  if (Array.isArray(e)) return "[" + e.map(X).join(", ") + "]";
  if (e == null) return "" + e;
  if (e.overriddenName) return `${e.overriddenName}`;
  if (e.name) return `${e.name}`;
  let t = e.toString();
  if (t == null) return "" + t;
  let n = t.indexOf(`
`);
  return n === -1 ? t : t.substring(0, n);
}
function qa(e, t) {
  return e == null || e === ""
    ? t === null
      ? ""
      : t
    : t == null || t === ""
      ? e
      : e + " " + t;
}
var gf = F({ __forward_ref__: F });
function _u(e) {
  return (
    (e.__forward_ref__ = _u),
    (e.toString = function () {
      return X(this());
    }),
    e
  );
}
function re(e) {
  return Tu(e) ? e() : e;
}
function Tu(e) {
  return (
    typeof e == "function" && e.hasOwnProperty(gf) && e.__forward_ref__ === _u
  );
}
function D(e) {
  return {
    token: e.token,
    providedIn: e.providedIn || null,
    factory: e.factory,
    value: void 0,
  };
}
function hn(e) {
  return { providers: e.providers || [], imports: e.imports || [] };
}
function Br(e) {
  return Wa(e, Nu) || Wa(e, Au);
}
function xu(e) {
  return Br(e) !== null;
}
function Wa(e, t) {
  return e.hasOwnProperty(t) ? e[t] : null;
}
function mf(e) {
  let t = e && (e[Nu] || e[Au]);
  return t || null;
}
function Za(e) {
  return e && (e.hasOwnProperty(Qa) || e.hasOwnProperty(vf)) ? e[Qa] : null;
}
var Nu = F({ ɵprov: F }),
  Qa = F({ ɵinj: F }),
  Au = F({ ngInjectableDef: F }),
  vf = F({ ngInjectorDef: F }),
  E = class {
    constructor(t, n) {
      (this._desc = t),
        (this.ngMetadataName = "InjectionToken"),
        (this.ɵprov = void 0),
        typeof n == "number"
          ? (this.__NG_ELEMENT_ID__ = n)
          : n !== void 0 &&
            (this.ɵprov = D({
              token: this,
              providedIn: n.providedIn || "root",
              factory: n.factory,
            }));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function Ru(e) {
  return e && !!e.ɵproviders;
}
var yf = F({ ɵcmp: F }),
  Df = F({ ɵdir: F }),
  wf = F({ ɵpipe: F }),
  Cf = F({ ɵmod: F }),
  Ir = F({ ɵfac: F }),
  nn = F({ __NG_ELEMENT_ID__: F }),
  Ya = F({ __NG_ENV_ID__: F });
function If(e) {
  return typeof e == "string" ? e : e == null ? "" : String(e);
}
function Ef(e) {
  return typeof e == "function"
    ? e.name || e.toString()
    : typeof e == "object" && e != null && typeof e.type == "function"
      ? e.type.name || e.type.toString()
      : If(e);
}
function bf(e, t) {
  let n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
  throw new v(-200, e);
}
function Vi(e, t) {
  throw new v(-201, !1);
}
var b = (function (e) {
    return (
      (e[(e.Default = 0)] = "Default"),
      (e[(e.Host = 1)] = "Host"),
      (e[(e.Self = 2)] = "Self"),
      (e[(e.SkipSelf = 4)] = "SkipSelf"),
      (e[(e.Optional = 8)] = "Optional"),
      e
    );
  })(b || {}),
  si;
function Ou() {
  return si;
}
function ne(e) {
  let t = si;
  return (si = e), t;
}
function Pu(e, t, n) {
  let r = Br(e);
  if (r && r.providedIn == "root")
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & b.Optional) return null;
  if (t !== void 0) return t;
  Vi(e, "Injector");
}
var Sf = {},
  rn = Sf,
  Mf = "__NG_DI_FLAG__",
  Er = "ngTempTokenPath",
  _f = "ngTokenPath",
  Tf = /\n/gm,
  xf = "\u0275",
  Ka = "__source",
  Tt;
function Nf() {
  return Tt;
}
function $e(e) {
  let t = Tt;
  return (Tt = e), t;
}
function Af(e, t = b.Default) {
  if (Tt === void 0) throw new v(-203, !1);
  return Tt === null
    ? Pu(e, void 0, t)
    : Tt.get(e, t & b.Optional ? null : void 0, t);
}
function _(e, t = b.Default) {
  return (Ou() || Af)(re(e), t);
}
function h(e, t = b.Default) {
  return _(e, Ur(t));
}
function Ur(e) {
  return typeof e > "u" || typeof e == "number"
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function ai(e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let r = re(e[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new v(900, !1);
      let o,
        i = b.Default;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          u = Rf(a);
        typeof u == "number" ? (u === -1 ? (o = a.token) : (i |= u)) : (o = a);
      }
      t.push(_(o, i));
    } else t.push(_(r));
  }
  return t;
}
function Rf(e) {
  return e[Mf];
}
function Of(e, t, n, r) {
  let o = e[Er];
  throw (
    (t[Ka] && o.unshift(t[Ka]),
    (e.message = Pf(
      `
` + e.message,
      o,
      n,
      r,
    )),
    (e[_f] = o),
    (e[Er] = null),
    e)
  );
}
function Pf(e, t, n, r = null) {
  e =
    e &&
    e.charAt(0) ===
      `
` &&
    e.charAt(1) == xf
      ? e.slice(2)
      : e;
  let o = X(t);
  if (Array.isArray(t)) o = t.map(X).join(" -> ");
  else if (typeof t == "object") {
    let i = [];
    for (let s in t)
      if (t.hasOwnProperty(s)) {
        let a = t[s];
        i.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : X(a)));
      }
    o = `{${i.join(", ")}}`;
  }
  return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
    Tf,
    `
  `,
  )}`;
}
function Nt(e, t) {
  let n = e.hasOwnProperty(Ir);
  return n ? e[Ir] : null;
}
function $i(e, t) {
  e.forEach((n) => (Array.isArray(n) ? $i(n, t) : t(n)));
}
function Fu(e, t, n) {
  t >= e.length ? e.push(n) : e.splice(t, 0, n);
}
function br(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
var on = {},
  we = [],
  At = new E(""),
  ku = new E("", -1),
  Lu = new E(""),
  Sr = class {
    get(t, n = rn) {
      if (n === rn) {
        let r = new Error(`NullInjectorError: No provider for ${X(t)}!`);
        throw ((r.name = "NullInjectorError"), r);
      }
      return n;
    }
  },
  ju = (function (e) {
    return (e[(e.OnPush = 0)] = "OnPush"), (e[(e.Default = 1)] = "Default"), e;
  })(ju || {}),
  Ie = (function (e) {
    return (
      (e[(e.Emulated = 0)] = "Emulated"),
      (e[(e.None = 2)] = "None"),
      (e[(e.ShadowDom = 3)] = "ShadowDom"),
      e
    );
  })(Ie || {}),
  He = (function (e) {
    return (
      (e[(e.None = 0)] = "None"),
      (e[(e.SignalBased = 1)] = "SignalBased"),
      (e[(e.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
      e
    );
  })(He || {});
function Ff(e, t, n) {
  let r = e.length;
  for (;;) {
    let o = e.indexOf(t, n);
    if (o === -1) return o;
    if (o === 0 || e.charCodeAt(o - 1) <= 32) {
      let i = t.length;
      if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
    }
    n = o + 1;
  }
}
function ui(e, t, n) {
  let r = 0;
  for (; r < n.length; ) {
    let o = n[r];
    if (typeof o == "number") {
      if (o !== 0) break;
      r++;
      let i = n[r++],
        s = n[r++],
        a = n[r++];
      e.setAttribute(t, s, a, i);
    } else {
      let i = o,
        s = n[++r];
      Lf(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
    }
  }
  return r;
}
function kf(e) {
  return e === 3 || e === 4 || e === 6;
}
function Lf(e) {
  return e.charCodeAt(0) === 64;
}
function Bi(e, t) {
  if (!(t === null || t.length === 0))
    if (e === null || e.length === 0) e = t.slice();
    else {
      let n = -1;
      for (let r = 0; r < t.length; r++) {
        let o = t[r];
        typeof o == "number"
          ? (n = o)
          : n === 0 ||
            (n === -1 || n === 2
              ? Ja(e, n, o, null, t[++r])
              : Ja(e, n, o, null, null));
      }
    }
  return e;
}
function Ja(e, t, n, r, o) {
  let i = 0,
    s = e.length;
  if (t === -1) s = -1;
  else
    for (; i < e.length; ) {
      let a = e[i++];
      if (typeof a == "number") {
        if (a === t) {
          s = -1;
          break;
        } else if (a > t) {
          s = i - 1;
          break;
        }
      }
    }
  for (; i < e.length; ) {
    let a = e[i];
    if (typeof a == "number") break;
    if (a === n) {
      if (r === null) {
        o !== null && (e[i + 1] = o);
        return;
      } else if (r === e[i + 1]) {
        e[i + 2] = o;
        return;
      }
    }
    i++, r !== null && i++, o !== null && i++;
  }
  s !== -1 && (e.splice(s, 0, t), (i = s + 1)),
    e.splice(i++, 0, n),
    r !== null && e.splice(i++, 0, r),
    o !== null && e.splice(i++, 0, o);
}
var Vu = "ng-template";
function jf(e, t, n, r) {
  let o = 0;
  if (r) {
    for (; o < t.length && typeof t[o] == "string"; o += 2)
      if (t[o] === "class" && Ff(t[o + 1].toLowerCase(), n, 0) !== -1)
        return !0;
  } else if (Ui(e)) return !1;
  if (((o = t.indexOf(1, o)), o > -1)) {
    let i;
    for (; ++o < t.length && typeof (i = t[o]) == "string"; )
      if (i.toLowerCase() === n) return !0;
  }
  return !1;
}
function Ui(e) {
  return e.type === 4 && e.value !== Vu;
}
function Vf(e, t, n) {
  let r = e.type === 4 && !n ? Vu : e.value;
  return t === r;
}
function $f(e, t, n) {
  let r = 4,
    o = e.attrs,
    i = o !== null ? Hf(o) : 0,
    s = !1;
  for (let a = 0; a < t.length; a++) {
    let u = t[a];
    if (typeof u == "number") {
      if (!s && !fe(r) && !fe(u)) return !1;
      if (s && fe(u)) continue;
      (s = !1), (r = u | (r & 1));
      continue;
    }
    if (!s)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (u !== "" && !Vf(e, u, n)) || (u === "" && t.length === 1))
        ) {
          if (fe(r)) return !1;
          s = !0;
        }
      } else if (r & 8) {
        if (o === null || !jf(e, o, u, n)) {
          if (fe(r)) return !1;
          s = !0;
        }
      } else {
        let c = t[++a],
          l = Bf(u, o, Ui(e), n);
        if (l === -1) {
          if (fe(r)) return !1;
          s = !0;
          continue;
        }
        if (c !== "") {
          let d;
          if (
            (l > i ? (d = "") : (d = o[l + 1].toLowerCase()), r & 2 && c !== d)
          ) {
            if (fe(r)) return !1;
            s = !0;
          }
        }
      }
  }
  return fe(r) || s;
}
function fe(e) {
  return (e & 1) === 0;
}
function Bf(e, t, n, r) {
  if (t === null) return -1;
  let o = 0;
  if (r || !n) {
    let i = !1;
    for (; o < t.length; ) {
      let s = t[o];
      if (s === e) return o;
      if (s === 3 || s === 6) i = !0;
      else if (s === 1 || s === 2) {
        let a = t[++o];
        for (; typeof a == "string"; ) a = t[++o];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          o += 4;
          continue;
        }
      }
      o += i ? 1 : 2;
    }
    return -1;
  } else return zf(t, e);
}
function Uf(e, t, n = !1) {
  for (let r = 0; r < t.length; r++) if ($f(e, t[r], n)) return !0;
  return !1;
}
function Hf(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t];
    if (kf(n)) return t;
  }
  return e.length;
}
function zf(e, t) {
  let n = e.indexOf(4);
  if (n > -1)
    for (n++; n < e.length; ) {
      let r = e[n];
      if (typeof r == "number") return -1;
      if (r === t) return n;
      n++;
    }
  return -1;
}
function Xa(e, t) {
  return e ? ":not(" + t.trim() + ")" : t;
}
function Gf(e) {
  let t = e[0],
    n = 1,
    r = 2,
    o = "",
    i = !1;
  for (; n < e.length; ) {
    let s = e[n];
    if (typeof s == "string")
      if (r & 2) {
        let a = e[++n];
        o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else r & 8 ? (o += "." + s) : r & 4 && (o += " " + s);
    else
      o !== "" && !fe(s) && ((t += Xa(i, o)), (o = "")),
        (r = s),
        (i = i || !fe(r));
    n++;
  }
  return o !== "" && (t += Xa(i, o)), t;
}
function qf(e) {
  return e.map(Gf).join(",");
}
function Wf(e) {
  let t = [],
    n = [],
    r = 1,
    o = 2;
  for (; r < e.length; ) {
    let i = e[r];
    if (typeof i == "string")
      o === 2 ? i !== "" && t.push(i, e[++r]) : o === 8 && n.push(i);
    else {
      if (!fe(o)) break;
      o = i;
    }
    r++;
  }
  return { attrs: t, classes: n };
}
function pn(e) {
  return $r(() => {
    let t = zu(e),
      n = k(g({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === ju.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || Ie.Emulated,
        styles: e.styles || we,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: "",
      });
    Gu(n);
    let r = e.dependencies;
    return (
      (n.directiveDefs = tu(r, !1)), (n.pipeDefs = tu(r, !0)), (n.id = Yf(n)), n
    );
  });
}
function Zf(e) {
  return et(e) || $u(e);
}
function Qf(e) {
  return e !== null;
}
function gn(e) {
  return $r(() => ({
    type: e.type,
    bootstrap: e.bootstrap || we,
    declarations: e.declarations || we,
    imports: e.imports || we,
    exports: e.exports || we,
    transitiveCompileScopes: null,
    schemas: e.schemas || null,
    id: e.id || null,
  }));
}
function eu(e, t) {
  if (e == null) return on;
  let n = {};
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let o = e[r],
        i,
        s,
        a = He.None;
      Array.isArray(o)
        ? ((a = o[0]), (i = o[1]), (s = o[2] ?? i))
        : ((i = o), (s = o)),
        t ? ((n[i] = a !== He.None ? [r, a] : r), (t[i] = s)) : (n[i] = r);
    }
  return n;
}
function Hi(e) {
  return $r(() => {
    let t = zu(e);
    return Gu(t), t;
  });
}
function et(e) {
  return e[yf] || null;
}
function $u(e) {
  return e[Df] || null;
}
function Bu(e) {
  return e[wf] || null;
}
function Uu(e) {
  let t = et(e) || $u(e) || Bu(e);
  return t !== null ? t.standalone : !1;
}
function Hu(e, t) {
  let n = e[Cf] || null;
  if (!n && t === !0)
    throw new Error(`Type ${X(e)} does not have '\u0275mod' property.`);
  return n;
}
function zu(e) {
  let t = {};
  return {
    type: e.type,
    providersResolver: null,
    factory: null,
    hostBindings: e.hostBindings || null,
    hostVars: e.hostVars || 0,
    hostAttrs: e.hostAttrs || null,
    contentQueries: e.contentQueries || null,
    declaredInputs: t,
    inputTransforms: null,
    inputConfig: e.inputs || on,
    exportAs: e.exportAs || null,
    standalone: e.standalone === !0,
    signals: e.signals === !0,
    selectors: e.selectors || we,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: eu(e.inputs, t),
    outputs: eu(e.outputs),
    debugInfo: null,
  };
}
function Gu(e) {
  e.features?.forEach((t) => t(e));
}
function tu(e, t) {
  if (!e) return null;
  let n = t ? Bu : Zf;
  return () => (typeof e == "function" ? e() : e).map((r) => n(r)).filter(Qf);
}
function Yf(e) {
  let t = 0,
    n = [
      e.selectors,
      e.ngContentSelectors,
      e.hostVars,
      e.hostAttrs,
      e.consts,
      e.vars,
      e.decls,
      e.encapsulation,
      e.standalone,
      e.signals,
      e.exportAs,
      JSON.stringify(e.inputs),
      JSON.stringify(e.outputs),
      Object.getOwnPropertyNames(e.type.prototype),
      !!e.contentQueries,
      !!e.viewQuery,
    ].join("|");
  for (let o of n) t = (Math.imul(31, t) + o.charCodeAt(0)) << 0;
  return (t += 2147483648), "c" + t;
}
function Hr(e) {
  return { ɵproviders: e };
}
function Kf(...e) {
  return { ɵproviders: qu(!0, e), ɵfromNgModule: !0 };
}
function qu(e, ...t) {
  let n = [],
    r = new Set(),
    o,
    i = (s) => {
      n.push(s);
    };
  return (
    $i(t, (s) => {
      let a = s;
      ci(a, i, [], r) && ((o ||= []), o.push(a));
    }),
    o !== void 0 && Wu(o, i),
    n
  );
}
function Wu(e, t) {
  for (let n = 0; n < e.length; n++) {
    let { ngModule: r, providers: o } = e[n];
    zi(o, (i) => {
      t(i, r);
    });
  }
}
function ci(e, t, n, r) {
  if (((e = re(e)), !e)) return !1;
  let o = null,
    i = Za(e),
    s = !i && et(e);
  if (!i && !s) {
    let u = e.ngModule;
    if (((i = Za(u)), i)) o = u;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    o = e;
  }
  let a = r.has(o);
  if (s) {
    if (a) return !1;
    if ((r.add(o), s.dependencies)) {
      let u =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let c of u) ci(c, t, n, r);
    }
  } else if (i) {
    if (i.imports != null && !a) {
      r.add(o);
      let c;
      try {
        $i(i.imports, (l) => {
          ci(l, t, n, r) && ((c ||= []), c.push(l));
        });
      } finally {
      }
      c !== void 0 && Wu(c, t);
    }
    if (!a) {
      let c = Nt(o) || (() => new o());
      t({ provide: o, useFactory: c, deps: we }, o),
        t({ provide: Lu, useValue: o, multi: !0 }, o),
        t({ provide: At, useValue: () => _(o), multi: !0 }, o);
    }
    let u = i.providers;
    if (u != null && !a) {
      let c = e;
      zi(u, (l) => {
        t(l, c);
      });
    }
  } else return !1;
  return o !== e && e.providers !== void 0;
}
function zi(e, t) {
  for (let n of e)
    Ru(n) && (n = n.ɵproviders), Array.isArray(n) ? zi(n, t) : t(n);
}
var Jf = F({ provide: String, useValue: F });
function Zu(e) {
  return e !== null && typeof e == "object" && Jf in e;
}
function Xf(e) {
  return !!(e && e.useExisting);
}
function eh(e) {
  return !!(e && e.useFactory);
}
function li(e) {
  return typeof e == "function";
}
var zr = new E(""),
  vr = {},
  th = {},
  Jo;
function Gi() {
  return Jo === void 0 && (Jo = new Sr()), Jo;
}
var se = class {},
  sn = class extends se {
    get destroyed() {
      return this._destroyed;
    }
    constructor(t, n, r, o) {
      super(),
        (this.parent = n),
        (this.source = r),
        (this.scopes = o),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        fi(t, (s) => this.processProvider(s)),
        this.records.set(ku, St(void 0, this)),
        o.has("environment") && this.records.set(se, St(void 0, this));
      let i = this.records.get(zr);
      i != null && typeof i.value == "string" && this.scopes.add(i.value),
        (this.injectorDefTypes = new Set(this.get(Lu, we, b.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      let t = P(null);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let n = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of n) r();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          P(t);
      }
    }
    onDestroy(t) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(t),
        () => this.removeOnDestroy(t)
      );
    }
    runInContext(t) {
      this.assertNotDestroyed();
      let n = $e(this),
        r = ne(void 0),
        o;
      try {
        return t();
      } finally {
        $e(n), ne(r);
      }
    }
    get(t, n = rn, r = b.Default) {
      if ((this.assertNotDestroyed(), t.hasOwnProperty(Ya))) return t[Ya](this);
      r = Ur(r);
      let o,
        i = $e(this),
        s = ne(void 0);
      try {
        if (!(r & b.SkipSelf)) {
          let u = this.records.get(t);
          if (u === void 0) {
            let c = ah(t) && Br(t);
            c && this.injectableDefInScope(c)
              ? (u = St(di(t), vr))
              : (u = null),
              this.records.set(t, u);
          }
          if (u != null) return this.hydrate(t, u);
        }
        let a = r & b.Self ? Gi() : this.parent;
        return (n = r & b.Optional && n === rn ? null : n), a.get(t, n);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[Er] = a[Er] || []).unshift(X(t)), i)) throw a;
          return Of(a, t, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        ne(s), $e(i);
      }
    }
    resolveInjectorInitializers() {
      let t = P(null),
        n = $e(this),
        r = ne(void 0),
        o;
      try {
        let i = this.get(At, we, b.Self);
        for (let s of i) s();
      } finally {
        $e(n), ne(r), P(t);
      }
    }
    toString() {
      let t = [],
        n = this.records;
      for (let r of n.keys()) t.push(X(r));
      return `R3Injector[${t.join(", ")}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new v(205, !1);
    }
    processProvider(t) {
      t = re(t);
      let n = li(t) ? t : re(t && t.provide),
        r = rh(t);
      if (!li(t) && t.multi === !0) {
        let o = this.records.get(n);
        o ||
          ((o = St(void 0, vr, !0)),
          (o.factory = () => ai(o.multi)),
          this.records.set(n, o)),
          (n = t),
          o.multi.push(t);
      }
      this.records.set(n, r);
    }
    hydrate(t, n) {
      let r = P(null);
      try {
        return (
          n.value === vr && ((n.value = th), (n.value = n.factory())),
          typeof n.value == "object" &&
            n.value &&
            sh(n.value) &&
            this._ngOnDestroyHooks.add(n.value),
          n.value
        );
      } finally {
        P(r);
      }
    }
    injectableDefInScope(t) {
      if (!t.providedIn) return !1;
      let n = re(t.providedIn);
      return typeof n == "string"
        ? n === "any" || this.scopes.has(n)
        : this.injectorDefTypes.has(n);
    }
    removeOnDestroy(t) {
      let n = this._onDestroyHooks.indexOf(t);
      n !== -1 && this._onDestroyHooks.splice(n, 1);
    }
  };
function di(e) {
  let t = Br(e),
    n = t !== null ? t.factory : Nt(e);
  if (n !== null) return n;
  if (e instanceof E) throw new v(204, !1);
  if (e instanceof Function) return nh(e);
  throw new v(204, !1);
}
function nh(e) {
  if (e.length > 0) throw new v(204, !1);
  let n = mf(e);
  return n !== null ? () => n.factory(e) : () => new e();
}
function rh(e) {
  if (Zu(e)) return St(void 0, e.useValue);
  {
    let t = oh(e);
    return St(t, vr);
  }
}
function oh(e, t, n) {
  let r;
  if (li(e)) {
    let o = re(e);
    return Nt(o) || di(o);
  } else if (Zu(e)) r = () => re(e.useValue);
  else if (eh(e)) r = () => e.useFactory(...ai(e.deps || []));
  else if (Xf(e)) r = () => _(re(e.useExisting));
  else {
    let o = re(e && (e.useClass || e.provide));
    if (ih(e)) r = () => new o(...ai(e.deps));
    else return Nt(o) || di(o);
  }
  return r;
}
function St(e, t, n = !1) {
  return { factory: e, value: t, multi: n ? [] : void 0 };
}
function ih(e) {
  return !!e.deps;
}
function sh(e) {
  return (
    e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
  );
}
function ah(e) {
  return typeof e == "function" || (typeof e == "object" && e instanceof E);
}
function fi(e, t) {
  for (let n of e)
    Array.isArray(n) ? fi(n, t) : n && Ru(n) ? fi(n.ɵproviders, t) : t(n);
}
function Ne(e, t) {
  e instanceof sn && e.assertNotDestroyed();
  let n,
    r = $e(e),
    o = ne(void 0);
  try {
    return t();
  } finally {
    $e(r), ne(o);
  }
}
function uh() {
  return Ou() !== void 0 || Nf() != null;
}
function ch(e) {
  return typeof e == "function";
}
var Ae = 0,
  M = 1,
  C = 2,
  Q = 3,
  he = 4,
  ge = 5,
  Mr = 6,
  nu = 7,
  ze = 8,
  Rt = 9,
  Te = 10,
  Ee = 11,
  an = 12,
  ru = 13,
  mn = 14,
  be = 15,
  un = 16,
  Mt = 17,
  Gr = 18,
  qr = 19,
  Qu = 20,
  Ue = 21,
  Xo = 22,
  oe = 23,
  tt = 25,
  Yu = 1;
var nt = 7,
  _r = 8,
  Tr = 9,
  ie = 10,
  xr = (function (e) {
    return (
      (e[(e.None = 0)] = "None"),
      (e[(e.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      e
    );
  })(xr || {});
function Je(e) {
  return Array.isArray(e) && typeof e[Yu] == "object";
}
function Re(e) {
  return Array.isArray(e) && e[Yu] === !0;
}
function Ku(e) {
  return (e.flags & 4) !== 0;
}
function qi(e) {
  return e.componentOffset > -1;
}
function lh(e) {
  return (e.flags & 1) === 1;
}
function vn(e) {
  return !!e.template;
}
function hi(e) {
  return (e[C] & 512) !== 0;
}
var pi = class {
  constructor(t, n, r) {
    (this.previousValue = t), (this.currentValue = n), (this.firstChange = r);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function Ju(e, t, n, r) {
  t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r);
}
function Wr() {
  return Xu;
}
function Xu(e) {
  return e.type.prototype.ngOnChanges && (e.setInput = fh), dh;
}
Wr.ngInherit = !0;
function dh() {
  let e = tc(this),
    t = e?.current;
  if (t) {
    let n = e.previous;
    if (n === on) e.previous = t;
    else for (let r in t) n[r] = t[r];
    (e.current = null), this.ngOnChanges(t);
  }
}
function fh(e, t, n, r, o) {
  let i = this.declaredInputs[r],
    s = tc(e) || hh(e, { previous: on, current: null }),
    a = s.current || (s.current = {}),
    u = s.previous,
    c = u[i];
  (a[i] = new pi(c && c.currentValue, n, u === on)), Ju(e, t, o, n);
}
var ec = "__ngSimpleChanges__";
function tc(e) {
  return e[ec] || null;
}
function hh(e, t) {
  return (e[ec] = t);
}
var ou = null;
var Be = function (e, t, n) {
    ou?.(e, t, n);
  },
  ph = "svg",
  gh = "math";
function Ge(e) {
  for (; Array.isArray(e); ) e = e[Ae];
  return e;
}
function Oe(e, t) {
  return Ge(t[e.index]);
}
function mh(e, t) {
  return e.data[t];
}
function yn(e, t) {
  let n = t[e];
  return Je(n) ? n : n[Ae];
}
function Wi(e) {
  return (e[C] & 128) === 128;
}
function vh(e) {
  return Re(e[Q]);
}
function iu(e, t) {
  return t == null ? null : e[t];
}
function nc(e) {
  e[Mt] = 0;
}
function rc(e) {
  e[C] & 1024 || ((e[C] |= 1024), Wi(e) && Qr(e));
}
function Zr(e) {
  return !!(e[C] & 9216 || e[oe]?.dirty);
}
function gi(e) {
  e[Te].changeDetectionScheduler?.notify(8),
    e[C] & 64 && (e[C] |= 1024),
    Zr(e) && Qr(e);
}
function Qr(e) {
  e[Te].changeDetectionScheduler?.notify(0);
  let t = rt(e);
  for (; t !== null && !(t[C] & 8192 || ((t[C] |= 8192), !Wi(t))); ) t = rt(t);
}
function oc(e, t) {
  if ((e[C] & 256) === 256) throw new v(911, !1);
  e[Ue] === null && (e[Ue] = []), e[Ue].push(t);
}
function yh(e, t) {
  if (e[Ue] === null) return;
  let n = e[Ue].indexOf(t);
  n !== -1 && e[Ue].splice(n, 1);
}
function rt(e) {
  let t = e[Q];
  return Re(t) ? t[Q] : t;
}
var O = { lFrame: hc(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
var ic = !1;
function Dh() {
  return O.lFrame.elementDepthCount;
}
function wh() {
  O.lFrame.elementDepthCount++;
}
function Ch() {
  O.lFrame.elementDepthCount--;
}
function sc() {
  return O.bindingsEnabled;
}
function Ih() {
  return O.skipHydrationRootTNode !== null;
}
function Eh(e) {
  return O.skipHydrationRootTNode === e;
}
function bh() {
  O.skipHydrationRootTNode = null;
}
function pe() {
  return O.lFrame.lView;
}
function Zi() {
  return O.lFrame.tView;
}
function Pe() {
  let e = ac();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function ac() {
  return O.lFrame.currentTNode;
}
function Sh() {
  let e = O.lFrame,
    t = e.currentTNode;
  return e.isParent ? t : t.parent;
}
function Yr(e, t) {
  let n = O.lFrame;
  (n.currentTNode = e), (n.isParent = t);
}
function uc() {
  return O.lFrame.isParent;
}
function Mh() {
  O.lFrame.isParent = !1;
}
function cc() {
  return ic;
}
function su(e) {
  ic = e;
}
function _h(e) {
  return (O.lFrame.bindingIndex = e);
}
function Th() {
  return O.lFrame.inI18n;
}
function xh(e, t) {
  let n = O.lFrame;
  (n.bindingIndex = n.bindingRootIndex = e), mi(t);
}
function Nh() {
  return O.lFrame.currentDirectiveIndex;
}
function mi(e) {
  O.lFrame.currentDirectiveIndex = e;
}
function lc(e) {
  O.lFrame.currentQueryIndex = e;
}
function Ah(e) {
  let t = e[M];
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[ge] : null;
}
function dc(e, t, n) {
  if (n & b.SkipSelf) {
    let o = t,
      i = e;
    for (; (o = o.parent), o === null && !(n & b.Host); )
      if (((o = Ah(i)), o === null || ((i = i[mn]), o.type & 10))) break;
    if (o === null) return !1;
    (t = o), (e = i);
  }
  let r = (O.lFrame = fc());
  return (r.currentTNode = t), (r.lView = e), !0;
}
function Qi(e) {
  let t = fc(),
    n = e[M];
  (O.lFrame = t),
    (t.currentTNode = n.firstChild),
    (t.lView = e),
    (t.tView = n),
    (t.contextLView = e),
    (t.bindingIndex = n.bindingStartIndex),
    (t.inI18n = !1);
}
function fc() {
  let e = O.lFrame,
    t = e === null ? null : e.child;
  return t === null ? hc(e) : t;
}
function hc(e) {
  let t = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: e,
    child: null,
    inI18n: !1,
  };
  return e !== null && (e.child = t), t;
}
function pc() {
  let e = O.lFrame;
  return (O.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
}
var gc = pc;
function Yi() {
  let e = pc();
  (e.isParent = !0),
    (e.tView = null),
    (e.selectedIndex = -1),
    (e.contextLView = null),
    (e.elementDepthCount = 0),
    (e.currentDirectiveIndex = -1),
    (e.currentNamespace = null),
    (e.bindingRootIndex = -1),
    (e.bindingIndex = -1),
    (e.currentQueryIndex = 0);
}
function Rh() {
  return O.lFrame.selectedIndex;
}
function ot(e) {
  O.lFrame.selectedIndex = e;
}
function Oh() {
  return O.lFrame.currentNamespace;
}
var mc = !0;
function vc() {
  return mc;
}
function yc(e) {
  mc = e;
}
function Ph(e, t, n) {
  let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
  if (r) {
    let s = Xu(t);
    (n.preOrderHooks ??= []).push(e, s),
      (n.preOrderCheckHooks ??= []).push(e, s);
  }
  o && (n.preOrderHooks ??= []).push(0 - e, o),
    i &&
      ((n.preOrderHooks ??= []).push(e, i),
      (n.preOrderCheckHooks ??= []).push(e, i));
}
function Dc(e, t) {
  for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
    let i = e.data[n].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: u,
        ngAfterViewChecked: c,
        ngOnDestroy: l,
      } = i;
    s && (e.contentHooks ??= []).push(-n, s),
      a &&
        ((e.contentHooks ??= []).push(n, a),
        (e.contentCheckHooks ??= []).push(n, a)),
      u && (e.viewHooks ??= []).push(-n, u),
      c &&
        ((e.viewHooks ??= []).push(n, c), (e.viewCheckHooks ??= []).push(n, c)),
      l != null && (e.destroyHooks ??= []).push(n, l);
  }
}
function yr(e, t, n) {
  wc(e, t, 3, n);
}
function Dr(e, t, n, r) {
  (e[C] & 3) === n && wc(e, t, n, r);
}
function ei(e, t) {
  let n = e[C];
  (n & 3) === t && ((n &= 16383), (n += 1), (e[C] = n));
}
function wc(e, t, n, r) {
  let o = r !== void 0 ? e[Mt] & 65535 : 0,
    i = r ?? -1,
    s = t.length - 1,
    a = 0;
  for (let u = o; u < s; u++)
    if (typeof t[u + 1] == "number") {
      if (((a = t[u]), r != null && a >= r)) break;
    } else
      t[u] < 0 && (e[Mt] += 65536),
        (a < i || i == -1) &&
          (Fh(e, n, t, u), (e[Mt] = (e[Mt] & 4294901760) + u + 2)),
        u++;
}
function au(e, t) {
  Be(4, e, t);
  let n = P(null);
  try {
    t.call(e);
  } finally {
    P(n), Be(5, e, t);
  }
}
function Fh(e, t, n, r) {
  let o = n[r] < 0,
    i = n[r + 1],
    s = o ? -n[r] : n[r],
    a = e[s];
  o
    ? e[C] >> 14 < e[Mt] >> 16 &&
      (e[C] & 3) === t &&
      ((e[C] += 16384), au(a, i))
    : au(a, i);
}
var xt = -1,
  cn = class {
    constructor(t, n, r) {
      (this.factory = t),
        (this.resolving = !1),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r);
    }
  };
function kh(e) {
  return e instanceof cn;
}
function Lh(e) {
  return (e.flags & 8) !== 0;
}
function jh(e) {
  return (e.flags & 16) !== 0;
}
var ti = {},
  vi = class {
    constructor(t, n) {
      (this.injector = t), (this.parentInjector = n);
    }
    get(t, n, r) {
      r = Ur(r);
      let o = this.injector.get(t, ti, r);
      return o !== ti || n === ti ? o : this.parentInjector.get(t, n, r);
    }
  };
function Cc(e) {
  return e !== xt;
}
function Nr(e) {
  return e & 32767;
}
function Vh(e) {
  return e >> 16;
}
function Ar(e, t) {
  let n = Vh(e),
    r = t;
  for (; n > 0; ) (r = r[mn]), n--;
  return r;
}
var yi = !0;
function uu(e) {
  let t = yi;
  return (yi = e), t;
}
var $h = 256,
  Ic = $h - 1,
  Ec = 5,
  Bh = 0,
  Ce = {};
function Uh(e, t, n) {
  let r;
  typeof n == "string"
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(nn) && (r = n[nn]),
    r == null && (r = n[nn] = Bh++);
  let o = r & Ic,
    i = 1 << o;
  t.data[e + (o >> Ec)] |= i;
}
function bc(e, t) {
  let n = Sc(e, t);
  if (n !== -1) return n;
  let r = t[M];
  r.firstCreatePass &&
    ((e.injectorIndex = t.length),
    ni(r.data, e),
    ni(t, null),
    ni(r.blueprint, null));
  let o = Ki(e, t),
    i = e.injectorIndex;
  if (Cc(o)) {
    let s = Nr(o),
      a = Ar(o, t),
      u = a[M].data;
    for (let c = 0; c < 8; c++) t[i + c] = a[s + c] | u[s + c];
  }
  return (t[i + 8] = o), i;
}
function ni(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function Sc(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function Ki(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let n = 0,
    r = null,
    o = t;
  for (; o !== null; ) {
    if (((r = Nc(o)), r === null)) return xt;
    if ((n++, (o = o[mn]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16);
  }
  return xt;
}
function Hh(e, t, n) {
  Uh(e, t, n);
}
function Mc(e, t, n) {
  if (n & b.Optional || e !== void 0) return e;
  Vi(t, "NodeInjector");
}
function _c(e, t, n, r) {
  if (
    (n & b.Optional && r === void 0 && (r = null), !(n & (b.Self | b.Host)))
  ) {
    let o = e[Rt],
      i = ne(void 0);
    try {
      return o ? o.get(t, r, n & b.Optional) : Pu(t, r, n & b.Optional);
    } finally {
      ne(i);
    }
  }
  return Mc(r, t, n);
}
function Tc(e, t, n, r = b.Default, o) {
  if (e !== null) {
    if (t[C] & 2048 && !(r & b.Self)) {
      let s = Zh(e, t, n, r, Ce);
      if (s !== Ce) return s;
    }
    let i = xc(e, t, n, r, Ce);
    if (i !== Ce) return i;
  }
  return _c(t, n, r, o);
}
function xc(e, t, n, r, o) {
  let i = qh(n);
  if (typeof i == "function") {
    if (!dc(t, e, r)) return r & b.Host ? Mc(o, n, r) : _c(t, n, r, o);
    try {
      let s;
      if (((s = i(r)), s == null && !(r & b.Optional))) Vi(n);
      else return s;
    } finally {
      gc();
    }
  } else if (typeof i == "number") {
    let s = null,
      a = Sc(e, t),
      u = xt,
      c = r & b.Host ? t[be][ge] : null;
    for (
      (a === -1 || r & b.SkipSelf) &&
      ((u = a === -1 ? Ki(e, t) : t[a + 8]),
      u === xt || !lu(r, !1)
        ? (a = -1)
        : ((s = t[M]), (a = Nr(u)), (t = Ar(u, t))));
      a !== -1;

    ) {
      let l = t[M];
      if (cu(i, a, l.data)) {
        let d = zh(a, t, n, s, r, c);
        if (d !== Ce) return d;
      }
      (u = t[a + 8]),
        u !== xt && lu(r, t[M].data[a + 8] === c) && cu(i, a, t)
          ? ((s = l), (a = Nr(u)), (t = Ar(u, t)))
          : (a = -1);
    }
  }
  return o;
}
function zh(e, t, n, r, o, i) {
  let s = t[M],
    a = s.data[e + 8],
    u = r == null ? qi(a) && yi : r != s && (a.type & 3) !== 0,
    c = o & b.Host && i === a,
    l = Gh(a, s, n, u, c);
  return l !== null ? ln(t, s, l, a) : Ce;
}
function Gh(e, t, n, r, o) {
  let i = e.providerIndexes,
    s = t.data,
    a = i & 1048575,
    u = e.directiveStart,
    c = e.directiveEnd,
    l = i >> 20,
    d = r ? a : a + l,
    p = o ? a + l : c;
  for (let f = d; f < p; f++) {
    let m = s[f];
    if ((f < u && n === m) || (f >= u && m.type === n)) return f;
  }
  if (o) {
    let f = s[u];
    if (f && vn(f) && f.type === n) return u;
  }
  return null;
}
function ln(e, t, n, r) {
  let o = e[n],
    i = t.data;
  if (kh(o)) {
    let s = o;
    s.resolving && bf(Ef(i[n]));
    let a = uu(s.canSeeViewProviders);
    s.resolving = !0;
    let u,
      c = s.injectImpl ? ne(s.injectImpl) : null,
      l = dc(e, r, b.Default);
    try {
      (o = e[n] = s.factory(void 0, i, e, r)),
        t.firstCreatePass && n >= r.directiveStart && Ph(n, i[n], t);
    } finally {
      c !== null && ne(c), uu(a), (s.resolving = !1), gc();
    }
  }
  return o;
}
function qh(e) {
  if (typeof e == "string") return e.charCodeAt(0) || 0;
  let t = e.hasOwnProperty(nn) ? e[nn] : void 0;
  return typeof t == "number" ? (t >= 0 ? t & Ic : Wh) : t;
}
function cu(e, t, n) {
  let r = 1 << e;
  return !!(n[t + (e >> Ec)] & r);
}
function lu(e, t) {
  return !(e & b.Self) && !(e & b.Host && t);
}
var Xe = class {
  constructor(t, n) {
    (this._tNode = t), (this._lView = n);
  }
  get(t, n, r) {
    return Tc(this._tNode, this._lView, t, Ur(r), n);
  }
};
function Wh() {
  return new Xe(Pe(), pe());
}
function Ji(e) {
  return $r(() => {
    let t = e.prototype.constructor,
      n = t[Ir] || Di(t),
      r = Object.prototype,
      o = Object.getPrototypeOf(e.prototype).constructor;
    for (; o && o !== r; ) {
      let i = o[Ir] || Di(o);
      if (i && i !== n) return i;
      o = Object.getPrototypeOf(o);
    }
    return (i) => new i();
  });
}
function Di(e) {
  return Tu(e)
    ? () => {
        let t = Di(re(e));
        return t && t();
      }
    : Nt(e);
}
function Zh(e, t, n, r, o) {
  let i = e,
    s = t;
  for (; i !== null && s !== null && s[C] & 2048 && !(s[C] & 512); ) {
    let a = xc(i, s, n, r | b.Self, Ce);
    if (a !== Ce) return a;
    let u = i.parent;
    if (!u) {
      let c = s[Qu];
      if (c) {
        let l = c.get(n, Ce, r);
        if (l !== Ce) return l;
      }
      (u = Nc(s)), (s = s[mn]);
    }
    i = u;
  }
  return o;
}
function Nc(e) {
  let t = e[M],
    n = t.type;
  return n === 2 ? t.declTNode : n === 1 ? e[ge] : null;
}
function du(e, t = null, n = null, r) {
  let o = Ac(e, t, n, r);
  return o.resolveInjectorInitializers(), o;
}
function Ac(e, t = null, n = null, r, o = new Set()) {
  let i = [n || we, Kf(e)];
  return (
    (r = r || (typeof e == "object" ? void 0 : X(e))),
    new sn(i, t || Gi(), r || null, o)
  );
}
var it = class e {
  static {
    this.THROW_IF_NOT_FOUND = rn;
  }
  static {
    this.NULL = new Sr();
  }
  static create(t, n) {
    if (Array.isArray(t)) return du({ name: "" }, n, t, "");
    {
      let r = t.name ?? "";
      return du({ name: r }, t.parent, t.providers, r);
    }
  }
  static {
    this.ɵprov = D({ token: e, providedIn: "any", factory: () => _(ku) });
  }
  static {
    this.__NG_ELEMENT_ID__ = -1;
  }
};
var Qh = new E("");
Qh.__NG_ELEMENT_ID__ = (e) => {
  let t = Pe();
  if (t === null) throw new v(204, !1);
  if (t.type & 2) return t.value;
  if (e & b.Optional) return null;
  throw new v(204, !1);
};
var Yh = "ngOriginalError";
function ri(e) {
  return e[Yh];
}
var Rc = !0,
  Oc = (() => {
    class e {
      static {
        this.__NG_ELEMENT_ID__ = Kh;
      }
      static {
        this.__NG_ENV_ID__ = (n) => n;
      }
    }
    return e;
  })(),
  wi = class extends Oc {
    constructor(t) {
      super(), (this._lView = t);
    }
    onDestroy(t) {
      return oc(this._lView, t), () => yh(this._lView, t);
    }
  };
function Kh() {
  return new wi(pe());
}
var jt = (() => {
  class e {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new z(!1));
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value;
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0);
      let n = this.taskId++;
      return this.pendingTasks.add(n), n;
    }
    remove(n) {
      this.pendingTasks.delete(n),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
    static {
      this.ɵprov = D({ token: e, providedIn: "root", factory: () => new e() });
    }
  }
  return e;
})();
var Ci = class extends W {
    constructor(t = !1) {
      super(),
        (this.destroyRef = void 0),
        (this.pendingTasks = void 0),
        (this.__isAsync = t),
        uh() &&
          ((this.destroyRef = h(Oc, { optional: !0 }) ?? void 0),
          (this.pendingTasks = h(jt, { optional: !0 }) ?? void 0));
    }
    emit(t) {
      let n = P(null);
      try {
        super.next(t);
      } finally {
        P(n);
      }
    }
    subscribe(t, n, r) {
      let o = t,
        i = n || (() => null),
        s = r;
      if (t && typeof t == "object") {
        let u = t;
        (o = u.next?.bind(u)),
          (i = u.error?.bind(u)),
          (s = u.complete?.bind(u));
      }
      this.__isAsync &&
        ((i = this.wrapInTimeout(i)),
        o && (o = this.wrapInTimeout(o)),
        s && (s = this.wrapInTimeout(s)));
      let a = super.subscribe({ next: o, error: i, complete: s });
      return t instanceof j && t.add(a), a;
    }
    wrapInTimeout(t) {
      return (n) => {
        let r = this.pendingTasks?.add();
        setTimeout(() => {
          t(n), r !== void 0 && this.pendingTasks?.remove(r);
        });
      };
    }
  },
  Z = Ci;
function Rr(...e) {}
function Pc(e) {
  let t, n;
  function r() {
    e = Rr;
    try {
      n !== void 0 &&
        typeof cancelAnimationFrame == "function" &&
        cancelAnimationFrame(n),
        t !== void 0 && clearTimeout(t);
    } catch {}
  }
  return (
    (t = setTimeout(() => {
      e(), r();
    })),
    typeof requestAnimationFrame == "function" &&
      (n = requestAnimationFrame(() => {
        e(), r();
      })),
    () => r()
  );
}
function fu(e) {
  return (
    queueMicrotask(() => e()),
    () => {
      e = Rr;
    }
  );
}
var Xi = "isAngularZone",
  Or = Xi + "_ID",
  Jh = 0,
  V = class e {
    constructor(t) {
      (this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new Z(!1)),
        (this.onMicrotaskEmpty = new Z(!1)),
        (this.onStable = new Z(!1)),
        (this.onError = new Z(!1));
      let {
        enableLongStackTrace: n = !1,
        shouldCoalesceEventChangeDetection: r = !1,
        shouldCoalesceRunChangeDetection: o = !1,
        scheduleInRootZone: i = Rc,
      } = t;
      if (typeof Zone > "u") throw new v(908, !1);
      Zone.assertZonePatched();
      let s = this;
      (s._nesting = 0),
        (s._outer = s._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec())),
        n &&
          Zone.longStackTraceZoneSpec &&
          (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)),
        (s.shouldCoalesceEventChangeDetection = !o && r),
        (s.shouldCoalesceRunChangeDetection = o),
        (s.callbackScheduled = !1),
        (s.scheduleInRootZone = i),
        tp(s);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get(Xi) === !0;
    }
    static assertInAngularZone() {
      if (!e.isInAngularZone()) throw new v(909, !1);
    }
    static assertNotInAngularZone() {
      if (e.isInAngularZone()) throw new v(909, !1);
    }
    run(t, n, r) {
      return this._inner.run(t, n, r);
    }
    runTask(t, n, r, o) {
      let i = this._inner,
        s = i.scheduleEventTask("NgZoneEvent: " + o, t, Xh, Rr, Rr);
      try {
        return i.runTask(s, n, r);
      } finally {
        i.cancelTask(s);
      }
    }
    runGuarded(t, n, r) {
      return this._inner.runGuarded(t, n, r);
    }
    runOutsideAngular(t) {
      return this._outer.run(t);
    }
  },
  Xh = {};
function es(e) {
  if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
      e._nesting++, e.onMicrotaskEmpty.emit(null);
    } finally {
      if ((e._nesting--, !e.hasPendingMicrotasks))
        try {
          e.runOutsideAngular(() => e.onStable.emit(null));
        } finally {
          e.isStable = !0;
        }
    }
}
function ep(e) {
  if (e.isCheckStableRunning || e.callbackScheduled) return;
  e.callbackScheduled = !0;
  function t() {
    Pc(() => {
      (e.callbackScheduled = !1),
        Ii(e),
        (e.isCheckStableRunning = !0),
        es(e),
        (e.isCheckStableRunning = !1);
    });
  }
  e.scheduleInRootZone
    ? Zone.root.run(() => {
        t();
      })
    : e._outer.run(() => {
        t();
      }),
    Ii(e);
}
function tp(e) {
  let t = () => {
      ep(e);
    },
    n = Jh++;
  e._inner = e._inner.fork({
    name: "angular",
    properties: { [Xi]: !0, [Or]: n, [Or + n]: !0 },
    onInvokeTask: (r, o, i, s, a, u) => {
      if (np(u)) return r.invokeTask(i, s, a, u);
      try {
        return hu(e), r.invokeTask(i, s, a, u);
      } finally {
        ((e.shouldCoalesceEventChangeDetection && s.type === "eventTask") ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          pu(e);
      }
    },
    onInvoke: (r, o, i, s, a, u, c) => {
      try {
        return hu(e), r.invoke(i, s, a, u, c);
      } finally {
        e.shouldCoalesceRunChangeDetection &&
          !e.callbackScheduled &&
          !rp(u) &&
          t(),
          pu(e);
      }
    },
    onHasTask: (r, o, i, s) => {
      r.hasTask(i, s),
        o === i &&
          (s.change == "microTask"
            ? ((e._hasPendingMicrotasks = s.microTask), Ii(e), es(e))
            : s.change == "macroTask" &&
              (e.hasPendingMacrotasks = s.macroTask));
    },
    onHandleError: (r, o, i, s) => (
      r.handleError(i, s), e.runOutsideAngular(() => e.onError.emit(s)), !1
    ),
  });
}
function Ii(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection ||
    e.shouldCoalesceRunChangeDetection) &&
    e.callbackScheduled === !0)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function hu(e) {
  e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
}
function pu(e) {
  e._nesting--, es(e);
}
var Ei = class {
  constructor() {
    (this.hasPendingMicrotasks = !1),
      (this.hasPendingMacrotasks = !1),
      (this.isStable = !0),
      (this.onUnstable = new Z()),
      (this.onMicrotaskEmpty = new Z()),
      (this.onStable = new Z()),
      (this.onError = new Z());
  }
  run(t, n, r) {
    return t.apply(n, r);
  }
  runGuarded(t, n, r) {
    return t.apply(n, r);
  }
  runOutsideAngular(t) {
    return t();
  }
  runTask(t, n, r, o) {
    return t.apply(n, r);
  }
};
function np(e) {
  return Fc(e, "__ignore_ng_zone__");
}
function rp(e) {
  return Fc(e, "__scheduler_tick__");
}
function Fc(e, t) {
  return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[t] === !0;
}
var xe = class {
    constructor() {
      this._console = console;
    }
    handleError(t) {
      let n = this._findOriginalError(t);
      this._console.error("ERROR", t),
        n && this._console.error("ORIGINAL ERROR", n);
    }
    _findOriginalError(t) {
      let n = t && ri(t);
      for (; n && ri(n); ) n = ri(n);
      return n || null;
    }
  },
  op = new E("", {
    providedIn: "root",
    factory: () => {
      let e = h(V),
        t = h(xe);
      return (n) => e.runOutsideAngular(() => t.handleError(n));
    },
  });
function ip() {
  return ts(Pe(), pe());
}
function ts(e, t) {
  return new Kr(Oe(e, t));
}
var Kr = (() => {
  class e {
    constructor(n) {
      this.nativeElement = n;
    }
    static {
      this.__NG_ELEMENT_ID__ = ip;
    }
  }
  return e;
})();
function kc(e) {
  return (e.flags & 128) === 128;
}
var Lc = new Map(),
  sp = 0;
function ap() {
  return sp++;
}
function up(e) {
  Lc.set(e[qr], e);
}
function bi(e) {
  Lc.delete(e[qr]);
}
var gu = "__ngContext__";
function Ot(e, t) {
  Je(t) ? ((e[gu] = t[qr]), up(t)) : (e[gu] = t);
}
function jc(e) {
  return $c(e[an]);
}
function Vc(e) {
  return $c(e[he]);
}
function $c(e) {
  for (; e !== null && !Re(e); ) e = e[he];
  return e;
}
var Si;
function Bc(e) {
  Si = e;
}
function cp() {
  if (Si !== void 0) return Si;
  if (typeof document < "u") return document;
  throw new v(210, !1);
}
var ns = new E("", { providedIn: "root", factory: () => lp }),
  lp = "ng",
  rs = new E(""),
  Vt = new E("", { providedIn: "platform", factory: () => "unknown" });
var os = new E("", {
  providedIn: "root",
  factory: () =>
    cp().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
    null,
});
var dp = "h",
  fp = "b";
var hp = () => null;
function is(e, t, n = !1) {
  return hp(e, t, n);
}
var Uc = !1,
  pp = new E("", { providedIn: "root", factory: () => Uc });
function Hc(e) {
  return e instanceof Function ? e() : e;
}
var st = (function (e) {
    return (
      (e[(e.Important = 1)] = "Important"),
      (e[(e.DashCase = 2)] = "DashCase"),
      e
    );
  })(st || {}),
  gp;
function ss(e, t) {
  return gp(e, t);
}
function _t(e, t, n, r, o) {
  if (r != null) {
    let i,
      s = !1;
    Re(r) ? (i = r) : Je(r) && ((s = !0), (r = r[Ae]));
    let a = Ge(r);
    e === 0 && n !== null
      ? o == null
        ? Zc(t, n, a)
        : Pr(t, n, a, o || null, !0)
      : e === 1 && n !== null
        ? Pr(t, n, a, o || null, !0)
        : e === 2
          ? xp(t, a, s)
          : e === 3 && t.destroyNode(a),
      i != null && Ap(t, e, i, n, o);
  }
}
function mp(e, t) {
  return e.createText(t);
}
function zc(e, t, n) {
  return e.createElement(t, n);
}
function vp(e, t) {
  Gc(e, t), (t[Ae] = null), (t[ge] = null);
}
function yp(e, t, n, r, o, i) {
  (r[Ae] = o), (r[ge] = t), Jr(e, r, n, 1, o, i);
}
function Gc(e, t) {
  t[Te].changeDetectionScheduler?.notify(9), Jr(e, t, t[Ee], 2, null, null);
}
function Dp(e) {
  let t = e[an];
  if (!t) return oi(e[M], e);
  for (; t; ) {
    let n = null;
    if (Je(t)) n = t[an];
    else {
      let r = t[ie];
      r && (n = r);
    }
    if (!n) {
      for (; t && !t[he] && t !== e; ) Je(t) && oi(t[M], t), (t = t[Q]);
      t === null && (t = e), Je(t) && oi(t[M], t), (n = t && t[he]);
    }
    t = n;
  }
}
function wp(e, t, n, r) {
  let o = ie + r,
    i = n.length;
  r > 0 && (n[o - 1][he] = t),
    r < i - ie
      ? ((t[he] = n[o]), Fu(n, ie + r, t))
      : (n.push(t), (t[he] = null)),
    (t[Q] = n);
  let s = t[un];
  s !== null && n !== s && qc(s, t);
  let a = t[Gr];
  a !== null && a.insertView(e), gi(t), (t[C] |= 128);
}
function qc(e, t) {
  let n = e[Tr],
    r = t[Q];
  if (Je(r)) e[C] |= xr.HasTransplantedViews;
  else {
    let o = r[Q][be];
    t[be] !== o && (e[C] |= xr.HasTransplantedViews);
  }
  n === null ? (e[Tr] = [t]) : n.push(t);
}
function as(e, t) {
  let n = e[Tr],
    r = n.indexOf(t);
  n.splice(r, 1);
}
function Mi(e, t) {
  if (e.length <= ie) return;
  let n = ie + t,
    r = e[n];
  if (r) {
    let o = r[un];
    o !== null && o !== e && as(o, r), t > 0 && (e[n - 1][he] = r[he]);
    let i = br(e, ie + t);
    vp(r[M], r);
    let s = i[Gr];
    s !== null && s.detachView(i[M]),
      (r[Q] = null),
      (r[he] = null),
      (r[C] &= -129);
  }
  return r;
}
function Wc(e, t) {
  if (!(t[C] & 256)) {
    let n = t[Ee];
    n.destroyNode && Jr(e, t, n, 3, null, null), Dp(t);
  }
}
function oi(e, t) {
  if (t[C] & 256) return;
  let n = P(null);
  try {
    (t[C] &= -129),
      (t[C] |= 256),
      t[oe] && Ro(t[oe]),
      Ip(e, t),
      Cp(e, t),
      t[M].type === 1 && t[Ee].destroy();
    let r = t[un];
    if (r !== null && Re(t[Q])) {
      r !== t[Q] && as(r, t);
      let o = t[Gr];
      o !== null && o.detachView(e);
    }
    bi(t);
  } finally {
    P(n);
  }
}
function Cp(e, t) {
  let n = e.cleanup,
    r = t[nu];
  if (n !== null)
    for (let i = 0; i < n.length - 1; i += 2)
      if (typeof n[i] == "string") {
        let s = n[i + 3];
        s >= 0 ? r[s]() : r[-s].unsubscribe(), (i += 2);
      } else {
        let s = r[n[i + 1]];
        n[i].call(s);
      }
  r !== null && (t[nu] = null);
  let o = t[Ue];
  if (o !== null) {
    t[Ue] = null;
    for (let i = 0; i < o.length; i++) {
      let s = o[i];
      s();
    }
  }
}
function Ip(e, t) {
  let n;
  if (e != null && (n = e.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let o = t[n[r]];
      if (!(o instanceof cn)) {
        let i = n[r + 1];
        if (Array.isArray(i))
          for (let s = 0; s < i.length; s += 2) {
            let a = o[i[s]],
              u = i[s + 1];
            Be(4, a, u);
            try {
              u.call(a);
            } finally {
              Be(5, a, u);
            }
          }
        else {
          Be(4, o, i);
          try {
            i.call(o);
          } finally {
            Be(5, o, i);
          }
        }
      }
    }
}
function Ep(e, t, n) {
  return bp(e, t.parent, n);
}
function bp(e, t, n) {
  let r = t;
  for (; r !== null && r.type & 168; ) (t = r), (r = t.parent);
  if (r === null) return n[Ae];
  {
    let { componentOffset: o } = r;
    if (o > -1) {
      let { encapsulation: i } = e.data[r.directiveStart + o];
      if (i === Ie.None || i === Ie.Emulated) return null;
    }
    return Oe(r, n);
  }
}
function Pr(e, t, n, r, o) {
  e.insertBefore(t, n, r, o);
}
function Zc(e, t, n) {
  e.appendChild(t, n);
}
function mu(e, t, n, r, o) {
  r !== null ? Pr(e, t, n, r, o) : Zc(e, t, n);
}
function Qc(e, t) {
  return e.parentNode(t);
}
function Sp(e, t) {
  return e.nextSibling(t);
}
function Mp(e, t, n) {
  return Tp(e, t, n);
}
function _p(e, t, n) {
  return e.type & 40 ? Oe(e, n) : null;
}
var Tp = _p,
  vu;
function Yc(e, t, n, r) {
  let o = Ep(e, r, t),
    i = t[Ee],
    s = r.parent || t[ge],
    a = Mp(s, r, t);
  if (o != null)
    if (Array.isArray(n))
      for (let u = 0; u < n.length; u++) mu(i, o, n[u], a, !1);
    else mu(i, o, n, a, !1);
  vu !== void 0 && vu(i, r, t, n, o);
}
function en(e, t) {
  if (t !== null) {
    let n = t.type;
    if (n & 3) return Oe(t, e);
    if (n & 4) return _i(-1, e[t.index]);
    if (n & 8) {
      let r = t.child;
      if (r !== null) return en(e, r);
      {
        let o = e[t.index];
        return Re(o) ? _i(-1, o) : Ge(o);
      }
    } else {
      if (n & 128) return en(e, t.next);
      if (n & 32) return ss(t, e)() || Ge(e[t.index]);
      {
        let r = Kc(e, t);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let o = rt(e[be]);
          return en(o, r);
        } else return en(e, t.next);
      }
    }
  }
  return null;
}
function Kc(e, t) {
  if (t !== null) {
    let r = e[be][ge],
      o = t.projection;
    return r.projection[o];
  }
  return null;
}
function _i(e, t) {
  let n = ie + e + 1;
  if (n < t.length) {
    let r = t[n],
      o = r[M].firstChild;
    if (o !== null) return en(r, o);
  }
  return t[nt];
}
function xp(e, t, n) {
  e.removeChild(null, t, n);
}
function us(e, t, n, r, o, i, s) {
  for (; n != null; ) {
    if (n.type === 128) {
      n = n.next;
      continue;
    }
    let a = r[n.index],
      u = n.type;
    if (
      (s && t === 0 && (a && Ot(Ge(a), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (u & 8) us(e, t, n.child, r, o, i, !1), _t(t, e, o, a, i);
      else if (u & 32) {
        let c = ss(n, r),
          l;
        for (; (l = c()); ) _t(t, e, o, l, i);
        _t(t, e, o, a, i);
      } else u & 16 ? Np(e, t, r, n, o, i) : _t(t, e, o, a, i);
    n = s ? n.projectionNext : n.next;
  }
}
function Jr(e, t, n, r, o, i) {
  us(n, r, e.firstChild, t, o, i, !1);
}
function Np(e, t, n, r, o, i) {
  let s = n[be],
    u = s[ge].projection[r.projection];
  if (Array.isArray(u))
    for (let c = 0; c < u.length; c++) {
      let l = u[c];
      _t(t, e, o, l, i);
    }
  else {
    let c = u,
      l = s[Q];
    kc(r) && (c.flags |= 128), us(e, t, c, l, o, i, !0);
  }
}
function Ap(e, t, n, r, o) {
  let i = n[nt],
    s = Ge(n);
  i !== s && _t(t, e, r, i, o);
  for (let a = ie; a < n.length; a++) {
    let u = n[a];
    Jr(u[M], u, e, t, r, i);
  }
}
function Rp(e, t, n) {
  e.setAttribute(t, "style", n);
}
function Jc(e, t, n) {
  n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n);
}
function Xc(e, t, n) {
  let { mergedAttrs: r, classes: o, styles: i } = n;
  r !== null && ui(e, t, r),
    o !== null && Jc(e, t, o),
    i !== null && Rp(e, t, i);
}
var el = {};
function Op(e, t, n, r) {
  if (!r)
    if ((t[C] & 3) === 3) {
      let i = e.preOrderCheckHooks;
      i !== null && yr(t, i, n);
    } else {
      let i = e.preOrderHooks;
      i !== null && Dr(t, i, 0, n);
    }
  ot(n);
}
function cs(e, t = b.Default) {
  let n = pe();
  if (n === null) return _(e, t);
  let r = Pe();
  return Tc(r, n, re(e), t);
}
function tl(e, t, n, r, o, i) {
  let s = P(null);
  try {
    let a = null;
    o & He.SignalBased && (a = t[r][pa]),
      a !== null && a.transformFn !== void 0 && (i = a.transformFn(i)),
      o & He.HasDecoratorInputTransform &&
        (i = e.inputTransforms[r].call(t, i)),
      e.setInput !== null ? e.setInput(t, a, i, n, r) : Ju(t, a, r, i);
  } finally {
    P(s);
  }
}
function Pp(e, t) {
  let n = e.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        if (o < 0) ot(~o);
        else {
          let i = o,
            s = n[++r],
            a = n[++r];
          xh(s, i);
          let u = t[i];
          a(2, u);
        }
      }
    } finally {
      ot(-1);
    }
}
function ls(e, t, n, r, o, i, s, a, u, c, l) {
  let d = t.blueprint.slice();
  return (
    (d[Ae] = o),
    (d[C] = r | 4 | 128 | 8 | 64),
    (c !== null || (e && e[C] & 2048)) && (d[C] |= 2048),
    nc(d),
    (d[Q] = d[mn] = e),
    (d[ze] = n),
    (d[Te] = s || (e && e[Te])),
    (d[Ee] = a || (e && e[Ee])),
    (d[Rt] = u || (e && e[Rt]) || null),
    (d[ge] = i),
    (d[qr] = ap()),
    (d[Mr] = l),
    (d[Qu] = c),
    (d[be] = t.type == 2 ? e[be] : d),
    d
  );
}
function ds(e, t, n, r, o) {
  let i = e.data[t];
  if (i === null) (i = Fp(e, t, n, r, o)), Th() && (i.flags |= 32);
  else if (i.type & 64) {
    (i.type = n), (i.value = r), (i.attrs = o);
    let s = Sh();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return Yr(i, !0), i;
}
function Fp(e, t, n, r, o) {
  let i = ac(),
    s = uc(),
    a = s ? i : i && i.parent,
    u = (e.data[t] = Up(e, a, n, t, r, o));
  return (
    e.firstChild === null && (e.firstChild = u),
    i !== null &&
      (s
        ? i.child == null && u.parent !== null && (i.child = u)
        : i.next === null && ((i.next = u), (u.prev = i))),
    u
  );
}
function nl(e, t, n, r) {
  if (n === 0) return -1;
  let o = t.length;
  for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
  return o;
}
function rl(e, t, n, r, o) {
  let i = Rh(),
    s = r & 2;
  try {
    ot(-1), s && t.length > tt && Op(e, t, tt, !1), Be(s ? 2 : 0, o), n(r, o);
  } finally {
    ot(i), Be(s ? 3 : 1, o);
  }
}
function ol(e, t, n) {
  if (Ku(t)) {
    let r = P(null);
    try {
      let o = t.directiveStart,
        i = t.directiveEnd;
      for (let s = o; s < i; s++) {
        let a = e.data[s];
        if (a.contentQueries) {
          let u = n[s];
          a.contentQueries(1, u, s);
        }
      }
    } finally {
      P(r);
    }
  }
}
function kp(e, t, n) {
  sc() && (Wp(e, t, n, Oe(n, t)), (n.flags & 64) === 64 && ul(e, t, n));
}
function Lp(e, t, n = Oe) {
  let r = t.localNames;
  if (r !== null) {
    let o = t.index + 1;
    for (let i = 0; i < r.length; i += 2) {
      let s = r[i + 1],
        a = s === -1 ? n(t, e) : e[s];
      e[o++] = a;
    }
  }
}
function il(e) {
  let t = e.tView;
  return t === null || t.incompleteFirstPass
    ? (e.tView = sl(
        1,
        null,
        e.template,
        e.decls,
        e.vars,
        e.directiveDefs,
        e.pipeDefs,
        e.viewQuery,
        e.schemas,
        e.consts,
        e.id,
      ))
    : t;
}
function sl(e, t, n, r, o, i, s, a, u, c, l) {
  let d = tt + r,
    p = d + o,
    f = jp(d, p),
    m = typeof c == "function" ? c() : c;
  return (f[M] = {
    type: e,
    blueprint: f,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: t,
    data: f.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: p,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof i == "function" ? i() : i,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: u,
    consts: m,
    incompleteFirstPass: !1,
    ssrId: l,
  });
}
function jp(e, t) {
  let n = [];
  for (let r = 0; r < t; r++) n.push(r < e ? null : el);
  return n;
}
function Vp(e, t, n, r) {
  let i = r.get(pp, Uc) || n === Ie.ShadowDom,
    s = e.selectRootElement(t, i);
  return $p(s), s;
}
function $p(e) {
  Bp(e);
}
var Bp = () => null;
function Up(e, t, n, r, o, i) {
  let s = t ? t.injectorIndex : -1,
    a = 0;
  return (
    Ih() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: o,
      attrs: i,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: t,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function yu(e, t, n, r, o) {
  for (let i in t) {
    if (!t.hasOwnProperty(i)) continue;
    let s = t[i];
    if (s === void 0) continue;
    r ??= {};
    let a,
      u = He.None;
    Array.isArray(s) ? ((a = s[0]), (u = s[1])) : (a = s);
    let c = i;
    if (o !== null) {
      if (!o.hasOwnProperty(i)) continue;
      c = o[i];
    }
    e === 0 ? Du(r, n, c, a, u) : Du(r, n, c, a);
  }
  return r;
}
function Du(e, t, n, r, o) {
  let i;
  e.hasOwnProperty(n) ? (i = e[n]).push(t, r) : (i = e[n] = [t, r]),
    o !== void 0 && i.push(o);
}
function Hp(e, t, n) {
  let r = t.directiveStart,
    o = t.directiveEnd,
    i = e.data,
    s = t.attrs,
    a = [],
    u = null,
    c = null;
  for (let l = r; l < o; l++) {
    let d = i[l],
      p = n ? n.get(d) : null,
      f = p ? p.inputs : null,
      m = p ? p.outputs : null;
    (u = yu(0, d.inputs, l, u, f)), (c = yu(1, d.outputs, l, c, m));
    let A = u !== null && s !== null && !Ui(t) ? ng(u, l, s) : null;
    a.push(A);
  }
  u !== null &&
    (u.hasOwnProperty("class") && (t.flags |= 8),
    u.hasOwnProperty("style") && (t.flags |= 16)),
    (t.initialInputs = a),
    (t.inputs = u),
    (t.outputs = c);
}
function zp(e, t, n, r) {
  if (sc()) {
    let o = r === null ? null : { "": -1 },
      i = Qp(e, n),
      s,
      a;
    i === null ? (s = a = null) : ([s, a] = i),
      s !== null && al(e, t, n, s, o, a),
      o && Yp(n, r, o);
  }
  n.mergedAttrs = Bi(n.mergedAttrs, n.attrs);
}
function al(e, t, n, r, o, i) {
  for (let c = 0; c < r.length; c++) Hh(bc(n, t), e, r[c].type);
  Jp(n, e.data.length, r.length);
  for (let c = 0; c < r.length; c++) {
    let l = r[c];
    l.providersResolver && l.providersResolver(l);
  }
  let s = !1,
    a = !1,
    u = nl(e, t, r.length, null);
  for (let c = 0; c < r.length; c++) {
    let l = r[c];
    (n.mergedAttrs = Bi(n.mergedAttrs, l.hostAttrs)),
      Xp(e, n, t, u, l),
      Kp(u, l, o),
      l.contentQueries !== null && (n.flags |= 4),
      (l.hostBindings !== null || l.hostAttrs !== null || l.hostVars !== 0) &&
        (n.flags |= 64);
    let d = l.type.prototype;
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(n.index), (s = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
      u++;
  }
  Hp(e, n, i);
}
function Gp(e, t, n, r, o) {
  let i = o.hostBindings;
  if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~t.index;
    qp(s) != a && s.push(a), s.push(n, r, i);
  }
}
function qp(e) {
  let t = e.length;
  for (; t > 0; ) {
    let n = e[--t];
    if (typeof n == "number" && n < 0) return n;
  }
  return 0;
}
function Wp(e, t, n, r) {
  let o = n.directiveStart,
    i = n.directiveEnd;
  qi(n) && eg(t, n, e.data[o + n.componentOffset]),
    e.firstCreatePass || bc(n, t),
    Ot(r, t);
  let s = n.initialInputs;
  for (let a = o; a < i; a++) {
    let u = e.data[a],
      c = ln(t, e, a, n);
    if ((Ot(c, t), s !== null && tg(t, a - o, c, u, n, s), vn(u))) {
      let l = yn(n.index, t);
      l[ze] = ln(t, e, a, n);
    }
  }
}
function ul(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd,
    i = n.index,
    s = Nh();
  try {
    ot(i);
    for (let a = r; a < o; a++) {
      let u = e.data[a],
        c = t[a];
      mi(a),
        (u.hostBindings !== null || u.hostVars !== 0 || u.hostAttrs !== null) &&
          Zp(u, c);
    }
  } finally {
    ot(-1), mi(s);
  }
}
function Zp(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t);
}
function Qp(e, t) {
  let n = e.directiveRegistry,
    r = null,
    o = null;
  if (n)
    for (let i = 0; i < n.length; i++) {
      let s = n[i];
      if (Uf(t, s.selectors, !1))
        if ((r || (r = []), vn(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (o = o || new Map()),
              s.findHostDirectiveDefs(s, a, o),
              r.unshift(...a, s);
            let u = a.length;
            Ti(e, t, u);
          } else r.unshift(s), Ti(e, t, 0);
        else
          (o = o || new Map()), s.findHostDirectiveDefs?.(s, r, o), r.push(s);
    }
  return r === null ? null : [r, o];
}
function Ti(e, t, n) {
  (t.componentOffset = n), (e.components ??= []).push(t.index);
}
function Yp(e, t, n) {
  if (t) {
    let r = (e.localNames = []);
    for (let o = 0; o < t.length; o += 2) {
      let i = n[t[o + 1]];
      if (i == null) throw new v(-301, !1);
      r.push(t[o], i);
    }
  }
}
function Kp(e, t, n) {
  if (n) {
    if (t.exportAs)
      for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
    vn(t) && (n[""] = e);
  }
}
function Jp(e, t, n) {
  (e.flags |= 1),
    (e.directiveStart = t),
    (e.directiveEnd = t + n),
    (e.providerIndexes = t);
}
function Xp(e, t, n, r, o) {
  e.data[r] = o;
  let i = o.factory || (o.factory = Nt(o.type, !0)),
    s = new cn(i, vn(o), cs);
  (e.blueprint[r] = s), (n[r] = s), Gp(e, t, r, nl(e, n, o.hostVars, el), o);
}
function eg(e, t, n) {
  let r = Oe(t, e),
    o = il(n),
    i = e[Te].rendererFactory,
    s = 16;
  n.signals ? (s = 4096) : n.onPush && (s = 64);
  let a = fs(
    e,
    ls(e, o, null, s, r, t, null, i.createRenderer(r, n), null, null, null),
  );
  e[t.index] = a;
}
function tg(e, t, n, r, o, i) {
  let s = i[t];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let u = s[a++],
        c = s[a++],
        l = s[a++],
        d = s[a++];
      tl(r, n, u, c, l, d);
    }
}
function ng(e, t, n) {
  let r = null,
    o = 0;
  for (; o < n.length; ) {
    let i = n[o];
    if (i === 0) {
      o += 4;
      continue;
    } else if (i === 5) {
      o += 2;
      continue;
    }
    if (typeof i == "number") break;
    if (e.hasOwnProperty(i)) {
      r === null && (r = []);
      let s = e[i];
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === t) {
          r.push(i, s[a + 1], s[a + 2], n[o + 1]);
          break;
        }
    }
    o += 2;
  }
  return r;
}
function rg(e, t, n, r) {
  return [e, !0, 0, t, null, r, null, n, null, null];
}
function cl(e, t) {
  let n = e.contentQueries;
  if (n !== null) {
    let r = P(null);
    try {
      for (let o = 0; o < n.length; o += 2) {
        let i = n[o],
          s = n[o + 1];
        if (s !== -1) {
          let a = e.data[s];
          lc(i), a.contentQueries(2, t[s], s);
        }
      }
    } finally {
      P(r);
    }
  }
}
function fs(e, t) {
  return e[an] ? (e[ru][he] = t) : (e[an] = t), (e[ru] = t), t;
}
function xi(e, t, n) {
  lc(0);
  let r = P(null);
  try {
    t(e, n);
  } finally {
    P(r);
  }
}
function og(e, t) {
  let n = e[Rt],
    r = n ? n.get(xe, null) : null;
  r && r.handleError(t);
}
function ll(e, t, n, r, o) {
  for (let i = 0; i < n.length; ) {
    let s = n[i++],
      a = n[i++],
      u = n[i++],
      c = t[s],
      l = e.data[s];
    tl(l, c, r, a, u, o);
  }
}
function ig(e, t) {
  let n = yn(t, e),
    r = n[M];
  sg(r, n);
  let o = n[Ae];
  o !== null && n[Mr] === null && (n[Mr] = is(o, n[Rt])), dl(r, n, n[ze]);
}
function sg(e, t) {
  for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
}
function dl(e, t, n) {
  Qi(t);
  try {
    let r = e.viewQuery;
    r !== null && xi(1, r, n);
    let o = e.template;
    o !== null && rl(e, t, o, 1, n),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[Gr]?.finishViewCreation(e),
      e.staticContentQueries && cl(e, t),
      e.staticViewQueries && xi(2, e.viewQuery, n);
    let i = e.components;
    i !== null && ag(t, i);
  } catch (r) {
    throw (
      (e.firstCreatePass &&
        ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
      r)
    );
  } finally {
    (t[C] &= -5), Yi();
  }
}
function ag(e, t) {
  for (let n = 0; n < t.length; n++) ig(e, t[n]);
}
function wu(e, t) {
  return !t || t.firstChild === null || kc(e);
}
function ug(e, t, n, r = !0) {
  let o = t[M];
  if ((wp(o, t, e, n), r)) {
    let s = _i(n, e),
      a = t[Ee],
      u = Qc(a, e[nt]);
    u !== null && yp(o, e[ge], a, t, u, s);
  }
  let i = t[Mr];
  i !== null && i.firstChild !== null && (i.firstChild = null);
}
function Fr(e, t, n, r, o = !1) {
  for (; n !== null; ) {
    if (n.type === 128) {
      n = o ? n.projectionNext : n.next;
      continue;
    }
    let i = t[n.index];
    i !== null && r.push(Ge(i)), Re(i) && cg(i, r);
    let s = n.type;
    if (s & 8) Fr(e, t, n.child, r);
    else if (s & 32) {
      let a = ss(n, t),
        u;
      for (; (u = a()); ) r.push(u);
    } else if (s & 16) {
      let a = Kc(t, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let u = rt(t[be]);
        Fr(u[M], u, a, r, !0);
      }
    }
    n = o ? n.projectionNext : n.next;
  }
  return r;
}
function cg(e, t) {
  for (let n = ie; n < e.length; n++) {
    let r = e[n],
      o = r[M].firstChild;
    o !== null && Fr(r[M], r, o, t);
  }
  e[nt] !== e[Ae] && t.push(e[nt]);
}
var fl = [];
function lg(e) {
  return e[oe] ?? dg(e);
}
function dg(e) {
  let t = fl.pop() ?? Object.create(hg);
  return (t.lView = e), t;
}
function fg(e) {
  e.lView[oe] !== e && ((e.lView = null), fl.push(e));
}
var hg = k(g({}, xo), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (e) => {
    Qr(e.lView);
  },
  consumerOnSignalRead() {
    this.lView[oe] = this;
  },
});
function pg(e) {
  let t = e[oe] ?? Object.create(gg);
  return (t.lView = e), t;
}
var gg = k(g({}, xo), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (e) => {
    let t = rt(e.lView);
    for (; t && !hl(t[M]); ) t = rt(t);
    t && rc(t);
  },
  consumerOnSignalRead() {
    this.lView[oe] = this;
  },
});
function hl(e) {
  return e.type !== 2;
}
var mg = 100;
function pl(e, t = !0, n = 0) {
  let r = e[Te],
    o = r.rendererFactory,
    i = !1;
  i || o.begin?.();
  try {
    vg(e, n);
  } catch (s) {
    throw (t && og(e, s), s);
  } finally {
    i || (o.end?.(), r.inlineEffectRunner?.flush());
  }
}
function vg(e, t) {
  let n = cc();
  try {
    su(!0), Ni(e, t);
    let r = 0;
    for (; Zr(e); ) {
      if (r === mg) throw new v(103, !1);
      r++, Ni(e, 1);
    }
  } finally {
    su(n);
  }
}
function yg(e, t, n, r) {
  let o = t[C];
  if ((o & 256) === 256) return;
  let i = !1,
    s = !1;
  !i && t[Te].inlineEffectRunner?.flush(), Qi(t);
  let a = !0,
    u = null,
    c = null;
  i ||
    (hl(e)
      ? ((c = lg(t)), (u = No(c)))
      : ga() === null
        ? ((a = !1), (c = pg(t)), (u = No(c)))
        : t[oe] && (Ro(t[oe]), (t[oe] = null)));
  try {
    nc(t), _h(e.bindingStartIndex), n !== null && rl(e, t, n, 2, r);
    let l = (o & 3) === 3;
    if (!i)
      if (l) {
        let f = e.preOrderCheckHooks;
        f !== null && yr(t, f, null);
      } else {
        let f = e.preOrderHooks;
        f !== null && Dr(t, f, 0, null), ei(t, 0);
      }
    if ((s || Dg(t), gl(t, 0), e.contentQueries !== null && cl(e, t), !i))
      if (l) {
        let f = e.contentCheckHooks;
        f !== null && yr(t, f);
      } else {
        let f = e.contentHooks;
        f !== null && Dr(t, f, 1), ei(t, 1);
      }
    Pp(e, t);
    let d = e.components;
    d !== null && vl(t, d, 0);
    let p = e.viewQuery;
    if ((p !== null && xi(2, p, r), !i))
      if (l) {
        let f = e.viewCheckHooks;
        f !== null && yr(t, f);
      } else {
        let f = e.viewHooks;
        f !== null && Dr(t, f, 2), ei(t, 2);
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[Xo])) {
      for (let f of t[Xo]) f();
      t[Xo] = null;
    }
    i || (t[C] &= -73);
  } catch (l) {
    throw (i || Qr(t), l);
  } finally {
    c !== null && (ma(c, u), a && fg(c)), Yi();
  }
}
function gl(e, t) {
  for (let n = jc(e); n !== null; n = Vc(n))
    for (let r = ie; r < n.length; r++) {
      let o = n[r];
      ml(o, t);
    }
}
function Dg(e) {
  for (let t = jc(e); t !== null; t = Vc(t)) {
    if (!(t[C] & xr.HasTransplantedViews)) continue;
    let n = t[Tr];
    for (let r = 0; r < n.length; r++) {
      let o = n[r];
      rc(o);
    }
  }
}
function wg(e, t, n) {
  let r = yn(t, e);
  ml(r, n);
}
function ml(e, t) {
  Wi(e) && Ni(e, t);
}
function Ni(e, t) {
  let r = e[M],
    o = e[C],
    i = e[oe],
    s = !!(t === 0 && o & 16);
  if (
    ((s ||= !!(o & 64 && t === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && Ao(i))),
    (s ||= !1),
    i && (i.dirty = !1),
    (e[C] &= -9217),
    s)
  )
    yg(r, e, r.template, e[ze]);
  else if (o & 8192) {
    gl(e, 1);
    let a = r.components;
    a !== null && vl(e, a, 1);
  }
}
function vl(e, t, n) {
  for (let r = 0; r < t.length; r++) wg(e, t[r], n);
}
function yl(e, t) {
  let n = cc() ? 64 : 1088;
  for (e[Te].changeDetectionScheduler?.notify(t); e; ) {
    e[C] |= n;
    let r = rt(e);
    if (hi(e) && !r) return e;
    e = r;
  }
  return null;
}
var Pt = class {
  get rootNodes() {
    let t = this._lView,
      n = t[M];
    return Fr(n, t, n.firstChild, []);
  }
  constructor(t, n, r = !0) {
    (this._lView = t),
      (this._cdRefInjectingView = n),
      (this.notifyErrorHandler = r),
      (this._appRef = null),
      (this._attachedToViewContainer = !1);
  }
  get context() {
    return this._lView[ze];
  }
  set context(t) {
    this._lView[ze] = t;
  }
  get destroyed() {
    return (this._lView[C] & 256) === 256;
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
      let t = this._lView[Q];
      if (Re(t)) {
        let n = t[_r],
          r = n ? n.indexOf(this) : -1;
        r > -1 && (Mi(t, r), br(n, r));
      }
      this._attachedToViewContainer = !1;
    }
    Wc(this._lView[M], this._lView);
  }
  onDestroy(t) {
    oc(this._lView, t);
  }
  markForCheck() {
    yl(this._cdRefInjectingView || this._lView, 4);
  }
  detach() {
    this._lView[C] &= -129;
  }
  reattach() {
    gi(this._lView), (this._lView[C] |= 128);
  }
  detectChanges() {
    (this._lView[C] |= 1024), pl(this._lView, this.notifyErrorHandler);
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new v(902, !1);
    this._attachedToViewContainer = !0;
  }
  detachFromAppRef() {
    this._appRef = null;
    let t = hi(this._lView),
      n = this._lView[un];
    n !== null && !t && as(n, this._lView), Gc(this._lView[M], this._lView);
  }
  attachToAppRef(t) {
    if (this._attachedToViewContainer) throw new v(902, !1);
    this._appRef = t;
    let n = hi(this._lView),
      r = this._lView[un];
    r !== null && !n && qc(r, this._lView), gi(this._lView);
  }
};
var vb = new RegExp(`^(\\d+)*(${fp}|${dp})*(.*)`);
var Cg = () => null;
function Cu(e, t) {
  return Cg(e, t);
}
var Ft = class {},
  Xr = new E("", { providedIn: "root", factory: () => !1 });
var Dl = new E(""),
  wl = new E(""),
  Ai = class {},
  kr = class {};
function Ig(e) {
  let t = Error(`No component factory found for ${X(e)}.`);
  return (t[Eg] = e), t;
}
var Eg = "ngComponent";
var Ri = class {
    resolveComponentFactory(t) {
      throw Ig(t);
    }
  },
  kt = class {
    static {
      this.NULL = new Ri();
    }
  },
  Lt = class {};
var bg = (() => {
  class e {
    static {
      this.ɵprov = D({ token: e, providedIn: "root", factory: () => null });
    }
  }
  return e;
})();
function Oi(e, t, n) {
  let r = n ? e.styles : null,
    o = n ? e.classes : null,
    i = 0;
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if (typeof a == "number") i = a;
      else if (i == 1) o = qa(o, a);
      else if (i == 2) {
        let u = a,
          c = t[++s];
        r = qa(r, u + ": " + c + ";");
      }
    }
  n ? (e.styles = r) : (e.stylesWithoutHost = r),
    n ? (e.classes = o) : (e.classesWithoutHost = o);
}
var Lr = class extends kt {
  constructor(t) {
    super(), (this.ngModule = t);
  }
  resolveComponentFactory(t) {
    let n = et(t);
    return new dn(n, this.ngModule);
  }
};
function Iu(e, t) {
  let n = [];
  for (let r in e) {
    if (!e.hasOwnProperty(r)) continue;
    let o = e[r];
    if (o === void 0) continue;
    let i = Array.isArray(o),
      s = i ? o[0] : o,
      a = i ? o[1] : He.None;
    t
      ? n.push({
          propName: s,
          templateName: r,
          isSignal: (a & He.SignalBased) !== 0,
        })
      : n.push({ propName: s, templateName: r });
  }
  return n;
}
function Sg(e) {
  let t = e.toLowerCase();
  return t === "svg" ? ph : t === "math" ? gh : null;
}
var dn = class extends kr {
    get inputs() {
      let t = this.componentDef,
        n = t.inputTransforms,
        r = Iu(t.inputs, !0);
      if (n !== null)
        for (let o of r)
          n.hasOwnProperty(o.propName) && (o.transform = n[o.propName]);
      return r;
    }
    get outputs() {
      return Iu(this.componentDef.outputs, !1);
    }
    constructor(t, n) {
      super(),
        (this.componentDef = t),
        (this.ngModule = n),
        (this.componentType = t.type),
        (this.selector = qf(t.selectors)),
        (this.ngContentSelectors = t.ngContentSelectors
          ? t.ngContentSelectors
          : []),
        (this.isBoundToModule = !!n);
    }
    create(t, n, r, o) {
      let i = P(null);
      try {
        o = o || this.ngModule;
        let s = o instanceof se ? o : o?.injector;
        s &&
          this.componentDef.getStandaloneInjector !== null &&
          (s = this.componentDef.getStandaloneInjector(s) || s);
        let a = s ? new vi(t, s) : t,
          u = a.get(Lt, null);
        if (u === null) throw new v(407, !1);
        let c = a.get(bg, null),
          l = a.get(Ft, null),
          d = {
            rendererFactory: u,
            sanitizer: c,
            inlineEffectRunner: null,
            changeDetectionScheduler: l,
          },
          p = u.createRenderer(null, this.componentDef),
          f = this.componentDef.selectors[0][0] || "div",
          m = r
            ? Vp(p, r, this.componentDef.encapsulation, a)
            : zc(p, f, Sg(f)),
          A = 512;
        this.componentDef.signals
          ? (A |= 4096)
          : this.componentDef.onPush || (A |= 16);
        let $ = null;
        m !== null && ($ = is(m, a, !0));
        let L = sl(0, null, null, 1, 0, null, null, null, null, null, null),
          ve = ls(null, L, null, A, null, null, d, p, a, null, $);
        Qi(ve);
        let Ze,
          Zn,
          Qn = null;
        try {
          let ye = this.componentDef,
            ht,
            Mo = null;
          ye.findHostDirectiveDefs
            ? ((ht = []),
              (Mo = new Map()),
              ye.findHostDirectiveDefs(ye, ht, Mo),
              ht.push(ye))
            : (ht = [ye]);
          let kd = Mg(ve, m);
          (Qn = _g(kd, m, ye, ht, ve, d, p)),
            (Zn = mh(L, tt)),
            m && Ng(p, ye, m, r),
            n !== void 0 && Ag(Zn, this.ngContentSelectors, n),
            (Ze = xg(Qn, ye, ht, Mo, ve, [Rg])),
            dl(L, ve, null);
        } catch (ye) {
          throw (Qn !== null && bi(Qn), bi(ve), ye);
        } finally {
          Yi();
        }
        return new Pi(this.componentType, Ze, ts(Zn, ve), ve, Zn);
      } finally {
        P(i);
      }
    }
  },
  Pi = class extends Ai {
    constructor(t, n, r, o, i) {
      super(),
        (this.location = r),
        (this._rootLView = o),
        (this._tNode = i),
        (this.previousInputValues = null),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new Pt(o, void 0, !1)),
        (this.componentType = t);
    }
    setInput(t, n) {
      let r = this._tNode.inputs,
        o;
      if (r !== null && (o = r[t])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(t) &&
            Object.is(this.previousInputValues.get(t), n))
        )
          return;
        let i = this._rootLView;
        ll(i[M], i, o, t, n), this.previousInputValues.set(t, n);
        let s = yn(this._tNode.index, i);
        yl(s, 1);
      }
    }
    get injector() {
      return new Xe(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(t) {
      this.hostView.onDestroy(t);
    }
  };
function Mg(e, t) {
  let n = e[M],
    r = tt;
  return (e[r] = t), ds(n, r, 2, "#host", null);
}
function _g(e, t, n, r, o, i, s) {
  let a = o[M];
  Tg(r, e, t, s);
  let u = null;
  t !== null && (u = is(t, o[Rt]));
  let c = i.rendererFactory.createRenderer(t, n),
    l = 16;
  n.signals ? (l = 4096) : n.onPush && (l = 64);
  let d = ls(o, il(n), null, l, o[e.index], e, i, c, null, null, u);
  return (
    a.firstCreatePass && Ti(a, e, r.length - 1), fs(o, d), (o[e.index] = d)
  );
}
function Tg(e, t, n, r) {
  for (let o of e) t.mergedAttrs = Bi(t.mergedAttrs, o.hostAttrs);
  t.mergedAttrs !== null &&
    (Oi(t, t.mergedAttrs, !0), n !== null && Xc(r, n, t));
}
function xg(e, t, n, r, o, i) {
  let s = Pe(),
    a = o[M],
    u = Oe(s, o);
  al(a, o, s, n, null, r);
  for (let l = 0; l < n.length; l++) {
    let d = s.directiveStart + l,
      p = ln(o, a, d, s);
    Ot(p, o);
  }
  ul(a, o, s), u && Ot(u, o);
  let c = ln(o, a, s.directiveStart + s.componentOffset, s);
  if (((e[ze] = o[ze] = c), i !== null)) for (let l of i) l(c, t);
  return ol(a, s, o), c;
}
function Ng(e, t, n, r) {
  if (r) ui(e, n, ["ng-version", "18.2.7"]);
  else {
    let { attrs: o, classes: i } = Wf(t.selectors[0]);
    o && ui(e, n, o), i && i.length > 0 && Jc(e, n, i.join(" "));
  }
}
function Ag(e, t, n) {
  let r = (e.projection = []);
  for (let o = 0; o < t.length; o++) {
    let i = n[o];
    r.push(i != null ? Array.from(i) : null);
  }
}
function Rg() {
  let e = Pe();
  Dc(pe()[M], e);
}
var eo = (() => {
  class e {
    static {
      this.__NG_ELEMENT_ID__ = Og;
    }
  }
  return e;
})();
function Og() {
  let e = Pe();
  return Fg(e, pe());
}
var Pg = eo,
  Cl = class extends Pg {
    constructor(t, n, r) {
      super(),
        (this._lContainer = t),
        (this._hostTNode = n),
        (this._hostLView = r);
    }
    get element() {
      return ts(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new Xe(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let t = Ki(this._hostTNode, this._hostLView);
      if (Cc(t)) {
        let n = Ar(t, this._hostLView),
          r = Nr(t),
          o = n[M].data[r + 8];
        return new Xe(o, n);
      } else return new Xe(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(t) {
      let n = Eu(this._lContainer);
      return (n !== null && n[t]) || null;
    }
    get length() {
      return this._lContainer.length - ie;
    }
    createEmbeddedView(t, n, r) {
      let o, i;
      typeof r == "number"
        ? (o = r)
        : r != null && ((o = r.index), (i = r.injector));
      let s = Cu(this._lContainer, t.ssrId),
        a = t.createEmbeddedViewImpl(n || {}, i, s);
      return this.insertImpl(a, o, wu(this._hostTNode, s)), a;
    }
    createComponent(t, n, r, o, i) {
      let s = t && !ch(t),
        a;
      if (s) a = n;
      else {
        let m = n || {};
        (a = m.index),
          (r = m.injector),
          (o = m.projectableNodes),
          (i = m.environmentInjector || m.ngModuleRef);
      }
      let u = s ? t : new dn(et(t)),
        c = r || this.parentInjector;
      if (!i && u.ngModule == null) {
        let A = (s ? c : this.parentInjector).get(se, null);
        A && (i = A);
      }
      let l = et(u.componentType ?? {}),
        d = Cu(this._lContainer, l?.id ?? null),
        p = d?.firstChild ?? null,
        f = u.create(c, o, p, i);
      return this.insertImpl(f.hostView, a, wu(this._hostTNode, d)), f;
    }
    insert(t, n) {
      return this.insertImpl(t, n, !0);
    }
    insertImpl(t, n, r) {
      let o = t._lView;
      if (vh(o)) {
        let a = this.indexOf(t);
        if (a !== -1) this.detach(a);
        else {
          let u = o[Q],
            c = new Cl(u, u[ge], u[Q]);
          c.detach(c.indexOf(t));
        }
      }
      let i = this._adjustIndex(n),
        s = this._lContainer;
      return ug(s, o, i, r), t.attachToViewContainerRef(), Fu(ii(s), i, t), t;
    }
    move(t, n) {
      return this.insert(t, n);
    }
    indexOf(t) {
      let n = Eu(this._lContainer);
      return n !== null ? n.indexOf(t) : -1;
    }
    remove(t) {
      let n = this._adjustIndex(t, -1),
        r = Mi(this._lContainer, n);
      r && (br(ii(this._lContainer), n), Wc(r[M], r));
    }
    detach(t) {
      let n = this._adjustIndex(t, -1),
        r = Mi(this._lContainer, n);
      return r && br(ii(this._lContainer), n) != null ? new Pt(r) : null;
    }
    _adjustIndex(t, n = 0) {
      return t ?? this.length + n;
    }
  };
function Eu(e) {
  return e[_r];
}
function ii(e) {
  return e[_r] || (e[_r] = []);
}
function Fg(e, t) {
  let n,
    r = t[e.index];
  return (
    Re(r) ? (n = r) : ((n = rg(r, t, null, e)), (t[e.index] = n), fs(t, n)),
    Lg(n, t, e, r),
    new Cl(n, e, t)
  );
}
function kg(e, t) {
  let n = e[Ee],
    r = n.createComment(""),
    o = Oe(t, e),
    i = Qc(n, o);
  return Pr(n, i, r, Sp(n, o), !1), r;
}
var Lg = jg;
function jg(e, t, n, r) {
  if (e[nt]) return;
  let o;
  n.type & 8 ? (o = Ge(r)) : (o = kg(t, n)), (e[nt] = o);
}
var bu = new Set();
function hs(e) {
  bu.has(e) ||
    (bu.add(e),
    performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
}
var qe = class {},
  fn = class {};
var Fi = class extends qe {
    constructor(t, n, r, o = !0) {
      super(),
        (this.ngModuleType = t),
        (this._parent = n),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new Lr(this));
      let i = Hu(t);
      (this._bootstrapComponents = Hc(i.bootstrap)),
        (this._r3Injector = Ac(
          t,
          n,
          [
            { provide: qe, useValue: this },
            { provide: kt, useValue: this.componentFactoryResolver },
            ...r,
          ],
          X(t),
          new Set(["environment"]),
        )),
        o && this.resolveInjectorInitializers();
    }
    resolveInjectorInitializers() {
      this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(this.ngModuleType));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let t = this._r3Injector;
      !t.destroyed && t.destroy(),
        this.destroyCbs.forEach((n) => n()),
        (this.destroyCbs = null);
    }
    onDestroy(t) {
      this.destroyCbs.push(t);
    }
  },
  ki = class extends fn {
    constructor(t) {
      super(), (this.moduleType = t);
    }
    create(t) {
      return new Fi(this.moduleType, t, []);
    }
  };
var jr = class extends qe {
  constructor(t) {
    super(),
      (this.componentFactoryResolver = new Lr(this)),
      (this.instance = null);
    let n = new sn(
      [
        ...t.providers,
        { provide: qe, useValue: this },
        { provide: kt, useValue: this.componentFactoryResolver },
      ],
      t.parent || Gi(),
      t.debugName,
      new Set(["environment"]),
    );
    (this.injector = n),
      t.runEnvironmentInitializers && n.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(t) {
    this.injector.onDestroy(t);
  }
};
function ps(e, t, n = null) {
  return new jr({
    providers: e,
    parent: t,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector;
}
function Vg(e) {
  return (e.flags & 32) === 32;
}
var tn = (function (e) {
    return (
      (e[(e.EarlyRead = 0)] = "EarlyRead"),
      (e[(e.Write = 1)] = "Write"),
      (e[(e.MixedReadWrite = 2)] = "MixedReadWrite"),
      (e[(e.Read = 3)] = "Read"),
      e
    );
  })(tn || {}),
  $g = (() => {
    class e {
      constructor() {
        this.impl = null;
      }
      execute() {
        this.impl?.execute();
      }
      static {
        this.ɵprov = D({
          token: e,
          providedIn: "root",
          factory: () => new e(),
        });
      }
    }
    return e;
  })(),
  Su = class e {
    constructor() {
      (this.ngZone = h(V)),
        (this.scheduler = h(Ft)),
        (this.errorHandler = h(xe, { optional: !0 })),
        (this.sequences = new Set()),
        (this.deferredRegistrations = new Set()),
        (this.executing = !1);
    }
    static {
      this.PHASES = [tn.EarlyRead, tn.Write, tn.MixedReadWrite, tn.Read];
    }
    execute() {
      this.executing = !0;
      for (let t of e.PHASES)
        for (let n of this.sequences)
          if (!(n.erroredOrDestroyed || !n.hooks[t]))
            try {
              n.pipelinedValue = this.ngZone.runOutsideAngular(() =>
                n.hooks[t](n.pipelinedValue),
              );
            } catch (r) {
              (n.erroredOrDestroyed = !0), this.errorHandler?.handleError(r);
            }
      this.executing = !1;
      for (let t of this.sequences)
        t.afterRun(), t.once && this.sequences.delete(t);
      for (let t of this.deferredRegistrations) this.sequences.add(t);
      this.deferredRegistrations.size > 0 && this.scheduler.notify(7),
        this.deferredRegistrations.clear();
    }
    register(t) {
      this.executing
        ? this.deferredRegistrations.add(t)
        : (this.sequences.add(t), this.scheduler.notify(6));
    }
    unregister(t) {
      this.executing && this.sequences.has(t)
        ? ((t.erroredOrDestroyed = !0),
          (t.pipelinedValue = void 0),
          (t.once = !0))
        : (this.sequences.delete(t), this.deferredRegistrations.delete(t));
    }
    static {
      this.ɵprov = D({ token: e, providedIn: "root", factory: () => new e() });
    }
  };
function Mu(e, t, n, r, o) {
  let i = t.inputs,
    s = o ? "class" : "style";
  ll(e, n, i[s], s, r);
}
function Bg(e, t, n, r, o, i) {
  let s = t.consts,
    a = iu(s, o),
    u = ds(t, e, 2, r, a);
  return (
    zp(t, n, u, iu(s, i)),
    u.attrs !== null && Oi(u, u.attrs, !1),
    u.mergedAttrs !== null && Oi(u, u.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, u),
    u
  );
}
function Dn(e, t, n, r) {
  let o = pe(),
    i = Zi(),
    s = tt + e,
    a = o[Ee],
    u = i.firstCreatePass ? Bg(s, i, o, t, n, r) : i.data[s],
    c = Ug(i, o, u, a, t, e);
  o[s] = c;
  let l = lh(u);
  return (
    Yr(u, !0),
    Xc(a, c, u),
    !Vg(u) && vc() && Yc(i, o, c, u),
    Dh() === 0 && Ot(c, o),
    wh(),
    l && (kp(i, o, u), ol(i, u, o)),
    r !== null && Lp(o, u),
    Dn
  );
}
function wn() {
  let e = Pe();
  uc() ? Mh() : ((e = e.parent), Yr(e, !1));
  let t = e;
  Eh(t) && bh(), Ch();
  let n = Zi();
  return (
    n.firstCreatePass && (Dc(n, e), Ku(e) && n.queries.elementEnd(e)),
    t.classesWithoutHost != null &&
      Lh(t) &&
      Mu(n, t, pe(), t.classesWithoutHost, !0),
    t.stylesWithoutHost != null &&
      jh(t) &&
      Mu(n, t, pe(), t.stylesWithoutHost, !1),
    wn
  );
}
function gs(e, t, n, r) {
  return Dn(e, t, n, r), wn(), gs;
}
var Ug = (e, t, n, r, o, i) => (yc(!0), zc(r, o, Oh()));
var Vr = "en-US";
var Hg = Vr;
function zg(e) {
  typeof e == "string" && (Hg = e.toLowerCase().replace(/_/g, "-"));
}
function ms(e, t = "") {
  let n = pe(),
    r = Zi(),
    o = e + tt,
    i = r.firstCreatePass ? ds(r, o, 1, t, null) : r.data[o],
    s = Gg(r, n, i, t, e);
  (n[o] = s), vc() && Yc(r, n, s, i), Yr(i, !1);
}
var Gg = (e, t, n, r, o) => (yc(!0), mp(t[Ee], r));
var qg = (() => {
  class e {
    constructor(n) {
      (this._injector = n), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let r = qu(!1, n.type),
          o =
            r.length > 0
              ? ps([r], this._injector, `Standalone[${n.type.name}]`)
              : null;
        this.cachedInjectors.set(n, o);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
    static {
      this.ɵprov = D({
        token: e,
        providedIn: "environment",
        factory: () => new e(_(se)),
      });
    }
  }
  return e;
})();
function Cn(e) {
  hs("NgStandalone"),
    (e.getStandaloneInjector = (t) =>
      t.get(qg).getOrCreateStandaloneInjector(e));
}
var to = (() => {
  class e {
    log(n) {
      console.log(n);
    }
    warn(n) {
      console.warn(n);
    }
    static {
      this.ɵfac = function (r) {
        return new (r || e)();
      };
    }
    static {
      this.ɵprov = D({ token: e, factory: e.ɵfac, providedIn: "platform" });
    }
  }
  return e;
})();
var Il = new E("");
function In(e) {
  return !!e && typeof e.then == "function";
}
function El(e) {
  return !!e && typeof e.subscribe == "function";
}
var bl = new E(""),
  Sl = (() => {
    class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((n, r) => {
            (this.resolve = n), (this.reject = r);
          })),
          (this.appInits = h(bl, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let o of this.appInits) {
          let i = o();
          if (In(i)) n.push(i);
          else if (El(i)) {
            let s = new Promise((a, u) => {
              i.subscribe({ complete: a, error: u });
            });
            n.push(s);
          }
        }
        let r = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(n)
          .then(() => {
            r();
          })
          .catch((o) => {
            this.reject(o);
          }),
          n.length === 0 && r(),
          (this.initialized = !0);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  vs = new E("");
function Wg() {
  va(() => {
    throw new v(600, !1);
  });
}
function Zg(e) {
  return e.isBoundToModule;
}
var Qg = 10;
function Yg(e, t, n) {
  try {
    let r = n();
    return In(r)
      ? r.catch((o) => {
          throw (t.runOutsideAngular(() => e.handleError(o)), o);
        })
      : r;
  } catch (r) {
    throw (t.runOutsideAngular(() => e.handleError(r)), r);
  }
}
var at = (() => {
  class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = h(op)),
        (this.afterRenderManager = h($g)),
        (this.zonelessEnabled = h(Xr)),
        (this.dirtyFlags = 0),
        (this.deferredDirtyFlags = 0),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new W()),
        (this.afterTick = new W()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = h(jt).hasPendingTasks.pipe(S((n) => !n))),
        (this._injector = h(se));
    }
    get allViews() {
      return [...this.externalTestViews.keys(), ...this._views];
    }
    get destroyed() {
      return this._destroyed;
    }
    whenStable() {
      let n;
      return new Promise((r) => {
        n = this.isStable.subscribe({
          next: (o) => {
            o && r();
          },
        });
      }).finally(() => {
        n.unsubscribe();
      });
    }
    get injector() {
      return this._injector;
    }
    bootstrap(n, r) {
      let o = n instanceof kr;
      if (!this._injector.get(Sl).done) {
        let p = !o && Uu(n),
          f = !1;
        throw new v(405, f);
      }
      let s;
      o ? (s = n) : (s = this._injector.get(kt).resolveComponentFactory(n)),
        this.componentTypes.push(s.componentType);
      let a = Zg(s) ? void 0 : this._injector.get(qe),
        u = r || s.selector,
        c = s.create(it.NULL, [], u, a),
        l = c.location.nativeElement,
        d = c.injector.get(Il, null);
      return (
        d?.registerApplication(l),
        c.onDestroy(() => {
          this.detachView(c.hostView),
            wr(this.components, c),
            d?.unregisterApplication(l);
        }),
        this._loadComponent(c),
        c
      );
    }
    tick() {
      this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick();
    }
    _tick() {
      if (this._runningTick) throw new v(101, !1);
      let n = P(null);
      try {
        (this._runningTick = !0), this.synchronize();
      } catch (r) {
        this.internalErrorHandler(r);
      } finally {
        (this._runningTick = !1), P(n), this.afterTick.next();
      }
    }
    synchronize() {
      let n = null;
      this._injector.destroyed ||
        (n = this._injector.get(Lt, null, { optional: !0 })),
        (this.dirtyFlags |= this.deferredDirtyFlags),
        (this.deferredDirtyFlags = 0);
      let r = 0;
      for (; this.dirtyFlags !== 0 && r++ < Qg; ) this.synchronizeOnce(n);
    }
    synchronizeOnce(n) {
      if (
        ((this.dirtyFlags |= this.deferredDirtyFlags),
        (this.deferredDirtyFlags = 0),
        this.dirtyFlags & 7)
      ) {
        let r = !!(this.dirtyFlags & 1);
        (this.dirtyFlags &= -8),
          (this.dirtyFlags |= 8),
          this.beforeRender.next(r);
        for (let { _lView: o, notifyErrorHandler: i } of this._views)
          Kg(o, i, r, this.zonelessEnabled);
        if (
          ((this.dirtyFlags &= -5),
          this.syncDirtyFlagsWithViews(),
          this.dirtyFlags & 7)
        )
          return;
      } else n?.begin?.(), n?.end?.();
      this.dirtyFlags & 8 &&
        ((this.dirtyFlags &= -9), this.afterRenderManager.execute()),
        this.syncDirtyFlagsWithViews();
    }
    syncDirtyFlagsWithViews() {
      if (this.allViews.some(({ _lView: n }) => Zr(n))) {
        this.dirtyFlags |= 2;
        return;
      } else this.dirtyFlags &= -8;
    }
    attachView(n) {
      let r = n;
      this._views.push(r), r.attachToAppRef(this);
    }
    detachView(n) {
      let r = n;
      wr(this._views, r), r.detachFromAppRef();
    }
    _loadComponent(n) {
      this.attachView(n.hostView), this.tick(), this.components.push(n);
      let r = this._injector.get(vs, []);
      [...this._bootstrapListeners, ...r].forEach((o) => o(n));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((n) => n()),
            this._views.slice().forEach((n) => n.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(n) {
      return (
        this._destroyListeners.push(n), () => wr(this._destroyListeners, n)
      );
    }
    destroy() {
      if (this._destroyed) throw new v(406, !1);
      let n = this._injector;
      n.destroy && !n.destroyed && n.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
    static {
      this.ɵfac = function (r) {
        return new (r || e)();
      };
    }
    static {
      this.ɵprov = D({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
  }
  return e;
})();
function wr(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function Kg(e, t, n, r) {
  if (!n && !Zr(e)) return;
  pl(e, t, n && !r ? 0 : 1);
}
var Li = class {
    constructor(t, n) {
      (this.ngModuleFactory = t), (this.componentFactories = n);
    }
  },
  ys = (() => {
    class e {
      compileModuleSync(n) {
        return new ki(n);
      }
      compileModuleAsync(n) {
        return Promise.resolve(this.compileModuleSync(n));
      }
      compileModuleAndAllComponentsSync(n) {
        let r = this.compileModuleSync(n),
          o = Hu(n),
          i = Hc(o.declarations).reduce((s, a) => {
            let u = et(a);
            return u && s.push(new dn(u)), s;
          }, []);
        return new Li(r, i);
      }
      compileModuleAndAllComponentsAsync(n) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
      }
      clearCache() {}
      clearCacheFor(n) {}
      getModuleId(n) {}
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })();
var Jg = (() => {
    class e {
      constructor() {
        (this.zone = h(V)),
          (this.changeDetectionScheduler = h(Ft)),
          (this.applicationRef = h(at));
      }
      initialize() {
        this._onMicrotaskEmptySubscription ||
          (this._onMicrotaskEmptySubscription =
            this.zone.onMicrotaskEmpty.subscribe({
              next: () => {
                this.changeDetectionScheduler.runningTick ||
                  this.zone.run(() => {
                    this.applicationRef.tick();
                  });
              },
            }));
      }
      ngOnDestroy() {
        this._onMicrotaskEmptySubscription?.unsubscribe();
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  Xg = new E("", { factory: () => !1 });
function Ml({
  ngZoneFactory: e,
  ignoreChangesOutsideZone: t,
  scheduleInRootZone: n,
}) {
  return (
    (e ??= () => new V(k(g({}, Tl()), { scheduleInRootZone: n }))),
    [
      { provide: V, useFactory: e },
      {
        provide: At,
        multi: !0,
        useFactory: () => {
          let r = h(Jg, { optional: !0 });
          return () => r.initialize();
        },
      },
      {
        provide: At,
        multi: !0,
        useFactory: () => {
          let r = h(em);
          return () => {
            r.initialize();
          };
        },
      },
      t === !0 ? { provide: Dl, useValue: !0 } : [],
      { provide: wl, useValue: n ?? Rc },
    ]
  );
}
function _l(e) {
  let t = e?.ignoreChangesOutsideZone,
    n = e?.scheduleInRootZone,
    r = Ml({
      ngZoneFactory: () => {
        let o = Tl(e);
        return (
          (o.scheduleInRootZone = n),
          o.shouldCoalesceEventChangeDetection && hs("NgZone_CoalesceEvent"),
          new V(o)
        );
      },
      ignoreChangesOutsideZone: t,
      scheduleInRootZone: n,
    });
  return Hr([{ provide: Xg, useValue: !0 }, { provide: Xr, useValue: !1 }, r]);
}
function Tl(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  };
}
var em = (() => {
  class e {
    constructor() {
      (this.subscription = new j()),
        (this.initialized = !1),
        (this.zone = h(V)),
        (this.pendingTasks = h(jt));
    }
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let n = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (n = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              V.assertNotInAngularZone(),
                queueMicrotask(() => {
                  n !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(n), (n = null));
                });
            }),
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            V.assertInAngularZone(), (n ??= this.pendingTasks.add());
          }),
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
    static {
      this.ɵfac = function (r) {
        return new (r || e)();
      };
    }
    static {
      this.ɵprov = D({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
  }
  return e;
})();
var tm = (() => {
  class e {
    constructor() {
      (this.appRef = h(at)),
        (this.taskService = h(jt)),
        (this.ngZone = h(V)),
        (this.zonelessEnabled = h(Xr)),
        (this.disableScheduling = h(Dl, { optional: !0 }) ?? !1),
        (this.zoneIsDefined = typeof Zone < "u" && !!Zone.root.run),
        (this.schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }]),
        (this.subscriptions = new j()),
        (this.angularZoneId = this.zoneIsDefined
          ? this.ngZone._inner?.get(Or)
          : null),
        (this.scheduleInRootZone =
          !this.zonelessEnabled &&
          this.zoneIsDefined &&
          (h(wl, { optional: !0 }) ?? !1)),
        (this.cancelScheduledCallback = null),
        (this.useMicrotaskScheduler = !1),
        (this.runningTick = !1),
        (this.pendingRenderTaskId = null),
        this.subscriptions.add(
          this.appRef.afterTick.subscribe(() => {
            this.runningTick || this.cleanup();
          }),
        ),
        this.subscriptions.add(
          this.ngZone.onUnstable.subscribe(() => {
            this.runningTick || this.cleanup();
          }),
        ),
        (this.disableScheduling ||=
          !this.zonelessEnabled &&
          (this.ngZone instanceof Ei || !this.zoneIsDefined));
    }
    notify(n) {
      if (!this.zonelessEnabled && n === 5) return;
      switch (n) {
        case 0: {
          this.appRef.dirtyFlags |= 2;
          break;
        }
        case 3:
        case 2:
        case 4:
        case 5:
        case 1: {
          this.appRef.dirtyFlags |= 4;
          break;
        }
        case 7: {
          this.appRef.deferredDirtyFlags |= 8;
          break;
        }
        case 9:
        case 8:
        case 6:
        case 10:
        default:
          this.appRef.dirtyFlags |= 8;
      }
      if (!this.shouldScheduleTick()) return;
      let r = this.useMicrotaskScheduler ? fu : Pc;
      (this.pendingRenderTaskId = this.taskService.add()),
        this.scheduleInRootZone
          ? (this.cancelScheduledCallback = Zone.root.run(() =>
              r(() => this.tick()),
            ))
          : (this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() =>
              r(() => this.tick()),
            ));
    }
    shouldScheduleTick() {
      return !(
        this.disableScheduling ||
        this.pendingRenderTaskId !== null ||
        this.runningTick ||
        this.appRef._runningTick ||
        (!this.zonelessEnabled &&
          this.zoneIsDefined &&
          Zone.current.get(Or + this.angularZoneId))
      );
    }
    tick() {
      if (this.runningTick || this.appRef.destroyed) return;
      !this.zonelessEnabled &&
        this.appRef.dirtyFlags & 7 &&
        (this.appRef.dirtyFlags |= 1);
      let n = this.taskService.add();
      try {
        this.ngZone.run(
          () => {
            (this.runningTick = !0), this.appRef._tick();
          },
          void 0,
          this.schedulerTickApplyArgs,
        );
      } catch (r) {
        throw (this.taskService.remove(n), r);
      } finally {
        this.cleanup();
      }
      (this.useMicrotaskScheduler = !0),
        fu(() => {
          (this.useMicrotaskScheduler = !1), this.taskService.remove(n);
        });
    }
    ngOnDestroy() {
      this.subscriptions.unsubscribe(), this.cleanup();
    }
    cleanup() {
      if (
        ((this.runningTick = !1),
        this.cancelScheduledCallback?.(),
        (this.cancelScheduledCallback = null),
        this.pendingRenderTaskId !== null)
      ) {
        let n = this.pendingRenderTaskId;
        (this.pendingRenderTaskId = null), this.taskService.remove(n);
      }
    }
    static {
      this.ɵfac = function (r) {
        return new (r || e)();
      };
    }
    static {
      this.ɵprov = D({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
  }
  return e;
})();
function nm() {
  return (typeof $localize < "u" && $localize.locale) || Vr;
}
var Ds = new E("", {
  providedIn: "root",
  factory: () => h(Ds, b.Optional | b.SkipSelf) || nm(),
});
var xl = new E("");
function mr(e) {
  return !!e.platformInjector;
}
function rm(e) {
  let t = mr(e) ? e.r3Injector : e.moduleRef.injector,
    n = t.get(V);
  return n.run(() => {
    mr(e)
      ? e.r3Injector.resolveInjectorInitializers()
      : e.moduleRef.resolveInjectorInitializers();
    let r = t.get(xe, null),
      o;
    if (
      (n.runOutsideAngular(() => {
        o = n.onError.subscribe({
          next: (i) => {
            r.handleError(i);
          },
        });
      }),
      mr(e))
    ) {
      let i = () => t.destroy(),
        s = e.platformInjector.get(xl);
      s.add(i),
        t.onDestroy(() => {
          o.unsubscribe(), s.delete(i);
        });
    } else
      e.moduleRef.onDestroy(() => {
        wr(e.allPlatformModules, e.moduleRef), o.unsubscribe();
      });
    return Yg(r, n, () => {
      let i = t.get(Sl);
      return (
        i.runInitializers(),
        i.donePromise.then(() => {
          let s = t.get(Ds, Vr);
          if ((zg(s || Vr), mr(e))) {
            let a = t.get(at);
            return (
              e.rootComponent !== void 0 && a.bootstrap(e.rootComponent), a
            );
          } else return om(e.moduleRef, e.allPlatformModules), e.moduleRef;
        })
      );
    });
  });
}
function om(e, t) {
  let n = e.injector.get(at);
  if (e._bootstrapComponents.length > 0)
    e._bootstrapComponents.forEach((r) => n.bootstrap(r));
  else if (e.instance.ngDoBootstrap) e.instance.ngDoBootstrap(n);
  else throw new v(-403, !1);
  t.push(e);
}
var Cr = null;
function im(e = [], t) {
  return it.create({
    name: t,
    providers: [
      { provide: zr, useValue: "platform" },
      { provide: xl, useValue: new Set([() => (Cr = null)]) },
      ...e,
    ],
  });
}
function sm(e = []) {
  if (Cr) return Cr;
  let t = im(e);
  return (Cr = t), Wg(), am(t), t;
}
function am(e) {
  e.get(rs, null)?.forEach((n) => n());
}
var En = (() => {
  class e {
    static {
      this.__NG_ELEMENT_ID__ = um;
    }
  }
  return e;
})();
function um(e) {
  return cm(Pe(), pe(), (e & 16) === 16);
}
function cm(e, t, n) {
  if (qi(e) && !n) {
    let r = yn(e.index, t);
    return new Pt(r, r);
  } else if (e.type & 175) {
    let r = t[be];
    return new Pt(r, t);
  }
  return null;
}
function Nl(e) {
  try {
    let { rootComponent: t, appProviders: n, platformProviders: r } = e,
      o = sm(r),
      i = [Ml({}), { provide: Ft, useExisting: tm }, ...(n || [])],
      s = new jr({
        providers: i,
        parent: o,
        debugName: "",
        runEnvironmentInitializers: !1,
      });
    return rm({
      r3Injector: s.injector,
      platformInjector: o,
      rootComponent: t,
    });
  } catch (t) {
    return Promise.reject(t);
  }
}
var Fl = null;
function $t() {
  return Fl;
}
function kl(e) {
  Fl ??= e;
}
var no = class {};
var ae = new E(""),
  Ll = (() => {
    class e {
      historyGo(n) {
        throw new Error("");
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = D({
          token: e,
          factory: () => h(pm),
          providedIn: "platform",
        });
      }
    }
    return e;
  })();
var pm = (() => {
  class e extends Ll {
    constructor() {
      super(),
        (this._doc = h(ae)),
        (this._location = window.location),
        (this._history = window.history);
    }
    getBaseHrefFromDOM() {
      return $t().getBaseHref(this._doc);
    }
    onPopState(n) {
      let r = $t().getGlobalEventTarget(this._doc, "window");
      return (
        r.addEventListener("popstate", n, !1),
        () => r.removeEventListener("popstate", n)
      );
    }
    onHashChange(n) {
      let r = $t().getGlobalEventTarget(this._doc, "window");
      return (
        r.addEventListener("hashchange", n, !1),
        () => r.removeEventListener("hashchange", n)
      );
    }
    get href() {
      return this._location.href;
    }
    get protocol() {
      return this._location.protocol;
    }
    get hostname() {
      return this._location.hostname;
    }
    get port() {
      return this._location.port;
    }
    get pathname() {
      return this._location.pathname;
    }
    get search() {
      return this._location.search;
    }
    get hash() {
      return this._location.hash;
    }
    set pathname(n) {
      this._location.pathname = n;
    }
    pushState(n, r, o) {
      this._history.pushState(n, r, o);
    }
    replaceState(n, r, o) {
      this._history.replaceState(n, r, o);
    }
    forward() {
      this._history.forward();
    }
    back() {
      this._history.back();
    }
    historyGo(n = 0) {
      this._history.go(n);
    }
    getState() {
      return this._history.state;
    }
    static {
      this.ɵfac = function (r) {
        return new (r || e)();
      };
    }
    static {
      this.ɵprov = D({
        token: e,
        factory: () => new e(),
        providedIn: "platform",
      });
    }
  }
  return e;
})();
function jl(e, t) {
  if (e.length == 0) return t;
  if (t.length == 0) return e;
  let n = 0;
  return (
    e.endsWith("/") && n++,
    t.startsWith("/") && n++,
    n == 2 ? e + t.substring(1) : n == 1 ? e + t : e + "/" + t
  );
}
function Al(e) {
  let t = e.match(/#|\?|$/),
    n = (t && t.index) || e.length,
    r = n - (e[n - 1] === "/" ? 1 : 0);
  return e.slice(0, r) + e.slice(n);
}
function ut(e) {
  return e && e[0] !== "?" ? "?" + e : e;
}
var oo = (() => {
    class e {
      historyGo(n) {
        throw new Error("");
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: () => h(Vl), providedIn: "root" });
      }
    }
    return e;
  })(),
  gm = new E(""),
  Vl = (() => {
    class e extends oo {
      constructor(n, r) {
        super(),
          (this._platformLocation = n),
          (this._removeListenerFns = []),
          (this._baseHref =
            r ??
            this._platformLocation.getBaseHrefFromDOM() ??
            h(ae).location?.origin ??
            "");
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n),
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(n) {
        return jl(this._baseHref, n);
      }
      path(n = !1) {
        let r =
            this._platformLocation.pathname + ut(this._platformLocation.search),
          o = this._platformLocation.hash;
        return o && n ? `${r}${o}` : r;
      }
      pushState(n, r, o, i) {
        let s = this.prepareExternalUrl(o + ut(i));
        this._platformLocation.pushState(n, r, s);
      }
      replaceState(n, r, o, i) {
        let s = this.prepareExternalUrl(o + ut(i));
        this._platformLocation.replaceState(n, r, s);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(_(Ll), _(gm, 8));
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })();
var Sn = (() => {
  class e {
    constructor(n) {
      (this._subject = new Z()),
        (this._urlChangeListeners = []),
        (this._urlChangeSubscription = null),
        (this._locationStrategy = n);
      let r = this._locationStrategy.getBaseHref();
      (this._basePath = ym(Al(Rl(r)))),
        this._locationStrategy.onPopState((o) => {
          this._subject.emit({
            url: this.path(!0),
            pop: !0,
            state: o.state,
            type: o.type,
          });
        });
    }
    ngOnDestroy() {
      this._urlChangeSubscription?.unsubscribe(),
        (this._urlChangeListeners = []);
    }
    path(n = !1) {
      return this.normalize(this._locationStrategy.path(n));
    }
    getState() {
      return this._locationStrategy.getState();
    }
    isCurrentPathEqualTo(n, r = "") {
      return this.path() == this.normalize(n + ut(r));
    }
    normalize(n) {
      return e.stripTrailingSlash(vm(this._basePath, Rl(n)));
    }
    prepareExternalUrl(n) {
      return (
        n && n[0] !== "/" && (n = "/" + n),
        this._locationStrategy.prepareExternalUrl(n)
      );
    }
    go(n, r = "", o = null) {
      this._locationStrategy.pushState(o, "", n, r),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(n + ut(r)), o);
    }
    replaceState(n, r = "", o = null) {
      this._locationStrategy.replaceState(o, "", n, r),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(n + ut(r)), o);
    }
    forward() {
      this._locationStrategy.forward();
    }
    back() {
      this._locationStrategy.back();
    }
    historyGo(n = 0) {
      this._locationStrategy.historyGo?.(n);
    }
    onUrlChange(n) {
      return (
        this._urlChangeListeners.push(n),
        (this._urlChangeSubscription ??= this.subscribe((r) => {
          this._notifyUrlChangeListeners(r.url, r.state);
        })),
        () => {
          let r = this._urlChangeListeners.indexOf(n);
          this._urlChangeListeners.splice(r, 1),
            this._urlChangeListeners.length === 0 &&
              (this._urlChangeSubscription?.unsubscribe(),
              (this._urlChangeSubscription = null));
        }
      );
    }
    _notifyUrlChangeListeners(n = "", r) {
      this._urlChangeListeners.forEach((o) => o(n, r));
    }
    subscribe(n, r, o) {
      return this._subject.subscribe({ next: n, error: r, complete: o });
    }
    static {
      this.normalizeQueryParams = ut;
    }
    static {
      this.joinWithSlash = jl;
    }
    static {
      this.stripTrailingSlash = Al;
    }
    static {
      this.ɵfac = function (r) {
        return new (r || e)(_(oo));
      };
    }
    static {
      this.ɵprov = D({ token: e, factory: () => mm(), providedIn: "root" });
    }
  }
  return e;
})();
function mm() {
  return new Sn(_(oo));
}
function vm(e, t) {
  if (!e || !t.startsWith(e)) return t;
  let n = t.substring(e.length);
  return n === "" || ["/", ";", "?", "#"].includes(n[0]) ? n : t;
}
function Rl(e) {
  return e.replace(/\/index.html$/, "");
}
function ym(e) {
  if (new RegExp("^(https?:)?//").test(e)) {
    let [, n] = e.split(/\/\/[^\/]+/);
    return n;
  }
  return e;
}
function $l(e, t) {
  t = encodeURIComponent(t);
  for (let n of e.split(";")) {
    let r = n.indexOf("="),
      [o, i] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
    if (o.trim() === t) return decodeURIComponent(i);
  }
  return null;
}
var Bl = "browser",
  Dm = "server";
function ws(e) {
  return e === Dm;
}
var ro = class {};
var Es = class extends no {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  bs = class e extends Es {
    static makeCurrent() {
      kl(new e());
    }
    onAndCancel(t, n, r) {
      return (
        t.addEventListener(n, r),
        () => {
          t.removeEventListener(n, r);
        }
      );
    }
    dispatchEvent(t, n) {
      t.dispatchEvent(n);
    }
    remove(t) {
      t.remove();
    }
    createElement(t, n) {
      return (n = n || this.getDefaultDocument()), n.createElement(t);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(t) {
      return t.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(t) {
      return t instanceof DocumentFragment;
    }
    getGlobalEventTarget(t, n) {
      return n === "window"
        ? window
        : n === "document"
          ? t
          : n === "body"
            ? t.body
            : null;
    }
    getBaseHref(t) {
      let n = Cm();
      return n == null ? null : Im(n);
    }
    resetBaseElement() {
      Mn = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(t) {
      return $l(document.cookie, t);
    }
  },
  Mn = null;
function Cm() {
  return (
    (Mn = Mn || document.querySelector("base")),
    Mn ? Mn.getAttribute("href") : null
  );
}
function Im(e) {
  return new URL(e, document.baseURI).pathname;
}
var Em = (() => {
    class e {
      build() {
        return new XMLHttpRequest();
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  Ss = new E(""),
  Gl = (() => {
    class e {
      constructor(n, r) {
        (this._zone = r),
          (this._eventNameToPlugin = new Map()),
          n.forEach((o) => {
            o.manager = this;
          }),
          (this._plugins = n.slice().reverse());
      }
      addEventListener(n, r, o) {
        return this._findPluginFor(r).addEventListener(n, r, o);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(n) {
        let r = this._eventNameToPlugin.get(n);
        if (r) return r;
        if (((r = this._plugins.find((i) => i.supports(n))), !r))
          throw new v(5101, !1);
        return this._eventNameToPlugin.set(n, r), r;
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(_(Ss), _(V));
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  io = class {
    constructor(t) {
      this._doc = t;
    }
  },
  Cs = "ng-app-id",
  ql = (() => {
    class e {
      constructor(n, r, o, i = {}) {
        (this.doc = n),
          (this.appId = r),
          (this.nonce = o),
          (this.platformId = i),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = ws(i)),
          this.resetHostNodes();
      }
      addStyles(n) {
        for (let r of n)
          this.changeUsageCount(r, 1) === 1 && this.onStyleAdded(r);
      }
      removeStyles(n) {
        for (let r of n)
          this.changeUsageCount(r, -1) <= 0 && this.onStyleRemoved(r);
      }
      ngOnDestroy() {
        let n = this.styleNodesInDOM;
        n && (n.forEach((r) => r.remove()), n.clear());
        for (let r of this.getAllStyles()) this.onStyleRemoved(r);
        this.resetHostNodes();
      }
      addHost(n) {
        this.hostNodes.add(n);
        for (let r of this.getAllStyles()) this.addStyleToHost(n, r);
      }
      removeHost(n) {
        this.hostNodes.delete(n);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(n) {
        for (let r of this.hostNodes) this.addStyleToHost(r, n);
      }
      onStyleRemoved(n) {
        let r = this.styleRef;
        r.get(n)?.elements?.forEach((o) => o.remove()), r.delete(n);
      }
      collectServerRenderedStyles() {
        let n = this.doc.head?.querySelectorAll(`style[${Cs}="${this.appId}"]`);
        if (n?.length) {
          let r = new Map();
          return (
            n.forEach((o) => {
              o.textContent != null && r.set(o.textContent, o);
            }),
            r
          );
        }
        return null;
      }
      changeUsageCount(n, r) {
        let o = this.styleRef;
        if (o.has(n)) {
          let i = o.get(n);
          return (i.usage += r), i.usage;
        }
        return o.set(n, { usage: r, elements: [] }), r;
      }
      getStyleElement(n, r) {
        let o = this.styleNodesInDOM,
          i = o?.get(r);
        if (i?.parentNode === n) return o.delete(r), i.removeAttribute(Cs), i;
        {
          let s = this.doc.createElement("style");
          return (
            this.nonce && s.setAttribute("nonce", this.nonce),
            (s.textContent = r),
            this.platformIsServer && s.setAttribute(Cs, this.appId),
            n.appendChild(s),
            s
          );
        }
      }
      addStyleToHost(n, r) {
        let o = this.getStyleElement(n, r),
          i = this.styleRef,
          s = i.get(r)?.elements;
        s ? s.push(o) : i.set(r, { elements: [o], usage: 1 });
      }
      resetHostNodes() {
        let n = this.hostNodes;
        n.clear(), n.add(this.doc.head);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(_(ae), _(ns), _(os, 8), _(Vt));
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  Is = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/Math/MathML",
  },
  _s = /%COMP%/g,
  Wl = "%COMP%",
  bm = `_nghost-${Wl}`,
  Sm = `_ngcontent-${Wl}`,
  Mm = !0,
  _m = new E("", { providedIn: "root", factory: () => Mm });
function Tm(e) {
  return Sm.replace(_s, e);
}
function xm(e) {
  return bm.replace(_s, e);
}
function Zl(e, t) {
  return t.map((n) => n.replace(_s, e));
}
var Ul = (() => {
    class e {
      constructor(n, r, o, i, s, a, u, c = null) {
        (this.eventManager = n),
          (this.sharedStylesHost = r),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = i),
          (this.doc = s),
          (this.platformId = a),
          (this.ngZone = u),
          (this.nonce = c),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = ws(a)),
          (this.defaultRenderer = new _n(n, s, u, this.platformIsServer));
      }
      createRenderer(n, r) {
        if (!n || !r) return this.defaultRenderer;
        this.platformIsServer &&
          r.encapsulation === Ie.ShadowDom &&
          (r = k(g({}, r), { encapsulation: Ie.Emulated }));
        let o = this.getOrCreateRenderer(n, r);
        return (
          o instanceof so
            ? o.applyToHost(n)
            : o instanceof Tn && o.applyStyles(),
          o
        );
      }
      getOrCreateRenderer(n, r) {
        let o = this.rendererByCompId,
          i = o.get(r.id);
        if (!i) {
          let s = this.doc,
            a = this.ngZone,
            u = this.eventManager,
            c = this.sharedStylesHost,
            l = this.removeStylesOnCompDestroy,
            d = this.platformIsServer;
          switch (r.encapsulation) {
            case Ie.Emulated:
              i = new so(u, c, r, this.appId, l, s, a, d);
              break;
            case Ie.ShadowDom:
              return new Ms(u, c, n, r, s, a, this.nonce, d);
            default:
              i = new Tn(u, c, r, l, s, a, d);
              break;
          }
          o.set(r.id, i);
        }
        return i;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(
            _(Gl),
            _(ql),
            _(ns),
            _(_m),
            _(ae),
            _(Vt),
            _(V),
            _(os),
          );
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  _n = class {
    constructor(t, n, r, o) {
      (this.eventManager = t),
        (this.doc = n),
        (this.ngZone = r),
        (this.platformIsServer = o),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(t, n) {
      return n
        ? this.doc.createElementNS(Is[n] || n, t)
        : this.doc.createElement(t);
    }
    createComment(t) {
      return this.doc.createComment(t);
    }
    createText(t) {
      return this.doc.createTextNode(t);
    }
    appendChild(t, n) {
      (Hl(t) ? t.content : t).appendChild(n);
    }
    insertBefore(t, n, r) {
      t && (Hl(t) ? t.content : t).insertBefore(n, r);
    }
    removeChild(t, n) {
      n.remove();
    }
    selectRootElement(t, n) {
      let r = typeof t == "string" ? this.doc.querySelector(t) : t;
      if (!r) throw new v(-5104, !1);
      return n || (r.textContent = ""), r;
    }
    parentNode(t) {
      return t.parentNode;
    }
    nextSibling(t) {
      return t.nextSibling;
    }
    setAttribute(t, n, r, o) {
      if (o) {
        n = o + ":" + n;
        let i = Is[o];
        i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
      } else t.setAttribute(n, r);
    }
    removeAttribute(t, n, r) {
      if (r) {
        let o = Is[r];
        o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
      } else t.removeAttribute(n);
    }
    addClass(t, n) {
      t.classList.add(n);
    }
    removeClass(t, n) {
      t.classList.remove(n);
    }
    setStyle(t, n, r, o) {
      o & (st.DashCase | st.Important)
        ? t.style.setProperty(n, r, o & st.Important ? "important" : "")
        : (t.style[n] = r);
    }
    removeStyle(t, n, r) {
      r & st.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
    }
    setProperty(t, n, r) {
      t != null && (t[n] = r);
    }
    setValue(t, n) {
      t.nodeValue = n;
    }
    listen(t, n, r) {
      if (
        typeof t == "string" &&
        ((t = $t().getGlobalEventTarget(this.doc, t)), !t)
      )
        throw new Error(`Unsupported event target ${t} for event ${n}`);
      return this.eventManager.addEventListener(
        t,
        n,
        this.decoratePreventDefault(r),
      );
    }
    decoratePreventDefault(t) {
      return (n) => {
        if (n === "__ngUnwrap__") return t;
        (this.platformIsServer ? this.ngZone.runGuarded(() => t(n)) : t(n)) ===
          !1 && n.preventDefault();
      };
    }
  };
function Hl(e) {
  return e.tagName === "TEMPLATE" && e.content !== void 0;
}
var Ms = class extends _n {
    constructor(t, n, r, o, i, s, a, u) {
      super(t, i, s, u),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let c = Zl(o.id, o.styles);
      for (let l of c) {
        let d = document.createElement("style");
        a && d.setAttribute("nonce", a),
          (d.textContent = l),
          this.shadowRoot.appendChild(d);
      }
    }
    nodeOrShadowRoot(t) {
      return t === this.hostEl ? this.shadowRoot : t;
    }
    appendChild(t, n) {
      return super.appendChild(this.nodeOrShadowRoot(t), n);
    }
    insertBefore(t, n, r) {
      return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
    }
    removeChild(t, n) {
      return super.removeChild(null, n);
    }
    parentNode(t) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  Tn = class extends _n {
    constructor(t, n, r, o, i, s, a, u) {
      super(t, i, s, a),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = o),
        (this.styles = u ? Zl(u, r.styles) : r.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  so = class extends Tn {
    constructor(t, n, r, o, i, s, a, u) {
      let c = o + "-" + r.id;
      super(t, n, r, i, s, a, u, c),
        (this.contentAttr = Tm(c)),
        (this.hostAttr = xm(c));
    }
    applyToHost(t) {
      this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
    }
    createElement(t, n) {
      let r = super.createElement(t, n);
      return super.setAttribute(r, this.contentAttr, ""), r;
    }
  },
  Nm = (() => {
    class e extends io {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return !0;
      }
      addEventListener(n, r, o) {
        return (
          n.addEventListener(r, o, !1), () => this.removeEventListener(n, r, o)
        );
      }
      removeEventListener(n, r, o) {
        return n.removeEventListener(r, o);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(_(ae));
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  zl = ["alt", "control", "meta", "shift"],
  Am = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  Rm = {
    alt: (e) => e.altKey,
    control: (e) => e.ctrlKey,
    meta: (e) => e.metaKey,
    shift: (e) => e.shiftKey,
  },
  Om = (() => {
    class e extends io {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return e.parseEventName(n) != null;
      }
      addEventListener(n, r, o) {
        let i = e.parseEventName(r),
          s = e.eventCallback(i.fullKey, o, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => $t().onAndCancel(n, i.domEventName, s));
      }
      static parseEventName(n) {
        let r = n.toLowerCase().split("."),
          o = r.shift();
        if (r.length === 0 || !(o === "keydown" || o === "keyup")) return null;
        let i = e._normalizeKey(r.pop()),
          s = "",
          a = r.indexOf("code");
        if (
          (a > -1 && (r.splice(a, 1), (s = "code.")),
          zl.forEach((c) => {
            let l = r.indexOf(c);
            l > -1 && (r.splice(l, 1), (s += c + "."));
          }),
          (s += i),
          r.length != 0 || i.length === 0)
        )
          return null;
        let u = {};
        return (u.domEventName = o), (u.fullKey = s), u;
      }
      static matchEventFullKeyCode(n, r) {
        let o = Am[n.key] || n.key,
          i = "";
        return (
          r.indexOf("code.") > -1 && ((o = n.code), (i = "code.")),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === " " ? (o = "space") : o === "." && (o = "dot"),
              zl.forEach((s) => {
                if (s !== o) {
                  let a = Rm[s];
                  a(n) && (i += s + ".");
                }
              }),
              (i += o),
              i === r)
        );
      }
      static eventCallback(n, r, o) {
        return (i) => {
          e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i));
        };
      }
      static _normalizeKey(n) {
        return n === "esc" ? "escape" : n;
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(_(ae));
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })();
function Ql(e, t) {
  return Nl(g({ rootComponent: e }, Pm(t)));
}
function Pm(e) {
  return {
    appProviders: [...Vm, ...(e?.providers ?? [])],
    platformProviders: jm,
  };
}
function Fm() {
  bs.makeCurrent();
}
function km() {
  return new xe();
}
function Lm() {
  return Bc(document), document;
}
var jm = [
  { provide: Vt, useValue: Bl },
  { provide: rs, useValue: Fm, multi: !0 },
  { provide: ae, useFactory: Lm, deps: [] },
];
var Vm = [
  { provide: zr, useValue: "root" },
  { provide: xe, useFactory: km, deps: [] },
  { provide: Ss, useClass: Nm, multi: !0, deps: [ae, V, Vt] },
  { provide: Ss, useClass: Om, multi: !0, deps: [ae] },
  Ul,
  ql,
  Gl,
  { provide: Lt, useExisting: Ul },
  { provide: ro, useClass: Em, deps: [] },
  [],
];
var Yl = (() => {
  class e {
    constructor(n) {
      this._doc = n;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(n) {
      this._doc.title = n || "";
    }
    static {
      this.ɵfac = function (r) {
        return new (r || e)(_(ae));
      };
    }
    static {
      this.ɵprov = D({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
  }
  return e;
})();
var I = "primary",
  Gn = Symbol("RouteTitle"),
  Rs = class {
    constructor(t) {
      this.params = t || {};
    }
    has(t) {
      return Object.prototype.hasOwnProperty.call(this.params, t);
    }
    get(t) {
      if (this.has(t)) {
        let n = this.params[t];
        return Array.isArray(n) ? n[0] : n;
      }
      return null;
    }
    getAll(t) {
      if (this.has(t)) {
        let n = this.params[t];
        return Array.isArray(n) ? n : [n];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function qt(e) {
  return new Rs(e);
}
function Bm(e, t, n) {
  let r = n.path.split("/");
  if (
    r.length > e.length ||
    (n.pathMatch === "full" && (t.hasChildren() || r.length < e.length))
  )
    return null;
  let o = {};
  for (let i = 0; i < r.length; i++) {
    let s = r[i],
      a = e[i];
    if (s[0] === ":") o[s.substring(1)] = a;
    else if (s !== a.path) return null;
  }
  return { consumed: e.slice(0, r.length), posParams: o };
}
function Um(e, t) {
  if (e.length !== t.length) return !1;
  for (let n = 0; n < e.length; ++n) if (!Se(e[n], t[n])) return !1;
  return !0;
}
function Se(e, t) {
  let n = e ? Os(e) : void 0,
    r = t ? Os(t) : void 0;
  if (!n || !r || n.length != r.length) return !1;
  let o;
  for (let i = 0; i < n.length; i++)
    if (((o = n[i]), !od(e[o], t[o]))) return !1;
  return !0;
}
function Os(e) {
  return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)];
}
function od(e, t) {
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length) return !1;
    let n = [...e].sort(),
      r = [...t].sort();
    return n.every((o, i) => r[i] === o);
  } else return e === t;
}
function id(e) {
  return e.length > 0 ? e[e.length - 1] : null;
}
function We(e) {
  return Go(e) ? e : In(e) ? B(Promise.resolve(e)) : w(e);
}
var Hm = { exact: ad, subset: ud },
  sd = { exact: zm, subset: Gm, ignored: () => !0 };
function Kl(e, t, n) {
  return (
    Hm[n.paths](e.root, t.root, n.matrixParams) &&
    sd[n.queryParams](e.queryParams, t.queryParams) &&
    !(n.fragment === "exact" && e.fragment !== t.fragment)
  );
}
function zm(e, t) {
  return Se(e, t);
}
function ad(e, t, n) {
  if (
    !lt(e.segments, t.segments) ||
    !co(e.segments, t.segments, n) ||
    e.numberOfChildren !== t.numberOfChildren
  )
    return !1;
  for (let r in t.children)
    if (!e.children[r] || !ad(e.children[r], t.children[r], n)) return !1;
  return !0;
}
function Gm(e, t) {
  return (
    Object.keys(t).length <= Object.keys(e).length &&
    Object.keys(t).every((n) => od(e[n], t[n]))
  );
}
function ud(e, t, n) {
  return cd(e, t, t.segments, n);
}
function cd(e, t, n, r) {
  if (e.segments.length > n.length) {
    let o = e.segments.slice(0, n.length);
    return !(!lt(o, n) || t.hasChildren() || !co(o, n, r));
  } else if (e.segments.length === n.length) {
    if (!lt(e.segments, n) || !co(e.segments, n, r)) return !1;
    for (let o in t.children)
      if (!e.children[o] || !ud(e.children[o], t.children[o], r)) return !1;
    return !0;
  } else {
    let o = n.slice(0, e.segments.length),
      i = n.slice(e.segments.length);
    return !lt(e.segments, o) || !co(e.segments, o, r) || !e.children[I]
      ? !1
      : cd(e.children[I], t, i, r);
  }
}
function co(e, t, n) {
  return t.every((r, o) => sd[n](e[o].parameters, r.parameters));
}
var ke = class {
    constructor(t = new N([], {}), n = {}, r = null) {
      (this.root = t), (this.queryParams = n), (this.fragment = r);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= qt(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      return Zm.serialize(this);
    }
  },
  N = class {
    constructor(t, n) {
      (this.segments = t),
        (this.children = n),
        (this.parent = null),
        Object.values(n).forEach((r) => (r.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return lo(this);
    }
  },
  ct = class {
    constructor(t, n) {
      (this.path = t), (this.parameters = n);
    }
    get parameterMap() {
      return (this._parameterMap ??= qt(this.parameters)), this._parameterMap;
    }
    toString() {
      return dd(this);
    }
  };
function qm(e, t) {
  return lt(e, t) && e.every((n, r) => Se(n.parameters, t[r].parameters));
}
function lt(e, t) {
  return e.length !== t.length ? !1 : e.every((n, r) => n.path === t[r].path);
}
function Wm(e, t) {
  let n = [];
  return (
    Object.entries(e.children).forEach(([r, o]) => {
      r === I && (n = n.concat(t(o, r)));
    }),
    Object.entries(e.children).forEach(([r, o]) => {
      r !== I && (n = n.concat(t(o, r)));
    }),
    n
  );
}
var ia = (() => {
    class e {
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = D({
          token: e,
          factory: () => new Fn(),
          providedIn: "root",
        });
      }
    }
    return e;
  })(),
  Fn = class {
    parse(t) {
      let n = new Fs(t);
      return new ke(
        n.parseRootSegment(),
        n.parseQueryParams(),
        n.parseFragment(),
      );
    }
    serialize(t) {
      let n = `/${xn(t.root, !0)}`,
        r = Km(t.queryParams),
        o = typeof t.fragment == "string" ? `#${Qm(t.fragment)}` : "";
      return `${n}${r}${o}`;
    }
  },
  Zm = new Fn();
function lo(e) {
  return e.segments.map((t) => dd(t)).join("/");
}
function xn(e, t) {
  if (!e.hasChildren()) return lo(e);
  if (t) {
    let n = e.children[I] ? xn(e.children[I], !1) : "",
      r = [];
    return (
      Object.entries(e.children).forEach(([o, i]) => {
        o !== I && r.push(`${o}:${xn(i, !1)}`);
      }),
      r.length > 0 ? `${n}(${r.join("//")})` : n
    );
  } else {
    let n = Wm(e, (r, o) =>
      o === I ? [xn(e.children[I], !1)] : [`${o}:${xn(r, !1)}`],
    );
    return Object.keys(e.children).length === 1 && e.children[I] != null
      ? `${lo(e)}/${n[0]}`
      : `${lo(e)}/(${n.join("//")})`;
  }
}
function ld(e) {
  return encodeURIComponent(e)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function ao(e) {
  return ld(e).replace(/%3B/gi, ";");
}
function Qm(e) {
  return encodeURI(e);
}
function Ps(e) {
  return ld(e)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function fo(e) {
  return decodeURIComponent(e);
}
function Jl(e) {
  return fo(e.replace(/\+/g, "%20"));
}
function dd(e) {
  return `${Ps(e.path)}${Ym(e.parameters)}`;
}
function Ym(e) {
  return Object.entries(e)
    .map(([t, n]) => `;${Ps(t)}=${Ps(n)}`)
    .join("");
}
function Km(e) {
  let t = Object.entries(e)
    .map(([n, r]) =>
      Array.isArray(r)
        ? r.map((o) => `${ao(n)}=${ao(o)}`).join("&")
        : `${ao(n)}=${ao(r)}`,
    )
    .filter((n) => n);
  return t.length ? `?${t.join("&")}` : "";
}
var Jm = /^[^\/()?;#]+/;
function Ts(e) {
  let t = e.match(Jm);
  return t ? t[0] : "";
}
var Xm = /^[^\/()?;=#]+/;
function ev(e) {
  let t = e.match(Xm);
  return t ? t[0] : "";
}
var tv = /^[^=?&#]+/;
function nv(e) {
  let t = e.match(tv);
  return t ? t[0] : "";
}
var rv = /^[^&#]+/;
function ov(e) {
  let t = e.match(rv);
  return t ? t[0] : "";
}
var Fs = class {
  constructor(t) {
    (this.url = t), (this.remaining = t);
  }
  parseRootSegment() {
    return (
      this.consumeOptional("/"),
      this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
        ? new N([], {})
        : new N([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let t = {};
    if (this.consumeOptional("?"))
      do this.parseQueryParam(t);
      while (this.consumeOptional("&"));
    return t;
  }
  parseFragment() {
    return this.consumeOptional("#")
      ? decodeURIComponent(this.remaining)
      : null;
  }
  parseChildren() {
    if (this.remaining === "") return {};
    this.consumeOptional("/");
    let t = [];
    for (
      this.peekStartsWith("(") || t.push(this.parseSegment());
      this.peekStartsWith("/") &&
      !this.peekStartsWith("//") &&
      !this.peekStartsWith("/(");

    )
      this.capture("/"), t.push(this.parseSegment());
    let n = {};
    this.peekStartsWith("/(") &&
      (this.capture("/"), (n = this.parseParens(!0)));
    let r = {};
    return (
      this.peekStartsWith("(") && (r = this.parseParens(!1)),
      (t.length > 0 || Object.keys(n).length > 0) && (r[I] = new N(t, n)),
      r
    );
  }
  parseSegment() {
    let t = Ts(this.remaining);
    if (t === "" && this.peekStartsWith(";")) throw new v(4009, !1);
    return this.capture(t), new ct(fo(t), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let t = {};
    for (; this.consumeOptional(";"); ) this.parseParam(t);
    return t;
  }
  parseParam(t) {
    let n = ev(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let o = Ts(this.remaining);
      o && ((r = o), this.capture(r));
    }
    t[fo(n)] = fo(r);
  }
  parseQueryParam(t) {
    let n = nv(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let s = ov(this.remaining);
      s && ((r = s), this.capture(r));
    }
    let o = Jl(n),
      i = Jl(r);
    if (t.hasOwnProperty(o)) {
      let s = t[o];
      Array.isArray(s) || ((s = [s]), (t[o] = s)), s.push(i);
    } else t[o] = i;
  }
  parseParens(t) {
    let n = {};
    for (
      this.capture("(");
      !this.consumeOptional(")") && this.remaining.length > 0;

    ) {
      let r = Ts(this.remaining),
        o = this.remaining[r.length];
      if (o !== "/" && o !== ")" && o !== ";") throw new v(4010, !1);
      let i;
      r.indexOf(":") > -1
        ? ((i = r.slice(0, r.indexOf(":"))), this.capture(i), this.capture(":"))
        : t && (i = I);
      let s = this.parseChildren();
      (n[i] = Object.keys(s).length === 1 ? s[I] : new N([], s)),
        this.consumeOptional("//");
    }
    return n;
  }
  peekStartsWith(t) {
    return this.remaining.startsWith(t);
  }
  consumeOptional(t) {
    return this.peekStartsWith(t)
      ? ((this.remaining = this.remaining.substring(t.length)), !0)
      : !1;
  }
  capture(t) {
    if (!this.consumeOptional(t)) throw new v(4011, !1);
  }
};
function fd(e) {
  return e.segments.length > 0 ? new N([], { [I]: e }) : e;
}
function hd(e) {
  let t = {};
  for (let [r, o] of Object.entries(e.children)) {
    let i = hd(o);
    if (r === I && i.segments.length === 0 && i.hasChildren())
      for (let [s, a] of Object.entries(i.children)) t[s] = a;
    else (i.segments.length > 0 || i.hasChildren()) && (t[r] = i);
  }
  let n = new N(e.segments, t);
  return iv(n);
}
function iv(e) {
  if (e.numberOfChildren === 1 && e.children[I]) {
    let t = e.children[I];
    return new N(e.segments.concat(t.segments), t.children);
  }
  return e;
}
function kn(e) {
  return e instanceof ke;
}
function sv(e, t, n = null, r = null) {
  let o = pd(e);
  return gd(o, t, n, r);
}
function pd(e) {
  let t;
  function n(i) {
    let s = {};
    for (let u of i.children) {
      let c = n(u);
      s[u.outlet] = c;
    }
    let a = new N(i.url, s);
    return i === e && (t = a), a;
  }
  let r = n(e.root),
    o = fd(r);
  return t ?? o;
}
function gd(e, t, n, r) {
  let o = e;
  for (; o.parent; ) o = o.parent;
  if (t.length === 0) return xs(o, o, o, n, r);
  let i = av(t);
  if (i.toRoot()) return xs(o, o, new N([], {}), n, r);
  let s = uv(i, o, e),
    a = s.processChildren
      ? Rn(s.segmentGroup, s.index, i.commands)
      : vd(s.segmentGroup, s.index, i.commands);
  return xs(o, s.segmentGroup, a, n, r);
}
function ho(e) {
  return typeof e == "object" && e != null && !e.outlets && !e.segmentPath;
}
function Ln(e) {
  return typeof e == "object" && e != null && e.outlets;
}
function xs(e, t, n, r, o) {
  let i = {};
  r &&
    Object.entries(r).forEach(([u, c]) => {
      i[u] = Array.isArray(c) ? c.map((l) => `${l}`) : `${c}`;
    });
  let s;
  e === t ? (s = n) : (s = md(e, t, n));
  let a = fd(hd(s));
  return new ke(a, i, o);
}
function md(e, t, n) {
  let r = {};
  return (
    Object.entries(e.children).forEach(([o, i]) => {
      i === t ? (r[o] = n) : (r[o] = md(i, t, n));
    }),
    new N(e.segments, r)
  );
}
var po = class {
  constructor(t, n, r) {
    if (
      ((this.isAbsolute = t),
      (this.numberOfDoubleDots = n),
      (this.commands = r),
      t && r.length > 0 && ho(r[0]))
    )
      throw new v(4003, !1);
    let o = r.find(Ln);
    if (o && o !== id(r)) throw new v(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function av(e) {
  if (typeof e[0] == "string" && e.length === 1 && e[0] === "/")
    return new po(!0, 0, e);
  let t = 0,
    n = !1,
    r = e.reduce((o, i, s) => {
      if (typeof i == "object" && i != null) {
        if (i.outlets) {
          let a = {};
          return (
            Object.entries(i.outlets).forEach(([u, c]) => {
              a[u] = typeof c == "string" ? c.split("/") : c;
            }),
            [...o, { outlets: a }]
          );
        }
        if (i.segmentPath) return [...o, i.segmentPath];
      }
      return typeof i != "string"
        ? [...o, i]
        : s === 0
          ? (i.split("/").forEach((a, u) => {
              (u == 0 && a === ".") ||
                (u == 0 && a === ""
                  ? (n = !0)
                  : a === ".."
                    ? t++
                    : a != "" && o.push(a));
            }),
            o)
          : [...o, i];
    }, []);
  return new po(n, t, r);
}
var Ht = class {
  constructor(t, n, r) {
    (this.segmentGroup = t), (this.processChildren = n), (this.index = r);
  }
};
function uv(e, t, n) {
  if (e.isAbsolute) return new Ht(t, !0, 0);
  if (!n) return new Ht(t, !1, NaN);
  if (n.parent === null) return new Ht(n, !0, 0);
  let r = ho(e.commands[0]) ? 0 : 1,
    o = n.segments.length - 1 + r;
  return cv(n, o, e.numberOfDoubleDots);
}
function cv(e, t, n) {
  let r = e,
    o = t,
    i = n;
  for (; i > o; ) {
    if (((i -= o), (r = r.parent), !r)) throw new v(4005, !1);
    o = r.segments.length;
  }
  return new Ht(r, !1, o - i);
}
function lv(e) {
  return Ln(e[0]) ? e[0].outlets : { [I]: e };
}
function vd(e, t, n) {
  if (((e ??= new N([], {})), e.segments.length === 0 && e.hasChildren()))
    return Rn(e, t, n);
  let r = dv(e, t, n),
    o = n.slice(r.commandIndex);
  if (r.match && r.pathIndex < e.segments.length) {
    let i = new N(e.segments.slice(0, r.pathIndex), {});
    return (
      (i.children[I] = new N(e.segments.slice(r.pathIndex), e.children)),
      Rn(i, 0, o)
    );
  } else
    return r.match && o.length === 0
      ? new N(e.segments, {})
      : r.match && !e.hasChildren()
        ? ks(e, t, n)
        : r.match
          ? Rn(e, 0, o)
          : ks(e, t, n);
}
function Rn(e, t, n) {
  if (n.length === 0) return new N(e.segments, {});
  {
    let r = lv(n),
      o = {};
    if (
      Object.keys(r).some((i) => i !== I) &&
      e.children[I] &&
      e.numberOfChildren === 1 &&
      e.children[I].segments.length === 0
    ) {
      let i = Rn(e.children[I], t, n);
      return new N(e.segments, i.children);
    }
    return (
      Object.entries(r).forEach(([i, s]) => {
        typeof s == "string" && (s = [s]),
          s !== null && (o[i] = vd(e.children[i], t, s));
      }),
      Object.entries(e.children).forEach(([i, s]) => {
        r[i] === void 0 && (o[i] = s);
      }),
      new N(e.segments, o)
    );
  }
}
function dv(e, t, n) {
  let r = 0,
    o = t,
    i = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; o < e.segments.length; ) {
    if (r >= n.length) return i;
    let s = e.segments[o],
      a = n[r];
    if (Ln(a)) break;
    let u = `${a}`,
      c = r < n.length - 1 ? n[r + 1] : null;
    if (o > 0 && u === void 0) break;
    if (u && c && typeof c == "object" && c.outlets === void 0) {
      if (!ed(u, c, s)) return i;
      r += 2;
    } else {
      if (!ed(u, {}, s)) return i;
      r++;
    }
    o++;
  }
  return { match: !0, pathIndex: o, commandIndex: r };
}
function ks(e, t, n) {
  let r = e.segments.slice(0, t),
    o = 0;
  for (; o < n.length; ) {
    let i = n[o];
    if (Ln(i)) {
      let u = fv(i.outlets);
      return new N(r, u);
    }
    if (o === 0 && ho(n[0])) {
      let u = e.segments[t];
      r.push(new ct(u.path, Xl(n[0]))), o++;
      continue;
    }
    let s = Ln(i) ? i.outlets[I] : `${i}`,
      a = o < n.length - 1 ? n[o + 1] : null;
    s && a && ho(a)
      ? (r.push(new ct(s, Xl(a))), (o += 2))
      : (r.push(new ct(s, {})), o++);
  }
  return new N(r, {});
}
function fv(e) {
  let t = {};
  return (
    Object.entries(e).forEach(([n, r]) => {
      typeof r == "string" && (r = [r]),
        r !== null && (t[n] = ks(new N([], {}), 0, r));
    }),
    t
  );
}
function Xl(e) {
  let t = {};
  return Object.entries(e).forEach(([n, r]) => (t[n] = `${r}`)), t;
}
function ed(e, t, n) {
  return e == n.path && Se(t, n.parameters);
}
var On = "imperative",
  q = (function (e) {
    return (
      (e[(e.NavigationStart = 0)] = "NavigationStart"),
      (e[(e.NavigationEnd = 1)] = "NavigationEnd"),
      (e[(e.NavigationCancel = 2)] = "NavigationCancel"),
      (e[(e.NavigationError = 3)] = "NavigationError"),
      (e[(e.RoutesRecognized = 4)] = "RoutesRecognized"),
      (e[(e.ResolveStart = 5)] = "ResolveStart"),
      (e[(e.ResolveEnd = 6)] = "ResolveEnd"),
      (e[(e.GuardsCheckStart = 7)] = "GuardsCheckStart"),
      (e[(e.GuardsCheckEnd = 8)] = "GuardsCheckEnd"),
      (e[(e.RouteConfigLoadStart = 9)] = "RouteConfigLoadStart"),
      (e[(e.RouteConfigLoadEnd = 10)] = "RouteConfigLoadEnd"),
      (e[(e.ChildActivationStart = 11)] = "ChildActivationStart"),
      (e[(e.ChildActivationEnd = 12)] = "ChildActivationEnd"),
      (e[(e.ActivationStart = 13)] = "ActivationStart"),
      (e[(e.ActivationEnd = 14)] = "ActivationEnd"),
      (e[(e.Scroll = 15)] = "Scroll"),
      (e[(e.NavigationSkipped = 16)] = "NavigationSkipped"),
      e
    );
  })(q || {}),
  ue = class {
    constructor(t, n) {
      (this.id = t), (this.url = n);
    }
  },
  jn = class extends ue {
    constructor(t, n, r = "imperative", o = null) {
      super(t, n),
        (this.type = q.NavigationStart),
        (this.navigationTrigger = r),
        (this.restoredState = o);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  dt = class extends ue {
    constructor(t, n, r) {
      super(t, n), (this.urlAfterRedirects = r), (this.type = q.NavigationEnd);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  te = (function (e) {
    return (
      (e[(e.Redirect = 0)] = "Redirect"),
      (e[(e.SupersededByNewNavigation = 1)] = "SupersededByNewNavigation"),
      (e[(e.NoDataFromResolver = 2)] = "NoDataFromResolver"),
      (e[(e.GuardRejected = 3)] = "GuardRejected"),
      e
    );
  })(te || {}),
  Ls = (function (e) {
    return (
      (e[(e.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
      (e[(e.IgnoredByUrlHandlingStrategy = 1)] =
        "IgnoredByUrlHandlingStrategy"),
      e
    );
  })(Ls || {}),
  Fe = class extends ue {
    constructor(t, n, r, o) {
      super(t, n),
        (this.reason = r),
        (this.code = o),
        (this.type = q.NavigationCancel);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  ft = class extends ue {
    constructor(t, n, r, o) {
      super(t, n),
        (this.reason = r),
        (this.code = o),
        (this.type = q.NavigationSkipped);
    }
  },
  Vn = class extends ue {
    constructor(t, n, r, o) {
      super(t, n),
        (this.error = r),
        (this.target = o),
        (this.type = q.NavigationError);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  go = class extends ue {
    constructor(t, n, r, o) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.type = q.RoutesRecognized);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  js = class extends ue {
    constructor(t, n, r, o) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.type = q.GuardsCheckStart);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Vs = class extends ue {
    constructor(t, n, r, o, i) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.shouldActivate = i),
        (this.type = q.GuardsCheckEnd);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  $s = class extends ue {
    constructor(t, n, r, o) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.type = q.ResolveStart);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Bs = class extends ue {
    constructor(t, n, r, o) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.type = q.ResolveEnd);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Us = class {
    constructor(t) {
      (this.route = t), (this.type = q.RouteConfigLoadStart);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  Hs = class {
    constructor(t) {
      (this.route = t), (this.type = q.RouteConfigLoadEnd);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  zs = class {
    constructor(t) {
      (this.snapshot = t), (this.type = q.ChildActivationStart);
    }
    toString() {
      return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  },
  Gs = class {
    constructor(t) {
      (this.snapshot = t), (this.type = q.ChildActivationEnd);
    }
    toString() {
      return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  },
  qs = class {
    constructor(t) {
      (this.snapshot = t), (this.type = q.ActivationStart);
    }
    toString() {
      return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  },
  Ws = class {
    constructor(t) {
      (this.snapshot = t), (this.type = q.ActivationEnd);
    }
    toString() {
      return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  };
var $n = class {},
  Wt = class {
    constructor(t, n) {
      (this.url = t), (this.navigationBehaviorOptions = n);
    }
  };
function hv(e, t) {
  return (
    e.providers &&
      !e._injector &&
      (e._injector = ps(e.providers, t, `Route: ${e.path}`)),
    e._injector ?? t
  );
}
function me(e) {
  return e.outlet || I;
}
function pv(e, t) {
  let n = e.filter((r) => me(r) === t);
  return n.push(...e.filter((r) => me(r) !== t)), n;
}
function qn(e) {
  if (!e) return null;
  if (e.routeConfig?._injector) return e.routeConfig._injector;
  for (let t = e.parent; t; t = t.parent) {
    let n = t.routeConfig;
    if (n?._loadedInjector) return n._loadedInjector;
    if (n?._injector) return n._injector;
  }
  return null;
}
var Zs = class {
    get injector() {
      return qn(this.route?.snapshot) ?? this.rootInjector;
    }
    set injector(t) {}
    constructor(t) {
      (this.rootInjector = t),
        (this.outlet = null),
        (this.route = null),
        (this.children = new Io(this.rootInjector)),
        (this.attachRef = null);
    }
  },
  Io = (() => {
    class e {
      constructor(n) {
        (this.rootInjector = n), (this.contexts = new Map());
      }
      onChildOutletCreated(n, r) {
        let o = this.getOrCreateContext(n);
        (o.outlet = r), this.contexts.set(n, o);
      }
      onChildOutletDestroyed(n) {
        let r = this.getContext(n);
        r && ((r.outlet = null), (r.attachRef = null));
      }
      onOutletDeactivated() {
        let n = this.contexts;
        return (this.contexts = new Map()), n;
      }
      onOutletReAttached(n) {
        this.contexts = n;
      }
      getOrCreateContext(n) {
        let r = this.getContext(n);
        return (
          r || ((r = new Zs(this.rootInjector)), this.contexts.set(n, r)), r
        );
      }
      getContext(n) {
        return this.contexts.get(n) || null;
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(_(se));
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  mo = class {
    constructor(t) {
      this._root = t;
    }
    get root() {
      return this._root.value;
    }
    parent(t) {
      let n = this.pathFromRoot(t);
      return n.length > 1 ? n[n.length - 2] : null;
    }
    children(t) {
      let n = Qs(t, this._root);
      return n ? n.children.map((r) => r.value) : [];
    }
    firstChild(t) {
      let n = Qs(t, this._root);
      return n && n.children.length > 0 ? n.children[0].value : null;
    }
    siblings(t) {
      let n = Ys(t, this._root);
      return n.length < 2
        ? []
        : n[n.length - 2].children.map((o) => o.value).filter((o) => o !== t);
    }
    pathFromRoot(t) {
      return Ys(t, this._root).map((n) => n.value);
    }
  };
function Qs(e, t) {
  if (e === t.value) return t;
  for (let n of t.children) {
    let r = Qs(e, n);
    if (r) return r;
  }
  return null;
}
function Ys(e, t) {
  if (e === t.value) return [t];
  for (let n of t.children) {
    let r = Ys(e, n);
    if (r.length) return r.unshift(t), r;
  }
  return [];
}
var ee = class {
  constructor(t, n) {
    (this.value = t), (this.children = n);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function Ut(e) {
  let t = {};
  return e && e.children.forEach((n) => (t[n.value.outlet] = n)), t;
}
var vo = class extends mo {
  constructor(t, n) {
    super(t), (this.snapshot = n), sa(this, t);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function yd(e) {
  let t = gv(e),
    n = new z([new ct("", {})]),
    r = new z({}),
    o = new z({}),
    i = new z({}),
    s = new z(""),
    a = new Zt(n, r, i, s, o, I, e, t.root);
  return (a.snapshot = t.root), new vo(new ee(a, []), t);
}
function gv(e) {
  let t = {},
    n = {},
    r = {},
    o = "",
    i = new zt([], t, r, o, n, I, e, null, {});
  return new Do("", new ee(i, []));
}
var Zt = class {
  constructor(t, n, r, o, i, s, a, u) {
    (this.urlSubject = t),
      (this.paramsSubject = n),
      (this.queryParamsSubject = r),
      (this.fragmentSubject = o),
      (this.dataSubject = i),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = u),
      (this.title = this.dataSubject?.pipe(S((c) => c[Gn])) ?? w(void 0)),
      (this.url = t),
      (this.params = n),
      (this.queryParams = r),
      (this.fragment = o),
      (this.data = i);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (
      (this._paramMap ??= this.params.pipe(S((t) => qt(t)))), this._paramMap
    );
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(S((t) => qt(t)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function yo(e, t, n = "emptyOnly") {
  let r,
    { routeConfig: o } = e;
  return (
    t !== null &&
    (n === "always" ||
      o?.path === "" ||
      (!t.component && !t.routeConfig?.loadComponent))
      ? (r = {
          params: g(g({}, t.params), e.params),
          data: g(g({}, t.data), e.data),
          resolve: g(g(g(g({}, e.data), t.data), o?.data), e._resolvedData),
        })
      : (r = {
          params: g({}, e.params),
          data: g({}, e.data),
          resolve: g(g({}, e.data), e._resolvedData ?? {}),
        }),
    o && wd(o) && (r.resolve[Gn] = o.title),
    r
  );
}
var zt = class {
    get title() {
      return this.data?.[Gn];
    }
    constructor(t, n, r, o, i, s, a, u, c) {
      (this.url = t),
        (this.params = n),
        (this.queryParams = r),
        (this.fragment = o),
        (this.data = i),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = u),
        (this._resolve = c);
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return (this._paramMap ??= qt(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= qt(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      let t = this.url.map((r) => r.toString()).join("/"),
        n = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${t}', path:'${n}')`;
    }
  },
  Do = class extends mo {
    constructor(t, n) {
      super(n), (this.url = t), sa(this, n);
    }
    toString() {
      return Dd(this._root);
    }
  };
function sa(e, t) {
  (t.value._routerState = e), t.children.forEach((n) => sa(e, n));
}
function Dd(e) {
  let t = e.children.length > 0 ? ` { ${e.children.map(Dd).join(", ")} } ` : "";
  return `${e.value}${t}`;
}
function Ns(e) {
  if (e.snapshot) {
    let t = e.snapshot,
      n = e._futureSnapshot;
    (e.snapshot = n),
      Se(t.queryParams, n.queryParams) ||
        e.queryParamsSubject.next(n.queryParams),
      t.fragment !== n.fragment && e.fragmentSubject.next(n.fragment),
      Se(t.params, n.params) || e.paramsSubject.next(n.params),
      Um(t.url, n.url) || e.urlSubject.next(n.url),
      Se(t.data, n.data) || e.dataSubject.next(n.data);
  } else
    (e.snapshot = e._futureSnapshot),
      e.dataSubject.next(e._futureSnapshot.data);
}
function Ks(e, t) {
  let n = Se(e.params, t.params) && qm(e.url, t.url),
    r = !e.parent != !t.parent;
  return n && !r && (!e.parent || Ks(e.parent, t.parent));
}
function wd(e) {
  return typeof e.title == "string" || e.title === null;
}
var mv = (() => {
    class e {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = I),
          (this.activateEvents = new Z()),
          (this.deactivateEvents = new Z()),
          (this.attachEvents = new Z()),
          (this.detachEvents = new Z()),
          (this.parentContexts = h(Io)),
          (this.location = h(eo)),
          (this.changeDetector = h(En)),
          (this.inputBinder = h(aa, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(n) {
        if (n.name) {
          let { firstChange: r, previousValue: o } = n.name;
          if (r) return;
          this.isTrackedInParentContexts(o) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(n) {
        return this.parentContexts.getContext(n)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return;
        let n = this.parentContexts.getContext(this.name);
        n?.route &&
          (n.attachRef
            ? this.attach(n.attachRef, n.route)
            : this.activateWith(n.route, n.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new v(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new v(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new v(4012, !1);
        this.location.detach();
        let n = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(n.instance),
          n
        );
      }
      attach(n, r) {
        (this.activated = n),
          (this._activatedRoute = r),
          this.location.insert(n.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(n.instance);
      }
      deactivate() {
        if (this.activated) {
          let n = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(n);
        }
      }
      activateWith(n, r) {
        if (this.isActivated) throw new v(4013, !1);
        this._activatedRoute = n;
        let o = this.location,
          s = n.snapshot.component,
          a = this.parentContexts.getOrCreateContext(this.name).children,
          u = new Js(n, a, o.injector);
        (this.activated = o.createComponent(s, {
          index: o.length,
          injector: u,
          environmentInjector: r,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵdir = Hi({
          type: e,
          selectors: [["router-outlet"]],
          inputs: { name: "name" },
          outputs: {
            activateEvents: "activate",
            deactivateEvents: "deactivate",
            attachEvents: "attach",
            detachEvents: "detach",
          },
          exportAs: ["outlet"],
          standalone: !0,
          features: [Wr],
        });
      }
    }
    return e;
  })(),
  Js = class e {
    __ngOutletInjector(t) {
      return new e(this.route, this.childContexts, t);
    }
    constructor(t, n, r) {
      (this.route = t), (this.childContexts = n), (this.parent = r);
    }
    get(t, n) {
      return t === Zt
        ? this.route
        : t === Io
          ? this.childContexts
          : this.parent.get(t, n);
    }
  },
  aa = new E("");
function vv(e, t, n) {
  let r = Bn(e, t._root, n ? n._root : void 0);
  return new vo(r, t);
}
function Bn(e, t, n) {
  if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
    let r = n.value;
    r._futureSnapshot = t.value;
    let o = yv(e, t, n);
    return new ee(r, o);
  } else {
    if (e.shouldAttach(t.value)) {
      let i = e.retrieve(t.value);
      if (i !== null) {
        let s = i.route;
        return (
          (s.value._futureSnapshot = t.value),
          (s.children = t.children.map((a) => Bn(e, a))),
          s
        );
      }
    }
    let r = Dv(t.value),
      o = t.children.map((i) => Bn(e, i));
    return new ee(r, o);
  }
}
function yv(e, t, n) {
  return t.children.map((r) => {
    for (let o of n.children)
      if (e.shouldReuseRoute(r.value, o.value.snapshot)) return Bn(e, r, o);
    return Bn(e, r);
  });
}
function Dv(e) {
  return new Zt(
    new z(e.url),
    new z(e.params),
    new z(e.queryParams),
    new z(e.fragment),
    new z(e.data),
    e.outlet,
    e.component,
    e,
  );
}
var Un = class {
    constructor(t, n) {
      (this.redirectTo = t), (this.navigationBehaviorOptions = n);
    }
  },
  Cd = "ngNavigationCancelingError";
function wo(e, t) {
  let { redirectTo: n, navigationBehaviorOptions: r } = kn(t)
      ? { redirectTo: t, navigationBehaviorOptions: void 0 }
      : t,
    o = Id(!1, te.Redirect);
  return (o.url = n), (o.navigationBehaviorOptions = r), o;
}
function Id(e, t) {
  let n = new Error(`NavigationCancelingError: ${e || ""}`);
  return (n[Cd] = !0), (n.cancellationCode = t), n;
}
function wv(e) {
  return Ed(e) && kn(e.url);
}
function Ed(e) {
  return !!e && e[Cd];
}
var Cv = (e, t, n, r) =>
    S(
      (o) => (
        new Xs(t, o.targetRouterState, o.currentRouterState, n, r).activate(e),
        o
      ),
    ),
  Xs = class {
    constructor(t, n, r, o, i) {
      (this.routeReuseStrategy = t),
        (this.futureState = n),
        (this.currState = r),
        (this.forwardEvent = o),
        (this.inputBindingEnabled = i);
    }
    activate(t) {
      let n = this.futureState._root,
        r = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(n, r, t),
        Ns(this.futureState.root),
        this.activateChildRoutes(n, r, t);
    }
    deactivateChildRoutes(t, n, r) {
      let o = Ut(n);
      t.children.forEach((i) => {
        let s = i.value.outlet;
        this.deactivateRoutes(i, o[s], r), delete o[s];
      }),
        Object.values(o).forEach((i) => {
          this.deactivateRouteAndItsChildren(i, r);
        });
    }
    deactivateRoutes(t, n, r) {
      let o = t.value,
        i = n ? n.value : null;
      if (o === i)
        if (o.component) {
          let s = r.getContext(o.outlet);
          s && this.deactivateChildRoutes(t, n, s.children);
        } else this.deactivateChildRoutes(t, n, r);
      else i && this.deactivateRouteAndItsChildren(n, r);
    }
    deactivateRouteAndItsChildren(t, n) {
      t.value.component &&
      this.routeReuseStrategy.shouldDetach(t.value.snapshot)
        ? this.detachAndStoreRouteSubtree(t, n)
        : this.deactivateRouteAndOutlet(t, n);
    }
    detachAndStoreRouteSubtree(t, n) {
      let r = n.getContext(t.value.outlet),
        o = r && t.value.component ? r.children : n,
        i = Ut(t);
      for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
      if (r && r.outlet) {
        let s = r.outlet.detach(),
          a = r.children.onOutletDeactivated();
        this.routeReuseStrategy.store(t.value.snapshot, {
          componentRef: s,
          route: t,
          contexts: a,
        });
      }
    }
    deactivateRouteAndOutlet(t, n) {
      let r = n.getContext(t.value.outlet),
        o = r && t.value.component ? r.children : n,
        i = Ut(t);
      for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
      r &&
        (r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
        (r.attachRef = null),
        (r.route = null));
    }
    activateChildRoutes(t, n, r) {
      let o = Ut(n);
      t.children.forEach((i) => {
        this.activateRoutes(i, o[i.value.outlet], r),
          this.forwardEvent(new Ws(i.value.snapshot));
      }),
        t.children.length && this.forwardEvent(new Gs(t.value.snapshot));
    }
    activateRoutes(t, n, r) {
      let o = t.value,
        i = n ? n.value : null;
      if ((Ns(o), o === i))
        if (o.component) {
          let s = r.getOrCreateContext(o.outlet);
          this.activateChildRoutes(t, n, s.children);
        } else this.activateChildRoutes(t, n, r);
      else if (o.component) {
        let s = r.getOrCreateContext(o.outlet);
        if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(o.snapshot);
          this.routeReuseStrategy.store(o.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            Ns(a.route.value),
            this.activateChildRoutes(t, null, s.children);
        } else
          (s.attachRef = null),
            (s.route = o),
            s.outlet && s.outlet.activateWith(o, s.injector),
            this.activateChildRoutes(t, null, s.children);
      } else this.activateChildRoutes(t, null, r);
    }
  },
  Co = class {
    constructor(t) {
      (this.path = t), (this.route = this.path[this.path.length - 1]);
    }
  },
  Gt = class {
    constructor(t, n) {
      (this.component = t), (this.route = n);
    }
  };
function Iv(e, t, n) {
  let r = e._root,
    o = t ? t._root : null;
  return Nn(r, o, n, [r.value]);
}
function Ev(e) {
  let t = e.routeConfig ? e.routeConfig.canActivateChild : null;
  return !t || t.length === 0 ? null : { node: e, guards: t };
}
function Yt(e, t) {
  let n = Symbol(),
    r = t.get(e, n);
  return r === n ? (typeof e == "function" && !xu(e) ? e : t.get(e)) : r;
}
function Nn(
  e,
  t,
  n,
  r,
  o = { canDeactivateChecks: [], canActivateChecks: [] },
) {
  let i = Ut(t);
  return (
    e.children.forEach((s) => {
      bv(s, i[s.value.outlet], n, r.concat([s.value]), o),
        delete i[s.value.outlet];
    }),
    Object.entries(i).forEach(([s, a]) => Pn(a, n.getContext(s), o)),
    o
  );
}
function bv(
  e,
  t,
  n,
  r,
  o = { canDeactivateChecks: [], canActivateChecks: [] },
) {
  let i = e.value,
    s = t ? t.value : null,
    a = n ? n.getContext(e.value.outlet) : null;
  if (s && i.routeConfig === s.routeConfig) {
    let u = Sv(s, i, i.routeConfig.runGuardsAndResolvers);
    u
      ? o.canActivateChecks.push(new Co(r))
      : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
      i.component ? Nn(e, t, a ? a.children : null, r, o) : Nn(e, t, n, r, o),
      u &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        o.canDeactivateChecks.push(new Gt(a.outlet.component, s));
  } else
    s && Pn(t, a, o),
      o.canActivateChecks.push(new Co(r)),
      i.component
        ? Nn(e, null, a ? a.children : null, r, o)
        : Nn(e, null, n, r, o);
  return o;
}
function Sv(e, t, n) {
  if (typeof n == "function") return n(e, t);
  switch (n) {
    case "pathParamsChange":
      return !lt(e.url, t.url);
    case "pathParamsOrQueryParamsChange":
      return !lt(e.url, t.url) || !Se(e.queryParams, t.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !Ks(e, t) || !Se(e.queryParams, t.queryParams);
    case "paramsChange":
    default:
      return !Ks(e, t);
  }
}
function Pn(e, t, n) {
  let r = Ut(e),
    o = e.value;
  Object.entries(r).forEach(([i, s]) => {
    o.component
      ? t
        ? Pn(s, t.children.getContext(i), n)
        : Pn(s, null, n)
      : Pn(s, t, n);
  }),
    o.component
      ? t && t.outlet && t.outlet.isActivated
        ? n.canDeactivateChecks.push(new Gt(t.outlet.component, o))
        : n.canDeactivateChecks.push(new Gt(null, o))
      : n.canDeactivateChecks.push(new Gt(null, o));
}
function Wn(e) {
  return typeof e == "function";
}
function Mv(e) {
  return typeof e == "boolean";
}
function _v(e) {
  return e && Wn(e.canLoad);
}
function Tv(e) {
  return e && Wn(e.canActivate);
}
function xv(e) {
  return e && Wn(e.canActivateChild);
}
function Nv(e) {
  return e && Wn(e.canDeactivate);
}
function Av(e) {
  return e && Wn(e.canMatch);
}
function bd(e) {
  return e instanceof Me || e?.name === "EmptyError";
}
var uo = Symbol("INITIAL_VALUE");
function Qt() {
  return de((e) =>
    hr(e.map((t) => t.pipe(_e(1), Yo(uo)))).pipe(
      S((t) => {
        for (let n of t)
          if (n !== !0) {
            if (n === uo) return uo;
            if (n === !1 || Rv(n)) return n;
          }
        return !0;
      }),
      le((t) => t !== uo),
      _e(1),
    ),
  );
}
function Rv(e) {
  return kn(e) || e instanceof Un;
}
function Ov(e, t) {
  return U((n) => {
    let {
      targetSnapshot: r,
      currentSnapshot: o,
      guards: { canActivateChecks: i, canDeactivateChecks: s },
    } = n;
    return s.length === 0 && i.length === 0
      ? w(k(g({}, n), { guardsResult: !0 }))
      : Pv(s, r, o, e).pipe(
          U((a) => (a && Mv(a) ? Fv(r, i, e, t) : w(a))),
          S((a) => k(g({}, n), { guardsResult: a })),
        );
  });
}
function Pv(e, t, n, r) {
  return B(e).pipe(
    U((o) => $v(o.component, o.route, n, t, r)),
    De((o) => o !== !0, !0),
  );
}
function Fv(e, t, n, r) {
  return B(t).pipe(
    Et((o) =>
      It(
        Lv(o.route.parent, r),
        kv(o.route, r),
        Vv(e, o.path, n),
        jv(e, o.route, n),
      ),
    ),
    De((o) => o !== !0, !0),
  );
}
function kv(e, t) {
  return e !== null && t && t(new qs(e)), w(!0);
}
function Lv(e, t) {
  return e !== null && t && t(new zs(e)), w(!0);
}
function jv(e, t, n) {
  let r = t.routeConfig ? t.routeConfig.canActivate : null;
  if (!r || r.length === 0) return w(!0);
  let o = r.map((i) =>
    pr(() => {
      let s = qn(t) ?? n,
        a = Yt(i, s),
        u = Tv(a) ? a.canActivate(t, e) : Ne(s, () => a(t, e));
      return We(u).pipe(De());
    }),
  );
  return w(o).pipe(Qt());
}
function Vv(e, t, n) {
  let r = t[t.length - 1],
    i = t
      .slice(0, t.length - 1)
      .reverse()
      .map((s) => Ev(s))
      .filter((s) => s !== null)
      .map((s) =>
        pr(() => {
          let a = s.guards.map((u) => {
            let c = qn(s.node) ?? n,
              l = Yt(u, c),
              d = xv(l) ? l.canActivateChild(r, e) : Ne(c, () => l(r, e));
            return We(d).pipe(De());
          });
          return w(a).pipe(Qt());
        }),
      );
  return w(i).pipe(Qt());
}
function $v(e, t, n, r, o) {
  let i = t && t.routeConfig ? t.routeConfig.canDeactivate : null;
  if (!i || i.length === 0) return w(!0);
  let s = i.map((a) => {
    let u = qn(t) ?? o,
      c = Yt(a, u),
      l = Nv(c) ? c.canDeactivate(e, t, n, r) : Ne(u, () => c(e, t, n, r));
    return We(l).pipe(De());
  });
  return w(s).pipe(Qt());
}
function Bv(e, t, n, r) {
  let o = t.canLoad;
  if (o === void 0 || o.length === 0) return w(!0);
  let i = o.map((s) => {
    let a = Yt(s, e),
      u = _v(a) ? a.canLoad(t, n) : Ne(e, () => a(t, n));
    return We(u);
  });
  return w(i).pipe(Qt(), Sd(r));
}
function Sd(e) {
  return Bo(
    G((t) => {
      if (typeof t != "boolean") throw wo(e, t);
    }),
    S((t) => t === !0),
  );
}
function Uv(e, t, n, r) {
  let o = t.canMatch;
  if (!o || o.length === 0) return w(!0);
  let i = o.map((s) => {
    let a = Yt(s, e),
      u = Av(a) ? a.canMatch(t, n) : Ne(e, () => a(t, n));
    return We(u);
  });
  return w(i).pipe(Qt(), Sd(r));
}
var Hn = class {
    constructor(t) {
      this.segmentGroup = t || null;
    }
  },
  zn = class extends Error {
    constructor(t) {
      super(), (this.urlTree = t);
    }
  };
function Bt(e) {
  return Ct(new Hn(e));
}
function Hv(e) {
  return Ct(new v(4e3, !1));
}
function zv(e) {
  return Ct(Id(!1, te.GuardRejected));
}
var ea = class {
    constructor(t, n) {
      (this.urlSerializer = t), (this.urlTree = n);
    }
    lineralizeSegments(t, n) {
      let r = [],
        o = n.root;
      for (;;) {
        if (((r = r.concat(o.segments)), o.numberOfChildren === 0)) return w(r);
        if (o.numberOfChildren > 1 || !o.children[I])
          return Hv(`${t.redirectTo}`);
        o = o.children[I];
      }
    }
    applyRedirectCommands(t, n, r, o, i) {
      if (typeof n != "string") {
        let a = n,
          {
            queryParams: u,
            fragment: c,
            routeConfig: l,
            url: d,
            outlet: p,
            params: f,
            data: m,
            title: A,
          } = o,
          $ = Ne(i, () =>
            a({
              params: f,
              data: m,
              queryParams: u,
              fragment: c,
              routeConfig: l,
              url: d,
              outlet: p,
              title: A,
            }),
          );
        if ($ instanceof ke) throw new zn($);
        n = $;
      }
      let s = this.applyRedirectCreateUrlTree(
        n,
        this.urlSerializer.parse(n),
        t,
        r,
      );
      if (n[0] === "/") throw new zn(s);
      return s;
    }
    applyRedirectCreateUrlTree(t, n, r, o) {
      let i = this.createSegmentGroup(t, n.root, r, o);
      return new ke(
        i,
        this.createQueryParams(n.queryParams, this.urlTree.queryParams),
        n.fragment,
      );
    }
    createQueryParams(t, n) {
      let r = {};
      return (
        Object.entries(t).forEach(([o, i]) => {
          if (typeof i == "string" && i[0] === ":") {
            let a = i.substring(1);
            r[o] = n[a];
          } else r[o] = i;
        }),
        r
      );
    }
    createSegmentGroup(t, n, r, o) {
      let i = this.createSegments(t, n.segments, r, o),
        s = {};
      return (
        Object.entries(n.children).forEach(([a, u]) => {
          s[a] = this.createSegmentGroup(t, u, r, o);
        }),
        new N(i, s)
      );
    }
    createSegments(t, n, r, o) {
      return n.map((i) =>
        i.path[0] === ":"
          ? this.findPosParam(t, i, o)
          : this.findOrReturn(i, r),
      );
    }
    findPosParam(t, n, r) {
      let o = r[n.path.substring(1)];
      if (!o) throw new v(4001, !1);
      return o;
    }
    findOrReturn(t, n) {
      let r = 0;
      for (let o of n) {
        if (o.path === t.path) return n.splice(r), o;
        r++;
      }
      return t;
    }
  },
  ta = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function Gv(e, t, n, r, o) {
  let i = Md(e, t, n);
  return i.matched
    ? ((r = hv(t, r)),
      Uv(r, t, n, o).pipe(S((s) => (s === !0 ? i : g({}, ta)))))
    : w(i);
}
function Md(e, t, n) {
  if (t.path === "**") return qv(n);
  if (t.path === "")
    return t.pathMatch === "full" && (e.hasChildren() || n.length > 0)
      ? g({}, ta)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: n,
          parameters: {},
          positionalParamSegments: {},
        };
  let o = (t.matcher || Bm)(n, e, t);
  if (!o) return g({}, ta);
  let i = {};
  Object.entries(o.posParams ?? {}).forEach(([a, u]) => {
    i[a] = u.path;
  });
  let s =
    o.consumed.length > 0
      ? g(g({}, i), o.consumed[o.consumed.length - 1].parameters)
      : i;
  return {
    matched: !0,
    consumedSegments: o.consumed,
    remainingSegments: n.slice(o.consumed.length),
    parameters: s,
    positionalParamSegments: o.posParams ?? {},
  };
}
function qv(e) {
  return {
    matched: !0,
    parameters: e.length > 0 ? id(e).parameters : {},
    consumedSegments: e,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function td(e, t, n, r) {
  return n.length > 0 && Qv(e, n, r)
    ? {
        segmentGroup: new N(t, Zv(r, new N(n, e.children))),
        slicedSegments: [],
      }
    : n.length === 0 && Yv(e, n, r)
      ? {
          segmentGroup: new N(e.segments, Wv(e, n, r, e.children)),
          slicedSegments: n,
        }
      : { segmentGroup: new N(e.segments, e.children), slicedSegments: n };
}
function Wv(e, t, n, r) {
  let o = {};
  for (let i of n)
    if (Eo(e, t, i) && !r[me(i)]) {
      let s = new N([], {});
      o[me(i)] = s;
    }
  return g(g({}, r), o);
}
function Zv(e, t) {
  let n = {};
  n[I] = t;
  for (let r of e)
    if (r.path === "" && me(r) !== I) {
      let o = new N([], {});
      n[me(r)] = o;
    }
  return n;
}
function Qv(e, t, n) {
  return n.some((r) => Eo(e, t, r) && me(r) !== I);
}
function Yv(e, t, n) {
  return n.some((r) => Eo(e, t, r));
}
function Eo(e, t, n) {
  return (e.hasChildren() || t.length > 0) && n.pathMatch === "full"
    ? !1
    : n.path === "";
}
function Kv(e, t, n) {
  return t.length === 0 && !e.children[n];
}
var na = class {};
function Jv(e, t, n, r, o, i, s = "emptyOnly") {
  return new ra(e, t, n, r, o, s, i).recognize();
}
var Xv = 31,
  ra = class {
    constructor(t, n, r, o, i, s, a) {
      (this.injector = t),
        (this.configLoader = n),
        (this.rootComponentType = r),
        (this.config = o),
        (this.urlTree = i),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new ea(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(t) {
      return new v(4002, `'${t.segmentGroup}'`);
    }
    recognize() {
      let t = td(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(t).pipe(
        S(({ children: n, rootSnapshot: r }) => {
          let o = new ee(r, n),
            i = new Do("", o),
            s = sv(r, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (i.url = this.urlSerializer.serialize(s)),
            { state: i, tree: s }
          );
        }),
      );
    }
    match(t) {
      let n = new zt(
        [],
        Object.freeze({}),
        Object.freeze(g({}, this.urlTree.queryParams)),
        this.urlTree.fragment,
        Object.freeze({}),
        I,
        this.rootComponentType,
        null,
        {},
      );
      return this.processSegmentGroup(this.injector, this.config, t, I, n).pipe(
        S((r) => ({ children: r, rootSnapshot: n })),
        je((r) => {
          if (r instanceof zn)
            return (this.urlTree = r.urlTree), this.match(r.urlTree.root);
          throw r instanceof Hn ? this.noMatchError(r) : r;
        }),
      );
    }
    processSegmentGroup(t, n, r, o, i) {
      return r.segments.length === 0 && r.hasChildren()
        ? this.processChildren(t, n, r, i)
        : this.processSegment(t, n, r, r.segments, o, !0, i).pipe(
            S((s) => (s instanceof ee ? [s] : [])),
          );
    }
    processChildren(t, n, r, o) {
      let i = [];
      for (let s of Object.keys(r.children))
        s === "primary" ? i.unshift(s) : i.push(s);
      return B(i).pipe(
        Et((s) => {
          let a = r.children[s],
            u = pv(n, s);
          return this.processSegmentGroup(t, u, a, s, o);
        }),
        Qo((s, a) => (s.push(...a), s)),
        Ve(null),
        Zo(),
        U((s) => {
          if (s === null) return Bt(r);
          let a = _d(s);
          return ey(a), w(a);
        }),
      );
    }
    processSegment(t, n, r, o, i, s, a) {
      return B(n).pipe(
        Et((u) =>
          this.processSegmentAgainstRoute(
            u._injector ?? t,
            n,
            u,
            r,
            o,
            i,
            s,
            a,
          ).pipe(
            je((c) => {
              if (c instanceof Hn) return w(null);
              throw c;
            }),
          ),
        ),
        De((u) => !!u),
        je((u) => {
          if (bd(u)) return Kv(r, o, i) ? w(new na()) : Bt(r);
          throw u;
        }),
      );
    }
    processSegmentAgainstRoute(t, n, r, o, i, s, a, u) {
      return me(r) !== s && (s === I || !Eo(o, i, r))
        ? Bt(o)
        : r.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(t, o, r, i, s, u)
          : this.allowRedirects && a
            ? this.expandSegmentAgainstRouteUsingRedirect(t, o, n, r, i, s, u)
            : Bt(o);
    }
    expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s, a) {
      let {
        matched: u,
        parameters: c,
        consumedSegments: l,
        positionalParamSegments: d,
        remainingSegments: p,
      } = Md(n, o, i);
      if (!u) return Bt(n);
      typeof o.redirectTo == "string" &&
        o.redirectTo[0] === "/" &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > Xv && (this.allowRedirects = !1));
      let f = new zt(
          i,
          c,
          Object.freeze(g({}, this.urlTree.queryParams)),
          this.urlTree.fragment,
          nd(o),
          me(o),
          o.component ?? o._loadedComponent ?? null,
          o,
          rd(o),
        ),
        m = yo(f, a, this.paramsInheritanceStrategy);
      (f.params = Object.freeze(m.params)), (f.data = Object.freeze(m.data));
      let A = this.applyRedirects.applyRedirectCommands(
        l,
        o.redirectTo,
        d,
        f,
        t,
      );
      return this.applyRedirects
        .lineralizeSegments(o, A)
        .pipe(U(($) => this.processSegment(t, r, n, $.concat(p), s, !1, a)));
    }
    matchSegmentAgainstRoute(t, n, r, o, i, s) {
      let a = Gv(n, r, o, t, this.urlSerializer);
      return (
        r.path === "**" && (n.children = {}),
        a.pipe(
          de((u) =>
            u.matched
              ? ((t = r._injector ?? t),
                this.getChildConfig(t, r, o).pipe(
                  de(({ routes: c }) => {
                    let l = r._loadedInjector ?? t,
                      {
                        parameters: d,
                        consumedSegments: p,
                        remainingSegments: f,
                      } = u,
                      m = new zt(
                        p,
                        d,
                        Object.freeze(g({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        nd(r),
                        me(r),
                        r.component ?? r._loadedComponent ?? null,
                        r,
                        rd(r),
                      ),
                      A = yo(m, s, this.paramsInheritanceStrategy);
                    (m.params = Object.freeze(A.params)),
                      (m.data = Object.freeze(A.data));
                    let { segmentGroup: $, slicedSegments: L } = td(n, p, f, c);
                    if (L.length === 0 && $.hasChildren())
                      return this.processChildren(l, c, $, m).pipe(
                        S((Ze) => new ee(m, Ze)),
                      );
                    if (c.length === 0 && L.length === 0)
                      return w(new ee(m, []));
                    let ve = me(r) === i;
                    return this.processSegment(
                      l,
                      c,
                      $,
                      L,
                      ve ? I : i,
                      !0,
                      m,
                    ).pipe(S((Ze) => new ee(m, Ze instanceof ee ? [Ze] : [])));
                  }),
                ))
              : Bt(n),
          ),
        )
      );
    }
    getChildConfig(t, n, r) {
      return n.children
        ? w({ routes: n.children, injector: t })
        : n.loadChildren
          ? n._loadedRoutes !== void 0
            ? w({ routes: n._loadedRoutes, injector: n._loadedInjector })
            : Bv(t, n, r, this.urlSerializer).pipe(
                U((o) =>
                  o
                    ? this.configLoader.loadChildren(t, n).pipe(
                        G((i) => {
                          (n._loadedRoutes = i.routes),
                            (n._loadedInjector = i.injector);
                        }),
                      )
                    : zv(n),
                ),
              )
          : w({ routes: [], injector: t });
    }
  };
function ey(e) {
  e.sort((t, n) =>
    t.value.outlet === I
      ? -1
      : n.value.outlet === I
        ? 1
        : t.value.outlet.localeCompare(n.value.outlet),
  );
}
function ty(e) {
  let t = e.value.routeConfig;
  return t && t.path === "";
}
function _d(e) {
  let t = [],
    n = new Set();
  for (let r of e) {
    if (!ty(r)) {
      t.push(r);
      continue;
    }
    let o = t.find((i) => r.value.routeConfig === i.value.routeConfig);
    o !== void 0 ? (o.children.push(...r.children), n.add(o)) : t.push(r);
  }
  for (let r of n) {
    let o = _d(r.children);
    t.push(new ee(r.value, o));
  }
  return t.filter((r) => !n.has(r));
}
function nd(e) {
  return e.data || {};
}
function rd(e) {
  return e.resolve || {};
}
function ny(e, t, n, r, o, i) {
  return U((s) =>
    Jv(e, t, n, r, s.extractedUrl, o, i).pipe(
      S(({ state: a, tree: u }) =>
        k(g({}, s), { targetSnapshot: a, urlAfterRedirects: u }),
      ),
    ),
  );
}
function ry(e, t) {
  return U((n) => {
    let {
      targetSnapshot: r,
      guards: { canActivateChecks: o },
    } = n;
    if (!o.length) return w(n);
    let i = new Set(o.map((u) => u.route)),
      s = new Set();
    for (let u of i) if (!s.has(u)) for (let c of Td(u)) s.add(c);
    let a = 0;
    return B(s).pipe(
      Et((u) =>
        i.has(u)
          ? oy(u, r, e, t)
          : ((u.data = yo(u, u.parent, e).resolve), w(void 0)),
      ),
      G(() => a++),
      bt(1),
      U((u) => (a === s.size ? w(n) : J)),
    );
  });
}
function Td(e) {
  let t = e.children.map((n) => Td(n)).flat();
  return [e, ...t];
}
function oy(e, t, n, r) {
  let o = e.routeConfig,
    i = e._resolve;
  return (
    o?.title !== void 0 && !wd(o) && (i[Gn] = o.title),
    iy(i, e, t, r).pipe(
      S(
        (s) => (
          (e._resolvedData = s), (e.data = yo(e, e.parent, n).resolve), null
        ),
      ),
    )
  );
}
function iy(e, t, n, r) {
  let o = Os(e);
  if (o.length === 0) return w({});
  let i = {};
  return B(o).pipe(
    U((s) =>
      sy(e[s], t, n, r).pipe(
        De(),
        G((a) => {
          if (a instanceof Un) throw wo(new Fn(), a);
          i[s] = a;
        }),
      ),
    ),
    bt(1),
    Wo(i),
    je((s) => (bd(s) ? J : Ct(s))),
  );
}
function sy(e, t, n, r) {
  let o = qn(t) ?? r,
    i = Yt(e, o),
    s = i.resolve ? i.resolve(t, n) : Ne(o, () => i(t, n));
  return We(s);
}
function As(e) {
  return de((t) => {
    let n = e(t);
    return n ? B(n).pipe(S(() => t)) : w(t);
  });
}
var xd = (() => {
    class e {
      buildTitle(n) {
        let r,
          o = n.root;
        for (; o !== void 0; )
          (r = this.getResolvedTitleForRoute(o) ?? r),
            (o = o.children.find((i) => i.outlet === I));
        return r;
      }
      getResolvedTitleForRoute(n) {
        return n.data[Gn];
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: () => h(ay), providedIn: "root" });
      }
    }
    return e;
  })(),
  ay = (() => {
    class e extends xd {
      constructor(n) {
        super(), (this.title = n);
      }
      updateTitle(n) {
        let r = this.buildTitle(n);
        r !== void 0 && this.title.setTitle(r);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(_(Yl));
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  ua = new E("", { providedIn: "root", factory: () => ({}) }),
  uy = (() => {
    class e {
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵcmp = pn({
          type: e,
          selectors: [["ng-component"]],
          standalone: !0,
          features: [Cn],
          decls: 1,
          vars: 0,
          template: function (r, o) {
            r & 1 && gs(0, "router-outlet");
          },
          dependencies: [mv],
          encapsulation: 2,
        });
      }
    }
    return e;
  })();
function ca(e) {
  let t = e.children && e.children.map(ca),
    n = t ? k(g({}, e), { children: t }) : g({}, e);
  return (
    !n.component &&
      !n.loadComponent &&
      (t || n.loadChildren) &&
      n.outlet &&
      n.outlet !== I &&
      (n.component = uy),
    n
  );
}
var la = new E(""),
  cy = (() => {
    class e {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = h(ys));
      }
      loadComponent(n) {
        if (this.componentLoaders.get(n)) return this.componentLoaders.get(n);
        if (n._loadedComponent) return w(n._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(n);
        let r = We(n.loadComponent()).pipe(
            S(Nd),
            G((i) => {
              this.onLoadEndListener && this.onLoadEndListener(n),
                (n._loadedComponent = i);
            }),
            Xt(() => {
              this.componentLoaders.delete(n);
            }),
          ),
          o = new wt(r, () => new W()).pipe(Dt());
        return this.componentLoaders.set(n, o), o;
      }
      loadChildren(n, r) {
        if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
        if (r._loadedRoutes)
          return w({ routes: r._loadedRoutes, injector: r._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(r);
        let i = ly(r, this.compiler, n, this.onLoadEndListener).pipe(
            Xt(() => {
              this.childrenLoaders.delete(r);
            }),
          ),
          s = new wt(i, () => new W()).pipe(Dt());
        return this.childrenLoaders.set(r, s), s;
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })();
function ly(e, t, n, r) {
  return We(e.loadChildren()).pipe(
    S(Nd),
    U((o) =>
      o instanceof fn || Array.isArray(o) ? w(o) : B(t.compileModuleAsync(o)),
    ),
    S((o) => {
      r && r(e);
      let i,
        s,
        a = !1;
      return (
        Array.isArray(o)
          ? ((s = o), (a = !0))
          : ((i = o.create(n).injector),
            (s = i.get(la, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(ca), injector: i }
      );
    }),
  );
}
function dy(e) {
  return e && typeof e == "object" && "default" in e;
}
function Nd(e) {
  return dy(e) ? e.default : e;
}
var da = (() => {
    class e {
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: () => h(fy), providedIn: "root" });
      }
    }
    return e;
  })(),
  fy = (() => {
    class e {
      shouldProcessUrl(n) {
        return !0;
      }
      extract(n) {
        return n;
      }
      merge(n, r) {
        return n;
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  hy = new E("");
var py = new E(""),
  gy = (() => {
    class e {
      get hasRequestedNavigation() {
        return this.navigationId !== 0;
      }
      constructor() {
        (this.currentNavigation = null),
          (this.currentTransition = null),
          (this.lastSuccessfulNavigation = null),
          (this.events = new W()),
          (this.transitionAbortSubject = new W()),
          (this.configLoader = h(cy)),
          (this.environmentInjector = h(se)),
          (this.urlSerializer = h(ia)),
          (this.rootContexts = h(Io)),
          (this.location = h(Sn)),
          (this.inputBindingEnabled = h(aa, { optional: !0 }) !== null),
          (this.titleStrategy = h(xd)),
          (this.options = h(ua, { optional: !0 }) || {}),
          (this.paramsInheritanceStrategy =
            this.options.paramsInheritanceStrategy || "emptyOnly"),
          (this.urlHandlingStrategy = h(da)),
          (this.createViewTransition = h(hy, { optional: !0 })),
          (this.navigationErrorHandler = h(py, { optional: !0 })),
          (this.navigationId = 0),
          (this.afterPreactivation = () => w(void 0)),
          (this.rootComponentType = null);
        let n = (o) => this.events.next(new Us(o)),
          r = (o) => this.events.next(new Hs(o));
        (this.configLoader.onLoadEndListener = r),
          (this.configLoader.onLoadStartListener = n);
      }
      complete() {
        this.transitions?.complete();
      }
      handleNavigationRequest(n) {
        let r = ++this.navigationId;
        this.transitions?.next(
          k(g(g({}, this.transitions.value), n), { id: r }),
        );
      }
      setupNavigations(n, r, o) {
        return (
          (this.transitions = new z({
            id: 0,
            currentUrlTree: r,
            currentRawUrl: r,
            extractedUrl: this.urlHandlingStrategy.extract(r),
            urlAfterRedirects: this.urlHandlingStrategy.extract(r),
            rawUrl: r,
            extras: {},
            resolve: () => {},
            reject: () => {},
            promise: Promise.resolve(!0),
            source: On,
            restoredState: null,
            currentSnapshot: o.snapshot,
            targetSnapshot: null,
            currentRouterState: o,
            targetRouterState: null,
            guards: { canActivateChecks: [], canDeactivateChecks: [] },
            guardsResult: null,
          })),
          this.transitions.pipe(
            le((i) => i.id !== 0),
            S((i) =>
              k(g({}, i), {
                extractedUrl: this.urlHandlingStrategy.extract(i.rawUrl),
              }),
            ),
            de((i) => {
              let s = !1,
                a = !1;
              return w(i).pipe(
                de((u) => {
                  if (this.navigationId > i.id)
                    return (
                      this.cancelNavigationTransition(
                        i,
                        "",
                        te.SupersededByNewNavigation,
                      ),
                      J
                    );
                  (this.currentTransition = i),
                    (this.currentNavigation = {
                      id: u.id,
                      initialUrl: u.rawUrl,
                      extractedUrl: u.extractedUrl,
                      targetBrowserUrl:
                        typeof u.extras.browserUrl == "string"
                          ? this.urlSerializer.parse(u.extras.browserUrl)
                          : u.extras.browserUrl,
                      trigger: u.source,
                      extras: u.extras,
                      previousNavigation: this.lastSuccessfulNavigation
                        ? k(g({}, this.lastSuccessfulNavigation), {
                            previousNavigation: null,
                          })
                        : null,
                    });
                  let c =
                      !n.navigated ||
                      this.isUpdatingInternalState() ||
                      this.isUpdatedBrowserUrl(),
                    l = u.extras.onSameUrlNavigation ?? n.onSameUrlNavigation;
                  if (!c && l !== "reload") {
                    let d = "";
                    return (
                      this.events.next(
                        new ft(
                          u.id,
                          this.urlSerializer.serialize(u.rawUrl),
                          d,
                          Ls.IgnoredSameUrlNavigation,
                        ),
                      ),
                      u.resolve(!1),
                      J
                    );
                  }
                  if (this.urlHandlingStrategy.shouldProcessUrl(u.rawUrl))
                    return w(u).pipe(
                      de((d) => {
                        let p = this.transitions?.getValue();
                        return (
                          this.events.next(
                            new jn(
                              d.id,
                              this.urlSerializer.serialize(d.extractedUrl),
                              d.source,
                              d.restoredState,
                            ),
                          ),
                          p !== this.transitions?.getValue()
                            ? J
                            : Promise.resolve(d)
                        );
                      }),
                      ny(
                        this.environmentInjector,
                        this.configLoader,
                        this.rootComponentType,
                        n.config,
                        this.urlSerializer,
                        this.paramsInheritanceStrategy,
                      ),
                      G((d) => {
                        (i.targetSnapshot = d.targetSnapshot),
                          (i.urlAfterRedirects = d.urlAfterRedirects),
                          (this.currentNavigation = k(
                            g({}, this.currentNavigation),
                            { finalUrl: d.urlAfterRedirects },
                          ));
                        let p = new go(
                          d.id,
                          this.urlSerializer.serialize(d.extractedUrl),
                          this.urlSerializer.serialize(d.urlAfterRedirects),
                          d.targetSnapshot,
                        );
                        this.events.next(p);
                      }),
                    );
                  if (
                    c &&
                    this.urlHandlingStrategy.shouldProcessUrl(u.currentRawUrl)
                  ) {
                    let {
                        id: d,
                        extractedUrl: p,
                        source: f,
                        restoredState: m,
                        extras: A,
                      } = u,
                      $ = new jn(d, this.urlSerializer.serialize(p), f, m);
                    this.events.next($);
                    let L = yd(this.rootComponentType).snapshot;
                    return (
                      (this.currentTransition = i =
                        k(g({}, u), {
                          targetSnapshot: L,
                          urlAfterRedirects: p,
                          extras: k(g({}, A), {
                            skipLocationChange: !1,
                            replaceUrl: !1,
                          }),
                        })),
                      (this.currentNavigation.finalUrl = p),
                      w(i)
                    );
                  } else {
                    let d = "";
                    return (
                      this.events.next(
                        new ft(
                          u.id,
                          this.urlSerializer.serialize(u.extractedUrl),
                          d,
                          Ls.IgnoredByUrlHandlingStrategy,
                        ),
                      ),
                      u.resolve(!1),
                      J
                    );
                  }
                }),
                G((u) => {
                  let c = new js(
                    u.id,
                    this.urlSerializer.serialize(u.extractedUrl),
                    this.urlSerializer.serialize(u.urlAfterRedirects),
                    u.targetSnapshot,
                  );
                  this.events.next(c);
                }),
                S(
                  (u) => (
                    (this.currentTransition = i =
                      k(g({}, u), {
                        guards: Iv(
                          u.targetSnapshot,
                          u.currentSnapshot,
                          this.rootContexts,
                        ),
                      })),
                    i
                  ),
                ),
                Ov(this.environmentInjector, (u) => this.events.next(u)),
                G((u) => {
                  if (
                    ((i.guardsResult = u.guardsResult),
                    u.guardsResult && typeof u.guardsResult != "boolean")
                  )
                    throw wo(this.urlSerializer, u.guardsResult);
                  let c = new Vs(
                    u.id,
                    this.urlSerializer.serialize(u.extractedUrl),
                    this.urlSerializer.serialize(u.urlAfterRedirects),
                    u.targetSnapshot,
                    !!u.guardsResult,
                  );
                  this.events.next(c);
                }),
                le((u) =>
                  u.guardsResult
                    ? !0
                    : (this.cancelNavigationTransition(u, "", te.GuardRejected),
                      !1),
                ),
                As((u) => {
                  if (u.guards.canActivateChecks.length)
                    return w(u).pipe(
                      G((c) => {
                        let l = new $s(
                          c.id,
                          this.urlSerializer.serialize(c.extractedUrl),
                          this.urlSerializer.serialize(c.urlAfterRedirects),
                          c.targetSnapshot,
                        );
                        this.events.next(l);
                      }),
                      de((c) => {
                        let l = !1;
                        return w(c).pipe(
                          ry(
                            this.paramsInheritanceStrategy,
                            this.environmentInjector,
                          ),
                          G({
                            next: () => (l = !0),
                            complete: () => {
                              l ||
                                this.cancelNavigationTransition(
                                  c,
                                  "",
                                  te.NoDataFromResolver,
                                );
                            },
                          }),
                        );
                      }),
                      G((c) => {
                        let l = new Bs(
                          c.id,
                          this.urlSerializer.serialize(c.extractedUrl),
                          this.urlSerializer.serialize(c.urlAfterRedirects),
                          c.targetSnapshot,
                        );
                        this.events.next(l);
                      }),
                    );
                }),
                As((u) => {
                  let c = (l) => {
                    let d = [];
                    l.routeConfig?.loadComponent &&
                      !l.routeConfig._loadedComponent &&
                      d.push(
                        this.configLoader.loadComponent(l.routeConfig).pipe(
                          G((p) => {
                            l.component = p;
                          }),
                          S(() => {}),
                        ),
                      );
                    for (let p of l.children) d.push(...c(p));
                    return d;
                  };
                  return hr(c(u.targetSnapshot.root)).pipe(Ve(null), _e(1));
                }),
                As(() => this.afterPreactivation()),
                de(() => {
                  let { currentSnapshot: u, targetSnapshot: c } = i,
                    l = this.createViewTransition?.(
                      this.environmentInjector,
                      u.root,
                      c.root,
                    );
                  return l ? B(l).pipe(S(() => i)) : w(i);
                }),
                S((u) => {
                  let c = vv(
                    n.routeReuseStrategy,
                    u.targetSnapshot,
                    u.currentRouterState,
                  );
                  return (
                    (this.currentTransition = i =
                      k(g({}, u), { targetRouterState: c })),
                    (this.currentNavigation.targetRouterState = c),
                    i
                  );
                }),
                G(() => {
                  this.events.next(new $n());
                }),
                Cv(
                  this.rootContexts,
                  n.routeReuseStrategy,
                  (u) => this.events.next(u),
                  this.inputBindingEnabled,
                ),
                _e(1),
                G({
                  next: (u) => {
                    (s = !0),
                      (this.lastSuccessfulNavigation = this.currentNavigation),
                      this.events.next(
                        new dt(
                          u.id,
                          this.urlSerializer.serialize(u.extractedUrl),
                          this.urlSerializer.serialize(u.urlAfterRedirects),
                        ),
                      ),
                      this.titleStrategy?.updateTitle(
                        u.targetRouterState.snapshot,
                      ),
                      u.resolve(!0);
                  },
                  complete: () => {
                    s = !0;
                  },
                }),
                Ko(
                  this.transitionAbortSubject.pipe(
                    G((u) => {
                      throw u;
                    }),
                  ),
                ),
                Xt(() => {
                  !s &&
                    !a &&
                    this.cancelNavigationTransition(
                      i,
                      "",
                      te.SupersededByNewNavigation,
                    ),
                    this.currentTransition?.id === i.id &&
                      ((this.currentNavigation = null),
                      (this.currentTransition = null));
                }),
                je((u) => {
                  if (((a = !0), Ed(u)))
                    this.events.next(
                      new Fe(
                        i.id,
                        this.urlSerializer.serialize(i.extractedUrl),
                        u.message,
                        u.cancellationCode,
                      ),
                    ),
                      wv(u)
                        ? this.events.next(
                            new Wt(u.url, u.navigationBehaviorOptions),
                          )
                        : i.resolve(!1);
                  else {
                    let c = new Vn(
                      i.id,
                      this.urlSerializer.serialize(i.extractedUrl),
                      u,
                      i.targetSnapshot ?? void 0,
                    );
                    try {
                      let l = Ne(this.environmentInjector, () =>
                        this.navigationErrorHandler?.(c),
                      );
                      if (l instanceof Un) {
                        let { message: d, cancellationCode: p } = wo(
                          this.urlSerializer,
                          l,
                        );
                        this.events.next(
                          new Fe(
                            i.id,
                            this.urlSerializer.serialize(i.extractedUrl),
                            d,
                            p,
                          ),
                        ),
                          this.events.next(
                            new Wt(l.redirectTo, l.navigationBehaviorOptions),
                          );
                      } else {
                        this.events.next(c);
                        let d = n.errorHandler(u);
                        i.resolve(!!d);
                      }
                    } catch (l) {
                      this.options.resolveNavigationPromiseOnError
                        ? i.resolve(!1)
                        : i.reject(l);
                    }
                  }
                  return J;
                }),
              );
            }),
          )
        );
      }
      cancelNavigationTransition(n, r, o) {
        let i = new Fe(
          n.id,
          this.urlSerializer.serialize(n.extractedUrl),
          r,
          o,
        );
        this.events.next(i), n.resolve(!1);
      }
      isUpdatingInternalState() {
        return (
          this.currentTransition?.extractedUrl.toString() !==
          this.currentTransition?.currentUrlTree.toString()
        );
      }
      isUpdatedBrowserUrl() {
        let n = this.urlHandlingStrategy.extract(
            this.urlSerializer.parse(this.location.path(!0)),
          ),
          r =
            this.currentNavigation?.targetBrowserUrl ??
            this.currentNavigation?.extractedUrl;
        return (
          n.toString() !== r?.toString() &&
          !this.currentNavigation?.extras.skipLocationChange
        );
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })();
function my(e) {
  return e !== On;
}
var vy = (() => {
    class e {
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: () => h(yy), providedIn: "root" });
      }
    }
    return e;
  })(),
  oa = class {
    shouldDetach(t) {
      return !1;
    }
    store(t, n) {}
    shouldAttach(t) {
      return !1;
    }
    retrieve(t) {
      return null;
    }
    shouldReuseRoute(t, n) {
      return t.routeConfig === n.routeConfig;
    }
  },
  yy = (() => {
    class e extends oa {
      static {
        this.ɵfac = (() => {
          let n;
          return function (o) {
            return (n || (n = Ji(e)))(o || e);
          };
        })();
      }
      static {
        this.ɵprov = D({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  Ad = (() => {
    class e {
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: () => h(Dy), providedIn: "root" });
      }
    }
    return e;
  })(),
  Dy = (() => {
    class e extends Ad {
      constructor() {
        super(...arguments),
          (this.location = h(Sn)),
          (this.urlSerializer = h(ia)),
          (this.options = h(ua, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || "replace"),
          (this.urlHandlingStrategy = h(da)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.currentUrlTree = new ke()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = yd(null)),
          (this.stateMemento = this.createStateMemento());
      }
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== "computed"
          ? this.currentPageId
          : (this.restoredState()?.ɵrouterPageId ?? this.currentPageId);
      }
      getRouterState() {
        return this.routerState;
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      registerNonRouterCurrentEntryChangeListener(n) {
        return this.location.subscribe((r) => {
          r.type === "popstate" && n(r.url, r.state);
        });
      }
      handleRouterEvent(n, r) {
        if (n instanceof jn) this.stateMemento = this.createStateMemento();
        else if (n instanceof ft) this.rawUrlTree = r.initialUrl;
        else if (n instanceof go) {
          if (
            this.urlUpdateStrategy === "eager" &&
            !r.extras.skipLocationChange
          ) {
            let o = this.urlHandlingStrategy.merge(r.finalUrl, r.initialUrl);
            this.setBrowserUrl(r.targetBrowserUrl ?? o, r);
          }
        } else
          n instanceof $n
            ? ((this.currentUrlTree = r.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                r.finalUrl,
                r.initialUrl,
              )),
              (this.routerState = r.targetRouterState),
              this.urlUpdateStrategy === "deferred" &&
                !r.extras.skipLocationChange &&
                this.setBrowserUrl(r.targetBrowserUrl ?? this.rawUrlTree, r))
            : n instanceof Fe &&
                (n.code === te.GuardRejected ||
                  n.code === te.NoDataFromResolver)
              ? this.restoreHistory(r)
              : n instanceof Vn
                ? this.restoreHistory(r, !0)
                : n instanceof dt &&
                  ((this.lastSuccessfulId = n.id),
                  (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(n, r) {
        let o = n instanceof ke ? this.urlSerializer.serialize(n) : n;
        if (this.location.isCurrentPathEqualTo(o) || r.extras.replaceUrl) {
          let i = this.browserPageId,
            s = g(g({}, r.extras.state), this.generateNgRouterState(r.id, i));
          this.location.replaceState(o, "", s);
        } else {
          let i = g(
            g({}, r.extras.state),
            this.generateNgRouterState(r.id, this.browserPageId + 1),
          );
          this.location.go(o, "", i);
        }
      }
      restoreHistory(n, r = !1) {
        if (this.canceledNavigationResolution === "computed") {
          let o = this.browserPageId,
            i = this.currentPageId - o;
          i !== 0
            ? this.location.historyGo(i)
            : this.currentUrlTree === n.finalUrl &&
              i === 0 &&
              (this.resetState(n), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === "replace" &&
            (r && this.resetState(n), this.resetUrlToCurrentUrlTree());
      }
      resetState(n) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            n.finalUrl ?? this.rawUrlTree,
          ));
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          "",
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId),
        );
      }
      generateNgRouterState(n, r) {
        return this.canceledNavigationResolution === "computed"
          ? { navigationId: n, ɵrouterPageId: r }
          : { navigationId: n };
      }
      static {
        this.ɵfac = (() => {
          let n;
          return function (o) {
            return (n || (n = Ji(e)))(o || e);
          };
        })();
      }
      static {
        this.ɵprov = D({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  An = (function (e) {
    return (
      (e[(e.COMPLETE = 0)] = "COMPLETE"),
      (e[(e.FAILED = 1)] = "FAILED"),
      (e[(e.REDIRECTING = 2)] = "REDIRECTING"),
      e
    );
  })(An || {});
function wy(e, t) {
  e.events
    .pipe(
      le(
        (n) =>
          n instanceof dt ||
          n instanceof Fe ||
          n instanceof Vn ||
          n instanceof ft,
      ),
      S((n) =>
        n instanceof dt || n instanceof ft
          ? An.COMPLETE
          : (
                n instanceof Fe
                  ? n.code === te.Redirect ||
                    n.code === te.SupersededByNewNavigation
                  : !1
              )
            ? An.REDIRECTING
            : An.FAILED,
      ),
      le((n) => n !== An.REDIRECTING),
      _e(1),
    )
    .subscribe(() => {
      t();
    });
}
function Cy(e) {
  throw e;
}
var Iy = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  Ey = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  Rd = (() => {
    class e {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      constructor() {
        (this.disposed = !1),
          (this.console = h(to)),
          (this.stateManager = h(Ad)),
          (this.options = h(ua, { optional: !0 }) || {}),
          (this.pendingTasks = h(jt)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.navigationTransitions = h(gy)),
          (this.urlSerializer = h(ia)),
          (this.location = h(Sn)),
          (this.urlHandlingStrategy = h(da)),
          (this._events = new W()),
          (this.errorHandler = this.options.errorHandler || Cy),
          (this.navigated = !1),
          (this.routeReuseStrategy = h(vy)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || "ignore"),
          (this.config = h(la, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!h(aa, { optional: !0 })),
          (this.eventsSubscription = new j()),
          this.resetConfig(this.config),
          this.navigationTransitions
            .setupNavigations(this, this.currentUrlTree, this.routerState)
            .subscribe({
              error: (n) => {
                this.console.warn(n);
              },
            }),
          this.subscribeToNavigationEvents();
      }
      subscribeToNavigationEvents() {
        let n = this.navigationTransitions.events.subscribe((r) => {
          try {
            let o = this.navigationTransitions.currentTransition,
              i = this.navigationTransitions.currentNavigation;
            if (o !== null && i !== null) {
              if (
                (this.stateManager.handleRouterEvent(r, i),
                r instanceof Fe &&
                  r.code !== te.Redirect &&
                  r.code !== te.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (r instanceof dt) this.navigated = !0;
              else if (r instanceof Wt) {
                let s = r.navigationBehaviorOptions,
                  a = this.urlHandlingStrategy.merge(r.url, o.currentRawUrl),
                  u = g(
                    {
                      browserUrl: o.extras.browserUrl,
                      info: o.extras.info,
                      skipLocationChange: o.extras.skipLocationChange,
                      replaceUrl:
                        o.extras.replaceUrl ||
                        this.urlUpdateStrategy === "eager" ||
                        my(o.source),
                    },
                    s,
                  );
                this.scheduleNavigation(a, On, null, u, {
                  resolve: o.resolve,
                  reject: o.reject,
                  promise: o.promise,
                });
              }
            }
            Sy(r) && this._events.next(r);
          } catch (o) {
            this.navigationTransitions.transitionAbortSubject.next(o);
          }
        });
        this.eventsSubscription.add(n);
      }
      resetRootComponentType(n) {
        (this.routerState.root.component = n),
          (this.navigationTransitions.rootComponentType = n);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              On,
              this.stateManager.restoredState(),
            );
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener(
            (n, r) => {
              setTimeout(() => {
                this.navigateToSyncWithBrowser(n, "popstate", r);
              }, 0);
            },
          );
      }
      navigateToSyncWithBrowser(n, r, o) {
        let i = { replaceUrl: !0 },
          s = o?.navigationId ? o : null;
        if (o) {
          let u = g({}, o);
          delete u.navigationId,
            delete u.ɵrouterPageId,
            Object.keys(u).length !== 0 && (i.state = u);
        }
        let a = this.parseUrl(n);
        this.scheduleNavigation(a, r, s, i);
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation;
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(n) {
        (this.config = n.map(ca)), (this.navigated = !1);
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe();
      }
      createUrlTree(n, r = {}) {
        let {
            relativeTo: o,
            queryParams: i,
            fragment: s,
            queryParamsHandling: a,
            preserveFragment: u,
          } = r,
          c = u ? this.currentUrlTree.fragment : s,
          l = null;
        switch (a ?? this.options.defaultQueryParamsHandling) {
          case "merge":
            l = g(g({}, this.currentUrlTree.queryParams), i);
            break;
          case "preserve":
            l = this.currentUrlTree.queryParams;
            break;
          default:
            l = i || null;
        }
        l !== null && (l = this.removeEmptyProps(l));
        let d;
        try {
          let p = o ? o.snapshot : this.routerState.snapshot.root;
          d = pd(p);
        } catch {
          (typeof n[0] != "string" || n[0][0] !== "/") && (n = []),
            (d = this.currentUrlTree.root);
        }
        return gd(d, n, l, c ?? null);
      }
      navigateByUrl(n, r = { skipLocationChange: !1 }) {
        let o = kn(n) ? n : this.parseUrl(n),
          i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
        return this.scheduleNavigation(i, On, null, r);
      }
      navigate(n, r = { skipLocationChange: !1 }) {
        return by(n), this.navigateByUrl(this.createUrlTree(n, r), r);
      }
      serializeUrl(n) {
        return this.urlSerializer.serialize(n);
      }
      parseUrl(n) {
        try {
          return this.urlSerializer.parse(n);
        } catch {
          return this.urlSerializer.parse("/");
        }
      }
      isActive(n, r) {
        let o;
        if (
          (r === !0 ? (o = g({}, Iy)) : r === !1 ? (o = g({}, Ey)) : (o = r),
          kn(n))
        )
          return Kl(this.currentUrlTree, n, o);
        let i = this.parseUrl(n);
        return Kl(this.currentUrlTree, i, o);
      }
      removeEmptyProps(n) {
        return Object.entries(n).reduce(
          (r, [o, i]) => (i != null && (r[o] = i), r),
          {},
        );
      }
      scheduleNavigation(n, r, o, i, s) {
        if (this.disposed) return Promise.resolve(!1);
        let a, u, c;
        s
          ? ((a = s.resolve), (u = s.reject), (c = s.promise))
          : (c = new Promise((d, p) => {
              (a = d), (u = p);
            }));
        let l = this.pendingTasks.add();
        return (
          wy(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(l));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: r,
            restoredState: o,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: n,
            extras: i,
            resolve: a,
            reject: u,
            promise: c,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          c.catch((d) => Promise.reject(d))
        );
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })();
function by(e) {
  for (let t = 0; t < e.length; t++) if (e[t] == null) throw new v(4008, !1);
}
function Sy(e) {
  return !(e instanceof $n) && !(e instanceof Wt);
}
var My = new E("");
function Od(e, ...t) {
  return Hr([
    { provide: la, multi: !0, useValue: e },
    [],
    { provide: Zt, useFactory: _y, deps: [Rd] },
    { provide: vs, multi: !0, useFactory: Ty },
    t.map((n) => n.ɵproviders),
  ]);
}
function _y(e) {
  return e.routerState.root;
}
function Ty() {
  let e = h(it);
  return (t) => {
    let n = e.get(at);
    if (t !== n.components[0]) return;
    let r = e.get(Rd),
      o = e.get(xy);
    e.get(Ny) === 1 && r.initialNavigation(),
      e.get(Ay, null, b.Optional)?.setUpPreloading(),
      e.get(My, null, b.Optional)?.init(),
      r.resetRootComponentType(n.componentTypes[0]),
      o.closed || (o.next(), o.complete(), o.unsubscribe());
  };
}
var xy = new E("", { factory: () => new W() }),
  Ny = new E("", { providedIn: "root", factory: () => 1 });
var Ay = new E("");
var Pd = [];
var Fd = { providers: [_l({ eventCoalescing: !0 }), Od(Pd)] };
var bo = class e {
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵmod = gn({ type: e });
  static ɵinj = hn({});
};
var So = class e {
  title = "new";
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = pn({
    type: e,
    selectors: [["app-root"]],
    standalone: !0,
    features: [Cn],
    decls: 2,
    vars: 0,
    template: function (n, r) {
      n & 1 && (Dn(0, "h1"), ms(1, "app.component"), wn());
    },
    dependencies: [bo],
    encapsulation: 2,
  });
};
Ql(So, Fd).catch((e) => console.error(e));
