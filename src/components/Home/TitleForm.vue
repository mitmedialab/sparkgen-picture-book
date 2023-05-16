<template>
<section>
    <section
        v-if="$store.state.apikey != ''"
        class="title-area"
        :key="$store.state.measurementIdFirebase">
        <textarea v-if="editing || $store.state.titleImage == ''"
            class="title-content"
            :value="draft"
            @input="draft = $event.target.value"
        />
        <h1 class="title-font" v-if="!editing && $store.state.titleImage !== ''">
            {{ this.$store.state.currentTitle }}
        </h1>
        <button v-if="!editing && $store.state.titleImage !== ''"
            class="edit-button button-74"
            @click="editTitle">Edit Title Page
        </button>
        <button v-if="editing || $store.state.titleImage == ''"
            class="title-button button-74"
            @click="addTitle">Generate Image
        </button>
    </section>
    <section
        class="title-image"
        v-if="$store.state.apikey != ''"
        >
        <TitleImage
            :currentTitle="draft"
            :generateImage="generateImage"
            @titleEditing="titleEditing"
            v-if="editing || $store.state.titleImage == ''">
        </TitleImage>
    </section>

    <section
        v-if="$store.state.apikey == ''"
        class="api-area">
        <form @submit.prevent ="getEncryptedItems">
            <input
                class="title-content api-content"
                :value="username"
                type="text"
                @input="username = $event.target.value"
                maxlength="200"
                placeholder="Username"
                :required="true"
            />
            <input
                class="title-content api-content"
                :value="password"
                type="password"
                @input="password = $event.target.value"
                maxlength="200"
                placeholder="Enter your password"
                :required="true"
            />
            <button
                class="title-button button-74 api-button"
                type="submit"
                >Enter in your information
            </button>
        </form>

      <div class="disclaimers">
        <h3>By continuing, you agree to the following:</h3>
        <li>
          The content generated from this site is solely for personal use and
          may not be used for commercial purposes without proper licensing or
          permission.
        </li>
        <li>
          You are responsible for ensuring that any generated content does not
          infringe on any intellectual property rights, including but not
          limited to copyright, trademarks, and publicity rights.
        </li>
        <li>
          You are aware that this tool may produce content that is not
          appropriate for all ages, and you are solely responsible for
          determining the appropriateness of the content for their audience.
        </li>
        <li>
          The tool may produce content that contains errors, inaccuracies, or
          omissions, and you assume all risk associated with using the tool and
          the resulting content.
        </li>
        <li>
          The developer of the tool assumes no liability for any damages arising
          from the use of the tool or the resulting content, including but not
          limited to direct, indirect, incidental, and consequential damages.
        </li>
      </div>
    </section>
</section>
</template>

<script>
/* eslint-disable */
import TitleImage from '@/components/Page/TitleImage.vue';
import { throws } from 'assert';

export default {
    name: 'TitleForm',
    components: {TitleImage},
    data() {
        return {
            draft: this.$store.state.currentTitle,
            generateImage: 0,
            password: this.$store.state.password,
            editing: false,
        }
    },
    methods: {
        getEncryptedItems() {
            this.$store.commit('updateUserId', this.username);
            const params = {
                        method: 'POST',
                        message: 'Successfully updated credentials',
                        body: JSON.stringify({
                            username: this.username
                        }),
            };
            this.request(params);
        }, 
        async request(params) {
            const options = {
                method: params.method, headers: 
                {'Content-Type': 'application/json'}
            };
            if (params.body) {
                options.body = params.body;
            }
            
            try {
                const r = await fetch(`https://wall-e.media.mit.edu:3000/login`, options);
                if (!r.ok) {
                    console.log('error thrown');
                    const res = await r.json();
                    throw new Error(res.error);
                }
                
                const res = await r.json();
                if (res.success) {
                    const credential_info = JSON.parse(this.$CryptoJS.AES.decrypt(res.accountInfo, this.password).toString(this.$CryptoJS.enc.Utf8));
                    credential_info['password'] = this.password
                    this.$store.commit('addApiKey', credential_info);
                }
            } catch (e) {
                const message = 'There was an error fetching your credentials';
                this.$store.commit('alert', {
                    message: message, status: 'error'
                });
            }
        },
        addTitle() {
            const titleRegex = /[A-Za-z0-9 _.,!\"\'\/$]+/
            if (titleRegex.test(this.draft.trim()) && this.draft.trim().length <= 140) {
                this.$store.commit('changeTitle', this.draft.trim());
                this.generateImage += 1;
            } else {
                const message = 'Invalid title inputted';
                this.$store.commit('alert', {
                    message: message, status: 'error'
                });
                return;
            }
        },
        editTitle() {
            this.editing = true;
            this.$emit('titleEditing', true);
        },
        titleEditing() {
            this.editing = false;
            this.$emit('titleEditing', false);
        }
    }
}
</script>

<style scoped>

form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.title-area {
    display: flex;
    justify-content: center;
    height: 100px;
}
.api-area {
    display: flex;
    flex-direction: column;
    height: 100px;
    align-items: center;
}

.title-button {
    margin-left: 1em;
    line-height: 10px;
    font-size: 15px;
    height: 30px;
    margin-bottom: 3.6em;
}

.api-button {
    line-height: 25px;
}

.edit-button {
    margin-left: 1em;
    line-height: 1px;
    font-size: 15px;
    height: 30px;
    margin-bottom: 3.3em;
}

.title-content {
  width: 300px;
  height:50px;
  padding: 12px 20px;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  font-size: 16px;
  resize: none;
  margin-bottom: 3.3em;
}

.api-content {
    width: 500px;
    padding: 20px;
    margin-bottom: 2em;
}

.title-font {
    font-size: 30px;
    margin-top: 1px;
}

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