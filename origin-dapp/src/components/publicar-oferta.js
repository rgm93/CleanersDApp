import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { Link, Prompt } from 'react-router-dom'
import { connect } from 'react-redux'
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl'
import Form from 'react-jsonschema-form'

import { showAlert } from 'actions/Alert'

import { handleNotificationsSubscription } from 'actions/Activation'
import { storeWeb3Intent } from 'actions/App'
import {
  update as updateTransaction,
  upsert as upsertTransaction
} from 'actions/Transaction'
import { getOgnBalance } from 'actions/Wallet'

import BoostSlider from 'components/boost-slider'
import PhotoPicker from 'components/form-widgets/photo-picker'
import PriceField from 'components/form-widgets/price-field'
import Modal from 'components/modal'
import Calendar from './calendar'

import { getListing, camelCaseToDash } from 'utils/listing'
import { prepareSlotsToSave } from 'utils/calendarHelpers'
import listingSchemaMetadata from 'utils/listingSchemaMetadata.js'
import WalletCard from 'components/wallet-card'
import { ProviderModal, ProcessingModal } from 'components/modals/wait-modals'

import { getBoostLevel, defaultBoostValue } from 'utils/boostUtils'
import { dappFormDataToOriginListing } from 'utils/listing'
import { getFiatPrice } from 'utils/priceUtils'
import { formattedAddress } from 'utils/user'

import {
  translateSchema,
  translateListingCategory
} from 'utils/translationUtils'

import origin from '../services/origin'

const { web3 } = origin.contractService
const enableFractional = process.env.ENABLE_FRACTIONAL === 'true'

class ListingCreateReserva extends Component {
  constructor(props) {
    super(props)

    this.STEP = {
      PICK_SCHEMA: 0,
      DETAILS: 1,
      AVAILABILITY: 2,
      BOOST: 3,
      PREVIEW: 4,
      METAMASK: 5,
      PROCESSING: 6,
      SUCCESS: 7,
      ERROR: 8
    }

    // TODO(John) - remove once fractional usage is enabled by default
    this.fractionalSchemaTypes = []

    if (enableFractional) {
      this.fractionalSchemaTypes = [
        'housing',
        'services'
      ]
    }

    const schemaTypeLabels = defineMessages({
      housing: {
        id: 'listing-create.housingLabelReserva',
        defaultMessage: 'Propiedad'
      },
      services: {
        id: 'listing-create.servicesReserva',
        defaultMessage: 'Oferta'
      }
    })

    this.schemaList = [
      {type: 'housing', name: props.intl.formatMessage(schemaTypeLabels.housing), img: 'housing.jpg'},
      {type: 'services', name: props.intl.formatMessage(schemaTypeLabels.services), img: 'services.jpg'},
    ]

    /*this.schemaList = listingSchemaMetadata.listingTypes.map(listingType => {
      listingType.name = props.intl.formatMessage(listingType.translationName)
      return listingType
    })*/

    this.defaultState = {
      step: this.STEP.PICK_SCHEMA,
      selectedBoostAmount: props.wallet.ognBalance ? defaultBoostValue : 0,
      selectedSchemaType: this.schemaList[1],
      translatedSchema: null,
      schemaExamples: null,
      schemaFetched: false,
      isFractionalListing: false,
      isEditMode: false,
      fractionalTimeIncrement: null,
      showNoSchemaSelectedError: false,
      formListing: {
        formData: {
          boostValue: defaultBoostValue,
          boostLevel: getBoostLevel(defaultBoostValue)
        }
      },
      showDetailsFormErrorMsg: false,
      showBoostTutorial: false
    }

    this.state = { ...this.defaultState }

    this.intlMessages = defineMessages({
      navigationWarning: {
        id: 'listing-create.navigationWarningReserva',
        defaultMessage:
          'Are you sure you want to leave? If you leave this page your progress will be lost.'
      }
    })

    this.checkOgnBalance = this.checkOgnBalance.bind(this)
    this.handleSchemaSelection = this.handleSchemaSelection.bind(this)
    this.onDetailsEntered = this.onDetailsEntered.bind(this)
    this.onAvailabilityEntered = this.onAvailabilityEntered.bind(this)
    this.backFromBoostStep = this.backFromBoostStep.bind(this)
    this.onBackToPickSchema = this.onBackToPickSchema.bind(this)
    this.onFormDataChange = this.onFormDataChange.bind(this)
    this.onReview = this.onReview.bind(this)
    this.pollOgnBalance = this.pollOgnBalance.bind(this)
    this.resetForm = this.resetForm.bind(this)
    this.resetToPreview = this.resetToPreview.bind(this)
    this.setBoost = this.setBoost.bind(this)
    this.ensureUserIsSeller = this.ensureUserIsSeller.bind(this)
  }

