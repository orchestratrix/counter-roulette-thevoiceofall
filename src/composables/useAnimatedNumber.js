import { ref, watch, onUnmounted } from 'vue'

export function useAnimatedNumber(targetValue, duration = 500) {
  const currentValue = ref(targetValue.value ?? 0)

  let startTime = null
  let startValue = currentValue.value
  let animationFrameId = null

  function animate(timestamp) {
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOut = 1 - Math.pow(1 - progress, 3)

    currentValue.value = Math.floor(
      startValue + (targetValue.value - startValue) * easeOut
    )

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate)
    } else {
      currentValue.value = targetValue.value
    }
  }

  watch(targetValue, (newVal, oldVal) => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
    startValue = oldVal ?? 0
    startTime = null
    animationFrameId = requestAnimationFrame(animate)
  })

  onUnmounted(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
  })

  return { currentValue }
}