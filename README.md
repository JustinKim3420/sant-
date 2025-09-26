## How to start
### Docker
If you have Docker you can build the image using
`docker build . -t sante:jkim`
and then run the image using
`docker run -p 3000:3000 sante:jkim`
You can checkout the portal on localhost:3000

### Local IDE
You can also use `Node 22.19.0` and install the packages using `npm install`
Once installed you can run the portal using `npm run start` and see the portal on localhost:3000