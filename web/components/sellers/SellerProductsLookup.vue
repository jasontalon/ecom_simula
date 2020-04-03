<template>
  <div>
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
        <b-button
          block
          :to="'/sellers/' + this.sellerId + '/product/create'"
          variant="info"
          >Create</b-button
        ></b-col
      ></b-row
    >
    <b-row>
      <b-col>
        <b-table
          class="my-3"
          show-empty
          :busy="is_busy"
          small
          striped
          hover
          :items="products"
          :fields="fields"
          @sort-changed="sortingChanged"
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
          <template v-slot:cell(actions)="data">
            <b-button
              variant="outline-danger"
              size="sm"
              @click="deleteProduct(data.item.product_id)"
              >Delete</b-button
            ></template
          >
          <template v-slot:cell(product_id)="data">
            <b-button
              variant="link"
              :to="
                '/sellers/' +
                  data.item.seller_id +
                  '/product/' +
                  data.item.product_id
              "
              >{{ data.item.product_id }}</b-button
            >
          </template>
        </b-table>
        <div class="d-flex justify-content-end">
          <b-pagination
            class="ml-2"
            v-model="page"
            :total-rows="itemCount"
            :per-page="rows"
            @input="search"
          ></b-pagination>
        </div> </b-col
    ></b-row>
  </div>
</template>

<script>
import FormTextInput from "~/components/FormTextInput";
export default {
  components: { FormTextInput },
  props: {
    sellerId: {
      type: String,
      default: ""
    }
  },

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
        { key: "actions", sortable: false, label: "" }
      ],
      products: [],
      page: 1,
      rows: 100,
      order_by: "product_id asc",
      itemCount: 0
    };
  },

  async mounted() {
    if (!this.sellerId) return;
    await this.search();
  },
  methods: {
    async deleteProduct(product_id) {
      await this.$axios.$delete(
        `/api/seller/${this.sellerId}/product/${product_id}`
      );
      await this.search();
    },

    async search() {      
      this.is_busy = true;
      const seller_id = this.sellerId;
      const filter = {
          ...this.$_.pick(this.$data, [
            "product_id",
            "product_name",
            "description"
          ]),
          seller_id
        },
        paging = { page: this.page, rows: this.rows },
        order_by = this.order_by;

      const { results, count } = await this.$axios.$post(
        `api/seller/${seller_id}/product/filter`,
        {
          filter,
          paging,
          order_by
        }
      );

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
