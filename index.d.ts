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
export default function matchBracket(code: string, startPosition: number, throwErrors?: boolean): number;
