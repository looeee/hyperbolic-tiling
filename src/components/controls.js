
const warning = document.querySelector( '#warn' );

const pValue = document.querySelector( '#p-value' );
const qValue = document.querySelector( '#q-value' );

document.querySelector( '#p-up' ).addEventListener( 'click', ( e ) => {

  e.preventDefault();

  const currentValue = parseInt( pValue.innerHTML, 10 );
  if ( currentValue === 12 ) return;

  warning.classList.add( 'hide' );
  pValue.innerHTML = currentValue + 1;

} );

document.querySelector( '#p-down' ).addEventListener( 'click', ( e ) => {

  e.preventDefault();

  const currentValue = parseInt( pValue.innerHTML, 10 );

  if ( currentValue === 4 ) return;

  const newValue = currentValue - 1;

  if ( newValue === 4 && parseInt( qValue.innerHTML, 10 ) === 4 ) {

    warning.classList.remove( 'hide' );

  }

  pValue.innerHTML = newValue;

} );

document.querySelector( '#q-up' ).addEventListener( 'click', ( e ) => {

  e.preventDefault();

  const currentValue = parseInt( qValue.innerHTML, 10 );
  if ( currentValue === 12 ) return;

  warning.classList.add( 'hide' );
  qValue.innerHTML = currentValue + 1;

} );

document.querySelector( '#q-down' ).addEventListener( 'click', ( e ) => {

  e.preventDefault();

  const currentValue = parseInt( qValue.innerHTML, 10 );

  if ( currentValue === 4 ) return;

  const newValue = currentValue - 1;

  if ( newValue === 4 && parseInt( pValue.innerHTML, 10 ) === 4 ) {

    warning.classList.remove( 'hide' );

  }

  qValue.innerHTML = newValue;

} );
