<template>
  <b-container fluid class="d-flex justify-content-center">
    <b-card no-body class="overflow-hidden" style="max-width:640px">
      <b-row no-gutters>
        <b-col md="6">
          <b-card-img :src="this.random_image" class="rounded-0"></b-card-img>
        </b-col>
        <b-col md="6">
          <b-card-body :title="this.product.product_name">
            <b-card-text>
              <div>
                <p>
                  {{ this.product.description }}
                </p>
              </div>
              <div class="text-right">
                <h4>{{ this.product.unit_price | toCurrency }}</h4>
              </div>
              <div>
                <b-form-spinbutton
                  v-model="cart.quantity"
                  min="0"
                  max="100"
                ></b-form-spinbutton>
              </div>
              <div class="py-3">
                <b-button @click="addToCart" variant="outline-primary" block
                  :disabled="this.cart.quantity <= 0"
                  >Add to cart</b-button
                >
              </div>

              <div class="d-flex justify-content-end">
                <b-link
                  :to="'/sellers/' + this.seller.seller_id + '?view=products'"
                  >See more items of seller
                  {{ this.seller.company_name }}</b-link
                >
              </div>
            </b-card-text>
          </b-card-body>
        </b-col>
      </b-row>
    </b-card>
  </b-container>
</template>
<script>
import ProductForm from "~/components/products/ProductForm";
export default {
  components: { ProductForm },
  data() {
    return {
      random_image: 100,
      product: {},
      seller: {},
      cart: { quantity: 0 }
    };
  },
  filters: {
    toCurrency: function(value) {
      var formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      });

      return formatter.format(value);
    }
  },
  async created() {
    const { product_id } = this.$route.params;
    const { seller_id } = this.$route.query;

    const product = await this.$axios.$get(
      `/api/seller/${seller_id}/product/${product_id}`
    );

    const seller = await this.$axios.$get(`/api/seller/${seller_id}`);

    this.id = this.$shortid();
    this.product = product;
    this.seller = seller;
    const randomNumber = Math.floor(Math.random() * 200);
    this.random_image = `https://i.picsum.photos/id/${randomNumber}/200/300.jpg`;

    await this.loadCart();
  },
  methods: {
    async loadCart() {
      try {
        const { details } = await this.$axios.$get("/api/cart");
        const cart = details.find(
          p =>
            p.product_id == this.product.product_id &&
            p.seller_id == this.product.seller_id
        );
        this.cart = !!cart ? cart : { quantity: 0 };
      } catch (err) {
        //no cart yet. moving on.
      }
    },
    async addToCart() {
      const { product_id, seller_id } = this.product;
      try {
        if (this.cart.quantity > 0) {
          await this.$axios.$post("/api/cart/add", {
            product_id,
            seller_id,
            quantity: this.cart.quantity
          });
        } else {
          await this.$axios.$delete("/api/cart", {
            data: { product_id, seller_id }
          });
        }

        this.$router.push("/cart?added=1");
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style></style>
