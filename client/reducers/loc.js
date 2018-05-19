import actionUtil from "../lib/action-util";

export default (state = {
    location: "",
}, action = {}) => {
    switch (action.type) {
        case "@@router/LOCATION_CHANGE":
            const {pathname} = actionUtil.getResponseData(action);
            return {
                location: pathname
            };

    }
    return state;
};