const defaultAdGroupsProvider = () => {
    const configuredGroups = process.env.AD_GROUPS || "";

    return configuredGroups
        .split(",")
        .map(group => group.trim())
        .filter(group => group != "");
};

class AdUtils {

    constructor(provider) {
        this.provide = provider || defaultAdGroupsProvider;

        this.getAdGroups = this.getAdGroups.bind(this);
        this.setProvider = this.setProvider.bind(this);
    }

    getAdGroups() {
        return this.provide();
    }

    setProvider(newProvider) {
        this.provider = newProvider;
    }
}

module.exports = AdUtils;