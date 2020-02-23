export default async function (delay) {
    let resolve, reject;
    const promise = new Promise((_resolve, _reject) => { resolve = _resolve; reject = _reject; });

    console.log('start sleeping for %dms', delay);
    setTimeout(resolve, delay);

    return promise;
}
