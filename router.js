module.exports.route = (request, response, handle, info, models) => {
    if (typeof handle[info.pathname] === 'function') {
        handle[info.pathname](request, response, info.method, models);
    } else {
        response.set('Content-Type', 'text/plain');
        response.send(TAG, 'Request not found with pathname -> ' + info.pathname + ' method -> ' + info.method);
    }
}