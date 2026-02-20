<template>
  <div>
    <Header />
    <div class="container-fluid">
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">Quality & HSE</li>
          <li class="breadcrumb-item">Inspection</li>
          <li class="breadcrumb-item active">Inspection Record</li>
        </ol>
      </nav>

      <div class="card">
        <div class="card-header bg-white">
          <div class="d-flex justify-content-between align-items-center">
            <h4 class="mb-0">Inspection Record</h4>
            <div class="d-flex gap-2">
              <div class="input-group" style="width: 300px;">
                <SearchInput
                  v-model="searchQuery"
                  placeholder="Search inspections..."
                />
              </div>
              <Button variant="outline-secondary">Export</Button>
              <Button variant="primary" @click="goToCreate">
                <i class="bi bi-plus"></i> Create Request
              </Button>
            </div>
          </div>
        </div>

        <div class="card-body">
          <ul class="nav nav-tabs mb-3">
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{ active: activeTab === 'Open' }"
                @click.prevent="activeTab = 'Open'"
                href="#"
              >
                Open
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{ active: activeTab === 'For Review' }"
                @click.prevent="activeTab = 'For Review'"
                href="#"
              >
                For Review
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{ active: activeTab === 'Completed' }"
                @click.prevent="activeTab = 'Completed'"
                href="#"
              >
                Completed
              </a>
            </li>
          </ul>

          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <InspectionTable
            v-else
            :inspections="filteredInspections"
            :search-query="searchQuery"
            @row-click="goToDetail"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Header from '@/components/organisms/Header.vue'
import InspectionTable from '@/components/organisms/InspectionTable.vue'
import SearchInput from '@/components/molecules/SearchInput.vue'
import Button from '@/components/atoms/Button.vue'

export default {
  name: 'ListInspection',
  components: {
    Header,
    InspectionTable,
    SearchInput,
    Button
  },
  data() {
    return {
      activeTab: 'Open',
      searchQuery: ''
    }
  },
  computed: {
    ...mapGetters('inspection', ['inspectionsByStatus']),
    ...mapGetters('inspection', ['loading']),
    filteredInspections() {
      return this.inspectionsByStatus(this.activeTab)
    }
  },
  async mounted() {
    await this.fetchInspections()
  },
  methods: {
    ...mapActions('inspection', ['fetchInspections']),
    goToCreate() {
      this.$router.push('/inspections/create')
    },
    goToDetail(inspection) {
      this.$router.push(`/inspections/${inspection._id || inspection.no}`)
    }
  }
}
</script>

<style scoped>
.nav-link {
  cursor: pointer;
}
</style>
