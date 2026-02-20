<template>
  <Badge :variant="statusVariant">
    {{ status }}
  </Badge>
</template>

<script>
import Badge from '@/components/atoms/Badge.vue'

export default {
  name: 'StatusBadge',
  components: {
    Badge
  },
  props: {
    status: {
      type: String,
      required: true
    }
  },
  computed: {
    statusVariant() {
      const statusMap = {
        'New': 'primary',
        'In Progress': 'info',
        'Ready to Review': 'warning',
        'Completed': 'success',
        'Draft': 'secondary'
      }
      return statusMap[this.status] || 'secondary'
    }
  }
}
</script>
