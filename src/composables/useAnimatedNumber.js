import { ref, watch } from 'vue'

export function useAnimatedNumber(targetValue, duration = 500) {
  const currentValue = ref(0)
  
  let startTime = null
  let startValue = 0
  let animationFrameId = null
  
  const animate = (timestamp) => {
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // Ease out function for smooth animation
    const easeOut = 1 - Math.pow(1 - progress, 3)
    
    currentValue.value = Math.floor(startValue + (targetValue.value - startValue) * easeOut)
    
    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate)
    }
  }
  
  watch(targetValue, (newVal, oldVal) => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
    
    startValue = oldVal || 0
    startTime = null
    animationFrameId = requestAnimationFrame(animate)
  }, { immediate: true })
  
  return { currentValue }
}