const { setConfig } = require('./config');
const { passwordValidation } = require('./utils/auth');

setConfig('password', {
  strengthOptions: [
    {
      value: 1,
      minDiversity: 1,
      minLength: 8,
    },

    {
      value: 'Medium',
      minDiversity: 3,
      minLength: 10,
    },

    {
      value: 'Strong',
      minDiversity: 4,
      minLength: 12,
    },
  ],

  characterLen: 12,
  upperCase: 1,
  lowerCase: 1,
  num: 1,
  symbol: '#?!@$%^&*-',
});

console.log(passwordValidation('1234$@1Aafasfasfasfas!@#$!@!@!@$'));