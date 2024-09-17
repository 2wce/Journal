import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import dotenv from 'dotenv';
import { EnvironmentPlugin } from 'webpack';

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
  new EnvironmentPlugin({
    ...dotenv.config().parsed, // <-- this line
  }),
];
