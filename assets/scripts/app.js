class Product {
  constructor(title, image, desc, price) {
    this.title = title;
    this.imageUrl = image;
    this.description = desc;
    this.price = price;
  }
}

class ElementAttribute {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

class Component {
  constructor(hookId, shouldRender = true) {
    this.hookId = hookId;
    if (shouldRender) {
      this.render();
    }
  }
  render() {}
  createRootElement(tag, cssClass, attributes) {
    const rootEle = document.createElement(tag);

    if (cssClass) {
      rootEle.className = cssClass;
    }

    if (attributes && attributes.length > 0) {
      for (const attr of attributes) {
        rootEle.setAttribute(attr.name, attr.value);
      }
    }

    document.getElementById(this.hookId).append(rootEle);
    return rootEle;
  }
}

class ShoppingCart extends Component {
  constructor(renderHookId) {
    super(renderHookId, false);
    this.orderNowButtonHandler = () => {
      console.log(this.items);
    };
    this.render();
  }

  items = [];

  render() {
    const cartEl = this.createRootElement("section", "cart");

    cartEl.innerHTML = `
    
    <h2>Total: \$${0}</h2>
    <button> Order Now!</button>
      `;

    this.outputEl = cartEl.querySelector("h2");
    const orderNowButton = cartEl.querySelector("button");
    orderNowButton.addEventListener("click", this.orderNowButtonHandler);
  }

  addProduct(product) {
    this.items.push(product);

    const sum = this.items.reduce((t, x) => t + x.price, 0);

    console.log(sum);
    this.outputEl.innerHTML = `<h2>Total: \$${Math.round(sum)}</h2>`;
  }
}

class ProductItem extends Component {
  constructor(product, renderHookId) {
    super(renderHookId, false);
    this.product = product;
    this.render();
  }

  addToCart() {
    // console.log("Adding product to cart...");
    // console.log(this.product);

    App.addProductToCart(this.product);
  }

  render() {
    const prodEl = this.createRootElement("li", "product-item");
    prodEl.innerHTML = `
        <div>
          <img src="${this.product.imageUrl}" alt="${this.product.title}" >
          <div class="product-item__content">
            <h2>${this.product.title}</h2>
            <h3>\$${this.product.price}</h3>
            <p>${this.product.description}</p>
            <button>Add to Cart</button>
          </div>
        </div>
      `;
    const addCartButton = prodEl.querySelector("button");
    addCartButton.addEventListener("click", this.addToCart.bind(this));
  }
}

class ProductList extends Component {
  #products = [
    new Product(
      "A Pillow",
      "https://www.maxpixel.net/static/photo/2x/Soft-Pillow-Green-Decoration-Deco-Snuggle-1241878.jpg",
      "A soft pillow!",
      19.99
    ),
    new Product(
      "A Carpet",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Ardabil_Carpet.jpg/397px-Ardabil_Carpet.jpg",
      "A carpet which you might like - or not.",
      89.99
    ),
  ];

  constructor(renderHookId) {
    super(renderHookId, false);
    this.render();
  }

  render() {
    this.createRootElement("ul", "product-list", [
      new ElementAttribute("id", "prod-List"),
    ]);
    for (const prod of this.#products) {
      new ProductItem(prod, "prod-List");
    }
  }
}

class Shop extends Component {
  constructor() {
    super();
  }
  render() {
    this.shoppingcart = new ShoppingCart("app");

    const lev = new ProductList("app");
  }
}

class App {
  static init() {
    const shop = new Shop();
    this.cart = shop.shoppingcart;
  }

  static addProductToCart(product) {
    this.cart.addProduct(product);
  }
}
App.init();