  static getDerivedStateFromProps(props, state){
    var schemaType = 'services';
    return Object.assign({}, state, {selectedSchemaType: schemaType });
  }

  async componentDidMount() {

    // If listingId prop is passed in, we're in edit mode, so fetch listing data
    /*if (this.props.listingId) {
      this.props.storeWeb3Intent('edit a listing')

      try {
        // Pass false as second param so category doesn't get translated
        // because the form only understands the category ID, not the translated phrase
        const listing = getListing(this.props.listingId, false)

        console.log("LISTING_DIDMOUNT: " + JSON.stringify(listing));
        this.ensureUserIsSeller(listing.seller)
        this.setState({
          formListing: {
            formData: listing
          },
          selectedSchemaType: 'services',
          selectedBoostAmount: listing.boostValue,
          isEditMode: true
        })

        console.log("FORMLISTING_DIDMOUNT: " + JSON.stringify(formListing));
        this.handleSchemaSelection(selectedSchemaType)
        this.setState({
          step: this.STEP.DETAILS,
        })
      } catch (error) {
        console.error(`Error fetching contract or IPFS info for listing: ${this.props.listingId}`)
        console.error(error)
      }
    } else if (!web3.givenProvider || !this.props.messagingEnabled) {
      if (!origin.contractService.walletLinker) {
        this.props.history.push('/')
      }
      this.props.storeWeb3Intent('create a listing')
    }*/

    this.handleSchemaSelection(this.state.selectedSchemaType);
    /*this.setState({
      step: this.STEP.DETAILS,
    });
    

    window.scrollTo(0, 0)*/
    
  }

  ensureUserIsSeller(sellerAccount) {
    const { wallet } = this.props

    if (
      wallet.address &&
      formattedAddress(wallet.address) !== formattedAddress(sellerAccount)) {
      alert('⚠️ Only the seller can update a listing')
      window.location.href = '/'
    }
  }

  componentDidUpdate(prevProps) {
    // conditionally show boost tutorial
    if (!this.state.showBoostTutorial) {
      this.detectNeedForBoostTutorial()
    }

    const { ognBalance } = this.props.wallet
    // apply OGN detection to slider
    if (ognBalance !== prevProps.wallet.ognBalance) {
      // only if prior to boost selection step
      this.state.step < this.STEP.BOOST &&
        this.setState({
          selectedBoostAmount: ognBalance ? defaultBoostValue : 0
        })
    }
  }

  /*componentWillUnmount() {
    clearInterval(this.ognBalancePoll)
  }*/

  detectNeedForBoostTutorial() {
    // show if 0 OGN and...
    !Number(this.props.wallet.ognBalance) &&
      // ...tutorial has not been expanded or skipped via "Review"
      // !JSON.parse(localStorage.getItem('boostTutorialViewed')) &&
      this.setState({
        showBoostTutorial: true
      })
  }

  pollOgnBalance() {
    this.ognBalancePoll = setInterval(() => {
      this.props.getOgnBalance()
    }, 10000)
  }

  handleSchemaSelection(selectedSchemaType) {
    const isFractionalListing = this.fractionalSchemaTypes.includes(selectedSchemaType)

    return fetch(`schemas/${selectedSchemaType}.json`)
      .then(response => response.json())
      .then(schemaJson => {

        schemaJson.properties.category.default = schemaJson.properties.category.enum[1];
        schemaJson.properties.category.enum = [schemaJson.properties.category.enum[1]];

        PriceField.defaultProps = {
          options: {
            selectedSchema: schemaJson
          }
        }

        this.uiSchema = {
          examples: {
            'ui:widget': 'hidden'
          },
          sellerSteps: {
            'ui:widget': 'hidden'
          },
          price: {
            'ui:field': PriceField
          },
          description: {
            'ui:widget': 'textarea',
            'ui:options': {
              rows: 4
            }
          },
          pictures: {
            'ui:widget': PhotoPicker
          }
        }

        if (isFractionalListing) {
          this.uiSchema.price = {
            'ui:widget': 'hidden'
          }
        }

        const translatedSchema = translateSchema(schemaJson, selectedSchemaType)

        console.log("TRANSLATEDSCHEMA: " + JSON.stringify(translatedSchema));

        this.setState({
          selectedSchemaType,
          schemaFetched: true,
          fractionalTimeIncrement: !isFractionalListing ? null :
            selectedSchemaType === 'housing' ? 'daily' : 'hourly',
          showNoSchemaSelectedError: false,
          translatedSchema,
          isFractionalListing,
          schemaExamples:
            translatedSchema &&
            translatedSchema.properties &&
            translatedSchema.properties.examples &&
            translatedSchema.properties.examples.enumNames
        })

        if (this.state.schemaFetched) {
          console.log("ENTRO");
          this.setState({
            step: this.STEP.DETAILS
          })
          window.scrollTo(0, 0)
        }
      })
  }

