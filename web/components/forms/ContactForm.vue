<template>
  <div>
    <div>
      <form-text-input
        label="Address"
        required
        type="text"
        maxlength="60"
        v-model="address"
        @feedback="setFeedback"
      ></form-text-input>
    </div>
    <div>
      <form-text-input
        label="City"
        required
        type="text"
        maxlength="15"
        v-model="city"
        @feedback="setFeedback"
      ></form-text-input>
    </div>
    <div>
      <form-text-input
        label="State"
        type="text"
        maxlength="15"
        v-model="state"
        @feedback="setFeedback"
      ></form-text-input>
    </div>
    <div>
      <country-select-input
        v-model="country"
        required
        maxlength="50"
        @feedback="setFeedback"
      ></country-select-input>
    </div>
    <div>
      <form-text-input
        label="Zip"
        type="text"
        maxlength="10"
        v-model="zip"
        @feedback="setFeedback"
      ></form-text-input>
    </div>
    <div v-if="!noPhone">
      <form-text-input
        label="Phone"
        required
        type="text"
        v-model="phone"
        @feedback="setFeedback"
      ></form-text-input>
    </div>
  </div>
</template>

<script>
import CountrySelectInput from "~/components/CountrySelectInput";
import FormTextInput from "~/components/FormTextInput";
export default {
  feedbacks: [],
  components: {
    CountrySelectInput,
    FormTextInput
  },
  fields() {
    const fields = ["address", "city", "state", "zip", "country", "phone"];
    return fields.reduce((acc, field) => {
      acc[field] = "";
      return acc;
    }, {});
  },
  props: {
    noPhone: { type: Boolean, default: false },
    value: {
      type: Object,
      default: function() {
        return this.$options.fields();
      }
    }
  },
  data() {
    const data = this.$_.pick(
      { ...this.$options.fields(), ...this.value },
      this.$_.keys(this.$options.fields())
    );
    return data;
  },
  methods: {
    setFeedback({ key, message }) {
      this.$options.feedbacks = this.$options.feedbacks.filter(
        p => p.key != key
      );
      this.$options.feedbacks.push({ key, message });
      this.$emit("feedbacks", this.$options.feedbacks);
    }
  },
  mounted() {
    this.$watch(
      vm => vm.$_.values(vm.$data),
      val => this.$emit("input", this.$data)
    );
  }
};
</script>
