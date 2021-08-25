"use strict";
exports.__esModule = true;
// Meta rules for each bracket type (Map)
var brackets = {
    angle: { name: 'angle', start: '<', end: '>' },
    peparentheses: { name: 'peparentheses', start: '(', end: ')' },
    square: { name: 'square', start: '[', end: ']' },
    curly: { name: 'curly', start: '{', end: '}' },
    inTemaple: { name: 'inTemaple', notAfter: "\\", start: '${', end: '}' },
    inCTemaple: { name: 'inCTemaple', notAfter: "{", start: '{', end: '}' },
    double: { name: 'double', start: '"', end: '"', isString: true },
    single: { name: 'single', start: "'", end: "'", isString: true },
    template: { name: 'template', start: "`", end: "`", isString: true, isTemplate: true },
    cTemplate: { name: 'cTemplate', start: '$"', end: '"' }
};
brackets.inTemaple.startParent = brackets.template;
brackets.inCTemaple.startParent = brackets.cTemplate;
brackets.angle.notInParents = [brackets.double, brackets.single, brackets.template, brackets.cTemplate];
brackets.peparentheses.notInParents = [brackets.double, brackets.single, brackets.template, brackets.cTemplate];
brackets.square.notInParents = [brackets.double, brackets.single, brackets.template, brackets.cTemplate];
brackets.curly.notInParents = [brackets.double, brackets.single, brackets.template, brackets.cTemplate];
brackets.inTemaple.notInParents = [brackets.double, brackets.single, brackets.cTemplate];
brackets.inCTemaple.notInParents = [brackets.double, brackets.single, brackets.template];
brackets.double.notInParents = [brackets.single, brackets.template, brackets.cTemplate];
brackets.single.notInParents = [brackets.double, brackets.template, brackets.cTemplate];
brackets.template.notInParents = [brackets.double, brackets.single, brackets.cTemplate];
brackets.cTemplate.notInParents = [brackets.double, brackets.single, brackets.template];
// Map to list (For easy iteration)
var brackitSets = Object.values(brackets);
// test for matching start bracket (set)
var isStart = function (code, p, parent) {
    var char = code[p];
    var next = code.length > (p + 1) ? code[p + 1] : undefined;
    var last = code.length > 1 ? code[p - 1] : undefined;
    return brackitSets.find(function (bracketSet) {
        if (bracketSet.start.length === 2 && (bracketSet.start[0] !== char || bracketSet.start[1] !== next))
            return false;
        else if (bracketSet.start.length === 1 && bracketSet.start !== char)
            return false;
        if (bracketSet.start === bracketSet.end && bracketSet === parent)
            return false; // string end
        if (parent && bracketSet.notInParents.includes(parent))
            return false;
        if (parent && bracketSet.startParent !== undefined && bracketSet.startParent !== parent)
            return false;
        if (bracketSet.notAfter && bracketSet.notAfter === last)
            return false;
        return true;
    });
};
// test for matching end bracket (set)
var isEnd = function (code, p, parent) {
    var char = code[p];
    return brackitSets.find(function (bSet) {
        if (bSet.end !== char)
            return false;
        if (bSet !== parent)
            return false;
        if (bSet.notInParents.includes(parent))
            return false;
        return true;
    });
};
/**
 * if throwErrors is true, it throw (stop) with info.
 * else it return matching position,
 * or:
 * -2 if startPostion don't match start bracket
 * -3 if end bracket dont match start bracket
 * -1 if cursor comes to end of code without finding maching bracket
 *
 * @param code
 * @param startPosition position for staing bracket
 * @param throwErrors default false - if true: throw error with information
 * @returns
 */
function matchBracket(code, startPosition, throwErrors) {
    if (throwErrors === void 0) { throwErrors = false; }
    debugger;
    var stack = [];
    var p = startPosition;
    var char = code[p];
    var s = isStart(code, p, undefined);
    if (!s) {
        if (throwErrors) {
            console.log("matchBracket position " + p + " are not a bracket but " + char + "!");
        }
        return -2;
    }
    p += 1;
    var c = s; // current top on stack (bracket set)
    stack.push(s);
    for (; p < code.length; p++) {
        var start = isStart(code, p, c);
        if (start) {
            if (start.start.length == 2) {
                p += 1;
            }
            stack.push(start);
            c = start;
            continue;
        }
        var end = isEnd(code, p, c);
        if (end) {
            if (c !== end) {
                if (throwErrors) {
                    throw new Error("matchBracket missmatch start: " + c.name + " end: " + end.name + " at position " + p);
                }
                return -3;
            }
            stack.pop();
            if (stack.length === 0) {
                return p;
            }
            c = stack[stack.length - 1];
            continue;
        }
    }
    return -1;
}
exports["default"] = matchBracket;
