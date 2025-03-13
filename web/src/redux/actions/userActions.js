import { setUserType, setLoading, setError } from '../slices/userSlice';
import { getUserType } from '../../Auth_api';

export const fetchUserType = () => async (dispatch) => {
  try {
    const userType = await getUserType();
    dispatch(setUserType(userType));
  } catch (error) {
  }
};
