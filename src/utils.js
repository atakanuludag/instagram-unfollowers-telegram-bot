const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
exports.snooze = snooze;