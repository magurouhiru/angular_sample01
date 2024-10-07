var Af = Object.defineProperty,
  Rf = Object.defineProperties;
var Of = Object.getOwnPropertyDescriptors;
var Ga = Object.getOwnPropertySymbols;
var Pf = Object.prototype.hasOwnProperty,
  Ff = Object.prototype.propertyIsEnumerable;
var qa = (e, t, n) =>
    t in e
      ? Af(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  m = (e, t) => {
    for (var n in (t ||= {})) Pf.call(t, n) && qa(e, n, t[n]);
    if (Ga) for (var n of Ga(t)) Ff.call(t, n) && qa(e, n, t[n]);
    return e;
  },
  j = (e, t) => Rf(e, Of(t));
var Wo = null;
var qo = 1,
  Wa = Symbol("SIGNAL");
function R(e) {
  let t = Wo;
  return (Wo = e), t;
}
function Za() {
  return Wo;
}
var Zo = {
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
function kf(e) {
  if (!(Xo(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === qo)) {
    if (!e.producerMustRecompute(e) && !Qo(e)) {
      (e.dirty = !1), (e.lastCleanEpoch = qo);
      return;
    }
    e.producerRecomputeValue(e), (e.dirty = !1), (e.lastCleanEpoch = qo);
  }
}
function Yo(e) {
  return e && (e.nextProducerIndex = 0), R(e);
}
function Ya(e, t) {
  if (
    (R(t),
    !(
      !e ||
      e.producerNode === void 0 ||
      e.producerIndexOfThis === void 0 ||
      e.producerLastReadVersion === void 0
    ))
  ) {
    if (Xo(e))
      for (let n = e.nextProducerIndex; n < e.producerNode.length; n++)
        Jo(e.producerNode[n], e.producerIndexOfThis[n]);
    for (; e.producerNode.length > e.nextProducerIndex; )
      e.producerNode.pop(),
        e.producerLastReadVersion.pop(),
        e.producerIndexOfThis.pop();
  }
}
function Qo(e) {
  ei(e);
  for (let t = 0; t < e.producerNode.length; t++) {
    let n = e.producerNode[t],
      r = e.producerLastReadVersion[t];
    if (r !== n.version || (kf(n), r !== n.version)) return !0;
  }
  return !1;
}
function Ko(e) {
  if ((ei(e), Xo(e)))
    for (let t = 0; t < e.producerNode.length; t++)
      Jo(e.producerNode[t], e.producerIndexOfThis[t]);
  (e.producerNode.length =
    e.producerLastReadVersion.length =
    e.producerIndexOfThis.length =
      0),
    e.liveConsumerNode &&
      (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
}
function Jo(e, t) {
  if ((Lf(e), e.liveConsumerNode.length === 1 && jf(e)))
    for (let r = 0; r < e.producerNode.length; r++)
      Jo(e.producerNode[r], e.producerIndexOfThis[r]);
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
    ei(o), (o.producerIndexOfThis[r] = t);
  }
}
function Xo(e) {
  return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
}
function ei(e) {
  (e.producerNode ??= []),
    (e.producerIndexOfThis ??= []),
    (e.producerLastReadVersion ??= []);
}
function Lf(e) {
  (e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
}
function jf(e) {
  return e.producerNode !== void 0;
}
function Vf() {
  throw new Error();
}
var $f = Vf;
function Qa(e) {
  $f = e;
}
function D(e) {
  return typeof e == "function";
}
function vt(e) {
  let n = e((r) => {
    Error.call(r), (r.stack = new Error().stack);
  });
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  );
}
var rr = vt(
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
function cn(e, t) {
  if (e) {
    let n = e.indexOf(t);
    0 <= n && e.splice(n, 1);
  }
}
var V = class e {
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
      if (D(r))
        try {
          r();
        } catch (i) {
          t = i instanceof rr ? i.errors : [i];
        }
      let { _finalizers: o } = this;
      if (o) {
        this._finalizers = null;
        for (let i of o)
          try {
            Ka(i);
          } catch (s) {
            (t = t ?? []),
              s instanceof rr ? (t = [...t, ...s.errors]) : t.push(s);
          }
      }
      if (t) throw new rr(t);
    }
  }
  add(t) {
    var n;
    if (t && t !== this)
      if (this.closed) Ka(t);
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
    n === t ? (this._parentage = null) : Array.isArray(n) && cn(n, t);
  }
  remove(t) {
    let { _finalizers: n } = this;
    n && cn(n, t), t instanceof e && t._removeParent(this);
  }
};
V.EMPTY = (() => {
  let e = new V();
  return (e.closed = !0), e;
})();
var ti = V.EMPTY;
function or(e) {
  return (
    e instanceof V ||
    (e && "closed" in e && D(e.remove) && D(e.add) && D(e.unsubscribe))
  );
}
function Ka(e) {
  D(e) ? e() : e.unsubscribe();
}
var me = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var yt = {
  setTimeout(e, t, ...n) {
    let { delegate: r } = yt;
    return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
  },
  clearTimeout(e) {
    let { delegate: t } = yt;
    return (t?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function ir(e) {
  yt.setTimeout(() => {
    let { onUnhandledError: t } = me;
    if (t) t(e);
    else throw e;
  });
}
function un() {}
var Ja = ni("C", void 0, void 0);
function Xa(e) {
  return ni("E", void 0, e);
}
function ec(e) {
  return ni("N", e, void 0);
}
function ni(e, t, n) {
  return { kind: e, value: t, error: n };
}
var Je = null;
function Dt(e) {
  if (me.useDeprecatedSynchronousErrorHandling) {
    let t = !Je;
    if ((t && (Je = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: n, error: r } = Je;
      if (((Je = null), n)) throw r;
    }
  } else e();
}
function tc(e) {
  me.useDeprecatedSynchronousErrorHandling &&
    Je &&
    ((Je.errorThrown = !0), (Je.error = e));
}
var Xe = class extends V {
    constructor(t) {
      super(),
        (this.isStopped = !1),
        t
          ? ((this.destination = t), or(t) && t.add(this))
          : (this.destination = Hf);
    }
    static create(t, n, r) {
      return new wt(t, n, r);
    }
    next(t) {
      this.isStopped ? oi(ec(t), this) : this._next(t);
    }
    error(t) {
      this.isStopped
        ? oi(Xa(t), this)
        : ((this.isStopped = !0), this._error(t));
    }
    complete() {
      this.isStopped ? oi(Ja, this) : ((this.isStopped = !0), this._complete());
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
  Bf = Function.prototype.bind;
function ri(e, t) {
  return Bf.call(e, t);
}
var ii = class {
    constructor(t) {
      this.partialObserver = t;
    }
    next(t) {
      let { partialObserver: n } = this;
      if (n.next)
        try {
          n.next(t);
        } catch (r) {
          sr(r);
        }
    }
    error(t) {
      let { partialObserver: n } = this;
      if (n.error)
        try {
          n.error(t);
        } catch (r) {
          sr(r);
        }
      else sr(t);
    }
    complete() {
      let { partialObserver: t } = this;
      if (t.complete)
        try {
          t.complete();
        } catch (n) {
          sr(n);
        }
    }
  },
  wt = class extends Xe {
    constructor(t, n, r) {
      super();
      let o;
      if (D(t) || !t)
        o = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
      else {
        let i;
        this && me.useDeprecatedNextContext
          ? ((i = Object.create(t)),
            (i.unsubscribe = () => this.unsubscribe()),
            (o = {
              next: t.next && ri(t.next, i),
              error: t.error && ri(t.error, i),
              complete: t.complete && ri(t.complete, i),
            }))
          : (o = t);
      }
      this.destination = new ii(o);
    }
  };
function sr(e) {
  me.useDeprecatedSynchronousErrorHandling ? tc(e) : ir(e);
}
function Uf(e) {
  throw e;
}
function oi(e, t) {
  let { onStoppedNotification: n } = me;
  n && yt.setTimeout(() => n(e, t));
}
var Hf = { closed: !0, next: un, error: Uf, complete: un };
var Ct = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function re(e) {
  return e;
}
function si(...e) {
  return ai(e);
}
function ai(e) {
  return e.length === 0
    ? re
    : e.length === 1
      ? e[0]
      : function (n) {
          return e.reduce((r, o) => o(r), n);
        };
}
var P = (() => {
  class e {
    constructor(n) {
      n && (this._subscribe = n);
    }
    lift(n) {
      let r = new e();
      return (r.source = this), (r.operator = n), r;
    }
    subscribe(n, r, o) {
      let i = Gf(n) ? n : new wt(n, r, o);
      return (
        Dt(() => {
          let { operator: s, source: c } = this;
          i.add(
            s ? s.call(i, c) : c ? this._subscribe(i) : this._trySubscribe(i),
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
        (r = nc(r)),
        new r((o, i) => {
          let s = new wt({
            next: (c) => {
              try {
                n(c);
              } catch (a) {
                i(a), s.unsubscribe();
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
    [Ct]() {
      return this;
    }
    pipe(...n) {
      return ai(n)(this);
    }
    toPromise(n) {
      return (
        (n = nc(n)),
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
function nc(e) {
  var t;
  return (t = e ?? me.Promise) !== null && t !== void 0 ? t : Promise;
}
function zf(e) {
  return e && D(e.next) && D(e.error) && D(e.complete);
}
function Gf(e) {
  return (e && e instanceof Xe) || (zf(e) && or(e));
}
function ci(e) {
  return D(e?.lift);
}
function x(e) {
  return (t) => {
    if (ci(t))
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
function N(e, t, n, r, o) {
  return new ui(e, t, n, r, o);
}
var ui = class extends Xe {
  constructor(t, n, r, o, i, s) {
    super(t),
      (this.onFinalize = i),
      (this.shouldUnsubscribe = s),
      (this._next = n
        ? function (c) {
            try {
              n(c);
            } catch (a) {
              t.error(a);
            }
          }
        : super._next),
      (this._error = o
        ? function (c) {
            try {
              o(c);
            } catch (a) {
              t.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (c) {
              t.error(c);
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
function It() {
  return x((e, t) => {
    let n = null;
    e._refCount++;
    let r = N(t, void 0, void 0, void 0, () => {
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
var Et = class extends P {
  constructor(t, n) {
    super(),
      (this.source = t),
      (this.subjectFactory = n),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      ci(t) && (this.lift = t.lift);
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
      t = this._connection = new V();
      let n = this.getSubject();
      t.add(
        this.source.subscribe(
          N(
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
        t.closed && ((this._connection = null), (t = V.EMPTY));
    }
    return t;
  }
  refCount() {
    return It()(this);
  }
};
var rc = vt(
  (e) =>
    function () {
      e(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    },
);
var Q = (() => {
    class e extends P {
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
        let r = new ar(this, this);
        return (r.operator = n), r;
      }
      _throwIfClosed() {
        if (this.closed) throw new rc();
      }
      next(n) {
        Dt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        Dt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = n);
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        Dt(() => {
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
          ? ti
          : ((this.currentObservers = null),
            i.push(n),
            new V(() => {
              (this.currentObservers = null), cn(i, n);
            }));
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: o, isStopped: i } = this;
        r ? n.error(o) : i && n.complete();
      }
      asObservable() {
        let n = new P();
        return (n.source = this), n;
      }
    }
    return (e.create = (t, n) => new ar(t, n)), e;
  })(),
  ar = class extends Q {
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
        : ti;
    }
  };
var q = class extends Q {
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
var oe = new P((e) => e.complete());
function oc(e) {
  return e && D(e.schedule);
}
function ic(e) {
  return e[e.length - 1];
}
function sc(e) {
  return D(ic(e)) ? e.pop() : void 0;
}
function Ue(e) {
  return oc(ic(e)) ? e.pop() : void 0;
}
function cc(e, t, n, r) {
  function o(i) {
    return i instanceof n
      ? i
      : new n(function (s) {
          s(i);
        });
  }
  return new (n || (n = Promise))(function (i, s) {
    function c(l) {
      try {
        u(r.next(l));
      } catch (d) {
        s(d);
      }
    }
    function a(l) {
      try {
        u(r.throw(l));
      } catch (d) {
        s(d);
      }
    }
    function u(l) {
      l.done ? i(l.value) : o(l.value).then(c, a);
    }
    u((r = r.apply(e, t || [])).next());
  });
}
function ac(e) {
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
function et(e) {
  return this instanceof et ? ((this.v = e), this) : new et(e);
}
function uc(e, t, n) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = n.apply(e, t || []),
    o,
    i = [];
  return (
    (o = Object.create(
      (typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype,
    )),
    c("next"),
    c("throw"),
    c("return", s),
    (o[Symbol.asyncIterator] = function () {
      return this;
    }),
    o
  );
  function s(f) {
    return function (g) {
      return Promise.resolve(g).then(f, d);
    };
  }
  function c(f, g) {
    r[f] &&
      ((o[f] = function (M) {
        return new Promise(function (L, k) {
          i.push([f, M, L, k]) > 1 || a(f, M);
        });
      }),
      g && (o[f] = g(o[f])));
  }
  function a(f, g) {
    try {
      u(r[f](g));
    } catch (M) {
      h(i[0][3], M);
    }
  }
  function u(f) {
    f.value instanceof et
      ? Promise.resolve(f.value.v).then(l, d)
      : h(i[0][2], f);
  }
  function l(f) {
    a("next", f);
  }
  function d(f) {
    a("throw", f);
  }
  function h(f, g) {
    f(g), i.shift(), i.length && a(i[0][0], i[0][1]);
  }
}
function lc(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var t = e[Symbol.asyncIterator],
    n;
  return t
    ? t.call(e)
    : ((e = typeof ac == "function" ? ac(e) : e[Symbol.iterator]()),
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
        return new Promise(function (c, a) {
          (s = e[i](s)), o(c, a, s.done, s.value);
        });
      };
  }
  function o(i, s, c, a) {
    Promise.resolve(a).then(function (u) {
      i({ value: u, done: c });
    }, s);
  }
}
var cr = (e) => e && typeof e.length == "number" && typeof e != "function";
function ur(e) {
  return D(e?.then);
}
function lr(e) {
  return D(e[Ct]);
}
function dr(e) {
  return Symbol.asyncIterator && D(e?.[Symbol.asyncIterator]);
}
function fr(e) {
  return new TypeError(
    `You provided ${e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
  );
}
function qf() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var hr = qf();
function pr(e) {
  return D(e?.[hr]);
}
function gr(e) {
  return uc(this, arguments, function* () {
    let n = e.getReader();
    try {
      for (;;) {
        let { value: r, done: o } = yield et(n.read());
        if (o) return yield et(void 0);
        yield yield et(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function mr(e) {
  return D(e?.getReader);
}
function G(e) {
  if (e instanceof P) return e;
  if (e != null) {
    if (lr(e)) return Wf(e);
    if (cr(e)) return Zf(e);
    if (ur(e)) return Yf(e);
    if (dr(e)) return dc(e);
    if (pr(e)) return Qf(e);
    if (mr(e)) return Kf(e);
  }
  throw fr(e);
}
function Wf(e) {
  return new P((t) => {
    let n = e[Ct]();
    if (D(n.subscribe)) return n.subscribe(t);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable",
    );
  });
}
function Zf(e) {
  return new P((t) => {
    for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
    t.complete();
  });
}
function Yf(e) {
  return new P((t) => {
    e.then(
      (n) => {
        t.closed || (t.next(n), t.complete());
      },
      (n) => t.error(n),
    ).then(null, ir);
  });
}
function Qf(e) {
  return new P((t) => {
    for (let n of e) if ((t.next(n), t.closed)) return;
    t.complete();
  });
}
function dc(e) {
  return new P((t) => {
    Jf(e, t).catch((n) => t.error(n));
  });
}
function Kf(e) {
  return dc(gr(e));
}
function Jf(e, t) {
  var n, r, o, i;
  return cc(this, void 0, void 0, function* () {
    try {
      for (n = lc(e); (r = yield n.next()), !r.done; ) {
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
function te(e, t, n, r = 0, o = !1) {
  let i = t.schedule(function () {
    n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
  }, r);
  if ((e.add(i), !o)) return i;
}
function vr(e, t = 0) {
  return x((n, r) => {
    n.subscribe(
      N(
        r,
        (o) => te(r, e, () => r.next(o), t),
        () => te(r, e, () => r.complete(), t),
        (o) => te(r, e, () => r.error(o), t),
      ),
    );
  });
}
function yr(e, t = 0) {
  return x((n, r) => {
    r.add(e.schedule(() => n.subscribe(r), t));
  });
}
function fc(e, t) {
  return G(e).pipe(yr(t), vr(t));
}
function hc(e, t) {
  return G(e).pipe(yr(t), vr(t));
}
function pc(e, t) {
  return new P((n) => {
    let r = 0;
    return t.schedule(function () {
      r === e.length
        ? n.complete()
        : (n.next(e[r++]), n.closed || this.schedule());
    });
  });
}
function gc(e, t) {
  return new P((n) => {
    let r;
    return (
      te(n, t, () => {
        (r = e[hr]()),
          te(
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
      () => D(r?.return) && r.return()
    );
  });
}
function Dr(e, t) {
  if (!e) throw new Error("Iterable cannot be null");
  return new P((n) => {
    te(n, t, () => {
      let r = e[Symbol.asyncIterator]();
      te(
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
function mc(e, t) {
  return Dr(gr(e), t);
}
function vc(e, t) {
  if (e != null) {
    if (lr(e)) return fc(e, t);
    if (cr(e)) return pc(e, t);
    if (ur(e)) return hc(e, t);
    if (dr(e)) return Dr(e, t);
    if (pr(e)) return gc(e, t);
    if (mr(e)) return mc(e, t);
  }
  throw fr(e);
}
function U(e, t) {
  return t ? vc(e, t) : G(e);
}
function C(...e) {
  let t = Ue(e);
  return U(e, t);
}
function bt(e, t) {
  let n = D(e) ? e : () => e,
    r = (o) => o.error(n());
  return new P(t ? (o) => t.schedule(r, 0, o) : r);
}
function li(e) {
  return !!e && (e instanceof P || (D(e.lift) && D(e.subscribe)));
}
var Ae = vt(
  (e) =>
    function () {
      e(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    },
);
function _(e, t) {
  return x((n, r) => {
    let o = 0;
    n.subscribe(
      N(r, (i) => {
        r.next(e.call(t, i, o++));
      }),
    );
  });
}
var { isArray: Xf } = Array;
function eh(e, t) {
  return Xf(t) ? e(...t) : e(t);
}
function yc(e) {
  return _((t) => eh(e, t));
}
var { isArray: th } = Array,
  { getPrototypeOf: nh, prototype: rh, keys: oh } = Object;
function Dc(e) {
  if (e.length === 1) {
    let t = e[0];
    if (th(t)) return { args: t, keys: null };
    if (ih(t)) {
      let n = oh(t);
      return { args: n.map((r) => t[r]), keys: n };
    }
  }
  return { args: e, keys: null };
}
function ih(e) {
  return e && typeof e == "object" && nh(e) === rh;
}
function wc(e, t) {
  return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
}
function wr(...e) {
  let t = Ue(e),
    n = sc(e),
    { args: r, keys: o } = Dc(e);
  if (r.length === 0) return U([], t);
  let i = new P(sh(r, t, o ? (s) => wc(o, s) : re));
  return n ? i.pipe(yc(n)) : i;
}
function sh(e, t, n = re) {
  return (r) => {
    Cc(
      t,
      () => {
        let { length: o } = e,
          i = new Array(o),
          s = o,
          c = o;
        for (let a = 0; a < o; a++)
          Cc(
            t,
            () => {
              let u = U(e[a], t),
                l = !1;
              u.subscribe(
                N(
                  r,
                  (d) => {
                    (i[a] = d), l || ((l = !0), c--), c || r.next(n(i.slice()));
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
function Cc(e, t, n) {
  e ? te(n, e, t) : t();
}
function Ic(e, t, n, r, o, i, s, c) {
  let a = [],
    u = 0,
    l = 0,
    d = !1,
    h = () => {
      d && !a.length && !u && t.complete();
    },
    f = (M) => (u < r ? g(M) : a.push(M)),
    g = (M) => {
      i && t.next(M), u++;
      let L = !1;
      G(n(M, l++)).subscribe(
        N(
          t,
          (k) => {
            o?.(k), i ? f(k) : t.next(k);
          },
          () => {
            L = !0;
          },
          void 0,
          () => {
            if (L)
              try {
                for (u--; a.length && u < r; ) {
                  let k = a.shift();
                  s ? te(t, s, () => g(k)) : g(k);
                }
                h();
              } catch (k) {
                t.error(k);
              }
          },
        ),
      );
    };
  return (
    e.subscribe(
      N(t, f, () => {
        (d = !0), h();
      }),
    ),
    () => {
      c?.();
    }
  );
}
function H(e, t, n = 1 / 0) {
  return D(t)
    ? H((r, o) => _((i, s) => t(r, i, o, s))(G(e(r, o))), n)
    : (typeof t == "number" && (n = t), x((r, o) => Ic(r, o, e, n)));
}
function di(e = 1 / 0) {
  return H(re, e);
}
function Ec() {
  return di(1);
}
function St(...e) {
  return Ec()(U(e, Ue(e)));
}
function Cr(e) {
  return new P((t) => {
    G(e()).subscribe(t);
  });
}
function ve(e, t) {
  return x((n, r) => {
    let o = 0;
    n.subscribe(N(r, (i) => e.call(t, i, o++) && r.next(i)));
  });
}
function He(e) {
  return x((t, n) => {
    let r = null,
      o = !1,
      i;
    (r = t.subscribe(
      N(n, void 0, void 0, (s) => {
        (i = G(e(s, He(e)(t)))),
          r ? (r.unsubscribe(), (r = null), i.subscribe(n)) : (o = !0);
      }),
    )),
      o && (r.unsubscribe(), (r = null), i.subscribe(n));
  });
}
function bc(e, t, n, r, o) {
  return (i, s) => {
    let c = n,
      a = t,
      u = 0;
    i.subscribe(
      N(
        s,
        (l) => {
          let d = u++;
          (a = c ? e(a, l, d) : ((c = !0), l)), r && s.next(a);
        },
        o &&
          (() => {
            c && s.next(a), s.complete();
          }),
      ),
    );
  };
}
function Mt(e, t) {
  return D(t) ? H(e, t, 1) : H(e, 1);
}
function ze(e) {
  return x((t, n) => {
    let r = !1;
    t.subscribe(
      N(
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
function Re(e) {
  return e <= 0
    ? () => oe
    : x((t, n) => {
        let r = 0;
        t.subscribe(
          N(n, (o) => {
            ++r <= e && (n.next(o), e <= r && n.complete());
          }),
        );
      });
}
function fi(e) {
  return _(() => e);
}
function Ir(e = ah) {
  return x((t, n) => {
    let r = !1;
    t.subscribe(
      N(
        n,
        (o) => {
          (r = !0), n.next(o);
        },
        () => (r ? n.complete() : n.error(e())),
      ),
    );
  });
}
function ah() {
  return new Ae();
}
function ln(e) {
  return x((t, n) => {
    try {
      t.subscribe(n);
    } finally {
      n.add(e);
    }
  });
}
function Se(e, t) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      e ? ve((o, i) => e(o, i, r)) : re,
      Re(1),
      n ? ze(t) : Ir(() => new Ae()),
    );
}
function _t(e) {
  return e <= 0
    ? () => oe
    : x((t, n) => {
        let r = [];
        t.subscribe(
          N(
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
function hi(e, t) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      e ? ve((o, i) => e(o, i, r)) : re,
      _t(1),
      n ? ze(t) : Ir(() => new Ae()),
    );
}
function pi(e, t) {
  return x(bc(e, t, arguments.length >= 2, !0));
}
function gi(...e) {
  let t = Ue(e);
  return x((n, r) => {
    (t ? St(e, n, t) : St(e, n)).subscribe(r);
  });
}
function ye(e, t) {
  return x((n, r) => {
    let o = null,
      i = 0,
      s = !1,
      c = () => s && !o && r.complete();
    n.subscribe(
      N(
        r,
        (a) => {
          o?.unsubscribe();
          let u = 0,
            l = i++;
          G(e(a, l)).subscribe(
            (o = N(
              r,
              (d) => r.next(t ? t(a, d, l, u++) : d),
              () => {
                (o = null), c();
              },
            )),
          );
        },
        () => {
          (s = !0), c();
        },
      ),
    );
  });
}
function mi(e) {
  return x((t, n) => {
    G(e).subscribe(N(n, () => n.complete(), un)), !n.closed && t.subscribe(n);
  });
}
function W(e, t, n) {
  let r = D(e) || t || n ? { next: e, error: t, complete: n } : e;
  return r
    ? x((o, i) => {
        var s;
        (s = r.subscribe) === null || s === void 0 || s.call(r);
        let c = !0;
        o.subscribe(
          N(
            i,
            (a) => {
              var u;
              (u = r.next) === null || u === void 0 || u.call(r, a), i.next(a);
            },
            () => {
              var a;
              (c = !1),
                (a = r.complete) === null || a === void 0 || a.call(r),
                i.complete();
            },
            (a) => {
              var u;
              (c = !1),
                (u = r.error) === null || u === void 0 || u.call(r, a),
                i.error(a);
            },
            () => {
              var a, u;
              c && ((a = r.unsubscribe) === null || a === void 0 || a.call(r)),
                (u = r.finalize) === null || u === void 0 || u.call(r);
            },
          ),
        );
      })
    : re;
}
var uu = "https://g.co/ng/security#xss",
  v = class extends Error {
    constructor(t, n) {
      super(cs(t, n)), (this.code = t);
    }
  };
function cs(e, t) {
  return `${`NG0${Math.abs(e)}`}${t ? ": " + t : ""}`;
}
function us(e) {
  return { toString: e }.toString();
}
function F(e) {
  for (let t in e) if (e[t] === F) return t;
  throw Error("Could not find renamed property on target object.");
}
function ie(e) {
  if (typeof e == "string") return e;
  if (Array.isArray(e)) return "[" + e.map(ie).join(", ") + "]";
  if (e == null) return "" + e;
  if (e.overriddenName) return `${e.overriddenName}`;
  if (e.name) return `${e.name}`;
  let t = e.toString();
  if (t == null) return "" + t;
  let n = t.indexOf(`
`);
  return n === -1 ? t : t.substring(0, n);
}
function Sc(e, t) {
  return e == null || e === ""
    ? t === null
      ? ""
      : t
    : t == null || t === ""
      ? e
      : e + " " + t;
}
var ch = F({ __forward_ref__: F });
function lu(e) {
  return (
    (e.__forward_ref__ = lu),
    (e.toString = function () {
      return ie(this());
    }),
    e
  );
}
function le(e) {
  return du(e) ? e() : e;
}
function du(e) {
  return (
    typeof e == "function" && e.hasOwnProperty(ch) && e.__forward_ref__ === lu
  );
}
function w(e) {
  return {
    token: e.token,
    providedIn: e.providedIn || null,
    factory: e.factory,
    value: void 0,
  };
}
function Qr(e) {
  return Mc(e, hu) || Mc(e, pu);
}
function fu(e) {
  return Qr(e) !== null;
}
function Mc(e, t) {
  return e.hasOwnProperty(t) ? e[t] : null;
}
function uh(e) {
  let t = e && (e[hu] || e[pu]);
  return t || null;
}
function _c(e) {
  return e && (e.hasOwnProperty(Tc) || e.hasOwnProperty(lh)) ? e[Tc] : null;
}
var hu = F({ ɵprov: F }),
  Tc = F({ ɵinj: F }),
  pu = F({ ngInjectableDef: F }),
  lh = F({ ngInjectorDef: F }),
  E = class {
    constructor(t, n) {
      (this._desc = t),
        (this.ngMetadataName = "InjectionToken"),
        (this.ɵprov = void 0),
        typeof n == "number"
          ? (this.__NG_ELEMENT_ID__ = n)
          : n !== void 0 &&
            (this.ɵprov = w({
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
function gu(e) {
  return e && !!e.ɵproviders;
}
var dh = F({ ɵcmp: F }),
  fh = F({ ɵdir: F }),
  hh = F({ ɵpipe: F }),
  ph = F({ ɵmod: F }),
  xr = F({ ɵfac: F }),
  hn = F({ __NG_ELEMENT_ID__: F }),
  xc = F({ __NG_ENV_ID__: F });
function ls(e) {
  return typeof e == "string" ? e : e == null ? "" : String(e);
}
function gh(e) {
  return typeof e == "function"
    ? e.name || e.toString()
    : typeof e == "object" && e != null && typeof e.type == "function"
      ? e.type.name || e.type.toString()
      : ls(e);
}
function mh(e, t) {
  let n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
  throw new v(-200, e);
}
function ds(e, t) {
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
  Mi;
function mu() {
  return Mi;
}
function ue(e) {
  let t = Mi;
  return (Mi = e), t;
}
function vu(e, t, n) {
  let r = Qr(e);
  if (r && r.providedIn == "root")
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & b.Optional) return null;
  if (t !== void 0) return t;
  ds(e, "Injector");
}
var vh = {},
  pn = vh,
  yh = "__NG_DI_FLAG__",
  Nr = "ngTempTokenPath",
  Dh = "ngTokenPath",
  wh = /\n/gm,
  Ch = "\u0275",
  Nc = "__source",
  At;
function Ih() {
  return At;
}
function Ge(e) {
  let t = At;
  return (At = e), t;
}
function Eh(e, t = b.Default) {
  if (At === void 0) throw new v(-203, !1);
  return At === null
    ? vu(e, void 0, t)
    : At.get(e, t & b.Optional ? null : void 0, t);
}
function T(e, t = b.Default) {
  return (mu() || Eh)(le(e), t);
}
function p(e, t = b.Default) {
  return T(e, Kr(t));
}
function Kr(e) {
  return typeof e > "u" || typeof e == "number"
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function _i(e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let r = le(e[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new v(900, !1);
      let o,
        i = b.Default;
      for (let s = 0; s < r.length; s++) {
        let c = r[s],
          a = bh(c);
        typeof a == "number" ? (a === -1 ? (o = c.token) : (i |= a)) : (o = c);
      }
      t.push(T(o, i));
    } else t.push(T(r));
  }
  return t;
}
function bh(e) {
  return e[yh];
}
function Sh(e, t, n, r) {
  let o = e[Nr];
  throw (
    (t[Nc] && o.unshift(t[Nc]),
    (e.message = Mh(
      `
` + e.message,
      o,
      n,
      r,
    )),
    (e[Dh] = o),
    (e[Nr] = null),
    e)
  );
}
function Mh(e, t, n, r = null) {
  e =
    e &&
    e.charAt(0) ===
      `
` &&
    e.charAt(1) == Ch
      ? e.slice(2)
      : e;
  let o = ie(t);
  if (Array.isArray(t)) o = t.map(ie).join(" -> ");
  else if (typeof t == "object") {
    let i = [];
    for (let s in t)
      if (t.hasOwnProperty(s)) {
        let c = t[s];
        i.push(s + ":" + (typeof c == "string" ? JSON.stringify(c) : ie(c)));
      }
    o = `{${i.join(", ")}}`;
  }
  return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
    wh,
    `
  `,
  )}`;
}
function Ot(e, t) {
  let n = e.hasOwnProperty(xr);
  return n ? e[xr] : null;
}
function fs(e, t) {
  e.forEach((n) => (Array.isArray(n) ? fs(n, t) : t(n)));
}
function yu(e, t, n) {
  t >= e.length ? e.push(n) : e.splice(t, 0, n);
}
function Ar(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
var gn = {},
  Pt = [],
  Ft = new E(""),
  Du = new E("", -1),
  wu = new E(""),
  Rr = class {
    get(t, n = pn) {
      if (n === pn) {
        let r = new Error(`NullInjectorError: No provider for ${ie(t)}!`);
        throw ((r.name = "NullInjectorError"), r);
      }
      return n;
    }
  },
  Cu = (function (e) {
    return (e[(e.OnPush = 0)] = "OnPush"), (e[(e.Default = 1)] = "Default"), e;
  })(Cu || {}),
  _e = (function (e) {
    return (
      (e[(e.Emulated = 0)] = "Emulated"),
      (e[(e.None = 2)] = "None"),
      (e[(e.ShadowDom = 3)] = "ShadowDom"),
      e
    );
  })(_e || {}),
  Ze = (function (e) {
    return (
      (e[(e.None = 0)] = "None"),
      (e[(e.SignalBased = 1)] = "SignalBased"),
      (e[(e.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
      e
    );
  })(Ze || {});
function _h(e, t, n) {
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
function Ti(e, t, n) {
  let r = 0;
  for (; r < n.length; ) {
    let o = n[r];
    if (typeof o == "number") {
      if (o !== 0) break;
      r++;
      let i = n[r++],
        s = n[r++],
        c = n[r++];
      e.setAttribute(t, s, c, i);
    } else {
      let i = o,
        s = n[++r];
      xh(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
    }
  }
  return r;
}
function Th(e) {
  return e === 3 || e === 4 || e === 6;
}
function xh(e) {
  return e.charCodeAt(0) === 64;
}
function hs(e, t) {
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
              ? Ac(e, n, o, null, t[++r])
              : Ac(e, n, o, null, null));
      }
    }
  return e;
}
function Ac(e, t, n, r, o) {
  let i = 0,
    s = e.length;
  if (t === -1) s = -1;
  else
    for (; i < e.length; ) {
      let c = e[i++];
      if (typeof c == "number") {
        if (c === t) {
          s = -1;
          break;
        } else if (c > t) {
          s = i - 1;
          break;
        }
      }
    }
  for (; i < e.length; ) {
    let c = e[i];
    if (typeof c == "number") break;
    if (c === n) {
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
var Iu = "ng-template";
function Nh(e, t, n, r) {
  let o = 0;
  if (r) {
    for (; o < t.length && typeof t[o] == "string"; o += 2)
      if (t[o] === "class" && _h(t[o + 1].toLowerCase(), n, 0) !== -1)
        return !0;
  } else if (ps(e)) return !1;
  if (((o = t.indexOf(1, o)), o > -1)) {
    let i;
    for (; ++o < t.length && typeof (i = t[o]) == "string"; )
      if (i.toLowerCase() === n) return !0;
  }
  return !1;
}
function ps(e) {
  return e.type === 4 && e.value !== Iu;
}
function Ah(e, t, n) {
  let r = e.type === 4 && !n ? Iu : e.value;
  return t === r;
}
function Rh(e, t, n) {
  let r = 4,
    o = e.attrs,
    i = o !== null ? Fh(o) : 0,
    s = !1;
  for (let c = 0; c < t.length; c++) {
    let a = t[c];
    if (typeof a == "number") {
      if (!s && !De(r) && !De(a)) return !1;
      if (s && De(a)) continue;
      (s = !1), (r = a | (r & 1));
      continue;
    }
    if (!s)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (a !== "" && !Ah(e, a, n)) || (a === "" && t.length === 1))
        ) {
          if (De(r)) return !1;
          s = !0;
        }
      } else if (r & 8) {
        if (o === null || !Nh(e, o, a, n)) {
          if (De(r)) return !1;
          s = !0;
        }
      } else {
        let u = t[++c],
          l = Oh(a, o, ps(e), n);
        if (l === -1) {
          if (De(r)) return !1;
          s = !0;
          continue;
        }
        if (u !== "") {
          let d;
          if (
            (l > i ? (d = "") : (d = o[l + 1].toLowerCase()), r & 2 && u !== d)
          ) {
            if (De(r)) return !1;
            s = !0;
          }
        }
      }
  }
  return De(r) || s;
}
function De(e) {
  return (e & 1) === 0;
}
function Oh(e, t, n, r) {
  if (t === null) return -1;
  let o = 0;
  if (r || !n) {
    let i = !1;
    for (; o < t.length; ) {
      let s = t[o];
      if (s === e) return o;
      if (s === 3 || s === 6) i = !0;
      else if (s === 1 || s === 2) {
        let c = t[++o];
        for (; typeof c == "string"; ) c = t[++o];
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
  } else return kh(t, e);
}
function Ph(e, t, n = !1) {
  for (let r = 0; r < t.length; r++) if (Rh(e, t[r], n)) return !0;
  return !1;
}
function Fh(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t];
    if (Th(n)) return t;
  }
  return e.length;
}
function kh(e, t) {
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
function Rc(e, t) {
  return e ? ":not(" + t.trim() + ")" : t;
}
function Lh(e) {
  let t = e[0],
    n = 1,
    r = 2,
    o = "",
    i = !1;
  for (; n < e.length; ) {
    let s = e[n];
    if (typeof s == "string")
      if (r & 2) {
        let c = e[++n];
        o += "[" + s + (c.length > 0 ? '="' + c + '"' : "") + "]";
      } else r & 8 ? (o += "." + s) : r & 4 && (o += " " + s);
    else
      o !== "" && !De(s) && ((t += Rc(i, o)), (o = "")),
        (r = s),
        (i = i || !De(r));
    n++;
  }
  return o !== "" && (t += Rc(i, o)), t;
}
function jh(e) {
  return e.map(Lh).join(",");
}
function Vh(e) {
  let t = [],
    n = [],
    r = 1,
    o = 2;
  for (; r < e.length; ) {
    let i = e[r];
    if (typeof i == "string")
      o === 2 ? i !== "" && t.push(i, e[++r]) : o === 8 && n.push(i);
    else {
      if (!De(o)) break;
      o = i;
    }
    r++;
  }
  return { attrs: t, classes: n };
}
function Jr(e) {
  return us(() => {
    let t = _u(e),
      n = j(m({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === Cu.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || _e.Emulated,
        styles: e.styles || Pt,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: "",
      });
    Tu(n);
    let r = e.dependencies;
    return (
      (n.directiveDefs = Pc(r, !1)), (n.pipeDefs = Pc(r, !0)), (n.id = Uh(n)), n
    );
  });
}
function $h(e) {
  return rt(e) || Eu(e);
}
function Bh(e) {
  return e !== null;
}
function Oc(e, t) {
  if (e == null) return gn;
  let n = {};
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let o = e[r],
        i,
        s,
        c = Ze.None;
      Array.isArray(o)
        ? ((c = o[0]), (i = o[1]), (s = o[2] ?? i))
        : ((i = o), (s = o)),
        t ? ((n[i] = c !== Ze.None ? [r, c] : r), (t[i] = s)) : (n[i] = r);
    }
  return n;
}
function gs(e) {
  return us(() => {
    let t = _u(e);
    return Tu(t), t;
  });
}
function rt(e) {
  return e[dh] || null;
}
function Eu(e) {
  return e[fh] || null;
}
function bu(e) {
  return e[hh] || null;
}
function Su(e) {
  let t = rt(e) || Eu(e) || bu(e);
  return t !== null ? t.standalone : !1;
}
function Mu(e, t) {
  let n = e[ph] || null;
  if (!n && t === !0)
    throw new Error(`Type ${ie(e)} does not have '\u0275mod' property.`);
  return n;
}
function _u(e) {
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
    inputConfig: e.inputs || gn,
    exportAs: e.exportAs || null,
    standalone: e.standalone === !0,
    signals: e.signals === !0,
    selectors: e.selectors || Pt,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: Oc(e.inputs, t),
    outputs: Oc(e.outputs),
    debugInfo: null,
  };
}
function Tu(e) {
  e.features?.forEach((t) => t(e));
}
function Pc(e, t) {
  if (!e) return null;
  let n = t ? bu : $h;
  return () => (typeof e == "function" ? e() : e).map((r) => n(r)).filter(Bh);
}
function Uh(e) {
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
function Xr(e) {
  return { ɵproviders: e };
}
function Hh(...e) {
  return { ɵproviders: xu(!0, e), ɵfromNgModule: !0 };
}
function xu(e, ...t) {
  let n = [],
    r = new Set(),
    o,
    i = (s) => {
      n.push(s);
    };
  return (
    fs(t, (s) => {
      let c = s;
      xi(c, i, [], r) && ((o ||= []), o.push(c));
    }),
    o !== void 0 && Nu(o, i),
    n
  );
}
function Nu(e, t) {
  for (let n = 0; n < e.length; n++) {
    let { ngModule: r, providers: o } = e[n];
    ms(o, (i) => {
      t(i, r);
    });
  }
}
function xi(e, t, n, r) {
  if (((e = le(e)), !e)) return !1;
  let o = null,
    i = _c(e),
    s = !i && rt(e);
  if (!i && !s) {
    let a = e.ngModule;
    if (((i = _c(a)), i)) o = a;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    o = e;
  }
  let c = r.has(o);
  if (s) {
    if (c) return !1;
    if ((r.add(o), s.dependencies)) {
      let a =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let u of a) xi(u, t, n, r);
    }
  } else if (i) {
    if (i.imports != null && !c) {
      r.add(o);
      let u;
      try {
        fs(i.imports, (l) => {
          xi(l, t, n, r) && ((u ||= []), u.push(l));
        });
      } finally {
      }
      u !== void 0 && Nu(u, t);
    }
    if (!c) {
      let u = Ot(o) || (() => new o());
      t({ provide: o, useFactory: u, deps: Pt }, o),
        t({ provide: wu, useValue: o, multi: !0 }, o),
        t({ provide: Ft, useValue: () => T(o), multi: !0 }, o);
    }
    let a = i.providers;
    if (a != null && !c) {
      let u = e;
      ms(a, (l) => {
        t(l, u);
      });
    }
  } else return !1;
  return o !== e && e.providers !== void 0;
}
function ms(e, t) {
  for (let n of e)
    gu(n) && (n = n.ɵproviders), Array.isArray(n) ? ms(n, t) : t(n);
}
var zh = F({ provide: String, useValue: F });
function Au(e) {
  return e !== null && typeof e == "object" && zh in e;
}
function Gh(e) {
  return !!(e && e.useExisting);
}
function qh(e) {
  return !!(e && e.useFactory);
}
function Ni(e) {
  return typeof e == "function";
}
var eo = new E(""),
  br = {},
  Wh = {},
  vi;
function vs() {
  return vi === void 0 && (vi = new Rr()), vi;
}
var he = class {},
  mn = class extends he {
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
        Ri(t, (s) => this.processProvider(s)),
        this.records.set(Du, Tt(void 0, this)),
        o.has("environment") && this.records.set(he, Tt(void 0, this));
      let i = this.records.get(eo);
      i != null && typeof i.value == "string" && this.scopes.add(i.value),
        (this.injectorDefTypes = new Set(this.get(wu, Pt, b.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      let t = R(null);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let n = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of n) r();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          R(t);
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
      let n = Ge(this),
        r = ue(void 0),
        o;
      try {
        return t();
      } finally {
        Ge(n), ue(r);
      }
    }
    get(t, n = pn, r = b.Default) {
      if ((this.assertNotDestroyed(), t.hasOwnProperty(xc))) return t[xc](this);
      r = Kr(r);
      let o,
        i = Ge(this),
        s = ue(void 0);
      try {
        if (!(r & b.SkipSelf)) {
          let a = this.records.get(t);
          if (a === void 0) {
            let u = Xh(t) && Qr(t);
            u && this.injectableDefInScope(u)
              ? (a = Tt(Ai(t), br))
              : (a = null),
              this.records.set(t, a);
          }
          if (a != null) return this.hydrate(t, a);
        }
        let c = r & b.Self ? vs() : this.parent;
        return (n = r & b.Optional && n === pn ? null : n), c.get(t, n);
      } catch (c) {
        if (c.name === "NullInjectorError") {
          if (((c[Nr] = c[Nr] || []).unshift(ie(t)), i)) throw c;
          return Sh(c, t, "R3InjectorError", this.source);
        } else throw c;
      } finally {
        ue(s), Ge(i);
      }
    }
    resolveInjectorInitializers() {
      let t = R(null),
        n = Ge(this),
        r = ue(void 0),
        o;
      try {
        let i = this.get(Ft, Pt, b.Self);
        for (let s of i) s();
      } finally {
        Ge(n), ue(r), R(t);
      }
    }
    toString() {
      let t = [],
        n = this.records;
      for (let r of n.keys()) t.push(ie(r));
      return `R3Injector[${t.join(", ")}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new v(205, !1);
    }
    processProvider(t) {
      t = le(t);
      let n = Ni(t) ? t : le(t && t.provide),
        r = Yh(t);
      if (!Ni(t) && t.multi === !0) {
        let o = this.records.get(n);
        o ||
          ((o = Tt(void 0, br, !0)),
          (o.factory = () => _i(o.multi)),
          this.records.set(n, o)),
          (n = t),
          o.multi.push(t);
      }
      this.records.set(n, r);
    }
    hydrate(t, n) {
      let r = R(null);
      try {
        return (
          n.value === br && ((n.value = Wh), (n.value = n.factory())),
          typeof n.value == "object" &&
            n.value &&
            Jh(n.value) &&
            this._ngOnDestroyHooks.add(n.value),
          n.value
        );
      } finally {
        R(r);
      }
    }
    injectableDefInScope(t) {
      if (!t.providedIn) return !1;
      let n = le(t.providedIn);
      return typeof n == "string"
        ? n === "any" || this.scopes.has(n)
        : this.injectorDefTypes.has(n);
    }
    removeOnDestroy(t) {
      let n = this._onDestroyHooks.indexOf(t);
      n !== -1 && this._onDestroyHooks.splice(n, 1);
    }
  };
function Ai(e) {
  let t = Qr(e),
    n = t !== null ? t.factory : Ot(e);
  if (n !== null) return n;
  if (e instanceof E) throw new v(204, !1);
  if (e instanceof Function) return Zh(e);
  throw new v(204, !1);
}
function Zh(e) {
  if (e.length > 0) throw new v(204, !1);
  let n = uh(e);
  return n !== null ? () => n.factory(e) : () => new e();
}
function Yh(e) {
  if (Au(e)) return Tt(void 0, e.useValue);
  {
    let t = Qh(e);
    return Tt(t, br);
  }
}
function Qh(e, t, n) {
  let r;
  if (Ni(e)) {
    let o = le(e);
    return Ot(o) || Ai(o);
  } else if (Au(e)) r = () => le(e.useValue);
  else if (qh(e)) r = () => e.useFactory(..._i(e.deps || []));
  else if (Gh(e)) r = () => T(le(e.useExisting));
  else {
    let o = le(e && (e.useClass || e.provide));
    if (Kh(e)) r = () => new o(..._i(e.deps));
    else return Ot(o) || Ai(o);
  }
  return r;
}
function Tt(e, t, n = !1) {
  return { factory: e, value: t, multi: n ? [] : void 0 };
}
function Kh(e) {
  return !!e.deps;
}
function Jh(e) {
  return (
    e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
  );
}
function Xh(e) {
  return typeof e == "function" || (typeof e == "object" && e instanceof E);
}
function Ri(e, t) {
  for (let n of e)
    Array.isArray(n) ? Ri(n, t) : n && gu(n) ? Ri(n.ɵproviders, t) : t(n);
}
function ke(e, t) {
  e instanceof mn && e.assertNotDestroyed();
  let n,
    r = Ge(e),
    o = ue(void 0);
  try {
    return t();
  } finally {
    Ge(r), ue(o);
  }
}
function ep() {
  return mu() !== void 0 || Ih() != null;
}
function tp(e) {
  return typeof e == "function";
}
var Le = 0,
  S = 1,
  y = 2,
  X = 3,
  we = 4,
  Ie = 5,
  vn = 6,
  Fc = 7,
  de = 8,
  kt = 9,
  Te = 10,
  se = 11,
  yn = 12,
  kc = 13,
  Sn = 14,
  Ce = 15,
  Lt = 16,
  xt = 17,
  jt = 18,
  to = 19,
  Ru = 20,
  We = 21,
  yi = 22,
  fe = 23,
  Oe = 25,
  Ou = 1;
var ot = 7,
  Or = 8,
  Pr = 9,
  J = 10,
  Fr = (function (e) {
    return (
      (e[(e.None = 0)] = "None"),
      (e[(e.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      e
    );
  })(Fr || {});
function tt(e) {
  return Array.isArray(e) && typeof e[Ou] == "object";
}
function je(e) {
  return Array.isArray(e) && e[Ou] === !0;
}
function Pu(e) {
  return (e.flags & 4) !== 0;
}
function no(e) {
  return e.componentOffset > -1;
}
function Fu(e) {
  return (e.flags & 1) === 1;
}
function Mn(e) {
  return !!e.template;
}
function Oi(e) {
  return (e[y] & 512) !== 0;
}
var Pi = class {
  constructor(t, n, r) {
    (this.previousValue = t), (this.currentValue = n), (this.firstChange = r);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function ku(e, t, n, r) {
  t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r);
}
function ro() {
  return Lu;
}
function Lu(e) {
  return e.type.prototype.ngOnChanges && (e.setInput = rp), np;
}
ro.ngInherit = !0;
function np() {
  let e = Vu(this),
    t = e?.current;
  if (t) {
    let n = e.previous;
    if (n === gn) e.previous = t;
    else for (let r in t) n[r] = t[r];
    (e.current = null), this.ngOnChanges(t);
  }
}
function rp(e, t, n, r, o) {
  let i = this.declaredInputs[r],
    s = Vu(e) || op(e, { previous: gn, current: null }),
    c = s.current || (s.current = {}),
    a = s.previous,
    u = a[i];
  (c[i] = new Pi(u && u.currentValue, n, a === gn)), ku(e, t, o, n);
}
var ju = "__ngSimpleChanges__";
function Vu(e) {
  return e[ju] || null;
}
function op(e, t) {
  return (e[ju] = t);
}
var Lc = null;
var qe = function (e, t, n) {
    Lc?.(e, t, n);
  },
  $u = "svg",
  ip = "math";
function Pe(e) {
  for (; Array.isArray(e); ) e = e[Le];
  return e;
}
function sp(e, t) {
  return Pe(t[e]);
}
function xe(e, t) {
  return Pe(t[e.index]);
}
function ys(e, t) {
  return e.data[t];
}
function zt(e, t) {
  let n = t[e];
  return tt(n) ? n : n[Le];
}
function Ds(e) {
  return (e[y] & 128) === 128;
}
function ap(e) {
  return je(e[X]);
}
function Dn(e, t) {
  return t == null ? null : e[t];
}
function Bu(e) {
  e[xt] = 0;
}
function Uu(e) {
  e[y] & 1024 || ((e[y] |= 1024), Ds(e) && io(e));
}
function oo(e) {
  return !!(e[y] & 9216 || e[fe]?.dirty);
}
function Fi(e) {
  e[Te].changeDetectionScheduler?.notify(8),
    e[y] & 64 && (e[y] |= 1024),
    oo(e) && io(e);
}
function io(e) {
  e[Te].changeDetectionScheduler?.notify(0);
  let t = it(e);
  for (; t !== null && !(t[y] & 8192 || ((t[y] |= 8192), !Ds(t))); ) t = it(t);
}
function Hu(e, t) {
  if ((e[y] & 256) === 256) throw new v(911, !1);
  e[We] === null && (e[We] = []), e[We].push(t);
}
function cp(e, t) {
  if (e[We] === null) return;
  let n = e[We].indexOf(t);
  n !== -1 && e[We].splice(n, 1);
}
function it(e) {
  let t = e[X];
  return je(t) ? t[X] : t;
}
var A = { lFrame: Xu(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
var zu = !1;
function up() {
  return A.lFrame.elementDepthCount;
}
function lp() {
  A.lFrame.elementDepthCount++;
}
function dp() {
  A.lFrame.elementDepthCount--;
}
function Gu() {
  return A.bindingsEnabled;
}
function fp() {
  return A.skipHydrationRootTNode !== null;
}
function hp(e) {
  return A.skipHydrationRootTNode === e;
}
function pp() {
  A.skipHydrationRootTNode = null;
}
function B() {
  return A.lFrame.lView;
}
function Gt() {
  return A.lFrame.tView;
}
function Ve() {
  let e = qu();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function qu() {
  return A.lFrame.currentTNode;
}
function gp() {
  let e = A.lFrame,
    t = e.currentTNode;
  return e.isParent ? t : t.parent;
}
function _n(e, t) {
  let n = A.lFrame;
  (n.currentTNode = e), (n.isParent = t);
}
function Wu() {
  return A.lFrame.isParent;
}
function mp() {
  A.lFrame.isParent = !1;
}
function Zu() {
  return zu;
}
function jc(e) {
  zu = e;
}
function Yu() {
  let e = A.lFrame,
    t = e.bindingRootIndex;
  return t === -1 && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t;
}
function vp(e) {
  return (A.lFrame.bindingIndex = e);
}
function ws() {
  return A.lFrame.bindingIndex++;
}
function yp() {
  return A.lFrame.inI18n;
}
function Dp(e, t) {
  let n = A.lFrame;
  (n.bindingIndex = n.bindingRootIndex = e), ki(t);
}
function wp() {
  return A.lFrame.currentDirectiveIndex;
}
function ki(e) {
  A.lFrame.currentDirectiveIndex = e;
}
function Qu(e) {
  A.lFrame.currentQueryIndex = e;
}
function Cp(e) {
  let t = e[S];
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[Ie] : null;
}
function Ku(e, t, n) {
  if (n & b.SkipSelf) {
    let o = t,
      i = e;
    for (; (o = o.parent), o === null && !(n & b.Host); )
      if (((o = Cp(i)), o === null || ((i = i[Sn]), o.type & 10))) break;
    if (o === null) return !1;
    (t = o), (e = i);
  }
  let r = (A.lFrame = Ju());
  return (r.currentTNode = t), (r.lView = e), !0;
}
function Cs(e) {
  let t = Ju(),
    n = e[S];
  (A.lFrame = t),
    (t.currentTNode = n.firstChild),
    (t.lView = e),
    (t.tView = n),
    (t.contextLView = e),
    (t.bindingIndex = n.bindingStartIndex),
    (t.inI18n = !1);
}
function Ju() {
  let e = A.lFrame,
    t = e === null ? null : e.child;
  return t === null ? Xu(e) : t;
}
function Xu(e) {
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
function el() {
  let e = A.lFrame;
  return (A.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
}
var tl = el;
function Is() {
  let e = el();
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
function so() {
  return A.lFrame.selectedIndex;
}
function st(e) {
  A.lFrame.selectedIndex = e;
}
function Ip() {
  let e = A.lFrame;
  return ys(e.tView, e.selectedIndex);
}
function qt() {
  A.lFrame.currentNamespace = $u;
}
function Tn() {
  Ep();
}
function Ep() {
  A.lFrame.currentNamespace = null;
}
function bp() {
  return A.lFrame.currentNamespace;
}
var nl = !0;
function Es() {
  return nl;
}
function bs(e) {
  nl = e;
}
function Sp(e, t, n) {
  let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
  if (r) {
    let s = Lu(t);
    (n.preOrderHooks ??= []).push(e, s),
      (n.preOrderCheckHooks ??= []).push(e, s);
  }
  o && (n.preOrderHooks ??= []).push(0 - e, o),
    i &&
      ((n.preOrderHooks ??= []).push(e, i),
      (n.preOrderCheckHooks ??= []).push(e, i));
}
function Ss(e, t) {
  for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
    let i = e.data[n].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: c,
        ngAfterViewInit: a,
        ngAfterViewChecked: u,
        ngOnDestroy: l,
      } = i;
    s && (e.contentHooks ??= []).push(-n, s),
      c &&
        ((e.contentHooks ??= []).push(n, c),
        (e.contentCheckHooks ??= []).push(n, c)),
      a && (e.viewHooks ??= []).push(-n, a),
      u &&
        ((e.viewHooks ??= []).push(n, u), (e.viewCheckHooks ??= []).push(n, u)),
      l != null && (e.destroyHooks ??= []).push(n, l);
  }
}
function Sr(e, t, n) {
  rl(e, t, 3, n);
}
function Mr(e, t, n, r) {
  (e[y] & 3) === n && rl(e, t, n, r);
}
function Di(e, t) {
  let n = e[y];
  (n & 3) === t && ((n &= 16383), (n += 1), (e[y] = n));
}
function rl(e, t, n, r) {
  let o = r !== void 0 ? e[xt] & 65535 : 0,
    i = r ?? -1,
    s = t.length - 1,
    c = 0;
  for (let a = o; a < s; a++)
    if (typeof t[a + 1] == "number") {
      if (((c = t[a]), r != null && c >= r)) break;
    } else
      t[a] < 0 && (e[xt] += 65536),
        (c < i || i == -1) &&
          (Mp(e, n, t, a), (e[xt] = (e[xt] & 4294901760) + a + 2)),
        a++;
}
function Vc(e, t) {
  qe(4, e, t);
  let n = R(null);
  try {
    t.call(e);
  } finally {
    R(n), qe(5, e, t);
  }
}
function Mp(e, t, n, r) {
  let o = n[r] < 0,
    i = n[r + 1],
    s = o ? -n[r] : n[r],
    c = e[s];
  o
    ? e[y] >> 14 < e[xt] >> 16 &&
      (e[y] & 3) === t &&
      ((e[y] += 16384), Vc(c, i))
    : Vc(c, i);
}
var Rt = -1,
  wn = class {
    constructor(t, n, r) {
      (this.factory = t),
        (this.resolving = !1),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r);
    }
  };
function _p(e) {
  return e instanceof wn;
}
function Tp(e) {
  return (e.flags & 8) !== 0;
}
function xp(e) {
  return (e.flags & 16) !== 0;
}
var wi = {},
  Li = class {
    constructor(t, n) {
      (this.injector = t), (this.parentInjector = n);
    }
    get(t, n, r) {
      r = Kr(r);
      let o = this.injector.get(t, wi, r);
      return o !== wi || n === wi ? o : this.parentInjector.get(t, n, r);
    }
  };
function ol(e) {
  return e !== Rt;
}
function kr(e) {
  return e & 32767;
}
function Np(e) {
  return e >> 16;
}
function Lr(e, t) {
  let n = Np(e),
    r = t;
  for (; n > 0; ) (r = r[Sn]), n--;
  return r;
}
var ji = !0;
function $c(e) {
  let t = ji;
  return (ji = e), t;
}
var Ap = 256,
  il = Ap - 1,
  sl = 5,
  Rp = 0,
  Me = {};
function Op(e, t, n) {
  let r;
  typeof n == "string"
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(hn) && (r = n[hn]),
    r == null && (r = n[hn] = Rp++);
  let o = r & il,
    i = 1 << o;
  t.data[e + (o >> sl)] |= i;
}
function al(e, t) {
  let n = cl(e, t);
  if (n !== -1) return n;
  let r = t[S];
  r.firstCreatePass &&
    ((e.injectorIndex = t.length),
    Ci(r.data, e),
    Ci(t, null),
    Ci(r.blueprint, null));
  let o = Ms(e, t),
    i = e.injectorIndex;
  if (ol(o)) {
    let s = kr(o),
      c = Lr(o, t),
      a = c[S].data;
    for (let u = 0; u < 8; u++) t[i + u] = c[s + u] | a[s + u];
  }
  return (t[i + 8] = o), i;
}
function Ci(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function cl(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function Ms(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let n = 0,
    r = null,
    o = t;
  for (; o !== null; ) {
    if (((r = hl(o)), r === null)) return Rt;
    if ((n++, (o = o[Sn]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16);
  }
  return Rt;
}
function Pp(e, t, n) {
  Op(e, t, n);
}
function ul(e, t, n) {
  if (n & b.Optional || e !== void 0) return e;
  ds(t, "NodeInjector");
}
function ll(e, t, n, r) {
  if (
    (n & b.Optional && r === void 0 && (r = null), !(n & (b.Self | b.Host)))
  ) {
    let o = e[kt],
      i = ue(void 0);
    try {
      return o ? o.get(t, r, n & b.Optional) : vu(t, r, n & b.Optional);
    } finally {
      ue(i);
    }
  }
  return ul(r, t, n);
}
function dl(e, t, n, r = b.Default, o) {
  if (e !== null) {
    if (t[y] & 2048 && !(r & b.Self)) {
      let s = Vp(e, t, n, r, Me);
      if (s !== Me) return s;
    }
    let i = fl(e, t, n, r, Me);
    if (i !== Me) return i;
  }
  return ll(t, n, r, o);
}
function fl(e, t, n, r, o) {
  let i = Lp(n);
  if (typeof i == "function") {
    if (!Ku(t, e, r)) return r & b.Host ? ul(o, n, r) : ll(t, n, r, o);
    try {
      let s;
      if (((s = i(r)), s == null && !(r & b.Optional))) ds(n);
      else return s;
    } finally {
      tl();
    }
  } else if (typeof i == "number") {
    let s = null,
      c = cl(e, t),
      a = Rt,
      u = r & b.Host ? t[Ce][Ie] : null;
    for (
      (c === -1 || r & b.SkipSelf) &&
      ((a = c === -1 ? Ms(e, t) : t[c + 8]),
      a === Rt || !Uc(r, !1)
        ? (c = -1)
        : ((s = t[S]), (c = kr(a)), (t = Lr(a, t))));
      c !== -1;

    ) {
      let l = t[S];
      if (Bc(i, c, l.data)) {
        let d = Fp(c, t, n, s, r, u);
        if (d !== Me) return d;
      }
      (a = t[c + 8]),
        a !== Rt && Uc(r, t[S].data[c + 8] === u) && Bc(i, c, t)
          ? ((s = l), (c = kr(a)), (t = Lr(a, t)))
          : (c = -1);
    }
  }
  return o;
}
function Fp(e, t, n, r, o, i) {
  let s = t[S],
    c = s.data[e + 8],
    a = r == null ? no(c) && ji : r != s && (c.type & 3) !== 0,
    u = o & b.Host && i === c,
    l = kp(c, s, n, a, u);
  return l !== null ? Cn(t, s, l, c) : Me;
}
function kp(e, t, n, r, o) {
  let i = e.providerIndexes,
    s = t.data,
    c = i & 1048575,
    a = e.directiveStart,
    u = e.directiveEnd,
    l = i >> 20,
    d = r ? c : c + l,
    h = o ? c + l : u;
  for (let f = d; f < h; f++) {
    let g = s[f];
    if ((f < a && n === g) || (f >= a && g.type === n)) return f;
  }
  if (o) {
    let f = s[a];
    if (f && Mn(f) && f.type === n) return a;
  }
  return null;
}
function Cn(e, t, n, r) {
  let o = e[n],
    i = t.data;
  if (_p(o)) {
    let s = o;
    s.resolving && mh(gh(i[n]));
    let c = $c(s.canSeeViewProviders);
    s.resolving = !0;
    let a,
      u = s.injectImpl ? ue(s.injectImpl) : null,
      l = Ku(e, r, b.Default);
    try {
      (o = e[n] = s.factory(void 0, i, e, r)),
        t.firstCreatePass && n >= r.directiveStart && Sp(n, i[n], t);
    } finally {
      u !== null && ue(u), $c(c), (s.resolving = !1), tl();
    }
  }
  return o;
}
function Lp(e) {
  if (typeof e == "string") return e.charCodeAt(0) || 0;
  let t = e.hasOwnProperty(hn) ? e[hn] : void 0;
  return typeof t == "number" ? (t >= 0 ? t & il : jp) : t;
}
function Bc(e, t, n) {
  let r = 1 << e;
  return !!(n[t + (e >> sl)] & r);
}
function Uc(e, t) {
  return !(e & b.Self) && !(e & b.Host && t);
}
var nt = class {
  constructor(t, n) {
    (this._tNode = t), (this._lView = n);
  }
  get(t, n, r) {
    return dl(this._tNode, this._lView, t, Kr(r), n);
  }
};
function jp() {
  return new nt(Ve(), B());
}
function _s(e) {
  return us(() => {
    let t = e.prototype.constructor,
      n = t[xr] || Vi(t),
      r = Object.prototype,
      o = Object.getPrototypeOf(e.prototype).constructor;
    for (; o && o !== r; ) {
      let i = o[xr] || Vi(o);
      if (i && i !== n) return i;
      o = Object.getPrototypeOf(o);
    }
    return (i) => new i();
  });
}
function Vi(e) {
  return du(e)
    ? () => {
        let t = Vi(le(e));
        return t && t();
      }
    : Ot(e);
}
function Vp(e, t, n, r, o) {
  let i = e,
    s = t;
  for (; i !== null && s !== null && s[y] & 2048 && !(s[y] & 512); ) {
    let c = fl(i, s, n, r | b.Self, Me);
    if (c !== Me) return c;
    let a = i.parent;
    if (!a) {
      let u = s[Ru];
      if (u) {
        let l = u.get(n, Me, r);
        if (l !== Me) return l;
      }
      (a = hl(s)), (s = s[Sn]);
    }
    i = a;
  }
  return o;
}
function hl(e) {
  let t = e[S],
    n = t.type;
  return n === 2 ? t.declTNode : n === 1 ? e[Ie] : null;
}
function Hc(e, t = null, n = null, r) {
  let o = pl(e, t, n, r);
  return o.resolveInjectorInitializers(), o;
}
function pl(e, t = null, n = null, r, o = new Set()) {
  let i = [n || Pt, Hh(e)];
  return (
    (r = r || (typeof e == "object" ? void 0 : ie(e))),
    new mn(i, t || vs(), r || null, o)
  );
}
var at = class e {
  static {
    this.THROW_IF_NOT_FOUND = pn;
  }
  static {
    this.NULL = new Rr();
  }
  static create(t, n) {
    if (Array.isArray(t)) return Hc({ name: "" }, n, t, "");
    {
      let r = t.name ?? "";
      return Hc({ name: r }, t.parent, t.providers, r);
    }
  }
  static {
    this.ɵprov = w({ token: e, providedIn: "any", factory: () => T(Du) });
  }
  static {
    this.__NG_ELEMENT_ID__ = -1;
  }
};
var $p = new E("");
$p.__NG_ELEMENT_ID__ = (e) => {
  let t = Ve();
  if (t === null) throw new v(204, !1);
  if (t.type & 2) return t.value;
  if (e & b.Optional) return null;
  throw new v(204, !1);
};
var Bp = "ngOriginalError";
function Ii(e) {
  return e[Bp];
}
var gl = !0,
  ml = (() => {
    class e {
      static {
        this.__NG_ELEMENT_ID__ = Up;
      }
      static {
        this.__NG_ENV_ID__ = (n) => n;
      }
    }
    return e;
  })(),
  $i = class extends ml {
    constructor(t) {
      super(), (this._lView = t);
    }
    onDestroy(t) {
      return Hu(this._lView, t), () => cp(this._lView, t);
    }
  };
function Up() {
  return new $i(B());
}
var Wt = (() => {
  class e {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new q(!1));
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
      this.ɵprov = w({ token: e, providedIn: "root", factory: () => new e() });
    }
  }
  return e;
})();
var Bi = class extends Q {
    constructor(t = !1) {
      super(),
        (this.destroyRef = void 0),
        (this.pendingTasks = void 0),
        (this.__isAsync = t),
        ep() &&
          ((this.destroyRef = p(ml, { optional: !0 }) ?? void 0),
          (this.pendingTasks = p(Wt, { optional: !0 }) ?? void 0));
    }
    emit(t) {
      let n = R(null);
      try {
        super.next(t);
      } finally {
        R(n);
      }
    }
    subscribe(t, n, r) {
      let o = t,
        i = n || (() => null),
        s = r;
      if (t && typeof t == "object") {
        let a = t;
        (o = a.next?.bind(a)),
          (i = a.error?.bind(a)),
          (s = a.complete?.bind(a));
      }
      this.__isAsync &&
        ((i = this.wrapInTimeout(i)),
        o && (o = this.wrapInTimeout(o)),
        s && (s = this.wrapInTimeout(s)));
      let c = super.subscribe({ next: o, error: i, complete: s });
      return t instanceof V && t.add(c), c;
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
  K = Bi;
function jr(...e) {}
function vl(e) {
  let t, n;
  function r() {
    e = jr;
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
function zc(e) {
  return (
    queueMicrotask(() => e()),
    () => {
      e = jr;
    }
  );
}
var Ts = "isAngularZone",
  Vr = Ts + "_ID",
  Hp = 0,
  $ = class e {
    constructor(t) {
      (this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new K(!1)),
        (this.onMicrotaskEmpty = new K(!1)),
        (this.onStable = new K(!1)),
        (this.onError = new K(!1));
      let {
        enableLongStackTrace: n = !1,
        shouldCoalesceEventChangeDetection: r = !1,
        shouldCoalesceRunChangeDetection: o = !1,
        scheduleInRootZone: i = gl,
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
        qp(s);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get(Ts) === !0;
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
        s = i.scheduleEventTask("NgZoneEvent: " + o, t, zp, jr, jr);
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
  zp = {};
function xs(e) {
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
function Gp(e) {
  if (e.isCheckStableRunning || e.callbackScheduled) return;
  e.callbackScheduled = !0;
  function t() {
    vl(() => {
      (e.callbackScheduled = !1),
        Ui(e),
        (e.isCheckStableRunning = !0),
        xs(e),
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
    Ui(e);
}
function qp(e) {
  let t = () => {
      Gp(e);
    },
    n = Hp++;
  e._inner = e._inner.fork({
    name: "angular",
    properties: { [Ts]: !0, [Vr]: n, [Vr + n]: !0 },
    onInvokeTask: (r, o, i, s, c, a) => {
      if (Wp(a)) return r.invokeTask(i, s, c, a);
      try {
        return Gc(e), r.invokeTask(i, s, c, a);
      } finally {
        ((e.shouldCoalesceEventChangeDetection && s.type === "eventTask") ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          qc(e);
      }
    },
    onInvoke: (r, o, i, s, c, a, u) => {
      try {
        return Gc(e), r.invoke(i, s, c, a, u);
      } finally {
        e.shouldCoalesceRunChangeDetection &&
          !e.callbackScheduled &&
          !Zp(a) &&
          t(),
          qc(e);
      }
    },
    onHasTask: (r, o, i, s) => {
      r.hasTask(i, s),
        o === i &&
          (s.change == "microTask"
            ? ((e._hasPendingMicrotasks = s.microTask), Ui(e), xs(e))
            : s.change == "macroTask" &&
              (e.hasPendingMacrotasks = s.macroTask));
    },
    onHandleError: (r, o, i, s) => (
      r.handleError(i, s), e.runOutsideAngular(() => e.onError.emit(s)), !1
    ),
  });
}
function Ui(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection ||
    e.shouldCoalesceRunChangeDetection) &&
    e.callbackScheduled === !0)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function Gc(e) {
  e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
}
function qc(e) {
  e._nesting--, xs(e);
}
var Hi = class {
  constructor() {
    (this.hasPendingMicrotasks = !1),
      (this.hasPendingMacrotasks = !1),
      (this.isStable = !0),
      (this.onUnstable = new K()),
      (this.onMicrotaskEmpty = new K()),
      (this.onStable = new K()),
      (this.onError = new K());
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
function Wp(e) {
  return yl(e, "__ignore_ng_zone__");
}
function Zp(e) {
  return yl(e, "__scheduler_tick__");
}
function yl(e, t) {
  return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[t] === !0;
}
var Fe = class {
    constructor() {
      this._console = console;
    }
    handleError(t) {
      let n = this._findOriginalError(t);
      this._console.error("ERROR", t),
        n && this._console.error("ORIGINAL ERROR", n);
    }
    _findOriginalError(t) {
      let n = t && Ii(t);
      for (; n && Ii(n); ) n = Ii(n);
      return n || null;
    }
  },
  Yp = new E("", {
    providedIn: "root",
    factory: () => {
      let e = p($),
        t = p(Fe);
      return (n) => e.runOutsideAngular(() => t.handleError(n));
    },
  });
function Qp() {
  return Ns(Ve(), B());
}
function Ns(e, t) {
  return new ao(xe(e, t));
}
var ao = (() => {
  class e {
    constructor(n) {
      this.nativeElement = n;
    }
    static {
      this.__NG_ELEMENT_ID__ = Qp;
    }
  }
  return e;
})();
function Dl(e) {
  return (e.flags & 128) === 128;
}
var wl = new Map(),
  Kp = 0;
function Jp() {
  return Kp++;
}
function Xp(e) {
  wl.set(e[to], e);
}
function zi(e) {
  wl.delete(e[to]);
}
var Wc = "__ngContext__";
function ct(e, t) {
  tt(t) ? ((e[Wc] = t[to]), Xp(t)) : (e[Wc] = t);
}
function Cl(e) {
  return El(e[yn]);
}
function Il(e) {
  return El(e[we]);
}
function El(e) {
  for (; e !== null && !je(e); ) e = e[we];
  return e;
}
var Gi;
function bl(e) {
  Gi = e;
}
function eg() {
  if (Gi !== void 0) return Gi;
  if (typeof document < "u") return document;
  throw new v(210, !1);
}
var As = new E("", { providedIn: "root", factory: () => tg }),
  tg = "ng",
  Rs = new E(""),
  Zt = new E("", { providedIn: "platform", factory: () => "unknown" });
var Os = new E("", {
  providedIn: "root",
  factory: () =>
    eg().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
    null,
});
var ng = "h",
  rg = "b";
var og = () => null;
function Ps(e, t, n = !1) {
  return og(e, t, n);
}
var Sl = !1,
  ig = new E("", { providedIn: "root", factory: () => Sl });
var $r = class {
  constructor(t) {
    this.changingThisBreaksApplicationSecurity = t;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${uu})`;
  }
};
function Fs(e) {
  return e instanceof $r ? e.changingThisBreaksApplicationSecurity : e;
}
function Ml(e, t) {
  let n = sg(e);
  if (n != null && n !== t) {
    if (n === "ResourceURL" && t === "URL") return !0;
    throw new Error(`Required a safe ${t}, got a ${n} (see ${uu})`);
  }
  return n === t;
}
function sg(e) {
  return (e instanceof $r && e.getTypeName()) || null;
}
var ag = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function _l(e) {
  return (e = String(e)), e.match(ag) ? e : "unsafe:" + e;
}
var ks = (function (e) {
  return (
    (e[(e.NONE = 0)] = "NONE"),
    (e[(e.HTML = 1)] = "HTML"),
    (e[(e.STYLE = 2)] = "STYLE"),
    (e[(e.SCRIPT = 3)] = "SCRIPT"),
    (e[(e.URL = 4)] = "URL"),
    (e[(e.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    e
  );
})(ks || {});
function Tl(e) {
  let t = cg();
  return t ? t.sanitize(ks.URL, e) || "" : Ml(e, "URL") ? Fs(e) : _l(ls(e));
}
function cg() {
  let e = B();
  return e && e[Te].sanitizer;
}
function xl(e) {
  return e instanceof Function ? e() : e;
}
var ut = (function (e) {
    return (
      (e[(e.Important = 1)] = "Important"),
      (e[(e.DashCase = 2)] = "DashCase"),
      e
    );
  })(ut || {}),
  ug;
function Ls(e, t) {
  return ug(e, t);
}
function Nt(e, t, n, r, o) {
  if (r != null) {
    let i,
      s = !1;
    je(r) ? (i = r) : tt(r) && ((s = !0), (r = r[Le]));
    let c = Pe(r);
    e === 0 && n !== null
      ? o == null
        ? Ol(t, n, c)
        : Br(t, n, c, o || null, !0)
      : e === 1 && n !== null
        ? Br(t, n, c, o || null, !0)
        : e === 2
          ? bg(t, c, s)
          : e === 3 && t.destroyNode(c),
      i != null && Mg(t, e, i, n, o);
  }
}
function lg(e, t) {
  return e.createText(t);
}
function dg(e, t, n) {
  e.setValue(t, n);
}
function Nl(e, t, n) {
  return e.createElement(t, n);
}
function fg(e, t) {
  Al(e, t), (t[Le] = null), (t[Ie] = null);
}
function hg(e, t, n, r, o, i) {
  (r[Le] = o), (r[Ie] = t), uo(e, r, n, 1, o, i);
}
function Al(e, t) {
  t[Te].changeDetectionScheduler?.notify(9), uo(e, t, t[se], 2, null, null);
}
function pg(e) {
  let t = e[yn];
  if (!t) return Ei(e[S], e);
  for (; t; ) {
    let n = null;
    if (tt(t)) n = t[yn];
    else {
      let r = t[J];
      r && (n = r);
    }
    if (!n) {
      for (; t && !t[we] && t !== e; ) tt(t) && Ei(t[S], t), (t = t[X]);
      t === null && (t = e), tt(t) && Ei(t[S], t), (n = t && t[we]);
    }
    t = n;
  }
}
function gg(e, t, n, r) {
  let o = J + r,
    i = n.length;
  r > 0 && (n[o - 1][we] = t),
    r < i - J ? ((t[we] = n[o]), yu(n, J + r, t)) : (n.push(t), (t[we] = null)),
    (t[X] = n);
  let s = t[Lt];
  s !== null && n !== s && Rl(s, t);
  let c = t[jt];
  c !== null && c.insertView(e), Fi(t), (t[y] |= 128);
}
function Rl(e, t) {
  let n = e[Pr],
    r = t[X];
  if (tt(r)) e[y] |= Fr.HasTransplantedViews;
  else {
    let o = r[X][Ce];
    t[Ce] !== o && (e[y] |= Fr.HasTransplantedViews);
  }
  n === null ? (e[Pr] = [t]) : n.push(t);
}
function js(e, t) {
  let n = e[Pr],
    r = n.indexOf(t);
  n.splice(r, 1);
}
function In(e, t) {
  if (e.length <= J) return;
  let n = J + t,
    r = e[n];
  if (r) {
    let o = r[Lt];
    o !== null && o !== e && js(o, r), t > 0 && (e[n - 1][we] = r[we]);
    let i = Ar(e, J + t);
    fg(r[S], r);
    let s = i[jt];
    s !== null && s.detachView(i[S]),
      (r[X] = null),
      (r[we] = null),
      (r[y] &= -129);
  }
  return r;
}
function co(e, t) {
  if (!(t[y] & 256)) {
    let n = t[se];
    n.destroyNode && uo(e, t, n, 3, null, null), pg(t);
  }
}
function Ei(e, t) {
  if (t[y] & 256) return;
  let n = R(null);
  try {
    (t[y] &= -129),
      (t[y] |= 256),
      t[fe] && Ko(t[fe]),
      vg(e, t),
      mg(e, t),
      t[S].type === 1 && t[se].destroy();
    let r = t[Lt];
    if (r !== null && je(t[X])) {
      r !== t[X] && js(r, t);
      let o = t[jt];
      o !== null && o.detachView(e);
    }
    zi(t);
  } finally {
    R(n);
  }
}
function mg(e, t) {
  let n = e.cleanup,
    r = t[Fc];
  if (n !== null)
    for (let i = 0; i < n.length - 1; i += 2)
      if (typeof n[i] == "string") {
        let s = n[i + 3];
        s >= 0 ? r[s]() : r[-s].unsubscribe(), (i += 2);
      } else {
        let s = r[n[i + 1]];
        n[i].call(s);
      }
  r !== null && (t[Fc] = null);
  let o = t[We];
  if (o !== null) {
    t[We] = null;
    for (let i = 0; i < o.length; i++) {
      let s = o[i];
      s();
    }
  }
}
function vg(e, t) {
  let n;
  if (e != null && (n = e.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let o = t[n[r]];
      if (!(o instanceof wn)) {
        let i = n[r + 1];
        if (Array.isArray(i))
          for (let s = 0; s < i.length; s += 2) {
            let c = o[i[s]],
              a = i[s + 1];
            qe(4, c, a);
            try {
              a.call(c);
            } finally {
              qe(5, c, a);
            }
          }
        else {
          qe(4, o, i);
          try {
            i.call(o);
          } finally {
            qe(5, o, i);
          }
        }
      }
    }
}
function yg(e, t, n) {
  return Dg(e, t.parent, n);
}
function Dg(e, t, n) {
  let r = t;
  for (; r !== null && r.type & 168; ) (t = r), (r = t.parent);
  if (r === null) return n[Le];
  {
    let { componentOffset: o } = r;
    if (o > -1) {
      let { encapsulation: i } = e.data[r.directiveStart + o];
      if (i === _e.None || i === _e.Emulated) return null;
    }
    return xe(r, n);
  }
}
function Br(e, t, n, r, o) {
  e.insertBefore(t, n, r, o);
}
function Ol(e, t, n) {
  e.appendChild(t, n);
}
function Zc(e, t, n, r, o) {
  r !== null ? Br(e, t, n, r, o) : Ol(e, t, n);
}
function Pl(e, t) {
  return e.parentNode(t);
}
function wg(e, t) {
  return e.nextSibling(t);
}
function Cg(e, t, n) {
  return Eg(e, t, n);
}
function Ig(e, t, n) {
  return e.type & 40 ? xe(e, n) : null;
}
var Eg = Ig,
  Yc;
function Vs(e, t, n, r) {
  let o = yg(e, r, t),
    i = t[se],
    s = r.parent || t[Ie],
    c = Cg(s, r, t);
  if (o != null)
    if (Array.isArray(n))
      for (let a = 0; a < n.length; a++) Zc(i, o, n[a], c, !1);
    else Zc(i, o, n, c, !1);
  Yc !== void 0 && Yc(i, r, t, n, o);
}
function dn(e, t) {
  if (t !== null) {
    let n = t.type;
    if (n & 3) return xe(t, e);
    if (n & 4) return qi(-1, e[t.index]);
    if (n & 8) {
      let r = t.child;
      if (r !== null) return dn(e, r);
      {
        let o = e[t.index];
        return je(o) ? qi(-1, o) : Pe(o);
      }
    } else {
      if (n & 128) return dn(e, t.next);
      if (n & 32) return Ls(t, e)() || Pe(e[t.index]);
      {
        let r = Fl(e, t);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let o = it(e[Ce]);
          return dn(o, r);
        } else return dn(e, t.next);
      }
    }
  }
  return null;
}
function Fl(e, t) {
  if (t !== null) {
    let r = e[Ce][Ie],
      o = t.projection;
    return r.projection[o];
  }
  return null;
}
function qi(e, t) {
  let n = J + e + 1;
  if (n < t.length) {
    let r = t[n],
      o = r[S].firstChild;
    if (o !== null) return dn(r, o);
  }
  return t[ot];
}
function bg(e, t, n) {
  e.removeChild(null, t, n);
}
function $s(e, t, n, r, o, i, s) {
  for (; n != null; ) {
    if (n.type === 128) {
      n = n.next;
      continue;
    }
    let c = r[n.index],
      a = n.type;
    if (
      (s && t === 0 && (c && ct(Pe(c), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (a & 8) $s(e, t, n.child, r, o, i, !1), Nt(t, e, o, c, i);
      else if (a & 32) {
        let u = Ls(n, r),
          l;
        for (; (l = u()); ) Nt(t, e, o, l, i);
        Nt(t, e, o, c, i);
      } else a & 16 ? Sg(e, t, r, n, o, i) : Nt(t, e, o, c, i);
    n = s ? n.projectionNext : n.next;
  }
}
function uo(e, t, n, r, o, i) {
  $s(n, r, e.firstChild, t, o, i, !1);
}
function Sg(e, t, n, r, o, i) {
  let s = n[Ce],
    a = s[Ie].projection[r.projection];
  if (Array.isArray(a))
    for (let u = 0; u < a.length; u++) {
      let l = a[u];
      Nt(t, e, o, l, i);
    }
  else {
    let u = a,
      l = s[X];
    Dl(r) && (u.flags |= 128), $s(e, t, u, l, o, i, !0);
  }
}
function Mg(e, t, n, r, o) {
  let i = n[ot],
    s = Pe(n);
  i !== s && Nt(t, e, r, i, o);
  for (let c = J; c < n.length; c++) {
    let a = n[c];
    uo(a[S], a, e, t, r, i);
  }
}
function _g(e, t, n) {
  e.setAttribute(t, "style", n);
}
function kl(e, t, n) {
  n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n);
}
function Ll(e, t, n) {
  let { mergedAttrs: r, classes: o, styles: i } = n;
  r !== null && Ti(e, t, r),
    o !== null && kl(e, t, o),
    i !== null && _g(e, t, i);
}
var xn = {};
function lo(e = 1) {
  jl(Gt(), B(), so() + e, !1);
}
function jl(e, t, n, r) {
  if (!r)
    if ((t[y] & 3) === 3) {
      let i = e.preOrderCheckHooks;
      i !== null && Sr(t, i, n);
    } else {
      let i = e.preOrderHooks;
      i !== null && Mr(t, i, 0, n);
    }
  st(n);
}
function Bs(e, t = b.Default) {
  let n = B();
  if (n === null) return T(e, t);
  let r = Ve();
  return dl(r, n, le(e), t);
}
function Vl(e, t, n, r, o, i) {
  let s = R(null);
  try {
    let c = null;
    o & Ze.SignalBased && (c = t[r][Wa]),
      c !== null && c.transformFn !== void 0 && (i = c.transformFn(i)),
      o & Ze.HasDecoratorInputTransform &&
        (i = e.inputTransforms[r].call(t, i)),
      e.setInput !== null ? e.setInput(t, c, i, n, r) : ku(t, c, r, i);
  } finally {
    R(s);
  }
}
function Tg(e, t) {
  let n = e.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        if (o < 0) st(~o);
        else {
          let i = o,
            s = n[++r],
            c = n[++r];
          Dp(s, i);
          let a = t[i];
          c(2, a);
        }
      }
    } finally {
      st(-1);
    }
}
function fo(e, t, n, r, o, i, s, c, a, u, l) {
  let d = t.blueprint.slice();
  return (
    (d[Le] = o),
    (d[y] = r | 4 | 128 | 8 | 64),
    (u !== null || (e && e[y] & 2048)) && (d[y] |= 2048),
    Bu(d),
    (d[X] = d[Sn] = e),
    (d[de] = n),
    (d[Te] = s || (e && e[Te])),
    (d[se] = c || (e && e[se])),
    (d[kt] = a || (e && e[kt]) || null),
    (d[Ie] = i),
    (d[to] = Jp()),
    (d[vn] = l),
    (d[Ru] = u),
    (d[Ce] = t.type == 2 ? e[Ce] : d),
    d
  );
}
function ho(e, t, n, r, o) {
  let i = e.data[t];
  if (i === null) (i = xg(e, t, n, r, o)), yp() && (i.flags |= 32);
  else if (i.type & 64) {
    (i.type = n), (i.value = r), (i.attrs = o);
    let s = gp();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return _n(i, !0), i;
}
function xg(e, t, n, r, o) {
  let i = qu(),
    s = Wu(),
    c = s ? i : i && i.parent,
    a = (e.data[t] = Pg(e, c, n, t, r, o));
  return (
    e.firstChild === null && (e.firstChild = a),
    i !== null &&
      (s
        ? i.child == null && a.parent !== null && (i.child = a)
        : i.next === null && ((i.next = a), (a.prev = i))),
    a
  );
}
function $l(e, t, n, r) {
  if (n === 0) return -1;
  let o = t.length;
  for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
  return o;
}
function Bl(e, t, n, r, o) {
  let i = so(),
    s = r & 2;
  try {
    st(-1), s && t.length > Oe && jl(e, t, Oe, !1), qe(s ? 2 : 0, o), n(r, o);
  } finally {
    st(i), qe(s ? 3 : 1, o);
  }
}
function Ul(e, t, n) {
  if (Pu(t)) {
    let r = R(null);
    try {
      let o = t.directiveStart,
        i = t.directiveEnd;
      for (let s = o; s < i; s++) {
        let c = e.data[s];
        if (c.contentQueries) {
          let a = n[s];
          c.contentQueries(1, a, s);
        }
      }
    } finally {
      R(r);
    }
  }
}
function Hl(e, t, n) {
  Gu() && (Bg(e, t, n, xe(n, t)), (n.flags & 64) === 64 && Zl(e, t, n));
}
function zl(e, t, n = xe) {
  let r = t.localNames;
  if (r !== null) {
    let o = t.index + 1;
    for (let i = 0; i < r.length; i += 2) {
      let s = r[i + 1],
        c = s === -1 ? n(t, e) : e[s];
      e[o++] = c;
    }
  }
}
function Gl(e) {
  let t = e.tView;
  return t === null || t.incompleteFirstPass
    ? (e.tView = Us(
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
function Us(e, t, n, r, o, i, s, c, a, u, l) {
  let d = Oe + r,
    h = d + o,
    f = Ng(d, h),
    g = typeof u == "function" ? u() : u;
  return (f[S] = {
    type: e,
    blueprint: f,
    template: n,
    queries: null,
    viewQuery: c,
    declTNode: t,
    data: f.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: h,
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
    schemas: a,
    consts: g,
    incompleteFirstPass: !1,
    ssrId: l,
  });
}
function Ng(e, t) {
  let n = [];
  for (let r = 0; r < t; r++) n.push(r < e ? null : xn);
  return n;
}
function Ag(e, t, n, r) {
  let i = r.get(ig, Sl) || n === _e.ShadowDom,
    s = e.selectRootElement(t, i);
  return Rg(s), s;
}
function Rg(e) {
  Og(e);
}
var Og = () => null;
function Pg(e, t, n, r, o, i) {
  let s = t ? t.injectorIndex : -1,
    c = 0;
  return (
    fp() && (c |= 128),
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
      flags: c,
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
function Qc(e, t, n, r, o) {
  for (let i in t) {
    if (!t.hasOwnProperty(i)) continue;
    let s = t[i];
    if (s === void 0) continue;
    r ??= {};
    let c,
      a = Ze.None;
    Array.isArray(s) ? ((c = s[0]), (a = s[1])) : (c = s);
    let u = i;
    if (o !== null) {
      if (!o.hasOwnProperty(i)) continue;
      u = o[i];
    }
    e === 0 ? Kc(r, n, u, c, a) : Kc(r, n, u, c);
  }
  return r;
}
function Kc(e, t, n, r, o) {
  let i;
  e.hasOwnProperty(n) ? (i = e[n]).push(t, r) : (i = e[n] = [t, r]),
    o !== void 0 && i.push(o);
}
function Fg(e, t, n) {
  let r = t.directiveStart,
    o = t.directiveEnd,
    i = e.data,
    s = t.attrs,
    c = [],
    a = null,
    u = null;
  for (let l = r; l < o; l++) {
    let d = i[l],
      h = n ? n.get(d) : null,
      f = h ? h.inputs : null,
      g = h ? h.outputs : null;
    (a = Qc(0, d.inputs, l, a, f)), (u = Qc(1, d.outputs, l, u, g));
    let M = a !== null && s !== null && !ps(t) ? Qg(a, l, s) : null;
    c.push(M);
  }
  a !== null &&
    (a.hasOwnProperty("class") && (t.flags |= 8),
    a.hasOwnProperty("style") && (t.flags |= 16)),
    (t.initialInputs = c),
    (t.inputs = a),
    (t.outputs = u);
}
function kg(e) {
  return e === "class"
    ? "className"
    : e === "for"
      ? "htmlFor"
      : e === "formaction"
        ? "formAction"
        : e === "innerHtml"
          ? "innerHTML"
          : e === "readonly"
            ? "readOnly"
            : e === "tabindex"
              ? "tabIndex"
              : e;
}
function Lg(e, t, n, r, o, i, s, c) {
  let a = xe(t, n),
    u = t.inputs,
    l;
  !c && u != null && (l = u[r])
    ? (Hs(e, n, l, r, o), no(t) && jg(n, t.index))
    : t.type & 3
      ? ((r = kg(r)),
        (o = s != null ? s(o, t.value || "", r) : o),
        i.setProperty(a, r, o))
      : t.type & 12;
}
function jg(e, t) {
  let n = zt(t, e);
  n[y] & 16 || (n[y] |= 64);
}
function ql(e, t, n, r) {
  if (Gu()) {
    let o = r === null ? null : { "": -1 },
      i = Hg(e, n),
      s,
      c;
    i === null ? (s = c = null) : ([s, c] = i),
      s !== null && Wl(e, t, n, s, o, c),
      o && zg(n, r, o);
  }
  n.mergedAttrs = hs(n.mergedAttrs, n.attrs);
}
function Wl(e, t, n, r, o, i) {
  for (let u = 0; u < r.length; u++) Pp(al(n, t), e, r[u].type);
  qg(n, e.data.length, r.length);
  for (let u = 0; u < r.length; u++) {
    let l = r[u];
    l.providersResolver && l.providersResolver(l);
  }
  let s = !1,
    c = !1,
    a = $l(e, t, r.length, null);
  for (let u = 0; u < r.length; u++) {
    let l = r[u];
    (n.mergedAttrs = hs(n.mergedAttrs, l.hostAttrs)),
      Wg(e, n, t, a, l),
      Gg(a, l, o),
      l.contentQueries !== null && (n.flags |= 4),
      (l.hostBindings !== null || l.hostAttrs !== null || l.hostVars !== 0) &&
        (n.flags |= 64);
    let d = l.type.prototype;
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(n.index), (s = !0)),
      !c &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(n.index), (c = !0)),
      a++;
  }
  Fg(e, n, i);
}
function Vg(e, t, n, r, o) {
  let i = o.hostBindings;
  if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let c = ~t.index;
    $g(s) != c && s.push(c), s.push(n, r, i);
  }
}
function $g(e) {
  let t = e.length;
  for (; t > 0; ) {
    let n = e[--t];
    if (typeof n == "number" && n < 0) return n;
  }
  return 0;
}
function Bg(e, t, n, r) {
  let o = n.directiveStart,
    i = n.directiveEnd;
  no(n) && Zg(t, n, e.data[o + n.componentOffset]),
    e.firstCreatePass || al(n, t),
    ct(r, t);
  let s = n.initialInputs;
  for (let c = o; c < i; c++) {
    let a = e.data[c],
      u = Cn(t, e, c, n);
    if ((ct(u, t), s !== null && Yg(t, c - o, u, a, n, s), Mn(a))) {
      let l = zt(n.index, t);
      l[de] = Cn(t, e, c, n);
    }
  }
}
function Zl(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd,
    i = n.index,
    s = wp();
  try {
    st(i);
    for (let c = r; c < o; c++) {
      let a = e.data[c],
        u = t[c];
      ki(c),
        (a.hostBindings !== null || a.hostVars !== 0 || a.hostAttrs !== null) &&
          Ug(a, u);
    }
  } finally {
    st(-1), ki(s);
  }
}
function Ug(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t);
}
function Hg(e, t) {
  let n = e.directiveRegistry,
    r = null,
    o = null;
  if (n)
    for (let i = 0; i < n.length; i++) {
      let s = n[i];
      if (Ph(t, s.selectors, !1))
        if ((r || (r = []), Mn(s)))
          if (s.findHostDirectiveDefs !== null) {
            let c = [];
            (o = o || new Map()),
              s.findHostDirectiveDefs(s, c, o),
              r.unshift(...c, s);
            let a = c.length;
            Wi(e, t, a);
          } else r.unshift(s), Wi(e, t, 0);
        else
          (o = o || new Map()), s.findHostDirectiveDefs?.(s, r, o), r.push(s);
    }
  return r === null ? null : [r, o];
}
function Wi(e, t, n) {
  (t.componentOffset = n), (e.components ??= []).push(t.index);
}
function zg(e, t, n) {
  if (t) {
    let r = (e.localNames = []);
    for (let o = 0; o < t.length; o += 2) {
      let i = n[t[o + 1]];
      if (i == null) throw new v(-301, !1);
      r.push(t[o], i);
    }
  }
}
function Gg(e, t, n) {
  if (n) {
    if (t.exportAs)
      for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
    Mn(t) && (n[""] = e);
  }
}
function qg(e, t, n) {
  (e.flags |= 1),
    (e.directiveStart = t),
    (e.directiveEnd = t + n),
    (e.providerIndexes = t);
}
function Wg(e, t, n, r, o) {
  e.data[r] = o;
  let i = o.factory || (o.factory = Ot(o.type, !0)),
    s = new wn(i, Mn(o), Bs);
  (e.blueprint[r] = s), (n[r] = s), Vg(e, t, r, $l(e, n, o.hostVars, xn), o);
}
function Zg(e, t, n) {
  let r = xe(t, e),
    o = Gl(n),
    i = e[Te].rendererFactory,
    s = 16;
  n.signals ? (s = 4096) : n.onPush && (s = 64);
  let c = po(
    e,
    fo(e, o, null, s, r, t, null, i.createRenderer(r, n), null, null, null),
  );
  e[t.index] = c;
}
function Yg(e, t, n, r, o, i) {
  let s = i[t];
  if (s !== null)
    for (let c = 0; c < s.length; ) {
      let a = s[c++],
        u = s[c++],
        l = s[c++],
        d = s[c++];
      Vl(r, n, a, u, l, d);
    }
}
function Qg(e, t, n) {
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
      for (let c = 0; c < s.length; c += 3)
        if (s[c] === t) {
          r.push(i, s[c + 1], s[c + 2], n[o + 1]);
          break;
        }
    }
    o += 2;
  }
  return r;
}
function Yl(e, t, n, r) {
  return [e, !0, 0, t, null, r, null, n, null, null];
}
function Ql(e, t) {
  let n = e.contentQueries;
  if (n !== null) {
    let r = R(null);
    try {
      for (let o = 0; o < n.length; o += 2) {
        let i = n[o],
          s = n[o + 1];
        if (s !== -1) {
          let c = e.data[s];
          Qu(i), c.contentQueries(2, t[s], s);
        }
      }
    } finally {
      R(r);
    }
  }
}
function po(e, t) {
  return e[yn] ? (e[kc][we] = t) : (e[yn] = t), (e[kc] = t), t;
}
function Zi(e, t, n) {
  Qu(0);
  let r = R(null);
  try {
    t(e, n);
  } finally {
    R(r);
  }
}
function Kg(e, t) {
  let n = e[kt],
    r = n ? n.get(Fe, null) : null;
  r && r.handleError(t);
}
function Hs(e, t, n, r, o) {
  for (let i = 0; i < n.length; ) {
    let s = n[i++],
      c = n[i++],
      a = n[i++],
      u = t[s],
      l = e.data[s];
    Vl(l, u, r, c, a, o);
  }
}
function Jg(e, t, n) {
  let r = sp(t, e);
  dg(e[se], r, n);
}
function Xg(e, t) {
  let n = zt(t, e),
    r = n[S];
  em(r, n);
  let o = n[Le];
  o !== null && n[vn] === null && (n[vn] = Ps(o, n[kt])), zs(r, n, n[de]);
}
function em(e, t) {
  for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
}
function zs(e, t, n) {
  Cs(t);
  try {
    let r = e.viewQuery;
    r !== null && Zi(1, r, n);
    let o = e.template;
    o !== null && Bl(e, t, o, 1, n),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[jt]?.finishViewCreation(e),
      e.staticContentQueries && Ql(e, t),
      e.staticViewQueries && Zi(2, e.viewQuery, n);
    let i = e.components;
    i !== null && tm(t, i);
  } catch (r) {
    throw (
      (e.firstCreatePass &&
        ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
      r)
    );
  } finally {
    (t[y] &= -5), Is();
  }
}
function tm(e, t) {
  for (let n = 0; n < t.length; n++) Xg(e, t[n]);
}
function Kl(e, t, n, r) {
  let o = R(null);
  try {
    let i = t.tView,
      c = e[y] & 4096 ? 4096 : 16,
      a = fo(
        e,
        i,
        n,
        c,
        null,
        t,
        null,
        null,
        r?.injector ?? null,
        r?.embeddedViewInjector ?? null,
        r?.dehydratedView ?? null,
      ),
      u = e[t.index];
    a[Lt] = u;
    let l = e[jt];
    return l !== null && (a[jt] = l.createEmbeddedView(i)), zs(i, a, n), a;
  } finally {
    R(o);
  }
}
function nm(e, t) {
  let n = J + t;
  if (n < e.length) return e[n];
}
function Ur(e, t) {
  return !t || t.firstChild === null || Dl(e);
}
function Gs(e, t, n, r = !0) {
  let o = t[S];
  if ((gg(o, t, e, n), r)) {
    let s = qi(n, e),
      c = t[se],
      a = Pl(c, e[ot]);
    a !== null && hg(o, e[Ie], c, t, a, s);
  }
  let i = t[vn];
  i !== null && i.firstChild !== null && (i.firstChild = null);
}
function rm(e, t) {
  let n = In(e, t);
  return n !== void 0 && co(n[S], n), n;
}
function Hr(e, t, n, r, o = !1) {
  for (; n !== null; ) {
    if (n.type === 128) {
      n = o ? n.projectionNext : n.next;
      continue;
    }
    let i = t[n.index];
    i !== null && r.push(Pe(i)), je(i) && om(i, r);
    let s = n.type;
    if (s & 8) Hr(e, t, n.child, r);
    else if (s & 32) {
      let c = Ls(n, t),
        a;
      for (; (a = c()); ) r.push(a);
    } else if (s & 16) {
      let c = Fl(t, n);
      if (Array.isArray(c)) r.push(...c);
      else {
        let a = it(t[Ce]);
        Hr(a[S], a, c, r, !0);
      }
    }
    n = o ? n.projectionNext : n.next;
  }
  return r;
}
function om(e, t) {
  for (let n = J; n < e.length; n++) {
    let r = e[n],
      o = r[S].firstChild;
    o !== null && Hr(r[S], r, o, t);
  }
  e[ot] !== e[Le] && t.push(e[ot]);
}
var Jl = [];
function im(e) {
  return e[fe] ?? sm(e);
}
function sm(e) {
  let t = Jl.pop() ?? Object.create(cm);
  return (t.lView = e), t;
}
function am(e) {
  e.lView[fe] !== e && ((e.lView = null), Jl.push(e));
}
var cm = j(m({}, Zo), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (e) => {
    io(e.lView);
  },
  consumerOnSignalRead() {
    this.lView[fe] = this;
  },
});
function um(e) {
  let t = e[fe] ?? Object.create(lm);
  return (t.lView = e), t;
}
var lm = j(m({}, Zo), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (e) => {
    let t = it(e.lView);
    for (; t && !Xl(t[S]); ) t = it(t);
    t && Uu(t);
  },
  consumerOnSignalRead() {
    this.lView[fe] = this;
  },
});
function Xl(e) {
  return e.type !== 2;
}
var dm = 100;
function ed(e, t = !0, n = 0) {
  let r = e[Te],
    o = r.rendererFactory,
    i = !1;
  i || o.begin?.();
  try {
    fm(e, n);
  } catch (s) {
    throw (t && Kg(e, s), s);
  } finally {
    i || (o.end?.(), r.inlineEffectRunner?.flush());
  }
}
function fm(e, t) {
  let n = Zu();
  try {
    jc(!0), Yi(e, t);
    let r = 0;
    for (; oo(e); ) {
      if (r === dm) throw new v(103, !1);
      r++, Yi(e, 1);
    }
  } finally {
    jc(n);
  }
}
function hm(e, t, n, r) {
  let o = t[y];
  if ((o & 256) === 256) return;
  let i = !1,
    s = !1;
  !i && t[Te].inlineEffectRunner?.flush(), Cs(t);
  let c = !0,
    a = null,
    u = null;
  i ||
    (Xl(e)
      ? ((u = im(t)), (a = Yo(u)))
      : Za() === null
        ? ((c = !1), (u = um(t)), (a = Yo(u)))
        : t[fe] && (Ko(t[fe]), (t[fe] = null)));
  try {
    Bu(t), vp(e.bindingStartIndex), n !== null && Bl(e, t, n, 2, r);
    let l = (o & 3) === 3;
    if (!i)
      if (l) {
        let f = e.preOrderCheckHooks;
        f !== null && Sr(t, f, null);
      } else {
        let f = e.preOrderHooks;
        f !== null && Mr(t, f, 0, null), Di(t, 0);
      }
    if ((s || pm(t), td(t, 0), e.contentQueries !== null && Ql(e, t), !i))
      if (l) {
        let f = e.contentCheckHooks;
        f !== null && Sr(t, f);
      } else {
        let f = e.contentHooks;
        f !== null && Mr(t, f, 1), Di(t, 1);
      }
    Tg(e, t);
    let d = e.components;
    d !== null && rd(t, d, 0);
    let h = e.viewQuery;
    if ((h !== null && Zi(2, h, r), !i))
      if (l) {
        let f = e.viewCheckHooks;
        f !== null && Sr(t, f);
      } else {
        let f = e.viewHooks;
        f !== null && Mr(t, f, 2), Di(t, 2);
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[yi])) {
      for (let f of t[yi]) f();
      t[yi] = null;
    }
    i || (t[y] &= -73);
  } catch (l) {
    throw (i || io(t), l);
  } finally {
    u !== null && (Ya(u, a), c && am(u)), Is();
  }
}
function td(e, t) {
  for (let n = Cl(e); n !== null; n = Il(n))
    for (let r = J; r < n.length; r++) {
      let o = n[r];
      nd(o, t);
    }
}
function pm(e) {
  for (let t = Cl(e); t !== null; t = Il(t)) {
    if (!(t[y] & Fr.HasTransplantedViews)) continue;
    let n = t[Pr];
    for (let r = 0; r < n.length; r++) {
      let o = n[r];
      Uu(o);
    }
  }
}
function gm(e, t, n) {
  let r = zt(t, e);
  nd(r, n);
}
function nd(e, t) {
  Ds(e) && Yi(e, t);
}
function Yi(e, t) {
  let r = e[S],
    o = e[y],
    i = e[fe],
    s = !!(t === 0 && o & 16);
  if (
    ((s ||= !!(o & 64 && t === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && Qo(i))),
    (s ||= !1),
    i && (i.dirty = !1),
    (e[y] &= -9217),
    s)
  )
    hm(r, e, r.template, e[de]);
  else if (o & 8192) {
    td(e, 1);
    let c = r.components;
    c !== null && rd(e, c, 1);
  }
}
function rd(e, t, n) {
  for (let r = 0; r < t.length; r++) gm(e, t[r], n);
}
function od(e, t) {
  let n = Zu() ? 64 : 1088;
  for (e[Te].changeDetectionScheduler?.notify(t); e; ) {
    e[y] |= n;
    let r = it(e);
    if (Oi(e) && !r) return e;
    e = r;
  }
  return null;
}
var Vt = class {
  get rootNodes() {
    let t = this._lView,
      n = t[S];
    return Hr(n, t, n.firstChild, []);
  }
  constructor(t, n, r = !0) {
    (this._lView = t),
      (this._cdRefInjectingView = n),
      (this.notifyErrorHandler = r),
      (this._appRef = null),
      (this._attachedToViewContainer = !1);
  }
  get context() {
    return this._lView[de];
  }
  set context(t) {
    this._lView[de] = t;
  }
  get destroyed() {
    return (this._lView[y] & 256) === 256;
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
      let t = this._lView[X];
      if (je(t)) {
        let n = t[Or],
          r = n ? n.indexOf(this) : -1;
        r > -1 && (In(t, r), Ar(n, r));
      }
      this._attachedToViewContainer = !1;
    }
    co(this._lView[S], this._lView);
  }
  onDestroy(t) {
    Hu(this._lView, t);
  }
  markForCheck() {
    od(this._cdRefInjectingView || this._lView, 4);
  }
  detach() {
    this._lView[y] &= -129;
  }
  reattach() {
    Fi(this._lView), (this._lView[y] |= 128);
  }
  detectChanges() {
    (this._lView[y] |= 1024), ed(this._lView, this.notifyErrorHandler);
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new v(902, !1);
    this._attachedToViewContainer = !0;
  }
  detachFromAppRef() {
    this._appRef = null;
    let t = Oi(this._lView),
      n = this._lView[Lt];
    n !== null && !t && js(n, this._lView), Al(this._lView[S], this._lView);
  }
  attachToAppRef(t) {
    if (this._attachedToViewContainer) throw new v(902, !1);
    this._appRef = t;
    let n = Oi(this._lView),
      r = this._lView[Lt];
    r !== null && !n && Rl(r, this._lView), Fi(this._lView);
  }
};
var _b = new RegExp(`^(\\d+)*(${rg}|${ng})*(.*)`);
var mm = () => null;
function zr(e, t) {
  return mm(e, t);
}
var $t = class {},
  go = new E("", { providedIn: "root", factory: () => !1 });
var id = new E(""),
  sd = new E(""),
  Qi = class {},
  Gr = class {};
function vm(e) {
  let t = Error(`No component factory found for ${ie(e)}.`);
  return (t[ym] = e), t;
}
var ym = "ngComponent";
var Ki = class {
    resolveComponentFactory(t) {
      throw vm(t);
    }
  },
  Bt = class {
    static {
      this.NULL = new Ki();
    }
  },
  Ut = class {};
var Dm = (() => {
  class e {
    static {
      this.ɵprov = w({ token: e, providedIn: "root", factory: () => null });
    }
  }
  return e;
})();
function Ji(e, t, n) {
  let r = n ? e.styles : null,
    o = n ? e.classes : null,
    i = 0;
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let c = t[s];
      if (typeof c == "number") i = c;
      else if (i == 1) o = Sc(o, c);
      else if (i == 2) {
        let a = c,
          u = t[++s];
        r = Sc(r, a + ": " + u + ";");
      }
    }
  n ? (e.styles = r) : (e.stylesWithoutHost = r),
    n ? (e.classes = o) : (e.classesWithoutHost = o);
}
var qr = class extends Bt {
  constructor(t) {
    super(), (this.ngModule = t);
  }
  resolveComponentFactory(t) {
    let n = rt(t);
    return new En(n, this.ngModule);
  }
};
function Jc(e, t) {
  let n = [];
  for (let r in e) {
    if (!e.hasOwnProperty(r)) continue;
    let o = e[r];
    if (o === void 0) continue;
    let i = Array.isArray(o),
      s = i ? o[0] : o,
      c = i ? o[1] : Ze.None;
    t
      ? n.push({
          propName: s,
          templateName: r,
          isSignal: (c & Ze.SignalBased) !== 0,
        })
      : n.push({ propName: s, templateName: r });
  }
  return n;
}
function wm(e) {
  let t = e.toLowerCase();
  return t === "svg" ? $u : t === "math" ? ip : null;
}
var En = class extends Gr {
    get inputs() {
      let t = this.componentDef,
        n = t.inputTransforms,
        r = Jc(t.inputs, !0);
      if (n !== null)
        for (let o of r)
          n.hasOwnProperty(o.propName) && (o.transform = n[o.propName]);
      return r;
    }
    get outputs() {
      return Jc(this.componentDef.outputs, !1);
    }
    constructor(t, n) {
      super(),
        (this.componentDef = t),
        (this.ngModule = n),
        (this.componentType = t.type),
        (this.selector = jh(t.selectors)),
        (this.ngContentSelectors = t.ngContentSelectors
          ? t.ngContentSelectors
          : []),
        (this.isBoundToModule = !!n);
    }
    create(t, n, r, o) {
      let i = R(null);
      try {
        o = o || this.ngModule;
        let s = o instanceof he ? o : o?.injector;
        s &&
          this.componentDef.getStandaloneInjector !== null &&
          (s = this.componentDef.getStandaloneInjector(s) || s);
        let c = s ? new Li(t, s) : t,
          a = c.get(Ut, null);
        if (a === null) throw new v(407, !1);
        let u = c.get(Dm, null),
          l = c.get($t, null),
          d = {
            rendererFactory: a,
            sanitizer: u,
            inlineEffectRunner: null,
            changeDetectionScheduler: l,
          },
          h = a.createRenderer(null, this.componentDef),
          f = this.componentDef.selectors[0][0] || "div",
          g = r
            ? Ag(h, r, this.componentDef.encapsulation, c)
            : Nl(h, f, wm(f)),
          M = 512;
        this.componentDef.signals
          ? (M |= 4096)
          : this.componentDef.onPush || (M |= 16);
        let L = null;
        g !== null && (L = Ps(g, c, !0));
        let k = Us(0, null, null, 1, 0, null, null, null, null, null, null),
          Y = fo(null, k, null, M, null, null, d, h, c, null, L);
        Cs(Y);
        let Ke,
          tr,
          nr = null;
        try {
          let be = this.componentDef,
            mt,
            Go = null;
          be.findHostDirectiveDefs
            ? ((mt = []),
              (Go = new Map()),
              be.findHostDirectiveDefs(be, mt, Go),
              mt.push(be))
            : (mt = [be]);
          let Nf = Cm(Y, g);
          (nr = Im(Nf, g, be, mt, Y, d, h)),
            (tr = ys(k, Oe)),
            g && Sm(h, be, g, r),
            n !== void 0 && Mm(tr, this.ngContentSelectors, n),
            (Ke = bm(nr, be, mt, Go, Y, [_m])),
            zs(k, Y, null);
        } catch (be) {
          throw (nr !== null && zi(nr), zi(Y), be);
        } finally {
          Is();
        }
        return new Xi(this.componentType, Ke, Ns(tr, Y), Y, tr);
      } finally {
        R(i);
      }
    }
  },
  Xi = class extends Qi {
    constructor(t, n, r, o, i) {
      super(),
        (this.location = r),
        (this._rootLView = o),
        (this._tNode = i),
        (this.previousInputValues = null),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new Vt(o, void 0, !1)),
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
        Hs(i[S], i, o, t, n), this.previousInputValues.set(t, n);
        let s = zt(this._tNode.index, i);
        od(s, 1);
      }
    }
    get injector() {
      return new nt(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(t) {
      this.hostView.onDestroy(t);
    }
  };
function Cm(e, t) {
  let n = e[S],
    r = Oe;
  return (e[r] = t), ho(n, r, 2, "#host", null);
}
function Im(e, t, n, r, o, i, s) {
  let c = o[S];
  Em(r, e, t, s);
  let a = null;
  t !== null && (a = Ps(t, o[kt]));
  let u = i.rendererFactory.createRenderer(t, n),
    l = 16;
  n.signals ? (l = 4096) : n.onPush && (l = 64);
  let d = fo(o, Gl(n), null, l, o[e.index], e, i, u, null, null, a);
  return (
    c.firstCreatePass && Wi(c, e, r.length - 1), po(o, d), (o[e.index] = d)
  );
}
function Em(e, t, n, r) {
  for (let o of e) t.mergedAttrs = hs(t.mergedAttrs, o.hostAttrs);
  t.mergedAttrs !== null &&
    (Ji(t, t.mergedAttrs, !0), n !== null && Ll(r, n, t));
}
function bm(e, t, n, r, o, i) {
  let s = Ve(),
    c = o[S],
    a = xe(s, o);
  Wl(c, o, s, n, null, r);
  for (let l = 0; l < n.length; l++) {
    let d = s.directiveStart + l,
      h = Cn(o, c, d, s);
    ct(h, o);
  }
  Zl(c, o, s), a && ct(a, o);
  let u = Cn(o, c, s.directiveStart + s.componentOffset, s);
  if (((e[de] = o[de] = u), i !== null)) for (let l of i) l(u, t);
  return Ul(c, s, o), u;
}
function Sm(e, t, n, r) {
  if (r) Ti(e, n, ["ng-version", "18.2.7"]);
  else {
    let { attrs: o, classes: i } = Vh(t.selectors[0]);
    o && Ti(e, n, o), i && i.length > 0 && kl(e, n, i.join(" "));
  }
}
function Mm(e, t, n) {
  let r = (e.projection = []);
  for (let o = 0; o < t.length; o++) {
    let i = n[o];
    r.push(i != null ? Array.from(i) : null);
  }
}
function _m() {
  let e = Ve();
  Ss(B()[S], e);
}
var mo = (() => {
  class e {
    static {
      this.__NG_ELEMENT_ID__ = Tm;
    }
  }
  return e;
})();
function Tm() {
  let e = Ve();
  return Nm(e, B());
}
var xm = mo,
  ad = class extends xm {
    constructor(t, n, r) {
      super(),
        (this._lContainer = t),
        (this._hostTNode = n),
        (this._hostLView = r);
    }
    get element() {
      return Ns(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new nt(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let t = Ms(this._hostTNode, this._hostLView);
      if (ol(t)) {
        let n = Lr(t, this._hostLView),
          r = kr(t),
          o = n[S].data[r + 8];
        return new nt(o, n);
      } else return new nt(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(t) {
      let n = Xc(this._lContainer);
      return (n !== null && n[t]) || null;
    }
    get length() {
      return this._lContainer.length - J;
    }
    createEmbeddedView(t, n, r) {
      let o, i;
      typeof r == "number"
        ? (o = r)
        : r != null && ((o = r.index), (i = r.injector));
      let s = zr(this._lContainer, t.ssrId),
        c = t.createEmbeddedViewImpl(n || {}, i, s);
      return this.insertImpl(c, o, Ur(this._hostTNode, s)), c;
    }
    createComponent(t, n, r, o, i) {
      let s = t && !tp(t),
        c;
      if (s) c = n;
      else {
        let g = n || {};
        (c = g.index),
          (r = g.injector),
          (o = g.projectableNodes),
          (i = g.environmentInjector || g.ngModuleRef);
      }
      let a = s ? t : new En(rt(t)),
        u = r || this.parentInjector;
      if (!i && a.ngModule == null) {
        let M = (s ? u : this.parentInjector).get(he, null);
        M && (i = M);
      }
      let l = rt(a.componentType ?? {}),
        d = zr(this._lContainer, l?.id ?? null),
        h = d?.firstChild ?? null,
        f = a.create(u, o, h, i);
      return this.insertImpl(f.hostView, c, Ur(this._hostTNode, d)), f;
    }
    insert(t, n) {
      return this.insertImpl(t, n, !0);
    }
    insertImpl(t, n, r) {
      let o = t._lView;
      if (ap(o)) {
        let c = this.indexOf(t);
        if (c !== -1) this.detach(c);
        else {
          let a = o[X],
            u = new ad(a, a[Ie], a[X]);
          u.detach(u.indexOf(t));
        }
      }
      let i = this._adjustIndex(n),
        s = this._lContainer;
      return Gs(s, o, i, r), t.attachToViewContainerRef(), yu(bi(s), i, t), t;
    }
    move(t, n) {
      return this.insert(t, n);
    }
    indexOf(t) {
      let n = Xc(this._lContainer);
      return n !== null ? n.indexOf(t) : -1;
    }
    remove(t) {
      let n = this._adjustIndex(t, -1),
        r = In(this._lContainer, n);
      r && (Ar(bi(this._lContainer), n), co(r[S], r));
    }
    detach(t) {
      let n = this._adjustIndex(t, -1),
        r = In(this._lContainer, n);
      return r && Ar(bi(this._lContainer), n) != null ? new Vt(r) : null;
    }
    _adjustIndex(t, n = 0) {
      return t ?? this.length + n;
    }
  };
function Xc(e) {
  return e[Or];
}
function bi(e) {
  return e[Or] || (e[Or] = []);
}
function Nm(e, t) {
  let n,
    r = t[e.index];
  return (
    je(r) ? (n = r) : ((n = Yl(r, t, null, e)), (t[e.index] = n), po(t, n)),
    Rm(n, t, e, r),
    new ad(n, e, t)
  );
}
function Am(e, t) {
  let n = e[se],
    r = n.createComment(""),
    o = xe(t, e),
    i = Pl(n, o);
  return Br(n, i, r, wg(n, o), !1), r;
}
var Rm = Fm,
  Om = () => !1;
function Pm(e, t, n) {
  return Om(e, t, n);
}
function Fm(e, t, n, r) {
  if (e[ot]) return;
  let o;
  n.type & 8 ? (o = Pe(r)) : (o = Am(t, n)), (e[ot] = o);
}
var eu = new Set();
function vo(e) {
  eu.has(e) ||
    (eu.add(e),
    performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
}
var Ye = class {},
  bn = class {};
var es = class extends Ye {
    constructor(t, n, r, o = !0) {
      super(),
        (this.ngModuleType = t),
        (this._parent = n),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new qr(this));
      let i = Mu(t);
      (this._bootstrapComponents = xl(i.bootstrap)),
        (this._r3Injector = pl(
          t,
          n,
          [
            { provide: Ye, useValue: this },
            { provide: Bt, useValue: this.componentFactoryResolver },
            ...r,
          ],
          ie(t),
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
  ts = class extends bn {
    constructor(t) {
      super(), (this.moduleType = t);
    }
    create(t) {
      return new es(this.moduleType, t, []);
    }
  };
var Wr = class extends Ye {
  constructor(t) {
    super(),
      (this.componentFactoryResolver = new qr(this)),
      (this.instance = null);
    let n = new mn(
      [
        ...t.providers,
        { provide: Ye, useValue: this },
        { provide: Bt, useValue: this.componentFactoryResolver },
      ],
      t.parent || vs(),
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
function qs(e, t, n = null) {
  return new Wr({
    providers: e,
    parent: t,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector;
}
function cd(e, t, n) {
  return (e[t] = n);
}
function ud(e, t) {
  return e[t];
}
function Ht(e, t, n) {
  let r = e[t];
  return Object.is(r, n) ? !1 : ((e[t] = n), !0);
}
function tu(e, t, n, r) {
  let o = Ht(e, t, n);
  return Ht(e, t + 1, r) || o;
}
function km(e, t, n, r, o, i) {
  let s = tu(e, t, n, r);
  return tu(e, t + 2, o, i) || s;
}
function Lm(e) {
  return (e.flags & 32) === 32;
}
function jm(e, t, n, r, o, i, s, c, a) {
  let u = t.consts,
    l = ho(t, e, 4, s || null, c || null);
  ql(t, n, l, Dn(u, a)), Ss(t, l);
  let d = (l.tView = Us(
    2,
    l,
    r,
    o,
    i,
    t.directiveRegistry,
    t.pipeRegistry,
    null,
    t.schemas,
    u,
    null,
  ));
  return (
    t.queries !== null &&
      (t.queries.template(t, l), (d.queries = t.queries.embeddedTView(l))),
    l
  );
}
function nu(e, t, n, r, o, i, s, c, a, u) {
  let l = n + Oe,
    d = t.firstCreatePass ? jm(l, t, e, r, o, i, s, c, a) : t.data[l];
  _n(d, !1);
  let h = Vm(t, e, d, n);
  Es() && Vs(t, e, h, d), ct(h, e);
  let f = Yl(h, e, h, d);
  return (
    (e[l] = f),
    po(e, f),
    Pm(f, d, e),
    Fu(d) && Hl(t, e, d),
    a != null && zl(e, d, u),
    d
  );
}
var Vm = $m;
function $m(e, t, n, r) {
  return bs(!0), t[se].createComment("");
}
var fn = (function (e) {
    return (
      (e[(e.EarlyRead = 0)] = "EarlyRead"),
      (e[(e.Write = 1)] = "Write"),
      (e[(e.MixedReadWrite = 2)] = "MixedReadWrite"),
      (e[(e.Read = 3)] = "Read"),
      e
    );
  })(fn || {}),
  Bm = (() => {
    class e {
      constructor() {
        this.impl = null;
      }
      execute() {
        this.impl?.execute();
      }
      static {
        this.ɵprov = w({
          token: e,
          providedIn: "root",
          factory: () => new e(),
        });
      }
    }
    return e;
  })(),
  ru = class e {
    constructor() {
      (this.ngZone = p($)),
        (this.scheduler = p($t)),
        (this.errorHandler = p(Fe, { optional: !0 })),
        (this.sequences = new Set()),
        (this.deferredRegistrations = new Set()),
        (this.executing = !1);
    }
    static {
      this.PHASES = [fn.EarlyRead, fn.Write, fn.MixedReadWrite, fn.Read];
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
      this.ɵprov = w({ token: e, providedIn: "root", factory: () => new e() });
    }
  };
function Um(e, t, n, r) {
  return Ht(e, ws(), n) ? t + ls(n) + r : xn;
}
function Ws(e, t, n) {
  let r = B(),
    o = ws();
  if (Ht(r, o, t)) {
    let i = Gt(),
      s = Ip();
    Lg(i, s, r, e, t, r[se], n, !1);
  }
  return Ws;
}
function ou(e, t, n, r, o) {
  let i = t.inputs,
    s = o ? "class" : "style";
  Hs(e, n, i[s], s, r);
}
var ns = class {
  destroy(t) {}
  updateValue(t, n) {}
  swap(t, n) {
    let r = Math.min(t, n),
      o = Math.max(t, n),
      i = this.detach(o);
    if (o - r > 1) {
      let s = this.detach(r);
      this.attach(r, i), this.attach(o, s);
    } else this.attach(r, i);
  }
  move(t, n) {
    this.attach(n, this.detach(t));
  }
};
function Si(e, t, n, r, o) {
  return e === n && Object.is(t, r) ? 1 : Object.is(o(e, t), o(n, r)) ? -1 : 0;
}
function Hm(e, t, n) {
  let r,
    o,
    i = 0,
    s = e.length - 1,
    c = void 0;
  if (Array.isArray(t)) {
    let a = t.length - 1;
    for (; i <= s && i <= a; ) {
      let u = e.at(i),
        l = t[i],
        d = Si(i, u, i, l, n);
      if (d !== 0) {
        d < 0 && e.updateValue(i, l), i++;
        continue;
      }
      let h = e.at(s),
        f = t[a],
        g = Si(s, h, a, f, n);
      if (g !== 0) {
        g < 0 && e.updateValue(s, f), s--, a--;
        continue;
      }
      let M = n(i, u),
        L = n(s, h),
        k = n(i, l);
      if (Object.is(k, L)) {
        let Y = n(a, f);
        Object.is(Y, M)
          ? (e.swap(i, s), e.updateValue(s, f), a--, s--)
          : e.move(s, i),
          e.updateValue(i, l),
          i++;
        continue;
      }
      if (((r ??= new Zr()), (o ??= su(e, i, s, n)), rs(e, r, i, k)))
        e.updateValue(i, l), i++, s++;
      else if (o.has(k)) r.set(M, e.detach(i)), s--;
      else {
        let Y = e.create(i, t[i]);
        e.attach(i, Y), i++, s++;
      }
    }
    for (; i <= a; ) iu(e, r, n, i, t[i]), i++;
  } else if (t != null) {
    let a = t[Symbol.iterator](),
      u = a.next();
    for (; !u.done && i <= s; ) {
      let l = e.at(i),
        d = u.value,
        h = Si(i, l, i, d, n);
      if (h !== 0) h < 0 && e.updateValue(i, d), i++, (u = a.next());
      else {
        (r ??= new Zr()), (o ??= su(e, i, s, n));
        let f = n(i, d);
        if (rs(e, r, i, f)) e.updateValue(i, d), i++, s++, (u = a.next());
        else if (!o.has(f))
          e.attach(i, e.create(i, d)), i++, s++, (u = a.next());
        else {
          let g = n(i, l);
          r.set(g, e.detach(i)), s--;
        }
      }
    }
    for (; !u.done; ) iu(e, r, n, e.length, u.value), (u = a.next());
  }
  for (; i <= s; ) e.destroy(e.detach(s--));
  r?.forEach((a) => {
    e.destroy(a);
  });
}
function rs(e, t, n, r) {
  return t !== void 0 && t.has(r)
    ? (e.attach(n, t.get(r)), t.delete(r), !0)
    : !1;
}
function iu(e, t, n, r, o) {
  if (rs(e, t, r, n(r, o))) e.updateValue(r, o);
  else {
    let i = e.create(r, o);
    e.attach(r, i);
  }
}
function su(e, t, n, r) {
  let o = new Set();
  for (let i = t; i <= n; i++) o.add(r(i, e.at(i)));
  return o;
}
var Zr = class {
  constructor() {
    (this.kvMap = new Map()), (this._vMap = void 0);
  }
  has(t) {
    return this.kvMap.has(t);
  }
  delete(t) {
    if (!this.has(t)) return !1;
    let n = this.kvMap.get(t);
    return (
      this._vMap !== void 0 && this._vMap.has(n)
        ? (this.kvMap.set(t, this._vMap.get(n)), this._vMap.delete(n))
        : this.kvMap.delete(t),
      !0
    );
  }
  get(t) {
    return this.kvMap.get(t);
  }
  set(t, n) {
    if (this.kvMap.has(t)) {
      let r = this.kvMap.get(t);
      this._vMap === void 0 && (this._vMap = new Map());
      let o = this._vMap;
      for (; o.has(r); ) r = o.get(r);
      o.set(r, n);
    } else this.kvMap.set(t, n);
  }
  forEach(t) {
    for (let [n, r] of this.kvMap)
      if ((t(r, n), this._vMap !== void 0)) {
        let o = this._vMap;
        for (; o.has(r); ) (r = o.get(r)), t(r, n);
      }
  }
};
var os = class {
  constructor(t, n, r) {
    (this.lContainer = t), (this.$implicit = n), (this.$index = r);
  }
  get $count() {
    return this.lContainer.length - J;
  }
};
var is = class {
  constructor(t, n, r) {
    (this.hasEmptyBlock = t), (this.trackByFn = n), (this.liveCollection = r);
  }
};
function ld(e, t, n, r, o, i, s, c, a, u, l, d, h) {
  vo("NgControlFlow");
  let f = B(),
    g = Gt(),
    M = a !== void 0,
    L = B(),
    k = c ? s.bind(L[Ce][de]) : s,
    Y = new is(M, k);
  (L[Oe + e] = Y),
    nu(f, g, e + 1, t, n, r, o, Dn(g.consts, i)),
    M && nu(f, g, e + 2, a, u, l, d, Dn(g.consts, h));
}
var ss = class extends ns {
  constructor(t, n, r) {
    super(),
      (this.lContainer = t),
      (this.hostLView = n),
      (this.templateTNode = r),
      (this.operationsCounter = void 0),
      (this.needsIndexUpdate = !1);
  }
  get length() {
    return this.lContainer.length - J;
  }
  at(t) {
    return this.getLView(t)[de].$implicit;
  }
  attach(t, n) {
    let r = n[vn];
    (this.needsIndexUpdate ||= t !== this.length),
      Gs(this.lContainer, n, t, Ur(this.templateTNode, r));
  }
  detach(t) {
    return (
      (this.needsIndexUpdate ||= t !== this.length - 1), zm(this.lContainer, t)
    );
  }
  create(t, n) {
    let r = zr(this.lContainer, this.templateTNode.tView.ssrId),
      o = Kl(
        this.hostLView,
        this.templateTNode,
        new os(this.lContainer, n, t),
        { dehydratedView: r },
      );
    return this.operationsCounter?.recordCreate(), o;
  }
  destroy(t) {
    co(t[S], t), this.operationsCounter?.recordDestroy();
  }
  updateValue(t, n) {
    this.getLView(t)[de].$implicit = n;
  }
  reset() {
    (this.needsIndexUpdate = !1), this.operationsCounter?.reset();
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let t = 0; t < this.length; t++) this.getLView(t)[de].$index = t;
  }
  getLView(t) {
    return Gm(this.lContainer, t);
  }
};
function dd(e) {
  let t = R(null),
    n = so();
  try {
    let r = B(),
      o = r[S],
      i = r[n],
      s = n + 1,
      c = au(r, s);
    if (i.liveCollection === void 0) {
      let u = cu(o, s);
      i.liveCollection = new ss(c, r, u);
    } else i.liveCollection.reset();
    let a = i.liveCollection;
    if ((Hm(a, e, i.trackByFn), a.updateIndexes(), i.hasEmptyBlock)) {
      let u = ws(),
        l = a.length === 0;
      if (Ht(r, u, l)) {
        let d = n + 2,
          h = au(r, d);
        if (l) {
          let f = cu(o, d),
            g = zr(h, f.tView.ssrId),
            M = Kl(r, f, void 0, { dehydratedView: g });
          Gs(h, M, 0, Ur(f, g));
        } else rm(h, 0);
      }
    }
  } finally {
    R(t);
  }
}
function au(e, t) {
  return e[t];
}
function zm(e, t) {
  return In(e, t);
}
function Gm(e, t) {
  return nm(e, t);
}
function cu(e, t) {
  return ys(e, t);
}
function qm(e, t, n, r, o, i) {
  let s = t.consts,
    c = Dn(s, o),
    a = ho(t, e, 2, r, c);
  return (
    ql(t, n, a, Dn(s, i)),
    a.attrs !== null && Ji(a, a.attrs, !1),
    a.mergedAttrs !== null && Ji(a, a.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, a),
    a
  );
}
function z(e, t, n, r) {
  let o = B(),
    i = Gt(),
    s = Oe + e,
    c = o[se],
    a = i.firstCreatePass ? qm(s, i, o, t, n, r) : i.data[s],
    u = Wm(i, o, a, c, t, e);
  o[s] = u;
  let l = Fu(a);
  return (
    _n(a, !0),
    Ll(c, u, a),
    !Lm(a) && Es() && Vs(i, o, u, a),
    up() === 0 && ct(u, o),
    lp(),
    l && (Hl(i, o, a), Ul(i, a, o)),
    r !== null && zl(o, a),
    z
  );
}
function ee() {
  let e = Ve();
  Wu() ? mp() : ((e = e.parent), _n(e, !1));
  let t = e;
  hp(t) && pp(), dp();
  let n = Gt();
  return (
    n.firstCreatePass && (Ss(n, e), Pu(e) && n.queries.elementEnd(e)),
    t.classesWithoutHost != null &&
      Tp(t) &&
      ou(n, t, B(), t.classesWithoutHost, !0),
    t.stylesWithoutHost != null &&
      xp(t) &&
      ou(n, t, B(), t.stylesWithoutHost, !1),
    ee
  );
}
function ne(e, t, n, r) {
  return z(e, t, n, r), ee(), ne;
}
var Wm = (e, t, n, r, o, i) => (bs(!0), Nl(r, o, bp()));
var Yr = "en-US";
var Zm = Yr;
function Ym(e) {
  typeof e == "string" && (Zm = e.toLowerCase().replace(/_/g, "-"));
}
function yo(e, t = "") {
  let n = B(),
    r = Gt(),
    o = e + Oe,
    i = r.firstCreatePass ? ho(r, o, 1, t, null) : r.data[o],
    s = Qm(r, n, i, t, e);
  (n[o] = s), Es() && Vs(r, n, s, i), _n(i, !1);
}
var Qm = (e, t, n, r, o) => (bs(!0), lg(t[se], r));
function Zs(e) {
  return Do("", e, ""), Zs;
}
function Do(e, t, n) {
  let r = B(),
    o = Um(r, e, t, n);
  return o !== xn && Jg(r, so(), o), Do;
}
var Km = (() => {
  class e {
    constructor(n) {
      (this._injector = n), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let r = xu(!1, n.type),
          o =
            r.length > 0
              ? qs([r], this._injector, `Standalone[${n.type.name}]`)
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
      this.ɵprov = w({
        token: e,
        providedIn: "environment",
        factory: () => new e(T(he)),
      });
    }
  }
  return e;
})();
function wo(e) {
  vo("NgStandalone"),
    (e.getStandaloneInjector = (t) =>
      t.get(Km).getOrCreateStandaloneInjector(e));
}
function Yt(e, t, n) {
  let r = Yu() + e,
    o = B();
  return o[r] === xn ? cd(o, r, n ? t.call(n) : t()) : ud(o, r);
}
function fd(e, t, n, r, o, i, s, c) {
  let a = Yu() + e,
    u = B(),
    l = km(u, a, n, r, o, i);
  return Ht(u, a + 4, s) || l
    ? cd(u, a + 5, c ? t.call(c, n, r, o, i, s) : t(n, r, o, i, s))
    : ud(u, a + 5);
}
var Co = (() => {
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
      this.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "platform" });
    }
  }
  return e;
})();
var hd = new E("");
function Nn(e) {
  return !!e && typeof e.then == "function";
}
function pd(e) {
  return !!e && typeof e.subscribe == "function";
}
var gd = new E(""),
  md = (() => {
    class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((n, r) => {
            (this.resolve = n), (this.reject = r);
          })),
          (this.appInits = p(gd, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let o of this.appInits) {
          let i = o();
          if (Nn(i)) n.push(i);
          else if (pd(i)) {
            let s = new Promise((c, a) => {
              i.subscribe({ complete: c, error: a });
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
        this.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  Ys = new E("");
function Jm() {
  Qa(() => {
    throw new v(600, !1);
  });
}
function Xm(e) {
  return e.isBoundToModule;
}
var ev = 10;
function tv(e, t, n) {
  try {
    let r = n();
    return Nn(r)
      ? r.catch((o) => {
          throw (t.runOutsideAngular(() => e.handleError(o)), o);
        })
      : r;
  } catch (r) {
    throw (t.runOutsideAngular(() => e.handleError(r)), r);
  }
}
var lt = (() => {
  class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = p(Yp)),
        (this.afterRenderManager = p(Bm)),
        (this.zonelessEnabled = p(go)),
        (this.dirtyFlags = 0),
        (this.deferredDirtyFlags = 0),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new Q()),
        (this.afterTick = new Q()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = p(Wt).hasPendingTasks.pipe(_((n) => !n))),
        (this._injector = p(he));
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
      let o = n instanceof Gr;
      if (!this._injector.get(md).done) {
        let h = !o && Su(n),
          f = !1;
        throw new v(405, f);
      }
      let s;
      o ? (s = n) : (s = this._injector.get(Bt).resolveComponentFactory(n)),
        this.componentTypes.push(s.componentType);
      let c = Xm(s) ? void 0 : this._injector.get(Ye),
        a = r || s.selector,
        u = s.create(at.NULL, [], a, c),
        l = u.location.nativeElement,
        d = u.injector.get(hd, null);
      return (
        d?.registerApplication(l),
        u.onDestroy(() => {
          this.detachView(u.hostView),
            _r(this.components, u),
            d?.unregisterApplication(l);
        }),
        this._loadComponent(u),
        u
      );
    }
    tick() {
      this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick();
    }
    _tick() {
      if (this._runningTick) throw new v(101, !1);
      let n = R(null);
      try {
        (this._runningTick = !0), this.synchronize();
      } catch (r) {
        this.internalErrorHandler(r);
      } finally {
        (this._runningTick = !1), R(n), this.afterTick.next();
      }
    }
    synchronize() {
      let n = null;
      this._injector.destroyed ||
        (n = this._injector.get(Ut, null, { optional: !0 })),
        (this.dirtyFlags |= this.deferredDirtyFlags),
        (this.deferredDirtyFlags = 0);
      let r = 0;
      for (; this.dirtyFlags !== 0 && r++ < ev; ) this.synchronizeOnce(n);
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
          nv(o, i, r, this.zonelessEnabled);
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
      if (this.allViews.some(({ _lView: n }) => oo(n))) {
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
      _r(this._views, r), r.detachFromAppRef();
    }
    _loadComponent(n) {
      this.attachView(n.hostView), this.tick(), this.components.push(n);
      let r = this._injector.get(Ys, []);
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
        this._destroyListeners.push(n), () => _r(this._destroyListeners, n)
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
      this.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
  }
  return e;
})();
function _r(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function nv(e, t, n, r) {
  if (!n && !oo(e)) return;
  ed(e, t, n && !r ? 0 : 1);
}
var as = class {
    constructor(t, n) {
      (this.ngModuleFactory = t), (this.componentFactories = n);
    }
  },
  Qs = (() => {
    class e {
      compileModuleSync(n) {
        return new ts(n);
      }
      compileModuleAsync(n) {
        return Promise.resolve(this.compileModuleSync(n));
      }
      compileModuleAndAllComponentsSync(n) {
        let r = this.compileModuleSync(n),
          o = Mu(n),
          i = xl(o.declarations).reduce((s, c) => {
            let a = rt(c);
            return a && s.push(new En(a)), s;
          }, []);
        return new as(r, i);
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
        this.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })();
var rv = (() => {
    class e {
      constructor() {
        (this.zone = p($)),
          (this.changeDetectionScheduler = p($t)),
          (this.applicationRef = p(lt));
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
        this.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  ov = new E("", { factory: () => !1 });
function vd({
  ngZoneFactory: e,
  ignoreChangesOutsideZone: t,
  scheduleInRootZone: n,
}) {
  return (
    (e ??= () => new $(j(m({}, Dd()), { scheduleInRootZone: n }))),
    [
      { provide: $, useFactory: e },
      {
        provide: Ft,
        multi: !0,
        useFactory: () => {
          let r = p(rv, { optional: !0 });
          return () => r.initialize();
        },
      },
      {
        provide: Ft,
        multi: !0,
        useFactory: () => {
          let r = p(iv);
          return () => {
            r.initialize();
          };
        },
      },
      t === !0 ? { provide: id, useValue: !0 } : [],
      { provide: sd, useValue: n ?? gl },
    ]
  );
}
function yd(e) {
  let t = e?.ignoreChangesOutsideZone,
    n = e?.scheduleInRootZone,
    r = vd({
      ngZoneFactory: () => {
        let o = Dd(e);
        return (
          (o.scheduleInRootZone = n),
          o.shouldCoalesceEventChangeDetection && vo("NgZone_CoalesceEvent"),
          new $(o)
        );
      },
      ignoreChangesOutsideZone: t,
      scheduleInRootZone: n,
    });
  return Xr([{ provide: ov, useValue: !0 }, { provide: go, useValue: !1 }, r]);
}
function Dd(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  };
}
var iv = (() => {
  class e {
    constructor() {
      (this.subscription = new V()),
        (this.initialized = !1),
        (this.zone = p($)),
        (this.pendingTasks = p(Wt));
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
              $.assertNotInAngularZone(),
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
            $.assertInAngularZone(), (n ??= this.pendingTasks.add());
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
      this.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
  }
  return e;
})();
var sv = (() => {
  class e {
    constructor() {
      (this.appRef = p(lt)),
        (this.taskService = p(Wt)),
        (this.ngZone = p($)),
        (this.zonelessEnabled = p(go)),
        (this.disableScheduling = p(id, { optional: !0 }) ?? !1),
        (this.zoneIsDefined = typeof Zone < "u" && !!Zone.root.run),
        (this.schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }]),
        (this.subscriptions = new V()),
        (this.angularZoneId = this.zoneIsDefined
          ? this.ngZone._inner?.get(Vr)
          : null),
        (this.scheduleInRootZone =
          !this.zonelessEnabled &&
          this.zoneIsDefined &&
          (p(sd, { optional: !0 }) ?? !1)),
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
          (this.ngZone instanceof Hi || !this.zoneIsDefined));
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
      let r = this.useMicrotaskScheduler ? zc : vl;
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
          Zone.current.get(Vr + this.angularZoneId))
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
        zc(() => {
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
      this.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
  }
  return e;
})();
function av() {
  return (typeof $localize < "u" && $localize.locale) || Yr;
}
var Ks = new E("", {
  providedIn: "root",
  factory: () => p(Ks, b.Optional | b.SkipSelf) || av(),
});
var wd = new E("");
function Er(e) {
  return !!e.platformInjector;
}
function cv(e) {
  let t = Er(e) ? e.r3Injector : e.moduleRef.injector,
    n = t.get($);
  return n.run(() => {
    Er(e)
      ? e.r3Injector.resolveInjectorInitializers()
      : e.moduleRef.resolveInjectorInitializers();
    let r = t.get(Fe, null),
      o;
    if (
      (n.runOutsideAngular(() => {
        o = n.onError.subscribe({
          next: (i) => {
            r.handleError(i);
          },
        });
      }),
      Er(e))
    ) {
      let i = () => t.destroy(),
        s = e.platformInjector.get(wd);
      s.add(i),
        t.onDestroy(() => {
          o.unsubscribe(), s.delete(i);
        });
    } else
      e.moduleRef.onDestroy(() => {
        _r(e.allPlatformModules, e.moduleRef), o.unsubscribe();
      });
    return tv(r, n, () => {
      let i = t.get(md);
      return (
        i.runInitializers(),
        i.donePromise.then(() => {
          let s = t.get(Ks, Yr);
          if ((Ym(s || Yr), Er(e))) {
            let c = t.get(lt);
            return (
              e.rootComponent !== void 0 && c.bootstrap(e.rootComponent), c
            );
          } else return uv(e.moduleRef, e.allPlatformModules), e.moduleRef;
        })
      );
    });
  });
}
function uv(e, t) {
  let n = e.injector.get(lt);
  if (e._bootstrapComponents.length > 0)
    e._bootstrapComponents.forEach((r) => n.bootstrap(r));
  else if (e.instance.ngDoBootstrap) e.instance.ngDoBootstrap(n);
  else throw new v(-403, !1);
  t.push(e);
}
var Tr = null;
function lv(e = [], t) {
  return at.create({
    name: t,
    providers: [
      { provide: eo, useValue: "platform" },
      { provide: wd, useValue: new Set([() => (Tr = null)]) },
      ...e,
    ],
  });
}
function dv(e = []) {
  if (Tr) return Tr;
  let t = lv(e);
  return (Tr = t), Jm(), fv(t), t;
}
function fv(e) {
  e.get(Rs, null)?.forEach((n) => n());
}
var An = (() => {
  class e {
    static {
      this.__NG_ELEMENT_ID__ = hv;
    }
  }
  return e;
})();
function hv(e) {
  return pv(Ve(), B(), (e & 16) === 16);
}
function pv(e, t, n) {
  if (no(e) && !n) {
    let r = zt(e.index, t);
    return new Vt(r, r);
  } else if (e.type & 175) {
    let r = t[Ce];
    return new Vt(r, t);
  }
  return null;
}
function Cd(e) {
  try {
    let { rootComponent: t, appProviders: n, platformProviders: r } = e,
      o = dv(r),
      i = [vd({}), { provide: $t, useExisting: sv }, ...(n || [])],
      s = new Wr({
        providers: i,
        parent: o,
        debugName: "",
        runEnvironmentInitializers: !1,
      });
    return cv({
      r3Injector: s.injector,
      platformInjector: o,
      rootComponent: t,
    });
  } catch (t) {
    return Promise.reject(t);
  }
}
var Td = null;
function Qt() {
  return Td;
}
function xd(e) {
  Td ??= e;
}
var Eo = class {};
var pe = new E(""),
  Nd = (() => {
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
        this.ɵprov = w({
          token: e,
          factory: () => p(yv),
          providedIn: "platform",
        });
      }
    }
    return e;
  })();
var yv = (() => {
  class e extends Nd {
    constructor() {
      super(),
        (this._doc = p(pe)),
        (this._location = window.location),
        (this._history = window.history);
    }
    getBaseHrefFromDOM() {
      return Qt().getBaseHref(this._doc);
    }
    onPopState(n) {
      let r = Qt().getGlobalEventTarget(this._doc, "window");
      return (
        r.addEventListener("popstate", n, !1),
        () => r.removeEventListener("popstate", n)
      );
    }
    onHashChange(n) {
      let r = Qt().getGlobalEventTarget(this._doc, "window");
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
      this.ɵprov = w({
        token: e,
        factory: () => new e(),
        providedIn: "platform",
      });
    }
  }
  return e;
})();
function Ad(e, t) {
  if (e.length == 0) return t;
  if (t.length == 0) return e;
  let n = 0;
  return (
    e.endsWith("/") && n++,
    t.startsWith("/") && n++,
    n == 2 ? e + t.substring(1) : n == 1 ? e + t : e + "/" + t
  );
}
function Id(e) {
  let t = e.match(/#|\?|$/),
    n = (t && t.index) || e.length,
    r = n - (e[n - 1] === "/" ? 1 : 0);
  return e.slice(0, r) + e.slice(n);
}
function dt(e) {
  return e && e[0] !== "?" ? "?" + e : e;
}
var So = (() => {
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
        this.ɵprov = w({ token: e, factory: () => p(Rd), providedIn: "root" });
      }
    }
    return e;
  })(),
  Dv = new E(""),
  Rd = (() => {
    class e extends So {
      constructor(n, r) {
        super(),
          (this._platformLocation = n),
          (this._removeListenerFns = []),
          (this._baseHref =
            r ??
            this._platformLocation.getBaseHrefFromDOM() ??
            p(pe).location?.origin ??
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
        return Ad(this._baseHref, n);
      }
      path(n = !1) {
        let r =
            this._platformLocation.pathname + dt(this._platformLocation.search),
          o = this._platformLocation.hash;
        return o && n ? `${r}${o}` : r;
      }
      pushState(n, r, o, i) {
        let s = this.prepareExternalUrl(o + dt(i));
        this._platformLocation.pushState(n, r, s);
      }
      replaceState(n, r, o, i) {
        let s = this.prepareExternalUrl(o + dt(i));
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
          return new (r || e)(T(Nd), T(Dv, 8));
        };
      }
      static {
        this.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })();
var Rn = (() => {
  class e {
    constructor(n) {
      (this._subject = new K()),
        (this._urlChangeListeners = []),
        (this._urlChangeSubscription = null),
        (this._locationStrategy = n);
      let r = this._locationStrategy.getBaseHref();
      (this._basePath = Iv(Id(Ed(r)))),
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
      return this.path() == this.normalize(n + dt(r));
    }
    normalize(n) {
      return e.stripTrailingSlash(Cv(this._basePath, Ed(n)));
    }
    prepareExternalUrl(n) {
      return (
        n && n[0] !== "/" && (n = "/" + n),
        this._locationStrategy.prepareExternalUrl(n)
      );
    }
    go(n, r = "", o = null) {
      this._locationStrategy.pushState(o, "", n, r),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(n + dt(r)), o);
    }
    replaceState(n, r = "", o = null) {
      this._locationStrategy.replaceState(o, "", n, r),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(n + dt(r)), o);
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
      this.normalizeQueryParams = dt;
    }
    static {
      this.joinWithSlash = Ad;
    }
    static {
      this.stripTrailingSlash = Id;
    }
    static {
      this.ɵfac = function (r) {
        return new (r || e)(T(So));
      };
    }
    static {
      this.ɵprov = w({ token: e, factory: () => wv(), providedIn: "root" });
    }
  }
  return e;
})();
function wv() {
  return new Rn(T(So));
}
function Cv(e, t) {
  if (!e || !t.startsWith(e)) return t;
  let n = t.substring(e.length);
  return n === "" || ["/", ";", "?", "#"].includes(n[0]) ? n : t;
}
function Ed(e) {
  return e.replace(/\/index.html$/, "");
}
function Iv(e) {
  if (new RegExp("^(https?:)?//").test(e)) {
    let [, n] = e.split(/\/\/[^\/]+/);
    return n;
  }
  return e;
}
function Od(e, t) {
  t = encodeURIComponent(t);
  for (let n of e.split(";")) {
    let r = n.indexOf("="),
      [o, i] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
    if (o.trim() === t) return decodeURIComponent(i);
  }
  return null;
}
var Pd = "browser",
  Ev = "server";
function Js(e) {
  return e === Ev;
}
var bo = class {};
var ta = class extends Eo {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  na = class e extends ta {
    static makeCurrent() {
      xd(new e());
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
      let n = Sv();
      return n == null ? null : Mv(n);
    }
    resetBaseElement() {
      On = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(t) {
      return Od(document.cookie, t);
    }
  },
  On = null;
function Sv() {
  return (
    (On = On || document.querySelector("base")),
    On ? On.getAttribute("href") : null
  );
}
function Mv(e) {
  return new URL(e, document.baseURI).pathname;
}
var _v = (() => {
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
        this.ɵprov = w({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  ra = new E(""),
  jd = (() => {
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
          return new (r || e)(T(ra), T($));
        };
      }
      static {
        this.ɵprov = w({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  Mo = class {
    constructor(t) {
      this._doc = t;
    }
  },
  Xs = "ng-app-id",
  Vd = (() => {
    class e {
      constructor(n, r, o, i = {}) {
        (this.doc = n),
          (this.appId = r),
          (this.nonce = o),
          (this.platformId = i),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = Js(i)),
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
        let n = this.doc.head?.querySelectorAll(`style[${Xs}="${this.appId}"]`);
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
        if (i?.parentNode === n) return o.delete(r), i.removeAttribute(Xs), i;
        {
          let s = this.doc.createElement("style");
          return (
            this.nonce && s.setAttribute("nonce", this.nonce),
            (s.textContent = r),
            this.platformIsServer && s.setAttribute(Xs, this.appId),
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
          return new (r || e)(T(pe), T(As), T(Os, 8), T(Zt));
        };
      }
      static {
        this.ɵprov = w({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  ea = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/Math/MathML",
  },
  ia = /%COMP%/g,
  $d = "%COMP%",
  Tv = `_nghost-${$d}`,
  xv = `_ngcontent-${$d}`,
  Nv = !0,
  Av = new E("", { providedIn: "root", factory: () => Nv });
function Rv(e) {
  return xv.replace(ia, e);
}
function Ov(e) {
  return Tv.replace(ia, e);
}
function Bd(e, t) {
  return t.map((n) => n.replace(ia, e));
}
var Fd = (() => {
    class e {
      constructor(n, r, o, i, s, c, a, u = null) {
        (this.eventManager = n),
          (this.sharedStylesHost = r),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = i),
          (this.doc = s),
          (this.platformId = c),
          (this.ngZone = a),
          (this.nonce = u),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = Js(c)),
          (this.defaultRenderer = new Pn(n, s, a, this.platformIsServer));
      }
      createRenderer(n, r) {
        if (!n || !r) return this.defaultRenderer;
        this.platformIsServer &&
          r.encapsulation === _e.ShadowDom &&
          (r = j(m({}, r), { encapsulation: _e.Emulated }));
        let o = this.getOrCreateRenderer(n, r);
        return (
          o instanceof _o
            ? o.applyToHost(n)
            : o instanceof Fn && o.applyStyles(),
          o
        );
      }
      getOrCreateRenderer(n, r) {
        let o = this.rendererByCompId,
          i = o.get(r.id);
        if (!i) {
          let s = this.doc,
            c = this.ngZone,
            a = this.eventManager,
            u = this.sharedStylesHost,
            l = this.removeStylesOnCompDestroy,
            d = this.platformIsServer;
          switch (r.encapsulation) {
            case _e.Emulated:
              i = new _o(a, u, r, this.appId, l, s, c, d);
              break;
            case _e.ShadowDom:
              return new oa(a, u, n, r, s, c, this.nonce, d);
            default:
              i = new Fn(a, u, r, l, s, c, d);
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
            T(jd),
            T(Vd),
            T(As),
            T(Av),
            T(pe),
            T(Zt),
            T($),
            T(Os),
          );
        };
      }
      static {
        this.ɵprov = w({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  Pn = class {
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
        ? this.doc.createElementNS(ea[n] || n, t)
        : this.doc.createElement(t);
    }
    createComment(t) {
      return this.doc.createComment(t);
    }
    createText(t) {
      return this.doc.createTextNode(t);
    }
    appendChild(t, n) {
      (kd(t) ? t.content : t).appendChild(n);
    }
    insertBefore(t, n, r) {
      t && (kd(t) ? t.content : t).insertBefore(n, r);
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
        let i = ea[o];
        i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
      } else t.setAttribute(n, r);
    }
    removeAttribute(t, n, r) {
      if (r) {
        let o = ea[r];
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
      o & (ut.DashCase | ut.Important)
        ? t.style.setProperty(n, r, o & ut.Important ? "important" : "")
        : (t.style[n] = r);
    }
    removeStyle(t, n, r) {
      r & ut.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
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
        ((t = Qt().getGlobalEventTarget(this.doc, t)), !t)
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
function kd(e) {
  return e.tagName === "TEMPLATE" && e.content !== void 0;
}
var oa = class extends Pn {
    constructor(t, n, r, o, i, s, c, a) {
      super(t, i, s, a),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let u = Bd(o.id, o.styles);
      for (let l of u) {
        let d = document.createElement("style");
        c && d.setAttribute("nonce", c),
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
  Fn = class extends Pn {
    constructor(t, n, r, o, i, s, c, a) {
      super(t, i, s, c),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = o),
        (this.styles = a ? Bd(a, r.styles) : r.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  _o = class extends Fn {
    constructor(t, n, r, o, i, s, c, a) {
      let u = o + "-" + r.id;
      super(t, n, r, i, s, c, a, u),
        (this.contentAttr = Rv(u)),
        (this.hostAttr = Ov(u));
    }
    applyToHost(t) {
      this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
    }
    createElement(t, n) {
      let r = super.createElement(t, n);
      return super.setAttribute(r, this.contentAttr, ""), r;
    }
  },
  Pv = (() => {
    class e extends Mo {
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
          return new (r || e)(T(pe));
        };
      }
      static {
        this.ɵprov = w({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  Ld = ["alt", "control", "meta", "shift"],
  Fv = {
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
  kv = {
    alt: (e) => e.altKey,
    control: (e) => e.ctrlKey,
    meta: (e) => e.metaKey,
    shift: (e) => e.shiftKey,
  },
  Lv = (() => {
    class e extends Mo {
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
          .runOutsideAngular(() => Qt().onAndCancel(n, i.domEventName, s));
      }
      static parseEventName(n) {
        let r = n.toLowerCase().split("."),
          o = r.shift();
        if (r.length === 0 || !(o === "keydown" || o === "keyup")) return null;
        let i = e._normalizeKey(r.pop()),
          s = "",
          c = r.indexOf("code");
        if (
          (c > -1 && (r.splice(c, 1), (s = "code.")),
          Ld.forEach((u) => {
            let l = r.indexOf(u);
            l > -1 && (r.splice(l, 1), (s += u + "."));
          }),
          (s += i),
          r.length != 0 || i.length === 0)
        )
          return null;
        let a = {};
        return (a.domEventName = o), (a.fullKey = s), a;
      }
      static matchEventFullKeyCode(n, r) {
        let o = Fv[n.key] || n.key,
          i = "";
        return (
          r.indexOf("code.") > -1 && ((o = n.code), (i = "code.")),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === " " ? (o = "space") : o === "." && (o = "dot"),
              Ld.forEach((s) => {
                if (s !== o) {
                  let c = kv[s];
                  c(n) && (i += s + ".");
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
          return new (r || e)(T(pe));
        };
      }
      static {
        this.ɵprov = w({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })();
function Ud(e, t) {
  return Cd(m({ rootComponent: e }, jv(t)));
}
function jv(e) {
  return {
    appProviders: [...Hv, ...(e?.providers ?? [])],
    platformProviders: Uv,
  };
}
function Vv() {
  na.makeCurrent();
}
function $v() {
  return new Fe();
}
function Bv() {
  return bl(document), document;
}
var Uv = [
  { provide: Zt, useValue: Pd },
  { provide: Rs, useValue: Vv, multi: !0 },
  { provide: pe, useFactory: Bv, deps: [] },
];
var Hv = [
  { provide: eo, useValue: "root" },
  { provide: Fe, useFactory: $v, deps: [] },
  { provide: ra, useClass: Pv, multi: !0, deps: [pe, $, Zt] },
  { provide: ra, useClass: Lv, multi: !0, deps: [pe] },
  Fd,
  Vd,
  jd,
  { provide: Ut, useExisting: Fd },
  { provide: bo, useClass: _v, deps: [] },
  [],
];
var Hd = (() => {
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
        return new (r || e)(T(pe));
      };
    }
    static {
      this.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
  }
  return e;
})();
var I = "primary",
  Jn = Symbol("RouteTitle"),
  la = class {
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
function nn(e) {
  return new la(e);
}
function Gv(e, t, n) {
  let r = n.path.split("/");
  if (
    r.length > e.length ||
    (n.pathMatch === "full" && (t.hasChildren() || r.length < e.length))
  )
    return null;
  let o = {};
  for (let i = 0; i < r.length; i++) {
    let s = r[i],
      c = e[i];
    if (s[0] === ":") o[s.substring(1)] = c;
    else if (s !== c.path) return null;
  }
  return { consumed: e.slice(0, r.length), posParams: o };
}
function qv(e, t) {
  if (e.length !== t.length) return !1;
  for (let n = 0; n < e.length; ++n) if (!Ne(e[n], t[n])) return !1;
  return !0;
}
function Ne(e, t) {
  let n = e ? da(e) : void 0,
    r = t ? da(t) : void 0;
  if (!n || !r || n.length != r.length) return !1;
  let o;
  for (let i = 0; i < n.length; i++)
    if (((o = n[i]), !Kd(e[o], t[o]))) return !1;
  return !0;
}
function da(e) {
  return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)];
}
function Kd(e, t) {
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length) return !1;
    let n = [...e].sort(),
      r = [...t].sort();
    return n.every((o, i) => r[i] === o);
  } else return e === t;
}
function Jd(e) {
  return e.length > 0 ? e[e.length - 1] : null;
}
function Qe(e) {
  return li(e) ? e : Nn(e) ? U(Promise.resolve(e)) : C(e);
}
var Wv = { exact: ef, subset: tf },
  Xd = { exact: Zv, subset: Yv, ignored: () => !0 };
function zd(e, t, n) {
  return (
    Wv[n.paths](e.root, t.root, n.matrixParams) &&
    Xd[n.queryParams](e.queryParams, t.queryParams) &&
    !(n.fragment === "exact" && e.fragment !== t.fragment)
  );
}
function Zv(e, t) {
  return Ne(e, t);
}
function ef(e, t, n) {
  if (
    !ht(e.segments, t.segments) ||
    !No(e.segments, t.segments, n) ||
    e.numberOfChildren !== t.numberOfChildren
  )
    return !1;
  for (let r in t.children)
    if (!e.children[r] || !ef(e.children[r], t.children[r], n)) return !1;
  return !0;
}
function Yv(e, t) {
  return (
    Object.keys(t).length <= Object.keys(e).length &&
    Object.keys(t).every((n) => Kd(e[n], t[n]))
  );
}
function tf(e, t, n) {
  return nf(e, t, t.segments, n);
}
function nf(e, t, n, r) {
  if (e.segments.length > n.length) {
    let o = e.segments.slice(0, n.length);
    return !(!ht(o, n) || t.hasChildren() || !No(o, n, r));
  } else if (e.segments.length === n.length) {
    if (!ht(e.segments, n) || !No(e.segments, n, r)) return !1;
    for (let o in t.children)
      if (!e.children[o] || !tf(e.children[o], t.children[o], r)) return !1;
    return !0;
  } else {
    let o = n.slice(0, e.segments.length),
      i = n.slice(e.segments.length);
    return !ht(e.segments, o) || !No(e.segments, o, r) || !e.children[I]
      ? !1
      : nf(e.children[I], t, i, r);
  }
}
function No(e, t, n) {
  return t.every((r, o) => Xd[n](e[o].parameters, r.parameters));
}
var Be = class {
    constructor(t = new O([], {}), n = {}, r = null) {
      (this.root = t), (this.queryParams = n), (this.fragment = r);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= nn(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      return Jv.serialize(this);
    }
  },
  O = class {
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
      return Ao(this);
    }
  },
  ft = class {
    constructor(t, n) {
      (this.path = t), (this.parameters = n);
    }
    get parameterMap() {
      return (this._parameterMap ??= nn(this.parameters)), this._parameterMap;
    }
    toString() {
      return of(this);
    }
  };
function Qv(e, t) {
  return ht(e, t) && e.every((n, r) => Ne(n.parameters, t[r].parameters));
}
function ht(e, t) {
  return e.length !== t.length ? !1 : e.every((n, r) => n.path === t[r].path);
}
function Kv(e, t) {
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
var La = (() => {
    class e {
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = w({
          token: e,
          factory: () => new Un(),
          providedIn: "root",
        });
      }
    }
    return e;
  })(),
  Un = class {
    parse(t) {
      let n = new ha(t);
      return new Be(
        n.parseRootSegment(),
        n.parseQueryParams(),
        n.parseFragment(),
      );
    }
    serialize(t) {
      let n = `/${kn(t.root, !0)}`,
        r = ty(t.queryParams),
        o = typeof t.fragment == "string" ? `#${Xv(t.fragment)}` : "";
      return `${n}${r}${o}`;
    }
  },
  Jv = new Un();
function Ao(e) {
  return e.segments.map((t) => of(t)).join("/");
}
function kn(e, t) {
  if (!e.hasChildren()) return Ao(e);
  if (t) {
    let n = e.children[I] ? kn(e.children[I], !1) : "",
      r = [];
    return (
      Object.entries(e.children).forEach(([o, i]) => {
        o !== I && r.push(`${o}:${kn(i, !1)}`);
      }),
      r.length > 0 ? `${n}(${r.join("//")})` : n
    );
  } else {
    let n = Kv(e, (r, o) =>
      o === I ? [kn(e.children[I], !1)] : [`${o}:${kn(r, !1)}`],
    );
    return Object.keys(e.children).length === 1 && e.children[I] != null
      ? `${Ao(e)}/${n[0]}`
      : `${Ao(e)}/(${n.join("//")})`;
  }
}
function rf(e) {
  return encodeURIComponent(e)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function To(e) {
  return rf(e).replace(/%3B/gi, ";");
}
function Xv(e) {
  return encodeURI(e);
}
function fa(e) {
  return rf(e)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function Ro(e) {
  return decodeURIComponent(e);
}
function Gd(e) {
  return Ro(e.replace(/\+/g, "%20"));
}
function of(e) {
  return `${fa(e.path)}${ey(e.parameters)}`;
}
function ey(e) {
  return Object.entries(e)
    .map(([t, n]) => `;${fa(t)}=${fa(n)}`)
    .join("");
}
function ty(e) {
  let t = Object.entries(e)
    .map(([n, r]) =>
      Array.isArray(r)
        ? r.map((o) => `${To(n)}=${To(o)}`).join("&")
        : `${To(n)}=${To(r)}`,
    )
    .filter((n) => n);
  return t.length ? `?${t.join("&")}` : "";
}
var ny = /^[^\/()?;#]+/;
function sa(e) {
  let t = e.match(ny);
  return t ? t[0] : "";
}
var ry = /^[^\/()?;=#]+/;
function oy(e) {
  let t = e.match(ry);
  return t ? t[0] : "";
}
var iy = /^[^=?&#]+/;
function sy(e) {
  let t = e.match(iy);
  return t ? t[0] : "";
}
var ay = /^[^&#]+/;
function cy(e) {
  let t = e.match(ay);
  return t ? t[0] : "";
}
var ha = class {
  constructor(t) {
    (this.url = t), (this.remaining = t);
  }
  parseRootSegment() {
    return (
      this.consumeOptional("/"),
      this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
        ? new O([], {})
        : new O([], this.parseChildren())
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
      (t.length > 0 || Object.keys(n).length > 0) && (r[I] = new O(t, n)),
      r
    );
  }
  parseSegment() {
    let t = sa(this.remaining);
    if (t === "" && this.peekStartsWith(";")) throw new v(4009, !1);
    return this.capture(t), new ft(Ro(t), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let t = {};
    for (; this.consumeOptional(";"); ) this.parseParam(t);
    return t;
  }
  parseParam(t) {
    let n = oy(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let o = sa(this.remaining);
      o && ((r = o), this.capture(r));
    }
    t[Ro(n)] = Ro(r);
  }
  parseQueryParam(t) {
    let n = sy(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let s = cy(this.remaining);
      s && ((r = s), this.capture(r));
    }
    let o = Gd(n),
      i = Gd(r);
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
      let r = sa(this.remaining),
        o = this.remaining[r.length];
      if (o !== "/" && o !== ")" && o !== ";") throw new v(4010, !1);
      let i;
      r.indexOf(":") > -1
        ? ((i = r.slice(0, r.indexOf(":"))), this.capture(i), this.capture(":"))
        : t && (i = I);
      let s = this.parseChildren();
      (n[i] = Object.keys(s).length === 1 ? s[I] : new O([], s)),
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
function sf(e) {
  return e.segments.length > 0 ? new O([], { [I]: e }) : e;
}
function af(e) {
  let t = {};
  for (let [r, o] of Object.entries(e.children)) {
    let i = af(o);
    if (r === I && i.segments.length === 0 && i.hasChildren())
      for (let [s, c] of Object.entries(i.children)) t[s] = c;
    else (i.segments.length > 0 || i.hasChildren()) && (t[r] = i);
  }
  let n = new O(e.segments, t);
  return uy(n);
}
function uy(e) {
  if (e.numberOfChildren === 1 && e.children[I]) {
    let t = e.children[I];
    return new O(e.segments.concat(t.segments), t.children);
  }
  return e;
}
function Hn(e) {
  return e instanceof Be;
}
function ly(e, t, n = null, r = null) {
  let o = cf(e);
  return uf(o, t, n, r);
}
function cf(e) {
  let t;
  function n(i) {
    let s = {};
    for (let a of i.children) {
      let u = n(a);
      s[a.outlet] = u;
    }
    let c = new O(i.url, s);
    return i === e && (t = c), c;
  }
  let r = n(e.root),
    o = sf(r);
  return t ?? o;
}
function uf(e, t, n, r) {
  let o = e;
  for (; o.parent; ) o = o.parent;
  if (t.length === 0) return aa(o, o, o, n, r);
  let i = dy(t);
  if (i.toRoot()) return aa(o, o, new O([], {}), n, r);
  let s = fy(i, o, e),
    c = s.processChildren
      ? Vn(s.segmentGroup, s.index, i.commands)
      : df(s.segmentGroup, s.index, i.commands);
  return aa(o, s.segmentGroup, c, n, r);
}
function Oo(e) {
  return typeof e == "object" && e != null && !e.outlets && !e.segmentPath;
}
function zn(e) {
  return typeof e == "object" && e != null && e.outlets;
}
function aa(e, t, n, r, o) {
  let i = {};
  r &&
    Object.entries(r).forEach(([a, u]) => {
      i[a] = Array.isArray(u) ? u.map((l) => `${l}`) : `${u}`;
    });
  let s;
  e === t ? (s = n) : (s = lf(e, t, n));
  let c = sf(af(s));
  return new Be(c, i, o);
}
function lf(e, t, n) {
  let r = {};
  return (
    Object.entries(e.children).forEach(([o, i]) => {
      i === t ? (r[o] = n) : (r[o] = lf(i, t, n));
    }),
    new O(e.segments, r)
  );
}
var Po = class {
  constructor(t, n, r) {
    if (
      ((this.isAbsolute = t),
      (this.numberOfDoubleDots = n),
      (this.commands = r),
      t && r.length > 0 && Oo(r[0]))
    )
      throw new v(4003, !1);
    let o = r.find(zn);
    if (o && o !== Jd(r)) throw new v(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function dy(e) {
  if (typeof e[0] == "string" && e.length === 1 && e[0] === "/")
    return new Po(!0, 0, e);
  let t = 0,
    n = !1,
    r = e.reduce((o, i, s) => {
      if (typeof i == "object" && i != null) {
        if (i.outlets) {
          let c = {};
          return (
            Object.entries(i.outlets).forEach(([a, u]) => {
              c[a] = typeof u == "string" ? u.split("/") : u;
            }),
            [...o, { outlets: c }]
          );
        }
        if (i.segmentPath) return [...o, i.segmentPath];
      }
      return typeof i != "string"
        ? [...o, i]
        : s === 0
          ? (i.split("/").forEach((c, a) => {
              (a == 0 && c === ".") ||
                (a == 0 && c === ""
                  ? (n = !0)
                  : c === ".."
                    ? t++
                    : c != "" && o.push(c));
            }),
            o)
          : [...o, i];
    }, []);
  return new Po(n, t, r);
}
var Xt = class {
  constructor(t, n, r) {
    (this.segmentGroup = t), (this.processChildren = n), (this.index = r);
  }
};
function fy(e, t, n) {
  if (e.isAbsolute) return new Xt(t, !0, 0);
  if (!n) return new Xt(t, !1, NaN);
  if (n.parent === null) return new Xt(n, !0, 0);
  let r = Oo(e.commands[0]) ? 0 : 1,
    o = n.segments.length - 1 + r;
  return hy(n, o, e.numberOfDoubleDots);
}
function hy(e, t, n) {
  let r = e,
    o = t,
    i = n;
  for (; i > o; ) {
    if (((i -= o), (r = r.parent), !r)) throw new v(4005, !1);
    o = r.segments.length;
  }
  return new Xt(r, !1, o - i);
}
function py(e) {
  return zn(e[0]) ? e[0].outlets : { [I]: e };
}
function df(e, t, n) {
  if (((e ??= new O([], {})), e.segments.length === 0 && e.hasChildren()))
    return Vn(e, t, n);
  let r = gy(e, t, n),
    o = n.slice(r.commandIndex);
  if (r.match && r.pathIndex < e.segments.length) {
    let i = new O(e.segments.slice(0, r.pathIndex), {});
    return (
      (i.children[I] = new O(e.segments.slice(r.pathIndex), e.children)),
      Vn(i, 0, o)
    );
  } else
    return r.match && o.length === 0
      ? new O(e.segments, {})
      : r.match && !e.hasChildren()
        ? pa(e, t, n)
        : r.match
          ? Vn(e, 0, o)
          : pa(e, t, n);
}
function Vn(e, t, n) {
  if (n.length === 0) return new O(e.segments, {});
  {
    let r = py(n),
      o = {};
    if (
      Object.keys(r).some((i) => i !== I) &&
      e.children[I] &&
      e.numberOfChildren === 1 &&
      e.children[I].segments.length === 0
    ) {
      let i = Vn(e.children[I], t, n);
      return new O(e.segments, i.children);
    }
    return (
      Object.entries(r).forEach(([i, s]) => {
        typeof s == "string" && (s = [s]),
          s !== null && (o[i] = df(e.children[i], t, s));
      }),
      Object.entries(e.children).forEach(([i, s]) => {
        r[i] === void 0 && (o[i] = s);
      }),
      new O(e.segments, o)
    );
  }
}
function gy(e, t, n) {
  let r = 0,
    o = t,
    i = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; o < e.segments.length; ) {
    if (r >= n.length) return i;
    let s = e.segments[o],
      c = n[r];
    if (zn(c)) break;
    let a = `${c}`,
      u = r < n.length - 1 ? n[r + 1] : null;
    if (o > 0 && a === void 0) break;
    if (a && u && typeof u == "object" && u.outlets === void 0) {
      if (!Wd(a, u, s)) return i;
      r += 2;
    } else {
      if (!Wd(a, {}, s)) return i;
      r++;
    }
    o++;
  }
  return { match: !0, pathIndex: o, commandIndex: r };
}
function pa(e, t, n) {
  let r = e.segments.slice(0, t),
    o = 0;
  for (; o < n.length; ) {
    let i = n[o];
    if (zn(i)) {
      let a = my(i.outlets);
      return new O(r, a);
    }
    if (o === 0 && Oo(n[0])) {
      let a = e.segments[t];
      r.push(new ft(a.path, qd(n[0]))), o++;
      continue;
    }
    let s = zn(i) ? i.outlets[I] : `${i}`,
      c = o < n.length - 1 ? n[o + 1] : null;
    s && c && Oo(c)
      ? (r.push(new ft(s, qd(c))), (o += 2))
      : (r.push(new ft(s, {})), o++);
  }
  return new O(r, {});
}
function my(e) {
  let t = {};
  return (
    Object.entries(e).forEach(([n, r]) => {
      typeof r == "string" && (r = [r]),
        r !== null && (t[n] = pa(new O([], {}), 0, r));
    }),
    t
  );
}
function qd(e) {
  let t = {};
  return Object.entries(e).forEach(([n, r]) => (t[n] = `${r}`)), t;
}
function Wd(e, t, n) {
  return e == n.path && Ne(t, n.parameters);
}
var $n = "imperative",
  Z = (function (e) {
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
  })(Z || {}),
  ge = class {
    constructor(t, n) {
      (this.id = t), (this.url = n);
    }
  },
  Gn = class extends ge {
    constructor(t, n, r = "imperative", o = null) {
      super(t, n),
        (this.type = Z.NavigationStart),
        (this.navigationTrigger = r),
        (this.restoredState = o);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  pt = class extends ge {
    constructor(t, n, r) {
      super(t, n), (this.urlAfterRedirects = r), (this.type = Z.NavigationEnd);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  ce = (function (e) {
    return (
      (e[(e.Redirect = 0)] = "Redirect"),
      (e[(e.SupersededByNewNavigation = 1)] = "SupersededByNewNavigation"),
      (e[(e.NoDataFromResolver = 2)] = "NoDataFromResolver"),
      (e[(e.GuardRejected = 3)] = "GuardRejected"),
      e
    );
  })(ce || {}),
  ga = (function (e) {
    return (
      (e[(e.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
      (e[(e.IgnoredByUrlHandlingStrategy = 1)] =
        "IgnoredByUrlHandlingStrategy"),
      e
    );
  })(ga || {}),
  $e = class extends ge {
    constructor(t, n, r, o) {
      super(t, n),
        (this.reason = r),
        (this.code = o),
        (this.type = Z.NavigationCancel);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  gt = class extends ge {
    constructor(t, n, r, o) {
      super(t, n),
        (this.reason = r),
        (this.code = o),
        (this.type = Z.NavigationSkipped);
    }
  },
  qn = class extends ge {
    constructor(t, n, r, o) {
      super(t, n),
        (this.error = r),
        (this.target = o),
        (this.type = Z.NavigationError);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  Fo = class extends ge {
    constructor(t, n, r, o) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.type = Z.RoutesRecognized);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  ma = class extends ge {
    constructor(t, n, r, o) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.type = Z.GuardsCheckStart);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  va = class extends ge {
    constructor(t, n, r, o, i) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.shouldActivate = i),
        (this.type = Z.GuardsCheckEnd);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  ya = class extends ge {
    constructor(t, n, r, o) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.type = Z.ResolveStart);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Da = class extends ge {
    constructor(t, n, r, o) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.type = Z.ResolveEnd);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  wa = class {
    constructor(t) {
      (this.route = t), (this.type = Z.RouteConfigLoadStart);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  Ca = class {
    constructor(t) {
      (this.route = t), (this.type = Z.RouteConfigLoadEnd);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  Ia = class {
    constructor(t) {
      (this.snapshot = t), (this.type = Z.ChildActivationStart);
    }
    toString() {
      return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  },
  Ea = class {
    constructor(t) {
      (this.snapshot = t), (this.type = Z.ChildActivationEnd);
    }
    toString() {
      return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  },
  ba = class {
    constructor(t) {
      (this.snapshot = t), (this.type = Z.ActivationStart);
    }
    toString() {
      return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  },
  Sa = class {
    constructor(t) {
      (this.snapshot = t), (this.type = Z.ActivationEnd);
    }
    toString() {
      return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  };
var Wn = class {},
  rn = class {
    constructor(t, n) {
      (this.url = t), (this.navigationBehaviorOptions = n);
    }
  };
function vy(e, t) {
  return (
    e.providers &&
      !e._injector &&
      (e._injector = qs(e.providers, t, `Route: ${e.path}`)),
    e._injector ?? t
  );
}
function Ee(e) {
  return e.outlet || I;
}
function yy(e, t) {
  let n = e.filter((r) => Ee(r) === t);
  return n.push(...e.filter((r) => Ee(r) !== t)), n;
}
function Xn(e) {
  if (!e) return null;
  if (e.routeConfig?._injector) return e.routeConfig._injector;
  for (let t = e.parent; t; t = t.parent) {
    let n = t.routeConfig;
    if (n?._loadedInjector) return n._loadedInjector;
    if (n?._injector) return n._injector;
  }
  return null;
}
var Ma = class {
    get injector() {
      return Xn(this.route?.snapshot) ?? this.rootInjector;
    }
    set injector(t) {}
    constructor(t) {
      (this.rootInjector = t),
        (this.outlet = null),
        (this.route = null),
        (this.children = new Uo(this.rootInjector)),
        (this.attachRef = null);
    }
  },
  Uo = (() => {
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
          r || ((r = new Ma(this.rootInjector)), this.contexts.set(n, r)), r
        );
      }
      getContext(n) {
        return this.contexts.get(n) || null;
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(T(he));
        };
      }
      static {
        this.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  ko = class {
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
      let n = _a(t, this._root);
      return n ? n.children.map((r) => r.value) : [];
    }
    firstChild(t) {
      let n = _a(t, this._root);
      return n && n.children.length > 0 ? n.children[0].value : null;
    }
    siblings(t) {
      let n = Ta(t, this._root);
      return n.length < 2
        ? []
        : n[n.length - 2].children.map((o) => o.value).filter((o) => o !== t);
    }
    pathFromRoot(t) {
      return Ta(t, this._root).map((n) => n.value);
    }
  };
function _a(e, t) {
  if (e === t.value) return t;
  for (let n of t.children) {
    let r = _a(e, n);
    if (r) return r;
  }
  return null;
}
function Ta(e, t) {
  if (e === t.value) return [t];
  for (let n of t.children) {
    let r = Ta(e, n);
    if (r.length) return r.unshift(t), r;
  }
  return [];
}
var ae = class {
  constructor(t, n) {
    (this.value = t), (this.children = n);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function Jt(e) {
  let t = {};
  return e && e.children.forEach((n) => (t[n.value.outlet] = n)), t;
}
var Lo = class extends ko {
  constructor(t, n) {
    super(t), (this.snapshot = n), ja(this, t);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function ff(e) {
  let t = Dy(e),
    n = new q([new ft("", {})]),
    r = new q({}),
    o = new q({}),
    i = new q({}),
    s = new q(""),
    c = new on(n, r, i, s, o, I, e, t.root);
  return (c.snapshot = t.root), new Lo(new ae(c, []), t);
}
function Dy(e) {
  let t = {},
    n = {},
    r = {},
    o = "",
    i = new en([], t, r, o, n, I, e, null, {});
  return new Vo("", new ae(i, []));
}
var on = class {
  constructor(t, n, r, o, i, s, c, a) {
    (this.urlSubject = t),
      (this.paramsSubject = n),
      (this.queryParamsSubject = r),
      (this.fragmentSubject = o),
      (this.dataSubject = i),
      (this.outlet = s),
      (this.component = c),
      (this._futureSnapshot = a),
      (this.title = this.dataSubject?.pipe(_((u) => u[Jn])) ?? C(void 0)),
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
      (this._paramMap ??= this.params.pipe(_((t) => nn(t)))), this._paramMap
    );
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(_((t) => nn(t)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function jo(e, t, n = "emptyOnly") {
  let r,
    { routeConfig: o } = e;
  return (
    t !== null &&
    (n === "always" ||
      o?.path === "" ||
      (!t.component && !t.routeConfig?.loadComponent))
      ? (r = {
          params: m(m({}, t.params), e.params),
          data: m(m({}, t.data), e.data),
          resolve: m(m(m(m({}, e.data), t.data), o?.data), e._resolvedData),
        })
      : (r = {
          params: m({}, e.params),
          data: m({}, e.data),
          resolve: m(m({}, e.data), e._resolvedData ?? {}),
        }),
    o && pf(o) && (r.resolve[Jn] = o.title),
    r
  );
}
var en = class {
    get title() {
      return this.data?.[Jn];
    }
    constructor(t, n, r, o, i, s, c, a, u) {
      (this.url = t),
        (this.params = n),
        (this.queryParams = r),
        (this.fragment = o),
        (this.data = i),
        (this.outlet = s),
        (this.component = c),
        (this.routeConfig = a),
        (this._resolve = u);
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
      return (this._paramMap ??= nn(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= nn(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      let t = this.url.map((r) => r.toString()).join("/"),
        n = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${t}', path:'${n}')`;
    }
  },
  Vo = class extends ko {
    constructor(t, n) {
      super(n), (this.url = t), ja(this, n);
    }
    toString() {
      return hf(this._root);
    }
  };
function ja(e, t) {
  (t.value._routerState = e), t.children.forEach((n) => ja(e, n));
}
function hf(e) {
  let t = e.children.length > 0 ? ` { ${e.children.map(hf).join(", ")} } ` : "";
  return `${e.value}${t}`;
}
function ca(e) {
  if (e.snapshot) {
    let t = e.snapshot,
      n = e._futureSnapshot;
    (e.snapshot = n),
      Ne(t.queryParams, n.queryParams) ||
        e.queryParamsSubject.next(n.queryParams),
      t.fragment !== n.fragment && e.fragmentSubject.next(n.fragment),
      Ne(t.params, n.params) || e.paramsSubject.next(n.params),
      qv(t.url, n.url) || e.urlSubject.next(n.url),
      Ne(t.data, n.data) || e.dataSubject.next(n.data);
  } else
    (e.snapshot = e._futureSnapshot),
      e.dataSubject.next(e._futureSnapshot.data);
}
function xa(e, t) {
  let n = Ne(e.params, t.params) && Qv(e.url, t.url),
    r = !e.parent != !t.parent;
  return n && !r && (!e.parent || xa(e.parent, t.parent));
}
function pf(e) {
  return typeof e.title == "string" || e.title === null;
}
var Va = (() => {
    class e {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = I),
          (this.activateEvents = new K()),
          (this.deactivateEvents = new K()),
          (this.attachEvents = new K()),
          (this.detachEvents = new K()),
          (this.parentContexts = p(Uo)),
          (this.location = p(mo)),
          (this.changeDetector = p(An)),
          (this.inputBinder = p($a, { optional: !0 })),
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
          c = this.parentContexts.getOrCreateContext(this.name).children,
          a = new Na(n, c, o.injector);
        (this.activated = o.createComponent(s, {
          index: o.length,
          injector: a,
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
        this.ɵdir = gs({
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
          features: [ro],
        });
      }
    }
    return e;
  })(),
  Na = class e {
    __ngOutletInjector(t) {
      return new e(this.route, this.childContexts, t);
    }
    constructor(t, n, r) {
      (this.route = t), (this.childContexts = n), (this.parent = r);
    }
    get(t, n) {
      return t === on
        ? this.route
        : t === Uo
          ? this.childContexts
          : this.parent.get(t, n);
    }
  },
  $a = new E("");
function wy(e, t, n) {
  let r = Zn(e, t._root, n ? n._root : void 0);
  return new Lo(r, t);
}
function Zn(e, t, n) {
  if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
    let r = n.value;
    r._futureSnapshot = t.value;
    let o = Cy(e, t, n);
    return new ae(r, o);
  } else {
    if (e.shouldAttach(t.value)) {
      let i = e.retrieve(t.value);
      if (i !== null) {
        let s = i.route;
        return (
          (s.value._futureSnapshot = t.value),
          (s.children = t.children.map((c) => Zn(e, c))),
          s
        );
      }
    }
    let r = Iy(t.value),
      o = t.children.map((i) => Zn(e, i));
    return new ae(r, o);
  }
}
function Cy(e, t, n) {
  return t.children.map((r) => {
    for (let o of n.children)
      if (e.shouldReuseRoute(r.value, o.value.snapshot)) return Zn(e, r, o);
    return Zn(e, r);
  });
}
function Iy(e) {
  return new on(
    new q(e.url),
    new q(e.params),
    new q(e.queryParams),
    new q(e.fragment),
    new q(e.data),
    e.outlet,
    e.component,
    e,
  );
}
var Yn = class {
    constructor(t, n) {
      (this.redirectTo = t), (this.navigationBehaviorOptions = n);
    }
  },
  gf = "ngNavigationCancelingError";
function $o(e, t) {
  let { redirectTo: n, navigationBehaviorOptions: r } = Hn(t)
      ? { redirectTo: t, navigationBehaviorOptions: void 0 }
      : t,
    o = mf(!1, ce.Redirect);
  return (o.url = n), (o.navigationBehaviorOptions = r), o;
}
function mf(e, t) {
  let n = new Error(`NavigationCancelingError: ${e || ""}`);
  return (n[gf] = !0), (n.cancellationCode = t), n;
}
function Ey(e) {
  return vf(e) && Hn(e.url);
}
function vf(e) {
  return !!e && e[gf];
}
var by = (e, t, n, r) =>
    _(
      (o) => (
        new Aa(t, o.targetRouterState, o.currentRouterState, n, r).activate(e),
        o
      ),
    ),
  Aa = class {
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
        ca(this.futureState.root),
        this.activateChildRoutes(n, r, t);
    }
    deactivateChildRoutes(t, n, r) {
      let o = Jt(n);
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
        i = Jt(t);
      for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
      if (r && r.outlet) {
        let s = r.outlet.detach(),
          c = r.children.onOutletDeactivated();
        this.routeReuseStrategy.store(t.value.snapshot, {
          componentRef: s,
          route: t,
          contexts: c,
        });
      }
    }
    deactivateRouteAndOutlet(t, n) {
      let r = n.getContext(t.value.outlet),
        o = r && t.value.component ? r.children : n,
        i = Jt(t);
      for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
      r &&
        (r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
        (r.attachRef = null),
        (r.route = null));
    }
    activateChildRoutes(t, n, r) {
      let o = Jt(n);
      t.children.forEach((i) => {
        this.activateRoutes(i, o[i.value.outlet], r),
          this.forwardEvent(new Sa(i.value.snapshot));
      }),
        t.children.length && this.forwardEvent(new Ea(t.value.snapshot));
    }
    activateRoutes(t, n, r) {
      let o = t.value,
        i = n ? n.value : null;
      if ((ca(o), o === i))
        if (o.component) {
          let s = r.getOrCreateContext(o.outlet);
          this.activateChildRoutes(t, n, s.children);
        } else this.activateChildRoutes(t, n, r);
      else if (o.component) {
        let s = r.getOrCreateContext(o.outlet);
        if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
          let c = this.routeReuseStrategy.retrieve(o.snapshot);
          this.routeReuseStrategy.store(o.snapshot, null),
            s.children.onOutletReAttached(c.contexts),
            (s.attachRef = c.componentRef),
            (s.route = c.route.value),
            s.outlet && s.outlet.attach(c.componentRef, c.route.value),
            ca(c.route.value),
            this.activateChildRoutes(t, null, s.children);
        } else
          (s.attachRef = null),
            (s.route = o),
            s.outlet && s.outlet.activateWith(o, s.injector),
            this.activateChildRoutes(t, null, s.children);
      } else this.activateChildRoutes(t, null, r);
    }
  },
  Bo = class {
    constructor(t) {
      (this.path = t), (this.route = this.path[this.path.length - 1]);
    }
  },
  tn = class {
    constructor(t, n) {
      (this.component = t), (this.route = n);
    }
  };
function Sy(e, t, n) {
  let r = e._root,
    o = t ? t._root : null;
  return Ln(r, o, n, [r.value]);
}
function My(e) {
  let t = e.routeConfig ? e.routeConfig.canActivateChild : null;
  return !t || t.length === 0 ? null : { node: e, guards: t };
}
function an(e, t) {
  let n = Symbol(),
    r = t.get(e, n);
  return r === n ? (typeof e == "function" && !fu(e) ? e : t.get(e)) : r;
}
function Ln(
  e,
  t,
  n,
  r,
  o = { canDeactivateChecks: [], canActivateChecks: [] },
) {
  let i = Jt(t);
  return (
    e.children.forEach((s) => {
      _y(s, i[s.value.outlet], n, r.concat([s.value]), o),
        delete i[s.value.outlet];
    }),
    Object.entries(i).forEach(([s, c]) => Bn(c, n.getContext(s), o)),
    o
  );
}
function _y(
  e,
  t,
  n,
  r,
  o = { canDeactivateChecks: [], canActivateChecks: [] },
) {
  let i = e.value,
    s = t ? t.value : null,
    c = n ? n.getContext(e.value.outlet) : null;
  if (s && i.routeConfig === s.routeConfig) {
    let a = Ty(s, i, i.routeConfig.runGuardsAndResolvers);
    a
      ? o.canActivateChecks.push(new Bo(r))
      : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
      i.component ? Ln(e, t, c ? c.children : null, r, o) : Ln(e, t, n, r, o),
      a &&
        c &&
        c.outlet &&
        c.outlet.isActivated &&
        o.canDeactivateChecks.push(new tn(c.outlet.component, s));
  } else
    s && Bn(t, c, o),
      o.canActivateChecks.push(new Bo(r)),
      i.component
        ? Ln(e, null, c ? c.children : null, r, o)
        : Ln(e, null, n, r, o);
  return o;
}
function Ty(e, t, n) {
  if (typeof n == "function") return n(e, t);
  switch (n) {
    case "pathParamsChange":
      return !ht(e.url, t.url);
    case "pathParamsOrQueryParamsChange":
      return !ht(e.url, t.url) || !Ne(e.queryParams, t.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !xa(e, t) || !Ne(e.queryParams, t.queryParams);
    case "paramsChange":
    default:
      return !xa(e, t);
  }
}
function Bn(e, t, n) {
  let r = Jt(e),
    o = e.value;
  Object.entries(r).forEach(([i, s]) => {
    o.component
      ? t
        ? Bn(s, t.children.getContext(i), n)
        : Bn(s, null, n)
      : Bn(s, t, n);
  }),
    o.component
      ? t && t.outlet && t.outlet.isActivated
        ? n.canDeactivateChecks.push(new tn(t.outlet.component, o))
        : n.canDeactivateChecks.push(new tn(null, o))
      : n.canDeactivateChecks.push(new tn(null, o));
}
function er(e) {
  return typeof e == "function";
}
function xy(e) {
  return typeof e == "boolean";
}
function Ny(e) {
  return e && er(e.canLoad);
}
function Ay(e) {
  return e && er(e.canActivate);
}
function Ry(e) {
  return e && er(e.canActivateChild);
}
function Oy(e) {
  return e && er(e.canDeactivate);
}
function Py(e) {
  return e && er(e.canMatch);
}
function yf(e) {
  return e instanceof Ae || e?.name === "EmptyError";
}
var xo = Symbol("INITIAL_VALUE");
function sn() {
  return ye((e) =>
    wr(e.map((t) => t.pipe(Re(1), gi(xo)))).pipe(
      _((t) => {
        for (let n of t)
          if (n !== !0) {
            if (n === xo) return xo;
            if (n === !1 || Fy(n)) return n;
          }
        return !0;
      }),
      ve((t) => t !== xo),
      Re(1),
    ),
  );
}
function Fy(e) {
  return Hn(e) || e instanceof Yn;
}
function ky(e, t) {
  return H((n) => {
    let {
      targetSnapshot: r,
      currentSnapshot: o,
      guards: { canActivateChecks: i, canDeactivateChecks: s },
    } = n;
    return s.length === 0 && i.length === 0
      ? C(j(m({}, n), { guardsResult: !0 }))
      : Ly(s, r, o, e).pipe(
          H((c) => (c && xy(c) ? jy(r, i, e, t) : C(c))),
          _((c) => j(m({}, n), { guardsResult: c })),
        );
  });
}
function Ly(e, t, n, r) {
  return U(e).pipe(
    H((o) => Hy(o.component, o.route, n, t, r)),
    Se((o) => o !== !0, !0),
  );
}
function jy(e, t, n, r) {
  return U(t).pipe(
    Mt((o) =>
      St(
        $y(o.route.parent, r),
        Vy(o.route, r),
        Uy(e, o.path, n),
        By(e, o.route, n),
      ),
    ),
    Se((o) => o !== !0, !0),
  );
}
function Vy(e, t) {
  return e !== null && t && t(new ba(e)), C(!0);
}
function $y(e, t) {
  return e !== null && t && t(new Ia(e)), C(!0);
}
function By(e, t, n) {
  let r = t.routeConfig ? t.routeConfig.canActivate : null;
  if (!r || r.length === 0) return C(!0);
  let o = r.map((i) =>
    Cr(() => {
      let s = Xn(t) ?? n,
        c = an(i, s),
        a = Ay(c) ? c.canActivate(t, e) : ke(s, () => c(t, e));
      return Qe(a).pipe(Se());
    }),
  );
  return C(o).pipe(sn());
}
function Uy(e, t, n) {
  let r = t[t.length - 1],
    i = t
      .slice(0, t.length - 1)
      .reverse()
      .map((s) => My(s))
      .filter((s) => s !== null)
      .map((s) =>
        Cr(() => {
          let c = s.guards.map((a) => {
            let u = Xn(s.node) ?? n,
              l = an(a, u),
              d = Ry(l) ? l.canActivateChild(r, e) : ke(u, () => l(r, e));
            return Qe(d).pipe(Se());
          });
          return C(c).pipe(sn());
        }),
      );
  return C(i).pipe(sn());
}
function Hy(e, t, n, r, o) {
  let i = t && t.routeConfig ? t.routeConfig.canDeactivate : null;
  if (!i || i.length === 0) return C(!0);
  let s = i.map((c) => {
    let a = Xn(t) ?? o,
      u = an(c, a),
      l = Oy(u) ? u.canDeactivate(e, t, n, r) : ke(a, () => u(e, t, n, r));
    return Qe(l).pipe(Se());
  });
  return C(s).pipe(sn());
}
function zy(e, t, n, r) {
  let o = t.canLoad;
  if (o === void 0 || o.length === 0) return C(!0);
  let i = o.map((s) => {
    let c = an(s, e),
      a = Ny(c) ? c.canLoad(t, n) : ke(e, () => c(t, n));
    return Qe(a);
  });
  return C(i).pipe(sn(), Df(r));
}
function Df(e) {
  return si(
    W((t) => {
      if (typeof t != "boolean") throw $o(e, t);
    }),
    _((t) => t === !0),
  );
}
function Gy(e, t, n, r) {
  let o = t.canMatch;
  if (!o || o.length === 0) return C(!0);
  let i = o.map((s) => {
    let c = an(s, e),
      a = Py(c) ? c.canMatch(t, n) : ke(e, () => c(t, n));
    return Qe(a);
  });
  return C(i).pipe(sn(), Df(r));
}
var Qn = class {
    constructor(t) {
      this.segmentGroup = t || null;
    }
  },
  Kn = class extends Error {
    constructor(t) {
      super(), (this.urlTree = t);
    }
  };
function Kt(e) {
  return bt(new Qn(e));
}
function qy(e) {
  return bt(new v(4e3, !1));
}
function Wy(e) {
  return bt(mf(!1, ce.GuardRejected));
}
var Ra = class {
    constructor(t, n) {
      (this.urlSerializer = t), (this.urlTree = n);
    }
    lineralizeSegments(t, n) {
      let r = [],
        o = n.root;
      for (;;) {
        if (((r = r.concat(o.segments)), o.numberOfChildren === 0)) return C(r);
        if (o.numberOfChildren > 1 || !o.children[I])
          return qy(`${t.redirectTo}`);
        o = o.children[I];
      }
    }
    applyRedirectCommands(t, n, r, o, i) {
      if (typeof n != "string") {
        let c = n,
          {
            queryParams: a,
            fragment: u,
            routeConfig: l,
            url: d,
            outlet: h,
            params: f,
            data: g,
            title: M,
          } = o,
          L = ke(i, () =>
            c({
              params: f,
              data: g,
              queryParams: a,
              fragment: u,
              routeConfig: l,
              url: d,
              outlet: h,
              title: M,
            }),
          );
        if (L instanceof Be) throw new Kn(L);
        n = L;
      }
      let s = this.applyRedirectCreateUrlTree(
        n,
        this.urlSerializer.parse(n),
        t,
        r,
      );
      if (n[0] === "/") throw new Kn(s);
      return s;
    }
    applyRedirectCreateUrlTree(t, n, r, o) {
      let i = this.createSegmentGroup(t, n.root, r, o);
      return new Be(
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
            let c = i.substring(1);
            r[o] = n[c];
          } else r[o] = i;
        }),
        r
      );
    }
    createSegmentGroup(t, n, r, o) {
      let i = this.createSegments(t, n.segments, r, o),
        s = {};
      return (
        Object.entries(n.children).forEach(([c, a]) => {
          s[c] = this.createSegmentGroup(t, a, r, o);
        }),
        new O(i, s)
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
  Oa = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function Zy(e, t, n, r, o) {
  let i = wf(e, t, n);
  return i.matched
    ? ((r = vy(t, r)),
      Gy(r, t, n, o).pipe(_((s) => (s === !0 ? i : m({}, Oa)))))
    : C(i);
}
function wf(e, t, n) {
  if (t.path === "**") return Yy(n);
  if (t.path === "")
    return t.pathMatch === "full" && (e.hasChildren() || n.length > 0)
      ? m({}, Oa)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: n,
          parameters: {},
          positionalParamSegments: {},
        };
  let o = (t.matcher || Gv)(n, e, t);
  if (!o) return m({}, Oa);
  let i = {};
  Object.entries(o.posParams ?? {}).forEach(([c, a]) => {
    i[c] = a.path;
  });
  let s =
    o.consumed.length > 0
      ? m(m({}, i), o.consumed[o.consumed.length - 1].parameters)
      : i;
  return {
    matched: !0,
    consumedSegments: o.consumed,
    remainingSegments: n.slice(o.consumed.length),
    parameters: s,
    positionalParamSegments: o.posParams ?? {},
  };
}
function Yy(e) {
  return {
    matched: !0,
    parameters: e.length > 0 ? Jd(e).parameters : {},
    consumedSegments: e,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function Zd(e, t, n, r) {
  return n.length > 0 && Jy(e, n, r)
    ? {
        segmentGroup: new O(t, Ky(r, new O(n, e.children))),
        slicedSegments: [],
      }
    : n.length === 0 && Xy(e, n, r)
      ? {
          segmentGroup: new O(e.segments, Qy(e, n, r, e.children)),
          slicedSegments: n,
        }
      : { segmentGroup: new O(e.segments, e.children), slicedSegments: n };
}
function Qy(e, t, n, r) {
  let o = {};
  for (let i of n)
    if (Ho(e, t, i) && !r[Ee(i)]) {
      let s = new O([], {});
      o[Ee(i)] = s;
    }
  return m(m({}, r), o);
}
function Ky(e, t) {
  let n = {};
  n[I] = t;
  for (let r of e)
    if (r.path === "" && Ee(r) !== I) {
      let o = new O([], {});
      n[Ee(r)] = o;
    }
  return n;
}
function Jy(e, t, n) {
  return n.some((r) => Ho(e, t, r) && Ee(r) !== I);
}
function Xy(e, t, n) {
  return n.some((r) => Ho(e, t, r));
}
function Ho(e, t, n) {
  return (e.hasChildren() || t.length > 0) && n.pathMatch === "full"
    ? !1
    : n.path === "";
}
function eD(e, t, n) {
  return t.length === 0 && !e.children[n];
}
var Pa = class {};
function tD(e, t, n, r, o, i, s = "emptyOnly") {
  return new Fa(e, t, n, r, o, s, i).recognize();
}
var nD = 31,
  Fa = class {
    constructor(t, n, r, o, i, s, c) {
      (this.injector = t),
        (this.configLoader = n),
        (this.rootComponentType = r),
        (this.config = o),
        (this.urlTree = i),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = c),
        (this.applyRedirects = new Ra(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(t) {
      return new v(4002, `'${t.segmentGroup}'`);
    }
    recognize() {
      let t = Zd(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(t).pipe(
        _(({ children: n, rootSnapshot: r }) => {
          let o = new ae(r, n),
            i = new Vo("", o),
            s = ly(r, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (i.url = this.urlSerializer.serialize(s)),
            { state: i, tree: s }
          );
        }),
      );
    }
    match(t) {
      let n = new en(
        [],
        Object.freeze({}),
        Object.freeze(m({}, this.urlTree.queryParams)),
        this.urlTree.fragment,
        Object.freeze({}),
        I,
        this.rootComponentType,
        null,
        {},
      );
      return this.processSegmentGroup(this.injector, this.config, t, I, n).pipe(
        _((r) => ({ children: r, rootSnapshot: n })),
        He((r) => {
          if (r instanceof Kn)
            return (this.urlTree = r.urlTree), this.match(r.urlTree.root);
          throw r instanceof Qn ? this.noMatchError(r) : r;
        }),
      );
    }
    processSegmentGroup(t, n, r, o, i) {
      return r.segments.length === 0 && r.hasChildren()
        ? this.processChildren(t, n, r, i)
        : this.processSegment(t, n, r, r.segments, o, !0, i).pipe(
            _((s) => (s instanceof ae ? [s] : [])),
          );
    }
    processChildren(t, n, r, o) {
      let i = [];
      for (let s of Object.keys(r.children))
        s === "primary" ? i.unshift(s) : i.push(s);
      return U(i).pipe(
        Mt((s) => {
          let c = r.children[s],
            a = yy(n, s);
          return this.processSegmentGroup(t, a, c, s, o);
        }),
        pi((s, c) => (s.push(...c), s)),
        ze(null),
        hi(),
        H((s) => {
          if (s === null) return Kt(r);
          let c = Cf(s);
          return rD(c), C(c);
        }),
      );
    }
    processSegment(t, n, r, o, i, s, c) {
      return U(n).pipe(
        Mt((a) =>
          this.processSegmentAgainstRoute(
            a._injector ?? t,
            n,
            a,
            r,
            o,
            i,
            s,
            c,
          ).pipe(
            He((u) => {
              if (u instanceof Qn) return C(null);
              throw u;
            }),
          ),
        ),
        Se((a) => !!a),
        He((a) => {
          if (yf(a)) return eD(r, o, i) ? C(new Pa()) : Kt(r);
          throw a;
        }),
      );
    }
    processSegmentAgainstRoute(t, n, r, o, i, s, c, a) {
      return Ee(r) !== s && (s === I || !Ho(o, i, r))
        ? Kt(o)
        : r.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(t, o, r, i, s, a)
          : this.allowRedirects && c
            ? this.expandSegmentAgainstRouteUsingRedirect(t, o, n, r, i, s, a)
            : Kt(o);
    }
    expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s, c) {
      let {
        matched: a,
        parameters: u,
        consumedSegments: l,
        positionalParamSegments: d,
        remainingSegments: h,
      } = wf(n, o, i);
      if (!a) return Kt(n);
      typeof o.redirectTo == "string" &&
        o.redirectTo[0] === "/" &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > nD && (this.allowRedirects = !1));
      let f = new en(
          i,
          u,
          Object.freeze(m({}, this.urlTree.queryParams)),
          this.urlTree.fragment,
          Yd(o),
          Ee(o),
          o.component ?? o._loadedComponent ?? null,
          o,
          Qd(o),
        ),
        g = jo(f, c, this.paramsInheritanceStrategy);
      (f.params = Object.freeze(g.params)), (f.data = Object.freeze(g.data));
      let M = this.applyRedirects.applyRedirectCommands(
        l,
        o.redirectTo,
        d,
        f,
        t,
      );
      return this.applyRedirects
        .lineralizeSegments(o, M)
        .pipe(H((L) => this.processSegment(t, r, n, L.concat(h), s, !1, c)));
    }
    matchSegmentAgainstRoute(t, n, r, o, i, s) {
      let c = Zy(n, r, o, t, this.urlSerializer);
      return (
        r.path === "**" && (n.children = {}),
        c.pipe(
          ye((a) =>
            a.matched
              ? ((t = r._injector ?? t),
                this.getChildConfig(t, r, o).pipe(
                  ye(({ routes: u }) => {
                    let l = r._loadedInjector ?? t,
                      {
                        parameters: d,
                        consumedSegments: h,
                        remainingSegments: f,
                      } = a,
                      g = new en(
                        h,
                        d,
                        Object.freeze(m({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        Yd(r),
                        Ee(r),
                        r.component ?? r._loadedComponent ?? null,
                        r,
                        Qd(r),
                      ),
                      M = jo(g, s, this.paramsInheritanceStrategy);
                    (g.params = Object.freeze(M.params)),
                      (g.data = Object.freeze(M.data));
                    let { segmentGroup: L, slicedSegments: k } = Zd(n, h, f, u);
                    if (k.length === 0 && L.hasChildren())
                      return this.processChildren(l, u, L, g).pipe(
                        _((Ke) => new ae(g, Ke)),
                      );
                    if (u.length === 0 && k.length === 0)
                      return C(new ae(g, []));
                    let Y = Ee(r) === i;
                    return this.processSegment(
                      l,
                      u,
                      L,
                      k,
                      Y ? I : i,
                      !0,
                      g,
                    ).pipe(_((Ke) => new ae(g, Ke instanceof ae ? [Ke] : [])));
                  }),
                ))
              : Kt(n),
          ),
        )
      );
    }
    getChildConfig(t, n, r) {
      return n.children
        ? C({ routes: n.children, injector: t })
        : n.loadChildren
          ? n._loadedRoutes !== void 0
            ? C({ routes: n._loadedRoutes, injector: n._loadedInjector })
            : zy(t, n, r, this.urlSerializer).pipe(
                H((o) =>
                  o
                    ? this.configLoader.loadChildren(t, n).pipe(
                        W((i) => {
                          (n._loadedRoutes = i.routes),
                            (n._loadedInjector = i.injector);
                        }),
                      )
                    : Wy(n),
                ),
              )
          : C({ routes: [], injector: t });
    }
  };
function rD(e) {
  e.sort((t, n) =>
    t.value.outlet === I
      ? -1
      : n.value.outlet === I
        ? 1
        : t.value.outlet.localeCompare(n.value.outlet),
  );
}
function oD(e) {
  let t = e.value.routeConfig;
  return t && t.path === "";
}
function Cf(e) {
  let t = [],
    n = new Set();
  for (let r of e) {
    if (!oD(r)) {
      t.push(r);
      continue;
    }
    let o = t.find((i) => r.value.routeConfig === i.value.routeConfig);
    o !== void 0 ? (o.children.push(...r.children), n.add(o)) : t.push(r);
  }
  for (let r of n) {
    let o = Cf(r.children);
    t.push(new ae(r.value, o));
  }
  return t.filter((r) => !n.has(r));
}
function Yd(e) {
  return e.data || {};
}
function Qd(e) {
  return e.resolve || {};
}
function iD(e, t, n, r, o, i) {
  return H((s) =>
    tD(e, t, n, r, s.extractedUrl, o, i).pipe(
      _(({ state: c, tree: a }) =>
        j(m({}, s), { targetSnapshot: c, urlAfterRedirects: a }),
      ),
    ),
  );
}
function sD(e, t) {
  return H((n) => {
    let {
      targetSnapshot: r,
      guards: { canActivateChecks: o },
    } = n;
    if (!o.length) return C(n);
    let i = new Set(o.map((a) => a.route)),
      s = new Set();
    for (let a of i) if (!s.has(a)) for (let u of If(a)) s.add(u);
    let c = 0;
    return U(s).pipe(
      Mt((a) =>
        i.has(a)
          ? aD(a, r, e, t)
          : ((a.data = jo(a, a.parent, e).resolve), C(void 0)),
      ),
      W(() => c++),
      _t(1),
      H((a) => (c === s.size ? C(n) : oe)),
    );
  });
}
function If(e) {
  let t = e.children.map((n) => If(n)).flat();
  return [e, ...t];
}
function aD(e, t, n, r) {
  let o = e.routeConfig,
    i = e._resolve;
  return (
    o?.title !== void 0 && !pf(o) && (i[Jn] = o.title),
    cD(i, e, t, r).pipe(
      _(
        (s) => (
          (e._resolvedData = s), (e.data = jo(e, e.parent, n).resolve), null
        ),
      ),
    )
  );
}
function cD(e, t, n, r) {
  let o = da(e);
  if (o.length === 0) return C({});
  let i = {};
  return U(o).pipe(
    H((s) =>
      uD(e[s], t, n, r).pipe(
        Se(),
        W((c) => {
          if (c instanceof Yn) throw $o(new Un(), c);
          i[s] = c;
        }),
      ),
    ),
    _t(1),
    fi(i),
    He((s) => (yf(s) ? oe : bt(s))),
  );
}
function uD(e, t, n, r) {
  let o = Xn(t) ?? r,
    i = an(e, o),
    s = i.resolve ? i.resolve(t, n) : ke(o, () => i(t, n));
  return Qe(s);
}
function ua(e) {
  return ye((t) => {
    let n = e(t);
    return n ? U(n).pipe(_(() => t)) : C(t);
  });
}
var Ef = (() => {
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
        return n.data[Jn];
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = w({ token: e, factory: () => p(lD), providedIn: "root" });
      }
    }
    return e;
  })(),
  lD = (() => {
    class e extends Ef {
      constructor(n) {
        super(), (this.title = n);
      }
      updateTitle(n) {
        let r = this.buildTitle(n);
        r !== void 0 && this.title.setTitle(r);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(T(Hd));
        };
      }
      static {
        this.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  Ba = new E("", { providedIn: "root", factory: () => ({}) }),
  dD = (() => {
    class e {
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵcmp = Jr({
          type: e,
          selectors: [["ng-component"]],
          standalone: !0,
          features: [wo],
          decls: 1,
          vars: 0,
          template: function (r, o) {
            r & 1 && ne(0, "router-outlet");
          },
          dependencies: [Va],
          encapsulation: 2,
        });
      }
    }
    return e;
  })();
function Ua(e) {
  let t = e.children && e.children.map(Ua),
    n = t ? j(m({}, e), { children: t }) : m({}, e);
  return (
    !n.component &&
      !n.loadComponent &&
      (t || n.loadChildren) &&
      n.outlet &&
      n.outlet !== I &&
      (n.component = dD),
    n
  );
}
var Ha = new E(""),
  fD = (() => {
    class e {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = p(Qs));
      }
      loadComponent(n) {
        if (this.componentLoaders.get(n)) return this.componentLoaders.get(n);
        if (n._loadedComponent) return C(n._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(n);
        let r = Qe(n.loadComponent()).pipe(
            _(bf),
            W((i) => {
              this.onLoadEndListener && this.onLoadEndListener(n),
                (n._loadedComponent = i);
            }),
            ln(() => {
              this.componentLoaders.delete(n);
            }),
          ),
          o = new Et(r, () => new Q()).pipe(It());
        return this.componentLoaders.set(n, o), o;
      }
      loadChildren(n, r) {
        if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
        if (r._loadedRoutes)
          return C({ routes: r._loadedRoutes, injector: r._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(r);
        let i = hD(r, this.compiler, n, this.onLoadEndListener).pipe(
            ln(() => {
              this.childrenLoaders.delete(r);
            }),
          ),
          s = new Et(i, () => new Q()).pipe(It());
        return this.childrenLoaders.set(r, s), s;
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })();
function hD(e, t, n, r) {
  return Qe(e.loadChildren()).pipe(
    _(bf),
    H((o) =>
      o instanceof bn || Array.isArray(o) ? C(o) : U(t.compileModuleAsync(o)),
    ),
    _((o) => {
      r && r(e);
      let i,
        s,
        c = !1;
      return (
        Array.isArray(o)
          ? ((s = o), (c = !0))
          : ((i = o.create(n).injector),
            (s = i.get(Ha, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(Ua), injector: i }
      );
    }),
  );
}
function pD(e) {
  return e && typeof e == "object" && "default" in e;
}
function bf(e) {
  return pD(e) ? e.default : e;
}
var za = (() => {
    class e {
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = w({ token: e, factory: () => p(gD), providedIn: "root" });
      }
    }
    return e;
  })(),
  gD = (() => {
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
        this.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  mD = new E("");
var vD = new E(""),
  yD = (() => {
    class e {
      get hasRequestedNavigation() {
        return this.navigationId !== 0;
      }
      constructor() {
        (this.currentNavigation = null),
          (this.currentTransition = null),
          (this.lastSuccessfulNavigation = null),
          (this.events = new Q()),
          (this.transitionAbortSubject = new Q()),
          (this.configLoader = p(fD)),
          (this.environmentInjector = p(he)),
          (this.urlSerializer = p(La)),
          (this.rootContexts = p(Uo)),
          (this.location = p(Rn)),
          (this.inputBindingEnabled = p($a, { optional: !0 }) !== null),
          (this.titleStrategy = p(Ef)),
          (this.options = p(Ba, { optional: !0 }) || {}),
          (this.paramsInheritanceStrategy =
            this.options.paramsInheritanceStrategy || "emptyOnly"),
          (this.urlHandlingStrategy = p(za)),
          (this.createViewTransition = p(mD, { optional: !0 })),
          (this.navigationErrorHandler = p(vD, { optional: !0 })),
          (this.navigationId = 0),
          (this.afterPreactivation = () => C(void 0)),
          (this.rootComponentType = null);
        let n = (o) => this.events.next(new wa(o)),
          r = (o) => this.events.next(new Ca(o));
        (this.configLoader.onLoadEndListener = r),
          (this.configLoader.onLoadStartListener = n);
      }
      complete() {
        this.transitions?.complete();
      }
      handleNavigationRequest(n) {
        let r = ++this.navigationId;
        this.transitions?.next(
          j(m(m({}, this.transitions.value), n), { id: r }),
        );
      }
      setupNavigations(n, r, o) {
        return (
          (this.transitions = new q({
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
            source: $n,
            restoredState: null,
            currentSnapshot: o.snapshot,
            targetSnapshot: null,
            currentRouterState: o,
            targetRouterState: null,
            guards: { canActivateChecks: [], canDeactivateChecks: [] },
            guardsResult: null,
          })),
          this.transitions.pipe(
            ve((i) => i.id !== 0),
            _((i) =>
              j(m({}, i), {
                extractedUrl: this.urlHandlingStrategy.extract(i.rawUrl),
              }),
            ),
            ye((i) => {
              let s = !1,
                c = !1;
              return C(i).pipe(
                ye((a) => {
                  if (this.navigationId > i.id)
                    return (
                      this.cancelNavigationTransition(
                        i,
                        "",
                        ce.SupersededByNewNavigation,
                      ),
                      oe
                    );
                  (this.currentTransition = i),
                    (this.currentNavigation = {
                      id: a.id,
                      initialUrl: a.rawUrl,
                      extractedUrl: a.extractedUrl,
                      targetBrowserUrl:
                        typeof a.extras.browserUrl == "string"
                          ? this.urlSerializer.parse(a.extras.browserUrl)
                          : a.extras.browserUrl,
                      trigger: a.source,
                      extras: a.extras,
                      previousNavigation: this.lastSuccessfulNavigation
                        ? j(m({}, this.lastSuccessfulNavigation), {
                            previousNavigation: null,
                          })
                        : null,
                    });
                  let u =
                      !n.navigated ||
                      this.isUpdatingInternalState() ||
                      this.isUpdatedBrowserUrl(),
                    l = a.extras.onSameUrlNavigation ?? n.onSameUrlNavigation;
                  if (!u && l !== "reload") {
                    let d = "";
                    return (
                      this.events.next(
                        new gt(
                          a.id,
                          this.urlSerializer.serialize(a.rawUrl),
                          d,
                          ga.IgnoredSameUrlNavigation,
                        ),
                      ),
                      a.resolve(!1),
                      oe
                    );
                  }
                  if (this.urlHandlingStrategy.shouldProcessUrl(a.rawUrl))
                    return C(a).pipe(
                      ye((d) => {
                        let h = this.transitions?.getValue();
                        return (
                          this.events.next(
                            new Gn(
                              d.id,
                              this.urlSerializer.serialize(d.extractedUrl),
                              d.source,
                              d.restoredState,
                            ),
                          ),
                          h !== this.transitions?.getValue()
                            ? oe
                            : Promise.resolve(d)
                        );
                      }),
                      iD(
                        this.environmentInjector,
                        this.configLoader,
                        this.rootComponentType,
                        n.config,
                        this.urlSerializer,
                        this.paramsInheritanceStrategy,
                      ),
                      W((d) => {
                        (i.targetSnapshot = d.targetSnapshot),
                          (i.urlAfterRedirects = d.urlAfterRedirects),
                          (this.currentNavigation = j(
                            m({}, this.currentNavigation),
                            { finalUrl: d.urlAfterRedirects },
                          ));
                        let h = new Fo(
                          d.id,
                          this.urlSerializer.serialize(d.extractedUrl),
                          this.urlSerializer.serialize(d.urlAfterRedirects),
                          d.targetSnapshot,
                        );
                        this.events.next(h);
                      }),
                    );
                  if (
                    u &&
                    this.urlHandlingStrategy.shouldProcessUrl(a.currentRawUrl)
                  ) {
                    let {
                        id: d,
                        extractedUrl: h,
                        source: f,
                        restoredState: g,
                        extras: M,
                      } = a,
                      L = new Gn(d, this.urlSerializer.serialize(h), f, g);
                    this.events.next(L);
                    let k = ff(this.rootComponentType).snapshot;
                    return (
                      (this.currentTransition = i =
                        j(m({}, a), {
                          targetSnapshot: k,
                          urlAfterRedirects: h,
                          extras: j(m({}, M), {
                            skipLocationChange: !1,
                            replaceUrl: !1,
                          }),
                        })),
                      (this.currentNavigation.finalUrl = h),
                      C(i)
                    );
                  } else {
                    let d = "";
                    return (
                      this.events.next(
                        new gt(
                          a.id,
                          this.urlSerializer.serialize(a.extractedUrl),
                          d,
                          ga.IgnoredByUrlHandlingStrategy,
                        ),
                      ),
                      a.resolve(!1),
                      oe
                    );
                  }
                }),
                W((a) => {
                  let u = new ma(
                    a.id,
                    this.urlSerializer.serialize(a.extractedUrl),
                    this.urlSerializer.serialize(a.urlAfterRedirects),
                    a.targetSnapshot,
                  );
                  this.events.next(u);
                }),
                _(
                  (a) => (
                    (this.currentTransition = i =
                      j(m({}, a), {
                        guards: Sy(
                          a.targetSnapshot,
                          a.currentSnapshot,
                          this.rootContexts,
                        ),
                      })),
                    i
                  ),
                ),
                ky(this.environmentInjector, (a) => this.events.next(a)),
                W((a) => {
                  if (
                    ((i.guardsResult = a.guardsResult),
                    a.guardsResult && typeof a.guardsResult != "boolean")
                  )
                    throw $o(this.urlSerializer, a.guardsResult);
                  let u = new va(
                    a.id,
                    this.urlSerializer.serialize(a.extractedUrl),
                    this.urlSerializer.serialize(a.urlAfterRedirects),
                    a.targetSnapshot,
                    !!a.guardsResult,
                  );
                  this.events.next(u);
                }),
                ve((a) =>
                  a.guardsResult
                    ? !0
                    : (this.cancelNavigationTransition(a, "", ce.GuardRejected),
                      !1),
                ),
                ua((a) => {
                  if (a.guards.canActivateChecks.length)
                    return C(a).pipe(
                      W((u) => {
                        let l = new ya(
                          u.id,
                          this.urlSerializer.serialize(u.extractedUrl),
                          this.urlSerializer.serialize(u.urlAfterRedirects),
                          u.targetSnapshot,
                        );
                        this.events.next(l);
                      }),
                      ye((u) => {
                        let l = !1;
                        return C(u).pipe(
                          sD(
                            this.paramsInheritanceStrategy,
                            this.environmentInjector,
                          ),
                          W({
                            next: () => (l = !0),
                            complete: () => {
                              l ||
                                this.cancelNavigationTransition(
                                  u,
                                  "",
                                  ce.NoDataFromResolver,
                                );
                            },
                          }),
                        );
                      }),
                      W((u) => {
                        let l = new Da(
                          u.id,
                          this.urlSerializer.serialize(u.extractedUrl),
                          this.urlSerializer.serialize(u.urlAfterRedirects),
                          u.targetSnapshot,
                        );
                        this.events.next(l);
                      }),
                    );
                }),
                ua((a) => {
                  let u = (l) => {
                    let d = [];
                    l.routeConfig?.loadComponent &&
                      !l.routeConfig._loadedComponent &&
                      d.push(
                        this.configLoader.loadComponent(l.routeConfig).pipe(
                          W((h) => {
                            l.component = h;
                          }),
                          _(() => {}),
                        ),
                      );
                    for (let h of l.children) d.push(...u(h));
                    return d;
                  };
                  return wr(u(a.targetSnapshot.root)).pipe(ze(null), Re(1));
                }),
                ua(() => this.afterPreactivation()),
                ye(() => {
                  let { currentSnapshot: a, targetSnapshot: u } = i,
                    l = this.createViewTransition?.(
                      this.environmentInjector,
                      a.root,
                      u.root,
                    );
                  return l ? U(l).pipe(_(() => i)) : C(i);
                }),
                _((a) => {
                  let u = wy(
                    n.routeReuseStrategy,
                    a.targetSnapshot,
                    a.currentRouterState,
                  );
                  return (
                    (this.currentTransition = i =
                      j(m({}, a), { targetRouterState: u })),
                    (this.currentNavigation.targetRouterState = u),
                    i
                  );
                }),
                W(() => {
                  this.events.next(new Wn());
                }),
                by(
                  this.rootContexts,
                  n.routeReuseStrategy,
                  (a) => this.events.next(a),
                  this.inputBindingEnabled,
                ),
                Re(1),
                W({
                  next: (a) => {
                    (s = !0),
                      (this.lastSuccessfulNavigation = this.currentNavigation),
                      this.events.next(
                        new pt(
                          a.id,
                          this.urlSerializer.serialize(a.extractedUrl),
                          this.urlSerializer.serialize(a.urlAfterRedirects),
                        ),
                      ),
                      this.titleStrategy?.updateTitle(
                        a.targetRouterState.snapshot,
                      ),
                      a.resolve(!0);
                  },
                  complete: () => {
                    s = !0;
                  },
                }),
                mi(
                  this.transitionAbortSubject.pipe(
                    W((a) => {
                      throw a;
                    }),
                  ),
                ),
                ln(() => {
                  !s &&
                    !c &&
                    this.cancelNavigationTransition(
                      i,
                      "",
                      ce.SupersededByNewNavigation,
                    ),
                    this.currentTransition?.id === i.id &&
                      ((this.currentNavigation = null),
                      (this.currentTransition = null));
                }),
                He((a) => {
                  if (((c = !0), vf(a)))
                    this.events.next(
                      new $e(
                        i.id,
                        this.urlSerializer.serialize(i.extractedUrl),
                        a.message,
                        a.cancellationCode,
                      ),
                    ),
                      Ey(a)
                        ? this.events.next(
                            new rn(a.url, a.navigationBehaviorOptions),
                          )
                        : i.resolve(!1);
                  else {
                    let u = new qn(
                      i.id,
                      this.urlSerializer.serialize(i.extractedUrl),
                      a,
                      i.targetSnapshot ?? void 0,
                    );
                    try {
                      let l = ke(this.environmentInjector, () =>
                        this.navigationErrorHandler?.(u),
                      );
                      if (l instanceof Yn) {
                        let { message: d, cancellationCode: h } = $o(
                          this.urlSerializer,
                          l,
                        );
                        this.events.next(
                          new $e(
                            i.id,
                            this.urlSerializer.serialize(i.extractedUrl),
                            d,
                            h,
                          ),
                        ),
                          this.events.next(
                            new rn(l.redirectTo, l.navigationBehaviorOptions),
                          );
                      } else {
                        this.events.next(u);
                        let d = n.errorHandler(a);
                        i.resolve(!!d);
                      }
                    } catch (l) {
                      this.options.resolveNavigationPromiseOnError
                        ? i.resolve(!1)
                        : i.reject(l);
                    }
                  }
                  return oe;
                }),
              );
            }),
          )
        );
      }
      cancelNavigationTransition(n, r, o) {
        let i = new $e(
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
        this.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })();
function DD(e) {
  return e !== $n;
}
var wD = (() => {
    class e {
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = w({ token: e, factory: () => p(CD), providedIn: "root" });
      }
    }
    return e;
  })(),
  ka = class {
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
  CD = (() => {
    class e extends ka {
      static {
        this.ɵfac = (() => {
          let n;
          return function (o) {
            return (n || (n = _s(e)))(o || e);
          };
        })();
      }
      static {
        this.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  Sf = (() => {
    class e {
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = w({ token: e, factory: () => p(ID), providedIn: "root" });
      }
    }
    return e;
  })(),
  ID = (() => {
    class e extends Sf {
      constructor() {
        super(...arguments),
          (this.location = p(Rn)),
          (this.urlSerializer = p(La)),
          (this.options = p(Ba, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || "replace"),
          (this.urlHandlingStrategy = p(za)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.currentUrlTree = new Be()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = ff(null)),
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
        if (n instanceof Gn) this.stateMemento = this.createStateMemento();
        else if (n instanceof gt) this.rawUrlTree = r.initialUrl;
        else if (n instanceof Fo) {
          if (
            this.urlUpdateStrategy === "eager" &&
            !r.extras.skipLocationChange
          ) {
            let o = this.urlHandlingStrategy.merge(r.finalUrl, r.initialUrl);
            this.setBrowserUrl(r.targetBrowserUrl ?? o, r);
          }
        } else
          n instanceof Wn
            ? ((this.currentUrlTree = r.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                r.finalUrl,
                r.initialUrl,
              )),
              (this.routerState = r.targetRouterState),
              this.urlUpdateStrategy === "deferred" &&
                !r.extras.skipLocationChange &&
                this.setBrowserUrl(r.targetBrowserUrl ?? this.rawUrlTree, r))
            : n instanceof $e &&
                (n.code === ce.GuardRejected ||
                  n.code === ce.NoDataFromResolver)
              ? this.restoreHistory(r)
              : n instanceof qn
                ? this.restoreHistory(r, !0)
                : n instanceof pt &&
                  ((this.lastSuccessfulId = n.id),
                  (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(n, r) {
        let o = n instanceof Be ? this.urlSerializer.serialize(n) : n;
        if (this.location.isCurrentPathEqualTo(o) || r.extras.replaceUrl) {
          let i = this.browserPageId,
            s = m(m({}, r.extras.state), this.generateNgRouterState(r.id, i));
          this.location.replaceState(o, "", s);
        } else {
          let i = m(
            m({}, r.extras.state),
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
            return (n || (n = _s(e)))(o || e);
          };
        })();
      }
      static {
        this.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  jn = (function (e) {
    return (
      (e[(e.COMPLETE = 0)] = "COMPLETE"),
      (e[(e.FAILED = 1)] = "FAILED"),
      (e[(e.REDIRECTING = 2)] = "REDIRECTING"),
      e
    );
  })(jn || {});
function ED(e, t) {
  e.events
    .pipe(
      ve(
        (n) =>
          n instanceof pt ||
          n instanceof $e ||
          n instanceof qn ||
          n instanceof gt,
      ),
      _((n) =>
        n instanceof pt || n instanceof gt
          ? jn.COMPLETE
          : (
                n instanceof $e
                  ? n.code === ce.Redirect ||
                    n.code === ce.SupersededByNewNavigation
                  : !1
              )
            ? jn.REDIRECTING
            : jn.FAILED,
      ),
      ve((n) => n !== jn.REDIRECTING),
      Re(1),
    )
    .subscribe(() => {
      t();
    });
}
function bD(e) {
  throw e;
}
var SD = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  MD = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  Mf = (() => {
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
          (this.console = p(Co)),
          (this.stateManager = p(Sf)),
          (this.options = p(Ba, { optional: !0 }) || {}),
          (this.pendingTasks = p(Wt)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.navigationTransitions = p(yD)),
          (this.urlSerializer = p(La)),
          (this.location = p(Rn)),
          (this.urlHandlingStrategy = p(za)),
          (this._events = new Q()),
          (this.errorHandler = this.options.errorHandler || bD),
          (this.navigated = !1),
          (this.routeReuseStrategy = p(wD)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || "ignore"),
          (this.config = p(Ha, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!p($a, { optional: !0 })),
          (this.eventsSubscription = new V()),
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
                r instanceof $e &&
                  r.code !== ce.Redirect &&
                  r.code !== ce.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (r instanceof pt) this.navigated = !0;
              else if (r instanceof rn) {
                let s = r.navigationBehaviorOptions,
                  c = this.urlHandlingStrategy.merge(r.url, o.currentRawUrl),
                  a = m(
                    {
                      browserUrl: o.extras.browserUrl,
                      info: o.extras.info,
                      skipLocationChange: o.extras.skipLocationChange,
                      replaceUrl:
                        o.extras.replaceUrl ||
                        this.urlUpdateStrategy === "eager" ||
                        DD(o.source),
                    },
                    s,
                  );
                this.scheduleNavigation(c, $n, null, a, {
                  resolve: o.resolve,
                  reject: o.reject,
                  promise: o.promise,
                });
              }
            }
            TD(r) && this._events.next(r);
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
              $n,
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
          let a = m({}, o);
          delete a.navigationId,
            delete a.ɵrouterPageId,
            Object.keys(a).length !== 0 && (i.state = a);
        }
        let c = this.parseUrl(n);
        this.scheduleNavigation(c, r, s, i);
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
        (this.config = n.map(Ua)), (this.navigated = !1);
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
            queryParamsHandling: c,
            preserveFragment: a,
          } = r,
          u = a ? this.currentUrlTree.fragment : s,
          l = null;
        switch (c ?? this.options.defaultQueryParamsHandling) {
          case "merge":
            l = m(m({}, this.currentUrlTree.queryParams), i);
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
          let h = o ? o.snapshot : this.routerState.snapshot.root;
          d = cf(h);
        } catch {
          (typeof n[0] != "string" || n[0][0] !== "/") && (n = []),
            (d = this.currentUrlTree.root);
        }
        return uf(d, n, l, u ?? null);
      }
      navigateByUrl(n, r = { skipLocationChange: !1 }) {
        let o = Hn(n) ? n : this.parseUrl(n),
          i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
        return this.scheduleNavigation(i, $n, null, r);
      }
      navigate(n, r = { skipLocationChange: !1 }) {
        return _D(n), this.navigateByUrl(this.createUrlTree(n, r), r);
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
          (r === !0 ? (o = m({}, SD)) : r === !1 ? (o = m({}, MD)) : (o = r),
          Hn(n))
        )
          return zd(this.currentUrlTree, n, o);
        let i = this.parseUrl(n);
        return zd(this.currentUrlTree, i, o);
      }
      removeEmptyProps(n) {
        return Object.entries(n).reduce(
          (r, [o, i]) => (i != null && (r[o] = i), r),
          {},
        );
      }
      scheduleNavigation(n, r, o, i, s) {
        if (this.disposed) return Promise.resolve(!1);
        let c, a, u;
        s
          ? ((c = s.resolve), (a = s.reject), (u = s.promise))
          : (u = new Promise((d, h) => {
              (c = d), (a = h);
            }));
        let l = this.pendingTasks.add();
        return (
          ED(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(l));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: r,
            restoredState: o,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: n,
            extras: i,
            resolve: c,
            reject: a,
            promise: u,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          u.catch((d) => Promise.reject(d))
        );
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })();
function _D(e) {
  for (let t = 0; t < e.length; t++) if (e[t] == null) throw new v(4008, !1);
}
function TD(e) {
  return !(e instanceof Wn) && !(e instanceof rn);
}
var xD = new E("");
function _f(e, ...t) {
  return Xr([
    { provide: Ha, multi: !0, useValue: e },
    [],
    { provide: on, useFactory: ND, deps: [Mf] },
    { provide: Ys, multi: !0, useFactory: AD },
    t.map((n) => n.ɵproviders),
  ]);
}
function ND(e) {
  return e.routerState.root;
}
function AD() {
  let e = p(at);
  return (t) => {
    let n = e.get(lt);
    if (t !== n.components[0]) return;
    let r = e.get(Mf),
      o = e.get(RD);
    e.get(OD) === 1 && r.initialNavigation(),
      e.get(PD, null, b.Optional)?.setUpPreloading(),
      e.get(xD, null, b.Optional)?.init(),
      r.resetRootComponentType(n.componentTypes[0]),
      o.closed || (o.next(), o.complete(), o.unsubscribe());
  };
}
var RD = new E("", { factory: () => new Q() }),
  OD = new E("", { providedIn: "root", factory: () => 1 });
var PD = new E("");
var Tf = [];
var xf = { providers: [yd({ eventCoalescing: !0 }), _f(Tf)] };
var FD = (e, t) => t.title,
  kD = () => ({ title: "Explore the Docs", link: "https://angular.dev" }),
  LD = () => ({
    title: "Learn with Tutorials",
    link: "https://angular.dev/tutorials",
  }),
  jD = () => ({ title: "CLI Docs", link: "https://angular.dev/tools/cli" }),
  VD = () => ({
    title: "Angular Language Service",
    link: "https://angular.dev/tools/language-service",
  }),
  $D = () => ({
    title: "Angular DevTools",
    link: "https://angular.dev/tools/devtools",
  }),
  BD = (e, t, n, r, o) => [e, t, n, r, o];
function UD(e, t) {
  if (
    (e & 1 &&
      (z(0, "a", 21)(1, "span"),
      yo(2),
      ee(),
      qt(),
      z(3, "svg", 32),
      ne(4, "path", 33),
      ee()()),
    e & 2)
  ) {
    let n = t.$implicit;
    Ws("href", n.link, Tl), lo(2), Zs(n.title);
  }
}
var zo = class e {
  title = "new";
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = Jr({
    type: e,
    selectors: [["app-root"]],
    standalone: !0,
    features: [wo],
    decls: 39,
    vars: 12,
    consts: [
      [1, "main"],
      [1, "content"],
      [1, "left-side"],
      [
        "xmlns",
        "http://www.w3.org/2000/svg",
        "viewBox",
        "0 0 982 239",
        "fill",
        "none",
        1,
        "angular-logo",
      ],
      ["clip-path", "url(#a)"],
      [
        "fill",
        "url(#b)",
        "d",
        "M388.676 191.625h30.849L363.31 31.828h-35.758l-56.215 159.797h30.848l13.174-39.356h60.061l13.256 39.356Zm-65.461-62.675 21.602-64.311h1.227l21.602 64.311h-44.431Zm126.831-7.527v70.202h-28.23V71.839h27.002v20.374h1.392c2.782-6.71 7.2-12.028 13.255-15.956 6.056-3.927 13.584-5.89 22.503-5.89 8.264 0 15.465 1.8 21.684 5.318 6.137 3.518 10.964 8.673 14.319 15.382 3.437 6.71 5.074 14.81 4.992 24.383v76.175h-28.23v-71.92c0-8.019-2.046-14.237-6.219-18.819-4.173-4.5-9.819-6.791-17.102-6.791-4.91 0-9.328 1.063-13.174 3.272-3.846 2.128-6.792 5.237-9.001 9.328-2.046 4.009-3.191 8.918-3.191 14.728ZM589.233 239c-10.147 0-18.82-1.391-26.103-4.091-7.282-2.7-13.092-6.382-17.511-10.964-4.418-4.582-7.528-9.655-9.164-15.219l25.448-6.136c1.145 2.372 2.782 4.663 4.991 6.954 2.209 2.291 5.155 4.255 8.837 5.81 3.683 1.554 8.428 2.291 14.074 2.291 8.019 0 14.647-1.964 19.884-5.81 5.237-3.845 7.856-10.227 7.856-19.064v-22.665h-1.391c-1.473 2.946-3.601 5.892-6.383 9.001-2.782 3.109-6.464 5.645-10.965 7.691-4.582 2.046-10.228 3.109-17.101 3.109-9.165 0-17.511-2.209-25.039-6.545-7.446-4.337-13.42-10.883-17.757-19.474-4.418-8.673-6.628-19.473-6.628-32.565 0-13.091 2.21-24.301 6.628-33.383 4.419-9.082 10.311-15.955 17.839-20.7 7.528-4.746 15.874-7.037 25.039-7.037 7.037 0 12.846 1.145 17.347 3.518 4.582 2.373 8.182 5.236 10.883 8.51 2.7 3.272 4.746 6.382 6.137 9.327h1.554v-19.8h27.821v121.749c0 10.228-2.454 18.737-7.364 25.447-4.91 6.709-11.538 11.7-20.048 15.055-8.509 3.355-18.165 4.991-28.884 4.991Zm.245-71.266c5.974 0 11.047-1.473 15.302-4.337 4.173-2.945 7.446-7.118 9.573-12.519 2.21-5.482 3.274-12.027 3.274-19.637 0-7.609-1.064-14.155-3.274-19.8-2.127-5.646-5.318-10.064-9.491-13.255-4.174-3.11-9.329-4.746-15.384-4.746s-11.537 1.636-15.792 4.91c-4.173 3.272-7.365 7.772-9.492 13.418-2.128 5.727-3.191 12.191-3.191 19.392 0 7.2 1.063 13.745 3.273 19.228 2.127 5.482 5.318 9.736 9.573 12.764 4.174 3.027 9.41 4.582 15.629 4.582Zm141.56-26.51V71.839h28.23v119.786h-27.412v-21.273h-1.227c-2.7 6.709-7.119 12.191-13.338 16.446-6.137 4.255-13.747 6.382-22.748 6.382-7.855 0-14.81-1.718-20.783-5.237-5.974-3.518-10.72-8.591-14.075-15.382-3.355-6.709-5.073-14.891-5.073-24.464V71.839h28.312v71.921c0 7.609 2.046 13.664 6.219 18.083 4.173 4.5 9.655 6.709 16.365 6.709 4.173 0 8.183-.982 12.111-3.028 3.927-2.045 7.118-5.072 9.655-9.082 2.537-4.091 3.764-9.164 3.764-15.218Zm65.707-109.395v159.796h-28.23V31.828h28.23Zm44.841 162.169c-7.61 0-14.402-1.391-20.457-4.091-6.055-2.7-10.883-6.791-14.32-12.109-3.518-5.319-5.237-11.946-5.237-19.801 0-6.791 1.228-12.355 3.765-16.773 2.536-4.419 5.891-7.937 10.228-10.637 4.337-2.618 9.164-4.664 14.647-6.055 5.4-1.391 11.046-2.373 16.856-3.027 7.037-.737 12.683-1.391 17.102-1.964 4.337-.573 7.528-1.555 9.574-2.782 1.963-1.309 3.027-3.273 3.027-5.973v-.491c0-5.891-1.718-10.391-5.237-13.664-3.518-3.191-8.51-4.828-15.056-4.828-6.955 0-12.356 1.473-16.447 4.5-4.009 3.028-6.71 6.546-8.183 10.719l-26.348-3.764c2.046-7.282 5.483-13.336 10.31-18.328 4.746-4.909 10.638-8.59 17.511-11.045 6.955-2.455 14.565-3.682 22.912-3.682 5.809 0 11.537.654 17.265 2.045s10.965 3.6 15.711 6.71c4.746 3.109 8.51 7.282 11.455 12.6 2.864 5.318 4.337 11.946 4.337 19.883v80.184h-27.166v-16.446h-.9c-1.719 3.355-4.092 6.464-7.201 9.328-3.109 2.864-6.955 5.237-11.619 6.955-4.828 1.718-10.229 2.536-16.529 2.536Zm7.364-20.701c5.646 0 10.556-1.145 14.729-3.354 4.173-2.291 7.364-5.237 9.655-9.001 2.292-3.763 3.355-7.854 3.355-12.273v-14.155c-.9.737-2.373 1.391-4.5 2.046-2.128.654-4.419 1.145-7.037 1.636-2.619.491-5.155.9-7.692 1.227-2.537.328-4.746.655-6.628.901-4.173.572-8.019 1.472-11.292 2.781-3.355 1.31-5.973 3.11-7.855 5.401-1.964 2.291-2.864 5.318-2.864 8.918 0 5.237 1.882 9.164 5.728 11.782 3.682 2.782 8.51 4.091 14.401 4.091Zm64.643 18.328V71.839h27.412v19.965h1.227c2.21-6.955 5.974-12.274 11.292-16.038 5.319-3.763 11.456-5.645 18.329-5.645 1.555 0 3.355.082 5.237.163 1.964.164 3.601.328 4.91.573v25.938c-1.227-.41-3.109-.819-5.646-1.146a58.814 58.814 0 0 0-7.446-.49c-5.155 0-9.738 1.145-13.829 3.354-4.091 2.209-7.282 5.236-9.655 9.164-2.373 3.927-3.519 8.427-3.519 13.5v70.448h-28.312ZM222.077 39.192l-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z",
      ],
      [
        "fill",
        "url(#c)",
        "d",
        "M388.676 191.625h30.849L363.31 31.828h-35.758l-56.215 159.797h30.848l13.174-39.356h60.061l13.256 39.356Zm-65.461-62.675 21.602-64.311h1.227l21.602 64.311h-44.431Zm126.831-7.527v70.202h-28.23V71.839h27.002v20.374h1.392c2.782-6.71 7.2-12.028 13.255-15.956 6.056-3.927 13.584-5.89 22.503-5.89 8.264 0 15.465 1.8 21.684 5.318 6.137 3.518 10.964 8.673 14.319 15.382 3.437 6.71 5.074 14.81 4.992 24.383v76.175h-28.23v-71.92c0-8.019-2.046-14.237-6.219-18.819-4.173-4.5-9.819-6.791-17.102-6.791-4.91 0-9.328 1.063-13.174 3.272-3.846 2.128-6.792 5.237-9.001 9.328-2.046 4.009-3.191 8.918-3.191 14.728ZM589.233 239c-10.147 0-18.82-1.391-26.103-4.091-7.282-2.7-13.092-6.382-17.511-10.964-4.418-4.582-7.528-9.655-9.164-15.219l25.448-6.136c1.145 2.372 2.782 4.663 4.991 6.954 2.209 2.291 5.155 4.255 8.837 5.81 3.683 1.554 8.428 2.291 14.074 2.291 8.019 0 14.647-1.964 19.884-5.81 5.237-3.845 7.856-10.227 7.856-19.064v-22.665h-1.391c-1.473 2.946-3.601 5.892-6.383 9.001-2.782 3.109-6.464 5.645-10.965 7.691-4.582 2.046-10.228 3.109-17.101 3.109-9.165 0-17.511-2.209-25.039-6.545-7.446-4.337-13.42-10.883-17.757-19.474-4.418-8.673-6.628-19.473-6.628-32.565 0-13.091 2.21-24.301 6.628-33.383 4.419-9.082 10.311-15.955 17.839-20.7 7.528-4.746 15.874-7.037 25.039-7.037 7.037 0 12.846 1.145 17.347 3.518 4.582 2.373 8.182 5.236 10.883 8.51 2.7 3.272 4.746 6.382 6.137 9.327h1.554v-19.8h27.821v121.749c0 10.228-2.454 18.737-7.364 25.447-4.91 6.709-11.538 11.7-20.048 15.055-8.509 3.355-18.165 4.991-28.884 4.991Zm.245-71.266c5.974 0 11.047-1.473 15.302-4.337 4.173-2.945 7.446-7.118 9.573-12.519 2.21-5.482 3.274-12.027 3.274-19.637 0-7.609-1.064-14.155-3.274-19.8-2.127-5.646-5.318-10.064-9.491-13.255-4.174-3.11-9.329-4.746-15.384-4.746s-11.537 1.636-15.792 4.91c-4.173 3.272-7.365 7.772-9.492 13.418-2.128 5.727-3.191 12.191-3.191 19.392 0 7.2 1.063 13.745 3.273 19.228 2.127 5.482 5.318 9.736 9.573 12.764 4.174 3.027 9.41 4.582 15.629 4.582Zm141.56-26.51V71.839h28.23v119.786h-27.412v-21.273h-1.227c-2.7 6.709-7.119 12.191-13.338 16.446-6.137 4.255-13.747 6.382-22.748 6.382-7.855 0-14.81-1.718-20.783-5.237-5.974-3.518-10.72-8.591-14.075-15.382-3.355-6.709-5.073-14.891-5.073-24.464V71.839h28.312v71.921c0 7.609 2.046 13.664 6.219 18.083 4.173 4.5 9.655 6.709 16.365 6.709 4.173 0 8.183-.982 12.111-3.028 3.927-2.045 7.118-5.072 9.655-9.082 2.537-4.091 3.764-9.164 3.764-15.218Zm65.707-109.395v159.796h-28.23V31.828h28.23Zm44.841 162.169c-7.61 0-14.402-1.391-20.457-4.091-6.055-2.7-10.883-6.791-14.32-12.109-3.518-5.319-5.237-11.946-5.237-19.801 0-6.791 1.228-12.355 3.765-16.773 2.536-4.419 5.891-7.937 10.228-10.637 4.337-2.618 9.164-4.664 14.647-6.055 5.4-1.391 11.046-2.373 16.856-3.027 7.037-.737 12.683-1.391 17.102-1.964 4.337-.573 7.528-1.555 9.574-2.782 1.963-1.309 3.027-3.273 3.027-5.973v-.491c0-5.891-1.718-10.391-5.237-13.664-3.518-3.191-8.51-4.828-15.056-4.828-6.955 0-12.356 1.473-16.447 4.5-4.009 3.028-6.71 6.546-8.183 10.719l-26.348-3.764c2.046-7.282 5.483-13.336 10.31-18.328 4.746-4.909 10.638-8.59 17.511-11.045 6.955-2.455 14.565-3.682 22.912-3.682 5.809 0 11.537.654 17.265 2.045s10.965 3.6 15.711 6.71c4.746 3.109 8.51 7.282 11.455 12.6 2.864 5.318 4.337 11.946 4.337 19.883v80.184h-27.166v-16.446h-.9c-1.719 3.355-4.092 6.464-7.201 9.328-3.109 2.864-6.955 5.237-11.619 6.955-4.828 1.718-10.229 2.536-16.529 2.536Zm7.364-20.701c5.646 0 10.556-1.145 14.729-3.354 4.173-2.291 7.364-5.237 9.655-9.001 2.292-3.763 3.355-7.854 3.355-12.273v-14.155c-.9.737-2.373 1.391-4.5 2.046-2.128.654-4.419 1.145-7.037 1.636-2.619.491-5.155.9-7.692 1.227-2.537.328-4.746.655-6.628.901-4.173.572-8.019 1.472-11.292 2.781-3.355 1.31-5.973 3.11-7.855 5.401-1.964 2.291-2.864 5.318-2.864 8.918 0 5.237 1.882 9.164 5.728 11.782 3.682 2.782 8.51 4.091 14.401 4.091Zm64.643 18.328V71.839h27.412v19.965h1.227c2.21-6.955 5.974-12.274 11.292-16.038 5.319-3.763 11.456-5.645 18.329-5.645 1.555 0 3.355.082 5.237.163 1.964.164 3.601.328 4.91.573v25.938c-1.227-.41-3.109-.819-5.646-1.146a58.814 58.814 0 0 0-7.446-.49c-5.155 0-9.738 1.145-13.829 3.354-4.091 2.209-7.282 5.236-9.655 9.164-2.373 3.927-3.519 8.427-3.519 13.5v70.448h-28.312ZM222.077 39.192l-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z",
      ],
      [
        "id",
        "c",
        "cx",
        "0",
        "cy",
        "0",
        "r",
        "1",
        "gradientTransform",
        "rotate(118.122 171.182 60.81) scale(205.794)",
        "gradientUnits",
        "userSpaceOnUse",
      ],
      ["stop-color", "#FF41F8"],
      ["offset", ".707", "stop-color", "#FF41F8", "stop-opacity", ".5"],
      ["offset", "1", "stop-color", "#FF41F8", "stop-opacity", "0"],
      [
        "id",
        "b",
        "x1",
        "0",
        "x2",
        "982",
        "y1",
        "192",
        "y2",
        "192",
        "gradientUnits",
        "userSpaceOnUse",
      ],
      ["stop-color", "#F0060B"],
      ["offset", "0", "stop-color", "#F0070C"],
      ["offset", ".526", "stop-color", "#CC26D5"],
      ["offset", "1", "stop-color", "#7702FF"],
      ["id", "a"],
      ["fill", "#fff", "d", "M0 0h982v239H0z"],
      ["role", "separator", "aria-label", "Divider", 1, "divider"],
      [1, "right-side"],
      [1, "pill-group"],
      ["target", "_blank", "rel", "noopener", 1, "pill", 3, "href"],
      [1, "social-links"],
      [
        "href",
        "https://github.com/angular/angular",
        "aria-label",
        "Github",
        "target",
        "_blank",
        "rel",
        "noopener",
      ],
      [
        "width",
        "25",
        "height",
        "24",
        "viewBox",
        "0 0 25 24",
        "fill",
        "none",
        "xmlns",
        "http://www.w3.org/2000/svg",
        "alt",
        "Github",
      ],
      [
        "d",
        "M12.3047 0C5.50634 0 0 5.50942 0 12.3047C0 17.7423 3.52529 22.3535 8.41332 23.9787C9.02856 24.0946 9.25414 23.7142 9.25414 23.3871C9.25414 23.0949 9.24389 22.3207 9.23876 21.2953C5.81601 22.0377 5.09414 19.6444 5.09414 19.6444C4.53427 18.2243 3.72524 17.8449 3.72524 17.8449C2.61064 17.082 3.81137 17.0973 3.81137 17.0973C5.04697 17.1835 5.69604 18.3647 5.69604 18.3647C6.79321 20.2463 8.57636 19.7029 9.27978 19.3881C9.39052 18.5924 9.70736 18.0499 10.0591 17.7423C7.32641 17.4347 4.45429 16.3765 4.45429 11.6618C4.45429 10.3185 4.9311 9.22133 5.72065 8.36C5.58222 8.04931 5.16694 6.79833 5.82831 5.10337C5.82831 5.10337 6.85883 4.77319 9.2121 6.36459C10.1965 6.09082 11.2424 5.95546 12.2883 5.94931C13.3342 5.95546 14.3801 6.09082 15.3644 6.36459C17.7023 4.77319 18.7328 5.10337 18.7328 5.10337C19.3942 6.79833 18.9789 8.04931 18.8559 8.36C19.6403 9.22133 20.1171 10.3185 20.1171 11.6618C20.1171 16.3888 17.2409 17.4296 14.5031 17.7321C14.9338 18.1012 15.3337 18.8559 15.3337 20.0084C15.3337 21.6552 15.3183 22.978 15.3183 23.3779C15.3183 23.7009 15.5336 24.0854 16.1642 23.9623C21.0871 22.3484 24.6094 17.7341 24.6094 12.3047C24.6094 5.50942 19.0999 0 12.3047 0Z",
      ],
      [
        "href",
        "https://twitter.com/angular",
        "aria-label",
        "Twitter",
        "target",
        "_blank",
        "rel",
        "noopener",
      ],
      [
        "width",
        "24",
        "height",
        "24",
        "viewBox",
        "0 0 24 24",
        "fill",
        "none",
        "xmlns",
        "http://www.w3.org/2000/svg",
        "alt",
        "Twitter",
      ],
      [
        "d",
        "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
      ],
      [
        "href",
        "https://www.youtube.com/channel/UCbn1OgGei-DV7aSRo_HaAiw",
        "aria-label",
        "Youtube",
        "target",
        "_blank",
        "rel",
        "noopener",
      ],
      [
        "width",
        "29",
        "height",
        "20",
        "viewBox",
        "0 0 29 20",
        "fill",
        "none",
        "xmlns",
        "http://www.w3.org/2000/svg",
        "alt",
        "Youtube",
      ],
      [
        "fill-rule",
        "evenodd",
        "clip-rule",
        "evenodd",
        "d",
        "M27.4896 1.52422C27.9301 1.96749 28.2463 2.51866 28.4068 3.12258C29.0004 5.35161 29.0004 10 29.0004 10C29.0004 10 29.0004 14.6484 28.4068 16.8774C28.2463 17.4813 27.9301 18.0325 27.4896 18.4758C27.0492 18.9191 26.5 19.2389 25.8972 19.4032C23.6778 20 14.8068 20 14.8068 20C14.8068 20 5.93586 20 3.71651 19.4032C3.11363 19.2389 2.56449 18.9191 2.12405 18.4758C1.68361 18.0325 1.36732 17.4813 1.20683 16.8774C0.613281 14.6484 0.613281 10 0.613281 10C0.613281 10 0.613281 5.35161 1.20683 3.12258C1.36732 2.51866 1.68361 1.96749 2.12405 1.52422C2.56449 1.08095 3.11363 0.76113 3.71651 0.596774C5.93586 0 14.8068 0 14.8068 0C14.8068 0 23.6778 0 25.8972 0.596774C26.5 0.76113 27.0492 1.08095 27.4896 1.52422ZM19.3229 10L11.9036 5.77905V14.221L19.3229 10Z",
      ],
      [
        "xmlns",
        "http://www.w3.org/2000/svg",
        "height",
        "14",
        "viewBox",
        "0 -960 960 960",
        "width",
        "14",
        "fill",
        "currentColor",
      ],
      [
        "d",
        "M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z",
      ],
    ],
    template: function (n, r) {
      n & 1 &&
        (z(0, "main", 0)(1, "div", 1)(2, "div", 2),
        qt(),
        z(3, "svg", 3)(4, "g", 4),
        ne(5, "path", 5)(6, "path", 6),
        ee(),
        z(7, "defs")(8, "radialGradient", 7),
        ne(9, "stop", 8)(10, "stop", 9)(11, "stop", 10),
        ee(),
        z(12, "linearGradient", 11),
        ne(13, "stop", 12)(14, "stop", 13)(15, "stop", 14)(16, "stop", 15),
        ee(),
        z(17, "clipPath", 16),
        ne(18, "path", 17),
        ee()()(),
        Tn(),
        z(19, "h1"),
        yo(20),
        ee(),
        z(21, "p"),
        yo(22, "Congratulations! Your app is running. \u{1F389}"),
        ee()(),
        ne(23, "div", 18),
        z(24, "div", 19)(25, "div", 20),
        ld(26, UD, 5, 2, "a", 21, FD),
        ee(),
        z(28, "div", 22)(29, "a", 23),
        qt(),
        z(30, "svg", 24),
        ne(31, "path", 25),
        ee()(),
        Tn(),
        z(32, "a", 26),
        qt(),
        z(33, "svg", 27),
        ne(34, "path", 28),
        ee()(),
        Tn(),
        z(35, "a", 29),
        qt(),
        z(36, "svg", 30),
        ne(37, "path", 31),
        ee()()()()()(),
        Tn(),
        ne(38, "router-outlet")),
        n & 2 &&
          (lo(20),
          Do("Hello, ", r.title, ""),
          lo(6),
          dd(fd(6, BD, Yt(1, kD), Yt(2, LD), Yt(3, jD), Yt(4, VD), Yt(5, $D))));
    },
    dependencies: [Va],
    styles: [
      `[_nghost-%COMP%] {
    --bright-blue: oklch(51.01% 0.274 263.83);
    --electric-violet: oklch(53.18% 0.28 296.97);
    --french-violet: oklch(47.66% 0.246 305.88);
    --vivid-pink: oklch(69.02% 0.277 332.77);
    --hot-red: oklch(61.42% 0.238 15.34);
    --orange-red: oklch(63.32% 0.24 31.68);

    --gray-900: oklch(19.37% 0.006 300.98);
    --gray-700: oklch(36.98% 0.014 302.71);
    --gray-400: oklch(70.9% 0.015 304.04);

    --red-to-pink-to-purple-vertical-gradient: linear-gradient(
      180deg,
      var(--orange-red) 0%,
      var(--vivid-pink) 50%,
      var(--electric-violet) 100%
    );

    --red-to-pink-to-purple-horizontal-gradient: linear-gradient(
      90deg,
      var(--orange-red) 0%,
      var(--vivid-pink) 50%,
      var(--electric-violet) 100%
    );

    --pill-accent: var(--bright-blue);

    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1[_ngcontent-%COMP%] {
    font-size: 3.125rem;
    color: var(--gray-900);
    font-weight: 500;
    line-height: 100%;
    letter-spacing: -0.125rem;
    margin: 0;
    font-family: "Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
  }

  p[_ngcontent-%COMP%] {
    margin: 0;
    color: var(--gray-700);
  }

  main[_ngcontent-%COMP%] {
    width: 100%;
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    box-sizing: inherit;
    position: relative;
  }

  .angular-logo[_ngcontent-%COMP%] {
    max-width: 9.2rem;
  }

  .content[_ngcontent-%COMP%] {
    display: flex;
    justify-content: space-around;
    width: 100%;
    max-width: 700px;
    margin-bottom: 3rem;
  }

  .content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
    margin-top: 1.75rem;
  }

  .content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {
    margin-top: 1.5rem;
  }

  .divider[_ngcontent-%COMP%] {
    width: 1px;
    background: var(--red-to-pink-to-purple-vertical-gradient);
    margin-inline: 0.5rem;
  }

  .pill-group[_ngcontent-%COMP%] {
    display: flex;
    flex-direction: column;
    align-items: start;
    flex-wrap: wrap;
    gap: 1.25rem;
  }

  .pill[_ngcontent-%COMP%] {
    display: flex;
    align-items: center;
    --pill-accent: var(--bright-blue);
    background: color-mix(in srgb, var(--pill-accent) 5%, transparent);
    color: var(--pill-accent);
    padding-inline: 0.75rem;
    padding-block: 0.375rem;
    border-radius: 2.75rem;
    border: 0;
    transition: background 0.3s ease;
    font-family: var(--inter-font);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.4rem;
    letter-spacing: -0.00875rem;
    text-decoration: none;
  }

  .pill[_ngcontent-%COMP%]:hover {
    background: color-mix(in srgb, var(--pill-accent) 15%, transparent);
  }

  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 1) {
    --pill-accent: var(--bright-blue);
  }
  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 2) {
    --pill-accent: var(--french-violet);
  }
  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 3), 
   .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 4), 
   .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 5) {
    --pill-accent: var(--hot-red);
  }

  .pill-group[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {
    margin-inline-start: 0.25rem;
  }

  .social-links[_ngcontent-%COMP%] {
    display: flex;
    align-items: center;
    gap: 0.73rem;
    margin-top: 1.5rem;
  }

  .social-links[_ngcontent-%COMP%]   path[_ngcontent-%COMP%] {
    transition: fill 0.3s ease;
    fill: var(--gray-400);
  }

  .social-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%]   path[_ngcontent-%COMP%] {
    fill: var(--gray-900);
  }

  @media screen and (max-width: 650px) {
    .content[_ngcontent-%COMP%] {
      flex-direction: column;
      width: max-content;
    }

    .divider[_ngcontent-%COMP%] {
      height: 1px;
      width: 100%;
      background: var(--red-to-pink-to-purple-horizontal-gradient);
      margin-block: 1.5rem;
    }
  }`,
    ],
  });
};
Ud(zo, xf).catch((e) => console.error(e));
