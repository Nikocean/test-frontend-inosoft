<template>
  <div>
    <Header />
    <div class="container-fluid">
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">Operation</li>
          <li class="breadcrumb-item">Yard Services</li>
          <li class="breadcrumb-item active">Create Yard Service</li>
        </ol>
      </nav>

      <div class="card">
        <div class="card-header bg-white">
          <h4 class="mb-0">Create Yard Services</h4>
        </div>

        <div class="card-body">
          <div v-if="dropdownLoading" class="text-center py-5">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading dropdowns...</span>
            </div>
          </div>
          
          <form v-else @submit.prevent="handleSubmit">
            <!-- Service Information -->
            <div class="row mb-4">
              <div class="col-md-6">
                <Select
                  v-model="form.serviceType"
                  label="Service Type"
                  :options="serviceTypes"
                  option-label="name"
                  option-value="id"
                  placeholder="Select Service Type"
                  required
                />
              </div>
              <div class="col-md-6">
                <div class="d-flex align-items-end gap-2">
                  <div class="flex-grow-1">
                    <Select
                      v-model="form.scopeOfWork"
                      label="Scope of Work"
                      :options="filteredScopeOfWorks"
                      option-label="name"
                      option-value="id"
                      placeholder="Select a Scope of Work Name"
                      required
                    />
                  </div>
                  <Button type="button" variant="outline-secondary">
                    <i class="bi bi-pencil"></i>
                  </Button>
                </div>
              </div>
            </div>

            <div class="row mb-4">
              <div class="col-md-6">
                <div class="d-flex align-items-center gap-3">
                  <span>Or</span>
                  <Button type="button" variant="outline-primary" @click="showCreateSOWModal = true">
                    + Create new SOW
                  </Button>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="form.chargeToCustomer"
                    id="chargeToCustomer"
                  />
                  <label class="form-check-label" for="chargeToCustomer">
                    Charge to Customer
                  </label>
                </div>
              </div>
            </div>

            <div class="row mb-4">
              <div class="col-md-6">
                <Input
                  v-model="form.status"
                  label="Status"
                  disabled
                  :model-value="'Draft'"
                />
              </div>
              <div class="col-md-6">
                <Select
                  v-model="form.customer"
                  label="Customer Name"
                  :options="customers"
                  option-label="name"
                  option-value="id"
                  placeholder="Select Customer Name"
                  :required="form.chargeToCustomer"
                />
              </div>
            </div>

            <!-- Scope Included -->
            <div class="mb-4">
              <label class="form-label">Scope included</label>
              <div class="d-flex gap-2 flex-wrap">
                <Button
                  v-for="scope in scopeIncluded"
                  :key="scope"
                  type="button"
                  :variant="selectedScopes.includes(scope) ? 'primary' : 'outline-primary'"
                  @click="toggleScope(scope)"
                >
                  {{ scope }}
                </Button>
              </div>
            </div>

            <div class="row mb-4">
              <div class="col-md-6">
                <Select
                  v-model="form.location"
                  label="Location"
                  :options="locations"
                  option-label="name"
                  option-value="id"
                  placeholder="Select Location"
                  required
                />
              </div>
              <div class="col-md-6">
                <Input
                  v-model="form.estimatedCompletionDate"
                  label="Estimated Completion Date"
                  type="date"
                  required
                />
              </div>
            </div>

            <div class="row mb-4">
              <div class="col-md-6">
                <Select
                  v-model="form.relatedTo"
                  label="Related To"
                  :options="relatedTo"
                  option-label="code"
                  option-value="id"
                  placeholder="Select Related To"
                />
              </div>
              <div class="col-md-6">
                <Input
                  v-model="form.dcCode"
                  label="D/C Code"
                  placeholder="Enter D/C Code"
                />
              </div>
            </div>

            <!-- Order Information -->
            <div class="mb-4">
              <h5 class="mb-3">Order Information</h5>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <Select
                    v-model="newItem.item"
                    :options="items"
                    option-label="description"
                    option-value="id"
                    :placeholder="items.length === 0 ? 'Loading items...' : 'Select an Item'"
                    :disabled="items.length === 0"
                    style="width: 300px;"
                  />
                </div>
                <div class="d-flex gap-2">
                  <span class="text-danger cursor-pointer" @click="deleteSelectedItems">Delete</span>
                  <Button type="button" variant="primary" @click="addItem">
                    + Add Item
                  </Button>
                </div>
              </div>

              <div class="table-responsive">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th width="30">
                        <input
                          type="checkbox"
                          @change="toggleSelectAll"
                          :checked="allItemsSelected"
                        />
                      </th>
                      <th>Item Description</th>
                      <th>Lot Selection</th>
                      <th>Allocation</th>
                      <th>Owner</th>
                      <th>Condition</th>
                      <th colspan="2" class="text-center">Qty</th>
                      <th>Inspection Required</th>
                      <th width="50"></th>
                    </tr>
                    <tr>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th>Avail. Qty</th>
                      <th>Qty Required</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(item, itemIndex) in form.items" :key="itemIndex">
                      <tr v-for="(lot, lotIndex) in item.lots" :key="lotIndex">
                        <td v-if="lotIndex === 0" :rowspan="item.lots.length">
                          <input
                            type="checkbox"
                            v-model="item.selected"
                          />
                        </td>
                        <td v-if="lotIndex === 0" :rowspan="item.lots.length">
                          {{ item.itemDescription }}
                        </td>
                        <td>
                          <div class="d-flex gap-1">
                            <Button
                              v-if="item.lots.length > 1"
                              type="button"
                              variant="outline-danger"
                              size="sm"
                              @click="removeLot(itemIndex, lotIndex)"
                            >
                              ×
                            </Button>
                            <Select
                              v-model="lot.lot"
                              :options="getFilteredLots(lot)"
                              option-label="lotNo"
                              option-value="lotNo"
                              placeholder="Search lot..."
                              style="min-width: 150px;"
                              @update:modelValue="onLotChange(itemIndex, lotIndex, $event)"
                            />
                          </div>
                        </td>
                        <td>
                          <Select
                            v-model="lot.allocation"
                            :options="getFilteredAllocations(lot)"
                            placeholder="Search allocation..."
                            style="min-width: 120px;"
                          />
                        </td>
                        <td>
                          <Select
                            v-model="lot.owner"
                            :options="getFilteredOwners(lot)"
                            placeholder="Search owner..."
                            style="min-width: 120px;"
                          />
                        </td>
                        <td>
                          <Select
                            v-model="lot.condition"
                            :options="getFilteredConditions(lot)"
                            placeholder="Search condition..."
                            style="min-width: 150px;"
                          />
                        </td>
                        <td>
                          <Input
                            v-model="lot.availableQty"
                            type="number"
                            disabled
                          />
                        </td>
                        <td>
                          <Input
                            v-model="lot.qtyRequired"
                            type="number"
                            placeholder="Enter Qty"
                            required
                          />
                        </td>
                        <td class="text-center">
                          <input
                            type="checkbox"
                            v-model="lot.inspectionRequired"
                          />
                        </td>
                        <td>
                          <div class="d-flex gap-1">
                            <Button
                              v-if="lotIndex === item.lots.length - 1"
                              type="button"
                              variant="outline-primary"
                              size="sm"
                              @click="addLot(itemIndex)"
                            >
                              +
                            </Button>
                            <Button
                              v-if="lotIndex === item.lots.length - 1 && item.lots.length === 1"
                              type="button"
                              variant="outline-danger"
                              size="sm"
                              @click="removeItem(itemIndex)"
                            >
                              🗑
                            </Button>
                          </div>
                        </td>
                      </tr>
                    </template>
                    <tr v-if="form.items.length === 0">
                      <td :colspan="10" class="text-center text-muted py-3">
                        No items added. Select an item and click "Add Item" to start.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Note to Yard -->
            <div class="mb-4">
              <Textarea
                v-model="form.noteToYard"
                label="Note to Yard"
                placeholder="Enter Note"
                :rows="4"
              />
            </div>

            <!-- Action Buttons -->
            <div class="d-flex justify-content-end gap-2">
              <Button type="button" variant="outline-secondary" @click="handleCancel">
                Cancel
              </Button>
              <Button type="button" variant="outline-primary" @click="saveDraft">
                Save as Draft
              </Button>
              <Button type="submit" variant="primary">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Create New SOW Modal -->
    <div v-if="showCreateSOWModal" class="modal fade show" style="display: block;" tabindex="-1" @click.self="showCreateSOWModal = false">
      <div class="modal-dialog">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h5 class="modal-title">Create New Scope of Work</h5>
            <button type="button" class="btn-close" @click="showCreateSOWModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">SOW Name</label>
              <input
                v-model="newSOW.name"
                type="text"
                class="form-control"
                placeholder="Enter SOW Name"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Select Scopes</label>
              <div class="d-flex flex-column gap-2">
                <div v-for="scope in availableScopes" :key="scope" class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :value="scope"
                    :id="`scope-${scope}`"
                    v-model="newSOW.scopes"
                  />
                  <label class="form-check-label" :for="`scope-${scope}`">
                    {{ scope }}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <Button type="button" variant="outline-secondary" @click="showCreateSOWModal = false">
              Cancel
            </Button>
            <Button type="button" variant="primary" @click="createNewSOW">
              Create SOW
            </Button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showCreateSOWModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Header from '@/components/organisms/Header.vue'
