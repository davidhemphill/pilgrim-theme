<script setup lang="ts">
import { useData, withBase } from 'vitepress'
const { theme } = useData()
</script>

<template>
  <a :href="withBase('/')">
    <img v-bind="$attrs" class="block dark:hidden" :src="withBase(theme.logo.light)" alt="logo" />
    <img v-bind="$attrs" class="hidden dark:block" :src="withBase(theme.logo.dark)" alt="logo" />
  </a>
</template>
