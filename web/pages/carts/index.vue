<template>
  <div>
    <b-row>
      <b-col><h3>Cart List</h3></b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-table
          small
          striped
          hover
          :items="items"
          :fields="fields"
          @sort-changed="sortingChanged"
        >
          <template v-slot:cell(cart_id)="data">
            <b-link :to="'/cart/' + data.item.cart_id">{{
              data.item.cart_id
            }}</b-link>
          </template>
          <template v-slot:cell(checkout_at)="data">
            <template v-if="!!data.item.checkout_at">
              {{ data.item.checkout_at | utcToLocal }}
            </template>
          </template>
          <template v-slot:cell(created_at)="data">
            <template v-if="!!data.item.created_at">
              {{ data.item.created_at | utcToLocal }}
            </template>
          </template>
          <template v-slot:cell(updated_at)="data">
            <template v-if="!!data.item.updated_at">
              {{ data.item.updated_at | utcToLocal }}
            </template>
          </template>
          <template v-slot:cell(total)="data">
            {{ data.item.total | toCurrency }}
          </template>
        </b-table>
        <div class="d-flex justify-content-end">
          <b-pagination
            class="ml-2"
            v-model="page"
            :total-rows="itemCount"
            :per-page="rows"
            @input="refresh"
          ></b-pagination></div></b-col
    ></b-row>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      status: "",
      page: 1,
      order_by: "created_at desc",
      rows: 100,
      items: [],
      fields: [
        { key: "status", sortable: true, class: "" },
        { key: "cart_id", sortable: true, class: "d-none d-lg-table-cell" },
        { key: "cart_owner", sortable: true, class: "" },
        { key: "checkout_at", sortable: true, class: "text-right" },
        { key: "created_at", sortable: true, class: "text-right" },
        { key: "total", sortable: true, class: "text-right" }
      ],
      itemCount: 0
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
      const filter = { status: this.status },
        paging = { rows: this.rows, page: this.page },
        order_by = this.order_by;

      const { count, results } = await this.$axios.$post("/api/cart/filter", {
        filter,
        paging,
        order_by
      });
      this.itemCount = count;
      this.items = results.map(p => {
        if (p.status == "complete") return { ...p, _rowVariant: "success" };
        return p;
      });
    },
    async sortingChanged({ sortBy, sortDesc }) {
      const order = sortDesc ? "asc" : "desc";
      this.order_by = `${sortBy} ${order}`;
      await this.refresh();
    }
  },
  created() {
    this.refresh();
  }
};
</script>

<style></style>
