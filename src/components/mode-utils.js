const { getAdGroups } = require("./ad-utils");

const modes = {
    passthrough: "passthrough",
    authorize: "authorize"
};

const defaultModeProvider = () => {
    const isPassThroughConfigured = (process.env.PASSTHROUGH || "0") == "1";
    if (isPassThroughConfigured) {
        return modes.passthrough;
    }

    const hasAdGroups = getAdGroups().length > 0;
    if (hasAdGroups) {
        return modes.authorize;
    }

    return modes.passthrough;    
};

class ModeUtils {
    constructor(provider) {
        this.provider = provider || defaultModeProvider;

        this.isPassthrough = this.isPassthrough.bind(this);
        this.isAuthorize = this.isAuthorize.bind(this);
        this.setProvider = this.setProvider.bind(this);
    }

    isPassthrough() {
        return this.provider() == modes.passthrough;
    }

    isAuthorize() {
        return this.provider() == modes.authorize;
    }

    setProvider(newProvider) {
        this.provider = newProvider;
    }
}

module.export = ModeUtils;