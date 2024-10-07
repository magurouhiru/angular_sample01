var kd = Object.defineProperty,
  Ld = Object.defineProperties;
var jd = Object.getOwnPropertyDescriptors;
var ua = Object.getOwnPropertySymbols;
var Vd = Object.prototype.hasOwnProperty,
  $d = Object.prototype.propertyIsEnumerable;
var ca = (e, t, n) =>
    t in e
      ? kd(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  g = (e, t) => {
    for (var n in (t ||= {})) Vd.call(t, n) && ca(e, n, t[n]);
    if (ua) for (var n of ua(t)) $d.call(t, n) && ca(e, n, t[n]);
    return e;
  },
  k = (e, t) => Ld(e, jd(t));
var bo = null;
var Eo = 1,
  la = Symbol("SIGNAL");
function P(e) {
  let t = bo;
  return (bo = e), t;
}
function da() {
  return bo;
}
var So = {
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
function Bd(e) {
  if (!(No(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === Eo)) {
    if (!e.producerMustRecompute(e) && !_o(e)) {
      (e.dirty = !1), (e.lastCleanEpoch = Eo);
      return;
    }
    e.producerRecomputeValue(e), (e.dirty = !1), (e.lastCleanEpoch = Eo);
  }
}
function Mo(e) {
  return e && (e.nextProducerIndex = 0), P(e);
}
function fa(e, t) {
  if (
    (P(t),
    !(
      !e ||
      e.producerNode === void 0 ||
      e.producerIndexOfThis === void 0 ||
      e.producerLastReadVersion === void 0
    ))
  ) {
    if (No(e))
      for (let n = e.nextProducerIndex; n < e.producerNode.length; n++)
        xo(e.producerNode[n], e.producerIndexOfThis[n]);
    for (; e.producerNode.length > e.nextProducerIndex; )
      e.producerNode.pop(),
        e.producerLastReadVersion.pop(),
        e.producerIndexOfThis.pop();
  }
}
function _o(e) {
  Ao(e);
  for (let t = 0; t < e.producerNode.length; t++) {
    let n = e.producerNode[t],
      r = e.producerLastReadVersion[t];
    if (r !== n.version || (Bd(n), r !== n.version)) return !0;
  }
  return !1;
}
function To(e) {
  if ((Ao(e), No(e)))
    for (let t = 0; t < e.producerNode.length; t++)
      xo(e.producerNode[t], e.producerIndexOfThis[t]);
  (e.producerNode.length =
    e.producerLastReadVersion.length =
    e.producerIndexOfThis.length =
      0),
    e.liveConsumerNode &&
      (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
}
function xo(e, t) {
  if ((Ud(e), e.liveConsumerNode.length === 1 && Hd(e)))
    for (let r = 0; r < e.producerNode.length; r++)
      xo(e.producerNode[r], e.producerIndexOfThis[r]);
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
    Ao(o), (o.producerIndexOfThis[r] = t);
  }
}
function No(e) {
  return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
}
function Ao(e) {
  (e.producerNode ??= []),
    (e.producerIndexOfThis ??= []),
    (e.producerLastReadVersion ??= []);
}
function Ud(e) {
  (e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
}
function Hd(e) {
  return e.producerNode !== void 0;
}
function zd() {
  throw new Error();
}
var Gd = zd;
function ha(e) {
  Gd = e;
}
function y(e) {
  return typeof e == "function";
}
function ht(e) {
  let n = e((r) => {
    Error.call(r), (r.stack = new Error().stack);
  });
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  );
}
var Hn = ht(
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
          t = i instanceof Hn ? i.errors : [i];
        }
      let { _finalizers: o } = this;
      if (o) {
        this._finalizers = null;
        for (let i of o)
          try {
            pa(i);
          } catch (s) {
            (t = t ?? []),
              s instanceof Hn ? (t = [...t, ...s.errors]) : t.push(s);
          }
      }
      if (t) throw new Hn(t);
    }
  }
  add(t) {
    var n;
    if (t && t !== this)
      if (this.closed) pa(t);
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
var Ro = j.EMPTY;
function zn(e) {
  return (
    e instanceof j ||
    (e && "closed" in e && y(e.remove) && y(e.add) && y(e.unsubscribe))
  );
}
function pa(e) {
  y(e) ? e() : e.unsubscribe();
}
var ce = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var pt = {
  setTimeout(e, t, ...n) {
    let { delegate: r } = pt;
    return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
  },
  clearTimeout(e) {
    let { delegate: t } = pt;
    return (t?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function Gn(e) {
  pt.setTimeout(() => {
    let { onUnhandledError: t } = ce;
    if (t) t(e);
    else throw e;
  });
}
function Jt() {}
var ga = Oo("C", void 0, void 0);
function ma(e) {
  return Oo("E", void 0, e);
}
function va(e) {
  return Oo("N", e, void 0);
}
function Oo(e, t, n) {
  return { kind: e, value: t, error: n };
}
var Ze = null;
function gt(e) {
  if (ce.useDeprecatedSynchronousErrorHandling) {
    let t = !Ze;
    if ((t && (Ze = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: n, error: r } = Ze;
      if (((Ze = null), n)) throw r;
    }
  } else e();
}
function ya(e) {
  ce.useDeprecatedSynchronousErrorHandling &&
    Ze &&
    ((Ze.errorThrown = !0), (Ze.error = e));
}
var Qe = class extends j {
    constructor(t) {
      super(),
        (this.isStopped = !1),
        t
          ? ((this.destination = t), zn(t) && t.add(this))
          : (this.destination = Zd);
    }
    static create(t, n, r) {
      return new mt(t, n, r);
    }
    next(t) {
      this.isStopped ? Fo(va(t), this) : this._next(t);
    }
    error(t) {
      this.isStopped
        ? Fo(ma(t), this)
        : ((this.isStopped = !0), this._error(t));
    }
    complete() {
      this.isStopped ? Fo(ga, this) : ((this.isStopped = !0), this._complete());
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
  qd = Function.prototype.bind;
function Po(e, t) {
  return qd.call(e, t);
}
var ko = class {
    constructor(t) {
      this.partialObserver = t;
    }
    next(t) {
      let { partialObserver: n } = this;
      if (n.next)
        try {
          n.next(t);
        } catch (r) {
          qn(r);
        }
    }
    error(t) {
      let { partialObserver: n } = this;
      if (n.error)
        try {
          n.error(t);
        } catch (r) {
          qn(r);
        }
      else qn(t);
    }
    complete() {
      let { partialObserver: t } = this;
      if (t.complete)
        try {
          t.complete();
        } catch (n) {
          qn(n);
        }
    }
  },
  mt = class extends Qe {
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
              next: t.next && Po(t.next, i),
              error: t.error && Po(t.error, i),
              complete: t.complete && Po(t.complete, i),
            }))
          : (o = t);
      }
      this.destination = new ko(o);
    }
  };
function qn(e) {
  ce.useDeprecatedSynchronousErrorHandling ? ya(e) : Gn(e);
}
function Wd(e) {
  throw e;
}
function Fo(e, t) {
  let { onStoppedNotification: n } = ce;
  n && pt.setTimeout(() => n(e, t));
}
var Zd = { closed: !0, next: Jt, error: Wd, complete: Jt };
var vt = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function K(e) {
  return e;
}
function Lo(...e) {
  return jo(e);
}
function jo(e) {
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
      let i = Yd(n) ? n : new mt(n, r, o);
      return (
        gt(() => {
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
        (r = Da(r)),
        new r((o, i) => {
          let s = new mt({
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
    [vt]() {
      return this;
    }
    pipe(...n) {
      return jo(n)(this);
    }
    toPromise(n) {
      return (
        (n = Da(n)),
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
function Da(e) {
  var t;
  return (t = e ?? ce.Promise) !== null && t !== void 0 ? t : Promise;
}
function Qd(e) {
  return e && y(e.next) && y(e.error) && y(e.complete);
}
function Yd(e) {
  return (e && e instanceof Qe) || (Qd(e) && zn(e));
}
function Vo(e) {
  return y(e?.lift);
}
function T(e) {
  return (t) => {
    if (Vo(t))
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
  return new $o(e, t, n, r, o);
}
var $o = class extends Qe {
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
function yt() {
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
var Dt = class extends R {
  constructor(t, n) {
    super(),
      (this.source = t),
      (this.subjectFactory = n),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      Vo(t) && (this.lift = t.lift);
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
    return yt()(this);
  }
};
var wa = ht(
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
        let r = new Wn(this, this);
        return (r.operator = n), r;
      }
      _throwIfClosed() {
        if (this.closed) throw new wa();
      }
      next(n) {
        gt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        gt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = n);
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        gt(() => {
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
          ? Ro
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
    return (e.create = (t, n) => new Wn(t, n)), e;
  })(),
  Wn = class extends W {
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
        : Ro;
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
function Ca(e) {
  return e && y(e.schedule);
}
function Ia(e) {
  return e[e.length - 1];
}
function Ea(e) {
  return y(Ia(e)) ? e.pop() : void 0;
}
function ke(e) {
  return Ca(Ia(e)) ? e.pop() : void 0;
}
function Sa(e, t, n, r) {
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
function ba(e) {
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
function Ye(e) {
  return this instanceof Ye ? ((this.v = e), this) : new Ye(e);
}
function Ma(e, t, n) {
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
    f.value instanceof Ye
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
function _a(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var t = e[Symbol.asyncIterator],
    n;
  return t
    ? t.call(e)
    : ((e = typeof ba == "function" ? ba(e) : e[Symbol.iterator]()),
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
var Zn = (e) => e && typeof e.length == "number" && typeof e != "function";
function Qn(e) {
  return y(e?.then);
}
function Yn(e) {
  return y(e[vt]);
}
function Kn(e) {
  return Symbol.asyncIterator && y(e?.[Symbol.asyncIterator]);
}
function Jn(e) {
  return new TypeError(
    `You provided ${e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
  );
}
function Kd() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var Xn = Kd();
function er(e) {
  return y(e?.[Xn]);
}
function tr(e) {
  return Ma(this, arguments, function* () {
    let n = e.getReader();
    try {
      for (;;) {
        let { value: r, done: o } = yield Ye(n.read());
        if (o) return yield Ye(void 0);
        yield yield Ye(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function nr(e) {
  return y(e?.getReader);
}
function H(e) {
  if (e instanceof R) return e;
  if (e != null) {
    if (Yn(e)) return Jd(e);
    if (Zn(e)) return Xd(e);
    if (Qn(e)) return ef(e);
    if (Kn(e)) return Ta(e);
    if (er(e)) return tf(e);
    if (nr(e)) return nf(e);
  }
  throw Jn(e);
}
function Jd(e) {
  return new R((t) => {
    let n = e[vt]();
    if (y(n.subscribe)) return n.subscribe(t);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable",
    );
  });
}
function Xd(e) {
  return new R((t) => {
    for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
    t.complete();
  });
}
function ef(e) {
  return new R((t) => {
    e.then(
      (n) => {
        t.closed || (t.next(n), t.complete());
      },
      (n) => t.error(n),
    ).then(null, Gn);
  });
}
function tf(e) {
  return new R((t) => {
    for (let n of e) if ((t.next(n), t.closed)) return;
    t.complete();
  });
}
function Ta(e) {
  return new R((t) => {
    rf(e, t).catch((n) => t.error(n));
  });
}
function nf(e) {
  return Ta(tr(e));
}
function rf(e, t) {
  var n, r, o, i;
  return Sa(this, void 0, void 0, function* () {
    try {
      for (n = _a(e); (r = yield n.next()), !r.done; ) {
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
function rr(e, t = 0) {
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
function or(e, t = 0) {
  return T((n, r) => {
    r.add(e.schedule(() => n.subscribe(r), t));
  });
}
function xa(e, t) {
  return H(e).pipe(or(t), rr(t));
}
function Na(e, t) {
  return H(e).pipe(or(t), rr(t));
}
function Aa(e, t) {
  return new R((n) => {
    let r = 0;
    return t.schedule(function () {
      r === e.length
        ? n.complete()
        : (n.next(e[r++]), n.closed || this.schedule());
    });
  });
}
function Ra(e, t) {
  return new R((n) => {
    let r;
    return (
      Y(n, t, () => {
        (r = e[Xn]()),
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
function ir(e, t) {
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
function Oa(e, t) {
  return ir(tr(e), t);
}
function Pa(e, t) {
  if (e != null) {
    if (Yn(e)) return xa(e, t);
    if (Zn(e)) return Aa(e, t);
    if (Qn(e)) return Na(e, t);
    if (Kn(e)) return ir(e, t);
    if (er(e)) return Ra(e, t);
    if (nr(e)) return Oa(e, t);
  }
  throw Jn(e);
}
function B(e, t) {
  return t ? Pa(e, t) : H(e);
}
function w(...e) {
  let t = ke(e);
  return B(e, t);
}
function wt(e, t) {
  let n = y(e) ? e : () => e,
    r = (o) => o.error(n());
  return new R(t ? (o) => t.schedule(r, 0, o) : r);
}
function Bo(e) {
  return !!e && (e instanceof R || (y(e.lift) && y(e.subscribe)));
}
var Se = ht(
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
var { isArray: of } = Array;
function sf(e, t) {
  return of(t) ? e(...t) : e(t);
}
function Fa(e) {
  return S((t) => sf(e, t));
}
var { isArray: af } = Array,
  { getPrototypeOf: uf, prototype: cf, keys: lf } = Object;
function ka(e) {
  if (e.length === 1) {
    let t = e[0];
    if (af(t)) return { args: t, keys: null };
    if (df(t)) {
      let n = lf(t);
      return { args: n.map((r) => t[r]), keys: n };
    }
  }
  return { args: e, keys: null };
}
function df(e) {
  return e && typeof e == "object" && uf(e) === cf;
}
function La(e, t) {
  return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
}
function sr(...e) {
  let t = ke(e),
    n = Ea(e),
    { args: r, keys: o } = ka(e);
  if (r.length === 0) return B([], t);
  let i = new R(ff(r, t, o ? (s) => La(o, s) : K));
  return n ? i.pipe(Fa(n)) : i;
}
function ff(e, t, n = K) {
  return (r) => {
    ja(
      t,
      () => {
        let { length: o } = e,
          i = new Array(o),
          s = o,
          a = o;
        for (let u = 0; u < o; u++)
          ja(
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
function ja(e, t, n) {
  e ? Y(n, e, t) : t();
}
function Va(e, t, n, r, o, i, s, a) {
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
    : (typeof t == "number" && (n = t), T((r, o) => Va(r, o, e, n)));
}
function Uo(e = 1 / 0) {
  return U(K, e);
}
function $a() {
  return Uo(1);
}
function Ct(...e) {
  return $a()(B(e, ke(e)));
}
function ar(e) {
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
function Le(e) {
  return T((t, n) => {
    let r = null,
      o = !1,
      i;
    (r = t.subscribe(
      x(n, void 0, void 0, (s) => {
        (i = H(e(s, Le(e)(t)))),
          r ? (r.unsubscribe(), (r = null), i.subscribe(n)) : (o = !0);
      }),
    )),
      o && (r.unsubscribe(), (r = null), i.subscribe(n));
  });
}
function Ba(e, t, n, r, o) {
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
function It(e, t) {
  return y(t) ? U(e, t, 1) : U(e, 1);
}
function je(e) {
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
function Me(e) {
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
function Ho(e) {
  return S(() => e);
}
function ur(e = hf) {
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
function hf() {
  return new Se();
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
      Me(1),
      n ? je(t) : ur(() => new Se()),
    );
}
function Et(e) {
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
function zo(e, t) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      e ? le((o, i) => e(o, i, r)) : K,
      Et(1),
      n ? je(t) : ur(() => new Se()),
    );
}
function Go(e, t) {
  return T(Ba(e, t, arguments.length >= 2, !0));
}
function qo(...e) {
  let t = ke(e);
  return T((n, r) => {
    (t ? Ct(e, n, t) : Ct(e, n)).subscribe(r);
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
function Wo(e) {
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
    super(Pi(t, n)), (this.code = t);
  }
};
function Pi(e, t) {
  return `${`NG0${Math.abs(e)}`}${t ? ": " + t : ""}`;
}
function Fi(e) {
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
function Ua(e, t) {
  return e == null || e === ""
    ? t === null
      ? ""
      : t
    : t == null || t === ""
      ? e
      : e + " " + t;
}
var pf = F({ __forward_ref__: F });
function Eu(e) {
  return (
    (e.__forward_ref__ = Eu),
    (e.toString = function () {
      return X(this());
    }),
    e
  );
}
function re(e) {
  return bu(e) ? e() : e;
}
function bu(e) {
  return (
    typeof e == "function" && e.hasOwnProperty(pf) && e.__forward_ref__ === Eu
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
function Or(e) {
  return Ha(e, Mu) || Ha(e, _u);
}
function Su(e) {
  return Or(e) !== null;
}
function Ha(e, t) {
  return e.hasOwnProperty(t) ? e[t] : null;
}
function gf(e) {
  let t = e && (e[Mu] || e[_u]);
  return t || null;
}
function za(e) {
  return e && (e.hasOwnProperty(Ga) || e.hasOwnProperty(mf)) ? e[Ga] : null;
}
var Mu = F({ ɵprov: F }),
  Ga = F({ ɵinj: F }),
  _u = F({ ngInjectableDef: F }),
  mf = F({ ngInjectorDef: F }),
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
function Tu(e) {
  return e && !!e.ɵproviders;
}
var vf = F({ ɵcmp: F }),
  yf = F({ ɵdir: F }),
  Df = F({ ɵpipe: F }),
  wf = F({ ɵmod: F }),
  gr = F({ ɵfac: F }),
  nn = F({ __NG_ELEMENT_ID__: F }),
  qa = F({ __NG_ENV_ID__: F });
function Cf(e) {
  return typeof e == "string" ? e : e == null ? "" : String(e);
}
function If(e) {
  return typeof e == "function"
    ? e.name || e.toString()
    : typeof e == "object" && e != null && typeof e.type == "function"
      ? e.type.name || e.type.toString()
      : Cf(e);
}
function Ef(e, t) {
  let n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
  throw new v(-200, e);
}
function ki(e, t) {
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
  ni;
function xu() {
  return ni;
}
function ne(e) {
  let t = ni;
  return (ni = e), t;
}
function Nu(e, t, n) {
  let r = Or(e);
  if (r && r.providedIn == "root")
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & b.Optional) return null;
  if (t !== void 0) return t;
  ki(e, "Injector");
}
var bf = {},
  rn = bf,
  Sf = "__NG_DI_FLAG__",
  mr = "ngTempTokenPath",
  Mf = "ngTokenPath",
  _f = /\n/gm,
  Tf = "\u0275",
  Wa = "__source",
  _t;
function xf() {
  return _t;
}
function Ve(e) {
  let t = _t;
  return (_t = e), t;
}
function Nf(e, t = b.Default) {
  if (_t === void 0) throw new v(-203, !1);
  return _t === null
    ? Nu(e, void 0, t)
    : _t.get(e, t & b.Optional ? null : void 0, t);
}
function _(e, t = b.Default) {
  return (xu() || Nf)(re(e), t);
}
function h(e, t = b.Default) {
  return _(e, Pr(t));
}
function Pr(e) {
  return typeof e > "u" || typeof e == "number"
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function ri(e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let r = re(e[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new v(900, !1);
      let o,
        i = b.Default;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          u = Af(a);
        typeof u == "number" ? (u === -1 ? (o = a.token) : (i |= u)) : (o = a);
      }
      t.push(_(o, i));
    } else t.push(_(r));
  }
  return t;
}
function Af(e) {
  return e[Sf];
}
function Rf(e, t, n, r) {
  let o = e[mr];
  throw (
    (t[Wa] && o.unshift(t[Wa]),
    (e.message = Of(
      `
` + e.message,
      o,
      n,
      r,
    )),
    (e[Mf] = o),
    (e[mr] = null),
    e)
  );
}
function Of(e, t, n, r = null) {
  e =
    e &&
    e.charAt(0) ===
      `
` &&
    e.charAt(1) == Tf
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
    _f,
    `
  `,
  )}`;
}
function xt(e, t) {
  let n = e.hasOwnProperty(gr);
  return n ? e[gr] : null;
}
function Li(e, t) {
  e.forEach((n) => (Array.isArray(n) ? Li(n, t) : t(n)));
}
function Au(e, t, n) {
  t >= e.length ? e.push(n) : e.splice(t, 0, n);
}
function vr(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
var on = {},
  Nt = [],
  At = new E(""),
  Ru = new E("", -1),
  Ou = new E(""),
  yr = class {
    get(t, n = rn) {
      if (n === rn) {
        let r = new Error(`NullInjectorError: No provider for ${X(t)}!`);
        throw ((r.name = "NullInjectorError"), r);
      }
      return n;
    }
  },
  Pu = (function (e) {
    return (e[(e.OnPush = 0)] = "OnPush"), (e[(e.Default = 1)] = "Default"), e;
  })(Pu || {}),
  Ce = (function (e) {
    return (
      (e[(e.Emulated = 0)] = "Emulated"),
      (e[(e.None = 2)] = "None"),
      (e[(e.ShadowDom = 3)] = "ShadowDom"),
      e
    );
  })(Ce || {}),
  Ue = (function (e) {
    return (
      (e[(e.None = 0)] = "None"),
      (e[(e.SignalBased = 1)] = "SignalBased"),
      (e[(e.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
      e
    );
  })(Ue || {});
function Pf(e, t, n) {
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
function oi(e, t, n) {
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
      kf(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
    }
  }
  return r;
}
function Ff(e) {
  return e === 3 || e === 4 || e === 6;
}
function kf(e) {
  return e.charCodeAt(0) === 64;
}
function ji(e, t) {
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
              ? Za(e, n, o, null, t[++r])
              : Za(e, n, o, null, null));
      }
    }
  return e;
}
function Za(e, t, n, r, o) {
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
var Fu = "ng-template";
function Lf(e, t, n, r) {
  let o = 0;
  if (r) {
    for (; o < t.length && typeof t[o] == "string"; o += 2)
      if (t[o] === "class" && Pf(t[o + 1].toLowerCase(), n, 0) !== -1)
        return !0;
  } else if (Vi(e)) return !1;
  if (((o = t.indexOf(1, o)), o > -1)) {
    let i;
    for (; ++o < t.length && typeof (i = t[o]) == "string"; )
      if (i.toLowerCase() === n) return !0;
  }
  return !1;
}
function Vi(e) {
  return e.type === 4 && e.value !== Fu;
}
function jf(e, t, n) {
  let r = e.type === 4 && !n ? Fu : e.value;
  return t === r;
}
function Vf(e, t, n) {
  let r = 4,
    o = e.attrs,
    i = o !== null ? Uf(o) : 0,
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
          (u !== "" && !jf(e, u, n)) || (u === "" && t.length === 1))
        ) {
          if (fe(r)) return !1;
          s = !0;
        }
      } else if (r & 8) {
        if (o === null || !Lf(e, o, u, n)) {
          if (fe(r)) return !1;
          s = !0;
        }
      } else {
        let c = t[++a],
          l = $f(u, o, Vi(e), n);
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
function $f(e, t, n, r) {
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
  } else return Hf(t, e);
}
function Bf(e, t, n = !1) {
  for (let r = 0; r < t.length; r++) if (Vf(e, t[r], n)) return !0;
  return !1;
}
function Uf(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t];
    if (Ff(n)) return t;
  }
  return e.length;
}
function Hf(e, t) {
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
function Qa(e, t) {
  return e ? ":not(" + t.trim() + ")" : t;
}
function zf(e) {
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
      o !== "" && !fe(s) && ((t += Qa(i, o)), (o = "")),
        (r = s),
        (i = i || !fe(r));
    n++;
  }
  return o !== "" && (t += Qa(i, o)), t;
}
function Gf(e) {
  return e.map(zf).join(",");
}
function qf(e) {
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
function Fr(e) {
  return Fi(() => {
    let t = $u(e),
      n = k(g({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === Pu.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || Ce.Emulated,
        styles: e.styles || Nt,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: "",
      });
    Bu(n);
    let r = e.dependencies;
    return (
      (n.directiveDefs = Ka(r, !1)), (n.pipeDefs = Ka(r, !0)), (n.id = Qf(n)), n
    );
  });
}
function Wf(e) {
  return Xe(e) || ku(e);
}
function Zf(e) {
  return e !== null;
}
function Ya(e, t) {
  if (e == null) return on;
  let n = {};
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let o = e[r],
        i,
        s,
        a = Ue.None;
      Array.isArray(o)
        ? ((a = o[0]), (i = o[1]), (s = o[2] ?? i))
        : ((i = o), (s = o)),
        t ? ((n[i] = a !== Ue.None ? [r, a] : r), (t[i] = s)) : (n[i] = r);
    }
  return n;
}
function $i(e) {
  return Fi(() => {
    let t = $u(e);
    return Bu(t), t;
  });
}
function Xe(e) {
  return e[vf] || null;
}
function ku(e) {
  return e[yf] || null;
}
function Lu(e) {
  return e[Df] || null;
}
function ju(e) {
  let t = Xe(e) || ku(e) || Lu(e);
  return t !== null ? t.standalone : !1;
}
function Vu(e, t) {
  let n = e[wf] || null;
  if (!n && t === !0)
    throw new Error(`Type ${X(e)} does not have '\u0275mod' property.`);
  return n;
}
function $u(e) {
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
    selectors: e.selectors || Nt,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: Ya(e.inputs, t),
    outputs: Ya(e.outputs),
    debugInfo: null,
  };
}
function Bu(e) {
  e.features?.forEach((t) => t(e));
}
function Ka(e, t) {
  if (!e) return null;
  let n = t ? Lu : Wf;
  return () => (typeof e == "function" ? e() : e).map((r) => n(r)).filter(Zf);
}
function Qf(e) {
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
function kr(e) {
  return { ɵproviders: e };
}
function Yf(...e) {
  return { ɵproviders: Uu(!0, e), ɵfromNgModule: !0 };
}
function Uu(e, ...t) {
  let n = [],
    r = new Set(),
    o,
    i = (s) => {
      n.push(s);
    };
  return (
    Li(t, (s) => {
      let a = s;
      ii(a, i, [], r) && ((o ||= []), o.push(a));
    }),
    o !== void 0 && Hu(o, i),
    n
  );
}
function Hu(e, t) {
  for (let n = 0; n < e.length; n++) {
    let { ngModule: r, providers: o } = e[n];
    Bi(o, (i) => {
      t(i, r);
    });
  }
}
function ii(e, t, n, r) {
  if (((e = re(e)), !e)) return !1;
  let o = null,
    i = za(e),
    s = !i && Xe(e);
  if (!i && !s) {
    let u = e.ngModule;
    if (((i = za(u)), i)) o = u;
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
      for (let c of u) ii(c, t, n, r);
    }
  } else if (i) {
    if (i.imports != null && !a) {
      r.add(o);
      let c;
      try {
        Li(i.imports, (l) => {
          ii(l, t, n, r) && ((c ||= []), c.push(l));
        });
      } finally {
      }
      c !== void 0 && Hu(c, t);
    }
    if (!a) {
      let c = xt(o) || (() => new o());
      t({ provide: o, useFactory: c, deps: Nt }, o),
        t({ provide: Ou, useValue: o, multi: !0 }, o),
        t({ provide: At, useValue: () => _(o), multi: !0 }, o);
    }
    let u = i.providers;
    if (u != null && !a) {
      let c = e;
      Bi(u, (l) => {
        t(l, c);
      });
    }
  } else return !1;
  return o !== e && e.providers !== void 0;
}
function Bi(e, t) {
  for (let n of e)
    Tu(n) && (n = n.ɵproviders), Array.isArray(n) ? Bi(n, t) : t(n);
}
var Kf = F({ provide: String, useValue: F });
function zu(e) {
  return e !== null && typeof e == "object" && Kf in e;
}
function Jf(e) {
  return !!(e && e.useExisting);
}
function Xf(e) {
  return !!(e && e.useFactory);
}
function si(e) {
  return typeof e == "function";
}
var Lr = new E(""),
  lr = {},
  eh = {},
  Zo;
function Ui() {
  return Zo === void 0 && (Zo = new yr()), Zo;
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
        ui(t, (s) => this.processProvider(s)),
        this.records.set(Ru, bt(void 0, this)),
        o.has("environment") && this.records.set(se, bt(void 0, this));
      let i = this.records.get(Lr);
      i != null && typeof i.value == "string" && this.scopes.add(i.value),
        (this.injectorDefTypes = new Set(this.get(Ou, Nt, b.Self)));
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
      let n = Ve(this),
        r = ne(void 0),
        o;
      try {
        return t();
      } finally {
        Ve(n), ne(r);
      }
    }
    get(t, n = rn, r = b.Default) {
      if ((this.assertNotDestroyed(), t.hasOwnProperty(qa))) return t[qa](this);
      r = Pr(r);
      let o,
        i = Ve(this),
        s = ne(void 0);
      try {
        if (!(r & b.SkipSelf)) {
          let u = this.records.get(t);
          if (u === void 0) {
            let c = sh(t) && Or(t);
            c && this.injectableDefInScope(c)
              ? (u = bt(ai(t), lr))
              : (u = null),
              this.records.set(t, u);
          }
          if (u != null) return this.hydrate(t, u);
        }
        let a = r & b.Self ? Ui() : this.parent;
        return (n = r & b.Optional && n === rn ? null : n), a.get(t, n);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[mr] = a[mr] || []).unshift(X(t)), i)) throw a;
          return Rf(a, t, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        ne(s), Ve(i);
      }
    }
    resolveInjectorInitializers() {
      let t = P(null),
        n = Ve(this),
        r = ne(void 0),
        o;
      try {
        let i = this.get(At, Nt, b.Self);
        for (let s of i) s();
      } finally {
        Ve(n), ne(r), P(t);
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
      let n = si(t) ? t : re(t && t.provide),
        r = nh(t);
      if (!si(t) && t.multi === !0) {
        let o = this.records.get(n);
        o ||
          ((o = bt(void 0, lr, !0)),
          (o.factory = () => ri(o.multi)),
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
          n.value === lr && ((n.value = eh), (n.value = n.factory())),
          typeof n.value == "object" &&
            n.value &&
            ih(n.value) &&
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
function ai(e) {
  let t = Or(e),
    n = t !== null ? t.factory : xt(e);
  if (n !== null) return n;
  if (e instanceof E) throw new v(204, !1);
  if (e instanceof Function) return th(e);
  throw new v(204, !1);
}
function th(e) {
  if (e.length > 0) throw new v(204, !1);
  let n = gf(e);
  return n !== null ? () => n.factory(e) : () => new e();
}
function nh(e) {
  if (zu(e)) return bt(void 0, e.useValue);
  {
    let t = rh(e);
    return bt(t, lr);
  }
}
function rh(e, t, n) {
  let r;
  if (si(e)) {
    let o = re(e);
    return xt(o) || ai(o);
  } else if (zu(e)) r = () => re(e.useValue);
  else if (Xf(e)) r = () => e.useFactory(...ri(e.deps || []));
  else if (Jf(e)) r = () => _(re(e.useExisting));
  else {
    let o = re(e && (e.useClass || e.provide));
    if (oh(e)) r = () => new o(...ri(e.deps));
    else return xt(o) || ai(o);
  }
  return r;
}
function bt(e, t, n = !1) {
  return { factory: e, value: t, multi: n ? [] : void 0 };
}
function oh(e) {
  return !!e.deps;
}
function ih(e) {
  return (
    e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
  );
}
function sh(e) {
  return typeof e == "function" || (typeof e == "object" && e instanceof E);
}
function ui(e, t) {
  for (let n of e)
    Array.isArray(n) ? ui(n, t) : n && Tu(n) ? ui(n.ɵproviders, t) : t(n);
}
function xe(e, t) {
  e instanceof sn && e.assertNotDestroyed();
  let n,
    r = Ve(e),
    o = ne(void 0);
  try {
    return t();
  } finally {
    Ve(r), ne(o);
  }
}
function ah() {
  return xu() !== void 0 || xf() != null;
}
function uh(e) {
  return typeof e == "function";
}
var Ne = 0,
  M = 1,
  C = 2,
  Q = 3,
  he = 4,
  ge = 5,
  Dr = 6,
  Ja = 7,
  He = 8,
  Rt = 9,
  _e = 10,
  Ie = 11,
  an = 12,
  Xa = 13,
  hn = 14,
  Ee = 15,
  un = 16,
  St = 17,
  jr = 18,
  Vr = 19,
  Gu = 20,
  Be = 21,
  Qo = 22,
  oe = 23,
  et = 25,
  qu = 1;
var tt = 7,
  wr = 8,
  Cr = 9,
  ie = 10,
  Ir = (function (e) {
    return (
      (e[(e.None = 0)] = "None"),
      (e[(e.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      e
    );
  })(Ir || {});
function Ke(e) {
  return Array.isArray(e) && typeof e[qu] == "object";
}
function Ae(e) {
  return Array.isArray(e) && e[qu] === !0;
}
function Wu(e) {
  return (e.flags & 4) !== 0;
}
function Hi(e) {
  return e.componentOffset > -1;
}
function ch(e) {
  return (e.flags & 1) === 1;
}
function pn(e) {
  return !!e.template;
}
function ci(e) {
  return (e[C] & 512) !== 0;
}
var li = class {
  constructor(t, n, r) {
    (this.previousValue = t), (this.currentValue = n), (this.firstChange = r);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function Zu(e, t, n, r) {
  t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r);
}
function $r() {
  return Qu;
}
function Qu(e) {
  return e.type.prototype.ngOnChanges && (e.setInput = dh), lh;
}
$r.ngInherit = !0;
function lh() {
  let e = Ku(this),
    t = e?.current;
  if (t) {
    let n = e.previous;
    if (n === on) e.previous = t;
    else for (let r in t) n[r] = t[r];
    (e.current = null), this.ngOnChanges(t);
  }
}
function dh(e, t, n, r, o) {
  let i = this.declaredInputs[r],
    s = Ku(e) || fh(e, { previous: on, current: null }),
    a = s.current || (s.current = {}),
    u = s.previous,
    c = u[i];
  (a[i] = new li(c && c.currentValue, n, u === on)), Zu(e, t, o, n);
}
var Yu = "__ngSimpleChanges__";
function Ku(e) {
  return e[Yu] || null;
}
function fh(e, t) {
  return (e[Yu] = t);
}
var eu = null;
var $e = function (e, t, n) {
    eu?.(e, t, n);
  },
  hh = "svg",
  ph = "math";
function ze(e) {
  for (; Array.isArray(e); ) e = e[Ne];
  return e;
}
function Re(e, t) {
  return ze(t[e.index]);
}
function gh(e, t) {
  return e.data[t];
}
function gn(e, t) {
  let n = t[e];
  return Ke(n) ? n : n[Ne];
}
function zi(e) {
  return (e[C] & 128) === 128;
}
function mh(e) {
  return Ae(e[Q]);
}
function tu(e, t) {
  return t == null ? null : e[t];
}
function Ju(e) {
  e[St] = 0;
}
function Xu(e) {
  e[C] & 1024 || ((e[C] |= 1024), zi(e) && Ur(e));
}
function Br(e) {
  return !!(e[C] & 9216 || e[oe]?.dirty);
}
function di(e) {
  e[_e].changeDetectionScheduler?.notify(8),
    e[C] & 64 && (e[C] |= 1024),
    Br(e) && Ur(e);
}
function Ur(e) {
  e[_e].changeDetectionScheduler?.notify(0);
  let t = nt(e);
  for (; t !== null && !(t[C] & 8192 || ((t[C] |= 8192), !zi(t))); ) t = nt(t);
}
function ec(e, t) {
  if ((e[C] & 256) === 256) throw new v(911, !1);
  e[Be] === null && (e[Be] = []), e[Be].push(t);
}
function vh(e, t) {
  if (e[Be] === null) return;
  let n = e[Be].indexOf(t);
  n !== -1 && e[Be].splice(n, 1);
}
function nt(e) {
  let t = e[Q];
  return Ae(t) ? t[Q] : t;
}
var O = { lFrame: cc(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
var tc = !1;
function yh() {
  return O.lFrame.elementDepthCount;
}
function Dh() {
  O.lFrame.elementDepthCount++;
}
function wh() {
  O.lFrame.elementDepthCount--;
}
function nc() {
  return O.bindingsEnabled;
}
function Ch() {
  return O.skipHydrationRootTNode !== null;
}
function Ih(e) {
  return O.skipHydrationRootTNode === e;
}
function Eh() {
  O.skipHydrationRootTNode = null;
}
function pe() {
  return O.lFrame.lView;
}
function Gi() {
  return O.lFrame.tView;
}
function Oe() {
  let e = rc();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function rc() {
  return O.lFrame.currentTNode;
}
function bh() {
  let e = O.lFrame,
    t = e.currentTNode;
  return e.isParent ? t : t.parent;
}
function Hr(e, t) {
  let n = O.lFrame;
  (n.currentTNode = e), (n.isParent = t);
}
function oc() {
  return O.lFrame.isParent;
}
function Sh() {
  O.lFrame.isParent = !1;
}
function ic() {
  return tc;
}
function nu(e) {
  tc = e;
}
function Mh(e) {
  return (O.lFrame.bindingIndex = e);
}
function _h() {
  return O.lFrame.inI18n;
}
function Th(e, t) {
  let n = O.lFrame;
  (n.bindingIndex = n.bindingRootIndex = e), fi(t);
}
function xh() {
  return O.lFrame.currentDirectiveIndex;
}
function fi(e) {
  O.lFrame.currentDirectiveIndex = e;
}
function sc(e) {
  O.lFrame.currentQueryIndex = e;
}
function Nh(e) {
  let t = e[M];
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[ge] : null;
}
function ac(e, t, n) {
  if (n & b.SkipSelf) {
    let o = t,
      i = e;
    for (; (o = o.parent), o === null && !(n & b.Host); )
      if (((o = Nh(i)), o === null || ((i = i[hn]), o.type & 10))) break;
    if (o === null) return !1;
    (t = o), (e = i);
  }
  let r = (O.lFrame = uc());
  return (r.currentTNode = t), (r.lView = e), !0;
}
function qi(e) {
  let t = uc(),
    n = e[M];
  (O.lFrame = t),
    (t.currentTNode = n.firstChild),
    (t.lView = e),
    (t.tView = n),
    (t.contextLView = e),
    (t.bindingIndex = n.bindingStartIndex),
    (t.inI18n = !1);
}
function uc() {
  let e = O.lFrame,
    t = e === null ? null : e.child;
  return t === null ? cc(e) : t;
}
function cc(e) {
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
function lc() {
  let e = O.lFrame;
  return (O.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
}
var dc = lc;
function Wi() {
  let e = lc();
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
function Ah() {
  return O.lFrame.selectedIndex;
}
function rt(e) {
  O.lFrame.selectedIndex = e;
}
function Rh() {
  return O.lFrame.currentNamespace;
}
var fc = !0;
function hc() {
  return fc;
}
function pc(e) {
  fc = e;
}
function Oh(e, t, n) {
  let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
  if (r) {
    let s = Qu(t);
    (n.preOrderHooks ??= []).push(e, s),
      (n.preOrderCheckHooks ??= []).push(e, s);
  }
  o && (n.preOrderHooks ??= []).push(0 - e, o),
    i &&
      ((n.preOrderHooks ??= []).push(e, i),
      (n.preOrderCheckHooks ??= []).push(e, i));
}
function gc(e, t) {
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
function dr(e, t, n) {
  mc(e, t, 3, n);
}
function fr(e, t, n, r) {
  (e[C] & 3) === n && mc(e, t, n, r);
}
function Yo(e, t) {
  let n = e[C];
  (n & 3) === t && ((n &= 16383), (n += 1), (e[C] = n));
}
function mc(e, t, n, r) {
  let o = r !== void 0 ? e[St] & 65535 : 0,
    i = r ?? -1,
    s = t.length - 1,
    a = 0;
  for (let u = o; u < s; u++)
    if (typeof t[u + 1] == "number") {
      if (((a = t[u]), r != null && a >= r)) break;
    } else
      t[u] < 0 && (e[St] += 65536),
        (a < i || i == -1) &&
          (Ph(e, n, t, u), (e[St] = (e[St] & 4294901760) + u + 2)),
        u++;
}
function ru(e, t) {
  $e(4, e, t);
  let n = P(null);
  try {
    t.call(e);
  } finally {
    P(n), $e(5, e, t);
  }
}
function Ph(e, t, n, r) {
  let o = n[r] < 0,
    i = n[r + 1],
    s = o ? -n[r] : n[r],
    a = e[s];
  o
    ? e[C] >> 14 < e[St] >> 16 &&
      (e[C] & 3) === t &&
      ((e[C] += 16384), ru(a, i))
    : ru(a, i);
}
var Tt = -1,
  cn = class {
    constructor(t, n, r) {
      (this.factory = t),
        (this.resolving = !1),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r);
    }
  };
function Fh(e) {
  return e instanceof cn;
}
function kh(e) {
  return (e.flags & 8) !== 0;
}
function Lh(e) {
  return (e.flags & 16) !== 0;
}
var Ko = {},
  hi = class {
    constructor(t, n) {
      (this.injector = t), (this.parentInjector = n);
    }
    get(t, n, r) {
      r = Pr(r);
      let o = this.injector.get(t, Ko, r);
      return o !== Ko || n === Ko ? o : this.parentInjector.get(t, n, r);
    }
  };
function vc(e) {
  return e !== Tt;
}
function Er(e) {
  return e & 32767;
}
function jh(e) {
  return e >> 16;
}
function br(e, t) {
  let n = jh(e),
    r = t;
  for (; n > 0; ) (r = r[hn]), n--;
  return r;
}
var pi = !0;
function ou(e) {
  let t = pi;
  return (pi = e), t;
}
var Vh = 256,
  yc = Vh - 1,
  Dc = 5,
  $h = 0,
  we = {};
function Bh(e, t, n) {
  let r;
  typeof n == "string"
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(nn) && (r = n[nn]),
    r == null && (r = n[nn] = $h++);
  let o = r & yc,
    i = 1 << o;
  t.data[e + (o >> Dc)] |= i;
}
function wc(e, t) {
  let n = Cc(e, t);
  if (n !== -1) return n;
  let r = t[M];
  r.firstCreatePass &&
    ((e.injectorIndex = t.length),
    Jo(r.data, e),
    Jo(t, null),
    Jo(r.blueprint, null));
  let o = Zi(e, t),
    i = e.injectorIndex;
  if (vc(o)) {
    let s = Er(o),
      a = br(o, t),
      u = a[M].data;
    for (let c = 0; c < 8; c++) t[i + c] = a[s + c] | u[s + c];
  }
  return (t[i + 8] = o), i;
}
function Jo(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function Cc(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function Zi(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let n = 0,
    r = null,
    o = t;
  for (; o !== null; ) {
    if (((r = Mc(o)), r === null)) return Tt;
    if ((n++, (o = o[hn]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16);
  }
  return Tt;
}
function Uh(e, t, n) {
  Bh(e, t, n);
}
function Ic(e, t, n) {
  if (n & b.Optional || e !== void 0) return e;
  ki(t, "NodeInjector");
}
function Ec(e, t, n, r) {
  if (
    (n & b.Optional && r === void 0 && (r = null), !(n & (b.Self | b.Host)))
  ) {
    let o = e[Rt],
      i = ne(void 0);
    try {
      return o ? o.get(t, r, n & b.Optional) : Nu(t, r, n & b.Optional);
    } finally {
      ne(i);
    }
  }
  return Ic(r, t, n);
}
function bc(e, t, n, r = b.Default, o) {
  if (e !== null) {
    if (t[C] & 2048 && !(r & b.Self)) {
      let s = Wh(e, t, n, r, we);
      if (s !== we) return s;
    }
    let i = Sc(e, t, n, r, we);
    if (i !== we) return i;
  }
  return Ec(t, n, r, o);
}
function Sc(e, t, n, r, o) {
  let i = Gh(n);
  if (typeof i == "function") {
    if (!ac(t, e, r)) return r & b.Host ? Ic(o, n, r) : Ec(t, n, r, o);
    try {
      let s;
      if (((s = i(r)), s == null && !(r & b.Optional))) ki(n);
      else return s;
    } finally {
      dc();
    }
  } else if (typeof i == "number") {
    let s = null,
      a = Cc(e, t),
      u = Tt,
      c = r & b.Host ? t[Ee][ge] : null;
    for (
      (a === -1 || r & b.SkipSelf) &&
      ((u = a === -1 ? Zi(e, t) : t[a + 8]),
      u === Tt || !su(r, !1)
        ? (a = -1)
        : ((s = t[M]), (a = Er(u)), (t = br(u, t))));
      a !== -1;

    ) {
      let l = t[M];
      if (iu(i, a, l.data)) {
        let d = Hh(a, t, n, s, r, c);
        if (d !== we) return d;
      }
      (u = t[a + 8]),
        u !== Tt && su(r, t[M].data[a + 8] === c) && iu(i, a, t)
          ? ((s = l), (a = Er(u)), (t = br(u, t)))
          : (a = -1);
    }
  }
  return o;
}
function Hh(e, t, n, r, o, i) {
  let s = t[M],
    a = s.data[e + 8],
    u = r == null ? Hi(a) && pi : r != s && (a.type & 3) !== 0,
    c = o & b.Host && i === a,
    l = zh(a, s, n, u, c);
  return l !== null ? ln(t, s, l, a) : we;
}
function zh(e, t, n, r, o) {
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
    if (f && pn(f) && f.type === n) return u;
  }
  return null;
}
function ln(e, t, n, r) {
  let o = e[n],
    i = t.data;
  if (Fh(o)) {
    let s = o;
    s.resolving && Ef(If(i[n]));
    let a = ou(s.canSeeViewProviders);
    s.resolving = !0;
    let u,
      c = s.injectImpl ? ne(s.injectImpl) : null,
      l = ac(e, r, b.Default);
    try {
      (o = e[n] = s.factory(void 0, i, e, r)),
        t.firstCreatePass && n >= r.directiveStart && Oh(n, i[n], t);
    } finally {
      c !== null && ne(c), ou(a), (s.resolving = !1), dc();
    }
  }
  return o;
}
function Gh(e) {
  if (typeof e == "string") return e.charCodeAt(0) || 0;
  let t = e.hasOwnProperty(nn) ? e[nn] : void 0;
  return typeof t == "number" ? (t >= 0 ? t & yc : qh) : t;
}
function iu(e, t, n) {
  let r = 1 << e;
  return !!(n[t + (e >> Dc)] & r);
}
function su(e, t) {
  return !(e & b.Self) && !(e & b.Host && t);
}
var Je = class {
  constructor(t, n) {
    (this._tNode = t), (this._lView = n);
  }
  get(t, n, r) {
    return bc(this._tNode, this._lView, t, Pr(r), n);
  }
};
function qh() {
  return new Je(Oe(), pe());
}
function Qi(e) {
  return Fi(() => {
    let t = e.prototype.constructor,
      n = t[gr] || gi(t),
      r = Object.prototype,
      o = Object.getPrototypeOf(e.prototype).constructor;
    for (; o && o !== r; ) {
      let i = o[gr] || gi(o);
      if (i && i !== n) return i;
      o = Object.getPrototypeOf(o);
    }
    return (i) => new i();
  });
}
function gi(e) {
  return bu(e)
    ? () => {
        let t = gi(re(e));
        return t && t();
      }
    : xt(e);
}
function Wh(e, t, n, r, o) {
  let i = e,
    s = t;
  for (; i !== null && s !== null && s[C] & 2048 && !(s[C] & 512); ) {
    let a = Sc(i, s, n, r | b.Self, we);
    if (a !== we) return a;
    let u = i.parent;
    if (!u) {
      let c = s[Gu];
      if (c) {
        let l = c.get(n, we, r);
        if (l !== we) return l;
      }
      (u = Mc(s)), (s = s[hn]);
    }
    i = u;
  }
  return o;
}
function Mc(e) {
  let t = e[M],
    n = t.type;
  return n === 2 ? t.declTNode : n === 1 ? e[ge] : null;
}
function au(e, t = null, n = null, r) {
  let o = _c(e, t, n, r);
  return o.resolveInjectorInitializers(), o;
}
function _c(e, t = null, n = null, r, o = new Set()) {
  let i = [n || Nt, Yf(e)];
  return (
    (r = r || (typeof e == "object" ? void 0 : X(e))),
    new sn(i, t || Ui(), r || null, o)
  );
}
var ot = class e {
  static {
    this.THROW_IF_NOT_FOUND = rn;
  }
  static {
    this.NULL = new yr();
  }
  static create(t, n) {
    if (Array.isArray(t)) return au({ name: "" }, n, t, "");
    {
      let r = t.name ?? "";
      return au({ name: r }, t.parent, t.providers, r);
    }
  }
  static {
    this.ɵprov = D({ token: e, providedIn: "any", factory: () => _(Ru) });
  }
  static {
    this.__NG_ELEMENT_ID__ = -1;
  }
};
var Zh = new E("");
Zh.__NG_ELEMENT_ID__ = (e) => {
  let t = Oe();
  if (t === null) throw new v(204, !1);
  if (t.type & 2) return t.value;
  if (e & b.Optional) return null;
  throw new v(204, !1);
};
var Qh = "ngOriginalError";
function Xo(e) {
  return e[Qh];
}
var Tc = !0,
  xc = (() => {
    class e {
      static {
        this.__NG_ELEMENT_ID__ = Yh;
      }
      static {
        this.__NG_ENV_ID__ = (n) => n;
      }
    }
    return e;
  })(),
  mi = class extends xc {
    constructor(t) {
      super(), (this._lView = t);
    }
    onDestroy(t) {
      return ec(this._lView, t), () => vh(this._lView, t);
    }
  };
function Yh() {
  return new mi(pe());
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
var vi = class extends W {
    constructor(t = !1) {
      super(),
        (this.destroyRef = void 0),
        (this.pendingTasks = void 0),
        (this.__isAsync = t),
        ah() &&
          ((this.destroyRef = h(xc, { optional: !0 }) ?? void 0),
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
  Z = vi;
function Sr(...e) {}
function Nc(e) {
  let t, n;
  function r() {
    e = Sr;
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
function uu(e) {
  return (
    queueMicrotask(() => e()),
    () => {
      e = Sr;
    }
  );
}
var Yi = "isAngularZone",
  Mr = Yi + "_ID",
  Kh = 0,
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
        scheduleInRootZone: i = Tc,
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
        ep(s);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get(Yi) === !0;
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
        s = i.scheduleEventTask("NgZoneEvent: " + o, t, Jh, Sr, Sr);
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
  Jh = {};
function Ki(e) {
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
function Xh(e) {
  if (e.isCheckStableRunning || e.callbackScheduled) return;
  e.callbackScheduled = !0;
  function t() {
    Nc(() => {
      (e.callbackScheduled = !1),
        yi(e),
        (e.isCheckStableRunning = !0),
        Ki(e),
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
    yi(e);
}
function ep(e) {
  let t = () => {
      Xh(e);
    },
    n = Kh++;
  e._inner = e._inner.fork({
    name: "angular",
    properties: { [Yi]: !0, [Mr]: n, [Mr + n]: !0 },
    onInvokeTask: (r, o, i, s, a, u) => {
      if (tp(u)) return r.invokeTask(i, s, a, u);
      try {
        return cu(e), r.invokeTask(i, s, a, u);
      } finally {
        ((e.shouldCoalesceEventChangeDetection && s.type === "eventTask") ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          lu(e);
      }
    },
    onInvoke: (r, o, i, s, a, u, c) => {
      try {
        return cu(e), r.invoke(i, s, a, u, c);
      } finally {
        e.shouldCoalesceRunChangeDetection &&
          !e.callbackScheduled &&
          !np(u) &&
          t(),
          lu(e);
      }
    },
    onHasTask: (r, o, i, s) => {
      r.hasTask(i, s),
        o === i &&
          (s.change == "microTask"
            ? ((e._hasPendingMicrotasks = s.microTask), yi(e), Ki(e))
            : s.change == "macroTask" &&
              (e.hasPendingMacrotasks = s.macroTask));
    },
    onHandleError: (r, o, i, s) => (
      r.handleError(i, s), e.runOutsideAngular(() => e.onError.emit(s)), !1
    ),
  });
}
function yi(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection ||
    e.shouldCoalesceRunChangeDetection) &&
    e.callbackScheduled === !0)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function cu(e) {
  e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
}
function lu(e) {
  e._nesting--, Ki(e);
}
var Di = class {
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
function tp(e) {
  return Ac(e, "__ignore_ng_zone__");
}
function np(e) {
  return Ac(e, "__scheduler_tick__");
}
function Ac(e, t) {
  return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[t] === !0;
}
var Te = class {
    constructor() {
      this._console = console;
    }
    handleError(t) {
      let n = this._findOriginalError(t);
      this._console.error("ERROR", t),
        n && this._console.error("ORIGINAL ERROR", n);
    }
    _findOriginalError(t) {
      let n = t && Xo(t);
      for (; n && Xo(n); ) n = Xo(n);
      return n || null;
    }
  },
  rp = new E("", {
    providedIn: "root",
    factory: () => {
      let e = h(V),
        t = h(Te);
      return (n) => e.runOutsideAngular(() => t.handleError(n));
    },
  });
function op() {
  return Ji(Oe(), pe());
}
function Ji(e, t) {
  return new zr(Re(e, t));
}
var zr = (() => {
  class e {
    constructor(n) {
      this.nativeElement = n;
    }
    static {
      this.__NG_ELEMENT_ID__ = op;
    }
  }
  return e;
})();
function Rc(e) {
  return (e.flags & 128) === 128;
}
var Oc = new Map(),
  ip = 0;
function sp() {
  return ip++;
}
function ap(e) {
  Oc.set(e[Vr], e);
}
function wi(e) {
  Oc.delete(e[Vr]);
}
var du = "__ngContext__";
function Ot(e, t) {
  Ke(t) ? ((e[du] = t[Vr]), ap(t)) : (e[du] = t);
}
function Pc(e) {
  return kc(e[an]);
}
function Fc(e) {
  return kc(e[he]);
}
function kc(e) {
  for (; e !== null && !Ae(e); ) e = e[he];
  return e;
}
var Ci;
function Lc(e) {
  Ci = e;
}
function up() {
  if (Ci !== void 0) return Ci;
  if (typeof document < "u") return document;
  throw new v(210, !1);
}
var Xi = new E("", { providedIn: "root", factory: () => cp }),
  cp = "ng",
  es = new E(""),
  Vt = new E("", { providedIn: "platform", factory: () => "unknown" });
var ts = new E("", {
  providedIn: "root",
  factory: () =>
    up().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
    null,
});
var lp = "h",
  dp = "b";
var fp = () => null;
function ns(e, t, n = !1) {
  return fp(e, t, n);
}
var jc = !1,
  hp = new E("", { providedIn: "root", factory: () => jc });
function Vc(e) {
  return e instanceof Function ? e() : e;
}
var it = (function (e) {
    return (
      (e[(e.Important = 1)] = "Important"),
      (e[(e.DashCase = 2)] = "DashCase"),
      e
    );
  })(it || {}),
  pp;
function rs(e, t) {
  return pp(e, t);
}
function Mt(e, t, n, r, o) {
  if (r != null) {
    let i,
      s = !1;
    Ae(r) ? (i = r) : Ke(r) && ((s = !0), (r = r[Ne]));
    let a = ze(r);
    e === 0 && n !== null
      ? o == null
        ? zc(t, n, a)
        : _r(t, n, a, o || null, !0)
      : e === 1 && n !== null
        ? _r(t, n, a, o || null, !0)
        : e === 2
          ? Tp(t, a, s)
          : e === 3 && t.destroyNode(a),
      i != null && Np(t, e, i, n, o);
  }
}
function gp(e, t) {
  return e.createText(t);
}
function $c(e, t, n) {
  return e.createElement(t, n);
}
function mp(e, t) {
  Bc(e, t), (t[Ne] = null), (t[ge] = null);
}
function vp(e, t, n, r, o, i) {
  (r[Ne] = o), (r[ge] = t), Gr(e, r, n, 1, o, i);
}
function Bc(e, t) {
  t[_e].changeDetectionScheduler?.notify(9), Gr(e, t, t[Ie], 2, null, null);
}
function yp(e) {
  let t = e[an];
  if (!t) return ei(e[M], e);
  for (; t; ) {
    let n = null;
    if (Ke(t)) n = t[an];
    else {
      let r = t[ie];
      r && (n = r);
    }
    if (!n) {
      for (; t && !t[he] && t !== e; ) Ke(t) && ei(t[M], t), (t = t[Q]);
      t === null && (t = e), Ke(t) && ei(t[M], t), (n = t && t[he]);
    }
    t = n;
  }
}
function Dp(e, t, n, r) {
  let o = ie + r,
    i = n.length;
  r > 0 && (n[o - 1][he] = t),
    r < i - ie
      ? ((t[he] = n[o]), Au(n, ie + r, t))
      : (n.push(t), (t[he] = null)),
    (t[Q] = n);
  let s = t[un];
  s !== null && n !== s && Uc(s, t);
  let a = t[jr];
  a !== null && a.insertView(e), di(t), (t[C] |= 128);
}
function Uc(e, t) {
  let n = e[Cr],
    r = t[Q];
  if (Ke(r)) e[C] |= Ir.HasTransplantedViews;
  else {
    let o = r[Q][Ee];
    t[Ee] !== o && (e[C] |= Ir.HasTransplantedViews);
  }
  n === null ? (e[Cr] = [t]) : n.push(t);
}
function os(e, t) {
  let n = e[Cr],
    r = n.indexOf(t);
  n.splice(r, 1);
}
function Ii(e, t) {
  if (e.length <= ie) return;
  let n = ie + t,
    r = e[n];
  if (r) {
    let o = r[un];
    o !== null && o !== e && os(o, r), t > 0 && (e[n - 1][he] = r[he]);
    let i = vr(e, ie + t);
    mp(r[M], r);
    let s = i[jr];
    s !== null && s.detachView(i[M]),
      (r[Q] = null),
      (r[he] = null),
      (r[C] &= -129);
  }
  return r;
}
function Hc(e, t) {
  if (!(t[C] & 256)) {
    let n = t[Ie];
    n.destroyNode && Gr(e, t, n, 3, null, null), yp(t);
  }
}
function ei(e, t) {
  if (t[C] & 256) return;
  let n = P(null);
  try {
    (t[C] &= -129),
      (t[C] |= 256),
      t[oe] && To(t[oe]),
      Cp(e, t),
      wp(e, t),
      t[M].type === 1 && t[Ie].destroy();
    let r = t[un];
    if (r !== null && Ae(t[Q])) {
      r !== t[Q] && os(r, t);
      let o = t[jr];
      o !== null && o.detachView(e);
    }
    wi(t);
  } finally {
    P(n);
  }
}
function wp(e, t) {
  let n = e.cleanup,
    r = t[Ja];
  if (n !== null)
    for (let i = 0; i < n.length - 1; i += 2)
      if (typeof n[i] == "string") {
        let s = n[i + 3];
        s >= 0 ? r[s]() : r[-s].unsubscribe(), (i += 2);
      } else {
        let s = r[n[i + 1]];
        n[i].call(s);
      }
  r !== null && (t[Ja] = null);
  let o = t[Be];
  if (o !== null) {
    t[Be] = null;
    for (let i = 0; i < o.length; i++) {
      let s = o[i];
      s();
    }
  }
}
function Cp(e, t) {
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
            $e(4, a, u);
            try {
              u.call(a);
            } finally {
              $e(5, a, u);
            }
          }
        else {
          $e(4, o, i);
          try {
            i.call(o);
          } finally {
            $e(5, o, i);
          }
        }
      }
    }
}
function Ip(e, t, n) {
  return Ep(e, t.parent, n);
}
function Ep(e, t, n) {
  let r = t;
  for (; r !== null && r.type & 168; ) (t = r), (r = t.parent);
  if (r === null) return n[Ne];
  {
    let { componentOffset: o } = r;
    if (o > -1) {
      let { encapsulation: i } = e.data[r.directiveStart + o];
      if (i === Ce.None || i === Ce.Emulated) return null;
    }
    return Re(r, n);
  }
}
function _r(e, t, n, r, o) {
  e.insertBefore(t, n, r, o);
}
function zc(e, t, n) {
  e.appendChild(t, n);
}
function fu(e, t, n, r, o) {
  r !== null ? _r(e, t, n, r, o) : zc(e, t, n);
}
function Gc(e, t) {
  return e.parentNode(t);
}
function bp(e, t) {
  return e.nextSibling(t);
}
function Sp(e, t, n) {
  return _p(e, t, n);
}
function Mp(e, t, n) {
  return e.type & 40 ? Re(e, n) : null;
}
var _p = Mp,
  hu;
function qc(e, t, n, r) {
  let o = Ip(e, r, t),
    i = t[Ie],
    s = r.parent || t[ge],
    a = Sp(s, r, t);
  if (o != null)
    if (Array.isArray(n))
      for (let u = 0; u < n.length; u++) fu(i, o, n[u], a, !1);
    else fu(i, o, n, a, !1);
  hu !== void 0 && hu(i, r, t, n, o);
}
function en(e, t) {
  if (t !== null) {
    let n = t.type;
    if (n & 3) return Re(t, e);
    if (n & 4) return Ei(-1, e[t.index]);
    if (n & 8) {
      let r = t.child;
      if (r !== null) return en(e, r);
      {
        let o = e[t.index];
        return Ae(o) ? Ei(-1, o) : ze(o);
      }
    } else {
      if (n & 128) return en(e, t.next);
      if (n & 32) return rs(t, e)() || ze(e[t.index]);
      {
        let r = Wc(e, t);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let o = nt(e[Ee]);
          return en(o, r);
        } else return en(e, t.next);
      }
    }
  }
  return null;
}
function Wc(e, t) {
  if (t !== null) {
    let r = e[Ee][ge],
      o = t.projection;
    return r.projection[o];
  }
  return null;
}
function Ei(e, t) {
  let n = ie + e + 1;
  if (n < t.length) {
    let r = t[n],
      o = r[M].firstChild;
    if (o !== null) return en(r, o);
  }
  return t[tt];
}
function Tp(e, t, n) {
  e.removeChild(null, t, n);
}
function is(e, t, n, r, o, i, s) {
  for (; n != null; ) {
    if (n.type === 128) {
      n = n.next;
      continue;
    }
    let a = r[n.index],
      u = n.type;
    if (
      (s && t === 0 && (a && Ot(ze(a), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (u & 8) is(e, t, n.child, r, o, i, !1), Mt(t, e, o, a, i);
      else if (u & 32) {
        let c = rs(n, r),
          l;
        for (; (l = c()); ) Mt(t, e, o, l, i);
        Mt(t, e, o, a, i);
      } else u & 16 ? xp(e, t, r, n, o, i) : Mt(t, e, o, a, i);
    n = s ? n.projectionNext : n.next;
  }
}
function Gr(e, t, n, r, o, i) {
  is(n, r, e.firstChild, t, o, i, !1);
}
function xp(e, t, n, r, o, i) {
  let s = n[Ee],
    u = s[ge].projection[r.projection];
  if (Array.isArray(u))
    for (let c = 0; c < u.length; c++) {
      let l = u[c];
      Mt(t, e, o, l, i);
    }
  else {
    let c = u,
      l = s[Q];
    Rc(r) && (c.flags |= 128), is(e, t, c, l, o, i, !0);
  }
}
function Np(e, t, n, r, o) {
  let i = n[tt],
    s = ze(n);
  i !== s && Mt(t, e, r, i, o);
  for (let a = ie; a < n.length; a++) {
    let u = n[a];
    Gr(u[M], u, e, t, r, i);
  }
}
function Ap(e, t, n) {
  e.setAttribute(t, "style", n);
}
function Zc(e, t, n) {
  n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n);
}
function Qc(e, t, n) {
  let { mergedAttrs: r, classes: o, styles: i } = n;
  r !== null && oi(e, t, r),
    o !== null && Zc(e, t, o),
    i !== null && Ap(e, t, i);
}
var Yc = {};
function Rp(e, t, n, r) {
  if (!r)
    if ((t[C] & 3) === 3) {
      let i = e.preOrderCheckHooks;
      i !== null && dr(t, i, n);
    } else {
      let i = e.preOrderHooks;
      i !== null && fr(t, i, 0, n);
    }
  rt(n);
}
function ss(e, t = b.Default) {
  let n = pe();
  if (n === null) return _(e, t);
  let r = Oe();
  return bc(r, n, re(e), t);
}
function Kc(e, t, n, r, o, i) {
  let s = P(null);
  try {
    let a = null;
    o & Ue.SignalBased && (a = t[r][la]),
      a !== null && a.transformFn !== void 0 && (i = a.transformFn(i)),
      o & Ue.HasDecoratorInputTransform &&
        (i = e.inputTransforms[r].call(t, i)),
      e.setInput !== null ? e.setInput(t, a, i, n, r) : Zu(t, a, r, i);
  } finally {
    P(s);
  }
}
function Op(e, t) {
  let n = e.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        if (o < 0) rt(~o);
        else {
          let i = o,
            s = n[++r],
            a = n[++r];
          Th(s, i);
          let u = t[i];
          a(2, u);
        }
      }
    } finally {
      rt(-1);
    }
}
function as(e, t, n, r, o, i, s, a, u, c, l) {
  let d = t.blueprint.slice();
  return (
    (d[Ne] = o),
    (d[C] = r | 4 | 128 | 8 | 64),
    (c !== null || (e && e[C] & 2048)) && (d[C] |= 2048),
    Ju(d),
    (d[Q] = d[hn] = e),
    (d[He] = n),
    (d[_e] = s || (e && e[_e])),
    (d[Ie] = a || (e && e[Ie])),
    (d[Rt] = u || (e && e[Rt]) || null),
    (d[ge] = i),
    (d[Vr] = sp()),
    (d[Dr] = l),
    (d[Gu] = c),
    (d[Ee] = t.type == 2 ? e[Ee] : d),
    d
  );
}
function us(e, t, n, r, o) {
  let i = e.data[t];
  if (i === null) (i = Pp(e, t, n, r, o)), _h() && (i.flags |= 32);
  else if (i.type & 64) {
    (i.type = n), (i.value = r), (i.attrs = o);
    let s = bh();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return Hr(i, !0), i;
}
function Pp(e, t, n, r, o) {
  let i = rc(),
    s = oc(),
    a = s ? i : i && i.parent,
    u = (e.data[t] = Bp(e, a, n, t, r, o));
  return (
    e.firstChild === null && (e.firstChild = u),
    i !== null &&
      (s
        ? i.child == null && u.parent !== null && (i.child = u)
        : i.next === null && ((i.next = u), (u.prev = i))),
    u
  );
}
function Jc(e, t, n, r) {
  if (n === 0) return -1;
  let o = t.length;
  for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
  return o;
}
function Xc(e, t, n, r, o) {
  let i = Ah(),
    s = r & 2;
  try {
    rt(-1), s && t.length > et && Rp(e, t, et, !1), $e(s ? 2 : 0, o), n(r, o);
  } finally {
    rt(i), $e(s ? 3 : 1, o);
  }
}
function el(e, t, n) {
  if (Wu(t)) {
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
function Fp(e, t, n) {
  nc() && (qp(e, t, n, Re(n, t)), (n.flags & 64) === 64 && ol(e, t, n));
}
function kp(e, t, n = Re) {
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
function tl(e) {
  let t = e.tView;
  return t === null || t.incompleteFirstPass
    ? (e.tView = nl(
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
function nl(e, t, n, r, o, i, s, a, u, c, l) {
  let d = et + r,
    p = d + o,
    f = Lp(d, p),
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
function Lp(e, t) {
  let n = [];
  for (let r = 0; r < t; r++) n.push(r < e ? null : Yc);
  return n;
}
function jp(e, t, n, r) {
  let i = r.get(hp, jc) || n === Ce.ShadowDom,
    s = e.selectRootElement(t, i);
  return Vp(s), s;
}
function Vp(e) {
  $p(e);
}
var $p = () => null;
function Bp(e, t, n, r, o, i) {
  let s = t ? t.injectorIndex : -1,
    a = 0;
  return (
    Ch() && (a |= 128),
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
function pu(e, t, n, r, o) {
  for (let i in t) {
    if (!t.hasOwnProperty(i)) continue;
    let s = t[i];
    if (s === void 0) continue;
    r ??= {};
    let a,
      u = Ue.None;
    Array.isArray(s) ? ((a = s[0]), (u = s[1])) : (a = s);
    let c = i;
    if (o !== null) {
      if (!o.hasOwnProperty(i)) continue;
      c = o[i];
    }
    e === 0 ? gu(r, n, c, a, u) : gu(r, n, c, a);
  }
  return r;
}
function gu(e, t, n, r, o) {
  let i;
  e.hasOwnProperty(n) ? (i = e[n]).push(t, r) : (i = e[n] = [t, r]),
    o !== void 0 && i.push(o);
}
function Up(e, t, n) {
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
    (u = pu(0, d.inputs, l, u, f)), (c = pu(1, d.outputs, l, c, m));
    let A = u !== null && s !== null && !Vi(t) ? tg(u, l, s) : null;
    a.push(A);
  }
  u !== null &&
    (u.hasOwnProperty("class") && (t.flags |= 8),
    u.hasOwnProperty("style") && (t.flags |= 16)),
    (t.initialInputs = a),
    (t.inputs = u),
    (t.outputs = c);
}
function Hp(e, t, n, r) {
  if (nc()) {
    let o = r === null ? null : { "": -1 },
      i = Zp(e, n),
      s,
      a;
    i === null ? (s = a = null) : ([s, a] = i),
      s !== null && rl(e, t, n, s, o, a),
      o && Qp(n, r, o);
  }
  n.mergedAttrs = ji(n.mergedAttrs, n.attrs);
}
function rl(e, t, n, r, o, i) {
  for (let c = 0; c < r.length; c++) Uh(wc(n, t), e, r[c].type);
  Kp(n, e.data.length, r.length);
  for (let c = 0; c < r.length; c++) {
    let l = r[c];
    l.providersResolver && l.providersResolver(l);
  }
  let s = !1,
    a = !1,
    u = Jc(e, t, r.length, null);
  for (let c = 0; c < r.length; c++) {
    let l = r[c];
    (n.mergedAttrs = ji(n.mergedAttrs, l.hostAttrs)),
      Jp(e, n, t, u, l),
      Yp(u, l, o),
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
  Up(e, n, i);
}
function zp(e, t, n, r, o) {
  let i = o.hostBindings;
  if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~t.index;
    Gp(s) != a && s.push(a), s.push(n, r, i);
  }
}
function Gp(e) {
  let t = e.length;
  for (; t > 0; ) {
    let n = e[--t];
    if (typeof n == "number" && n < 0) return n;
  }
  return 0;
}
function qp(e, t, n, r) {
  let o = n.directiveStart,
    i = n.directiveEnd;
  Hi(n) && Xp(t, n, e.data[o + n.componentOffset]),
    e.firstCreatePass || wc(n, t),
    Ot(r, t);
  let s = n.initialInputs;
  for (let a = o; a < i; a++) {
    let u = e.data[a],
      c = ln(t, e, a, n);
    if ((Ot(c, t), s !== null && eg(t, a - o, c, u, n, s), pn(u))) {
      let l = gn(n.index, t);
      l[He] = ln(t, e, a, n);
    }
  }
}
function ol(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd,
    i = n.index,
    s = xh();
  try {
    rt(i);
    for (let a = r; a < o; a++) {
      let u = e.data[a],
        c = t[a];
      fi(a),
        (u.hostBindings !== null || u.hostVars !== 0 || u.hostAttrs !== null) &&
          Wp(u, c);
    }
  } finally {
    rt(-1), fi(s);
  }
}
function Wp(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t);
}
function Zp(e, t) {
  let n = e.directiveRegistry,
    r = null,
    o = null;
  if (n)
    for (let i = 0; i < n.length; i++) {
      let s = n[i];
      if (Bf(t, s.selectors, !1))
        if ((r || (r = []), pn(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (o = o || new Map()),
              s.findHostDirectiveDefs(s, a, o),
              r.unshift(...a, s);
            let u = a.length;
            bi(e, t, u);
          } else r.unshift(s), bi(e, t, 0);
        else
          (o = o || new Map()), s.findHostDirectiveDefs?.(s, r, o), r.push(s);
    }
  return r === null ? null : [r, o];
}
function bi(e, t, n) {
  (t.componentOffset = n), (e.components ??= []).push(t.index);
}
function Qp(e, t, n) {
  if (t) {
    let r = (e.localNames = []);
    for (let o = 0; o < t.length; o += 2) {
      let i = n[t[o + 1]];
      if (i == null) throw new v(-301, !1);
      r.push(t[o], i);
    }
  }
}
function Yp(e, t, n) {
  if (n) {
    if (t.exportAs)
      for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
    pn(t) && (n[""] = e);
  }
}
function Kp(e, t, n) {
  (e.flags |= 1),
    (e.directiveStart = t),
    (e.directiveEnd = t + n),
    (e.providerIndexes = t);
}
function Jp(e, t, n, r, o) {
  e.data[r] = o;
  let i = o.factory || (o.factory = xt(o.type, !0)),
    s = new cn(i, pn(o), ss);
  (e.blueprint[r] = s), (n[r] = s), zp(e, t, r, Jc(e, n, o.hostVars, Yc), o);
}
function Xp(e, t, n) {
  let r = Re(t, e),
    o = tl(n),
    i = e[_e].rendererFactory,
    s = 16;
  n.signals ? (s = 4096) : n.onPush && (s = 64);
  let a = cs(
    e,
    as(e, o, null, s, r, t, null, i.createRenderer(r, n), null, null, null),
  );
  e[t.index] = a;
}
function eg(e, t, n, r, o, i) {
  let s = i[t];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let u = s[a++],
        c = s[a++],
        l = s[a++],
        d = s[a++];
      Kc(r, n, u, c, l, d);
    }
}
function tg(e, t, n) {
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
function ng(e, t, n, r) {
  return [e, !0, 0, t, null, r, null, n, null, null];
}
function il(e, t) {
  let n = e.contentQueries;
  if (n !== null) {
    let r = P(null);
    try {
      for (let o = 0; o < n.length; o += 2) {
        let i = n[o],
          s = n[o + 1];
        if (s !== -1) {
          let a = e.data[s];
          sc(i), a.contentQueries(2, t[s], s);
        }
      }
    } finally {
      P(r);
    }
  }
}
function cs(e, t) {
  return e[an] ? (e[Xa][he] = t) : (e[an] = t), (e[Xa] = t), t;
}
function Si(e, t, n) {
  sc(0);
  let r = P(null);
  try {
    t(e, n);
  } finally {
    P(r);
  }
}
function rg(e, t) {
  let n = e[Rt],
    r = n ? n.get(Te, null) : null;
  r && r.handleError(t);
}
function sl(e, t, n, r, o) {
  for (let i = 0; i < n.length; ) {
    let s = n[i++],
      a = n[i++],
      u = n[i++],
      c = t[s],
      l = e.data[s];
    Kc(l, c, r, a, u, o);
  }
}
function og(e, t) {
  let n = gn(t, e),
    r = n[M];
  ig(r, n);
  let o = n[Ne];
  o !== null && n[Dr] === null && (n[Dr] = ns(o, n[Rt])), al(r, n, n[He]);
}
function ig(e, t) {
  for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
}
function al(e, t, n) {
  qi(t);
  try {
    let r = e.viewQuery;
    r !== null && Si(1, r, n);
    let o = e.template;
    o !== null && Xc(e, t, o, 1, n),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[jr]?.finishViewCreation(e),
      e.staticContentQueries && il(e, t),
      e.staticViewQueries && Si(2, e.viewQuery, n);
    let i = e.components;
    i !== null && sg(t, i);
  } catch (r) {
    throw (
      (e.firstCreatePass &&
        ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
      r)
    );
  } finally {
    (t[C] &= -5), Wi();
  }
}
function sg(e, t) {
  for (let n = 0; n < t.length; n++) og(e, t[n]);
}
function mu(e, t) {
  return !t || t.firstChild === null || Rc(e);
}
function ag(e, t, n, r = !0) {
  let o = t[M];
  if ((Dp(o, t, e, n), r)) {
    let s = Ei(n, e),
      a = t[Ie],
      u = Gc(a, e[tt]);
    u !== null && vp(o, e[ge], a, t, u, s);
  }
  let i = t[Dr];
  i !== null && i.firstChild !== null && (i.firstChild = null);
}
function Tr(e, t, n, r, o = !1) {
  for (; n !== null; ) {
    if (n.type === 128) {
      n = o ? n.projectionNext : n.next;
      continue;
    }
    let i = t[n.index];
    i !== null && r.push(ze(i)), Ae(i) && ug(i, r);
    let s = n.type;
    if (s & 8) Tr(e, t, n.child, r);
    else if (s & 32) {
      let a = rs(n, t),
        u;
      for (; (u = a()); ) r.push(u);
    } else if (s & 16) {
      let a = Wc(t, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let u = nt(t[Ee]);
        Tr(u[M], u, a, r, !0);
      }
    }
    n = o ? n.projectionNext : n.next;
  }
  return r;
}
function ug(e, t) {
  for (let n = ie; n < e.length; n++) {
    let r = e[n],
      o = r[M].firstChild;
    o !== null && Tr(r[M], r, o, t);
  }
  e[tt] !== e[Ne] && t.push(e[tt]);
}
var ul = [];
function cg(e) {
  return e[oe] ?? lg(e);
}
function lg(e) {
  let t = ul.pop() ?? Object.create(fg);
  return (t.lView = e), t;
}
function dg(e) {
  e.lView[oe] !== e && ((e.lView = null), ul.push(e));
}
var fg = k(g({}, So), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (e) => {
    Ur(e.lView);
  },
  consumerOnSignalRead() {
    this.lView[oe] = this;
  },
});
function hg(e) {
  let t = e[oe] ?? Object.create(pg);
  return (t.lView = e), t;
}
var pg = k(g({}, So), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (e) => {
    let t = nt(e.lView);
    for (; t && !cl(t[M]); ) t = nt(t);
    t && Xu(t);
  },
  consumerOnSignalRead() {
    this.lView[oe] = this;
  },
});
function cl(e) {
  return e.type !== 2;
}
var gg = 100;
function ll(e, t = !0, n = 0) {
  let r = e[_e],
    o = r.rendererFactory,
    i = !1;
  i || o.begin?.();
  try {
    mg(e, n);
  } catch (s) {
    throw (t && rg(e, s), s);
  } finally {
    i || (o.end?.(), r.inlineEffectRunner?.flush());
  }
}
function mg(e, t) {
  let n = ic();
  try {
    nu(!0), Mi(e, t);
    let r = 0;
    for (; Br(e); ) {
      if (r === gg) throw new v(103, !1);
      r++, Mi(e, 1);
    }
  } finally {
    nu(n);
  }
}
function vg(e, t, n, r) {
  let o = t[C];
  if ((o & 256) === 256) return;
  let i = !1,
    s = !1;
  !i && t[_e].inlineEffectRunner?.flush(), qi(t);
  let a = !0,
    u = null,
    c = null;
  i ||
    (cl(e)
      ? ((c = cg(t)), (u = Mo(c)))
      : da() === null
        ? ((a = !1), (c = hg(t)), (u = Mo(c)))
        : t[oe] && (To(t[oe]), (t[oe] = null)));
  try {
    Ju(t), Mh(e.bindingStartIndex), n !== null && Xc(e, t, n, 2, r);
    let l = (o & 3) === 3;
    if (!i)
      if (l) {
        let f = e.preOrderCheckHooks;
        f !== null && dr(t, f, null);
      } else {
        let f = e.preOrderHooks;
        f !== null && fr(t, f, 0, null), Yo(t, 0);
      }
    if ((s || yg(t), dl(t, 0), e.contentQueries !== null && il(e, t), !i))
      if (l) {
        let f = e.contentCheckHooks;
        f !== null && dr(t, f);
      } else {
        let f = e.contentHooks;
        f !== null && fr(t, f, 1), Yo(t, 1);
      }
    Op(e, t);
    let d = e.components;
    d !== null && hl(t, d, 0);
    let p = e.viewQuery;
    if ((p !== null && Si(2, p, r), !i))
      if (l) {
        let f = e.viewCheckHooks;
        f !== null && dr(t, f);
      } else {
        let f = e.viewHooks;
        f !== null && fr(t, f, 2), Yo(t, 2);
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[Qo])) {
      for (let f of t[Qo]) f();
      t[Qo] = null;
    }
    i || (t[C] &= -73);
  } catch (l) {
    throw (i || Ur(t), l);
  } finally {
    c !== null && (fa(c, u), a && dg(c)), Wi();
  }
}
function dl(e, t) {
  for (let n = Pc(e); n !== null; n = Fc(n))
    for (let r = ie; r < n.length; r++) {
      let o = n[r];
      fl(o, t);
    }
}
function yg(e) {
  for (let t = Pc(e); t !== null; t = Fc(t)) {
    if (!(t[C] & Ir.HasTransplantedViews)) continue;
    let n = t[Cr];
    for (let r = 0; r < n.length; r++) {
      let o = n[r];
      Xu(o);
    }
  }
}
function Dg(e, t, n) {
  let r = gn(t, e);
  fl(r, n);
}
function fl(e, t) {
  zi(e) && Mi(e, t);
}
function Mi(e, t) {
  let r = e[M],
    o = e[C],
    i = e[oe],
    s = !!(t === 0 && o & 16);
  if (
    ((s ||= !!(o & 64 && t === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && _o(i))),
    (s ||= !1),
    i && (i.dirty = !1),
    (e[C] &= -9217),
    s)
  )
    vg(r, e, r.template, e[He]);
  else if (o & 8192) {
    dl(e, 1);
    let a = r.components;
    a !== null && hl(e, a, 1);
  }
}
function hl(e, t, n) {
  for (let r = 0; r < t.length; r++) Dg(e, t[r], n);
}
function pl(e, t) {
  let n = ic() ? 64 : 1088;
  for (e[_e].changeDetectionScheduler?.notify(t); e; ) {
    e[C] |= n;
    let r = nt(e);
    if (ci(e) && !r) return e;
    e = r;
  }
  return null;
}
var Pt = class {
  get rootNodes() {
    let t = this._lView,
      n = t[M];
    return Tr(n, t, n.firstChild, []);
  }
  constructor(t, n, r = !0) {
    (this._lView = t),
      (this._cdRefInjectingView = n),
      (this.notifyErrorHandler = r),
      (this._appRef = null),
      (this._attachedToViewContainer = !1);
  }
  get context() {
    return this._lView[He];
  }
  set context(t) {
    this._lView[He] = t;
  }
  get destroyed() {
    return (this._lView[C] & 256) === 256;
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
      let t = this._lView[Q];
      if (Ae(t)) {
        let n = t[wr],
          r = n ? n.indexOf(this) : -1;
        r > -1 && (Ii(t, r), vr(n, r));
      }
      this._attachedToViewContainer = !1;
    }
    Hc(this._lView[M], this._lView);
  }
  onDestroy(t) {
    ec(this._lView, t);
  }
  markForCheck() {
    pl(this._cdRefInjectingView || this._lView, 4);
  }
  detach() {
    this._lView[C] &= -129;
  }
  reattach() {
    di(this._lView), (this._lView[C] |= 128);
  }
  detectChanges() {
    (this._lView[C] |= 1024), ll(this._lView, this.notifyErrorHandler);
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new v(902, !1);
    this._attachedToViewContainer = !0;
  }
  detachFromAppRef() {
    this._appRef = null;
    let t = ci(this._lView),
      n = this._lView[un];
    n !== null && !t && os(n, this._lView), Bc(this._lView[M], this._lView);
  }
  attachToAppRef(t) {
    if (this._attachedToViewContainer) throw new v(902, !1);
    this._appRef = t;
    let n = ci(this._lView),
      r = this._lView[un];
    r !== null && !n && Uc(r, this._lView), di(this._lView);
  }
};
var gb = new RegExp(`^(\\d+)*(${dp}|${lp})*(.*)`);
var wg = () => null;
function vu(e, t) {
  return wg(e, t);
}
var Ft = class {},
  qr = new E("", { providedIn: "root", factory: () => !1 });
var gl = new E(""),
  ml = new E(""),
  _i = class {},
  xr = class {};
function Cg(e) {
  let t = Error(`No component factory found for ${X(e)}.`);
  return (t[Ig] = e), t;
}
var Ig = "ngComponent";
var Ti = class {
    resolveComponentFactory(t) {
      throw Cg(t);
    }
  },
  kt = class {
    static {
      this.NULL = new Ti();
    }
  },
  Lt = class {};
var Eg = (() => {
  class e {
    static {
      this.ɵprov = D({ token: e, providedIn: "root", factory: () => null });
    }
  }
  return e;
})();
function xi(e, t, n) {
  let r = n ? e.styles : null,
    o = n ? e.classes : null,
    i = 0;
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if (typeof a == "number") i = a;
      else if (i == 1) o = Ua(o, a);
      else if (i == 2) {
        let u = a,
          c = t[++s];
        r = Ua(r, u + ": " + c + ";");
      }
    }
  n ? (e.styles = r) : (e.stylesWithoutHost = r),
    n ? (e.classes = o) : (e.classesWithoutHost = o);
}
var Nr = class extends kt {
  constructor(t) {
    super(), (this.ngModule = t);
  }
  resolveComponentFactory(t) {
    let n = Xe(t);
    return new dn(n, this.ngModule);
  }
};
function yu(e, t) {
  let n = [];
  for (let r in e) {
    if (!e.hasOwnProperty(r)) continue;
    let o = e[r];
    if (o === void 0) continue;
    let i = Array.isArray(o),
      s = i ? o[0] : o,
      a = i ? o[1] : Ue.None;
    t
      ? n.push({
          propName: s,
          templateName: r,
          isSignal: (a & Ue.SignalBased) !== 0,
        })
      : n.push({ propName: s, templateName: r });
  }
  return n;
}
function bg(e) {
  let t = e.toLowerCase();
  return t === "svg" ? hh : t === "math" ? ph : null;
}
var dn = class extends xr {
    get inputs() {
      let t = this.componentDef,
        n = t.inputTransforms,
        r = yu(t.inputs, !0);
      if (n !== null)
        for (let o of r)
          n.hasOwnProperty(o.propName) && (o.transform = n[o.propName]);
      return r;
    }
    get outputs() {
      return yu(this.componentDef.outputs, !1);
    }
    constructor(t, n) {
      super(),
        (this.componentDef = t),
        (this.ngModule = n),
        (this.componentType = t.type),
        (this.selector = Gf(t.selectors)),
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
        let a = s ? new hi(t, s) : t,
          u = a.get(Lt, null);
        if (u === null) throw new v(407, !1);
        let c = a.get(Eg, null),
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
            ? jp(p, r, this.componentDef.encapsulation, a)
            : $c(p, f, bg(f)),
          A = 512;
        this.componentDef.signals
          ? (A |= 4096)
          : this.componentDef.onPush || (A |= 16);
        let $ = null;
        m !== null && ($ = ns(m, a, !0));
        let L = nl(0, null, null, 1, 0, null, null, null, null, null, null),
          ve = as(null, L, null, A, null, null, d, p, a, null, $);
        qi(ve);
        let We,
          Bn,
          Un = null;
        try {
          let ye = this.componentDef,
            ft,
            Io = null;
          ye.findHostDirectiveDefs
            ? ((ft = []),
              (Io = new Map()),
              ye.findHostDirectiveDefs(ye, ft, Io),
              ft.push(ye))
            : (ft = [ye]);
          let Fd = Sg(ve, m);
          (Un = Mg(Fd, m, ye, ft, ve, d, p)),
            (Bn = gh(L, et)),
            m && xg(p, ye, m, r),
            n !== void 0 && Ng(Bn, this.ngContentSelectors, n),
            (We = Tg(Un, ye, ft, Io, ve, [Ag])),
            al(L, ve, null);
        } catch (ye) {
          throw (Un !== null && wi(Un), wi(ve), ye);
        } finally {
          Wi();
        }
        return new Ni(this.componentType, We, Ji(Bn, ve), ve, Bn);
      } finally {
        P(i);
      }
    }
  },
  Ni = class extends _i {
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
        sl(i[M], i, o, t, n), this.previousInputValues.set(t, n);
        let s = gn(this._tNode.index, i);
        pl(s, 1);
      }
    }
    get injector() {
      return new Je(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(t) {
      this.hostView.onDestroy(t);
    }
  };
function Sg(e, t) {
  let n = e[M],
    r = et;
  return (e[r] = t), us(n, r, 2, "#host", null);
}
function Mg(e, t, n, r, o, i, s) {
  let a = o[M];
  _g(r, e, t, s);
  let u = null;
  t !== null && (u = ns(t, o[Rt]));
  let c = i.rendererFactory.createRenderer(t, n),
    l = 16;
  n.signals ? (l = 4096) : n.onPush && (l = 64);
  let d = as(o, tl(n), null, l, o[e.index], e, i, c, null, null, u);
  return (
    a.firstCreatePass && bi(a, e, r.length - 1), cs(o, d), (o[e.index] = d)
  );
}
function _g(e, t, n, r) {
  for (let o of e) t.mergedAttrs = ji(t.mergedAttrs, o.hostAttrs);
  t.mergedAttrs !== null &&
    (xi(t, t.mergedAttrs, !0), n !== null && Qc(r, n, t));
}
function Tg(e, t, n, r, o, i) {
  let s = Oe(),
    a = o[M],
    u = Re(s, o);
  rl(a, o, s, n, null, r);
  for (let l = 0; l < n.length; l++) {
    let d = s.directiveStart + l,
      p = ln(o, a, d, s);
    Ot(p, o);
  }
  ol(a, o, s), u && Ot(u, o);
  let c = ln(o, a, s.directiveStart + s.componentOffset, s);
  if (((e[He] = o[He] = c), i !== null)) for (let l of i) l(c, t);
  return el(a, s, o), c;
}
function xg(e, t, n, r) {
  if (r) oi(e, n, ["ng-version", "18.2.7"]);
  else {
    let { attrs: o, classes: i } = qf(t.selectors[0]);
    o && oi(e, n, o), i && i.length > 0 && Zc(e, n, i.join(" "));
  }
}
function Ng(e, t, n) {
  let r = (e.projection = []);
  for (let o = 0; o < t.length; o++) {
    let i = n[o];
    r.push(i != null ? Array.from(i) : null);
  }
}
function Ag() {
  let e = Oe();
  gc(pe()[M], e);
}
var Wr = (() => {
  class e {
    static {
      this.__NG_ELEMENT_ID__ = Rg;
    }
  }
  return e;
})();
function Rg() {
  let e = Oe();
  return Pg(e, pe());
}
var Og = Wr,
  vl = class extends Og {
    constructor(t, n, r) {
      super(),
        (this._lContainer = t),
        (this._hostTNode = n),
        (this._hostLView = r);
    }
    get element() {
      return Ji(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new Je(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let t = Zi(this._hostTNode, this._hostLView);
      if (vc(t)) {
        let n = br(t, this._hostLView),
          r = Er(t),
          o = n[M].data[r + 8];
        return new Je(o, n);
      } else return new Je(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(t) {
      let n = Du(this._lContainer);
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
      let s = vu(this._lContainer, t.ssrId),
        a = t.createEmbeddedViewImpl(n || {}, i, s);
      return this.insertImpl(a, o, mu(this._hostTNode, s)), a;
    }
    createComponent(t, n, r, o, i) {
      let s = t && !uh(t),
        a;
      if (s) a = n;
      else {
        let m = n || {};
        (a = m.index),
          (r = m.injector),
          (o = m.projectableNodes),
          (i = m.environmentInjector || m.ngModuleRef);
      }
      let u = s ? t : new dn(Xe(t)),
        c = r || this.parentInjector;
      if (!i && u.ngModule == null) {
        let A = (s ? c : this.parentInjector).get(se, null);
        A && (i = A);
      }
      let l = Xe(u.componentType ?? {}),
        d = vu(this._lContainer, l?.id ?? null),
        p = d?.firstChild ?? null,
        f = u.create(c, o, p, i);
      return this.insertImpl(f.hostView, a, mu(this._hostTNode, d)), f;
    }
    insert(t, n) {
      return this.insertImpl(t, n, !0);
    }
    insertImpl(t, n, r) {
      let o = t._lView;
      if (mh(o)) {
        let a = this.indexOf(t);
        if (a !== -1) this.detach(a);
        else {
          let u = o[Q],
            c = new vl(u, u[ge], u[Q]);
          c.detach(c.indexOf(t));
        }
      }
      let i = this._adjustIndex(n),
        s = this._lContainer;
      return ag(s, o, i, r), t.attachToViewContainerRef(), Au(ti(s), i, t), t;
    }
    move(t, n) {
      return this.insert(t, n);
    }
    indexOf(t) {
      let n = Du(this._lContainer);
      return n !== null ? n.indexOf(t) : -1;
    }
    remove(t) {
      let n = this._adjustIndex(t, -1),
        r = Ii(this._lContainer, n);
      r && (vr(ti(this._lContainer), n), Hc(r[M], r));
    }
    detach(t) {
      let n = this._adjustIndex(t, -1),
        r = Ii(this._lContainer, n);
      return r && vr(ti(this._lContainer), n) != null ? new Pt(r) : null;
    }
    _adjustIndex(t, n = 0) {
      return t ?? this.length + n;
    }
  };
function Du(e) {
  return e[wr];
}
function ti(e) {
  return e[wr] || (e[wr] = []);
}
function Pg(e, t) {
  let n,
    r = t[e.index];
  return (
    Ae(r) ? (n = r) : ((n = ng(r, t, null, e)), (t[e.index] = n), cs(t, n)),
    kg(n, t, e, r),
    new vl(n, e, t)
  );
}
function Fg(e, t) {
  let n = e[Ie],
    r = n.createComment(""),
    o = Re(t, e),
    i = Gc(n, o);
  return _r(n, i, r, bp(n, o), !1), r;
}
var kg = Lg;
function Lg(e, t, n, r) {
  if (e[tt]) return;
  let o;
  n.type & 8 ? (o = ze(r)) : (o = Fg(t, n)), (e[tt] = o);
}
var wu = new Set();
function ls(e) {
  wu.has(e) ||
    (wu.add(e),
    performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
}
var Ge = class {},
  fn = class {};
var Ai = class extends Ge {
    constructor(t, n, r, o = !0) {
      super(),
        (this.ngModuleType = t),
        (this._parent = n),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new Nr(this));
      let i = Vu(t);
      (this._bootstrapComponents = Vc(i.bootstrap)),
        (this._r3Injector = _c(
          t,
          n,
          [
            { provide: Ge, useValue: this },
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
  Ri = class extends fn {
    constructor(t) {
      super(), (this.moduleType = t);
    }
    create(t) {
      return new Ai(this.moduleType, t, []);
    }
  };
var Ar = class extends Ge {
  constructor(t) {
    super(),
      (this.componentFactoryResolver = new Nr(this)),
      (this.instance = null);
    let n = new sn(
      [
        ...t.providers,
        { provide: Ge, useValue: this },
        { provide: kt, useValue: this.componentFactoryResolver },
      ],
      t.parent || Ui(),
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
function ds(e, t, n = null) {
  return new Ar({
    providers: e,
    parent: t,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector;
}
function jg(e) {
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
  Vg = (() => {
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
  Cu = class e {
    constructor() {
      (this.ngZone = h(V)),
        (this.scheduler = h(Ft)),
        (this.errorHandler = h(Te, { optional: !0 })),
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
function Iu(e, t, n, r, o) {
  let i = t.inputs,
    s = o ? "class" : "style";
  sl(e, n, i[s], s, r);
}
function $g(e, t, n, r, o, i) {
  let s = t.consts,
    a = tu(s, o),
    u = us(t, e, 2, r, a);
  return (
    Hp(t, n, u, tu(s, i)),
    u.attrs !== null && xi(u, u.attrs, !1),
    u.mergedAttrs !== null && xi(u, u.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, u),
    u
  );
}
function Zr(e, t, n, r) {
  let o = pe(),
    i = Gi(),
    s = et + e,
    a = o[Ie],
    u = i.firstCreatePass ? $g(s, i, o, t, n, r) : i.data[s],
    c = Bg(i, o, u, a, t, e);
  o[s] = c;
  let l = ch(u);
  return (
    Hr(u, !0),
    Qc(a, c, u),
    !jg(u) && hc() && qc(i, o, c, u),
    yh() === 0 && Ot(c, o),
    Dh(),
    l && (Fp(i, o, u), el(i, u, o)),
    r !== null && kp(o, u),
    Zr
  );
}
function Qr() {
  let e = Oe();
  oc() ? Sh() : ((e = e.parent), Hr(e, !1));
  let t = e;
  Ih(t) && Eh(), wh();
  let n = Gi();
  return (
    n.firstCreatePass && (gc(n, e), Wu(e) && n.queries.elementEnd(e)),
    t.classesWithoutHost != null &&
      kh(t) &&
      Iu(n, t, pe(), t.classesWithoutHost, !0),
    t.stylesWithoutHost != null &&
      Lh(t) &&
      Iu(n, t, pe(), t.stylesWithoutHost, !1),
    Qr
  );
}
function fs(e, t, n, r) {
  return Zr(e, t, n, r), Qr(), fs;
}
var Bg = (e, t, n, r, o, i) => (pc(!0), $c(r, o, Rh()));
var Rr = "en-US";
var Ug = Rr;
function Hg(e) {
  typeof e == "string" && (Ug = e.toLowerCase().replace(/_/g, "-"));
}
function yl(e, t = "") {
  let n = pe(),
    r = Gi(),
    o = e + et,
    i = r.firstCreatePass ? us(r, o, 1, t, null) : r.data[o],
    s = zg(r, n, i, t, e);
  (n[o] = s), hc() && qc(r, n, s, i), Hr(i, !1);
}
var zg = (e, t, n, r, o) => (pc(!0), gp(t[Ie], r));
var Gg = (() => {
  class e {
    constructor(n) {
      (this._injector = n), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let r = Uu(!1, n.type),
          o =
            r.length > 0
              ? ds([r], this._injector, `Standalone[${n.type.name}]`)
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
function Yr(e) {
  ls("NgStandalone"),
    (e.getStandaloneInjector = (t) =>
      t.get(Gg).getOrCreateStandaloneInjector(e));
}
var Kr = (() => {
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
var Dl = new E("");
function mn(e) {
  return !!e && typeof e.then == "function";
}
function wl(e) {
  return !!e && typeof e.subscribe == "function";
}
var Cl = new E(""),
  Il = (() => {
    class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((n, r) => {
            (this.resolve = n), (this.reject = r);
          })),
          (this.appInits = h(Cl, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let o of this.appInits) {
          let i = o();
          if (mn(i)) n.push(i);
          else if (wl(i)) {
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
  hs = new E("");
function qg() {
  ha(() => {
    throw new v(600, !1);
  });
}
function Wg(e) {
  return e.isBoundToModule;
}
var Zg = 10;
function Qg(e, t, n) {
  try {
    let r = n();
    return mn(r)
      ? r.catch((o) => {
          throw (t.runOutsideAngular(() => e.handleError(o)), o);
        })
      : r;
  } catch (r) {
    throw (t.runOutsideAngular(() => e.handleError(r)), r);
  }
}
var st = (() => {
  class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = h(rp)),
        (this.afterRenderManager = h(Vg)),
        (this.zonelessEnabled = h(qr)),
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
      let o = n instanceof xr;
      if (!this._injector.get(Il).done) {
        let p = !o && ju(n),
          f = !1;
        throw new v(405, f);
      }
      let s;
      o ? (s = n) : (s = this._injector.get(kt).resolveComponentFactory(n)),
        this.componentTypes.push(s.componentType);
      let a = Wg(s) ? void 0 : this._injector.get(Ge),
        u = r || s.selector,
        c = s.create(ot.NULL, [], u, a),
        l = c.location.nativeElement,
        d = c.injector.get(Dl, null);
      return (
        d?.registerApplication(l),
        c.onDestroy(() => {
          this.detachView(c.hostView),
            hr(this.components, c),
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
      for (; this.dirtyFlags !== 0 && r++ < Zg; ) this.synchronizeOnce(n);
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
          Yg(o, i, r, this.zonelessEnabled);
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
      if (this.allViews.some(({ _lView: n }) => Br(n))) {
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
      hr(this._views, r), r.detachFromAppRef();
    }
    _loadComponent(n) {
      this.attachView(n.hostView), this.tick(), this.components.push(n);
      let r = this._injector.get(hs, []);
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
        this._destroyListeners.push(n), () => hr(this._destroyListeners, n)
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
function hr(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function Yg(e, t, n, r) {
  if (!n && !Br(e)) return;
  ll(e, t, n && !r ? 0 : 1);
}
var Oi = class {
    constructor(t, n) {
      (this.ngModuleFactory = t), (this.componentFactories = n);
    }
  },
  ps = (() => {
    class e {
      compileModuleSync(n) {
        return new Ri(n);
      }
      compileModuleAsync(n) {
        return Promise.resolve(this.compileModuleSync(n));
      }
      compileModuleAndAllComponentsSync(n) {
        let r = this.compileModuleSync(n),
          o = Vu(n),
          i = Vc(o.declarations).reduce((s, a) => {
            let u = Xe(a);
            return u && s.push(new dn(u)), s;
          }, []);
        return new Oi(r, i);
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
var Kg = (() => {
    class e {
      constructor() {
        (this.zone = h(V)),
          (this.changeDetectionScheduler = h(Ft)),
          (this.applicationRef = h(st));
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
  Jg = new E("", { factory: () => !1 });
function El({
  ngZoneFactory: e,
  ignoreChangesOutsideZone: t,
  scheduleInRootZone: n,
}) {
  return (
    (e ??= () => new V(k(g({}, Sl()), { scheduleInRootZone: n }))),
    [
      { provide: V, useFactory: e },
      {
        provide: At,
        multi: !0,
        useFactory: () => {
          let r = h(Kg, { optional: !0 });
          return () => r.initialize();
        },
      },
      {
        provide: At,
        multi: !0,
        useFactory: () => {
          let r = h(Xg);
          return () => {
            r.initialize();
          };
        },
      },
      t === !0 ? { provide: gl, useValue: !0 } : [],
      { provide: ml, useValue: n ?? Tc },
    ]
  );
}
function bl(e) {
  let t = e?.ignoreChangesOutsideZone,
    n = e?.scheduleInRootZone,
    r = El({
      ngZoneFactory: () => {
        let o = Sl(e);
        return (
          (o.scheduleInRootZone = n),
          o.shouldCoalesceEventChangeDetection && ls("NgZone_CoalesceEvent"),
          new V(o)
        );
      },
      ignoreChangesOutsideZone: t,
      scheduleInRootZone: n,
    });
  return kr([{ provide: Jg, useValue: !0 }, { provide: qr, useValue: !1 }, r]);
}
function Sl(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  };
}
var Xg = (() => {
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
var em = (() => {
  class e {
    constructor() {
      (this.appRef = h(st)),
        (this.taskService = h(jt)),
        (this.ngZone = h(V)),
        (this.zonelessEnabled = h(qr)),
        (this.disableScheduling = h(gl, { optional: !0 }) ?? !1),
        (this.zoneIsDefined = typeof Zone < "u" && !!Zone.root.run),
        (this.schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }]),
        (this.subscriptions = new j()),
        (this.angularZoneId = this.zoneIsDefined
          ? this.ngZone._inner?.get(Mr)
          : null),
        (this.scheduleInRootZone =
          !this.zonelessEnabled &&
          this.zoneIsDefined &&
          (h(ml, { optional: !0 }) ?? !1)),
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
          (this.ngZone instanceof Di || !this.zoneIsDefined));
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
      let r = this.useMicrotaskScheduler ? uu : Nc;
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
          Zone.current.get(Mr + this.angularZoneId))
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
        uu(() => {
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
function tm() {
  return (typeof $localize < "u" && $localize.locale) || Rr;
}
var gs = new E("", {
  providedIn: "root",
  factory: () => h(gs, b.Optional | b.SkipSelf) || tm(),
});
var Ml = new E("");
function cr(e) {
  return !!e.platformInjector;
}
function nm(e) {
  let t = cr(e) ? e.r3Injector : e.moduleRef.injector,
    n = t.get(V);
  return n.run(() => {
    cr(e)
      ? e.r3Injector.resolveInjectorInitializers()
      : e.moduleRef.resolveInjectorInitializers();
    let r = t.get(Te, null),
      o;
    if (
      (n.runOutsideAngular(() => {
        o = n.onError.subscribe({
          next: (i) => {
            r.handleError(i);
          },
        });
      }),
      cr(e))
    ) {
      let i = () => t.destroy(),
        s = e.platformInjector.get(Ml);
      s.add(i),
        t.onDestroy(() => {
          o.unsubscribe(), s.delete(i);
        });
    } else
      e.moduleRef.onDestroy(() => {
        hr(e.allPlatformModules, e.moduleRef), o.unsubscribe();
      });
    return Qg(r, n, () => {
      let i = t.get(Il);
      return (
        i.runInitializers(),
        i.donePromise.then(() => {
          let s = t.get(gs, Rr);
          if ((Hg(s || Rr), cr(e))) {
            let a = t.get(st);
            return (
              e.rootComponent !== void 0 && a.bootstrap(e.rootComponent), a
            );
          } else return rm(e.moduleRef, e.allPlatformModules), e.moduleRef;
        })
      );
    });
  });
}
function rm(e, t) {
  let n = e.injector.get(st);
  if (e._bootstrapComponents.length > 0)
    e._bootstrapComponents.forEach((r) => n.bootstrap(r));
  else if (e.instance.ngDoBootstrap) e.instance.ngDoBootstrap(n);
  else throw new v(-403, !1);
  t.push(e);
}
var pr = null;
function om(e = [], t) {
  return ot.create({
    name: t,
    providers: [
      { provide: Lr, useValue: "platform" },
      { provide: Ml, useValue: new Set([() => (pr = null)]) },
      ...e,
    ],
  });
}
function im(e = []) {
  if (pr) return pr;
  let t = om(e);
  return (pr = t), qg(), sm(t), t;
}
function sm(e) {
  e.get(es, null)?.forEach((n) => n());
}
var vn = (() => {
  class e {
    static {
      this.__NG_ELEMENT_ID__ = am;
    }
  }
  return e;
})();
function am(e) {
  return um(Oe(), pe(), (e & 16) === 16);
}
function um(e, t, n) {
  if (Hi(e) && !n) {
    let r = gn(e.index, t);
    return new Pt(r, r);
  } else if (e.type & 175) {
    let r = t[Ee];
    return new Pt(r, t);
  }
  return null;
}
function _l(e) {
  try {
    let { rootComponent: t, appProviders: n, platformProviders: r } = e,
      o = im(r),
      i = [El({}), { provide: Ft, useExisting: em }, ...(n || [])],
      s = new Ar({
        providers: i,
        parent: o,
        debugName: "",
        runEnvironmentInitializers: !1,
      });
    return nm({
      r3Injector: s.injector,
      platformInjector: o,
      rootComponent: t,
    });
  } catch (t) {
    return Promise.reject(t);
  }
}
var Pl = null;
function $t() {
  return Pl;
}
function Fl(e) {
  Pl ??= e;
}
var Xr = class {};
var ae = new E(""),
  kl = (() => {
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
          factory: () => h(hm),
          providedIn: "platform",
        });
      }
    }
    return e;
  })();
var hm = (() => {
  class e extends kl {
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
function Ll(e, t) {
  if (e.length == 0) return t;
  if (t.length == 0) return e;
  let n = 0;
  return (
    e.endsWith("/") && n++,
    t.startsWith("/") && n++,
    n == 2 ? e + t.substring(1) : n == 1 ? e + t : e + "/" + t
  );
}
function Tl(e) {
  let t = e.match(/#|\?|$/),
    n = (t && t.index) || e.length,
    r = n - (e[n - 1] === "/" ? 1 : 0);
  return e.slice(0, r) + e.slice(n);
}
function at(e) {
  return e && e[0] !== "?" ? "?" + e : e;
}
var to = (() => {
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
        this.ɵprov = D({ token: e, factory: () => h(jl), providedIn: "root" });
      }
    }
    return e;
  })(),
  pm = new E(""),
  jl = (() => {
    class e extends to {
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
        return Ll(this._baseHref, n);
      }
      path(n = !1) {
        let r =
            this._platformLocation.pathname + at(this._platformLocation.search),
          o = this._platformLocation.hash;
        return o && n ? `${r}${o}` : r;
      }
      pushState(n, r, o, i) {
        let s = this.prepareExternalUrl(o + at(i));
        this._platformLocation.pushState(n, r, s);
      }
      replaceState(n, r, o, i) {
        let s = this.prepareExternalUrl(o + at(i));
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
          return new (r || e)(_(kl), _(pm, 8));
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })();
var yn = (() => {
  class e {
    constructor(n) {
      (this._subject = new Z()),
        (this._urlChangeListeners = []),
        (this._urlChangeSubscription = null),
        (this._locationStrategy = n);
      let r = this._locationStrategy.getBaseHref();
      (this._basePath = vm(Tl(xl(r)))),
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
      return this.path() == this.normalize(n + at(r));
    }
    normalize(n) {
      return e.stripTrailingSlash(mm(this._basePath, xl(n)));
    }
    prepareExternalUrl(n) {
      return (
        n && n[0] !== "/" && (n = "/" + n),
        this._locationStrategy.prepareExternalUrl(n)
      );
    }
    go(n, r = "", o = null) {
      this._locationStrategy.pushState(o, "", n, r),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(n + at(r)), o);
    }
    replaceState(n, r = "", o = null) {
      this._locationStrategy.replaceState(o, "", n, r),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(n + at(r)), o);
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
      this.normalizeQueryParams = at;
    }
    static {
      this.joinWithSlash = Ll;
    }
    static {
      this.stripTrailingSlash = Tl;
    }
    static {
      this.ɵfac = function (r) {
        return new (r || e)(_(to));
      };
    }
    static {
      this.ɵprov = D({ token: e, factory: () => gm(), providedIn: "root" });
    }
  }
  return e;
})();
function gm() {
  return new yn(_(to));
}
function mm(e, t) {
  if (!e || !t.startsWith(e)) return t;
  let n = t.substring(e.length);
  return n === "" || ["/", ";", "?", "#"].includes(n[0]) ? n : t;
}
function xl(e) {
  return e.replace(/\/index.html$/, "");
}
function vm(e) {
  if (new RegExp("^(https?:)?//").test(e)) {
    let [, n] = e.split(/\/\/[^\/]+/);
    return n;
  }
  return e;
}
function Vl(e, t) {
  t = encodeURIComponent(t);
  for (let n of e.split(";")) {
    let r = n.indexOf("="),
      [o, i] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
    if (o.trim() === t) return decodeURIComponent(i);
  }
  return null;
}
var $l = "browser",
  ym = "server";
function ms(e) {
  return e === ym;
}
var eo = class {};
var Ds = class extends Xr {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  ws = class e extends Ds {
    static makeCurrent() {
      Fl(new e());
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
      let n = wm();
      return n == null ? null : Cm(n);
    }
    resetBaseElement() {
      Dn = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(t) {
      return Vl(document.cookie, t);
    }
  },
  Dn = null;
function wm() {
  return (
    (Dn = Dn || document.querySelector("base")),
    Dn ? Dn.getAttribute("href") : null
  );
}
function Cm(e) {
  return new URL(e, document.baseURI).pathname;
}
var Im = (() => {
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
  Cs = new E(""),
  zl = (() => {
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
          return new (r || e)(_(Cs), _(V));
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  no = class {
    constructor(t) {
      this._doc = t;
    }
  },
  vs = "ng-app-id",
  Gl = (() => {
    class e {
      constructor(n, r, o, i = {}) {
        (this.doc = n),
          (this.appId = r),
          (this.nonce = o),
          (this.platformId = i),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = ms(i)),
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
        let n = this.doc.head?.querySelectorAll(`style[${vs}="${this.appId}"]`);
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
        if (i?.parentNode === n) return o.delete(r), i.removeAttribute(vs), i;
        {
          let s = this.doc.createElement("style");
          return (
            this.nonce && s.setAttribute("nonce", this.nonce),
            (s.textContent = r),
            this.platformIsServer && s.setAttribute(vs, this.appId),
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
          return new (r || e)(_(ae), _(Xi), _(ts, 8), _(Vt));
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  ys = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/Math/MathML",
  },
  Es = /%COMP%/g,
  ql = "%COMP%",
  Em = `_nghost-${ql}`,
  bm = `_ngcontent-${ql}`,
  Sm = !0,
  Mm = new E("", { providedIn: "root", factory: () => Sm });
function _m(e) {
  return bm.replace(Es, e);
}
function Tm(e) {
  return Em.replace(Es, e);
}
function Wl(e, t) {
  return t.map((n) => n.replace(Es, e));
}
var Bl = (() => {
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
          (this.platformIsServer = ms(a)),
          (this.defaultRenderer = new wn(n, s, u, this.platformIsServer));
      }
      createRenderer(n, r) {
        if (!n || !r) return this.defaultRenderer;
        this.platformIsServer &&
          r.encapsulation === Ce.ShadowDom &&
          (r = k(g({}, r), { encapsulation: Ce.Emulated }));
        let o = this.getOrCreateRenderer(n, r);
        return (
          o instanceof ro
            ? o.applyToHost(n)
            : o instanceof Cn && o.applyStyles(),
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
            case Ce.Emulated:
              i = new ro(u, c, r, this.appId, l, s, a, d);
              break;
            case Ce.ShadowDom:
              return new Is(u, c, n, r, s, a, this.nonce, d);
            default:
              i = new Cn(u, c, r, l, s, a, d);
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
            _(zl),
            _(Gl),
            _(Xi),
            _(Mm),
            _(ae),
            _(Vt),
            _(V),
            _(ts),
          );
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  wn = class {
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
        ? this.doc.createElementNS(ys[n] || n, t)
        : this.doc.createElement(t);
    }
    createComment(t) {
      return this.doc.createComment(t);
    }
    createText(t) {
      return this.doc.createTextNode(t);
    }
    appendChild(t, n) {
      (Ul(t) ? t.content : t).appendChild(n);
    }
    insertBefore(t, n, r) {
      t && (Ul(t) ? t.content : t).insertBefore(n, r);
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
        let i = ys[o];
        i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
      } else t.setAttribute(n, r);
    }
    removeAttribute(t, n, r) {
      if (r) {
        let o = ys[r];
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
      o & (it.DashCase | it.Important)
        ? t.style.setProperty(n, r, o & it.Important ? "important" : "")
        : (t.style[n] = r);
    }
    removeStyle(t, n, r) {
      r & it.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
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
function Ul(e) {
  return e.tagName === "TEMPLATE" && e.content !== void 0;
}
var Is = class extends wn {
    constructor(t, n, r, o, i, s, a, u) {
      super(t, i, s, u),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let c = Wl(o.id, o.styles);
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
  Cn = class extends wn {
    constructor(t, n, r, o, i, s, a, u) {
      super(t, i, s, a),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = o),
        (this.styles = u ? Wl(u, r.styles) : r.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  ro = class extends Cn {
    constructor(t, n, r, o, i, s, a, u) {
      let c = o + "-" + r.id;
      super(t, n, r, i, s, a, u, c),
        (this.contentAttr = _m(c)),
        (this.hostAttr = Tm(c));
    }
    applyToHost(t) {
      this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
    }
    createElement(t, n) {
      let r = super.createElement(t, n);
      return super.setAttribute(r, this.contentAttr, ""), r;
    }
  },
  xm = (() => {
    class e extends no {
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
  Hl = ["alt", "control", "meta", "shift"],
  Nm = {
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
  Am = {
    alt: (e) => e.altKey,
    control: (e) => e.ctrlKey,
    meta: (e) => e.metaKey,
    shift: (e) => e.shiftKey,
  },
  Rm = (() => {
    class e extends no {
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
          Hl.forEach((c) => {
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
        let o = Nm[n.key] || n.key,
          i = "";
        return (
          r.indexOf("code.") > -1 && ((o = n.code), (i = "code.")),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === " " ? (o = "space") : o === "." && (o = "dot"),
              Hl.forEach((s) => {
                if (s !== o) {
                  let a = Am[s];
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
function Zl(e, t) {
  return _l(g({ rootComponent: e }, Om(t)));
}
function Om(e) {
  return {
    appProviders: [...jm, ...(e?.providers ?? [])],
    platformProviders: Lm,
  };
}
function Pm() {
  ws.makeCurrent();
}
function Fm() {
  return new Te();
}
function km() {
  return Lc(document), document;
}
var Lm = [
  { provide: Vt, useValue: $l },
  { provide: es, useValue: Pm, multi: !0 },
  { provide: ae, useFactory: km, deps: [] },
];
var jm = [
  { provide: Lr, useValue: "root" },
  { provide: Te, useFactory: Fm, deps: [] },
  { provide: Cs, useClass: xm, multi: !0, deps: [ae, V, Vt] },
  { provide: Cs, useClass: Rm, multi: !0, deps: [ae] },
  Bl,
  Gl,
  zl,
  { provide: Lt, useExisting: Bl },
  { provide: eo, useClass: Im, deps: [] },
  [],
];
var Ql = (() => {
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
  jn = Symbol("RouteTitle"),
  Ts = class {
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
  return new Ts(e);
}
function $m(e, t, n) {
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
function Bm(e, t) {
  if (e.length !== t.length) return !1;
  for (let n = 0; n < e.length; ++n) if (!be(e[n], t[n])) return !1;
  return !0;
}
function be(e, t) {
  let n = e ? xs(e) : void 0,
    r = t ? xs(t) : void 0;
  if (!n || !r || n.length != r.length) return !1;
  let o;
  for (let i = 0; i < n.length; i++)
    if (((o = n[i]), !rd(e[o], t[o]))) return !1;
  return !0;
}
function xs(e) {
  return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)];
}
function rd(e, t) {
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length) return !1;
    let n = [...e].sort(),
      r = [...t].sort();
    return n.every((o, i) => r[i] === o);
  } else return e === t;
}
function od(e) {
  return e.length > 0 ? e[e.length - 1] : null;
}
function qe(e) {
  return Bo(e) ? e : mn(e) ? B(Promise.resolve(e)) : w(e);
}
var Um = { exact: sd, subset: ad },
  id = { exact: Hm, subset: zm, ignored: () => !0 };
function Yl(e, t, n) {
  return (
    Um[n.paths](e.root, t.root, n.matrixParams) &&
    id[n.queryParams](e.queryParams, t.queryParams) &&
    !(n.fragment === "exact" && e.fragment !== t.fragment)
  );
}
function Hm(e, t) {
  return be(e, t);
}
function sd(e, t, n) {
  if (
    !ct(e.segments, t.segments) ||
    !so(e.segments, t.segments, n) ||
    e.numberOfChildren !== t.numberOfChildren
  )
    return !1;
  for (let r in t.children)
    if (!e.children[r] || !sd(e.children[r], t.children[r], n)) return !1;
  return !0;
}
function zm(e, t) {
  return (
    Object.keys(t).length <= Object.keys(e).length &&
    Object.keys(t).every((n) => rd(e[n], t[n]))
  );
}
function ad(e, t, n) {
  return ud(e, t, t.segments, n);
}
function ud(e, t, n, r) {
  if (e.segments.length > n.length) {
    let o = e.segments.slice(0, n.length);
    return !(!ct(o, n) || t.hasChildren() || !so(o, n, r));
  } else if (e.segments.length === n.length) {
    if (!ct(e.segments, n) || !so(e.segments, n, r)) return !1;
    for (let o in t.children)
      if (!e.children[o] || !ad(e.children[o], t.children[o], r)) return !1;
    return !0;
  } else {
    let o = n.slice(0, e.segments.length),
      i = n.slice(e.segments.length);
    return !ct(e.segments, o) || !so(e.segments, o, r) || !e.children[I]
      ? !1
      : ud(e.children[I], t, i, r);
  }
}
function so(e, t, n) {
  return t.every((r, o) => id[n](e[o].parameters, r.parameters));
}
var Fe = class {
    constructor(t = new N([], {}), n = {}, r = null) {
      (this.root = t), (this.queryParams = n), (this.fragment = r);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= qt(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      return Wm.serialize(this);
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
      return ao(this);
    }
  },
  ut = class {
    constructor(t, n) {
      (this.path = t), (this.parameters = n);
    }
    get parameterMap() {
      return (this._parameterMap ??= qt(this.parameters)), this._parameterMap;
    }
    toString() {
      return ld(this);
    }
  };
function Gm(e, t) {
  return ct(e, t) && e.every((n, r) => be(n.parameters, t[r].parameters));
}
function ct(e, t) {
  return e.length !== t.length ? !1 : e.every((n, r) => n.path === t[r].path);
}
function qm(e, t) {
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
var ta = (() => {
    class e {
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = D({
          token: e,
          factory: () => new Tn(),
          providedIn: "root",
        });
      }
    }
    return e;
  })(),
  Tn = class {
    parse(t) {
      let n = new As(t);
      return new Fe(
        n.parseRootSegment(),
        n.parseQueryParams(),
        n.parseFragment(),
      );
    }
    serialize(t) {
      let n = `/${In(t.root, !0)}`,
        r = Ym(t.queryParams),
        o = typeof t.fragment == "string" ? `#${Zm(t.fragment)}` : "";
      return `${n}${r}${o}`;
    }
  },
  Wm = new Tn();
function ao(e) {
  return e.segments.map((t) => ld(t)).join("/");
}
function In(e, t) {
  if (!e.hasChildren()) return ao(e);
  if (t) {
    let n = e.children[I] ? In(e.children[I], !1) : "",
      r = [];
    return (
      Object.entries(e.children).forEach(([o, i]) => {
        o !== I && r.push(`${o}:${In(i, !1)}`);
      }),
      r.length > 0 ? `${n}(${r.join("//")})` : n
    );
  } else {
    let n = qm(e, (r, o) =>
      o === I ? [In(e.children[I], !1)] : [`${o}:${In(r, !1)}`],
    );
    return Object.keys(e.children).length === 1 && e.children[I] != null
      ? `${ao(e)}/${n[0]}`
      : `${ao(e)}/(${n.join("//")})`;
  }
}
function cd(e) {
  return encodeURIComponent(e)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function oo(e) {
  return cd(e).replace(/%3B/gi, ";");
}
function Zm(e) {
  return encodeURI(e);
}
function Ns(e) {
  return cd(e)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function uo(e) {
  return decodeURIComponent(e);
}
function Kl(e) {
  return uo(e.replace(/\+/g, "%20"));
}
function ld(e) {
  return `${Ns(e.path)}${Qm(e.parameters)}`;
}
function Qm(e) {
  return Object.entries(e)
    .map(([t, n]) => `;${Ns(t)}=${Ns(n)}`)
    .join("");
}
function Ym(e) {
  let t = Object.entries(e)
    .map(([n, r]) =>
      Array.isArray(r)
        ? r.map((o) => `${oo(n)}=${oo(o)}`).join("&")
        : `${oo(n)}=${oo(r)}`,
    )
    .filter((n) => n);
  return t.length ? `?${t.join("&")}` : "";
}
var Km = /^[^\/()?;#]+/;
function bs(e) {
  let t = e.match(Km);
  return t ? t[0] : "";
}
var Jm = /^[^\/()?;=#]+/;
function Xm(e) {
  let t = e.match(Jm);
  return t ? t[0] : "";
}
var ev = /^[^=?&#]+/;
function tv(e) {
  let t = e.match(ev);
  return t ? t[0] : "";
}
var nv = /^[^&#]+/;
function rv(e) {
  let t = e.match(nv);
  return t ? t[0] : "";
}
var As = class {
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
    let t = bs(this.remaining);
    if (t === "" && this.peekStartsWith(";")) throw new v(4009, !1);
    return this.capture(t), new ut(uo(t), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let t = {};
    for (; this.consumeOptional(";"); ) this.parseParam(t);
    return t;
  }
  parseParam(t) {
    let n = Xm(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let o = bs(this.remaining);
      o && ((r = o), this.capture(r));
    }
    t[uo(n)] = uo(r);
  }
  parseQueryParam(t) {
    let n = tv(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let s = rv(this.remaining);
      s && ((r = s), this.capture(r));
    }
    let o = Kl(n),
      i = Kl(r);
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
      let r = bs(this.remaining),
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
function dd(e) {
  return e.segments.length > 0 ? new N([], { [I]: e }) : e;
}
function fd(e) {
  let t = {};
  for (let [r, o] of Object.entries(e.children)) {
    let i = fd(o);
    if (r === I && i.segments.length === 0 && i.hasChildren())
      for (let [s, a] of Object.entries(i.children)) t[s] = a;
    else (i.segments.length > 0 || i.hasChildren()) && (t[r] = i);
  }
  let n = new N(e.segments, t);
  return ov(n);
}
function ov(e) {
  if (e.numberOfChildren === 1 && e.children[I]) {
    let t = e.children[I];
    return new N(e.segments.concat(t.segments), t.children);
  }
  return e;
}
function xn(e) {
  return e instanceof Fe;
}
function iv(e, t, n = null, r = null) {
  let o = hd(e);
  return pd(o, t, n, r);
}
function hd(e) {
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
    o = dd(r);
  return t ?? o;
}
function pd(e, t, n, r) {
  let o = e;
  for (; o.parent; ) o = o.parent;
  if (t.length === 0) return Ss(o, o, o, n, r);
  let i = sv(t);
  if (i.toRoot()) return Ss(o, o, new N([], {}), n, r);
  let s = av(i, o, e),
    a = s.processChildren
      ? Sn(s.segmentGroup, s.index, i.commands)
      : md(s.segmentGroup, s.index, i.commands);
  return Ss(o, s.segmentGroup, a, n, r);
}
function co(e) {
  return typeof e == "object" && e != null && !e.outlets && !e.segmentPath;
}
function Nn(e) {
  return typeof e == "object" && e != null && e.outlets;
}
function Ss(e, t, n, r, o) {
  let i = {};
  r &&
    Object.entries(r).forEach(([u, c]) => {
      i[u] = Array.isArray(c) ? c.map((l) => `${l}`) : `${c}`;
    });
  let s;
  e === t ? (s = n) : (s = gd(e, t, n));
  let a = dd(fd(s));
  return new Fe(a, i, o);
}
function gd(e, t, n) {
  let r = {};
  return (
    Object.entries(e.children).forEach(([o, i]) => {
      i === t ? (r[o] = n) : (r[o] = gd(i, t, n));
    }),
    new N(e.segments, r)
  );
}
var lo = class {
  constructor(t, n, r) {
    if (
      ((this.isAbsolute = t),
      (this.numberOfDoubleDots = n),
      (this.commands = r),
      t && r.length > 0 && co(r[0]))
    )
      throw new v(4003, !1);
    let o = r.find(Nn);
    if (o && o !== od(r)) throw new v(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function sv(e) {
  if (typeof e[0] == "string" && e.length === 1 && e[0] === "/")
    return new lo(!0, 0, e);
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
  return new lo(n, t, r);
}
var Ht = class {
  constructor(t, n, r) {
    (this.segmentGroup = t), (this.processChildren = n), (this.index = r);
  }
};
function av(e, t, n) {
  if (e.isAbsolute) return new Ht(t, !0, 0);
  if (!n) return new Ht(t, !1, NaN);
  if (n.parent === null) return new Ht(n, !0, 0);
  let r = co(e.commands[0]) ? 0 : 1,
    o = n.segments.length - 1 + r;
  return uv(n, o, e.numberOfDoubleDots);
}
function uv(e, t, n) {
  let r = e,
    o = t,
    i = n;
  for (; i > o; ) {
    if (((i -= o), (r = r.parent), !r)) throw new v(4005, !1);
    o = r.segments.length;
  }
  return new Ht(r, !1, o - i);
}
function cv(e) {
  return Nn(e[0]) ? e[0].outlets : { [I]: e };
}
function md(e, t, n) {
  if (((e ??= new N([], {})), e.segments.length === 0 && e.hasChildren()))
    return Sn(e, t, n);
  let r = lv(e, t, n),
    o = n.slice(r.commandIndex);
  if (r.match && r.pathIndex < e.segments.length) {
    let i = new N(e.segments.slice(0, r.pathIndex), {});
    return (
      (i.children[I] = new N(e.segments.slice(r.pathIndex), e.children)),
      Sn(i, 0, o)
    );
  } else
    return r.match && o.length === 0
      ? new N(e.segments, {})
      : r.match && !e.hasChildren()
        ? Rs(e, t, n)
        : r.match
          ? Sn(e, 0, o)
          : Rs(e, t, n);
}
function Sn(e, t, n) {
  if (n.length === 0) return new N(e.segments, {});
  {
    let r = cv(n),
      o = {};
    if (
      Object.keys(r).some((i) => i !== I) &&
      e.children[I] &&
      e.numberOfChildren === 1 &&
      e.children[I].segments.length === 0
    ) {
      let i = Sn(e.children[I], t, n);
      return new N(e.segments, i.children);
    }
    return (
      Object.entries(r).forEach(([i, s]) => {
        typeof s == "string" && (s = [s]),
          s !== null && (o[i] = md(e.children[i], t, s));
      }),
      Object.entries(e.children).forEach(([i, s]) => {
        r[i] === void 0 && (o[i] = s);
      }),
      new N(e.segments, o)
    );
  }
}
function lv(e, t, n) {
  let r = 0,
    o = t,
    i = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; o < e.segments.length; ) {
    if (r >= n.length) return i;
    let s = e.segments[o],
      a = n[r];
    if (Nn(a)) break;
    let u = `${a}`,
      c = r < n.length - 1 ? n[r + 1] : null;
    if (o > 0 && u === void 0) break;
    if (u && c && typeof c == "object" && c.outlets === void 0) {
      if (!Xl(u, c, s)) return i;
      r += 2;
    } else {
      if (!Xl(u, {}, s)) return i;
      r++;
    }
    o++;
  }
  return { match: !0, pathIndex: o, commandIndex: r };
}
function Rs(e, t, n) {
  let r = e.segments.slice(0, t),
    o = 0;
  for (; o < n.length; ) {
    let i = n[o];
    if (Nn(i)) {
      let u = dv(i.outlets);
      return new N(r, u);
    }
    if (o === 0 && co(n[0])) {
      let u = e.segments[t];
      r.push(new ut(u.path, Jl(n[0]))), o++;
      continue;
    }
    let s = Nn(i) ? i.outlets[I] : `${i}`,
      a = o < n.length - 1 ? n[o + 1] : null;
    s && a && co(a)
      ? (r.push(new ut(s, Jl(a))), (o += 2))
      : (r.push(new ut(s, {})), o++);
  }
  return new N(r, {});
}
function dv(e) {
  let t = {};
  return (
    Object.entries(e).forEach(([n, r]) => {
      typeof r == "string" && (r = [r]),
        r !== null && (t[n] = Rs(new N([], {}), 0, r));
    }),
    t
  );
}
function Jl(e) {
  let t = {};
  return Object.entries(e).forEach(([n, r]) => (t[n] = `${r}`)), t;
}
function Xl(e, t, n) {
  return e == n.path && be(t, n.parameters);
}
var Mn = "imperative",
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
  An = class extends ue {
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
  lt = class extends ue {
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
  Os = (function (e) {
    return (
      (e[(e.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
      (e[(e.IgnoredByUrlHandlingStrategy = 1)] =
        "IgnoredByUrlHandlingStrategy"),
      e
    );
  })(Os || {}),
  Pe = class extends ue {
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
  dt = class extends ue {
    constructor(t, n, r, o) {
      super(t, n),
        (this.reason = r),
        (this.code = o),
        (this.type = q.NavigationSkipped);
    }
  },
  Rn = class extends ue {
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
  fo = class extends ue {
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
  Ps = class extends ue {
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
  Fs = class extends ue {
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
  ks = class extends ue {
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
  Ls = class extends ue {
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
  js = class {
    constructor(t) {
      (this.route = t), (this.type = q.RouteConfigLoadStart);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  Vs = class {
    constructor(t) {
      (this.route = t), (this.type = q.RouteConfigLoadEnd);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  $s = class {
    constructor(t) {
      (this.snapshot = t), (this.type = q.ChildActivationStart);
    }
    toString() {
      return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  },
  Bs = class {
    constructor(t) {
      (this.snapshot = t), (this.type = q.ChildActivationEnd);
    }
    toString() {
      return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  },
  Us = class {
    constructor(t) {
      (this.snapshot = t), (this.type = q.ActivationStart);
    }
    toString() {
      return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  },
  Hs = class {
    constructor(t) {
      (this.snapshot = t), (this.type = q.ActivationEnd);
    }
    toString() {
      return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  };
var On = class {},
  Wt = class {
    constructor(t, n) {
      (this.url = t), (this.navigationBehaviorOptions = n);
    }
  };
function fv(e, t) {
  return (
    e.providers &&
      !e._injector &&
      (e._injector = ds(e.providers, t, `Route: ${e.path}`)),
    e._injector ?? t
  );
}
function me(e) {
  return e.outlet || I;
}
function hv(e, t) {
  let n = e.filter((r) => me(r) === t);
  return n.push(...e.filter((r) => me(r) !== t)), n;
}
function Vn(e) {
  if (!e) return null;
  if (e.routeConfig?._injector) return e.routeConfig._injector;
  for (let t = e.parent; t; t = t.parent) {
    let n = t.routeConfig;
    if (n?._loadedInjector) return n._loadedInjector;
    if (n?._injector) return n._injector;
  }
  return null;
}
var zs = class {
    get injector() {
      return Vn(this.route?.snapshot) ?? this.rootInjector;
    }
    set injector(t) {}
    constructor(t) {
      (this.rootInjector = t),
        (this.outlet = null),
        (this.route = null),
        (this.children = new Do(this.rootInjector)),
        (this.attachRef = null);
    }
  },
  Do = (() => {
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
          r || ((r = new zs(this.rootInjector)), this.contexts.set(n, r)), r
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
  ho = class {
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
      let n = Gs(t, this._root);
      return n ? n.children.map((r) => r.value) : [];
    }
    firstChild(t) {
      let n = Gs(t, this._root);
      return n && n.children.length > 0 ? n.children[0].value : null;
    }
    siblings(t) {
      let n = qs(t, this._root);
      return n.length < 2
        ? []
        : n[n.length - 2].children.map((o) => o.value).filter((o) => o !== t);
    }
    pathFromRoot(t) {
      return qs(t, this._root).map((n) => n.value);
    }
  };
function Gs(e, t) {
  if (e === t.value) return t;
  for (let n of t.children) {
    let r = Gs(e, n);
    if (r) return r;
  }
  return null;
}
function qs(e, t) {
  if (e === t.value) return [t];
  for (let n of t.children) {
    let r = qs(e, n);
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
var po = class extends ho {
  constructor(t, n) {
    super(t), (this.snapshot = n), na(this, t);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function vd(e) {
  let t = pv(e),
    n = new z([new ut("", {})]),
    r = new z({}),
    o = new z({}),
    i = new z({}),
    s = new z(""),
    a = new Zt(n, r, i, s, o, I, e, t.root);
  return (a.snapshot = t.root), new po(new ee(a, []), t);
}
function pv(e) {
  let t = {},
    n = {},
    r = {},
    o = "",
    i = new zt([], t, r, o, n, I, e, null, {});
  return new mo("", new ee(i, []));
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
      (this.title = this.dataSubject?.pipe(S((c) => c[jn])) ?? w(void 0)),
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
function go(e, t, n = "emptyOnly") {
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
    o && Dd(o) && (r.resolve[jn] = o.title),
    r
  );
}
var zt = class {
    get title() {
      return this.data?.[jn];
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
  mo = class extends ho {
    constructor(t, n) {
      super(n), (this.url = t), na(this, n);
    }
    toString() {
      return yd(this._root);
    }
  };
function na(e, t) {
  (t.value._routerState = e), t.children.forEach((n) => na(e, n));
}
function yd(e) {
  let t = e.children.length > 0 ? ` { ${e.children.map(yd).join(", ")} } ` : "";
  return `${e.value}${t}`;
}
function Ms(e) {
  if (e.snapshot) {
    let t = e.snapshot,
      n = e._futureSnapshot;
    (e.snapshot = n),
      be(t.queryParams, n.queryParams) ||
        e.queryParamsSubject.next(n.queryParams),
      t.fragment !== n.fragment && e.fragmentSubject.next(n.fragment),
      be(t.params, n.params) || e.paramsSubject.next(n.params),
      Bm(t.url, n.url) || e.urlSubject.next(n.url),
      be(t.data, n.data) || e.dataSubject.next(n.data);
  } else
    (e.snapshot = e._futureSnapshot),
      e.dataSubject.next(e._futureSnapshot.data);
}
function Ws(e, t) {
  let n = be(e.params, t.params) && Gm(e.url, t.url),
    r = !e.parent != !t.parent;
  return n && !r && (!e.parent || Ws(e.parent, t.parent));
}
function Dd(e) {
  return typeof e.title == "string" || e.title === null;
}
var gv = (() => {
    class e {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = I),
          (this.activateEvents = new Z()),
          (this.deactivateEvents = new Z()),
          (this.attachEvents = new Z()),
          (this.detachEvents = new Z()),
          (this.parentContexts = h(Do)),
          (this.location = h(Wr)),
          (this.changeDetector = h(vn)),
          (this.inputBinder = h(ra, { optional: !0 })),
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
          u = new Zs(n, a, o.injector);
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
        this.ɵdir = $i({
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
          features: [$r],
        });
      }
    }
    return e;
  })(),
  Zs = class e {
    __ngOutletInjector(t) {
      return new e(this.route, this.childContexts, t);
    }
    constructor(t, n, r) {
      (this.route = t), (this.childContexts = n), (this.parent = r);
    }
    get(t, n) {
      return t === Zt
        ? this.route
        : t === Do
          ? this.childContexts
          : this.parent.get(t, n);
    }
  },
  ra = new E("");
function mv(e, t, n) {
  let r = Pn(e, t._root, n ? n._root : void 0);
  return new po(r, t);
}
function Pn(e, t, n) {
  if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
    let r = n.value;
    r._futureSnapshot = t.value;
    let o = vv(e, t, n);
    return new ee(r, o);
  } else {
    if (e.shouldAttach(t.value)) {
      let i = e.retrieve(t.value);
      if (i !== null) {
        let s = i.route;
        return (
          (s.value._futureSnapshot = t.value),
          (s.children = t.children.map((a) => Pn(e, a))),
          s
        );
      }
    }
    let r = yv(t.value),
      o = t.children.map((i) => Pn(e, i));
    return new ee(r, o);
  }
}
function vv(e, t, n) {
  return t.children.map((r) => {
    for (let o of n.children)
      if (e.shouldReuseRoute(r.value, o.value.snapshot)) return Pn(e, r, o);
    return Pn(e, r);
  });
}
function yv(e) {
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
var Fn = class {
    constructor(t, n) {
      (this.redirectTo = t), (this.navigationBehaviorOptions = n);
    }
  },
  wd = "ngNavigationCancelingError";
function vo(e, t) {
  let { redirectTo: n, navigationBehaviorOptions: r } = xn(t)
      ? { redirectTo: t, navigationBehaviorOptions: void 0 }
      : t,
    o = Cd(!1, te.Redirect);
  return (o.url = n), (o.navigationBehaviorOptions = r), o;
}
function Cd(e, t) {
  let n = new Error(`NavigationCancelingError: ${e || ""}`);
  return (n[wd] = !0), (n.cancellationCode = t), n;
}
function Dv(e) {
  return Id(e) && xn(e.url);
}
function Id(e) {
  return !!e && e[wd];
}
var wv = (e, t, n, r) =>
    S(
      (o) => (
        new Qs(t, o.targetRouterState, o.currentRouterState, n, r).activate(e),
        o
      ),
    ),
  Qs = class {
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
        Ms(this.futureState.root),
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
          this.forwardEvent(new Hs(i.value.snapshot));
      }),
        t.children.length && this.forwardEvent(new Bs(t.value.snapshot));
    }
    activateRoutes(t, n, r) {
      let o = t.value,
        i = n ? n.value : null;
      if ((Ms(o), o === i))
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
            Ms(a.route.value),
            this.activateChildRoutes(t, null, s.children);
        } else
          (s.attachRef = null),
            (s.route = o),
            s.outlet && s.outlet.activateWith(o, s.injector),
            this.activateChildRoutes(t, null, s.children);
      } else this.activateChildRoutes(t, null, r);
    }
  },
  yo = class {
    constructor(t) {
      (this.path = t), (this.route = this.path[this.path.length - 1]);
    }
  },
  Gt = class {
    constructor(t, n) {
      (this.component = t), (this.route = n);
    }
  };
function Cv(e, t, n) {
  let r = e._root,
    o = t ? t._root : null;
  return En(r, o, n, [r.value]);
}
function Iv(e) {
  let t = e.routeConfig ? e.routeConfig.canActivateChild : null;
  return !t || t.length === 0 ? null : { node: e, guards: t };
}
function Yt(e, t) {
  let n = Symbol(),
    r = t.get(e, n);
  return r === n ? (typeof e == "function" && !Su(e) ? e : t.get(e)) : r;
}
function En(
  e,
  t,
  n,
  r,
  o = { canDeactivateChecks: [], canActivateChecks: [] },
) {
  let i = Ut(t);
  return (
    e.children.forEach((s) => {
      Ev(s, i[s.value.outlet], n, r.concat([s.value]), o),
        delete i[s.value.outlet];
    }),
    Object.entries(i).forEach(([s, a]) => _n(a, n.getContext(s), o)),
    o
  );
}
function Ev(
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
    let u = bv(s, i, i.routeConfig.runGuardsAndResolvers);
    u
      ? o.canActivateChecks.push(new yo(r))
      : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
      i.component ? En(e, t, a ? a.children : null, r, o) : En(e, t, n, r, o),
      u &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        o.canDeactivateChecks.push(new Gt(a.outlet.component, s));
  } else
    s && _n(t, a, o),
      o.canActivateChecks.push(new yo(r)),
      i.component
        ? En(e, null, a ? a.children : null, r, o)
        : En(e, null, n, r, o);
  return o;
}
function bv(e, t, n) {
  if (typeof n == "function") return n(e, t);
  switch (n) {
    case "pathParamsChange":
      return !ct(e.url, t.url);
    case "pathParamsOrQueryParamsChange":
      return !ct(e.url, t.url) || !be(e.queryParams, t.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !Ws(e, t) || !be(e.queryParams, t.queryParams);
    case "paramsChange":
    default:
      return !Ws(e, t);
  }
}
function _n(e, t, n) {
  let r = Ut(e),
    o = e.value;
  Object.entries(r).forEach(([i, s]) => {
    o.component
      ? t
        ? _n(s, t.children.getContext(i), n)
        : _n(s, null, n)
      : _n(s, t, n);
  }),
    o.component
      ? t && t.outlet && t.outlet.isActivated
        ? n.canDeactivateChecks.push(new Gt(t.outlet.component, o))
        : n.canDeactivateChecks.push(new Gt(null, o))
      : n.canDeactivateChecks.push(new Gt(null, o));
}
function $n(e) {
  return typeof e == "function";
}
function Sv(e) {
  return typeof e == "boolean";
}
function Mv(e) {
  return e && $n(e.canLoad);
}
function _v(e) {
  return e && $n(e.canActivate);
}
function Tv(e) {
  return e && $n(e.canActivateChild);
}
function xv(e) {
  return e && $n(e.canDeactivate);
}
function Nv(e) {
  return e && $n(e.canMatch);
}
function Ed(e) {
  return e instanceof Se || e?.name === "EmptyError";
}
var io = Symbol("INITIAL_VALUE");
function Qt() {
  return de((e) =>
    sr(e.map((t) => t.pipe(Me(1), qo(io)))).pipe(
      S((t) => {
        for (let n of t)
          if (n !== !0) {
            if (n === io) return io;
            if (n === !1 || Av(n)) return n;
          }
        return !0;
      }),
      le((t) => t !== io),
      Me(1),
    ),
  );
}
function Av(e) {
  return xn(e) || e instanceof Fn;
}
function Rv(e, t) {
  return U((n) => {
    let {
      targetSnapshot: r,
      currentSnapshot: o,
      guards: { canActivateChecks: i, canDeactivateChecks: s },
    } = n;
    return s.length === 0 && i.length === 0
      ? w(k(g({}, n), { guardsResult: !0 }))
      : Ov(s, r, o, e).pipe(
          U((a) => (a && Sv(a) ? Pv(r, i, e, t) : w(a))),
          S((a) => k(g({}, n), { guardsResult: a })),
        );
  });
}
function Ov(e, t, n, r) {
  return B(e).pipe(
    U((o) => Vv(o.component, o.route, n, t, r)),
    De((o) => o !== !0, !0),
  );
}
function Pv(e, t, n, r) {
  return B(t).pipe(
    It((o) =>
      Ct(
        kv(o.route.parent, r),
        Fv(o.route, r),
        jv(e, o.path, n),
        Lv(e, o.route, n),
      ),
    ),
    De((o) => o !== !0, !0),
  );
}
function Fv(e, t) {
  return e !== null && t && t(new Us(e)), w(!0);
}
function kv(e, t) {
  return e !== null && t && t(new $s(e)), w(!0);
}
function Lv(e, t, n) {
  let r = t.routeConfig ? t.routeConfig.canActivate : null;
  if (!r || r.length === 0) return w(!0);
  let o = r.map((i) =>
    ar(() => {
      let s = Vn(t) ?? n,
        a = Yt(i, s),
        u = _v(a) ? a.canActivate(t, e) : xe(s, () => a(t, e));
      return qe(u).pipe(De());
    }),
  );
  return w(o).pipe(Qt());
}
function jv(e, t, n) {
  let r = t[t.length - 1],
    i = t
      .slice(0, t.length - 1)
      .reverse()
      .map((s) => Iv(s))
      .filter((s) => s !== null)
      .map((s) =>
        ar(() => {
          let a = s.guards.map((u) => {
            let c = Vn(s.node) ?? n,
              l = Yt(u, c),
              d = Tv(l) ? l.canActivateChild(r, e) : xe(c, () => l(r, e));
            return qe(d).pipe(De());
          });
          return w(a).pipe(Qt());
        }),
      );
  return w(i).pipe(Qt());
}
function Vv(e, t, n, r, o) {
  let i = t && t.routeConfig ? t.routeConfig.canDeactivate : null;
  if (!i || i.length === 0) return w(!0);
  let s = i.map((a) => {
    let u = Vn(t) ?? o,
      c = Yt(a, u),
      l = xv(c) ? c.canDeactivate(e, t, n, r) : xe(u, () => c(e, t, n, r));
    return qe(l).pipe(De());
  });
  return w(s).pipe(Qt());
}
function $v(e, t, n, r) {
  let o = t.canLoad;
  if (o === void 0 || o.length === 0) return w(!0);
  let i = o.map((s) => {
    let a = Yt(s, e),
      u = Mv(a) ? a.canLoad(t, n) : xe(e, () => a(t, n));
    return qe(u);
  });
  return w(i).pipe(Qt(), bd(r));
}
function bd(e) {
  return Lo(
    G((t) => {
      if (typeof t != "boolean") throw vo(e, t);
    }),
    S((t) => t === !0),
  );
}
function Bv(e, t, n, r) {
  let o = t.canMatch;
  if (!o || o.length === 0) return w(!0);
  let i = o.map((s) => {
    let a = Yt(s, e),
      u = Nv(a) ? a.canMatch(t, n) : xe(e, () => a(t, n));
    return qe(u);
  });
  return w(i).pipe(Qt(), bd(r));
}
var kn = class {
    constructor(t) {
      this.segmentGroup = t || null;
    }
  },
  Ln = class extends Error {
    constructor(t) {
      super(), (this.urlTree = t);
    }
  };
function Bt(e) {
  return wt(new kn(e));
}
function Uv(e) {
  return wt(new v(4e3, !1));
}
function Hv(e) {
  return wt(Cd(!1, te.GuardRejected));
}
var Ys = class {
    constructor(t, n) {
      (this.urlSerializer = t), (this.urlTree = n);
    }
    lineralizeSegments(t, n) {
      let r = [],
        o = n.root;
      for (;;) {
        if (((r = r.concat(o.segments)), o.numberOfChildren === 0)) return w(r);
        if (o.numberOfChildren > 1 || !o.children[I])
          return Uv(`${t.redirectTo}`);
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
          $ = xe(i, () =>
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
        if ($ instanceof Fe) throw new Ln($);
        n = $;
      }
      let s = this.applyRedirectCreateUrlTree(
        n,
        this.urlSerializer.parse(n),
        t,
        r,
      );
      if (n[0] === "/") throw new Ln(s);
      return s;
    }
    applyRedirectCreateUrlTree(t, n, r, o) {
      let i = this.createSegmentGroup(t, n.root, r, o);
      return new Fe(
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
  Ks = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function zv(e, t, n, r, o) {
  let i = Sd(e, t, n);
  return i.matched
    ? ((r = fv(t, r)),
      Bv(r, t, n, o).pipe(S((s) => (s === !0 ? i : g({}, Ks)))))
    : w(i);
}
function Sd(e, t, n) {
  if (t.path === "**") return Gv(n);
  if (t.path === "")
    return t.pathMatch === "full" && (e.hasChildren() || n.length > 0)
      ? g({}, Ks)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: n,
          parameters: {},
          positionalParamSegments: {},
        };
  let o = (t.matcher || $m)(n, e, t);
  if (!o) return g({}, Ks);
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
function Gv(e) {
  return {
    matched: !0,
    parameters: e.length > 0 ? od(e).parameters : {},
    consumedSegments: e,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function ed(e, t, n, r) {
  return n.length > 0 && Zv(e, n, r)
    ? {
        segmentGroup: new N(t, Wv(r, new N(n, e.children))),
        slicedSegments: [],
      }
    : n.length === 0 && Qv(e, n, r)
      ? {
          segmentGroup: new N(e.segments, qv(e, n, r, e.children)),
          slicedSegments: n,
        }
      : { segmentGroup: new N(e.segments, e.children), slicedSegments: n };
}
function qv(e, t, n, r) {
  let o = {};
  for (let i of n)
    if (wo(e, t, i) && !r[me(i)]) {
      let s = new N([], {});
      o[me(i)] = s;
    }
  return g(g({}, r), o);
}
function Wv(e, t) {
  let n = {};
  n[I] = t;
  for (let r of e)
    if (r.path === "" && me(r) !== I) {
      let o = new N([], {});
      n[me(r)] = o;
    }
  return n;
}
function Zv(e, t, n) {
  return n.some((r) => wo(e, t, r) && me(r) !== I);
}
function Qv(e, t, n) {
  return n.some((r) => wo(e, t, r));
}
function wo(e, t, n) {
  return (e.hasChildren() || t.length > 0) && n.pathMatch === "full"
    ? !1
    : n.path === "";
}
function Yv(e, t, n) {
  return t.length === 0 && !e.children[n];
}
var Js = class {};
function Kv(e, t, n, r, o, i, s = "emptyOnly") {
  return new Xs(e, t, n, r, o, s, i).recognize();
}
var Jv = 31,
  Xs = class {
    constructor(t, n, r, o, i, s, a) {
      (this.injector = t),
        (this.configLoader = n),
        (this.rootComponentType = r),
        (this.config = o),
        (this.urlTree = i),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new Ys(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(t) {
      return new v(4002, `'${t.segmentGroup}'`);
    }
    recognize() {
      let t = ed(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(t).pipe(
        S(({ children: n, rootSnapshot: r }) => {
          let o = new ee(r, n),
            i = new mo("", o),
            s = iv(r, [], this.urlTree.queryParams, this.urlTree.fragment);
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
        Le((r) => {
          if (r instanceof Ln)
            return (this.urlTree = r.urlTree), this.match(r.urlTree.root);
          throw r instanceof kn ? this.noMatchError(r) : r;
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
        It((s) => {
          let a = r.children[s],
            u = hv(n, s);
          return this.processSegmentGroup(t, u, a, s, o);
        }),
        Go((s, a) => (s.push(...a), s)),
        je(null),
        zo(),
        U((s) => {
          if (s === null) return Bt(r);
          let a = Md(s);
          return Xv(a), w(a);
        }),
      );
    }
    processSegment(t, n, r, o, i, s, a) {
      return B(n).pipe(
        It((u) =>
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
            Le((c) => {
              if (c instanceof kn) return w(null);
              throw c;
            }),
          ),
        ),
        De((u) => !!u),
        Le((u) => {
          if (Ed(u)) return Yv(r, o, i) ? w(new Js()) : Bt(r);
          throw u;
        }),
      );
    }
    processSegmentAgainstRoute(t, n, r, o, i, s, a, u) {
      return me(r) !== s && (s === I || !wo(o, i, r))
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
      } = Sd(n, o, i);
      if (!u) return Bt(n);
      typeof o.redirectTo == "string" &&
        o.redirectTo[0] === "/" &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > Jv && (this.allowRedirects = !1));
      let f = new zt(
          i,
          c,
          Object.freeze(g({}, this.urlTree.queryParams)),
          this.urlTree.fragment,
          td(o),
          me(o),
          o.component ?? o._loadedComponent ?? null,
          o,
          nd(o),
        ),
        m = go(f, a, this.paramsInheritanceStrategy);
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
      let a = zv(n, r, o, t, this.urlSerializer);
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
                        td(r),
                        me(r),
                        r.component ?? r._loadedComponent ?? null,
                        r,
                        nd(r),
                      ),
                      A = go(m, s, this.paramsInheritanceStrategy);
                    (m.params = Object.freeze(A.params)),
                      (m.data = Object.freeze(A.data));
                    let { segmentGroup: $, slicedSegments: L } = ed(n, p, f, c);
                    if (L.length === 0 && $.hasChildren())
                      return this.processChildren(l, c, $, m).pipe(
                        S((We) => new ee(m, We)),
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
                    ).pipe(S((We) => new ee(m, We instanceof ee ? [We] : [])));
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
            : $v(t, n, r, this.urlSerializer).pipe(
                U((o) =>
                  o
                    ? this.configLoader.loadChildren(t, n).pipe(
                        G((i) => {
                          (n._loadedRoutes = i.routes),
                            (n._loadedInjector = i.injector);
                        }),
                      )
                    : Hv(n),
                ),
              )
          : w({ routes: [], injector: t });
    }
  };
function Xv(e) {
  e.sort((t, n) =>
    t.value.outlet === I
      ? -1
      : n.value.outlet === I
        ? 1
        : t.value.outlet.localeCompare(n.value.outlet),
  );
}
function ey(e) {
  let t = e.value.routeConfig;
  return t && t.path === "";
}
function Md(e) {
  let t = [],
    n = new Set();
  for (let r of e) {
    if (!ey(r)) {
      t.push(r);
      continue;
    }
    let o = t.find((i) => r.value.routeConfig === i.value.routeConfig);
    o !== void 0 ? (o.children.push(...r.children), n.add(o)) : t.push(r);
  }
  for (let r of n) {
    let o = Md(r.children);
    t.push(new ee(r.value, o));
  }
  return t.filter((r) => !n.has(r));
}
function td(e) {
  return e.data || {};
}
function nd(e) {
  return e.resolve || {};
}
function ty(e, t, n, r, o, i) {
  return U((s) =>
    Kv(e, t, n, r, s.extractedUrl, o, i).pipe(
      S(({ state: a, tree: u }) =>
        k(g({}, s), { targetSnapshot: a, urlAfterRedirects: u }),
      ),
    ),
  );
}
function ny(e, t) {
  return U((n) => {
    let {
      targetSnapshot: r,
      guards: { canActivateChecks: o },
    } = n;
    if (!o.length) return w(n);
    let i = new Set(o.map((u) => u.route)),
      s = new Set();
    for (let u of i) if (!s.has(u)) for (let c of _d(u)) s.add(c);
    let a = 0;
    return B(s).pipe(
      It((u) =>
        i.has(u)
          ? ry(u, r, e, t)
          : ((u.data = go(u, u.parent, e).resolve), w(void 0)),
      ),
      G(() => a++),
      Et(1),
      U((u) => (a === s.size ? w(n) : J)),
    );
  });
}
function _d(e) {
  let t = e.children.map((n) => _d(n)).flat();
  return [e, ...t];
}
function ry(e, t, n, r) {
  let o = e.routeConfig,
    i = e._resolve;
  return (
    o?.title !== void 0 && !Dd(o) && (i[jn] = o.title),
    oy(i, e, t, r).pipe(
      S(
        (s) => (
          (e._resolvedData = s), (e.data = go(e, e.parent, n).resolve), null
        ),
      ),
    )
  );
}
function oy(e, t, n, r) {
  let o = xs(e);
  if (o.length === 0) return w({});
  let i = {};
  return B(o).pipe(
    U((s) =>
      iy(e[s], t, n, r).pipe(
        De(),
        G((a) => {
          if (a instanceof Fn) throw vo(new Tn(), a);
          i[s] = a;
        }),
      ),
    ),
    Et(1),
    Ho(i),
    Le((s) => (Ed(s) ? J : wt(s))),
  );
}
function iy(e, t, n, r) {
  let o = Vn(t) ?? r,
    i = Yt(e, o),
    s = i.resolve ? i.resolve(t, n) : xe(o, () => i(t, n));
  return qe(s);
}
function _s(e) {
  return de((t) => {
    let n = e(t);
    return n ? B(n).pipe(S(() => t)) : w(t);
  });
}
var Td = (() => {
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
        return n.data[jn];
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: () => h(sy), providedIn: "root" });
      }
    }
    return e;
  })(),
  sy = (() => {
    class e extends Td {
      constructor(n) {
        super(), (this.title = n);
      }
      updateTitle(n) {
        let r = this.buildTitle(n);
        r !== void 0 && this.title.setTitle(r);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(_(Ql));
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  oa = new E("", { providedIn: "root", factory: () => ({}) }),
  ay = (() => {
    class e {
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵcmp = Fr({
          type: e,
          selectors: [["ng-component"]],
          standalone: !0,
          features: [Yr],
          decls: 1,
          vars: 0,
          template: function (r, o) {
            r & 1 && fs(0, "router-outlet");
          },
          dependencies: [gv],
          encapsulation: 2,
        });
      }
    }
    return e;
  })();
function ia(e) {
  let t = e.children && e.children.map(ia),
    n = t ? k(g({}, e), { children: t }) : g({}, e);
  return (
    !n.component &&
      !n.loadComponent &&
      (t || n.loadChildren) &&
      n.outlet &&
      n.outlet !== I &&
      (n.component = ay),
    n
  );
}
var sa = new E(""),
  uy = (() => {
    class e {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = h(ps));
      }
      loadComponent(n) {
        if (this.componentLoaders.get(n)) return this.componentLoaders.get(n);
        if (n._loadedComponent) return w(n._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(n);
        let r = qe(n.loadComponent()).pipe(
            S(xd),
            G((i) => {
              this.onLoadEndListener && this.onLoadEndListener(n),
                (n._loadedComponent = i);
            }),
            Xt(() => {
              this.componentLoaders.delete(n);
            }),
          ),
          o = new Dt(r, () => new W()).pipe(yt());
        return this.componentLoaders.set(n, o), o;
      }
      loadChildren(n, r) {
        if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
        if (r._loadedRoutes)
          return w({ routes: r._loadedRoutes, injector: r._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(r);
        let i = cy(r, this.compiler, n, this.onLoadEndListener).pipe(
            Xt(() => {
              this.childrenLoaders.delete(r);
            }),
          ),
          s = new Dt(i, () => new W()).pipe(yt());
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
function cy(e, t, n, r) {
  return qe(e.loadChildren()).pipe(
    S(xd),
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
            (s = i.get(sa, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(ia), injector: i }
      );
    }),
  );
}
function ly(e) {
  return e && typeof e == "object" && "default" in e;
}
function xd(e) {
  return ly(e) ? e.default : e;
}
var aa = (() => {
    class e {
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: () => h(dy), providedIn: "root" });
      }
    }
    return e;
  })(),
  dy = (() => {
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
  fy = new E("");
var hy = new E(""),
  py = (() => {
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
          (this.configLoader = h(uy)),
          (this.environmentInjector = h(se)),
          (this.urlSerializer = h(ta)),
          (this.rootContexts = h(Do)),
          (this.location = h(yn)),
          (this.inputBindingEnabled = h(ra, { optional: !0 }) !== null),
          (this.titleStrategy = h(Td)),
          (this.options = h(oa, { optional: !0 }) || {}),
          (this.paramsInheritanceStrategy =
            this.options.paramsInheritanceStrategy || "emptyOnly"),
          (this.urlHandlingStrategy = h(aa)),
          (this.createViewTransition = h(fy, { optional: !0 })),
          (this.navigationErrorHandler = h(hy, { optional: !0 })),
          (this.navigationId = 0),
          (this.afterPreactivation = () => w(void 0)),
          (this.rootComponentType = null);
        let n = (o) => this.events.next(new js(o)),
          r = (o) => this.events.next(new Vs(o));
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
            source: Mn,
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
                        new dt(
                          u.id,
                          this.urlSerializer.serialize(u.rawUrl),
                          d,
                          Os.IgnoredSameUrlNavigation,
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
                            new An(
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
                      ty(
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
                        let p = new fo(
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
                      $ = new An(d, this.urlSerializer.serialize(p), f, m);
                    this.events.next($);
                    let L = vd(this.rootComponentType).snapshot;
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
                        new dt(
                          u.id,
                          this.urlSerializer.serialize(u.extractedUrl),
                          d,
                          Os.IgnoredByUrlHandlingStrategy,
                        ),
                      ),
                      u.resolve(!1),
                      J
                    );
                  }
                }),
                G((u) => {
                  let c = new Ps(
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
                        guards: Cv(
                          u.targetSnapshot,
                          u.currentSnapshot,
                          this.rootContexts,
                        ),
                      })),
                    i
                  ),
                ),
                Rv(this.environmentInjector, (u) => this.events.next(u)),
                G((u) => {
                  if (
                    ((i.guardsResult = u.guardsResult),
                    u.guardsResult && typeof u.guardsResult != "boolean")
                  )
                    throw vo(this.urlSerializer, u.guardsResult);
                  let c = new Fs(
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
                _s((u) => {
                  if (u.guards.canActivateChecks.length)
                    return w(u).pipe(
                      G((c) => {
                        let l = new ks(
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
                          ny(
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
                        let l = new Ls(
                          c.id,
                          this.urlSerializer.serialize(c.extractedUrl),
                          this.urlSerializer.serialize(c.urlAfterRedirects),
                          c.targetSnapshot,
                        );
                        this.events.next(l);
                      }),
                    );
                }),
                _s((u) => {
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
                  return sr(c(u.targetSnapshot.root)).pipe(je(null), Me(1));
                }),
                _s(() => this.afterPreactivation()),
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
                  let c = mv(
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
                  this.events.next(new On());
                }),
                wv(
                  this.rootContexts,
                  n.routeReuseStrategy,
                  (u) => this.events.next(u),
                  this.inputBindingEnabled,
                ),
                Me(1),
                G({
                  next: (u) => {
                    (s = !0),
                      (this.lastSuccessfulNavigation = this.currentNavigation),
                      this.events.next(
                        new lt(
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
                Wo(
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
                Le((u) => {
                  if (((a = !0), Id(u)))
                    this.events.next(
                      new Pe(
                        i.id,
                        this.urlSerializer.serialize(i.extractedUrl),
                        u.message,
                        u.cancellationCode,
                      ),
                    ),
                      Dv(u)
                        ? this.events.next(
                            new Wt(u.url, u.navigationBehaviorOptions),
                          )
                        : i.resolve(!1);
                  else {
                    let c = new Rn(
                      i.id,
                      this.urlSerializer.serialize(i.extractedUrl),
                      u,
                      i.targetSnapshot ?? void 0,
                    );
                    try {
                      let l = xe(this.environmentInjector, () =>
                        this.navigationErrorHandler?.(c),
                      );
                      if (l instanceof Fn) {
                        let { message: d, cancellationCode: p } = vo(
                          this.urlSerializer,
                          l,
                        );
                        this.events.next(
                          new Pe(
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
        let i = new Pe(
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
function gy(e) {
  return e !== Mn;
}
var my = (() => {
    class e {
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = D({ token: e, factory: () => h(vy), providedIn: "root" });
      }
    }
    return e;
  })(),
  ea = class {
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
  vy = (() => {
    class e extends ea {
      static {
        this.ɵfac = (() => {
          let n;
          return function (o) {
            return (n || (n = Qi(e)))(o || e);
          };
        })();
      }
      static {
        this.ɵprov = D({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  Nd = (() => {
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
  yy = (() => {
    class e extends Nd {
      constructor() {
        super(...arguments),
          (this.location = h(yn)),
          (this.urlSerializer = h(ta)),
          (this.options = h(oa, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || "replace"),
          (this.urlHandlingStrategy = h(aa)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.currentUrlTree = new Fe()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = vd(null)),
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
        if (n instanceof An) this.stateMemento = this.createStateMemento();
        else if (n instanceof dt) this.rawUrlTree = r.initialUrl;
        else if (n instanceof fo) {
          if (
            this.urlUpdateStrategy === "eager" &&
            !r.extras.skipLocationChange
          ) {
            let o = this.urlHandlingStrategy.merge(r.finalUrl, r.initialUrl);
            this.setBrowserUrl(r.targetBrowserUrl ?? o, r);
          }
        } else
          n instanceof On
            ? ((this.currentUrlTree = r.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                r.finalUrl,
                r.initialUrl,
              )),
              (this.routerState = r.targetRouterState),
              this.urlUpdateStrategy === "deferred" &&
                !r.extras.skipLocationChange &&
                this.setBrowserUrl(r.targetBrowserUrl ?? this.rawUrlTree, r))
            : n instanceof Pe &&
                (n.code === te.GuardRejected ||
                  n.code === te.NoDataFromResolver)
              ? this.restoreHistory(r)
              : n instanceof Rn
                ? this.restoreHistory(r, !0)
                : n instanceof lt &&
                  ((this.lastSuccessfulId = n.id),
                  (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(n, r) {
        let o = n instanceof Fe ? this.urlSerializer.serialize(n) : n;
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
            return (n || (n = Qi(e)))(o || e);
          };
        })();
      }
      static {
        this.ɵprov = D({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  bn = (function (e) {
    return (
      (e[(e.COMPLETE = 0)] = "COMPLETE"),
      (e[(e.FAILED = 1)] = "FAILED"),
      (e[(e.REDIRECTING = 2)] = "REDIRECTING"),
      e
    );
  })(bn || {});
function Dy(e, t) {
  e.events
    .pipe(
      le(
        (n) =>
          n instanceof lt ||
          n instanceof Pe ||
          n instanceof Rn ||
          n instanceof dt,
      ),
      S((n) =>
        n instanceof lt || n instanceof dt
          ? bn.COMPLETE
          : (
                n instanceof Pe
                  ? n.code === te.Redirect ||
                    n.code === te.SupersededByNewNavigation
                  : !1
              )
            ? bn.REDIRECTING
            : bn.FAILED,
      ),
      le((n) => n !== bn.REDIRECTING),
      Me(1),
    )
    .subscribe(() => {
      t();
    });
}
function wy(e) {
  throw e;
}
var Cy = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  Iy = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  Ad = (() => {
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
          (this.console = h(Kr)),
          (this.stateManager = h(Nd)),
          (this.options = h(oa, { optional: !0 }) || {}),
          (this.pendingTasks = h(jt)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.navigationTransitions = h(py)),
          (this.urlSerializer = h(ta)),
          (this.location = h(yn)),
          (this.urlHandlingStrategy = h(aa)),
          (this._events = new W()),
          (this.errorHandler = this.options.errorHandler || wy),
          (this.navigated = !1),
          (this.routeReuseStrategy = h(my)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || "ignore"),
          (this.config = h(sa, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!h(ra, { optional: !0 })),
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
                r instanceof Pe &&
                  r.code !== te.Redirect &&
                  r.code !== te.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (r instanceof lt) this.navigated = !0;
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
                        gy(o.source),
                    },
                    s,
                  );
                this.scheduleNavigation(a, Mn, null, u, {
                  resolve: o.resolve,
                  reject: o.reject,
                  promise: o.promise,
                });
              }
            }
            by(r) && this._events.next(r);
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
              Mn,
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
        (this.config = n.map(ia)), (this.navigated = !1);
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
          d = hd(p);
        } catch {
          (typeof n[0] != "string" || n[0][0] !== "/") && (n = []),
            (d = this.currentUrlTree.root);
        }
        return pd(d, n, l, c ?? null);
      }
      navigateByUrl(n, r = { skipLocationChange: !1 }) {
        let o = xn(n) ? n : this.parseUrl(n),
          i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
        return this.scheduleNavigation(i, Mn, null, r);
      }
      navigate(n, r = { skipLocationChange: !1 }) {
        return Ey(n), this.navigateByUrl(this.createUrlTree(n, r), r);
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
          (r === !0 ? (o = g({}, Cy)) : r === !1 ? (o = g({}, Iy)) : (o = r),
          xn(n))
        )
          return Yl(this.currentUrlTree, n, o);
        let i = this.parseUrl(n);
        return Yl(this.currentUrlTree, i, o);
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
          Dy(this, () => {
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
function Ey(e) {
  for (let t = 0; t < e.length; t++) if (e[t] == null) throw new v(4008, !1);
}
function by(e) {
  return !(e instanceof On) && !(e instanceof Wt);
}
var Sy = new E("");
function Rd(e, ...t) {
  return kr([
    { provide: sa, multi: !0, useValue: e },
    [],
    { provide: Zt, useFactory: My, deps: [Ad] },
    { provide: hs, multi: !0, useFactory: _y },
    t.map((n) => n.ɵproviders),
  ]);
}
function My(e) {
  return e.routerState.root;
}
function _y() {
  let e = h(ot);
  return (t) => {
    let n = e.get(st);
    if (t !== n.components[0]) return;
    let r = e.get(Ad),
      o = e.get(Ty);
    e.get(xy) === 1 && r.initialNavigation(),
      e.get(Ny, null, b.Optional)?.setUpPreloading(),
      e.get(Sy, null, b.Optional)?.init(),
      r.resetRootComponentType(n.componentTypes[0]),
      o.closed || (o.next(), o.complete(), o.unsubscribe());
  };
}
var Ty = new E("", { factory: () => new W() }),
  xy = new E("", { providedIn: "root", factory: () => 1 });
var Ny = new E("");
var Od = [];
var Pd = { providers: [bl({ eventCoalescing: !0 }), Rd(Od)] };
var Co = class e {
  title = "new";
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = Fr({
    type: e,
    selectors: [["app-root"]],
    standalone: !0,
    features: [Yr],
    decls: 2,
    vars: 0,
    template: function (n, r) {
      n & 1 && (Zr(0, "h1"), yl(1, "app.component"), Qr());
    },
    encapsulation: 2,
  });
};
Zl(Co, Pd).catch((e) => console.error(e));
