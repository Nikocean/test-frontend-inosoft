<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'outline-primary', 'outline-secondary'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    type: {
      type: String,
      default: 'button'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  computed: {
    buttonClasses() {
      const classes = ['btn']
      
      if (this.variant.startsWith('outline-')) {
        classes.push(`btn-outline-${this.variant.replace('outline-', '')}`)
      } else {
        classes.push(`btn-${this.variant}`)
      }
      
      if (this.size !== 'md') {
        classes.push(`btn-${this.size}`)
      }
      
      return classes.join(' ')
    }
  }
}
</script>
