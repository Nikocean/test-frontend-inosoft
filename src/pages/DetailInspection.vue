<template>
  <div>
    <Header />
    <div class="container-fluid">
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <a href="#" @click.prevent="$router.push('/inspections')">Operation</a>
          </li>
          <li class="breadcrumb-item">Yard Services</li>
          <li class="breadcrumb-item active">Yard Services Details</li>
        </ol>
      </nav>

      <div class="d-flex justify-content-between align-items-center mb-3">
        <Button variant="outline-secondary" @click="$router.push('/inspections')">
          <i class="bi bi-arrow-left"></i> Back
        </Button>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="inspection" class="card">
        <!-- Yard Services Details -->
        <div class="card-header bg-white">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h4 class="mb-0">Yard Services Details</h4>
            </div>
            <div class="d-flex gap-2">
              <div class="dropdown">
                <Button variant="outline-secondary" data-bs-toggle="dropdown">
                  Export / Share Document <i class="bi bi-chevron-down"></i>
                </Button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Export PDF</a></li>
                  <li><a class="dropdown-item" href="#">Share via Email</a></li>
                </ul>
              </div>
              <Button variant="outline-primary" @click="handleModify">Modify</Button>
              <Button variant="outline-danger" @click="handleTerminate">Terminate</Button>
            </div>
          </div>
        </div>

        <div class="card-body">
          <div class="row mb-4">
            <div class="col-md-3">
              <strong>Request No.:</strong>
              <div>{{ inspection.no }}</div>
            </div>
            <div class="col-md-3">
              <strong>Service Type:</strong>
              <div>{{ inspection.insp_type || inspection.type || '-' }}</div>
            </div>
            <div class="col-md-3">
              <strong>Location:</strong>
              <div>{{ inspection.yardName || inspection.yard || '-' }}</div>
            </div>
            <div class="col-md-3">
              <strong>Date Submitted:</strong>
              <div>{{ formatDate(inspection.createdate) }}</div>
            </div>
          </div>

          <div class="row mb-4">
            <div class="col-md-3">
              <strong>Estimated Completion Date:</strong>
              <div>{{ formatDate(inspection.createdate + (4 * 24 * 60 * 60)) }}</div>
            </div>
            <div class="col-md-3">
              <strong>Related To:</strong>
              <div>
                <a href="#">{{ inspection.customer?.customer_ref || '-' }}</a>
              </div>
            </div>
            <div class="col-md-3">
              <strong>Customer:</strong>
              <div>{{ inspection.customer?.name || '-' }}</div>
            </div>
            <div class="col-md-3">
              <strong>Charge to customer:</strong>
              <div>{{ inspection.customer?.name || 'No' }}</div>
            </div>
          </div>

          <div class="row mb-4">
            <div class="col-md-3">
              <strong>Status:</strong>
              <div>
                <StatusBadge :status="inspection.status" />
              </div>
            </div>
          </div>

          <!-- Scope Of Work -->
          <div class="mb-4">
            <h5 class="mb-3">Scope Of Work</h5>
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>Service Type</th>
                    <th>Scope Name</th>
                    <th>Scope Description</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="scopeOfWorkDetails">
                    <tr v-for="(work, workIndex) in scopeOfWorkDetails.works" :key="workIndex">
                      <td>{{ workIndex === 0 ? 'Inspection' : '' }}</td>
                      <td>{{ work.subscope_name }}</td>
                      <td>
                        <div v-for="(field, fieldIndex) in work.fields" :key="fieldIndex">
                          <span v-if="field.selected">{{ field.name }}</span>
                        </div>
                      </td>
                    </tr>
                  </template>
                  <tr v-else>
                    <td colspan="3" class="text-center text-muted">No scope of work defined</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Item Information -->
          <div class="mb-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="mb-0">Item Information</h5>
              <Button variant="primary" @click="handleAddChanges">+ Add Changes</Button>
            </div>
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>Item No.</th>
                    <th>Item Description</th>
                    <th>Lot No.</th>
                    <th>Allocation</th>
                    <th>Owner</th>
                    <th>Condition</th>
                    <th>Requested (PCS, MT)</th>
                    <th>Pending (PCS, MT)</th>
                    <th>Completed (PCS, MT)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in inspection.items_raw" :key="index">
                    <td>{{ item.item_code }}</td>
                    <td class="text-truncate" style="max-width: 300px;">{{ item.item_desc }}</td>
                    <td>{{ item.batch }}</td>
                    <td>{{ item.allocation }}</td>
                    <td>{{ item.owned_name }}</td>
                    <td>
                      <Badge v-if="item.id_quarantine" variant="success">
                        Quarantine ({{ item.id_quarantine }})
                      </Badge>
                      <span v-else>{{ item.condition }}</span>
                    </td>
                    <td>
                      <div>{{ item.qty }} {{ inspection.unit || 'PCS' }}</div>
                    </td>
                    <td>
                      <div>{{ item.inprogress_qty }} {{ inspection.unit || 'PCS' }}</div>
                    </td>
                    <td>
                      <div>{{ item.inspected_qty }} {{ inspection.unit || 'PCS' }}</div>
                    </td>
                  </tr>
                  <tr v-if="!inspection.items_raw || inspection.items_raw.length === 0">
                    <td colspan="9" class="text-center text-muted py-3">No items found</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Charges to Customer -->
          <div v-if="shouldShowCharges" class="mb-4">
            <h5 class="mb-3">Charges to Customer</h5>
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>Order No</th>
                    <th>Service Description</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="charges && charges.length > 0" v-for="(charge, index) in charges" :key="index">
                    <td>{{ charge.orderNo }}</td>
                    <td>{{ charge.serviceDescription }}</td>
                    <td>{{ charge.qty }}</td>
                    <td>{{ charge.unitPrice }}</td>
                    <td>{{ charge.total }}</td>
                  </tr>
                  <tr v-else>
                    <td colspan="5" class="text-center text-muted py-3">
                      No charges available
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="alert alert-danger">
        Inspection not found
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Header from '@/components/organisms/Header.vue'
import Button from '@/components/atoms/Button.vue'
import StatusBadge from '@/components/molecules/StatusBadge.vue'
import Badge from '@/components/atoms/Badge.vue'

