<template>
<section>
    <div v-if="this.images.length === 0">
        <section class="box-container">
            <p v-if="loading"
                class="centered">Loading...
            </p>
            <div class="empty-box">
                <p class="box-text">No image generated</p>
            </div>
            <div class="empty-box">
                <p class="box-text">No image generated</p>
            </div>
            <div class="empty-box">
                <p class="box-text">No image generated</p>
            </div>
            <div class="empty-box">
                <p class="box-text">No image generated</p>
            </div>
        </section>
    </div>
    <div v-if="this.images.length > 0">
        <section class="box-container">
            <p v-if="loading"
                class="centered">Loading...
            </p>
            <section class="box">
                <img
                    @click="imgClicked(0)"
                    class="box regular-image"
                    :style="{'box-shadow': selected[0] ? '0px 0px 10px 10px yellow' : ''}"
                    :src="images[0]"
                />
            </section>
            <section class="box">
                <img
                    @click="imgClicked(1)"
                    class="box regular-image"
                    :style="{'box-shadow': selected[1] ? '0px 0px 10px 10px yellow' : ''}"
                    :src="images[1]"/>
            </section>
            <section class="box">
                <img
                    @click="imgClicked(2)"
                    class="box regular-image"
                    :style="{'box-shadow': selected[2] ? '0px 0px 10px 10px yellow' : ''}"
                    :src="images[2]"/>
            </section>
            <section class="box">
                <img
                    @click="imgClicked(3)"
                    class="box regular-image"
                    :style="{'box-shadow': selected[3] ? '0px 0px 10px 10px yellow' : ''}"
                    :src="images[3]"/>
            </section>
        </section>
    </div>
</section>
</template>

<script>
/* eslint-disable */
// 'data:image/jpeg;base64,'
import imagesRef from '../../firebase/init'
export default {
    name: 'PictureDisplay',
    props: {
        // the published sentence from the previous page
        pageNum: {
            type: Number,
            required: false
        },
        changeCount: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            selected: [false, false, false, false], // top_left, top_right, bottom_left, bottom_right
            images: this.$store.state.pages[this.pageNum].allImages ? this.$store.state.pages[this.pageNum].allImages : [],
            loading: false,
            alerts: {}
        }
    },
    watch: {
        changeCount: async function() {
            // if there are no generated images but there is a sentence then we want to generate
            // if there are generated images but the sentence is different then we want to generate
            if (this.$store.state.currentSentence !== '') {
                this.generateImages();
                this.loading = true;
            } else {
                this.images = this.$store.state.pages[this.pageNum].allImages;
            }
        },
        pageNum (val) {
            this.images = this.$store.state.pages[val].allImages;
            this.selected = [false, false, false, false];
            if (this.$store.state.pages[val].selectedImage > -1) {
                this.selected[this.$store.state.pages[val].selectedImage] = true;
            }
        }
    },
    methods: {
        imgClicked(imgIndex) {
            this.selected = [false, false, false, false];
            this.selected[imgIndex] = true;
            this.$store.commit("refreshSelectedImage", {pageNum: this.pageNum, image: imgIndex});
        },
        generateImages() {
            const params = {
                method: 'POST',
                message: 'Successfully generated images',
                body: JSON.stringify({
                    prompt: 'An image that could be in a picture book of the following sentence: ' + this.$store.state.currentSentence,
                    n: 4,
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
                this.selected = [false, false, false, false];
                this.images = res.data.map(data_json => data_json.b64_json);
                this.$store.commit("refreshGeneratedImages", {pageNum: this.pageNum, images: this.images, imagesRef: imagesRef})
                const message = 'Successfully generated images!';
                this.$store.commit('alert', {
                    message: message, status: 'success'
                });
                this.images = this.$store.state.pages[this.pageNum].allImages;
                this.loading = false;
            } catch (e) {
                const message = 'There was an error fetching images';
                this.$store.commit('alert', {
                    message: message, status: 'error'
                });
                this.loading = false;
            }
        }
    }
}
</script>

<style scoped>

.box {
    display: inline-block;
    width: 209px;
    height: 209px;
    background-color: lightgray;
    border-radius: 25px;
}

.empty-box {
    display: inline-block;
    width: 209px;
    height: 209px;
    background-color: lightgray;
    border-radius: 25px;
    margin: 2.5px;
    text-align: center;
}

.box:hover {
    box-shadow: rgba(0, 0, 0, 0.2) 0 4px 12px;
    cursor:pointer;
}

.regular-image {
    object-fit: cover;
}

.box-text {
    text-align: center;
    font-size: 13px;
}

.box-container {
    float: left;
    width: 440px;
    align-items: center;
    text-align: center;
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