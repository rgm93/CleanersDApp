//
// Listing is the main object exposed by Origin Protocol to access listing data.
//
export class Listing {
  /**
   * Listing object model.
   *
   * @param {Object} args - single object arguments used to construct a Listing
   *  - {string} id
   *  - {string} title
   *  - {string} description
   *  - {string} category
   *  - {Object} commission - consists of 'amount' and 'currency' properties
   *  - {string} subCategory
   *  - {string} status - 'active', 'inactive'
   *  - {string} type - 'unit', 'fractional'
   *  - {int} unitsTotal
   *  - {Object} offers
   *  - {Array<Object>} events
   *  - {string} ipfsHash
   *  - {Object} ipfs
   *  - {string} language
   *  - {Object} price - consists of 'amount' and 'currency' properties
   *  - {string} seller - address of the seller
   *  - {string} display - 'normal', 'featured', 'hidden'
   *  - {Array<Object>} media
   *  - {Object} comission - consists of 'amount' and 'currency' properties
   *  - {Array} slots - to be implemented
   *  - {string} schemaId
   *  - {string} expiry
   *  - {string} deposit
   *  - {string} depositManager - address of depositManager
   */
  constructor({ id, title, display, description, category, subCategory, propertyList, postalCode, datetime, 
    frequency, startDate, hours, haveProducts, nif, phone, zone, city, status, type, media,
    unitsTotal, offers, events, ipfs, ipfsHash, language, price, seller, commission, slots,
    schemaId, deposit, depositManager, expiry, commissionPerUnit }) {

    this.id = id
    this.title = title
    this.description = description
    this.category = category
    this.subCategory = subCategory
    this.propertyList = propertyList
    this.postalCode = postalCode,
    this.datetime = datetime,
    this.frequency = frequency,
    this.startDate = startDate,
    this.hours = hours,
    this.haveProducts = haveProducts,
    this.nif = nif,
    this.phone = phone,
    this.zone = zone,
    this.city = city,
    this.status = status
    this.type = type
    this.unitsTotal = unitsTotal
    this.offers = offers
    this.events = events
    this.ipfs = ipfs
    this.ipfsHash = ipfsHash
    this.language = language
    this.price = price
    this.seller = seller
    this.display = display
    this.media = media
    this.commission = commission
    this.slots = slots
    this.schemaId = schemaId
    this.deposit = deposit
    this.depositManager = depositManager
    this.expiry = expiry
    this.commissionPerUnit = commissionPerUnit
  }

  // creates a Listing using on-chain and off-chain data
  static init(id, chainListing, ipfsListing) {
    return new Listing({
      id: id,
      title: ipfsListing.title,
      description: ipfsListing.description,
      category: ipfsListing.category,
      subCategory: ipfsListing.subCategory,
      propertyList: ipfsListing.propertyList,
      postalCode: ipfsListing.postalCode,
      datetime: ipfsListing.datetime,
      frequency: ipfsListing.frequency,
      startDate: ipfsListing.startDate,
      hours: ipfsListing.hours,
      haveProducts: ipfsListing.haveProducts,
      nif: ipfsListing.nif,
      phone: ipfsListing.phone,
      zone: ipfsListing.zone,
      city: ipfsListing.city,
      status: chainListing.status,
      type: ipfsListing.type,
      unitsTotal: ipfsListing.unitsTotal,
      offers: chainListing.offers,
      events: chainListing.events,
      ipfs: ipfsListing.ipfs,
      ipfsHash: chainListing.ipfsHash,
      language: ipfsListing.language,
      price: ipfsListing.price,
      seller: chainListing.seller,
      // hidden/featured listings information is supplied only by discovery server
      display: 'normal',
      media: ipfsListing.media,
      commission: ipfsListing.commission,
      slots: ipfsListing.slots,
      schemaId: ipfsListing.schemaId,
      deposit: chainListing.deposit,
      depositManager: chainListing.depositManager,
      commissionPerUnit: ipfsListing.commissionPerUnit,
    })
  }

  // creates a Listing from Discovery's Apollo schema
  static initFromDiscovery(discoveryNodeData) {
    return new Listing({
      id: discoveryNodeData.id,
      title: discoveryNodeData.title,
      description: discoveryNodeData.description,
      category: discoveryNodeData.category,
      subCategory: discoveryNodeData.subCategory,
      propertyList: discoveryNodeData.propertyList,
      postalCode: discoveryNodeData.postalCode,
      datetime: discoveryNodeData.datetime,
      frequency: discoveryNodeData.frequency,
      startDate: discoveryNodeData.startDate,
      hours: discoveryNodeData.hours,
      haveProducts: discoveryNodeData.haveProducts,
      nif: discoveryNodeData.nif,
      phone: discoveryNodeData.phone,
      zone: discoveryNodeData.zone,
      city: discoveryNodeData.city,
      status: discoveryNodeData.status,
      type: discoveryNodeData.type,
      unitsTotal: discoveryNodeData.unitsTotal,
      offers: discoveryNodeData.offers,
      events: discoveryNodeData.events,
      ipfs: discoveryNodeData.ipfs,
      ipfsHash: discoveryNodeData.ipfsHash,
      language: discoveryNodeData.language,
      price: discoveryNodeData.price,
      seller: discoveryNodeData.seller,
      display: discoveryNodeData.display,
      media: discoveryNodeData.media,
      commission: discoveryNodeData.commission,
      slots: discoveryNodeData.slots,
      schemaId: discoveryNodeData.schemaId,
      deposit: discoveryNodeData.deposit,
      depositManager: discoveryNodeData.depositManager,
      commissionPerUnit: discoveryNodeData.commissionPerUnit,
    })
  }

  get active() {
    return this.status === 'active'
  }
}
