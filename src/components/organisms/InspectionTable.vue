<template>
  <div class="table-responsive">
    <table class="table table-hover">
      <thead>
        <tr>
          <TableHeader
            v-for="column in columns"
            :key="column.key"
            :label="column.label"
            :sortable="column.sortable"
            :sort-key="column.key"
            :sort-direction="getSortDirection(column.key)"
            @sort="handleSort"
          />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(inspection, index) in filteredInspections"
          :key="inspection._id || inspection.no"
          @click="$emit('row-click', inspection)"
          class="cursor-pointer"
        >
          <td>{{ inspection.no }}</td>
          <td>{{ inspection.yardName || inspection.yard }}</td>
          <td>
            {{ getScopeOfWork(inspection) }}
            <i class="bi bi-info-circle ms-1 text-info"></i>
          </td>
          <td>{{ inspection.insp_type || inspection.type || 'Reg Prep' }}</td>
          <td>{{ formatDate(inspection.createdate) }}</td>
          <td>{{ formatDate(inspection.createdate + (4 * 24 * 60 * 60)) }}</td>
          <td>{{ inspection.customer?.customer_ref || '-' }}</td>
          <td>
            {{ inspection.total_lisi || 0 }}
            <i class="bi bi-chevron-down ms-1"></i>
          </td>
          <td>
            <StatusBadge :status="inspection.status" />
          </td>
        </tr>
        <tr v-if="filteredInspections.length === 0">
          <td :colspan="columns.length" class="text-center text-muted py-4">
            No inspections found
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td :colspan="columns.length" class="text-muted small">
            {{ filteredInspections.length }} Entries Displayed
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import TableHeader from '@/components/molecules/TableHeader.vue'
import StatusBadge from '@/components/molecules/StatusBadge.vue'

export default {
  name: 'InspectionTable',
  components: {
    TableHeader,
    StatusBadge
  },
  props: {
    inspections: {
      type: Array,
      required: true
    },
    searchQuery: {
      type: String,
      default: ''
    }
  },
  emits: ['row-click'],
  data() {
    return {
      sortKey: '',
      sortDirection: '',
      columns: [
        { key: 'requestNo', label: 'Request No.', sortable: true },
        { key: 'location', label: 'Location', sortable: true },
        { key: 'scopeOfWork', label: 'Scope of Work', sortable: true },
        { key: 'type', label: 'Type', sortable: true },
        { key: 'dateSubmitted', label: 'Date Submitted', sortable: true },
        { key: 'ecd', label: 'ECD', sortable: true },
        { key: 'relatedTo', label: 'Related To', sortable: true },
        { key: 'thirdParty', label: '3rd Party', sortable: true },
        { key: 'status', label: 'Status', sortable: true }
      ]
    }
  },
  computed: {
    filteredInspections() {
      let filtered = [...this.inspections]

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(inspection => {
          return (
            inspection.no?.toLowerCase().includes(query) ||
            inspection.yardName?.toLowerCase().includes(query) ||
            this.getScopeOfWork(inspection)?.toLowerCase().includes(query) ||
            inspection.customer?.customer_ref?.toLowerCase().includes(query)
          )
        })
      }

      // Apply sorting
      if (this.sortKey) {
        filtered.sort((a, b) => {
          let aVal = a[this.sortKey]
          let bVal = b[this.sortKey]
          
          // Handle special fields
          if (this.sortKey === 'requestNo') {
            aVal = a.no
            bVal = b.no
          } else if (this.sortKey === 'location') {
            aVal = a.yardName || a.yard
            bVal = b.yardName || b.yard
          } else if (this.sortKey === 'scopeOfWork') {
            aVal = this.getScopeOfWork(a)
            bVal = this.getScopeOfWork(b)
          } else if (this.sortKey === 'dateSubmitted') {
            aVal = a.createdate
            bVal = b.createdate
          } else if (this.sortKey === 'relatedTo') {
            aVal = a.customer?.customer_ref || ''
            bVal = b.customer?.customer_ref || ''
          }
          
          if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1
          if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1
          return 0
        })
      }

      return filtered
    }
  },
  methods: {
    handleSort(key) {
      if (this.sortKey === key) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortKey = key
        this.sortDirection = 'asc'
      }
    },
    getSortDirection(key) {
      return this.sortKey === key ? this.sortDirection : ''
    },
    getScopeOfWork(inspection) {
      return inspection.sow?.[0]?.template_name || 'Untitled SOW'
    },
    formatDate(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })
    }
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  background-color: #f8f9fa;
}
</style>
