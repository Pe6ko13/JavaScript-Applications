import { getUserData } from '../util.js';

export function createPointer(className, objectId) {
    return {
        __type: 'Pointer',
        className,
        objectId
    };
}

export function addOwner(record) {
    const {id} = getUserData();
    record.owner = createPointer('_User', id);

    return record;
}

export function createQuery(query) {
    return encodeURIComponent(JSON.stringify(query));
}

export function createPointerQuery(propName, className, objectId) {
    return createQuery({[propName]: createPointer(className, objectId)});
}