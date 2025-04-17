<script setup>
import { useRoute } from 'vue-router'
import { useBase } from '../composables/base'

const route = useRoute()
const { baseStyle } = useBase()
defineProps({
    page: String
})
</script>

<template>
    <h1>Test</h1>
    <h3>Route Info</h3>
    <div class="info-list">
        <div class="item">{{ page }}</div>
    </div>
</template>

