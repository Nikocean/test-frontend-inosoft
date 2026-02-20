import { createStore } from 'vuex'
import inspectionModule from './modules/inspection'
import dropdownModule from './modules/dropdown'

export default createStore({
  modules: {
    inspection: inspectionModule,
    dropdown: dropdownModule
  }
})
