export const toArray = <T extends { id: string }>(obj: Record<string, T>): T[] => Object.keys(obj).map((id) => ({ id, ...<any>obj[id] }));
