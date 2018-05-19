const lib = {
    getError: action => {
        const payload = action.payload;
        if (payload && payload.response && payload.response.data && payload.response.data.error) {
            return payload.response.data.error;
        } else if (payload instanceof Error) {
            return payload;
        } else if (action.response && action.response.data && action.response.data.error) {
            return action.response.data.error;
        } else {
            // this should not happened :P
            return new Error();
        }
    },
    getRequestData: action => {
        const payload = action.payload;
        if (payload && payload.config && payload.config.data) {
            try {
                return JSON.stringify(payload.config.data);
            } catch (e) {
                console.log(e);
            }
        }
        return {};
    },
    getResponseData: action => {
        const payload = action.payload;
        if (payload) {
            if (payload.response) {
                return payload.response.data;
            } else if (payload.data) {
                return payload.data;
            } else {
                return payload;
            }
        }
        return {};
    },
    getMeta: action => action.meta || {}
};

export default lib;