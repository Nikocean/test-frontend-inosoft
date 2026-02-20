import apiService from '@/services/api'

const state = {
  serviceTypes: [],
  scopeOfWorks: [],
  customers: [],
  locations: [],
  relatedTo: [],
  items: [],
  lots: [],
  allocations: [],
  owners: [],
  conditions: [],
  loading: false,
  error: null
}

const mutations = {
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  SET_SERVICE_TYPES(state, data) {
    state.serviceTypes = data
  },
  SET_SCOPE_OF_WORKS(state, data) {
    state.scopeOfWorks = data
  },
  SET_CUSTOMERS(state, data) {
    state.customers = data
  },
  SET_LOCATIONS(state, data) {
    state.locations = data
  },
  SET_RELATED_TO(state, data) {
    state.relatedTo = data
  },
  SET_ITEMS(state, data) {
    state.items = data
  },
  SET_LOTS(state, data) {
    state.lots = data
  },
  SET_ALLOCATIONS(state, data) {
    state.allocations = data
  },
  SET_OWNERS(state, data) {
    state.owners = data
  },
  SET_CONDITIONS(state, data) {
    state.conditions = data
  }
}

const actions = {
  async fetchAllDropdowns({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const [
        serviceTypes,
        scopeOfWorks,
        customers,
        locations,
        relatedTo,
        items,
        lots,
        allocations,
        owners,
        conditions
      ] = await Promise.all([
        apiService.getServiceTypes(),
        apiService.getScopeOfWorks(),
        apiService.getCustomers(),
        apiService.getLocations(),
        apiService.getRelatedTo(),
        apiService.getItems(),
        apiService.getLots(),
        apiService.getAllocations(),
        apiService.getOwners(),
        apiService.getConditions()
      ])

      commit('SET_SERVICE_TYPES', serviceTypes)
      commit('SET_SCOPE_OF_WORKS', scopeOfWorks)
      commit('SET_CUSTOMERS', customers)
      commit('SET_LOCATIONS', locations)
      commit('SET_RELATED_TO', relatedTo)
      commit('SET_ITEMS', items)
      commit('SET_LOTS', lots)
      commit('SET_ALLOCATIONS', allocations)
      commit('SET_OWNERS', owners)
      commit('SET_CONDITIONS', conditions)
      
      console.log('Dropdown data loaded:', {
        serviceTypes: serviceTypes.length,
        scopeOfWorks: scopeOfWorks.length,
        customers: customers.length,
        locations: locations.length,
        items: items.length
      })
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching dropdowns:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  serviceTypes: (state) => state.serviceTypes,
  scopeOfWorks: (state) => state.scopeOfWorks,
  customers: (state) => state.customers,
  locations: (state) => state.locations,
  relatedTo: (state) => state.relatedTo,
  items: (state) => state.items,
  lots: (state) => state.lots,
  allocations: (state) => state.allocations,
  owners: (state) => state.owners,
  conditions: (state) => state.conditions,
  loading: (state) => state.loading,
  error: (state) => state.error,
  
  getFilteredLots: (state) => (filters = {}) => {
    let filtered = [...state.lots]
    
    if (filters.allocation) {
      filtered = filtered.filter(lot => lot.allocation === filters.allocation)
    }
    if (filters.owner) {
      filtered = filtered.filter(lot => lot.owner === filters.owner)
    }
    if (filters.condition) {
      filtered = filtered.filter(lot => lot.condition === filters.condition)
    }
    
    return filtered
  },
  
  getFilteredAllocations: (state) => (filters = {}) => {
    let filtered = [...state.allocations]
    
    if (filters.lot) {
      const lot = state.lots.find(l => l.lotNo === filters.lot)
      if (lot) {
        filtered = filtered.filter(alloc => alloc === lot.allocation)
      }
    } else if (filters.owner) {
      const matchingLots = state.lots.filter(l => l.owner === filters.owner)
      const matchingAllocs = [...new Set(matchingLots.map(l => l.allocation))]
      filtered = filtered.filter(alloc => matchingAllocs.includes(alloc))
    }
    
    return filtered
  },
  
  getFilteredOwners: (state) => (filters = {}) => {
    let filtered = [...state.owners]
    
    if (filters.lot) {
      const lot = state.lots.find(l => l.lotNo === filters.lot)
      if (lot) {
        filtered = filtered.filter(owner => owner === lot.owner)
      }
    } else if (filters.allocation) {
      const matchingLots = state.lots.filter(l => l.allocation === filters.allocation)
      const matchingOwners = [...new Set(matchingLots.map(l => l.owner))]
      filtered = filtered.filter(owner => matchingOwners.includes(owner))
    }
    
    return filtered
  },
  
  getFilteredConditions: (state) => (filters = {}) => {
    let filtered = [...state.conditions]
    
    if (filters.lot) {
      const lot = state.lots.find(l => l.lotNo === filters.lot)
      if (lot) {
        filtered = filtered.filter(cond => cond === lot.condition)
      }
    } else if (filters.allocation) {
      const matchingLots = state.lots.filter(l => l.allocation === filters.allocation)
      const matchingConditions = [...new Set(matchingLots.map(l => l.condition))]
      filtered = filtered.filter(cond => matchingConditions.includes(cond))
    } else if (filters.owner) {
      const matchingLots = state.lots.filter(l => l.owner === filters.owner)
      const matchingConditions = [...new Set(matchingLots.map(l => l.condition))]
      filtered = filtered.filter(cond => matchingConditions.includes(cond))
    }
    
    return filtered
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
