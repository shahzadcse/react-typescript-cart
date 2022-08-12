import { createContext, ReactNode, useContext, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

type CartContext = {
  openCart: () => void;
  closeCart: () => void;
  getItemQty: (id: number) => number;
  increaseItemQty: (id: number) => void;
  decreaseItemQty: (id: number) => void;
  removeFromCart: (id: number) => void;
  cartQuantity: number;
  cartItems: CartItem[];
};

type CartItem = {
  id: number;
  quantity: number;
};

const CartContext = createContext({} as CartContext);

export function useShoppingCart() {
  return useContext(CartContext);
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  // set current item with state
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "shoppingcart",
    []
  );

  // set state for opening and closing cart
  const [isOpen, setIsOpen] = useState(false);

  // fn : to get qty of the items

  function getItemQty(id: number) {
    //find the item with the quanity if not found return 0
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }

  //fn : increase qty || add to cart

  function increaseItemQty(id: number) {
    // first we set Cart item to the current item
    // then check if the current items have the added item
    // if not then add new item in the current items
    // else add new item with the qty 1
    setCartItems((currentItems) => {
      if (currentItems.find((item) => item.id === id) == null) {
        return [...currentItems, { id, quantity: 1 }];
      } else {
        console.log(currentItems);
        return currentItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  //fn : decrease qty

  function decreaseItemQty(id: number) {
    // we will check that qty is equals to 1 to decrease
    setCartItems((currentItems) => {
      if (currentItems.find((item) => item.id === id)?.quantity === 1) {
        return currentItems.filter((item) => item.id !== id);
      } else {
        return currentItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  // fn: remove from the cart

  function removeFromCart(id: number) {
    setCartItems((currentItems) => {
      return currentItems.filter((item) => item.id !== id);
    });
  }

  // variable cart qty : sum of the cart : initially set to 0

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  //fn : open the cart
  const openCart = () => {
    setIsOpen(true);
  };

  //fn : close the cart
  const closeCart = () => {
    setIsOpen(false);
  };

  return (
    <CartContext.Provider
      value={{
        getItemQty,
        increaseItemQty,
        decreaseItemQty,
        removeFromCart,
        cartQuantity,
        cartItems,
        openCart,
        closeCart,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />
    </CartContext.Provider>
  );
}
