import apiService from '@/services/api'

const state = {
  inspections: [],
  currentInspection: null,
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
  SET_INSPECTIONS(state, inspections) {
    state.inspections = inspections
  },
  ADD_INSPECTION(state, inspection) {
    state.inspections.unshift(inspection)
  },
  UPDATE_INSPECTION(state, inspection) {
    const index = state.inspections.findIndex(i => i._id === inspection._id || i.no === inspection.no)
    if (index !== -1) {
      state.inspections.splice(index, 1, inspection)
    }
  },
  SET_CURRENT_INSPECTION(state, inspection) {
    state.currentInspection = inspection
  }
}

const actions = {
  async fetchInspections({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const inspections = await apiService.getInspections()
      commit('SET_INSPECTIONS', inspections)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async fetchInspectionById({ commit }, id) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const inspection = await apiService.getInspectionById(id)
      commit('SET_CURRENT_INSPECTION', inspection)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async createInspection({ commit }, inspectionData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const inspection = await apiService.createInspection(inspectionData)
      commit('ADD_INSPECTION', inspection)
      return inspection
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  inspectionsByStatus: (state) => (status) => {
    if (status === 'Open') {
      return state.inspections.filter(i => 
        i.status === 'New' || i.status === 'In Progress'
      )
    } else if (status === 'For Review') {
      return state.inspections.filter(i => i.status === 'Ready to Review')
    } else if (status === 'Completed') {
      return state.inspections.filter(i => i.status === 'Completed')
    }
    return []
  },
  
  getInspectionById: (state) => (id) => {
    return state.inspections.find(i => i._id === id || i.no === id) || state.currentInspection
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
