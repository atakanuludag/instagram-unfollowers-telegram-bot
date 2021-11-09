const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

export {
    snooze
}