import Button from '@/components/atoms/Button.vue'
import Input from '@/components/atoms/Input.vue'
import Select from '@/components/atoms/Select.vue'
import Textarea from '@/components/atoms/Textarea.vue'

export default {
  name: 'CreateInspection',
  components: {
    Header,
    Button,
    Input,
    Select,
    Textarea
  },
  data() {
    return {
      form: {
        serviceType: '',
        scopeOfWork: '',
        chargeToCustomer: true,
        status: 'Draft',
        customer: '',
        location: '',
        estimatedCompletionDate: '',
        relatedTo: '',
        dcCode: '',
        items: [],
        noteToYard: ''
      },
      selectedScopes: [],
      newItem: {
        item: '',
        lot: '',
        allocation: '',
        owner: '',
        condition: '',
        availableQty: 0,
        qtyRequired: '',
        inspectionRequired: false
      },
      showCreateSOWModal: false,
      newSOW: {
        name: '',
        scopes: []
      },
      availableScopes: [
        'Visual Thread',
        'Visual Body',
        'Full Length Drift',
        'End Drift',
        'Magnetic Particle',
        'Thread Gauging',
        'Hardness Check',
        'Ultrasonic',
        'Penetrant Check',
        'Coating'
      ]
    }
  },
  computed: {
    ...mapGetters('dropdown', [
      'serviceTypes',
      'scopeOfWorks',
      'customers',
      'locations',
      'relatedTo',
      'items',
      'lots',
      'allocations',
      'owners',
      'conditions',
      'loading'
    ]),
    dropdownLoading() {
      return this.loading
    },
    filteredScopeOfWorks() {
      if (!this.form.serviceType) return this.scopeOfWorks
      const serviceType = this.serviceTypes.find(st => st.id === this.form.serviceType)
      if (!serviceType) return this.scopeOfWorks
      return this.scopeOfWorks.filter(sow => sow.serviceType === serviceType.name)
    },
    scopeIncluded() {
      if (!this.form.scopeOfWork) return []
      const sow = this.scopeOfWorks.find(s => s.id === this.form.scopeOfWork)
      return sow ? sow.scopes : []
    },
    allItemsSelected() {
      return this.form.items.length > 0 && this.form.items.every(item => item.selected)
    }
  },
  watch: {
    'form.scopeOfWork'(newVal) {
      if (newVal) {
        const sow = this.scopeOfWorks.find(s => s.id === newVal)
        this.selectedScopes = sow ? sow.scopes : []
      } else {
        this.selectedScopes = []
      }
    }
  },
  async mounted() {
    // Ensure dropdowns are loaded
    if (this.serviceTypes.length === 0) {
      await this.fetchAllDropdowns()
    }
    console.log('CreateInspection mounted - Dropdown data:', {
      serviceTypes: this.serviceTypes.length,
      scopeOfWorks: this.scopeOfWorks.length,
      customers: this.customers.length,
      locations: this.locations.length,
      items: this.items.length
    })
  },
  methods: {
    ...mapActions('dropdown', ['fetchAllDropdowns']),
    ...mapActions('inspection', ['createInspection']),
    toggleScope(scope) {
      const index = this.selectedScopes.indexOf(scope)
      if (index > -1) {
        this.selectedScopes.splice(index, 1)
      } else {
        this.selectedScopes.push(scope)
      }
    },
    addItem() {
      if (!this.newItem.item) {
        alert('Please select an item first')
        return
      }
      
      // Try to find item by comparing both string and number
      const itemId = this.newItem.item
      const item = this.items.find(i => {
        // Compare as both string and number
        return i.id == itemId || i.id === itemId || String(i.id) === String(itemId)
      })
      
      if (!item) {
        alert('Item not found. Please select a valid item.')
        console.error('Item not found:', {
          selectedItemId: this.newItem.item,
          selectedItemIdType: typeof this.newItem.item,
          availableItems: this.items,
          itemsLength: this.items.length
        })
        return
      }
      
      this.form.items.push({
        itemId: this.newItem.item,
        itemCode: item.code || '',
        itemDescription: item.description || item.item_desc || 'No description',
        selected: false,
        lots: [{
          lot: '',
          allocation: '',
          owner: '',
          condition: '',
          availableQty: 0,
          qtyRequired: '',
          inspectionRequired: false
        }]
      })
      
      // Reset newItem form
      this.newItem = {
        item: '',
        lot: '',
        allocation: '',
        owner: '',
        condition: '',
        availableQty: 0,
        qtyRequired: '',
        inspectionRequired: false
      }
    },
    removeItem(index) {
      this.form.items.splice(index, 1)
    },
    addLot(itemIndex) {
      this.form.items[itemIndex].lots.push({
        lot: '',
        allocation: '',
        owner: '',
        condition: '',
        availableQty: 0,
        qtyRequired: '',
        inspectionRequired: false
      })
    },
    removeLot(itemIndex, lotIndex) {
      if (this.form.items[itemIndex].lots.length > 1) {
        this.form.items[itemIndex].lots.splice(lotIndex, 1)
      }
    },
    onLotChange(itemIndex, lotIndex, lotNo) {
      const lot = this.lots.find(l => l.lotNo === lotNo)
      if (lot) {
        const lotItem = this.form.items[itemIndex].lots[lotIndex]
        lotItem.allocation = lot.allocation
        lotItem.owner = lot.owner
        lotItem.condition = lot.condition
        lotItem.availableQty = lot.availableQty
      }
    },
    getFilteredLots(lot) {
      const filters = {
        allocation: lot.allocation,
        owner: lot.owner,
        condition: lot.condition
      }
      return this.$store.getters['dropdown/getFilteredLots'](filters)
    },
    getFilteredAllocations(lot) {
      const filters = {
        lot: lot.lot,
        owner: lot.owner
      }
      const filtered = this.$store.getters['dropdown/getFilteredAllocations'](filters)
      return filtered.map(alloc => ({ id: alloc, name: alloc }))
    },
    getFilteredOwners(lot) {
      const filters = {
        lot: lot.lot,
        allocation: lot.allocation
      }
      const filtered = this.$store.getters['dropdown/getFilteredOwners'](filters)
      return filtered.map(owner => ({ id: owner, name: owner }))
    },
    getFilteredConditions(lot) {
      const filters = {
        lot: lot.lot,
        allocation: lot.allocation,
        owner: lot.owner
      }
      const filtered = this.$store.getters['dropdown/getFilteredConditions'](filters)
      return filtered.map(cond => ({ id: cond, name: cond }))
    },
    toggleSelectAll(event) {
      const checked = event.target.checked
      this.form.items.forEach(item => {
        item.selected = checked
      })
    },
    deleteSelectedItems() {
      this.form.items = this.form.items.filter(item => !item.selected)
    },
    createNewSOW() {
      if (!this.newSOW.name || this.newSOW.scopes.length === 0) {
        alert('Please enter SOW name and select at least one scope')
        return
      }

      // Create new SOW object
      const newSOWId = Math.max(...this.scopeOfWorks.map(s => s.id), 0) + 1
      const newSOWObject = {
        id: newSOWId,
        name: this.newSOW.name,
        serviceType: this.serviceTypes.find(st => st.id === this.form.serviceType)?.name || 'Inspection',
        scopes: [...this.newSOW.scopes]
      }

      // Add to scopeOfWorks (in real app, this would be saved to backend)
      this.$store.commit('dropdown/SET_SCOPE_OF_WORKS', [...this.scopeOfWorks, newSOWObject])

      // Set the newly created SOW as selected
      this.form.scopeOfWork = newSOWId
      this.selectedScopes = [...this.newSOW.scopes]

      // Reset modal
      this.newSOW = {
        name: '',
        scopes: []
      }
      this.showCreateSOWModal = false

      alert('New SOW created successfully!')
    },
    async handleSubmit() {
      try {
        // Format items data properly
        const formattedItems = this.form.items.map(item => {
          const firstLot = item.lots[0]
          return {
            itemId: item.itemId,
            itemDescription: item.itemDescription,
            lotNo: firstLot.lot,
            allocation: firstLot.allocation,
            owner: firstLot.owner,
            condition: firstLot.condition,
            qtyRequired: parseInt(firstLot.qtyRequired) || 0,
            inspectionRequired: firstLot.inspectionRequired
          }
        })

        const inspectionData = {
          serviceType: this.serviceTypes.find(st => st.id === this.form.serviceType)?.name || '',
          scopeOfWork: this.scopeOfWorks.find(sow => sow.id === this.form.scopeOfWork)?.name || '',
          chargeToCustomer: this.form.chargeToCustomer,
          customer: this.form.chargeToCustomer ? (this.customers.find(c => c.id === this.form.customer)?.name || '') : '',
          location: this.locations.find(l => l.id === this.form.location)?.name || '',
          estimatedCompletionDate: this.form.estimatedCompletionDate,
          relatedTo: this.relatedTo.find(r => r.id === this.form.relatedTo)?.code || '',
          dcCode: this.form.dcCode,
          items: formattedItems,
          noteToYard: this.form.noteToYard,
          scopeIncluded: this.selectedScopes,
          status: 'New'
        }
        const inspection = await this.createInspection(inspectionData)
        this.$router.push(`/inspections/${inspection._id || inspection.no}`)
      } catch (error) {
        alert('Error creating inspection: ' + error.message)
      }
    },
    async saveDraft() {
      try {
        const formattedItems = this.form.items.map(item => {
          const firstLot = item.lots[0]
          return {
            itemId: item.itemId,
            itemDescription: item.itemDescription,
            lotNo: firstLot.lot,
            allocation: firstLot.allocation,
            owner: firstLot.owner,
            condition: firstLot.condition,
            qtyRequired: parseInt(firstLot.qtyRequired) || 0,
            inspectionRequired: firstLot.inspectionRequired
          }
        })

        const inspectionData = {
          serviceType: this.serviceTypes.find(st => st.id === this.form.serviceType)?.name || '',
          scopeOfWork: this.scopeOfWorks.find(sow => sow.id === this.form.scopeOfWork)?.name || '',
          chargeToCustomer: this.form.chargeToCustomer,
          customer: this.form.chargeToCustomer ? (this.customers.find(c => c.id === this.form.customer)?.name || '') : '',
          location: this.locations.find(l => l.id === this.form.location)?.name || '',
          estimatedCompletionDate: this.form.estimatedCompletionDate,
          relatedTo: this.relatedTo.find(r => r.id === this.form.relatedTo)?.code || '',
          dcCode: this.form.dcCode,
          items: formattedItems,
          noteToYard: this.form.noteToYard,
          scopeIncluded: this.selectedScopes,
          status: 'Draft'
        }
        await this.createInspection(inspectionData)
        this.$router.push('/inspections')
      } catch (error) {
        alert('Error saving draft: ' + error.message)
      }
    },
    handleCancel() {
      if (confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
        this.$router.push('/inspections')
      }
    }
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
