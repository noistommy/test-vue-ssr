<script setup>
import { ref, onMounted } from 'vue'

defineProps({
  msg: String,
})

const testApi = async () => {
  try {
    const response = await fetch('https://reqres.in/api/users?page=2')
    const json = await response.json()
    list.value = json.data
  } catch (err) {
    console.log(err)
  }
}

onMounted(() => {
  testApi()
})
const count = ref(0)
const list = ref(null)
</script>

<template>
  <h1>{{ msg }}</h1>
  <div class="list">
    <div class="item" v-for="item in list" :key="item.id">test {{ item.email }}</div>
  </div>
  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
 
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
