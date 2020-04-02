<template>
  <div>
    <b-tabs content-class="mt-3" justified>
      <b-tab title="Seller Information" active>
        <h3>{{this.seller.company_name}} Information</h3>
        <seller-form :key="seller.seller_id" v-model="seller" @save="onSave"
      /></b-tab>
      <b-tab
        title="Seller's Products"
        :active="this.view == 'products'"
        dismissible
      >
        <h3>{{this.seller.company_name}} Product Information</h3>
        <b-alert variant="success" :show="new_seller"
          >You have successfully created a seller record. Next step is to input
          their products!</b-alert
        >
        <seller-products-lookup
          :key="seller.seller_id"
          :seller-id="seller.seller_id"
      /></b-tab>
    </b-tabs>
  </div>
</template>

<script>
import SellerForm from "~/components/sellers/SellerForm";
import SellerProductsLookup from "~/components/sellers/SellerProductsLookup";

export default {
  components: {
    SellerForm,
    SellerProductsLookup
  },
  data() {
    return {
      new_seller: false,
      view: "seller",
      feedbacks: [],
      seller: {}
    };
  },
  methods: {
    async onSave(seller) {
      try {
        await this.$axios.$put(`/api/seller/${seller.seller_id}`, seller);
        this.$router.push("/sellers");
      } catch (err) {
        console.log(err);
      }
    }
  },
  async created() {
    const { view } = this.$route.query;
    this.view = view;
    this.new_seller = Object.keys(this.$route.query).includes("new_seller");
    const seller_id = this.$route.params.id;

    const result = await this.$axios.$get(`/api/seller/${seller_id}`);

    this.seller = result;
  }
};
</script>
