export function proximity(origStr, comparetoStr){
    
    origStr= origStr.toLowerCase().replace(/e/g, '3').replace(/a/g, '4').replace(/o/g, '0').replace(/ /g, '_').replace(/-/g, '_')
    comparetoStr = comparetoStr.toLowerCase().replace(/e/g, '3').replace(/a/g, '4').replace(/o/g, '0').replace(/ /g, '_').replace(/-/g, '_')

    return origStr==comparetoStr
}