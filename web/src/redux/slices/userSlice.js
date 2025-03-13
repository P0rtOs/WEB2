import { createSlice } from '@reduxjs/toolkit';

// Початковий стан (initialState) для користувача
const initialState = {
    userType: null, // Початкове значення null означає, що тип ще не завантажено.
    // Може бути "client" або "organizer".
};

// Створюємо слайс за допомогою createSlice
const userSlice = createSlice({
  name: 'user', // Ім'я слайсу, використовується для побудови типу action
  initialState,
  reducers: {
    // Задає тип користувача
    setUserType: (state, action) => {
      state.userType = action.payload;
      console.log('Current userType from Redux:', userType);
    }
  },
});

// Експортуємо автоматично згенеровані action creators
export const { setUserType } = userSlice.actions;

// Експортуємо редюсер, який буде використано у store.js
export default userSlice.reducer;
