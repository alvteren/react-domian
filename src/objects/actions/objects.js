var mockApiData = [
  {
    id: 1,
    name: "Track 1"
  },
  {
    id: 2,
    name: "Track 2"
  },
  {
    id: 3,
    name: "Track 3"
  },
  {
    id: 4,
    name: "Track 4"
  }
];
export const getObjects = () => dispatch => {
  setTimeout(() => {
    dispatch({ type: "FETCH_OBJECT_SUCCESS", payload: mockApiData });
  }, 2000);
};
