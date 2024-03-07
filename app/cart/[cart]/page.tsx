'use client'
import './style.css';
import {Container } from 'reactstrap';

import Cart from '@/components/cart/cart';
import CartContainer from '@/components/cart/cartContainer';

export default  function CartPage() {

  return (

    <Container>
      <CartContainer/>
    </Container>
  );
}
