<template>
  <div>
    <b-alert variant="danger" :show="exists">Seller ID already taken.</b-alert>
    <seller-form new @save="onSave" />
  </div>
</template>

<script>
import SellerForm from "~/components/sellers/SellerForm";
export default {
  components: { SellerForm },
  data() {
    return { exists: false };
  },
  methods: {
    async idExists(seller_id) {
      try {
        await this.$axios.$get(`/api/seller/${seller_id}`);
        return true;
      } catch (err) {
        //returns 404 if not exists
        return false;
      }
    },
    async onSave(seller) {
      try {
        this.exists = await this.idExists(seller.seller_id);
        if (this.exists) return;
        console.log("das", this.exists);
        await this.$axios.$post(`/api/seller`, seller);
        this.$router.push(
          `/sellers/${seller.seller_id}?view=products&new_seller`
        );
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>
