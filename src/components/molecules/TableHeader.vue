<template>
  <th :class="headerClasses" @click="handleSort">
    {{ label }}
    <span v-if="sortable" class="ms-2">
      <i v-if="sortDirection === 'asc'" class="bi bi-arrow-up"></i>
      <i v-else-if="sortDirection === 'desc'" class="bi bi-arrow-down"></i>
      <i v-else class="bi bi-arrow-up-down text-muted"></i>
    </span>
  </th>
</template>

<script>
export default {
  name: 'TableHeader',
  props: {
    label: {
      type: String,
      required: true
    },
    sortable: {
      type: Boolean,
      default: false
    },
    sortKey: {
      type: String,
      default: ''
    },
    sortDirection: {
      type: String,
      default: '',
      validator: (value) => ['', 'asc', 'desc'].includes(value)
    }
  },
  emits: ['sort'],
  methods: {
    handleSort() {
      if (this.sortable) {
        this.$emit('sort', this.sortKey)
      }
    }
  },
  computed: {
    headerClasses() {
      const classes = []
      if (this.sortable) {
        classes.push('cursor-pointer')
      }
      return classes.join(' ')
    }
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
  user-select: none;
}

.cursor-pointer:hover {
  background-color: #f8f9fa;
}
</style>
