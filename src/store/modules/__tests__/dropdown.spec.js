// Mock apiService to avoid hitting real implementation (which uses import.meta)
jest.mock('@/services/api', () => ({
  __esModule: true,
  default: {
    getServiceTypes: jest.fn(),
    getScopeOfWorks: jest.fn(),
    getCustomers: jest.fn(),
    getLocations: jest.fn(),
    getRelatedTo: jest.fn(),
    getItems: jest.fn(),
    getLots: jest.fn(),
    getAllocations: jest.fn(),
    getOwners: jest.fn(),
    getConditions: jest.fn()
  }
}))

import { createStore } from 'vuex'
import dropdownModule from '../dropdown'

describe('dropdown store module', () => {
  let store

  beforeEach(() => {
    store = createStore({
      modules: {
        dropdown: dropdownModule
      }
    })
  })

  it('initializes with empty state', () => {
    expect(store.state.dropdown.serviceTypes).toEqual([])
    expect(store.state.dropdown.scopeOfWorks).toEqual([])
    expect(store.state.dropdown.customers).toEqual([])
    expect(store.state.dropdown.loading).toBe(false)
  })

  it('sets service types', () => {
    const serviceTypes = [
      { id: 1, name: 'New Arrival' },
      { id: 2, name: 'Maintenance' }
    ]
    store.commit('dropdown/SET_SERVICE_TYPES', serviceTypes)
    expect(store.state.dropdown.serviceTypes).toEqual(serviceTypes)
  })

  it('filters lots based on allocation', () => {
    const lots = [
      { lotNo: 'LOT1', allocation: 'PT Santosa', owner: 'MITO', condition: 'Good' },
      { lotNo: 'LOT2', allocation: 'Unallocated', owner: 'OFFSHORE', condition: 'Good' },
      { lotNo: 'LOT3', allocation: 'PT Santosa', owner: 'MITO', condition: 'Good' }
    ]
    store.commit('dropdown/SET_LOTS', lots)
    
    const filtered = store.getters['dropdown/getFilteredLots']({ allocation: 'PT Santosa' })
    expect(filtered).toHaveLength(2)
    expect(filtered.every(lot => lot.allocation === 'PT Santosa')).toBe(true)
  })

  it('filters lots based on multiple criteria', () => {
    const lots = [
      { lotNo: 'LOT1', allocation: 'PT Santosa', owner: 'MITO', condition: 'Good' },
      { lotNo: 'LOT2', allocation: 'PT Santosa', owner: 'OFFSHORE', condition: 'Good' },
      { lotNo: 'LOT3', allocation: 'PT Santosa', owner: 'MITO', condition: 'Damaged' }
    ]
    store.commit('dropdown/SET_LOTS', lots)
    
    const filtered = store.getters['dropdown/getFilteredLots']({
      allocation: 'PT Santosa',
      owner: 'MITO'
    })
    expect(filtered).toHaveLength(2)
    expect(filtered.every(lot => lot.allocation === 'PT Santosa' && lot.owner === 'MITO')).toBe(true)
  })
})
