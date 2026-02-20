<template>
  <div class="input-group">
    <span class="input-group-text">
      <i class="bi bi-search"></i>
    </span>
    <input
      type="text"
      class="form-control"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: 'SearchInput',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Search...'
    }
  },
  emits: ['update:modelValue']
}
</script>

<style scoped>
.input-group-text {
  background-color: #fff;
  border-right: none;
}

.input-group .form-control {
  border-left: none;
}

.input-group .form-control:focus {
  border-left: 1px solid #86b7fe;
}
</style>
