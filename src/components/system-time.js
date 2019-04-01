const defaultTimeProvider = () => new Date();

let timeProvider = defaultTimeProvider()

exports.timeProvider = timeProvider;
exports.defaultTimeProvider = defaultTimeProvider;

exports.setTimeProvider = function(newTimeProvider) {
    timeProvider = newTimeProvider;
}