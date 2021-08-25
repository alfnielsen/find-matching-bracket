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


Code for matchin example (highlighted):
```ts
function foo(s: string) { // <- start pos 23
   var str = `text with repeat ${new Array(2).fill(s).map(s=>{ return s + '-{}-' }).join('')} ends here `;
    return { return: str }
} // <- return this position 159 (What we need to find!)
```


**matchBracket example:**
```ts
const code = 
    "function foo(s: string) {\n"+ // <- start pos 23
    "   var str = `text with repeat ${new Array(2).fill(s).map(s=>{ return s + '-{}-' }).join('')} ends here `;\n"+
    "    return { return: str }\n"+
    "}" // <- return this position 159 (What we need to find!)
    
const endPosition = matchBracket(code, 23);

// endPosition = 159
const includeBoth = code.substring(23, 160) // 159+1 to include the end bracket
const excludeBoth = code.substring(24, 159) // 23+1 to exclude start bracket

```

Bracket that can be matchs: 

`${` and `$"` can only be matched inside string templates (js an cs templates)

```ts
type StartBracket = '<'|'['|'('|'{'|'${'|'$"'|'"'|"'"|"`"
type EndBracket = '>'|']'|')'|'}'|'"'|"'"|"`"
```
