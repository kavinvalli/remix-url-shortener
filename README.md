# Remix URL Shortener
A simple URL shortener built using Remix using MySQL (you can change this in [prisma/schema.prisma](prisma/schema.prisma#L9-L10)).
## Setup
- Setup env variables:
```sh
cp .env.example .env
```
  > Edit the variables accordingly

- Install dependencies:
```sh
npm install
```
- Push to db
```sh
npx prisma db push
```
> Can use prisma migrations here but since it was only one table and a pretty small one, I decided to not use it

### Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

### Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

#### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`
