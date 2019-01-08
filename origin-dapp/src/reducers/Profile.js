import { ProfileConstants } from 'actions/Profile'

const initialState = {
  user: {
    profile: {},
    attestations: []
  },
  name: '',
  provisional: {
    firstName: '',
    lastName: '',
    description: '',
    roleName: '',
    username: '',
    password: '',
    postalCode: '',
    nif: '',
    pic: '',
    email: false,
    facebook: false,
    phone: false,
    twitter: false,
    airbnb: false
  },
  published: {
    firstName: '',
    lastName: '',
    description: '',
    roleName: '',
    username: '',
    password: '',
    postalCode: '',
    nif: '',
    pic: '',
    email: false,
    facebook: false,
    phone: false,
    twitter: false,
    airbnb: false
  },
  changes: [],
  lastPublish: null,
  provisionalProgress: 0,
  publishedProgress: 0,
  strength: 0,
  status: null,
  lastDeployProfileHash: null
}
initialState.provisional = { ...initialState.published }

const progressPct = {
  firstName: 15,
  lastName: 30,
  description: 10,
  roleName: 10,
  username: 10,
  password: 30,
  postalCode: 10,
  nif: 10,
  email: 15,
  phone: 15,
  facebook: 10,
  twitter: 10,
  airbnb: 10
}

function changes(state) {
  let provisionalProgress = 0,
    publishedProgress = 0

  Object.keys(progressPct).forEach(k => {
    const pct = progressPct[k]
    if (state.published[k] && pct) {
      publishedProgress += pct
    } else if (state.provisional[k] && pct) {
      provisionalProgress += pct
    }
  })

  const changes = []

  Object.keys(state.provisional).forEach(k => {
    if (state.provisional.hasOwnProperty(k)) {
      if (
        JSON.stringify(state.provisional[k]) !==
        JSON.stringify(state.published[k])
      ) {
        changes.push(k)
      }
    }
  })

  return {
    ...state,
    provisionalProgress,
    publishedProgress,
    strength: provisionalProgress + publishedProgress,
    changes
  }
}

function unpackUser(state) {
  const user = state.user || {},
    profile = user.profile || {},
    attestations = user.attestations || [],
    firstName = profile.firstName,
    lastName = profile.lastName,
    description = profile.description,
    roleName = profile.roleName,
    username = profile.username,
    password = profile.password,
    postalCode = profile.postalCode,
    nif = profile.nif,
    pic = profile.avatar

  if (firstName) {
    state.provisional.firstName = state.published.firstName = firstName
  }
  if (lastName) {
    state.provisional.lastName = state.published.lastName = lastName
  }
  if (description) {
    state.provisional.description = state.published.description = description
  }
  if (roleName) {
    state.provisional.roleName = state.published.roleName = roleName
  }
  if (username) {
    state.provisional.username = state.published.username = username
  }
  if (password) {
    state.provisional.password = state.published.password = password
  }
  if (postalCode) {
    state.provisional.postalCode = state.published.postalCode = postalCode
  }
  if (nif) {
    state.provisional.nif = state.published.nif = nif
  }
  if (pic) {
    state.provisional.pic = state.published.pic = pic
  }
  attestations.forEach(attestation => {
    if (attestation.service === 'facebook') {
      state.provisional.facebook = state.published.facebook = true
    } else if (attestation.service === 'twitter') {
      state.provisional.twitter = state.published.twitter = true
    } else if (attestation.service === 'email') {
      state.provisional.email = state.published.email = true
    } else if (attestation.service === 'phone') {
      state.provisional.phone = state.published.phone = true
    } else if (attestation.service === 'airbnb') {
      state.provisional.airbnb = state.published.airbnb = true
    }
  })

  if (firstName && lastName) {
    const name = `${firstName} ${lastName}`.trim()
    if (name) {
      state.name = name
    }
  }

  return changes(state)
}

export default function Profile(state = initialState, action = {}) {
  switch (action.type) {
  case ProfileConstants.FETCH_SUCCESS:
    return unpackUser({ ...state, user: action.user })

  case ProfileConstants.ADD_ATTESTATION:
    const toAdd = {}
    if (action.attestation.topic === 3) {
      toAdd.facebook = action.attestation
    } else if (action.attestation.topic === 4) {
      toAdd.twitter = action.attestation
    } else if (action.attestation.topic === 5) {
      toAdd.airbnb = action.attestation
    } else if (action.attestation.topic === 11) {
      toAdd.email = action.attestation
    } else if (action.attestation.topic === 10) {
      toAdd.phone = action.attestation
    }
    return changes({
      ...state,
      provisional: { ...state.provisional, ...toAdd }
    })

  case ProfileConstants.UPDATE:
    return changes({
      ...state,
      provisional: {
        ...state.provisional,
        ...action.data
      }
    })

  case ProfileConstants.DEPLOY:
    return { ...state, status: 'confirming' }

  case ProfileConstants.DEPLOY_ERROR:
    return { ...state, status: 'error' }

  case ProfileConstants.DEPLOY_IN_PROGRESS:
    return changes({
      ...state,
      status: 'inProgress',
      lastDeployProfileHash: action.hash
    })

  case ProfileConstants.DEPLOY_SUCCESS:
    return changes({
      ...state,
      lastPublish: new Date(),
      published: state.provisional
    })

  case ProfileConstants.DEPLOY_RESET:
    return { ...state, status: null }
  }

  return state
}
