const usernameRegex = /^[A-Za-z0-9_]+$/;

export function createAccount(username) {
    let verified = false;
    let name = "";

    if (!usernameRegex.test(username)) {
        name = "invalid characters (only letters, numbers and underscore allowed)"
    } else if (username.length > 20) {
        name = "username too long (max 20 characters)"
    } else {
        name = username;
        verified = true;

        // for (const message of messages) {
        //    socket.emit("recievemessage", {
        //        username: message.username,
        //        message: message.message}
        //    )
        //}
        
    }

    return(
        {
            type: "register",
            verified: verified,
            username: name
        }
    )
}