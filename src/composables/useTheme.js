import { ref, onMounted, watch } from 'vue';

export function useTheme() {
    const isDark = ref(false);

    const toggleTheme = () => {
        isDark.value = !isDark.value;
    };

    onMounted(() => {
        // 读取本地缓存或系统偏好
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            isDark.value = true;
        }
    });

    watch(isDark, (val) => {
        if (val) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    });

    return { isDark, toggleTheme };
}
