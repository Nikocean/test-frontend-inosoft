<template>
  <div class="form-group">
    <label v-if="label" :for="id" class="form-label">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    <select
      :id="id"
      :class="selectClasses"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="getOptionValue(option)"
        :value="getOptionValue(option)"
      >
        {{ getOptionLabel(option) }}
      </option>
    </select>
    <div v-if="error" class="invalid-feedback d-block">{{ error }}</div>
  </div>
</template>

<script>
export default {
  name: 'Select',
  props: {
    id: {
      type: String,
      default: () => `select-${Math.random().toString(36).substr(2, 9)}`
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    options: {
      type: Array,
      required: true
    },
    optionValue: {
      type: String,
      default: 'id'
    },
    optionLabel: {
      type: String,
      default: 'name'
    },
    placeholder: {
      type: String,
      default: 'Select an option'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  methods: {
    getOptionValue(option) {
      return typeof option === 'object' ? option[this.optionValue] : option
    },
    getOptionLabel(option) {
      return typeof option === 'object' ? option[this.optionLabel] : option
    }
  },
  computed: {
    selectClasses() {
      const classes = ['form-select']
      if (this.error) {
        classes.push('is-invalid')
      }
      return classes.join(' ')
    }
  }
}
</script>
