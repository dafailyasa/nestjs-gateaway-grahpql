import * as dotenv from 'dotenv';
dotenv.config();

export default () => {
  return {
    secretKey: process.env.SECRET_KEY,
    services: {
      userService: process.env.PORT_USER_SERVICE,
      homeService: process.env.PORT_HOME_SERVICE,
      bookingService: process.env.PORT_BOOKING_SERVICE,
    },
    graphql: {
      typePaths: process.env.GRAPHQL_TYPE_PATHS,
      playground: Boolean(JSON.parse(process.env.GRAPHQL_PLAYGROUND || '0')),
    },
  };
};
