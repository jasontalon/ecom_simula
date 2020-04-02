<template>
  <div>
    <b-row>
      <b-col>
        <b-alert variant="success" :show="checkout_success"
          >Checkout success!</b-alert
        >
        <h3>{{ this.head.cart_id }} Details</h3>
        <template v-if="this.head.status == 'complete'">
          <h4>Cart owner: {{ this.head.cart_owner }}</h4>
          <h4>Checkout at: {{ this.head.checkout_at | utcToLocal }}</h4>
        </template></b-col
      >
    </b-row>
    <b-row
      ><b-col>
        <b-table small :items="this.details" :fields="this.fields">
          <template v-slot:cell(unit_price)="data">
            {{ data.item.unit_price | toCurrency }}
          </template>
          <template v-slot:cell(sub_total)="data">
            {{ data.item.sub_total | toCurrency }}
          </template>
        </b-table>
      </b-col></b-row
    >
    <b-row
      ><b-col>
        <div class="d-flex justify-content-end">
          <h3>Total: ${{ this.head.total }}</h3>
        </div></b-col
      ></b-row
    >
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      checkout_success: false,
      head: {},
      details: [],
      fields: [
        "product_id",
        { key: "seller_id", class: "d-none d-lg-table-cell" },
        "product_name",
        { key: "description", class: "d-none d-lg-table-cell" },
        { key: "quantity", class: "text-right" },
        { key: "unit_price", class: "text-right" },
        { key: "sub_total", class: "text-right" },
        { key: "actions", label: "" }
      ]
    };
  },
  filters: {
    utcToLocal: function(value) {
      return moment
        .utc(value)
        .local()
        .format("L LT");
    },
    toCurrency: function(value) {
      var formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      });

      return formatter.format(value);
    }
  },
  methods: {
    async refresh() {
      const { cart_id } = this.$route.params;
      const { head, details } = await this.$axios.$get(`/api/cart/${cart_id}`);
      this.head = head;
      this.details = details;
    }
  },
  async created() {
    const { checkout = null } = this.$route.query;

    this.checkout_success = !!checkout;
    await this.refresh();
  }
};
</script>
