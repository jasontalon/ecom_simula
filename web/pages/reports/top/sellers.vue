<template>
  <div>
    <h3>Top Sellers</h3>
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
      </template></b-table
    >
  </div>
</template>

<script>
export default {
  data() {
    return { is_busy: false, items: [] };
  },
  async created() {
    this.is_busy = true;
    try {
      const results = await this.$axios.$get("/api/report/top/sellers");
      this.items = results;
    } catch (err) {
      console.log(err);
    }
    this.is_busy = false;
  }
};
</script>

<style></style>
