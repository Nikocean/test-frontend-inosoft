import { mount } from '@vue/test-utils'
import StatusBadge from '../StatusBadge.vue'

describe('StatusBadge.vue', () => {
  it('renders status badge with New status', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'New'
      }
    })
    
    expect(wrapper.text()).toBe('New')
    expect(wrapper.findComponent({ name: 'Badge' }).props('variant')).toBe('primary')
  })

  it('renders status badge with Completed status', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'Completed'
      }
    })
    
    expect(wrapper.text()).toBe('Completed')
    expect(wrapper.findComponent({ name: 'Badge' }).props('variant')).toBe('success')
  })

  it('renders status badge with Ready to Review status', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'Ready to Review'
      }
    })
    
    expect(wrapper.text()).toBe('Ready to Review')
    expect(wrapper.findComponent({ name: 'Badge' }).props('variant')).toBe('warning')
  })
})
