module.exports = post => {
    post = post.dataValues;
    
    if (post.last_renewed_on) {
        var date = post.last_renewed_on;
    }
    else {
        var date = post.creation_date;
    }
    date = date.toJSON();
    const seconds = date.slice(17,19);
    const minutes = date.slice(14,16);
    const hours = date.slice(11,13);
    const day = date.slice(8,10);
    const month = date.slice(5,7);

    return { seconds, minutes, hours, day, month };
};