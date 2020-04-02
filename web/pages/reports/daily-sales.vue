<template>
  <div>
    <h3>Daily Sales</h3>
    <b-table small striped hover :items="items">
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
    return { items: [] };
  },
  async created() {
    const results = await this.$axios.$get("/api/report/daily-sales");
    this.items = results;
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
