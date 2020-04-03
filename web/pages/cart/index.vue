<template>
  <div>
    <b-alert variant="success" :show="item_added" dismissible
      >Added to cart!</b-alert
    >
    <h3>My Cart Items</h3>
    <b-table
      small
      :items="this.details"
      :fields="this.fields"
      show-empty
      :busy="is_busy"
    >
      <template v-slot:table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
      <template v-slot:empty="">
        <div class="text-center text-info my-2">
          No data
        </div>
      </template>
      <template v-slot:cell(product_id)="data">
        <b-link
          :to="
            '/products/' +
              data.item.product_id +
              '?seller_id=' +
              data.item.seller_id
          "
          >{{ data.item.product_id }}</b-link
        >
      </template>
      <template v-slot:cell(actions)="data">
        <b-button
          size="sm"
          variant="outline-danger"
          @click="
            removeItem({
              seller_id: data.item.seller_id,
              product_id: data.item.product_id
            })
          "
          >Delete</b-button
        >
      </template>

      <template v-slot:cell(quantity)="data">
        <b-input-group size="sm">
          <b-form-input
            style="max-width:80px;min-width:50px"
            v-model="data.item.quantity"
            type="number"
          ></b-form-input>
          <b-button
            size="sm"
            @click="
              updateItem({
                product_id: data.item.product_id,
                seller_id: data.item.seller_id,
                quantity: data.item.quantity
              })
            "
            variant="info"
            :disabled="!!!data.item.quantity || 0 > data.item.quantity"
            >Update Qty</b-button
          >
        </b-input-group>
      </template>
    </b-table>
    <div>
      <b-row>
        <b-col></b-col>
        <b-col
          ><div class="d-flex justify-content-end">
            <h3>Total: ${{ this.head.total }}</h3>
          </div></b-col
        ></b-row
      >
      <b-row
        ><b-col>
          <div>
            <h4>Terms and Conditions</h4>
            <p class="font-weight-light">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis ...
            </p>
            <div class="d-flex justify-content-center">
              <b-form-checkbox
                id="checkbox-1"
                v-model="agreement"
                name="checkbox-1"
              >
                I accept the terms and conditions
              </b-form-checkbox>
            </div>
          </div></b-col
        ><b-col>
          <form-text-input
            uppercase
            alphanumeric
            label="Name"
            required
            type="text"
            maxlength="60"
            v-model="cart_owner"
          ></form-text-input>
          <b-button
            block
            @click="checkout"
            variant="outline-primary"
            :disabled="!!!this.cart_owner || this.details.length == 0"
            >Checkout cart</b-button
          ></b-col
        ></b-row
      >
    </div>
  </div>
</template>

<script>
import FormTextInput from "~/components/FormTextInput";
export default {
  components: { FormTextInput },
  data() {
    return {
      is_busy: false,
      item_added: false,
      agreement: true,
      cart_owner: "",
      head: {},
      details: [],
      fields: [
        "product_id",
        { key: "seller_id", class: "d-none d-lg-table-cell" },
        "product_name",
        { key: "description", class: "d-none d-lg-table-cell" },
        "quantity",
        "unit_price",
        "sub_total",
        { key: "actions", label: "" }
      ]
    };
  },
  methods: {
    async removeItem({ product_id, seller_id }) {
      await this.$axios.$delete("/api/cart", {
        data: { product_id, seller_id }
      });
      await this.refresh();
    },
    async refresh() {
      this.is_busy = true;
      try {
        const { head, details } = await this.$axios.$get("/api/cart");

        this.head = head;
        this.details = details;
      } catch (err) {
        //no cart.
      }
      this.is_busy = false;
    },
    async checkout() {
      await this.$axios.$post("/api/cart/checkout", {
        cart_owner: this.cart_owner
      });

      this.$router.push(`/cart/${this.head.cart_id}?checkout=1`);
    },
    async updateItem({ product_id, seller_id, quantity }) {
      if (quantity == 0) {
        await this.removeItem({ product_id, seller_id });
      } else {
        await this.$axios.$post("/api/cart/add", {
          product_id,
          seller_id,
          quantity
        });
      }
      await this.refresh();
    }
  },
  async created() {
    const { added = null } = this.$route.query;

    this.item_added = !!added;

    await this.refresh();
  }
};
</script>
