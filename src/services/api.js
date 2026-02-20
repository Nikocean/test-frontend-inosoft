import axios from 'axios'

// Mock API service - in real app, this would point to Laravel/Lumen backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Mock data generators
const generateMockData = () => {
  const serviceTypes = [
    { id: 1, name: 'New Arrival' },
    { id: 2, name: 'Maintenance' },
    { id: 3, name: 'On Spot' }
  ]

  const scopeOfWorks = [
    {
      id: 1,
      name: 'Untitled SOW',
      serviceType: 'Inspection',
      scopes: ['Visual Thread', 'Visual Body', 'Full Length Drift']
    },
    {
      id: 2,
      name: 'Standard Inspection',
      serviceType: 'Inspection',
      scopes: ['Visual Thread', 'Visual Body']
    },
    {
      id: 3,
      name: 'Full Inspection',
      serviceType: 'Inspection',
      scopes: ['Visual Thread', 'Visual Body', 'Full Length Drift', 'End Drift']
    }
  ]

  const customers = [
    { id: 1, name: 'PT Santosa' },
    { id: 2, name: 'MITME' },
    { id: 3, name: 'OFFSHORE' },
    { id: 4, name: 'ADNOC' }
  ]

  const locations = [
    { id: 1, name: 'Moomba' },
    { id: 2, name: 'MHPC' },
    { id: 3, name: 'Yard A' },
    { id: 4, name: 'Yard B' }
  ]

  const relatedTo = [
    { id: 1, code: 'CO-02023-001', name: 'Contract Order 001' },
    { id: 2, code: 'CO-02023-002', name: 'Contract Order 002' },
    { id: 3, code: 'PO-2024-00457', name: 'Purchase Order 00457' }
  ]

  const items = [
    {
      id: 1,
      code: 'ITM001278',
      description: 'Casing 13 3/8", 68 PPF, L80, JFELION, R3, Coated'
    },
    {
      id: 2,
      code: 'ITM001279',
      description: '5 1/2", 17 PPF, JFE-13CR-80, PSL1, TSH BLUE, R3'
    },
    {
      id: 3,
      code: 'ITM001280',
      description: 'Cross Over 5 1/2", 23. PPF, P110CY, BC, BOX'
    }
  ]

  const lots = [
    { lotNo: 'MMT30624701', allocation: 'PT Santosa', owner: 'MITO', condition: 'Good', availableQty: 100 },
    { lotNo: 'MMT30624702', allocation: 'PT Santosa', owner: 'MITO', condition: 'Good', availableQty: 50 },
    { lotNo: 'MMT30624703', allocation: 'Unallocated', owner: 'OFFSHORE', condition: 'Good', availableQty: 200 },
    { lotNo: 'MMT30624704', allocation: 'PT Santosa', owner: 'MITO', condition: 'Quarantine (QR-100-0001)', availableQty: 25 }
  ]

  const allocations = ['PT Santosa', 'Unallocated', 'MITME', 'OFFSHORE']
  const owners = ['MITO', 'OFFSHORE', 'PT Santosa']
  const conditions = ['Good', 'Quarantine (QR-100-0001)', 'Damaged', 'Repaired']

  return {
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
  }
}

const mockData = generateMockData()

