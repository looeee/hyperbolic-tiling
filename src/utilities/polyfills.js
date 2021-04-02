Math.sinh = Math.sinh || function sinh( x ) {
  const y = Math.exp( x );
  return ( y - 1 / y ) / 2;
};

Math.cosh = Math.cosh || function cosh( x ) {
  const y = Math.exp( x );
  return ( y + 1 / y ) / 2;
};

Math.cot = Math.cot || function cot( x ) {
  return 1 / Math.tan( x );
};
