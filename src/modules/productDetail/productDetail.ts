import { Component } from '../component';
import { ProductList } from '../productList/productList';
import { formatPrice } from '../../utils/helpers';
import { ProductData } from 'types';
import html from './productDetail.tpl.html';
import { cartService } from '../../services/cart.service';
import { favoritesService } from '../../services/favorites.service';

class ProductDetail extends Component {
  more: ProductList;
  product?: ProductData;

  constructor(props: any) {
    super(props);

    this.more = new ProductList();
    this.more.attach(this.view.more);
  }

  async render() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = Number(urlParams.get('id'));

    const productResp = await fetch(`/api/getProduct?id=${productId}`);
    this.product = await productResp.json();

    if (!this.product) return;

    const { id, src, name, description, salePriceU } = this.product;

    this.view.photo.setAttribute('src', src);
    this.view.title.innerText = name;
    this.view.description.innerText = description;
    this.view.price.innerText = formatPrice(salePriceU);
    this.view.btnBuy.onclick = this._addToCart.bind(this);
    this.view.btnBuy.onclick = this._removeProduct.bind(this);
    this.view.btnFav.onclick = this._addToFavorites.bind(this);
    this.view.btnFav.onclick = this._removeFavProduct.bind(this);

    //Корзина
    const isInCart = await cartService.isInCart(this.product);

    if (isInCart) {
      this._setInCart();
    } else {
      this._removeInCart();
    }
    //Избранное
    const isInFav = await favoritesService.isInFavorites(this.product);

    if (isInFav) {
      this._setInFav();
    } else {
      this._removeInFav();
    }

    if (isInCart) this._setInCart();
    if (isInFav) this._setInFav();

    fetch(`/api/getProductSecretKey?id=${id}`)
      .then((res) => res.json())
      .then((secretKey) => {
        this.view.secretKey.setAttribute('content', secretKey);
      });

    fetch('/api/getPopularProducts')
      .then((res) => res.json())
      .then((products) => {
        this.more.update(products);
      });
  }

  //Добавление в корзину
  private _addToCart() {
    if (!this.product) return;

    cartService.addProduct(this.product);
    this._setInCart();
  }

  //Удаление с корзины
  private _removeProduct() {
    if (!this.product) return;

    cartService.removeProduct(this.product);
    this._removeInCart();
  }

  //Добавление в избранное
  private async _addToFavorites() {
    if (!this.product) return;

    const isInFavorites = await favoritesService.isInFavorites(this.product);
    if (isInFavorites) return;

    favoritesService.addProductToFav(this.product);
    this._setInFav();
  }

  //Удаление с избранных
  private _removeFavProduct() {
    if (!this.product) return;

    favoritesService.removeProductFromFav(this.product);
    this._removeInFav();
  }

  //корзина
  private _setInCart() {
    this.view.btnBuy.innerText = '✓ В корзине';
    this.view.btnBuy.onclick = this._removeProduct.bind(this);
  }

  private _removeInCart() {
    this.view.btnBuy.innerText = 'В корзину';
    this.view.btnBuy.onclick = this._addToCart.bind(this);
  }

  //Избранное
  private _setInFav() {
    this.view.btnFavIcon.setAttribute('fill', 'var(--default-color)');
    this.view.btnFav.onclick = this._removeFavProduct.bind(this);
  }

  private _removeInFav() {
    this.view.btnFav.onclick = this._addToFavorites.bind(this);
  }
}

export const productDetailComp = new ProductDetail(html);