// Generate mock inspections based on fe-datatest.json format
const generateMockInspections = () => {
  const statuses = ['New', 'In Progress', 'Ready to Review', 'Completed']
  const inspections = []
  const now = Math.floor(Date.now() / 1000)

  for (let i = 1; i <= 20; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    const createdate = Math.floor(date.getTime() / 1000)
    const ecdDate = new Date(date.getTime() + 4 * 24 * 60 * 60 * 1000)
    
    const customer = mockData.customers[Math.floor(Math.random() * mockData.customers.length)]
    const location = mockData.locations[Math.floor(Math.random() * mockData.locations.length)]
    const item = mockData.items[Math.floor(Math.random() * mockData.items.length)]
    const lot = mockData.lots[Math.floor(Math.random() * mockData.lots.length)]
    
    const inspectionNo = `REQ-2021-${String(i).padStart(4, '0')}`
    
    // Generate items_raw based on fe-datatest.json format
    const itemsRaw = [
      {
        id_item: `62972983244a9372244224${String(i).padStart(2, '0')}`,
        item_code: item.code,
        item_desc: item.description,
        batch: `PO-2024-00457-A-RR-${i}`,
        original_batch: `PO-2024-00457-A-RR-${i}`,
        condition: lot.condition.toLowerCase(),
        owned: '5e49e7e48ac96a718736e3f2',
        locked: '5e49e7e48ac96a718736e3f2',
        allocation: lot.allocation,
        tag: null,
        qty: Math.floor(Math.random() * 100) + 1,
        id_quarantine: lot.condition.includes('Quarantine') ? `QR-100-000${i}` : null,
        customer_item_no: `15001300690${i}`,
        owned_name: lot.owner,
        locked_name: lot.owner,
        item_type: '0',
        item_type_name: 'Casing',
        item_pipe_family: 'OCTG',
        inspected_qty: status === 'Completed' ? Math.floor(Math.random() * 50) + 1 : 0,
        balance: 0,
        inprogress_qty: status === 'In Progress' ? Math.floor(Math.random() * 50) + 1 : 0
      }
    ]

    // Generate SOW based on fe-datatest.json format
    const selectedSOW = mockData.scopeOfWorks[Math.floor(Math.random() * mockData.scopeOfWorks.length)]
    const sow = [
      {
        template: '5f17d801b0ae06193e5e3bd6',
        works: [
          {
            _id: '5d8a38e7e0bb337413523a86',
            subscope: '90f9b69fcbf8f390ac4d5e5928546de9006014a9',
            subscope_name: 'Inspection',
            fields: selectedSOW.scopes.map((scope, idx) => ({
              name: scope,
              type: 'checkbox',
              selected: true,
              value: scope,
              editableDescription: true,
              requiredDescription: false,
              drift_inspection: scope.includes('Drift'),
              _id: `field-${idx}-${i}`
            }))
          }
        ],
        template_name: selectedSOW.name,
        items: itemsRaw.map(item => ({ id_item: item.id_item }))
      }
    ]

    inspections.push({
      _id: `67f9540009889f1437009${String(i).padStart(3, '0')}`,
      no: inspectionNo,
      status: status,
      unit: 'FT',
      yard: location.id || `65b366808f07e83c4e7a4b2${i}`,
      appvwhen: status === 'Completed' ? createdate : null,
      appvwho: status === 'Completed' ? 'Eldhos Kunjukunju' : null,
      postingdate: status === 'Completed' ? createdate : null,
      createdate: createdate,
      type: '11',
      insp_type: 'Return Inspection',
      id_transfer: `6777a26f8a359a4f7c364c2${i}`,
      idtrans: null,
      screening_number: 1,
      items: [],
      carrier: null,
      arrivaldate: null,
      operatorName: null,
      operatorSign: null,
      action: null,
      notes: {
        initial: {
          msg: `Inspection for ${item.description}`,
          by: customer.name
        }
      },
      stages: [],
      batchaction: null,
      id_si: null,
      transfer_condition: null,
      works: [],
      tpi: '5e9ef269b1a73d755847ec7e',
      rack: null,
      template: null,
      useSow: null,
      drift_inspections: [],
      cancelReason: null,
      cancelDate: null,
      reserved_stock: [
        {
          locked: '5e49e7e48ac96a718736e3f2',
          allocation: lot.allocation,
          tag: null,
          qty: itemsRaw[0].qty
        }
      ],
      createid: '616fe3a5cdcaf435b626a33a',
      createwho: 'Eldhos Kunjukunju',
      updateid: null,
      updatewho: 'System Tubestream',
      customer: {
        customer: customer.id || '5e49e7e48ac96a718736e3f2',
        customer_ref: `ADNOC MR 1034518${i}`,
        name: customer.name
      },
      revision_no: 0,
      revision_date: now,
      imei: null,
      items_raw: itemsRaw,
      released_stock: status === 'Completed' ? itemsRaw.map(item => ({
        id_item: item.id_item,
        batch: item.batch,
        original_condition: item.condition,
        condition: item.condition,
        owned: item.owned,
        locked: item.locked,
        allocation: item.allocation,
        tag: null,
        qty: item.inspected_qty,
        id_screening: `67f9540009889f1437009${String(i).padStart(3, '0')}`
      })) : [],
      iwo: null,
      sow: sow,
      journaled: [],
      invoiced: null,
      invoicedwhen: null,
      invoicedwho: null,
      progress: status === 'Completed' ? 100.0 : status === 'In Progress' ? 50.0 : 0.0,
      yardName: location.name,
      linkTo: inspectionNo,
      tpiName: 'NOV Middle East Oil and Gas Wells Equipments and Devices L.L.C',
      total_lisi: 0,
      lisi: [],
      qty: 0,
      charges: customer ? [
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
      ] : []
    })
  }

  return inspections
}

