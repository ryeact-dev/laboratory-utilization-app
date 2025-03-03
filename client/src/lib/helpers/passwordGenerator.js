export const randomPasswordGenerator = function create() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQSTUVWXYZabcdefghijklmnpqrstuvwxyz';
  const randomNnmber = Math.floor(Math.random() * (10 - 8 + 1)) + 8;
  const passwordRegex = /^(?!^[A-Z]*$)^(?=(?:\D*\d){4})^([a-zA-Z0-9]{8,10})$/;
  let randomStr = '';

  for (let i = 0; i < randomNnmber; i++) {
    randomStr += chars[Math.floor(Math.random() * chars.length)];
  }

  if (!passwordRegex.test(randomStr)) {
    return create();
  } else {
    return randomStr;
  }
};
