import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Row } from 'reactstrap'
import { Context } from '@/app/context';
import { useRouter } from 'next/navigation';
import { addItem, removeItem } from './handle';
interface CartProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  price: string;
  imageSrc: string;
  quantity: number;
}

interface LocaleString {
  ar: string;
  _type: string;
  en: string;
}

interface sanityContent {
  buttonName: string;
  _type: string;
  translation: LocaleString;
  ButtonColor: {
    alpha: number;
    _type: string;
    hex: string;
  };
}
interface CartProps {
  cartProducts: CartProduct;
  sanityContent: sanityContent;
  removeFromCart: (productId: string) => void;
  handleClick: () => void;
  totalPrice: number;
}


const Cart: React.FC = ({ sanityContent, removeItemFromCart, handleClick, products, price,removeQuantityFromCart }: any) => {
  const contextValue = useContext(Context)
  // const { handleAddToCart } = contextValue as { cartItems: any[]; handleAddToCart: (getCurrectItem: any) => void };
  const router = useRouter();
  const checkout = async() => {
    // createCheckout()
    // const checkoutId= await performCommonIntegration(createCheckout);
    // console.log("check",checkoutId);

    router.push('/checkout/checkout');
  }

  const addToCart = (selectedVariantId: string) => {
    addItem(selectedVariantId)
  }
  return (
    <Row>
      <Row>
        <Col md='8'>
          <div>.
            {/* <h4>My Cart</h4> */}
          </div>
        </Col>
      </Row>
      <Col md='2'>
        <div className='cart'>
          <div>
            <Button className='close-button' onClick={handleClick}>X </Button>
            <Col className='mt-3'>
                <h4 >{sanityContent?.title && sanityContent?.title?.ar || sanityContent?.title?.en}</h4>
            </Col>
          </div>
          <Row className='cart-items'>
            {products &&
              products.map((product: any) => (
                <Row className='cart-item' key={product.id}>
                  <Col md='8'>
                    <Row>
                      <Col md='4' className='product-card'>
                        <Image src={product.merchandise.product.featuredImage.url} alt={product.merchandise.product.title} width={80} height={80} />
                        <Button className='remove-button' onClick={() => removeItemFromCart(product.id)}>
                          X
                        </Button>
                        {/* <Button className='' >X</Button> */}
                      </Col>
                      <Col md='8' className=''>
                        <h6 className='font-weight-800'>{product.merchandise.product.title}</h6>
                        {/* <p className='text-secondary'>{product.merchandise.product.description}</p> */}
                      </Col>
                    </Row>
                  </Col>
                  <Col md='4' className='quantity text-end'>
                    <div className='price text-center'>{product.merchandise.product.priceRange.maxVariantPrice.currencyCode}&nbsp; {product.merchandise.product.priceRange.maxVariantPrice.amount} </div>
                    <div className='quantity-control text-end'>
                      <Button
                        className='quantity-control-btn'
                      onClick={() => removeQuantityFromCart(product)}
                      >
                        -
                      </Button>
                      {product.quantity}
                      <Button
                        className='quantity-control-btn'
                        onClick={() => addToCart(product.merchandise.id)}
                      >
                        +
                      </Button>
                    </div>
                  </Col>
                </Row>
              ))
            }
          </Row>
          <Row>
              <Row >
                <Col md='12'>
                  <div className='bottom'>
                    <Row className='taxes'>
                      <Col md='6'>
                          <p className='font-weight-bold muted'>{sanityContent?.taxField && sanityContent?.taxField?.ar || sanityContent?.taxField?.en}</p>
                      </Col>
                      <Col md='6' className='text-end'>
                        <h5>{price && price?.totalTaxAmount?.amount} {price && price?.totalTaxAmount?.currencyCode} </h5>
                      </Col>
                    </Row>

                    <Row className='shipping'>
                      <Col md='6'>
                          <p className='font-weight-bold muted' >{sanityContent?.shippingField && sanityContent?.shippingField?.ar || sanityContent?.shippingField?.en}</p>
                      </Col>
                      <Col md='6' className='text-end muted'><p> Calculated at checkout</p></Col>
                    </Row>

                    <Row className='total'>
                      <Col md='6'>
                          <p className='font-weight-bold muted' >{sanityContent?.totalField && sanityContent?.totalField?.ar || sanityContent?.totalField?.en}</p>
                      </Col>
                      <Col md='6' className='text-end'>
                        <h5> {price && price?.totalAmount?.amount} {price && price?.totalAmount?.currencyCode} </h5>
                      </Col>
                    </Row>

                    <Row className='text-center mt-4'>
                      <Col>
                          <button
                            style={{ backgroundColor: sanityContent?.buttonColor }}
                            className='proceed-checkout'
                            onClick={() => checkout()}

                          >
                            {sanityContent?.buttonName?.ar || sanityContent?.buttonName?.en}
                          </button>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
          </Row>
        </div>
      </Col>


    </Row>
  )
}

export default Cart