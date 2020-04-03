<template>
  <div>
    <h3>Daily Sales</h3>
    <b-table small striped hover :items="items" show-empty :busy="is_busy">
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
      <template v-slot:cell(order_date)="data">
        {{ data.item.order_date | utcToLocal }}
      </template>
    </b-table>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return { is_busy: false, items: [] };
  },
  async created() {
    try {
      this.is_busy = true;
      const results = await this.$axios.$get("/api/report/daily-sales");
      this.items = results;
    } catch (err) {
      console.log(err);
    }
    this.is_busy = false;
  },
  filters: {
    utcToLocal: function(value) {
      return moment
        .utc(value)
        .local()
        .format("L");
    }
  }
};
</script>

<style></style>
