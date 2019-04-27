module.exports = member => {
    let username = member.user.username;
    member.sendMessage('Hoşgeldin ' + username + ' lütfen kuralları okumayı unutma');

};
