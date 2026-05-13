<template>
  <div class="footer-wrapper">
    <div class="footer-container">
      <!-- LEFT SIDE -->
      <div class="footer-left text-center">
        <img
          src="@/assets/images/pharmacare.png"
          alt="PharmaCare Group Logo"
          class="footer-logo"
        />
        <a
          href="https://pharmacaregroup.co.uk"
          target="_blank"
          class="footer-link mr-2"
        >
          pharmacaregroup.co.uk
        </a>
      </div>

      <!-- RIGHT SIDE -->
      <div class="footer-right">
        <p class="support-title">
          For support or to request a user guide,<br />
          please contact:
        </p>

        <div class="contact-item footer-link">
          <v-icon
            icon="mdi-phone-outline"
            size="small"
            class="mr-2 pt-1"
          ></v-icon
          ><a href="tel:03300430908">0330 043 0908</a>
        </div>

        <div class="contact-item footer-link">
          <v-icon
            icon="mdi-email-outline"
            size="small"
            class="mr-2 pt-2"
          ></v-icon>
          <a href="mailto:support@pharmacaregroup.co.uk">
            support@pharmacaregroup.co.uk
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.footer-wrapper {
  width: 100%;
  background-color: #f2f4f7; /* light grey like image */
  padding: 40px 20px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

/* LEFT SIDE */
.footer-left {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-logo {
  height: 50px;
  object-fit: contain;
}

.footer-link {
  color: #2e8b57; /* green tone like image */
  text-decoration: none !important;
  font-weight: 500;
}

.footer-link:hover {
  text-decoration: none !important;
  font-weight: bold;
}

/* RIGHT SIDE */
.footer-right {
  text-align: left;
  max-width: 350px;
}

.support-title {
  margin-bottom: 10px;
  font-weight: 600;
}
.contact-item {
  display: flex;
  font-size: 14px;
  text-decoration: none !important;
}
.contact-item a {
  display: block;
  color: #333;
  text-decoration: none !important;
  margin-bottom: 5px;
  font-weight: 500;
}

.contact-item a:hover {
  text-decoration: none !important;
  color: #2e8b57;
  font-weight: bold;
}

/* MOBILE RESPONSIVE */
@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    text-align: center;
    gap: 30px;
  }

  .footer-right {
    text-align: center;
  }
}
</style>
