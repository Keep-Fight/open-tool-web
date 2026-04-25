// stores/favoriteStore.js
import { defineStore } from "pinia"

export const useFavoriteStore = defineStore("favorite", {
    state: () => ({
        ids: JSON.parse(localStorage.getItem("favTools") || "[]")
    }),

    getters: {
        isFav: (state) => (id) => state.ids.includes(id),
        count: (state) => state.ids.length
    },

    actions: {
        toggle(id) {
            if (this.ids.includes(id)) {
                this.ids = this.ids.filter(i => i !== id)
            } else {
                this.ids.push(id)
            }
            localStorage.setItem("favTools", JSON.stringify(this.ids))
        }
    }
})