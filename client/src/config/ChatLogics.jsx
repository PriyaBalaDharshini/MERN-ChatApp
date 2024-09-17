export const getSender = (loggedUser, users) => {
    if (!users || users.length < 2) {
        return "Unknown";
    }
    return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name || "Unknown";
}

export const getSenderFull = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1] : users[0];
}

export const isSameSender = (message, m, i, userId) => { //logged in user id userId
    return (
        i < message.length - 1 &&
        (message[i + 1].sender._id !== m.sender._id ||
            message[i + 1].sender._id === undefined) &&
        message[i].sender._id !== userId
    )
}

export const isLastMessage = (message, i, userId) => {
    return (
        i === message.length - 1 && //last message?
        message[message.length - 1].sender._id !== userId &&
        message[message.length - 1].sender._id
    );
};

export const isSameSenderMargin = (message, m, i, userId) => {

    // If same sender logic
    if (
        i < message.length - 1 &&
        message[i + 1].sender._id === m.sender._id &&
        message[i].sender._id !== userId
    ) //if same sender they apply margin 33
        return 33;
    else if (
        (i < message.length - 1 &&
            message[i + 1].sender._id !== m.sender._id &&
            message[i].sender._id !== userId) ||
        (i === message.length - 1 && message[i].sender._id !== userId)
    ) // if not marging 0
        return 0;
    else return "auto";
};

export const isSameUser = (message, m, i) => {
    return i > 0 && message[i - 1].sender._id === m.sender._id;
};