# find-matching-bracket

Find matching bracket in Js/Ts/Cs code (including string Template literals interpolation)


```ts
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
export default function matchBracket(code: string, startPosition: number, throwErrors = false):number
```
**ex:**
```ts
const code = 
    "function foo(s:srting) {\n"+ // <- start pos 23
    "   var str = `text with repeat ${new Array(2).fill(s).join("")} ends here `;\n"+
    "    return { return: str }\n"+
    "}" // <- return this
```

Bracket that can be matchs: 
'${' and '$"' can only be match in matching string templates (js an cs templates)

```ts
type StartBracket = '<'|'['|'('|'{'|'${'|'$"'|'"'|"'"|"`"
type EndBracket = '>'|']'|')'|'}'|'"'|"'"|"`"
```