  goToDetailsStep() {
    if (this.state.schemaFetched) {
      this.setState({
        step: this.STEP.DETAILS
      })
      window.scrollTo(0, 0)
    } else {
      this.setState({
        showNoSchemaSelectedError: true
      })
    }
  }

  onAvailabilityEntered(slots, direction) {
    if (!slots || !slots.length) {
      return
    }

    let nextStep
    switch(direction) {
      case 'forward':
        this.state.isEditMode ?
          nextStep = 'PREVIEW' :
          nextStep = 'BOOST'
        break

      case 'back':
        nextStep = 'DETAILS'
        break
    }

    slots = prepareSlotsToSave(slots)

    this.setState({
      formListing: {
        ...this.state.formListing,
        formData: {
          ...this.state.formListing.formData,
          timeIncrement: this.state.fractionalTimeIncrement,
          slots
        }
      }
    })

    this.setState({
      step: this.STEP[nextStep]
    })
  }

  onBackToPickSchema() {
    this.setState({
      step: this.STEP.PICK_SCHEMA,
      selectedSchema: null,
      schemaFetched: false,
      formData: null
    })
    this.resetForm();
  }

  backFromBoostStep() {
    const previousStep = this.state.isFractionalListing ? this.STEP.AVAILABILITY : this.STEP.DETAILS
    this.setState({ step: previousStep })
  }

  onDetailsEntered(formListing) {
    const [nextStep, listingType] = this.state.isFractionalListing ?
      [this.STEP.AVAILABILITY, 'fractional'] :
      this.state.isEditMode ?
        [this.STEP.PREVIEW, 'unit'] :
        [this.STEP.BOOST, 'unit']

    formListing.formData.listingType = listingType

    this.setState({
      formListing: {
        ...this.state.formListing,
        ...formListing,
        formData: {
          ...this.state.formListing.formData,
          ...formListing.formData
        }
      },
      step: nextStep,
      showDetailsFormErrorMsg: false
    })

    console.log("ONDETAILSENTERED_FORM: " + JSON.stringify(formListing));
    window.scrollTo(0, 0)
    this.checkOgnBalance()
  }

  onFormDataChange({ formData }) {
    this.setState({
      formListing: {
        ...this.state.formListing,
        formData: {
          ...this.state.formListing.formData,
          ...formData
        }
      }
    })
  }

  checkOgnBalance() {
    if (
      this.props.wallet &&
      this.props.wallet.ognBalance &&
      parseFloat(this.props.wallet.ognBalance) > 0
    ) {
      this.setState({
        showBoostTutorial: false
      })
    }
  }

  setBoost(boostValue, boostLevel) {
    this.setState({
      formListing: {
        ...this.state.formListing,
        formData: {
          ...this.state.formListing.formData,
          boostValue,
          boostLevel
        }
      },
      selectedBoostAmount: boostValue
    })
  }

  onReview() {
    const { ognBalance } = this.props.wallet

    if (!localStorage.getItem('boostTutorialViewed')) {
      localStorage.setItem('boostTutorialViewed', true)
    }

    if (ognBalance < this.state.formListing.formData.boostValue) {
      this.setBoost(ognBalance, getBoostLevel(ognBalance))
    }

    this.setState({
      step: this.STEP.PREVIEW
    })

    window.scrollTo(0, 0)
  }

  async onSubmitListing(formListing) {
    const { isEditMode } = this.state

    try {
      this.setState({ step: this.STEP.METAMASK })
      const listing = dappFormDataToOriginListing(formListing.formData)
      const methodName = isEditMode ? 'updateListing' : 'createListing'
      let transactionReceipt
      if (isEditMode) {
        transactionReceipt = await origin.marketplace[methodName](
          this.props.listingId,
          listing,
          0, // TODO(John) - figure out how a seller would add "additional deposit"
          (confirmationCount, transactionReceipt) => {
            this.props.updateTransaction(confirmationCount, transactionReceipt)
          }
        )
      } else {
        transactionReceipt = await origin.marketplace[methodName](
          listing,
          (confirmationCount, transactionReceipt) => {
            this.props.updateTransaction(confirmationCount, transactionReceipt)
          }
        )
      }

      const transactionTypeKey = isEditMode ? 'updateListing' : 'createListing'

      this.props.upsertTransaction({
        ...transactionReceipt,
        transactionTypeKey
      })
      this.props.getOgnBalance()
      this.setState({ step: this.STEP.SUCCESS })
      this.props.handleNotificationsSubscription('seller', this.props)
    } catch (error) {
      console.error(error)
      this.setState({ step: this.STEP.ERROR })
    }
  }

