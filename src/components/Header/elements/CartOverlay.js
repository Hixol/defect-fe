import Link from 'next/link';
import { IoIosClose } from 'react-icons/io';
import CustomScroll from 'react-custom-scroll';
import { connect } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { deleteFromCart } from '../../../redux/actions/cartActions';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const CartOverlay = ({
  activeStatus,
  getActiveStatus,
  cartItems,
  deleteFromCart
}) => {
  let cartTotalPrice = 0;
  const router = useRouter();
  const { addToast } = useToasts();
  const user = useSelector((state) => state.user);
  let user_no;
  if (user.accountType === 'clinic') {
    user_no = user.userId;
  } else {
    console.log('Account Type not able to submit cart!!!');
  }

  return (
    <div className={`cart-overlay ${activeStatus ? 'active' : ''}`}>
      <div
        className="cart-overlay__close"
        onClick={() => {
          getActiveStatus(false);
          document.querySelector('body').classList.remove('overflow-hidden');
        }}
      />
      <div className="cart-overlay__content">
        {/*=======  close icon  =======*/}
        <button
          className="cart-overlay__close-icon"
          onClick={() => {
            getActiveStatus(false);
            document.querySelector('body').classList.remove('overflow-hidden');
          }}
        >
          <IoIosClose />
        </button>
        {/*=======  offcanvas cart content container  =======*/}
        <div className="cart-overlay__content-container">
          <h3 className="cart-title">Cart</h3>
          {cartItems.length >= 1 ? (
            <div className="cart-product-wrapper">
              <div className="cart-product-container">
                <CustomScroll allowOuterScroll={true}>
                  {cartItems.map((product, i) => {
                    const discountedPrice = getDiscountPrice(
                      product?.price,
                      product?.discount
                    )?.toFixed(2);

                    cartTotalPrice += product?.price_tier_1 * product.quantity;

                    return (
                      <div className="single-cart-product" key={i}>
                        <span className="cart-close-icon">
                          <button
                            onClick={() => deleteFromCart(product, addToast)}
                          >
                            <IoIosClose />
                          </button>
                        </span>
                        <div className="image">
                          <Link
                            href={`/shop/product-basic/[slug]?slug=${product?.id}`}
                            as={`${process.env.PUBLIC_URL}/shop/product-basic/${product?.id}`}
                          >
                            <a>
                              <img
                                src={process.env.PUBLIC_URL + product.image}
                                className="img-fluid"
                                alt=""
                              />
                            </a>
                          </Link>
                        </div>
                        <div className="content">
                          <h5>
                            <Link
                              href={`/shop/product-basic/[slug]?slug=${product?.id}`}
                              as={`${process.env.PUBLIC_URL}/shop/product-basic/${product?.id}`}
                            >
                              <a>{product?.name}</a>
                            </Link>
                          </h5>
                          <p>
                            <span className="cart-count">
                              {product?.quantity} x{' '}
                            </span>{' '}
                            <span className="discounted-price">
                              ${product?.price_tier_1}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </CustomScroll>
              </div>
              {/*=======  subtotal calculation  =======*/}
              <p className="cart-subtotal">
                <span className="subtotal-title">Subtotal:</span>
                <span className="subtotal-amount">
                  ${cartTotalPrice?.toFixed(2)}
                </span>
              </p>
              {/*=======  cart buttons  =======*/}
              <div className="cart-buttons">
                {/* <Link
                  href="/other/cart"
                  as={process.env.PUBLIC_URL + "/other/cart"}
                >
                  <a>view cart</a>
                </Link> */}
                <div
                  onClick={() => {
                    document
                      .querySelector('body')
                      .classList.remove('overflow-hidden');
                  }}
                >
                  <a>checkout</a>
                </div>
              </div>
              {/*=======  free shipping text  =======*/}
              <p className="free-shipping-text">
                Free delivery for orders above $150 unless stated otherwise.
                <br />
                <br />
                Please check individual products if there is a minimum order for
                free delivery.
                <br />
                <br />
                If it is not stated, the products will be considered part of the
                minimum order of $150 for free delivery
              </p>
            </div>
          ) : (
            'No items found in cart'
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteFromCart: (item, addToast) => {
      dispatch(deleteFromCart(item, addToast));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartOverlay);
