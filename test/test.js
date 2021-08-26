var assert = require("assert");
var matchBracket = require("../index.js").default;

describe("matchBracket", function () {
  it("should return 160 for base test", function () {
    const code =
      "function foo(s: string) {\n" + // <- start pos 24
      "   var str = `text with repeat ${new Array(2).fill(s).map(s=>{ return s + '-{}-' }).join('')} ends here `;\n" +
      "    return { return: str }\n" +
      "}"; // <- return this position 160 (What we need to find!)

    const endPosition = matchBracket(code, 24);

    assert.equal(endPosition, 160);
  });

  it("should ignore comment {", function () {
    const code = `{
        const f = {
            f: {} // }
        }
        /* 
           } 
        */
        // }
    }`;
    const endPosition = matchBracket(code, 0);

    assert.equal(endPosition, code.length - 1);
  });
  it("should allow quote escaped", function () {
    let code = `'    \\'    '`;
    let endPosition = matchBracket(code, 0);
    assert.equal(endPosition, code.length - 1);
    code = `"    \\"    "`;
    endPosition = matchBracket(code, 0);
    assert.equal(endPosition, code.length - 1);
  });
});
