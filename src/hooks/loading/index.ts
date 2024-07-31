import { ref } from 'vue'

export const useLoading = (defaultVal = false) => {
  const loading = ref(defaultVal)

  return {
    show() {
      loading.value = true
    },
    hide() {
      loading.value = false
    },
    get value() {
      return loading.value
    }
  }
}
