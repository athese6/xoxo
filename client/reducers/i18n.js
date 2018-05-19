import actionUtil from "../lib/action-util";

// empty state for the i18n properties, all values would comes from the server side
export default (state = {translations: {}, locales: {}}, action = {}) => {
    switch (action.type) {
        case "I18N_SET_TRANSLATIONS":
            return {...state, translations: actionUtil.getResponseData(action).translations};
    }
    return state;
};