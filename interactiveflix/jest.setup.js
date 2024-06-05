const { TextDecoder, TextEncoder } = require("text-encoding");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env.test.local" });

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;
