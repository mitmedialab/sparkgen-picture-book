# picture-book

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## API Endpoints used

#### `POST https://api.openai.com/v1/completions` - Creates a completion for the provided prompt and parameters

**Body**

- `model` _{string}_ - ID of model to use
- `prompt` _{string/array}_ - The prompt(s) to generate completions for
- `temperature` _{number}_ - Sampling temperature to use. Higher means higher risks
- `max_tokens` _{integer}_ - Max number of tokens to generate in the completion
- `frequency_penalty` _{number}_ - Positive values penalize new tokens based on their existing frequency in the text so far
- `presence_penalty` _{number}_ - Positive values penalize new tokens based on whether they appear in the text so far

**Returns**

- An object containing the completion

## Deploy Site
Setup by following [Deploying Vue App to Github Pages](https://learnvue.co/articles/deploy-vue-to-github-pages) instructions.

    # build for production with minification
    npm run build

    # build for production and view the bundle analyzer report
    npm run build --report

    # update remote gh-pages and trigger GH actions to redeploy page
    git subtree push --prefix dist origin gh-pages