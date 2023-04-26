<!-- eslint-disable indent -->
<template>
    <main>
        <section>
            <header>
                <h2>Login to StorifAI</h2>
            </header>
        </section>
        <div style="display: flex; justify-content: center"
            id="google-login-btn"
            v-google-identity-login-btn="{ clientId, locale:'en' }">
            Continue with Google
        </div>
        <section
          class="disclaimers">
          <h3>By continuing, you agree to the following:</h3>
          <li>The content generated from this site is solely for personal use and may not be used for commercial purposes without proper licensing or permission.</li>
          <li>You are responsible for ensuring that any generated content does not infringe on any intellectual property rights, including but not limited to copyright, trademarks, and publicity rights.</li>
          <li>You are aware that this tool may produce content that is not appropriate for all ages, and you are solely responsible for determining the appropriateness of the content for their audience.</li>
          <li>The tool may produce content that contains errors, inaccuracies, or omissions, and you assume all risk associated with using the tool and the resulting content.</li>
          <li>The developer of the tool assumes no liability for any damages arising from the use of the tool or the resulting content, including but not limited to direct, indirect, incidental, and consequential damages.</li>
      </section>
    </main>
</template>

<script>
import GoogleSignInButton from 'vue-google-identity-login-btn'

export default {
  name: 'LoginPage',
  components: {GoogleSignInButton},
  directives: {
    GoogleSignInButton
  },
  data () {
    return {
      clientId: 'INSERT PROJECT CLIENT_ID'
    }
  },
  watch: {
    '$store.state.userId': function () {
      if (this.$store.state.userId !== '') {
        this.$router.push({name: 'Home'})
      }
    }
  },
  methods: {
    onGoogleAuthSuccess (jwtCredentials) {
      const profileData = JSON.parse(atob(jwtCredentials.split('.')[1]))
      this.$store.commit('updateUserId', profileData.email)
      this.$store.commit('updateUniqueId', profileData.sub)
    }
  }
}
</script>

<style scoped>

.disclaimers {
    width: 50%;
    margin-left: auto;
    margin-right: auto;
    justify-content: center;
    height: 100%;
    text-align: center;
    align-self: center;
}

</style>
