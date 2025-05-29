<template>
  <form @submit.prevent="handleSubmit">
    <h2>Create New Lead</h2>

    <label>
      First Name:
      <input v-model="formData.first_name" type="text" required />
    </label>

    <label>
      Last Name:
      <input v-model="formData.last_name" type="text" required />
    </label>

    <label>
      Email:
      <input v-model="formData.email" type="email" required />
    </label>

    <label>
      Phone:
      <input v-model="formData.phone" type="text" />
    </label>

    <label>
      Company:
      <input v-model="formData.company" type="text" />
    </label>

    <button type="submit" :disabled="loading">
      {{ loading ? "Submitting..." : "Submit" }}
    </button>

    <pre>{{ formData }}</pre>
  </form>
</template>

<script>
export default {
  name: "LeadForm",
  data() {
    return {
      formData: {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        company: "",
      },
      loading: false,
      zohoLoaded: true,
    };
  },
  methods: {
    async handleSubmit() {
      if (!this.zohoLoaded) {
        alert("Zoho SDK not loaded yet. Please try again.");
        return;
      }

      this.loading = true;

      const leadData = {
        First_Name: this.formData.first_name.trim(),
        Last_Name: this.formData.last_name.trim(),
        Email: this.formData.email.trim(),
        Phone: this.formData.phone.trim(),
        Company: this.formData.company.trim(),
      };

      try {
        const response = await window.ZOHO.CRM.API.insertRecord({
          Entity: "Leads",
          APIData: leadData,
          Trigger: ["workflow"],
        });

        console.log("Full response from Zoho CRM:", response);

        if (response.data && response.data[0].code === "SUCCESS") {
          alert(
            "✅ Lead created successfully! ID: " + response.data[0].details.id
          );
          // Clear form on success
          this.formData = {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            company: "",
          };
        } else {
          alert(
            "❌ Error occurred:\n" +
              JSON.stringify(response.data[0], null, 2)
          );
        }
      } catch (err) {
        console.error("❌ Exception thrown while creating lead:", err);
        alert("❌ Error while creating lead. Check console for details.");
      } finally {
        this.loading = false;
      }
    },
    loadZohoSDK() {
      return new Promise((resolve, reject) => {
        if (window.ZOHO) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src =
          "https://live.zwidgets.com/js-sdk/1.2/ZohoEmbededAppSDK.min.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Zoho SDK"));
        document.head.appendChild(script);
      });
    },
  },
  
  async mounted() {
    try {
      await this.loadZohoSDK();

      window.ZOHO.embeddedApp.init();

      window.ZOHO.embeddedApp.on("PageLoad", () => {
        this.zohoLoaded = true;
        console.log("Zoho embedded app loaded and ready.");
      });
    } catch (error) {
      console.error("Error loading Zoho SDK:", error);
      alert("Failed to load Zoho SDK. Please reload the page.");
    }
  }, 
};
</script>

<style scoped>
form {
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
input {
  padding: 8px;
  font-size: 16px;
}
button {
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}
button:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}
pre {
  background-color: #f4f4f4;
  padding: 10px;
  font-size: 14px;
}
</style>
