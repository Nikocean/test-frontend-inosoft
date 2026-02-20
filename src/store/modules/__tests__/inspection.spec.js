// Mock apiService to avoid hitting real implementation (which uses import.meta)
jest.mock('@/services/api', () => ({
  __esModule: true,
  default: {
    getInspections: jest.fn(),
    getInspectionById: jest.fn(),
    createInspection: jest.fn()
  }
}))

import { createStore } from 'vuex'
import inspectionModule from '../inspection'

describe('inspection store module', () => {
  let store

  beforeEach(() => {
    store = createStore({
      modules: {
        inspection: inspectionModule
      }
    })
  })

  it('initializes with empty state', () => {
    expect(store.state.inspection.inspections).toEqual([])
    expect(store.state.inspection.currentInspection).toBeNull()
    expect(store.state.inspection.loading).toBe(false)
    expect(store.state.inspection.error).toBeNull()
  })

  it('sets loading state', () => {
    store.commit('inspection/SET_LOADING', true)
    expect(store.state.inspection.loading).toBe(true)
  })

  it('sets inspections', () => {
    const inspections = [
      { id: '1', status: 'New' },
      { id: '2', status: 'Completed' }
    ]
    store.commit('inspection/SET_INSPECTIONS', inspections)
    expect(store.state.inspection.inspections).toEqual(inspections)
  })

  it('adds new inspection', () => {
    const inspection = { id: '1', status: 'New' }
    store.commit('inspection/ADD_INSPECTION', inspection)
    expect(store.state.inspection.inspections).toContainEqual(inspection)
  })

  it('filters inspections by status - Open', () => {
    const inspections = [
      { id: '1', status: 'New' },
      { id: '2', status: 'In Progress' },
      { id: '3', status: 'Completed' }
    ]
    store.commit('inspection/SET_INSPECTIONS', inspections)
    
    const openInspections = store.getters['inspection/inspectionsByStatus']('Open')
    expect(openInspections).toHaveLength(2)
    expect(openInspections.map(i => i.status)).toEqual(['New', 'In Progress'])
  })

  it('filters inspections by status - Completed', () => {
    const inspections = [
      { id: '1', status: 'New' },
      { id: '2', status: 'Completed' },
      { id: '3', status: 'Completed' }
    ]
    store.commit('inspection/SET_INSPECTIONS', inspections)
    
    const completedInspections = store.getters['inspection/inspectionsByStatus']('Completed')
    expect(completedInspections).toHaveLength(2)
    expect(completedInspections.every(i => i.status === 'Completed')).toBe(true)
  })
})
