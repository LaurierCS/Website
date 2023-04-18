export function getReturnObject(is_ok, message, data) {
    let obj = {
        is_ok,
        message,
    };
    if (data) {
        obj.data = data;
    }
    return obj;
}

export function error(message) {
    return {
        error: message,
        is_ok: false,
    };
}

// for code clarity
export function isAuthenticated(context) {
    return !!context.auth;
}
