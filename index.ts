
// Possible start and end brackets
type StartBracket = '<'|'['|'('|'{'|'${'|'$"'|'"'|"'"|"`"
type EndBracket = '>'|']'|')'|'}'|'"'|"'"|"`"

// Meta rules for each bracket type (Interface) 
interface BracketSet {
    name: string,
    start: StartBracket,
    end: EndBracket,
    notAfter?: string,
    notInParents: BracketSet[],
    notEndInParents: BracketSet[],
    isString?: boolean,
    isTemplate?: boolean
    startParent?: BracketSet
    endParent?: BracketSet
}
// Meta rules for each bracket type (Map)
const brackets = {
    angle:{ name: 'angle', start: '<', end:'>'} as BracketSet,
    peparentheses:{ name: 'peparentheses', start: '(', end:')'} as BracketSet,
    square:{ name: 'square', start: '[', end:']'} as BracketSet,
    curly:{ name: 'curly', start: '{', end:'}'} as BracketSet,
    inTemaple:{ name: 'inTemaple', notAfter:"\\",start: '${', end:'}'} as BracketSet,
    inCTemaple:{ name: 'inCTemaple', notAfter:"{", start: '{', end:'}'} as BracketSet,
    double:{ name: 'double', start: '"', end:'"', isString: true} as BracketSet,
    single:{ name: 'single', start: "'", end:"'", isString: true} as BracketSet,
    template:{ name: 'template', start: "`", end:"`", isString: true, isTemplate: true} as BracketSet,
    cTemplate:{ name: 'cTemplate',  start: '$"', end:'"'} as BracketSet,
}
brackets.inTemaple.startParent = brackets.template;
brackets.inCTemaple.startParent = brackets.cTemplate;
brackets.angle.notInParents = [brackets.double,brackets.single,brackets.template,brackets.cTemplate]
brackets.peparentheses.notInParents = [brackets.double,brackets.single,brackets.template,brackets.cTemplate]
brackets.square.notInParents = [brackets.double,brackets.single,brackets.template,brackets.cTemplate]
brackets.curly.notInParents = [brackets.double,brackets.single,brackets.template,brackets.cTemplate]
brackets.inTemaple.notInParents = [brackets.double,brackets.single,brackets.cTemplate]
brackets.inCTemaple.notInParents = [brackets.double,brackets.single,brackets.template]
brackets.double.notInParents = [brackets.single,brackets.template,brackets.cTemplate]
brackets.single.notInParents = [brackets.double,brackets.template,brackets.cTemplate]
brackets.template.notInParents = [brackets.double,brackets.single,brackets.cTemplate]
brackets.cTemplate.notInParents = [brackets.double,brackets.single,brackets.template]

// Map to list (For easy iteration)
const brackitSets = Object.values(brackets)

// test for matching start bracket (set)
const isStart = (code:string, p: number, parent?: BracketSet) => {
    const char = code[p]
    const next = code.length > (p+1) ? code[p+1] : undefined
    const last = code.length > 1 ? code[p-1] : undefined
    return brackitSets.find((bracketSet)=>{
        if(bracketSet.start.length===2 && (bracketSet.start[0] !== char || bracketSet.start[1]!==next))return false
        else if(bracketSet.start.length===1 && bracketSet.start !== char)return false;
        if(bracketSet.start === bracketSet.end && bracketSet === parent)return false; // string end
        if(parent && bracketSet.notInParents.includes(parent))return false;
        if(parent && bracketSet.startParent !== undefined && bracketSet.startParent!==parent)return false;
        if(bracketSet.notAfter && bracketSet.notAfter === last)return false
        return true
    })
}
// test for matching end bracket (set)
const isEnd = (code:string, p: number, parent: BracketSet) => {
    const char = code[p]
    return brackitSets.find((bSet)=>{
        if(bSet.end !== char)return false;
        if(bSet !== parent)return false;
        if(bSet.notInParents.includes(parent))return false;
        return true
    })
}

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
export default function matchBracket(code: string, startPosition: number, throwErrors = false): number{
    debugger
    const stack: BracketSet[] = []
    let p = startPosition;
    let char = code[p]
    const s = isStart(code, p, undefined)
    if(!s){
        if(throwErrors){
            console.log(`matchBracket position ${p} are not a bracket but ${char}!`)
        }
        return -2
    }
    p += 1;
    let c = s // current top on stack (bracket set)
    stack.push(s)
    for(;p < code.length; p++){
        const start = isStart(code,p,c)
        if(start){
            if(start.start.length==2){
                p+=1
            }
            stack.push(start)
            c = start
            continue;
        }
        const end = isEnd(code, p, c)
        if(end){
            if(c !== end){
                if(throwErrors){
                    throw new Error(`matchBracket missmatch start: ${c.name} end: ${end.name} at position ${p}`)
                }
                return -3
            }
            stack.pop()
            if(stack.length === 0){
                return p;
            }
            c = stack[stack.length-1]
            continue
        }
    }
    return -1
}
