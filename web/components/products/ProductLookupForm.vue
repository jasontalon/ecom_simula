<template>
  <div>
    <h3>Product List</h3>
    <b-row>
      <b-col
        ><form-text-input label="ID" v-model="product_id"></form-text-input
      ></b-col>
      <b-col
        ><form-text-input
          label="Product Name"
          v-model="product_name"
        ></form-text-input
      ></b-col>
      <b-col
        ><form-text-input
          label="Description"
          v-model="description"
        ></form-text-input
      ></b-col>
    </b-row>
    <b-row
      ><b-col
        ><b-button block @click="search" variant="outline-primary"
          >Search</b-button
        >
      </b-col></b-row
    >
    <b-row>
      <b-col
        ><b-table
          class="my-3"
          :busy="is_busy"
          show-empty
          small
          striped
          hover
          :items="products"
          :fields="fields"
          @sort-changed="sortingChanged"
        >
          <template v-slot:cell(product_id)="data">
            <b-button
              variant="link"
              :to="
                '/products/' +
                  data.item.product_id +
                  '?seller_id=' +
                  data.item.seller_id
              "
              >{{ data.item.product_id }}</b-button
            >
          </template>
          <template v-slot:cell(unit_price)="data">
            {{ data.item.unit_price | toCurrency }}
          </template>
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
        </b-table>
        <div class="d-flex justify-content-end">
          <b-pagination
            class="ml-2"
            v-model="page"
            :total-rows="itemCount"
            :per-page="rows"
            @input="search"
          ></b-pagination></div
      ></b-col>
    </b-row>
  </div>
</template>

<script>
import FormTextInput from "~/components/FormTextInput";
export default {
  components: { FormTextInput },
  props: {},

  data() {
    return {
      is_busy: false,
      product_id: "",
      product_name: "",
      description: "",
      fields: [
        { key: "product_id", sortable: true },
        { key: "product_name", sortable: true },
        { key: "description", sortable: true },
        { key: "seller_id", sortable: true },
        { key: "unit_price", sortable: true, class: "text-right" },
        { key: "actions", sortable: false, label: "" }
      ],
      products: [],
      page: 1,
      rows: 100,
      order_by: "product_id asc",
      itemCount: 0
    };
  },

  async created() {
    await this.search();
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
  methods: {
    async deleteProduct(product_id) {
      await this.$axios.$delete(
        `/api/seller/${this.sellerId}/product/${product_id}`
      );
      this.search();
    },

    async search() {
      this.is_busy = true;      
      const filter = {
          ...this.$_.pick(this.$data, [
            "product_id",
            "product_name",
            "description"
          ])
        },
        paging = { page: this.page, rows: this.rows },
        order_by = this.order_by;

      const { results, count } = await this.$axios.$post(`api/product/filter`, {
        filter,
        paging,
        order_by
      });

      this.products = results;
      this.itemCount = count;
      this.is_busy = false;
    },
    async sortingChanged({ sortBy, sortDesc }) {
      const order = sortDesc ? "asc" : "desc";
      this.order_by = `${sortBy} ${order}`;
      await this.search();
    }
  }
};
</script>
