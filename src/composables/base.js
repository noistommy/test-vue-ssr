import { ref, computed } from 'vue'

export const useBase = () => {
    
    
    const baseStyle = computed(() => {
        return {
            backgroundColor: 'teal',
            fontWeight: '900'
        }
    })
    
    
    return { baseStyle }
}