  resetForm() {
    this.setState(this.defaultState)
  }

  resetToPreview(e) {
    e.preventDefault()

    this.setState({ step: this.STEP.PREVIEW })
  }

  render() {
    const { wallet, intl } = this.props
    const {
      formListing,
      fractionalTimeIncrement,
      selectedBoostAmount,
      selectedSchemaType,
      schemaExamples,
      showNoSchemaSelectedError,
      step,
      translatedSchema,
      showDetailsFormErrorMsg,
      showBoostTutorial,
      isFractionalListing,
      isEditMode
    } = this.state
    const { formData } = formListing
    const translatedCategory = translateListingCategory(formData.category)
    const translatedFrequency = translateListingCategory(formData.frequency)
    const translatedHaveProduct = translateListingCategory(formData.haveProducts)
    const usdListingPrice = getFiatPrice(formListing.formData.price, 'USD')

    return (web3.givenProvider || origin.contractService.walletLinker) ? (
      <div className="listing-form">
        <div className="step-container">
          <div className="row">
            {/*step === this.STEP.PICK_SCHEMA && (
              <div className="col-md-6 col-lg-5 pick-schema">
                <label>
                  <FormattedMessage
                    id={'listing-create.stepNumberLabelReserva'}
                    defaultMessage={'STEP {stepNumber}'}
                    values={{ stepNumber: Number(step) }}
                  />
                </label>
                <h2>
                  <FormattedMessage
                    id={'listing-create.whatTypeOfListingReserva'}
                    defaultMessage={
                      'What type of listing do you want to create?'
                    }
                  />
                </h2>
                <div className="schema-options">
                  {this.schemaList.map(schema => (
                    <div
                      className={`schema-selection${
                        selectedSchemaType === schema.type ? ' selected' : ''
                      }`}
                      key={schema.type}
                      onClick={() => this.handleSchemaSelection(schema.type)}
                      ga-category="create_listing"
                      ga-label={ `select_schema_${schema.type}`}
                    >
                      {schema.name}
                      <div
                        className={`schema-examples${
                          selectedSchemaType === schema.type ? ' selected' : ''
                        }`}
                      >
                        <p>
                          <FormattedMessage
                            id={'listing-create.listingsMayIncludeReserva'}
                            defaultMessage={
                              '{schemaName} listings may include:'
                            }
                            values={{ schemaName: schema.name }}
                          />
                        </p>
                        <ul>
                          {schemaExamples &&
                            schemaExamples.map(example => (
                              <li key={`${schema.name}-${example}`}>
                                {example}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                  {showNoSchemaSelectedError && (
                    <div className="info-box warn">
                      <p>
                        <FormattedMessage
                          id={'listing-create.noSchemaSelectedErrorReserva'}
                          defaultMessage={
                            'You must first select a listing type'
                          }
                        />
                      </p>
                    </div>
                  )}
                </div>
                <div className="btn-container">
                  <button
                    className="float-right btn btn-primary btn-listing-create"
                    onClick={() => this.goToDetailsStep()}
                    ga-category="create_listing"
                    ga-label="select_schema_step_continue"
                  >
                    <FormattedMessage
                      id={'listing-create.nextReserva'}
                      defaultMessage={'Next'}
                    />
                  </button>
                </div>
              </div>
            )*/}
            {step === this.STEP.DETAILS && (
              <div className="col-md-12 col-lg-12 schema-details">
                <label>
                  <FormattedMessage
                    id={'listing-create.stepNumberLabelReserva'}
                    defaultMessage={'STEP {stepNumber}'}
                    values={{ stepNumber: Number(step) }}
                  />
                </label>
                <h2>
                  <FormattedMessage
                    id={'listing-create.createListingHeadingReserva'}
                    defaultMessage={'Create Your Listing'}
                  />
                </h2>
                <Form
                  schema={translatedSchema}
                  onSubmit={this.onDetailsEntered}
                  formData={formListing.formData}
                  onError={() =>
                    this.setState({ showDetailsFormErrorMsg: true })
                  }
                  onChange={this.onFormDataChange}
                  uiSchema={this.uiSchema}
                >
                  {showDetailsFormErrorMsg && (
                    <div className="info-box warn">
                      <p>
                        <FormattedMessage
                          id={'listing-create.showDetailsFormErrorMsgReserva'}
                          defaultMessage={
                            'Please fix errors before continuing.'
                          }
                        />
                      </p>
                    </div>
                  )}
                  <div className="btn-container">
                    <button
                      type="submit"
                      className="float-right btn btn-primary btn-listing-create"
                      ga-category="create_listing"
                      ga-label="details_step_continue"
                    >
                      <FormattedMessage
                        id={'continueButtonLabelReserva'}
                        defaultMessage={'Continue'}
                      />
                    </button>
                  </div>
                </Form>
              </div>
            )}
            {step === this.STEP.AVAILABILITY &&
              <div className="col-md-12 listing-availability">
                <Calendar
                  slots={ formData && formData.slots }
                  userType="seller"
                  viewType={ fractionalTimeIncrement }
                  step={ 60 }
                  onComplete={ (slots) => this.onAvailabilityEntered(slots, 'forward') }
                  onGoBack={ (slots) => this.onAvailabilityEntered(slots, 'back') }
                />
              </div>
            }
            {step === this.STEP.BOOST && (
              <div className="col-md-6 col-lg-5 select-boost">
                <label>
                  <FormattedMessage
                    id={'listing-create.stepNumberLabelReserva'}
                    defaultMessage={'STEP {stepNumber}'}
                    values={{ stepNumber: Number(step) }}
                  />
                </label>
                <h2>
                  <FormattedMessage
                    id={'listing-create.boost-your-listingReserva'}
                    defaultMessage={'Boost Your Listing'}
                  />
                </h2>
                <p className="help-block">
                  <FormattedMessage
                    id={'listing-create.form-help-boostReserva'}
                    defaultMessage={
                      'You can boost your listing to get higher visibility in the Origin DApp. More buyers will see your listing, which increases the chances of a fast and successful sale.'
                    }
                  />
                </p>
                {showBoostTutorial && (
                  <div className="info-box">
                    <img src="images/ogn-icon-horiz.svg" role="presentation" />
                    <p className="text-bold">
                      <FormattedMessage
                        id={'listing-create.no-ognReserva'}
                        defaultMessage={'You have 0 {ogn} in your wallet.'}
                        values={{
                          ogn: (
                            <Link
                              to="/about-tokens"
                              target="_blank"
                              rel="noopener noreferrer"
                              ga-category="create_listing"
                              ga-label="boost_listing_step_ogn"
                            >
                              OGN
                            </Link>
                          )
                        }}
                      />
                    </p>
                    <p>
                      <FormattedMessage
                        id={'listing-create.post-acquisitionReserva'}
                        defaultMessage={
                          'Once you acquire some OGN you will be able to boost your listing.'
                        }
                      />
                    </p>
                    <div className="link-container">
                      <Link
                        to="/about-tokens"
                        target="_blank"
                        rel="noopener noreferrer"
                        ga-category="create_listing"
                        ga-label="boost_listing_step_learn_more"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                )}
                {!showBoostTutorial && (
                  <BoostSlider
                    onChange={this.setBoost}
                    ognBalance={wallet.ognBalance}
                    selectedBoostAmount={formData.boostValue || selectedBoostAmount}
                  />
                )}
                <div className="btn-container">
                  <button
                    type="button"
                    className="btn btn-other btn-listing-create"
                    onClick={this.backFromBoostStep}
                    ga-category="create_listing"
                    ga-label="boost_listing_step_back"
                  >
                    <FormattedMessage
                      id={'backButtonLabelReserva'}
                      defaultMessage={'Back'}
                    />
                  </button>
                  <button
                    className="float-right btn btn-primary btn-listing-create"
                    onClick={this.onReview}
                    ga-category="create_listing"
                    ga-label="boost_listing_step_continue"
                  >
                    <FormattedMessage
                      id={'listing-create.reviewReserva'}
                      defaultMessage={'Review'}
                    />
                  </button>
                </div>
              </div>
            )}
            {step >= this.STEP.PREVIEW && (
              <div className="col-md-12 col-lg-12 listing-preview">
                <label className="create-step">
                  <FormattedMessage
                    id={'listing-create.stepNumberLabelReserva'}
                    defaultMessage={'STEP {stepNumber}'}
                    values={{ stepNumber: Number(step) }}
                  />
                </label>
                <h2>
                  <FormattedMessage
                    id={'listing-create.reviewListingHeadingReserva'}
                    defaultMessage={'Review your listing'}
                  />
                </h2>
                <div className="preview">
                  <div className="row">
                    <div className="col-md-3">
                      <p className="label">
                        <FormattedMessage
                          id={'listing-create.titleReserva'}
                          defaultMessage={'Title'}
                        />
                      </p>
                    </div>
                    <div className="col-md-9">
                      <p>{formData.name}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <p className="label">
                        <FormattedMessage
                          id={'listing-create.descriptionReserva'}
                          defaultMessage={'Description'}
                        />
                      </p>
                    </div>
                    <div className="col-md-9">
                      <p className="ws-aware">{formData.description}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <p className="label">
                        <FormattedMessage
                          id={'listing-create.categoryReserva'}
                          defaultMessage={'Category'}
                        />
                      </p>
                    </div>
                    <div className="col-md-9">
                      <p>{translatedCategory}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <p className="label">
                        <FormattedMessage
                          id={'listing-create.postalCodeReserva'}
                          defaultMessage={'Código Postal'}
                        />
                      </p>
                    </div>
                    <div className="col-md-9">
                      <p>{formData.postalCode}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <p className="label">
                        <FormattedMessage
                          id={'listing-create.dateTimeReserva'}
                          defaultMessage={'Fecha del Servicio'}
                        />
                      </p>
                    </div>
                    <div className="col-md-9">
                      <p>{formData.datetime}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <p className="label">
                        <FormattedMessage
                          id={'listing-create.frequencyReserva'}
                          defaultMessage={'Frecuencia del Servicio'}
                        />
                      </p>
                    </div>
                    <div className="col-md-9">
                      <p>{translatedFrequency}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <p className="label">
                        <FormattedMessage
                          id={'listing-create.startDateReserva'}
                          defaultMessage={'Comienzo del Servicio'}
                        />
                      </p>
                    </div>
                    <div className="col-md-9">
                      <p>{formData.startDate}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <p className="label">
                        <FormattedMessage
                          id={'listing-create.hoursReserva'}
                          defaultMessage={'Horas a Reservar'}
                        />
                      </p>
                    </div>
                    <div className="col-md-9">
                      <p>{formData.hours}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <p className="label">
                        <FormattedMessage
                          id={'listing-create.haveProductsReserva'}
                          defaultMessage={'¿Llevas productos de limpieza?'}
                        />
                      </p>
                    </div>
                    <div className="col-md-9">
                      <p>{translatedHaveProduct}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <p className="label">Photos</p>
                    </div>
                    <div className="col-md-9 photo-row">
                      {formData.pictures &&
                        formData.pictures.map((dataUri, idx) => (
                          <img
                            key={idx}
                            src={dataUri}
                            className="photo"
                            role="presentation"
                          />
                        ))}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <p className="label">
                        <FormattedMessage
                          id={'listing-create.listing-priceReserva'}
                          defaultMessage={'Listing Price'}
                        />
                      </p>
                    </div>
                    <div className="col-md-9">
                      <p>
                        {isFractionalListing &&
                          <FormattedMessage
                            id={'listing-create.fractional-price-variesReserva'}
                            defaultMessage={'Price varies by date'}
                          />
                        }
                        {!isFractionalListing &&
                          <Fragment>
                            <img
                              className="eth-icon"
                              src="images/eth-icon.svg"
                              role="presentation"
                            />
                            <span className="text-bold">
                              {isFractionalListing &&
                                'Varies by date'
                              }
                              {!isFractionalListing &&
                                Number(formData.price).toLocaleString(undefined, {
                                  minimumFractionDigits: 5,
                                  maximumFractionDigits: 5
                                })
                              }
                            </span>&nbsp;
                            <a
                              className="eth-abbrev"
                              href="https://en.wikipedia.org/wiki/Ethereum"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              ETH
                            </a>
                            <span className="help-block">
                              &nbsp;| {usdListingPrice} USD&nbsp;
                              <span className="text-uppercase">
                                {'('}
                                <FormattedMessage
                                  id={'listing-create.appropriate-valueReserva'}
                                  defaultMessage={'Approximate Value'}
                                />
                                {')'}
                              </span>
                            </span>
                          </Fragment>
                        }
                      </p>
                    </div>
                  </div>
                  {!isEditMode &&
                    <div className="row">
                      <div className="col-md-3">
                        <p className="label">
                          <FormattedMessage
                            id={'listing-create.boost-levelReserva'}
                            defaultMessage={'Boost Level'}
                          />
                        </p>
                      </div>
                      <div className="col-md-9">
                        <p>
                          <img
                            className="ogn-icon"
                            src="images/ogn-icon.svg"
                            role="presentation"
                          />
                          <span className="text-bold">{formData.boostValue}</span>&nbsp;
                          <Link
                            className="ogn-abbrev"
                            to="/about-tokens"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            OGN
                          </Link>
                          <span className="help-block">
                            &nbsp;| {formData.boostLevel.toUpperCase()}
                          </span>
                        </p>
                      </div>
                    </div>
                  }
                </div>
                {/* Revisit this later
                  <Link
                    className="bottom-cta"
                    to="#"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Preview in browser
                  </Link>
                */}
                <div className="btn-container">
                  <button
                    className="btn btn-other float-left btn-listing-create"
                    onClick={() => {
                      const step = isEditMode ?
                        isFractionalListing ?
                          this.STEP.AVAILABILITY :
                          this.STEP.DETAILS
                        : this.STEP.BOOST
                      this.setState({ step })
                    }}
                    ga-category="create_listing"
                    ga-label="review_step_back"
                  >
                    <FormattedMessage
                      id={'listing-create.backButtonLabelReserva'}
                      defaultMessage={'Back'}
                    />
                  </button>
                  <button
                    className="btn btn-primary float-right btn-listing-create"
                    onClick={() => this.onSubmitListing(formListing)}
                    ga-category="create_listing"
                    ga-label="review_step_done"
                  >
                    <FormattedMessage
                      id={'listing-create.doneButtonLabelReserva'}
                      defaultMessage={'Done'}
                    />
                  </button>
                </div>
              </div>
            )}
            {/*step !== this.STEP.AVAILABILITY &&
              <div
                className={`pt-xs-4 pt-sm-4 col-md-5 col-lg-4${
                  step >= this.STEP.PREVIEW ? '' : ' offset-md-1 offset-lg-3'
                }`}
              >
                <WalletCard
                  wallet={wallet}
                  withBalanceTooltip={!this.props.wallet.ognBalance}
                  withMenus={true}
                  withProfile={false}
                />
                {step === this.STEP.PICK_SCHEMA && (
                  <div className="info-box">
                    <h2>
                      <FormattedMessage
                        id={'listing-create.create-a-listingReserva'}
                        defaultMessage={'Create A Listing On The Origin DApp'}
                      />
                    </h2>
                    <p>
                      <FormattedMessage
                        id={'listing-create.form-help-schemaReserva'}
                        defaultMessage={`Get started by selecting the type of listing you want to create. You will then be able to set a price and listing details.`}
                      />
                    </p>
                  </div>
                )}
                {step === this.STEP.DETAILS && (
                  <div className="info-box">
                    <h2>
                      <FormattedMessage
                        id={'listing-create.add-detailsReserva'}
                        defaultMessage={'Add Listing Details'}
                      />
                    </h2>
                    <p>
                      <FormattedMessage
                        id={'listing-create.form-help-detailsReserva'}
                        defaultMessage={`Be sure to give your listing an appropriate title and description to let others know what you're offering. Adding some photos of your listing will help potential buyers decide if the want to buy your listing.`}
                      />
                    </p>
                  </div>
                )}
                {step === this.STEP.BOOST && (
                  <div className="info-box">
                    <h2>
                      <FormattedMessage
                        id={'listing-create.about-visibilityReserva'}
                        defaultMessage={'About Visibility'}
                      />
                    </h2>
                    <p>
                      <FormattedMessage
                        id={'listing-create.form-help-visibilityReserva'}
                        defaultMessage={`Origin sorts and displays listings based on relevance, recency, and boost level. Higher-visibility listings are shown to buyers more often.`}
                      />
                    </p>
                    <h2>
                      <FormattedMessage
                        id={'listing-create.origin-tokensReserva'}
                        defaultMessage={'Origin Tokens'}
                      />
                    </h2>
                    <p>
                      <FormattedMessage
                        id={'listing-create.form-help-ognReserva'}
                        defaultMessage={`OGN is an ERC-20 token used for incentives and governance on the Origin platform. Future intended uses of OGN might include referral rewards, reputation incentives, spam prevention, developer rewards, and platform governance.`}
                      />
                    </p>
                    <div className="link-container">
                      <Link
                        to="/about-tokens"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FormattedMessage
                          id={'listing-create.learn-moreReserva'}
                          defaultMessage={'Learn More'}
                        />
                      </Link>
                    </div>
                  </div>
                )}
                {step >= this.STEP.PREVIEW && (
                  <div className="info-box">
                    <div>
                      <h2>
                        <FormattedMessage
                          id={'listing-create.whatHappensNextHeadingReserva'}
                          defaultMessage={'What happens next?'}
                        />
                      </h2>
                      <FormattedMessage
                        id={'listing-create.whatHappensNextContent1Reserva'}
                        defaultMessage={
                          'When you submit this listing, you will be asked to confirm your transaction in MetaMask. Buyers will then be able to see your listing and make offers on it.'
                        }
                      />
                      {!!selectedBoostAmount && (
                        <div className="boost-reminder">
                          <FormattedMessage
                            id={'listing-create.whatHappensNextContent2Reserva'}
                            defaultMessage={
                              '{selectedBoostAmount} OGN will be transferred for boosting. If you close your listing before accepting an offer, the OGN will be refunded to you.'
                            }
                            values={{
                              selectedBoostAmount
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            */}
            {step === this.STEP.METAMASK && <ProviderModal />}
            {step === this.STEP.PROCESSING && <ProcessingModal />}
            {step === this.STEP.SUCCESS && (
              <Modal backdrop="static" isOpen={true}>
                <div className="image-container">
                  <img
                    src="images/circular-check-button.svg"
                    role="presentation"
                  />
                </div>
                <h3>
                  {isEditMode &&
                    <FormattedMessage
                      id={'listing-create.updateSuccessMessageReserva'}
                      defaultMessage={'Your listing has been updated!'}
                    />
                  }
                  {!isEditMode &&
                    <FormattedMessage
                      id={'listing-create.successMessageReserva'}
                      defaultMessage={'Your listing has been created!'}
                    />
                  }
                </h3>
                <div className="disclaimer">
                  <p>
                    <FormattedMessage
                      id={'listing-create.successDisclaimerReserva'}
                      defaultMessage={
                        "Your listing will be visible within a few seconds. Here's what happens next:"
                      }
                    />
                  </p>
                  <ul>
                    <li>
                      <FormattedMessage
                        id={'listing-create.success-1Reserva'}
                        defaultMessage={
                          'Buyers will now see your listing on the marketplace.'
                        }
                      />
                    </li>
                    <li>
                      <FormattedMessage
                        id={'listing-create.success-2Reserva'}
                        defaultMessage={
                          'When a buyer makes an offer on your listing, you can choose to accept or reject it.'
                        }
                      />
                    </li>
                    <li>
                      <FormattedMessage
                        id={'listing-create.success-3Reserva'}
                        defaultMessage={
                          'Once the offer is accepted, you will be expected to fulfill the order.'
                        }
                      />
                    </li>
                    <li>
                      <FormattedMessage
                        id={'listing-create.success-4Reserva'}
                        defaultMessage={
                          'You will receive payment once the buyer confirms that the order has been fulfilled.'
                        }
                      />
                    </li>
                  </ul>
                </div>
                <div className="button-container">
                  <button
                    className="btn btn-clear"
                    onClick={this.resetForm}
                    ga-category="create_listing"
                    ga-label="listing_creation_confirmation_modal_create_another_listing_cta"
                  >
                    <FormattedMessage
                      id={'listing-create.createAnotherReserva'}
                      defaultMessage={'Create Another Listing'}
                    />
                  </button>
                  <Link
                    to="/"
                    className="btn btn-clear"
                    ga-category="create_listing"
                    ga-label="listing_creation_confirmation_modal_see_all_listings"
                  >
                    <FormattedMessage
                      id={'listing-create.seeAllListingsReserva'}
                      defaultMessage={'See All Listings'}
                    />
                  </Link>
                </div>
              </Modal>
            )}
            {step === this.STEP.ERROR && (
              <Modal backdrop="static" isOpen={true}>
                <div className="image-container">
                  <img src="images/flat_cross_icon.svg" role="presentation" />
                </div>
                <FormattedMessage
                  id={'listing-create.error1Reserva'}
                  defaultMessage={'There was a problem creating this listing.'}
                />
                <br />
                <FormattedMessage
                  id={'listing-create.error2Reserva'}
                  defaultMessage={'See the console for more details.'}
                />
                <div className="button-container">
                  <a
                    className="btn btn-clear"
                    onClick={this.resetToPreview}
                    ga-category="create_listing"
                    ga-label="error_dismiss"
                  >
                    <FormattedMessage
                      id={'listing-create.OKReserva'}
                      defaultMessage={'OK'}
                    />
                  </a>
                </div>
              </Modal>
            )}
          </div>
        </div>
        <Prompt
          when={step !== this.STEP.PICK_SCHEMA && step !== this.STEP.SUCCESS}
          message={intl.formatMessage(this.intlMessages.navigationWarning)}
        />
      </div>
    ) : null
  }
}

const mapStateToProps = ({ activation, profile, app, exchangeRates, wallet }) => {
  return {
    exchangeRates,
    messagingEnabled: activation.messaging.enabled,
    pushNotificationsSupported: activation.notifications.pushEnabled,
    serviceWorkerRegistration: activation.notifications.serviceWorkerRegistration,
    wallet,
    web3Intent: app.web3.intent,
    provisional: profile.provisional,
    profile: profile
  }
}

const mapDispatchToProps = dispatch => ({
  handleNotificationsSubscription: (role, props) => dispatch(handleNotificationsSubscription(role, props)),
  showAlert: msg => dispatch(showAlert(msg)),
  updateTransaction: (hash, confirmationCount) =>
    dispatch(updateTransaction(hash, confirmationCount)),
  upsertTransaction: transaction => dispatch(upsertTransaction(transaction)),
  getOgnBalance: () => dispatch(getOgnBalance()),
  storeWeb3Intent: intent => dispatch(storeWeb3Intent(intent))
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    injectIntl(ListingCreateReserva)
  )
)
