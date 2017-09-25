export const objectDictionaryToArray = <T extends { id: string }>(obj: Record<string, T>): T[] => Object.keys(obj).map((id) => ({ id, ...<any>obj[id] }));

type Value = string | number | Date;
export const valueDictionaryToArray = <T extends { id: string, value: Value }>(obj: Record<string, Value>): T[] => Object.keys(obj).map((id) => (<any>{ id, value: obj[id] }));
