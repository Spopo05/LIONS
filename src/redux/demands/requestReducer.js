// This is the initial state - starting with empty demandes array
const initialState = {
  demandes: [], // This will store all your demandes
  loading: false,
  error: null,
};

// This reducer handles demandes state updates
const requestReducer = (state = initialState, action) => {
  switch (action.type) {
    // When we get demandes from API, put them in state
    case "SET_REQUESTS":
      return { 
        ...state, 
        demandes: action.payload // Fill demandes array with API data
      };
    
    // For now, ignore other actions
    default:
      return state;
  }
};

export default requestReducer;