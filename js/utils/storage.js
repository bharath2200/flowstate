/**
 * LocalStorage Storage Helpers for FlowState
 */

export const Storage = {
    /**
     * Get item from LocalStorage with fallback value
     * @param {string} key 
     * @param {any} fallback 
     */
    get(key, fallback = null) {
        try {
            const item = localStorage.getItem(`flowstate_${key}`);
            return item ? JSON.parse(item) : fallback;
        } catch (e) {
            console.error(`Error reading key "${key}" from localStorage:`, e);
            return fallback;
        }
    },

    /**
     * Save item to LocalStorage
     * @param {string} key 
     * @param {any} value 
     */
    set(key, value) {
        try {
            localStorage.setItem(`flowstate_${key}`, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error(`Error saving key "${key}" to localStorage:`, e);
            return false;
        }
    },

    /**
     * Remove item from LocalStorage
     * @param {string} key 
     */
    remove(key) {
        try {
            localStorage.removeItem(`flowstate_${key}`);
            return true;
        } catch (e) {
            console.error(`Error removing key "${key}" from localStorage:`, e);
            return false;
        }
    }
};
