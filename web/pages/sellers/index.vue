<template>
  <div>
    <b-row
      ><b-col><h3>Seller List</h3></b-col></b-row
    >
    <b-row>
      <b-col
        ><form-text-input label="ID" v-model="seller_id"></form-text-input
      ></b-col>
      <b-col
        ><form-text-input
          label="Company"
          v-model="company_name"
        ></form-text-input
      ></b-col>
      <b-col
        ><form-text-input
          label="Contact"
          v-model="contact_name"
        ></form-text-input
      ></b-col>
    </b-row>
    <b-row
      ><b-col
        ><b-button block @click="search" variant="outline-primary"
          >Search</b-button
        >
        <b-button block to="/sellers/create" variant="info"
          >Create</b-button
        ></b-col
      ></b-row
    >
    <b-row
      ><b-col
        ><b-table
          class="my-3"
          small
          striped
          hover
          :items="sellers"
          :fields="fields"
          @sort-changed="sortingChanged"
        >
          <template v-slot:cell(actions)="data">
            <b-button
              variant="outline-danger"
              size="sm"
              @click="deleteSeller(data.item.seller_id)"
              >Delete</b-button
            ></template
          >
          <template v-slot:cell(seller_id)="data">
            <b-button variant="link" :to="'/sellers/' + data.item.seller_id">{{
              data.item.seller_id
            }}</b-button>
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
  data() {
    return {
      seller_id: "",
      contact_name: "",
      company_name: "",
      fields: [
        { key: "seller_id", sortable: true },
        { key: "company_name", sortable: true },
        { key: "contact_name", sortable: true },
        { key: "actions", label: " ", sortable: false }
      ],
      sellers: [],
      page: 1,
      rows: 100,
      order_by: "seller_id asc",
      itemCount: 0
    };
  },
  methods: {
    async deleteSeller(seller_id) {
      await this.$axios.$delete(`/api/seller/${seller_id}`);
      this.search();
    },

    async search() {
      const filter = this.$_.pick(this.$data, [
          "seller_id",
          "contact_name",
          "company_name"
        ]),
        paging = { page: this.page, rows: this.rows },
        order_by = this.order_by;

      const { results, count } = await this.$axios.$post("api/seller/filter", {
        filter,
        paging,
        order_by
      });

      this.sellers = results;
      this.itemCount = count;
    },
    async sortingChanged({ sortBy, sortDesc }) {
      const order = sortDesc ? "asc" : "desc";
      this.order_by = `${sortBy} ${order}`;
      await this.search();
    }
  },
  async created() {
    await this.search();
  }
};
</script>

<style></style>