const mockInspections = generateMockInspections()

const apiService = {
  // Dropdown data endpoints
  async getServiceTypes() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))
    return mockData.serviceTypes
  },

  async getScopeOfWorks() {
    await new Promise(resolve => setTimeout(resolve, 100))
    return mockData.scopeOfWorks
  },

  async getCustomers() {
    await new Promise(resolve => setTimeout(resolve, 100))
    return mockData.customers
  },

  async getLocations() {
    await new Promise(resolve => setTimeout(resolve, 100))
    return mockData.locations
  },

  async getRelatedTo() {
    await new Promise(resolve => setTimeout(resolve, 100))
    return mockData.relatedTo
  },

  async getItems() {
    await new Promise(resolve => setTimeout(resolve, 100))
    return mockData.items
  },

  async getLots() {
    await new Promise(resolve => setTimeout(resolve, 100))
    return mockData.lots
  },

  async getAllocations() {
    await new Promise(resolve => setTimeout(resolve, 100))
    return mockData.allocations
  },

  async getOwners() {
    await new Promise(resolve => setTimeout(resolve, 100))
    return mockData.owners
  },

  async getConditions() {
    await new Promise(resolve => setTimeout(resolve, 100))
    return mockData.conditions
  },

  // Inspection endpoints
  async getInspections() {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockInspections
  },

  async getInspectionById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const inspection = mockInspections.find(i => i._id === id || i.no === id)
    if (!inspection) {
      throw new Error('Inspection not found')
    }
    return inspection
  },

  async createInspection(data) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const now = Math.floor(Date.now() / 1000)
    const newNo = `REQ-2021-${String(mockInspections.length + 1).padStart(4, '0')}`
    const newId = `67f9540009889f1437009${String(mockInspections.length + 1).padStart(3, '0')}`
    
    // Convert items to items_raw format
    const itemsRaw = (data.items || []).map((item, idx) => {
      // Use lotNo as batch, or find from lots if lotNo is provided
      const lot = item.lotNo ? mockData.lots.find(l => l.lotNo === item.lotNo) : null
      const batch = item.lotNo || (lot ? lot.lotNo : `BATCH-${idx + 1}`)
      
      return {
        id_item: `62972983244a9372244224${String(idx + 1).padStart(2, '0')}`,
        item_code: item.itemCode || 'ITM001278',
        item_desc: item.itemDescription,
        batch: batch,
        original_batch: batch,
        condition: (item.condition?.toLowerCase() || 'good'),
        owned: '5e49e7e48ac96a718736e3f2',
        locked: '5e49e7e48ac96a718736e3f2',
        allocation: item.allocation || 'Unallocated',
        tag: null,
        qty: item.qtyRequired || 0,
        id_quarantine: item.condition?.includes('Quarantine') ? `QR-100-000${idx + 1}` : null,
        customer_item_no: `15001300690${idx + 1}`,
        owned_name: item.owner || 'OFFSHORE',
        locked_name: item.owner || 'OFFSHORE',
        item_type: '0',
        item_type_name: 'Casing',
        item_pipe_family: 'OCTG',
        inspected_qty: 0,
        balance: 0,
        inprogress_qty: 0
      }
    })

    // Convert scope included to SOW format
    const selectedSOW = mockData.scopeOfWorks.find(sow => sow.name === data.scopeOfWork) || mockData.scopeOfWorks[0]
    const sow = [
      {
        template: '5f17d801b0ae06193e5e3bd6',
        works: [
          {
            _id: '5d8a38e7e0bb337413523a86',
            subscope: '90f9b69fcbf8f390ac4d5e5928546de9006014a9',
            subscope_name: 'Inspection',
            fields: (data.scopeIncluded || []).map((scope, idx) => ({
              name: scope,
              type: 'checkbox',
              selected: true,
              value: scope,
              editableDescription: true,
              requiredDescription: false,
              drift_inspection: scope.includes('Drift'),
              _id: `field-${idx}-${mockInspections.length + 1}`
            }))
          }
        ],
        template_name: data.scopeOfWork || 'Untitled SOW',
        items: itemsRaw.map(item => ({ id_item: item.id_item }))
      }
    ]

    const customer = mockData.customers.find(c => c.name === data.customer) || mockData.customers[0]
    const location = mockData.locations.find(l => l.name === data.location) || mockData.locations[0]
    
    const newInspection = {
      _id: newId,
      no: newNo,
      status: data.status || 'New',
      unit: 'FT',
      yard: location.id || '65b366808f07e83c4e7a4b23',
      appvwhen: null,
      appvwho: null,
      postingdate: null,
      createdate: now,
      type: '11',
      insp_type: 'Return Inspection',
      id_transfer: null,
      idtrans: null,
      screening_number: 1,
      items: [],
      carrier: null,
      arrivaldate: null,
      operatorName: null,
      operatorSign: null,
      action: null,
      notes: {
        initial: {
          msg: data.noteToYard || '',
          by: customer.name
        }
      },
      stages: [],
      batchaction: null,
      id_si: null,
      transfer_condition: null,
      works: [],
      tpi: '5e9ef269b1a73d755847ec7e',
      rack: null,
      template: null,
      useSow: null,
      drift_inspections: [],
      cancelReason: null,
      cancelDate: null,
      reserved_stock: itemsRaw.map(item => ({
        locked: item.locked,
        allocation: item.allocation,
        tag: null,
        qty: item.qty
      })),
      createid: '616fe3a5cdcaf435b626a33a',
      createwho: 'System User',
      updateid: null,
      updatewho: null,
      customer: {
        customer: customer.id || '5e49e7e48ac96a718736e3f2',
        customer_ref: data.customer || '',
        name: customer.name
      },
      revision_no: 0,
      revision_date: now,
      imei: null,
      items_raw: itemsRaw,
      released_stock: [],
      iwo: null,
      sow: sow,
      journaled: [],
      invoiced: null,
      invoicedwhen: null,
      invoicedwho: null,
      progress: 0.0,
      yardName: location.name,
      linkTo: newNo,
      tpiName: 'NOV Middle East Oil and Gas Wells Equipments and Devices L.L.C',
      total_lisi: 0,
      lisi: [],
      qty: 0,
      charges: customer && data.chargeToCustomer ? [
        {
          orderNo: '00-001',
          serviceDescription: 'SERV-001 Inspection',
          qty: '5 PCS',
          unitPrice: 'USD $5.00',
          total: 'USD $25.00'
        }
      ] : []
    }
    
    mockInspections.unshift(newInspection)
    return newInspection
  }
}

export default apiService
