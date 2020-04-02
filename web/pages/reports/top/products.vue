<template>
  <div>
    <h3>Top Products</h3>
    <b-table small striped hover :items="items"></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return { items: [] };
  },
  async created() {
    const results = await this.$axios.$get("/api/report/top/products");
    this.items = results;
  }
};
</script>

<style></style>