export default {
  name: 'DetailInspection',
  components: {
    Header,
    Button,
    StatusBadge,
    Badge
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters('inspection', ['getInspectionById', 'loading']),
    inspection() {
      return this.getInspectionById(this.id) || this.$store.state.inspection.currentInspection
    },
    scopeOfWorkDetails() {
      if (!this.inspection || !this.inspection.sow || this.inspection.sow.length === 0) return null
      return this.inspection.sow[0]
    },
    shouldShowCharges() {
      return this.inspection && this.inspection.customer && this.inspection.customer.name
    },
    charges() {
      if (!this.inspection) return []
      // Check if inspection has charges data
      if (this.inspection.charges && Array.isArray(this.inspection.charges)) {
        return this.inspection.charges
      }
      // Generate mock charges if customer exists
      if (this.inspection.customer && this.inspection.customer.name) {
        return [
          {
            orderNo: '00-001',
            serviceDescription: 'SERV-001 Inspection',
            qty: '5 PCS',
            unitPrice: 'USD $5.00',
            total: 'USD $25.00'
          },
          {
            orderNo: '00-002',
            serviceDescription: 'SERV-002 Inspection',
            qty: '2 PCS',
            unitPrice: 'USD $5.00',
            total: 'USD $10.00'
          }
        ]
      }
      return []
    }
  },
  async mounted() {
    if (!this.inspection) {
      await this.fetchInspectionById(this.id)
    }
  },
  methods: {
    ...mapActions('inspection', ['fetchInspectionById']),
    formatDate(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })
    },
    handleModify() {
      if (!this.inspection) return
      
      // Check if inspection can be modified (only Draft, New, or In Progress)
      if (this.inspection.status === 'Completed') {
        alert('Cannot modify completed inspection')
        return
      }
      
      // Redirect to create page with inspection data for editing
      this.$router.push({
        path: '/inspections/create',
        query: { edit: this.inspection._id || this.inspection.no }
      })
    },
    handleTerminate() {
      if (!this.inspection) return
      
      if (confirm(`Are you sure you want to terminate inspection ${this.inspection.no}?`)) {
        // In real app, this would call API to terminate inspection
        alert('Inspection termination feature would be implemented here. In production, this would call the backend API to terminate the inspection.')
        console.log('Terminate inspection:', this.inspection._id || this.inspection.no)
      }
    },
    handleAddChanges() {
      if (!this.inspection) return
      
      // In real app, this would open a modal or navigate to add changes page
      alert('Add Changes feature would be implemented here. In production, this would open a modal or navigate to a page to add changes to the inspection.')
      console.log('Add changes to inspection:', this.inspection._id || this.inspection.no)
    }
  }
}
</script>

<style scoped>
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
