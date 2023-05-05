<template>
    <section
        class="title-image">
        <p v-if="loading"
            class="centered">Loading...
        </p>
        <div
            class="empty-box"
            v-if="image == ''">
            <p class="box-text">No image generated</p>
        </div>
        <section
            class="box"
            v-if="image != ''">
            <img
                class="box regular-image"
                :src="image"
            />
        </section>
        <button
            class="sentence-button button-74"
            @click="saveTitle">Save Title Page
        </button>
    </section>
</template>
<script>
/* eslint-disable */
import { imagesRef } from '../../firebase/init';
import { ref, uploadString, getDownloadURL } from 'firebase/storage'

export default {
    name: 'TitleImage',
    data() {
        return {
            loading: false,
            image: this.$store.state.titleImage,
        }
    },
    props: {
        currentTitle: {
            type: String,
            required: true
        },
        generateImage: {
            type: Number,
            required: true
        }
    },
    watch: {
        generateImage: async function() {
            if (this.currentTitle !== '') {
                this.generate();
                this.loading = true;
            }
        }
    },
    methods: {
        saveTitle() {
            if (this.image === '') {
                const message = 'You must select a title image before continuing';
                this.$store.commit('alert', {
                    message: message, status: 'error'
                });
                return;
            }
            this.$store.commit("refreshTitleImage", this.image);
            this.$emit('titleEditing', false);
        },
        generate() {
            const params = {
                method: 'POST',
                message: 'Successfully generated images',
                body: JSON.stringify({
                    prompt: 'An image that could be in a picture book of the following sentence: ' + this.$store.state.currentTitle,
                    n: 1,
                    size: '256x256',
                    response_format: 'b64_json',
                }),
            };
            this.request(params);
        },
        async request(params) {
            const options = {
                method: params.method, headers: 
                {'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.$store.state.apikey}`,
                'Access-Control-Allow-Origin': '*'}
            };
            if (params.body) {
                options.body = params.body;
            }
            
            try {
                const r = await fetch(`https://api.openai.com/v1/images/generations`, options);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }
                
                const res = await r.json();
                let images = res.data.map(data_json => data_json.b64_json);
                
                const storageId = new Date().getTime().toString();
                let newestRef = ref(imagesRef, storageId);
                newestRef = ref(newestRef, this.$store.state.userId);
                newestRef = ref(newestRef, new Date().toJSON());
                uploadString(newestRef, images, "base64").then(async (snapshot) => {
                    this.image = await getDownloadURL(snapshot.ref);
                    this.loading = false;
                    const message = 'Successfully generated images!';
                    this.$store.commit('alert', {
                        message: message, status: 'success'
                    });
                })
            } catch (e) {
                const message = 'There was an error fetching images';
                this.$store.commit('alert', {
                    message: message, status: 'error'
                });
            }
        }
    }
}
</script>
<style scoped>

.title-image {
    display: flex;
    flex-direction: column;
}
.empty-box {
    display: inline-block;
    width: 518px;
    height: 518px;
    background-color: lightgray;
    border-radius: 25px;
    margin: 2.5px;
    text-align: center;
}

.box-text {
    text-align: center;
    font-size: 13px;
}

.box {
    display: inline-block;
    width: 518px;
    height: 518px;
    background-color: lightgray;
    border-radius: 25px;
    text-align: center;
}

.regular-image {
    object-fit: cover;
}

.sentence-button {
    line-height: 40px;
    margin-top: 2em;
    font-size: 15px;
    width: 20em;
    margin-left: auto;
    margin-right: auto;
}

.centered {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color:black;
  font-weight: bolder;
  background-color: lightgray;
}
</style>
