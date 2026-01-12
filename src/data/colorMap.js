// data/tools.js
const colorMap = {
    red: {
        bg: 'bg-red-500',
        base: 'bg-red-100 text-red-700',
        hover: 'group-hover:bg-red-600 group-hover:text-white',
        titleHover: 'group-hover:text-red-700',
        darkBase: 'bg-red-900/30 text-red-300',
        darkHover: 'group-hover:bg-red-700 group-hover:text-white',
        darkTitleHover: 'group-hover:text-red-300'
    },
    orange: {
        bg: 'bg-orange-500',
        base: 'bg-orange-100 text-orange-700',
        hover: 'group-hover:bg-orange-600 group-hover:text-white',
        titleHover: 'group-hover:text-orange-700',
        darkBase: 'bg-orange-900/30 text-orange-300',
        darkHover: 'group-hover:bg-orange-700 group-hover:text-white',
        darkTitleHover: 'group-hover:text-orange-300'
    },
    amber: {
        bg: 'bg-amber-500',
        base: 'bg-amber-100 text-amber-700',
        hover: 'group-hover:bg-amber-600 group-hover:text-white',
        titleHover: 'group-hover:text-amber-700',
        darkBase: 'bg-amber-900/30 text-amber-300',
        darkHover: 'group-hover:bg-amber-700 group-hover:text-white',
        darkTitleHover: 'group-hover:text-amber-300'
    },
    yellow: {
        bg: 'bg-yellow-500',
        base: 'bg-yellow-100 text-yellow-700',
        hover: 'group-hover:bg-yellow-600 group-hover:text-white',
        titleHover: 'group-hover:text-yellow-700',
        darkBase: 'bg-yellow-900/30 text-yellow-300',
        darkHover: 'group-hover:bg-yellow-700 group-hover:text-white',
        darkTitleHover: 'group-hover:text-yellow-300'
    },
    lime: {
        bg: 'bg-lime-500',
        base: 'bg-lime-100 text-lime-700',
        hover: 'group-hover:bg-lime-600 group-hover:text-white',
        titleHover: 'group-hover:text-lime-700',
        darkBase: 'bg-lime-900/30 text-lime-300',
        darkHover: 'group-hover:bg-lime-700 group-hover:text-white',
        darkTitleHover: 'group-hover:text-lime-300'
    },
    green: {
        bg: 'bg-green-500',
        base: 'bg-green-100 text-green-700',
        hover: 'group-hover:bg-green-600 group-hover:text-white',
        titleHover: 'group-hover:text-green-700',
        darkBase: 'bg-green-900/30 text-green-300',
        darkHover: 'group-hover:bg-green-700 group-hover:text-white',
        darkTitleHover: 'group-hover:text-green-300'
    },
    emerald: {
        bg: 'bg-emerald-500',
        base: 'bg-emerald-100 text-emerald-700',
        hover: 'group-hover:bg-emerald-600 group-hover:text-white',
        titleHover: 'group-hover:text-emerald-700',
        darkBase: 'bg-emerald-900/30 text-emerald-300',
        darkHover: 'group-hover:bg-emerald-700 group-hover:text-white',
        darkTitleHover: 'group-hover:text-emerald-300'
    },
    teal: {
        bg: 'bg-teal-500',
        base: 'bg-teal-100 text-teal-700',
        hover: 'group-hover:bg-teal-600 group-hover:text-white',
        titleHover: 'group-hover:text-teal-700',
        darkBase: 'bg-teal-900/30 text-teal-300',
        darkHover: 'group-hover:bg-teal-700 group-hover:text-white',
        darkTitleHover: 'group-hover:text-teal-300'
    },
    cyan: {
        bg: 'bg-cyan-500',
        base: 'bg-cyan-100 text-cyan-700',
        hover: 'group-hover:bg-cyan-600 group-hover:text-white',
        titleHover: 'group-hover:text-cyan-700',
        darkBase: 'bg-cyan-900/30 text-cyan-300',
        darkHover: 'group-hover:bg-cyan-700 group-hover:text-white',
        darkTitleHover: 'group-hover:text-cyan-300'
    },
    sky: {
        bg: 'bg-sky-500',
        base: 'bg-sky-100 text-sky-700',
        hover: 'group-hover:bg-sky-600 group-hover:text-white',
        titleHover: 'group-hover:text-sky-700',
        darkBase: 'bg-sky-900/30 text-sky-300',
        darkHover: 'group-hover:bg-sky-700 group-hover:text-white',
        darkTitleHover: 'group-hover:text-sky-300'
    },
    blue: {
        bg: 'bg-blue-500',
        base: 'bg-blue-100 text-blue-700',
        hover: 'group-hover:bg-blue-600 group-hover:text-white',
        titleHover: 'group-hover:text-blue-700',
        darkBase: 'bg-blue-900/30 text-blue-300',
        darkHover: 'group-hover:bg-blue-700 group-hover:text-white',
        darkTitleHover: 'group-hover:text-blue-300'
    },
    indigo: {
        bg: 'bg-indigo-500',
        base: 'bg-indigo-100 text-indigo-700',
        hover: 'group-hover:bg-indigo-600 group-hover:text-white',
        titleHover: 'group-hover:text-indigo-700',
        darkBase: 'bg-indigo-900/30 text-indigo-300',
        darkHover: 'group-hover:bg-indigo-700 group-hover:text-white',
        darkTitleHover: 'group-hover:text-indigo-300'
    },
    violet: {
        bg: 'bg-violet-500',
        base: 'bg-violet-100 text-violet-700',
        hover: 'group-hover:bg-violet-600 group-hover:text-white',
        titleHover: 'group-hover:text-violet-700',
        darkBase: 'bg-violet-900/30 text-violet-300',
        darkHover: 'group-hover:bg-violet-700 group-hover:text-white',
        darkTitleHover: 'group-hover:text-violet-300'
    },
    purple: {
        bg: 'bg-purple-500',
        base: 'bg-purple-100 text-purple-700',
        hover: 'group-hover:bg-purple-600 group-hover:text-white',
        titleHover: 'group-hover:text-purple-700',
        darkBase: 'bg-purple-900/30 text-purple-300',
        darkHover: 'group-hover:bg-purple-700 group-hover:text-white',
        darkTitleHover: 'group-hover:text-purple-300'
    },
    fuchsia: {
        bg: 'bg-fuchsia-500',
        base: 'bg-fuchsia-100 text-fuchsia-700',
        hover: 'group-hover:bg-fuchsia-600 group-hover:text-white',
        titleHover: 'group-hover:text-fuchsia-700',
        darkBase: 'bg-fuchsia-900/30 text-fuchsia-300',
        darkHover: 'group-hover:bg-fuchsia-700 group-hover:text-white',
        darkTitleHover: 'group-hover:text-fuchsia-300'
    },
    pink: {
        bg: 'bg-pink-500',
        base: 'bg-pink-100 text-pink-700',
        hover: 'group-hover:bg-pink-600 group-hover:text-white',
        titleHover: 'group-hover:text-pink-700',
        darkBase: 'bg-pink-900/30 text-pink-300',
        darkHover: 'group-hover:bg-pink-700 group-hover:text-white',
        darkTitleHover: 'group-hover:text-pink-300'
    },
    rose: {
        bg: 'bg-rose-500',
        base: 'bg-rose-100 text-rose-700',
        hover: 'group-hover:bg-rose-600 group-hover:text-white',
        titleHover: 'group-hover:text-rose-700',
        darkBase: 'bg-rose-900/30 text-rose-300',
        darkHover: 'group-hover:bg-rose-700 group-hover:text-white',
        darkTitleHover: 'group-hover:text-rose-300'
    }
}

export { colorMap }
