export default class Configuration {
    getPassthroughState() {
        return (process.env.PASSTHROUGH || "0") == "1";
    }

    getDebugState() {
        return (process.env.DEBUG || "0") == "1";
    }

    getAdGroups() {
        const configuredGroups = process.env.AD_GROUPS || "";
        return configuredGroups
            .split(",")
            .map(group => group.trim())
            .filter(group => group != "");
    }

    get port() {
        return process.env.PORT || 9321;
    }

    get target() {
        return process.env.TARGET || "http://localhost:9322";
    }
}