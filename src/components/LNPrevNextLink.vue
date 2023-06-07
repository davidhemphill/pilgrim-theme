<template>
  <a class="font-semibold group flex items-center text-base space-x-2">
    <span class="text-gray-500 group-hover:text-gray-600">
      <slot name="preLabel" />
    </span>
    <span class="text-sm text-gray-500 group-hover:text-gray-700"
      ><slot
    /></span>
    <span class="text-gray-500 group-hover:text-gray-600">
      <slot name="postLabel" />
    </span>
  </a>
</template>
