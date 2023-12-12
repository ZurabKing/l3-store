import { ViewTemplate } from '../../utils/viewTemplate';
import { View } from '../../utils/view';
import { formatPrice, isInViewport } from '../../utils/helpers';
import html from './product.tpl.html';
import { ProductData } from 'types';
import { analyticsApi } from '../../services/analytics.service';

type ProductComponentParams = { [key: string]: any };

export class Product {
  view: View;
  product: ProductData;
  params: ProductComponentParams;
  isSendAnalytic: boolean = false;

  constructor(product: ProductData, params: ProductComponentParams = {}) {
    this.product = product;
    this.params = params;
    this.view = new ViewTemplate(html).cloneView();
  }

  attach($root: HTMLElement) {
    $root.appendChild(this.view.root);
  }

  render() {
    const { id, name, src, salePriceU } = this.product;

    this.view.root.setAttribute('href', `/product?id=${id}`);
    this.view.img.setAttribute('src', src);
    this.view.title.innerText = name;
    this.view.price.innerText = formatPrice(salePriceU);

    if (this.params.isHorizontal) this.view.root.classList.add('is__horizontal');

    document.addEventListener('scroll', () => {
      if (!isInViewport(this.view.root) || this.isSendAnalytic) {
        return;
      }
      this.sendViewCardAnalytic();
    });
  }

  async sendViewCardAnalytic() {
    this.isSendAnalytic = true;
    const respSecretKey = await fetch(`/api/getProductSecretKey?id=${this.product.id}`);
    const secretKey = await respSecretKey.json();

    analyticsApi.sendAnalytic({
      type: 'viewCard',
      payload: {
        product: this.product,
        secretKey: secretKey
      }
    });
  }
}
