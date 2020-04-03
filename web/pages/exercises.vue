<template>
  <div>
    <div class="my-3">
      <div>
        <h4>Search by Gender</h4>
        <b-form-input
          v-model="gender"
          placeholder="Enter gender here..."
          trim
        ></b-form-input>
      </div>
      <div class="pt-3">
        <ul>
          <template v-if="this.byGender.length == 0">
            Nothing found.
          </template>
          <li v-for="({ name }, i) in byGender" :key="i">
            {{ name }}
          </li>
        </ul>
      </div>
    </div>
    <div class="my-3">
      <div>
        <h4>Group by Department</h4>
      </div>
      <div class="pt-3">
        <ul>
          <template v-if="this.byDepartment.length == 0">
            Nothing found.
          </template>
          <li v-for="(department, i) in byDepartment" :key="i">
            {{ department }}
          </li>
        </ul>
      </div>
    </div>
    <div class="my-3">
      <div>
        <h4>Recursion</h4>
        <b-form-input
          v-model="input_number"
          type="number"
          placeholder="Enter number here..."
          trim
        ></b-form-input>
      </div>
      <div class="pt-3">output: {{ this.output_number }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const people = [
      {
        name: "Arisa",
        department: "BP",
        gender: "F"
      },
      {
        name: "Ham",
        department: "IT",
        gender: "F"
      },
      {
        name: "Alice",
        department: "IT",
        gender: "F"
      },
      {
        name: "Anna",
        department: "DA",
        gender: "F"
      },
      {
        name: "Larry",
        department: "Sales",
        gender: "M"
      },
      {
        name: "Ria",
        department: "Sales",
        gender: "F"
      },
      {
        name: "JD",
        department: "Sales",
        gender: "M"
      },
      {
        name: "Thor",
        department: "Sales",
        gender: "M"
      },
      {
        name: "Karl",
        department: "Sales",
        gender: "M"
      }
    ];

    return { people, gender: "M", input_number: 0 };
  },
  computed: {
    byGender() {
      return this.people.filter(
        p => p.gender.toUpperCase() == this.gender.toUpperCase()
      );
    },
    byDepartment() {
      const results = Array.from(
        new Set(this.people.map(p => p.department))
      ).map(department => ({
        department,
        people: this.people
          .filter(p => p.department == department)
          .map(p => p.name)
      }));
      return results;
    },
    output_number() {
      const recursor = input => {
        const sumAggr = input
          .toString()
          .split("")
          .map(d => Number(d))
          .reduce((acc, cur) => {
            return acc + Number(cur);
          }, 0);

        return sumAggr > 9 ? recursor(sumAggr) : sumAggr;
      };

      return recursor(this.input_number);
    }
  }
};
</script>

<style></style>
