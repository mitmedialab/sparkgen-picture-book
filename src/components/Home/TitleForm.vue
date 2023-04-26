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
        <div>
            <p>
                Visit
                <a href="https://platform.openai.com/account/api-keys">OpenAI</a>
                to obtain your OpenAI Api Key
            </p>
            <p>
                Visit
                <a href="https://console.firebase.google.com/">Google Firebase Storage</a>
                to create your own Firebase Storage
            </p>
        </div>
        <form @submit.prevent ="getEncryptedItems">
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
    </section>
</section>
</template>

<script>
/* eslint-disable */
import TitleImage from '@/components/Page/TitleImage.vue';

export default {
    name: 'TitleForm',
    components: {TitleImage},
    data() {
        return {
            draft: this.$store.state.currentTitle,
            generateImage: 0,
            password: this.$store.state.password,
            alerts: {},
            editing: false,
        }
    },
    mounted() {
        if (this.$store.state.userId && !this.password) {
            this.getEncryptedItems();
        }
    },
    methods: {
        getEncryptedItems() {
            const params = {
                        method: 'POST',
                        message: 'Successfully updated credentials',
                        body: JSON.stringify({
                            username: this.$store.state.userId
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
            const titleRegex = /^[A-Za-z0-9\s\-_,\.;:()]+$/
            if (titleRegex.test(this.draft) && this.draft.length <= 140) {
                this.$store.commit('changeTitle', this.draft);
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
</style>