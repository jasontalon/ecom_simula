<template>
  <div>
    <b-row>
      <b-col
        ><form-text-input
          uppercase
          no-spaces
          alphanumeric
          label="Seller ID"
          required
          v-model="seller_id"
          :readonly="!this.new"/>
        <form-text-input label="Company Name" v-model="company_name" required uppercase/>
        <form-text-input label="Contact Name" v-model="contact_name" required uppercase/>
        <form-text-input label="Email" v-model="email" required
      /></b-col>
      <b-col
        ><contact-form
          v-model="address"
          @feedbacks="value => value.forEach(setFeedback)"
      /></b-col>
    </b-row>
    <b-row>
      <b-col
        ><b-button
          block
          @click="save"
          variant="info"
          :disabled="this.feedbacks"          
          >Save</b-button
        ></b-col
      >
    </b-row>
  </div>
</template>

<script>
import FormTextInput from "~/components/FormTextInput";
import ContactForm from "~/components/forms/ContactForm";
export default {
  components: {
    FormTextInput,
    ContactForm
  },
  feedbacks: [],
  address() {
    return ["address", "city", "state", "country", "zip", "phone"].reduce(
      (acc, field) => {
        acc[field] = "";
        return acc;
      },
      {}
    );
  },
  seller() {
    return ["seller_id", "company_name", "contact_name", "email"].reduce(
      (acc, field) => {
        acc[field] = "";
        return acc;
      },
      {}
    );
  },
  props: {
    value: {
      type: Object,
      default: function() {
        return { ...this.$options.seller(), ...this.$options.address() };
      }
    },
    new: {
      type: Boolean,
      defalt: false
    }
  },
  data() {
    const _ = this.$_,
      value = _.isEmpty(this.value)
        ? { ...this.$options.seller(), ...this.$options.address() }
        : this.value,
      seller = _.pick(value, _.keys(this.$options.seller())),
      address = _.pick(value, _.keys(this.$options.address()));
    return {
      ...seller,
      address: { ...address },
      feedbacks: false
    };
  },
  methods: {
    setFeedback({ key, message }) {
      this.$options.feedbacks = this.$options.feedbacks.filter(
        p => p.key != key
      );
      if (message) this.$options.feedbacks.push({ key, message });
      this.feedbacks = this.$options.feedbacks.length > 0;

      this.$emit("update:feedbacks", this.$options.feedbacks);
    },
    save() {
      this.$emit("save", this.getData());
    },
    getData() {
      const _ = this.$_,
        data = JSON.parse(JSON.stringify(this.$data)),
        parsedData = {
          ..._.pick(data, _.keys(this.$options.seller())),
          ..._.pick(data.address, _.keys(this.$options.address()))
        };
      return parsedData;
    }
  },
  mounted() {
    this.$watch(
      vm => this.$_.values(this.getData()).join(),
      val => this.$emit("input", this.getData())
    );
  }
};
</script>
