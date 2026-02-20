<template>
  <div class="form-group">
    <label v-if="label" :for="id" class="form-label">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    <textarea
      :id="id"
      :class="textareaClasses"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
    <div v-if="error" class="invalid-feedback d-block">{{ error }}</div>
  </div>
</template>

<script>
export default {
  name: 'Textarea',
  props: {
    id: {
      type: String,
      default: () => `textarea-${Math.random().toString(36).substr(2, 9)}`
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    rows: {
      type: Number,
      default: 3
    },
    error: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  computed: {
    textareaClasses() {
      const classes = ['form-control']
      if (this.error) {
        classes.push('is-invalid')
      }
      return classes.join(' ')
    }
  }
}
</script>
