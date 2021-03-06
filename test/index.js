var assert = require("assert")
var Counter  = require('./../index')

describe('countjs', function() {
  describe('new', function () {
    it('should generate a new counter', function () {
      new Counter()
    });

    it('should be able to pre-fill a counter from the constructor', function () {
      var c = new Counter({a: 1})
      assert.equal(1, c.get('a'))
    });
  });

  describe('add', function () {
    it('adds an item to the counter', function () {
      var c = new Counter()
      c.add('a')
      assert.equal(1, c.get('a'))
    });

    it('can add quantities in different calls', function () {
      var c = new Counter()
      c.add('a')
      c.add('a')
      c.add('a')
      assert.equal(3, c.get('a'))
    });

    it('can specify a custom quantity', function () {
      var c = new Counter()
      c.add('a')
      c.add('a', {qty: 2})
      c.add('a')
      assert.equal(4, c.get('a'))
    });

    it('can specify zero as quantity', function () {
      var c = new Counter()
      c.add('a', {qty: 0})
      assert.equal(0, c.get('a'))
    });

    it('can prevent you from adding to the counter if there is a reference that has a lower count', function () {
      var c = new Counter({}, {a: 1})
      assert.equal(true, c.add('a', {qty: 0}))
      assert.equal(true, c.add('a'))
      assert.equal(false, c.add('a'))
      assert.equal(false, c.add('b'))
      assert.equal(1, c.get('a'))
      assert.equal(0, c.get('b'))
    });

    it('you can force adding to the counter so that it ignores the reference', function () {
      var c = new Counter({}, {a: 1})
      assert.equal(true, c.add('a', {qty: 0}))
      assert.equal(true, c.add('a'))
      assert.equal(true, c.add('b', {force: true}))
      assert.equal(true, c.add('a', {qty: 1, force: true}))
      assert.equal(2, c.get('a'))
      assert.equal(1, c.get('b'))
    });
  });

  describe('get', function () {
    it('should be able to give you a count of each element in the counter', function () {
      var c = new Counter()
      c.add('a', {qty: 0})
      c.add('b')
      c.add('c', {qty: 2})
      assert.equal(0, c.get('a'))
      assert.equal(1, c.get('b'))
      assert.equal(2, c.get('c'))
    });

    it('should say 0 for something we  havent counted yet', function () {
      var c = new Counter()
      assert.equal(0, c.get('a'))
    });

    it('should be able to give you a count of everything in the counter', function () {
      var c = new Counter()
      c.add('a', {qty: 0})
      c.add('b')
      c.add('c', {qty: 2})
      assert.equal(0, c.get().a)
      assert.equal(1, c.get().b)
      assert.equal(2, c.get().c)
    });
  });

  describe('get', function () {
    it('should be able to give you the reference', function () {
      var c = new Counter({}, {a: 1})
      assert.equal(1, c.getReference('a'))
      assert.equal(1, c.getReference().a)
      assert.equal(0, c.getReference('b'))
    });
  });

  describe('diff', function () {
    it('should be able to give you a diff between the current counter and another counter', function () {
      var c1 = new Counter({a: 2, b: 2, c: 3, e: 2, f: 1, g: 0, h: 1, i: 0, l: 0})
      var c2 = new Counter({a: 1, b: 0, d: 1, e: 0, f: 2, i: 2, l: 0})

      diff = c2.diff(c1)

      assert.equal(1, diff.a.mine)
      assert.equal(2, diff.a.other)
      assert.equal(-1, diff.a.diff)
      assert.equal(0, diff.b.mine)
      assert.equal(0, diff.c.mine)
      assert.equal(3, diff.c.other)
      assert.equal(-3, diff.c.diff)
      assert.equal(1, diff.d.mine)
      assert.equal(0, diff.e.mine)
      assert.equal(2, diff.f.mine)
      assert.equal(undefined, diff.g)
      assert.equal(undefined, diff.l)
    });

    it('should be able to have a reference to diff against', function () {
      var c = new Counter({}, {a: 1, b: 3})
      c.add('b', {qty: 2})
      diff = c.diff()

      assert.equal(0, diff.a.mine)
      assert.equal(2, diff.b.mine)
    });

    it('should throw an exception if no counter nor reference were provided', function (done) {
      var c = new Counter({a: 1})

      try {
        diff = c.diff()

      } catch(err) {
        assert.equal('E_NO_COUNTER', err.code)
        done()
      }
    });
  });

  describe('compare', function () {
    it('should be able to give you a deep comparison', function () {
      var c1 = new Counter({a: 1, b: 1, d: 3}, {b: 2, c: 1, d: 3})

      comparison = c1.compare()

      assert.equal(1, comparison.a.mine)
      assert.equal(0, comparison.a.other)
      assert.equal(1, comparison.b.mine)
      assert.equal(2, comparison.b.other)
      assert.equal(0, comparison.c.mine)
      assert.equal(1, comparison.c.other)
      assert.equal(3, comparison.d.mine)
      assert.equal(3, comparison.d.other)
    });

    it('should be able to compatre 2 counters as well', function () {
      var c1 = new Counter({a: 1, b: 1, d: 3})
      var c2 = new Counter({b: 2, c: 1, d: 3})

      comparison = c1.compare(c2)

      assert.equal(1, comparison.a.mine)
      assert.equal(0, comparison.a.other)
      assert.equal(1, comparison.b.mine)
      assert.equal(2, comparison.b.other)
      assert.equal(0, comparison.c.mine)
      assert.equal(1, comparison.c.other)
      assert.equal(3, comparison.d.mine)
      assert.equal(3, comparison.d.other)
    });
  });
});
