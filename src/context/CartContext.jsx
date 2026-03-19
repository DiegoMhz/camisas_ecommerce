/**
 * CartContext.jsx
 * ---------------
 * Contexto global del carrito de compras de GoodLuck.
 *
 * Usa el patrón Context + useReducer de React para manejar el estado
 * del carrito de forma global, sin necesidad de pasar props entre componentes.
 *
 * ¿Qué expone?
 *  - CartContext        : el objeto de contexto (usado internamente)
 *  - CartProvider       : componente que envuelve la app y provee el estado
 *  - useCart()          : hook personalizado para acceder al carrito desde cualquier componente
 *
 * Estado del carrito (cartState):
 *  - items (array): lista de productos en el carrito. Cada item tiene:
 *      { id, name, price, image, size, quantity }
 *
 * Acciones disponibles (dispatch):
 *  - ADD_ITEM       : agrega un producto; si ya existe con la misma talla, incrementa quantity
 *  - REMOVE_ITEM    : elimina un producto del carrito (por id + talla)
 *  - UPDATE_QUANTITY: cambia la cantidad de un producto (por id + talla)
 *  - CLEAR_CART     : vacía el carrito completamente
 *
 * Uso:
 *  // En cualquier componente hijo de CartProvider:
 *  const { cartState, dispatch, totalItems, totalPrice } = useCart();
 */

import { createContext, useContext, useReducer } from "react";

// ── Creamos el contexto ──
// Empieza vacío; CartProvider lo llenará con el estado real.
const CartContext = createContext(null);

// ── Estado inicial del carrito ──
const initialState = {
  items: [], // lista de productos agregados al carrito
};

/**
 * cartReducer
 * -----------
 * Función pura que calcula el nuevo estado del carrito según la acción recibida.
 * No modifica el estado directamente (inmutabilidad).
 *
 * @param {object} state   - Estado actual del carrito
 * @param {object} action  - Objeto con { type, payload }
 * @returns {object}       - Nuevo estado del carrito
 */
function cartReducer(state, action) {
  switch (action.type) {

    case "ADD_ITEM": {
      const { product, size } = action.payload;

      // Verificamos si el producto ya está en el carrito con la misma talla
      // Un mismo producto en distintas tallas se trata como items separados
      const existingIndex = state.items.findIndex(
        (item) => item.id === product.id && item.size === size
      );

      if (existingIndex !== -1) {
        // El producto ya existe → solo incrementamos la cantidad
        const updatedItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return { ...state, items: updatedItems };
      } else {
        // El producto es nuevo en el carrito → lo agregamos
        const newItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0], // usamos la primera imagen
          size,
          quantity: 1,
        };
        return { ...state, items: [...state.items, newItem] };
      }
    }

    case "REMOVE_ITEM": {
      // Eliminamos el item que coincida con id Y talla
      const { id, size } = action.payload;
      return {
        ...state,
        items: state.items.filter(
          (item) => !(item.id === id && item.size === size)
        ),
      };
    }

    case "UPDATE_QUANTITY": {
      const { id, size, quantity } = action.payload;

      // Si la nueva cantidad es 0 o negativa, eliminamos el item
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => !(item.id === id && item.size === size)
          ),
        };
      }

      // Si la cantidad es válida, la actualizamos
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id && item.size === size
            ? { ...item, quantity }
            : item
        ),
      };
    }

    case "CLEAR_CART": {
      // Vacía completamente el carrito
      return { ...state, items: [] };
    }

    default:
      // Si la acción no existe, devolvemos el estado sin cambios
      return state;
  }
}

/**
 * CartProvider
 * ------------
 * Componente que provee el estado del carrito a toda la app.
 * Debe envolver el componente raíz (o al menos los componentes que usen el carrito).
 *
 * Props:
 *  - children (ReactNode): los componentes hijos que tendrán acceso al carrito
 *
 * Uso: <CartProvider><App /></CartProvider>
 */
export function CartProvider({ children }) {
  // useReducer: similar a useState pero para estados complejos con múltiples acciones
  // Retorna [estadoActual, funcionDeDespacho]
  const [cartState, dispatch] = useReducer(cartReducer, initialState);

  // ── Valores derivados del estado ──
  // Calculamos estos valores aquí para no repetir la lógica en cada componente

  // Total de unidades en el carrito (sumando las cantidades de todos los items)
  const totalItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0);

  // Precio total del carrito
  const totalPrice = cartState.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // El valor que compartimos con todos los componentes hijos
  const contextValue = {
    cartState,   // estado completo: { items: [...] }
    dispatch,    // función para ejecutar acciones (ADD_ITEM, REMOVE_ITEM, etc.)
    totalItems,  // número total de productos (contando cantidades)
    totalPrice,  // precio total a pagar
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * useCart
 * -------
 * Hook personalizado para acceder al carrito desde cualquier componente.
 * Lanza un error si se usa fuera de CartProvider (para detectar errores fácilmente).
 *
 * @returns {{ cartState, dispatch, totalItems, totalPrice }}
 *
 * Uso:
 *  const { cartState, dispatch, totalItems, totalPrice } = useCart();
 */
export function useCart() {
  const context = useContext(CartContext);

  // Si context es null, significa que useCart se usó fuera de CartProvider
  if (!context) {
    throw new Error("useCart debe usarse dentro de <CartProvider>");
  }

  return context;
}
